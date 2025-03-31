import mysql.connector
import argon2
from argon2 import PasswordHasher
from backend.connection_database import get_connection
from flask import jsonify

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
            return({"success": False})
        if passwd_check == "2":
            print("Password must include at least one lowercase letter!")
            return({"success": False})
        if passwd_check == "3":
            print("Password must include at least one uppercase letter!")
            return({"success": False})
        if passwd_check == "4":
            print("Password must include at least one digit.")
            return({"success": False})
        if passwd_check == "5":
            print("Password must include at least one special symbol!")
            return({"success": False})
        if passwd_check == "6":
            print("Valid Password!")


        hashed_passwd = ph.hash(password)

        login_query = ("INSERT INTO user_login_table (username, password) VALUES (%s, %s)")
        values = (username, hashed_passwd)
    
        cursor.execute(login_query, values)
        conn.commit()
        print("Successfully created account!")
        user_query = ("SELECT user_id FROM user_login_table WHERE username = %s")
        value = (username,)
        cursor.execute(user_query, value)
        user_id = cursor.fetchone()
        return ({"success": True, 'user_id': user_id[0]}), 201

    # This will catch integrity errors such as duplicate usernames
    except mysql.connector.IntegrityError:
        conn.rollback()
        print(f"Error: the username '{username}' already exists!")
        return ({"success": False, "error_codes": "[username_exists]"})

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

# Will validate the username and password, while also getting the user_id for tracking!
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

def get_user_vector(user_id):
    pass

def get_user_history(user_id):
    pass


def get_books_by_isbn(isbn):
    if not isbn:
        return 

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Query makes it possible to get multiple movie_id's
    get_books_query = (f"SELECT isbn, book_name, author, publication_date, description, book_rating, book_rating_count, publisher FROM books_table WHERE isbn IN ({', '.join(['%s'] * len(isbn))})")
    
    cursor.execute(get_books_query, tuple(isbn))
    fetched_book_data = cursor.fetchall()

    cursor.close()
    conn.close()
    return fetched_book_data


def get_movies_by_id(movie_id):
    if not movie_id:
        return

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Query makes it possible to get multiple isbn's
    get_movies_query = (f"SELECT movie_id, imdb_id, title, genre, release_date, movie_rating, movie_rating_count, description, runtime FROM movies_table WHERE movie_id IN ({', '.join(['%s'] * len(movie_id))})")
    
    cursor.execute(get_movies_query, tuple(movie_id))
    fetched_movie_data = cursor.fetchall()

    cursor.close()
    conn.close()
    return fetched_movie_data

def insert_into_watch_read_list(user_id, user_rating, identifier, content_type):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        if content_type == "movie":
            insert_query = ("INSERT INTO watch_read_list_table (user_id, movie_id, user_rating) VALUES (%s, %s, %s)")
            values = (user_id, identifier, user_rating)
        else:
            insert_query = ("INSERT INTO watch_read_list_table (user_id, isbn, user_rating) VALUES (%s, %s, %s)")
            values = (user_id, identifier, user_rating)

        cursor.execute(insert_query, values)
        conn.commit()
        print("Insert successful!")
        return {"success": True, "rows_affected": cursor.rowcount}

    except mysql.connector.Error as error:
        conn.rollback() 
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

    finally:
        cursor.close()
        conn.close()

def select_watch_read_list(user_id):
    #SELECT QUERY! I need the identifier and type back
    print()






'''
movies = get_movies_by_id([5, 6, 11])
print(movies)
print('---------------------------------------------------------------------')
print('---------------------------------------------------------------------')
books = get_books_by_isbn(['0007273746', '0007276885'])
print(books)
'''