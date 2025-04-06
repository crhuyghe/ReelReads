from flask import Flask, request, jsonify
from flask_cors import CORS  # cross-origin requests

from backend.RecommendationManager import RecommendationManager
from backend.database_func import create_new_user, validate_user_login, get_books_by_isbn, get_movies_by_id, \
    get_user_vector, get_user_history, insert_into_watch_read_list, select_watch_read_list, delete_watch_read_list, \
    update_watch_read_list, select_library, insert_update_into_watch_read_list, update_user_history, update_user_info
from backend.ImageAcquisition import handle_book_search, handle_movie_search
from backend.Movie_Book_Quiz import get_quizzes


app = Flask(__name__)
rm = RecommendationManager()
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    # JSON data from frontend request
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user_id = validate_user_login(username, password)

    if user_id:
        return jsonify({"message": "Login successful", "user_id": user_id}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 400

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    result,_ = create_new_user(username, password)
    print(result)
    if isinstance(result, dict) and not result.get("success"):
        print(f"you got in the if")
        return jsonify(result), 201
    print(result.get("user_id"))
    return jsonify({"success": True, "message": "Account successfully created!", "user_id": result.get("user_id")}), 201

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('searchQuery')

    rec_ids = rm.search_by_query(query, 25)
    fetched_movie_data = get_movies_by_id(rec_ids[0]["id"].values.tolist())
    fetched_book_data = get_books_by_isbn(rec_ids[1]["ISBN"].values.tolist())

    for movie in fetched_movie_data:
        movie["type"] = "movie"
        movie["image"] = handle_movie_search(movie["imdb_id"])

    for book in fetched_book_data:
        book["type"] = "book"
        book_info = handle_book_search(book["isbn"])
        if book_info:
            book["image"] = book_info["thumbnail"]
            book["genre"] = book_info["genre"]
        else:
            book["image"] = None
            book["genre"] = None

    fetched_data = fetched_book_data + fetched_movie_data
    if fetched_movie_data or fetched_book_data:
        return jsonify({"message": "Fetch Successful", "fetched_data": fetched_data}), 200
    else:
        return jsonify({"message": "No recommendations found"}), 400

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = data.get('userId')

    user_vec = get_user_vector(user_id)
    user_history = get_user_history(user_id)

    rec_ids = rm.get_recommendations(user_vec, user_history, 25)
    fetched_movie_data = get_movies_by_id(rec_ids[0]["id"].values.tolist())
    fetched_book_data = get_books_by_isbn(rec_ids[1]["ISBN"].values.tolist())

    for movie in fetched_movie_data:
        movie["type"] = "movie"
        movie["image"] = handle_movie_search(movie["imdb_id"])

    for book in fetched_book_data:
        book["type"] = "book"
        book_info = handle_book_search(book["isbn"])
        if book_info:
            book["image"] = book_info["thumbnail"]
            book["genre"] = book_info["genre"]
        else:
            book["image"] = None
            book["genre"] = None

    fetched_data = fetched_book_data + fetched_movie_data
    if fetched_movie_data or fetched_book_data:
        return jsonify({"message": "Fetch Successful", "fetched_data": fetched_data}), 200
    else:
        return jsonify({"message": "No recommendations found"}), 400

@app.route('/addList', methods=['POST'])
def addList():
    data = request.get_json()
    user_id = data.get("userId")
    content_type = data.get("type")
    identifier = data.get("identifier")
    return insert_into_watch_read_list(user_id, None, identifier, content_type), 200

@app.route('/grabList', methods=["POST"])
def grabList():
    data = request.get_json()
    user_id = data.get("userId")
    print("app.py", user_id)
    identifiers = select_watch_read_list(user_id)

    movie_ids, isbns = process_identifiers(identifiers)

    fetched_movie_data = get_movies_by_id(movie_ids) if movie_ids else []
    fetched_book_data = get_books_by_isbn(isbns) if isbns else []

    fetched_data = fetched_book_data + fetched_movie_data
    if fetched_movie_data or fetched_book_data:
        return jsonify({"message": "Fetch Successful", "fetched_data": fetched_data}), 200
    else:
        return jsonify({"message": "No recommendations found"}), 400

def process_identifiers(identifiers):
    movie_ids = []
    isbns = []

    for isbn, movie_id in identifiers:
        if isbn is None:
            movie_ids.append(movie_id)  # Collect movie IDs
        elif movie_id is None:
            isbns.append(isbn)  # Collect ISBNs

    return movie_ids, isbns

@app.route('/removeList', methods=['POST'])
def removeList():
    data = request.get_json()
    user_id = data.get("userId")
    content_type = data.get("type")
    identifier = data.get("identifier")
    print("testing: ", user_id, identifier, content_type)
    return delete_watch_read_list(user_id, identifier, content_type)

@app.route('/addLib', methods=['POST'])
def addLib():
    data = request.get_json()
    user_id = data.get("userId")
    user_rating = data.get("rating")
    content_type = data.get("type")
    identifier = data.get("identifier")

    user_vector = get_user_vector(user_id)
    user_history = get_user_history(user_id)

    user_vector = rm.update_user_vector(user_vector, identifier, content_type, user_rating)
    user_history[content_type][identifier] = user_rating

    update_user_info(user_id, user_vector, user_history)

    return insert_update_into_watch_read_list(user_id, user_rating, identifier, content_type), 200

@app.route('/updateLib', methods=['POST'])
def updateLib():
    data = request.get_json()
    user_id = data.get("userId")
    user_rating = data.get("rating")
    content_type = data.get("type")
    identifier = data.get("identifier")

    user_vector = get_user_vector(user_id)
    user_history = get_user_history(user_id)

    user_vector = rm.update_user_vector(user_vector, identifier, content_type, user_rating)
    user_history[content_type][identifier] = user_rating

    update_user_info(user_id, user_vector, user_history)

    return update_watch_read_list(user_id, user_rating, identifier, content_type)

@app.route('/grabLib', methods=['POST'])
def grabLib():
    data = request.get_json()
    user_id = data.get("userId")
    print("app.py", user_id)
    identifiers = select_library(user_id)

    movie_ids, isbns = process_identifiers(identifiers)

    fetched_movie_data = get_movies_by_id(movie_ids) if movie_ids else []
    fetched_book_data = get_books_by_isbn(isbns) if isbns else []

    fetched_data = fetched_book_data + fetched_movie_data
    if fetched_movie_data or fetched_book_data:
        return jsonify({"message": "Fetch Successful", "fetched_data": fetched_data}), 200
    else:
        return jsonify({"message": "No recommendations found"}), 400

def process_identifiers(identifiers):
    movie_ids = []
    isbns = []

    for isbn, movie_id in identifiers:
        if isbn is None:
            movie_ids.append(movie_id)  # Collect movie IDs
        elif movie_id is None:
            isbns.append(isbn)  # Collect ISBNs

    return movie_ids, isbns

@app.route('/grabQuiz', methods=['POST'])
def grabQuiz():
    fetched_quiz = get_quizzes()
    return jsonify({"fetched_quiz": fetched_quiz})


# Run Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)
