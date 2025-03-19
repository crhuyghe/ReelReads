import os
import mysql.connector
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv("backend/connection.env")

# Database credentials
SQL_HOST = os.getenv("DB_HOST")
SQL_USER = os.getenv("DB_USER")
SQL_PASSWORD = os.getenv("DB_PASSWORD")
SQL_DATABASE = os.getenv("DB_NAME")

# Create a database connection
def get_connection():
    return mysql.connector.connect(
        host=SQL_HOST,
        user=SQL_USER,
        password=SQL_PASSWORD,
        database=SQL_DATABASE
    )


