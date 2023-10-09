def test_register_endpoint(client):
    data = {
        "email": "test@example.com",
        "password": "password123"
    }

    # First registration
    response = client.post('/register', json=data)
    assert response.status_code == 201
    assert b"User successfully registered." in response.data

    # Attempting duplicate email registration
    response = client.post('/register', json=data)
    assert response.status_code == 400
    assert b"Email already exists." in response.data
