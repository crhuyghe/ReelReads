import mysql.connector
import argon2
from argon2 import PasswordHasher
from backend.connection_database import get_connection
from flask import jsonify
import json

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
            duplicate_check = ("SELECT 1 FROM watch_read_list_table WHERE user_id = %s AND movie_id = %s")
            cursor.execute(duplicate_check, (user_id, identifier))
            dupe = cursor.fetchone()
            if dupe:
                print("DUPLICATE ENTRY! YOU ALREADY HAVE THIS MOVIE!!!")
                return {"success": False, "error": "Duplicate entry: This movie is already in the list."}
            insert_query = ("INSERT INTO watch_read_list_table (user_id, movie_id, user_rating) VALUES (%s, %s, %s)")
            values = (user_id, identifier, user_rating)
        else:
            duplicate_check = ("SELECT 1 FROM watch_read_list_table WHERE user_id = %s AND isbn = %s")
            cursor.execute(duplicate_check, (user_id, identifier))
            dupe = cursor.fetchone()
            if dupe:
                print("DUPLICATE ENTRY! YOU ALREADY HAVE THIS BOOK!!!")
                return {"success": False, "error": "Duplicate entry: This book is already in the list."}
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

def insert_update_into_watch_read_list(user_id, user_rating, identifier, content_type):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        if content_type == "movie":
            update_query = """
                UPDATE watch_read_list_table
                SET user_rating = %s
                WHERE user_id = %s AND movie_id = %s
            """
            insert_query = """
                INSERT INTO watch_read_list_table (user_id, movie_id, user_rating)
                VALUES (%s, %s, %s)
            """
            update_values = (user_rating, user_id, identifier)
            insert_values = (user_id, identifier, user_rating)

        else:  # content_type == "book"
            update_query = """
                UPDATE watch_read_list_table
                SET user_rating = %s
                WHERE user_id = %s AND isbn = %s
            """
            insert_query = """
                INSERT INTO watch_read_list_table (user_id, isbn, user_rating)
                VALUES (%s, %s, %s)
            """
            update_values = (user_rating, user_id, identifier)
            insert_values = (user_id, identifier, user_rating)

        # First try to update
        cursor.execute(update_query, update_values)
        conn.commit()

        if cursor.rowcount == 0:
            # No existing row found, insert new one
            cursor.execute(insert_query, insert_values)
            conn.commit()
            print("Inserted new record.")
            return {"success": True, "action": "inserted", "rows_affected": 1}

        else:
            print("Updated existing record.")
            return {"success": True, "action": "updated", "rows_affected": cursor.rowcount}

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

    finally:
        cursor.close()
        conn.close()

