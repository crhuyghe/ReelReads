import mysql.connector
import argon2
from argon2 import PasswordHasher
from connection_database import get_connection

#cursor.execute()
ph = argon2.PasswordHasher(
    time_cost=3,  # Number of iterations
    memory_cost=65536,  # Memory usage in KiB
    parallelism=4,  # Number of parallel threads
    hash_len=32,  # Length of the hash in bytes
    salt_len=16  # Length of the salt in bytes
)

# Insert a username, hashed pasword, and auto increment a user_id
def create_new_user(username, password):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        errors = []
        passwd_check = check_password_minumum(password)

        if passwd_check == "1":
            print("Password must be at least 10 characters long!")
            errors.append("length")
        if passwd_check == "2":
            print("Password must include at least one lowercase letter!")
            errors.append("lowercase")
        if passwd_check == "3":
            print("Password must include at least one uppercase letter!")
            errors.append("uppercase")
        if passwd_check == "4":
            print("Password must include at least one digit!")
            errors.append("number")
        if passwd_check == "5":
            print("Password must include at least one special symbol!")
            errors.append("symbol")
        if passwd_check == "6":
            print("Valid Password!")

        if errors:
            return {"success": False, "error_codes": errors}


        hashed_passwd = ph.hash(password)

        login_query = ("INSERT INTO user_login_table (username, password) VALUES (%s, %s)")
        values = (username, hashed_passwd)

        cursor.execute(login_query, values)
        conn.commit()
        print("Successfully created account!")
        return {"success": True, "message": "Successfully created account!"}

    # This will catch integrity errors such as duplicate usernames 
    except mysql.connector.IntegrityError:
        conn.rollback() 
        print(f"Error: the username '{username}' already exists!")
        return {"success": False, "error_codes": "[username_exists]"} 
    
    cursor.close()
    conn.close()

def check_password_minumum(password):
    # Password must be at least 10 characters long.
    if len(password) < 10:
        return "1"
    # Password must include at least one lowercase letter.
    if not any(char.islower() for char in password):
        return "2"
    # Password must include at least one uppercase letter.
    if not any(char.isupper() for char in password):
        return "3"
    # Password must include at least one digit.
    if not any(char.isdigit() for char in password):
        return "4"
    # Password must include at least one special symbol.
    if not any(not char.isalnum() for char in password):
        return "5"

    # ALL CRITERIA MET
    return "6"

# Will validate the username and password, while also getting the user_if for tracking!
def validate_user_login(username, password):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        # Query to get the user_id and hashed password
        check_login_query = ("SELECT user_id, password FROM user_login_table WHERE username = %s")
        value = (username,)
        cursor.execute(check_login_query, value)
        check_result = cursor.fetchone()

        # This is where the user_id and hashed_password are retrieved from
        if check_result:
            user_id, hashed_passwd = check_result
        else:
            print("Incorrect Username!")  
            return
        
        # Argon2 verifying the hashed password with the plaintext password
        try:
            valid = ph.verify(hashed_passwd, password)
            if valid:
                print(f"Login success for User ID: {user_id}")
                return user_id
        except argon2.exceptions.VerifyMismatchError:
            print("Incorrect Password! Try Again!")
            return

    # Handles errors that might happen
    except mysql.connector.Error as error:
        print(f"Error: {error}")
        return
    
    cursor.close()
    conn.close()
 
        