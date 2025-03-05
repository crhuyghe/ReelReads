from flask import Flask, request, jsonify
from flask_cors import CORS #cross-origin requests
from user_login import create_new_user, validate_user_login

app = Flask(__name__)
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

# Run Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)