def select_watch_read_list(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        print(user_id)

        select_query = ("SELECT isbn, movie_id FROM watch_read_list_table WHERE user_id = %s AND user_rating IS NULL")
        values = (user_id,)

        cursor.execute(select_query, values)
        fetched_list_data = cursor.fetchall()
        print("select query results:", fetched_list_data)
        return fetched_list_data

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

def delete_watch_read_list(user_id, identifier, content_type):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        if content_type == "movie":
            cursor.execute("SELECT * FROM watch_read_list_table WHERE user_id = %s AND movie_id = %s", (user_id, identifier))
            result = cursor.fetchall()
            print("Records found before delete:", result)
            delete_query = "DELETE FROM watch_read_list_table WHERE user_id = %s AND movie_id = %s"
            print("Delete successful!:", delete_query)
            values = (user_id, int(identifier))
        else:
            cursor.execute("SELECT * FROM watch_read_list_table WHERE user_id = %s AND isbn = %s", (user_id, identifier))
            result = cursor.fetchall()
            print("Records found before delete:", result)
            delete_query = "DELETE FROM watch_read_list_table WHERE user_id = %s AND isbn = %s"
            print("Delete successful!:", delete_query)
            values = (user_id, str(identifier))

        cursor.execute(delete_query, values)
        conn.commit()
        print("Rows affected:", cursor.rowcount)
        return {"success": True, "rows_affected": cursor.rowcount}

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

    finally:
        cursor.close()
        conn.close()

def update_watch_read_list(user_id, user_rating, identifier, content_type):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        if content_type == "movie":
            update_query = "UPDATE watch_read_list_table SET user_rating = %s WHERE user_id = %s AND movie_id = %s"
        else:
            update_query = "UPDATE watch_read_list_table SET user_rating = %s WHERE user_id = %s AND isbn = %s"

        values = (user_rating, user_id, identifier)
        cursor.execute(update_query, values)
        conn.commit()
        print("Update successful!")
        return {"success": True, "rows_affected": cursor.rowcount}

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

    finally:
        cursor.close()
        conn.close()

def select_library(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        print(user_id)

        select_query = ("SELECT isbn, movie_id FROM watch_read_list_table WHERE user_id = %s AND user_rating IS NOT NULL")
        values = (user_id,)

        cursor.execute(select_query, values)
        fetched_list_data = cursor.fetchall()
        print("select query results:", fetched_list_data)
        return fetched_list_data

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}


def insert_user_history(user_id, user_history):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        #vectors = json.dumps(user_vector)
        history_dic = json.dumps(user_history)

        history_query = ("INSERT INTO user_pref_table (user_id, user_history) VALUES (%s, %s) ON DUPLICATE KEY UPDATE user_history = VALUES(user_history)")

        cursor.execute(history_query, (user_id, history_dic))
        conn.commit()
        return {"success": True}

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

    finally:
        cursor.close()
        conn.close()


def insert_user_vector(user_id, user_vector):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        vectors = json.dumps(user_vector)
        #history_dic = json.dumps(user_history)

        vector_query = ("INSERT INTO user_pref_table (user_id, user_vector) VALUES (%s, %s) ON DUPLICATE KEY UPDATE user_vector = VALUES(user_vector)")

        cursor.execute(vector_query, (user_id, vectors))
        conn.commit()
        return {"success": True}

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

    finally:
        cursor.close()
        conn.close()


def update_user_history(user_id, user_history):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        #vectors = json.dumps(user_vector)
        history_dic = json.dumps(user_history)

        update_history_query = ("INSERT INTO user_pref_table (user_id, user_history) VALUES (%s, %s) ON DUPLICATE KEY UPDATE user_history = VALUES(user_history)")

        cursor.execute(update_history_query, (user_id, history_dic))
        conn.commit()
        return {"success": True}

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

    finally:
        cursor.close()
        conn.close()


def update_user_vector(user_id, user_vector):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        vectors = json.dumps(user_vector)
        #history_dic = json.dumps(user_history)

        update_vector_query = ("INSERT INTO user_pref_table (user_id, user_vector) VALUES (%s, %s) ON DUPLICATE KEY UPDATE user_vector = VALUES(user_vector)")

        cursor.execute(update_vector_query, (user_id, vectors))
        conn.commit()
        return {"success": True}

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

    finally:
        cursor.close()
        conn.close()


def get_user_history(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        get_history_query = ("SELECT user_history FROM user_pref_table WHERE user_id = %s")
        cursor.execute(get_history_query, (user_id,))
        result = cursor.fetchone()

        if result:
            return json.loads(result[0])
        else:
            return {}

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {}

    finally:
        cursor.close()
        conn.close()

def get_user_vector(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        get_vector_query = ("SELECT user_vector FROM user_pref_table WHERE user_id = %s")
        cursor.execute(get_vector_query, (user_id,))
        result = cursor.fetchone()

        if result:
            return json.loads(result[0])
        else:
            return {}

    except mysql.connector.Error as error:
        conn.rollback()
        print(f"Error: {error}")
        return {}

    finally:
        cursor.close()
        conn.close()

def update_user_info(user_id, user_vec, user_history):
    pass

def get_user_library_watch_read_items(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        get_watch_read_list_query = """
            SELECT movie_id, isbn, user_rating
            FROM watch_read_list_table
            WHERE user_id = %s AND user_rating IS NOT NULL
        """
        cursor.execute(get_watch_read_list_query, (user_id,))
        rows = cursor.fetchall()

        result = {
            "movie": {},
            "book": {}
        }

        for movie_id, isbn, rating in rows:
            if movie_id is not None:
                result["movie"][movie_id] = float(rating)
            elif isbn is not None:
                result["book"][isbn] = float(rating)

        return result

    except mysql.connector.Error as error:
        print(f"Error: {error}")
        return {"success": False, "error": str(error)}

    finally:
        cursor.close()
        conn.close()








# x = get_user_library_watch_read_items(1)
# print(x)

# result = insert_user_history(1, x)

# vectored = [0.12] * 384
# hello = insert_user_vector(1, vectored)
# print(hello)


'''
updated = {
    "movie": {
        671: 4.0,
        672: 4.0
    },
    "book": {
        "045146155X": 4.0,
        "1551924560": 4.0
    }
}

updated_vector = [0.1234] * 384

result1 = update_user_history(1, updated)
result2 = update_user_vector(1, updated_vector)

print(result1)
print(result2)
'''

'''
movies = insert_into_watch_read_list(1, 5.0, 5, "movie")
print(movies)
books = insert_into_watch_read_list(1, 4.5, '0007273746', "book")
print(books)
'''
'''
update_movie = update_watch_read_list(1, 4.8, 5, "movie")
print(update_movie)
update_book = update_watch_read_list(1, 4.9, '0007273746', "book")
print(update_book)
'''
'''
delete_movie = delete_watch_read_list(1, 5, "movie")
print(delete_movie)
delete_book = delete_watch_read_list(1, '0007273746', "book")
print(delete_book)
'''




'''
movies = get_movies_by_id([5, 6, 11])
print(movies)
print('---------------------------------------------------------------------')
print('---------------------------------------------------------------------')
books = get_books_by_isbn(['0007273746', '0007276885'])
print(books)
'''
