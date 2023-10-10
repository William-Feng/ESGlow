from flask_jwt_extended import decode_token


def test_register_endpoint(client):
    data = {
        "email": "test@example.com",
        "password": "password123"
    }

    # First registration
<<<<<<< HEAD
    response = client.post('/register', json=data)
=======
    response = client.post('/api/register', json=data)
>>>>>>> main
    assert response.status_code == 200
    assert b"User successfully registered." in response.data

    # Attempting duplicate email registration
    response = client.post('/api/register', json=data)
    assert response.status_code == 400
    assert b"Email already exists." in response.data
<<<<<<< HEAD
=======


def test_login_endpoint(client_with_user):
    valid_details = {
        "email": "user1@example.com",
        "password": "password123"
    }

    invalid_email = {
        "email": "user2@example.com",
        "password": "password123"
    }

    invalid_password = {
        "email": "user1@example.com",
        "password": "password1234"
    }

    # Valid details
    response = client_with_user.post('/api/login', json=valid_details)
    assert response.status_code == 200
    assert response.json["message"] == "Login successful."
    token = response.json["token"]
    # Check that the token contains the user's email
    assert decode_token(token)['sub'] == "user1@example.com"

    # Invalid email
    response = client_with_user.post('/api/login', json=invalid_email)
    assert response.status_code == 400
    assert response.json["message"] == "User doesn't exist."

    # Invalid password
    response = client_with_user.post('/api/login', json=invalid_password)
    assert response.status_code == 400
    assert response.json["message"] == "Invalid password."
>>>>>>> main
