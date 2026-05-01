from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from database import tasks_collection
from models import TaskCreate, TaskUpdate
from auth import decode_token
from bson import ObjectId

router = APIRouter(prefix="/api/v1/tasks", tags=["Tasks"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload

@router.get("/")
def get_tasks(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") == "admin":
        tasks = list(tasks_collection.find())
    else:
        tasks = list(tasks_collection.find({"user_id": current_user["sub"]}))
    for t in tasks:
        t["id"] = str(t["_id"])
        del t["_id"]
    return tasks

@router.post("/")
def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    new_task = {
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "user_id": current_user["sub"],
        "user_email": current_user["email"]
    }
    result = tasks_collection.insert_one(new_task)
    return {"id": str(result.inserted_id), "message": "Task created"}

@router.put("/{task_id}")
def update_task(task_id: str, task: TaskUpdate, current_user: dict = Depends(get_current_user)):
    existing = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.get("role") != "admin" and existing["user_id"] != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Not allowed")
    update_data = {k: v for k, v in task.dict().items() if v is not None}
    tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": update_data})
    return {"message": "Task updated"}

@router.delete("/{task_id}")
def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    existing = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.get("role") != "admin" and existing["user_id"] != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Not allowed")
    tasks_collection.delete_one({"_id": ObjectId(task_id)})
    return {"message": "Task deleted"}

@router.get("/admin/all")
def admin_get_all_tasks(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    
    tasks = list(tasks_collection.find())
    for t in tasks:
        t["id"] = str(t["_id"])
        del t["_id"]
    return tasks