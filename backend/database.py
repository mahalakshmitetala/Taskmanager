from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL"))
db = client["taskapp"]

users_collection = db["users"]
tasks_collection = db["tasks"]