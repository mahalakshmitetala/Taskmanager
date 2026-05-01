from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from database import users_collection
from models import UserRegister, UserLogin
from auth import hash_password, verify_password, create_access_token, decode_token
from bson import ObjectId

router = APIRouter(prefix="/api/v1/users", tags=["Users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload

def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return current_user

@router.post("/register")
def register(user: UserRegister):
    existing = users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user.password)
    role = "user"  
    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed,
        "role": role
    })
    return {"message": f"User registered successfully as {role}"}

@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({
        "sub": str(db_user["_id"]),
        "email": db_user["email"],
        "role": db_user["role"],
        "name": db_user["name"]
    })
    return {"access_token": token, "token_type": "bearer", "role": db_user["role"], "name": db_user["name"]}

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get("/all-users")
def get_all_users(current_user: dict = Depends(require_admin)):
    users = list(users_collection.find({}, {"password": 0}))
    for u in users:
        u["id"] = str(u["_id"])
        del u["_id"]
    return users