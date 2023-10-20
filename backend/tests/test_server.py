from flask_jwt_extended import decode_token

# ===================================================================
#
# Login/Register endpoints
#
# ===================================================================

def test_register_endpoint(client):
    data = {
        "email": "test@example.com",
        "password": "password123"
    }

    # First registration
    response = client.post('/api/register', json=data)
    assert response.status_code == 200
    assert b"User successfully registered." in response.data

    # Attempting duplicate email registration
    response = client.post('/api/register', json=data)
    assert response.status_code == 400
    assert b"Email already exists." in response.data


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


# ===================================================================
#
# Frameworks/Companies endpoints
#
# ===================================================================

def test_all_companies_endpoint(client_with_frameworks, access_token):

    response = client_with_frameworks.get('/api/companies/all', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "All companies retrieved!"
    assert response.json["companies"]


def test_all_frameworks_endpoint(client_with_frameworks, access_token):

    response = client_with_frameworks.get('/api/frameworks/all', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "All frameworks retrieved!"
    assert response.json["frameworks"]


def test_frameworks_by_company_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/frameworks/1', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "Framework, metric & indicator information for company retrieved!"
    assert response.json["frameworks"]

    # Invalid company
    response = client_with_frameworks.get('/api/frameworks/9', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 404
    assert response.json["message"] == "Company with ID 9 not found."


def test_indicator_values_endpoint(client_with_frameworks, access_token):

    response = client_with_frameworks.get('/api/values/1/1,2,3/2023', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "Values successfully retrieved!"
    assert response.json["frameworks"]

    # Invalid company
    response = client_with_frameworks.get('/api/values/10/1,2,3/2023', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 404
    assert response.json["message"] == "Company with ID 10 not found."

    # Invalid indicator
    response = client_with_frameworks.get('/api/values/1/1,2,15/2023', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 400
    assert response.json["message"] == "One or more provided indicator_ids do not exist."
