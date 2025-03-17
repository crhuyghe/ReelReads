from flask import Flask, request, jsonify
from flask_cors import CORS  # cross-origin requests

from backend.RecommendationManager import RecommendationManager
from backend.database_func import create_new_user, validate_user_login, get_books_by_isbn, get_movies_by_id

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

    result = create_new_user(username, password)
    print(result)
    if isinstance(result, dict) and not result.get("success"):
        print(f"you got in the if")
        return jsonify(result), 201

    return jsonify({"success": True, "message": "Account successfully created!"}), 201

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('searchQuery')

    rec_ids = rm.search_by_query(query)
    fetched_movie_data = get_movies_by_id(rec_ids[0]["id"].values.tolist())
    fetched_book_data = get_books_by_isbn(rec_ids[1]["ISBN"].values.tolist())

    if fetched_movie_data or fetched_book_data:
        return jsonify({"message": "Fetch Successful", "fetched_data": {"movies": fetched_movie_data, "books": fetched_book_data}}), 200
    else:
        return jsonify({"message": "No recommendations found"}), 400

# Run Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)
