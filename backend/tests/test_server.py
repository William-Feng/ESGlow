from flask_jwt_extended import decode_token

'''
These tests ensure all endpoints return the correct status codes and fields for
their return payloads.

Correctness of queried data is tested in test_frameworks.py
'''

# ===================================================================
#
# Login/Register endpoints
#
# ===================================================================

def test_register_endpoint(client):
    data = {
        "name": "Person",
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
    assert b"User with email already exists." in response.data


def test_login_endpoint(client_with_user):
    valid_details = {
        "name": "Person",
        "email": "user1@example.com",
        "password": "password123"
    }

    invalid_email = {
        "name": "Person",
        "email": "user2@example.com",
        "password": "password123"
    }

    invalid_password = {
        "name": "Person",
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
    assert response.json["message"] == "Framework, metric & indicator information for company successfully retrieved!"
    assert response.json["frameworks"]

    # Invalid company
    response = client_with_frameworks.get('/api/frameworks/9', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 400
    assert response.json["message"] == "Company with ID 9 not found."


def test_indicator_values_endpoint(client_with_frameworks, access_token):

    response = client_with_frameworks.get('/api/values/1/1,2,3/2023', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "Indicator values for company successfully retrieved!"
    assert response.json["values"]

    # Invalid company
    response = client_with_frameworks.get('/api/values/10/1,2,3/2023', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 400
    assert response.json["message"] == "Company with ID 10 not found."

    # Invalid indicator
    response = client_with_frameworks.get('/api/values/1/1,2,15/2023', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 400
    assert response.json["message"] == "One or more provided indicator_ids do not exist."


def test_company_info_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/companies/1', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "Companies' information successfully retrieved!"
    assert response.json["companies"]

    # Invalid company
    response = client_with_frameworks.get('/api/companies/10', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 400
    assert response.json["message"] == "Company with ID 10 not found."


def test_all_industries_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/industries/all', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "All industries retrieved!"
    assert response.json["industries"]


def test_all_indicators_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/indicators/all', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "All indicators retrieved!"
    assert response.json["indicators"]


def test_all_years_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/years/all', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "All years retrieved!"
    assert response.json["years"]


def test_companies_by_industry_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/industries/Industry 1', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "Companies for industry successfully retrieved!"
    assert response.json["companies"]

    # Invalid industry
    response = client_with_frameworks.get('/api/industries/Industry 3', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 400
    assert response.json["message"] == "Industry named 'Industry 3' not found."


def test_company_values_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/values/company/1', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["1"]


def test_industry_values_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/values/industry/1', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "Values for industry retrieved!"
    assert response.json["min_score"]
    assert response.json["max_score"]
    assert response.json["average_score"]

    # Invalid industry
    response = client_with_frameworks.get('/api/values/industry/7', headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 400
    assert response.json["message"] == "Invalid industry id provided."


def test_company_ranking_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/values/ranking/company/1', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "Ranking in industry determined!"
    assert response.json["ranking"]

    # Invalid company
    response = client_with_frameworks.get('/api/values/ranking/company/10', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 400
    assert response.json["message"] == "Invalid company id supplied!"


def test_graph_company_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/values/graph/company/1', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "Graph Values for Company Returned!"
    assert response.json["year_values"]

    # Invalid company
    response = client_with_frameworks.get('/api/values/graph/company/7', headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 400
    assert response.json["message"] == "Invalid company id supplied!"


def test_graph_indicator_endpoint(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/values/graph/indicator/1', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200
    assert response.json["message"] == "Graph Values for Indicator Returned!"
    assert response.json["indicator_name"]
    assert response.json["indicator_scores"]


def test_create_and_delete_framework_endpoint(client_with_frameworks, access_token):
    data = {
        "name": "test_user",
        "email": "test_user@example.com",
        "password": "password123"
    }
    client_with_frameworks.post('/api/register', json=data)

    preferences = [
        {
            'indicator_id': 1,
            'weight': 0.5
        },
        {
            'indicator_id': 2,
            'weight': 0.5
        }
    ]
    payload = {
        'name': 'My Framework',
        'description': 'Test Framework',
        'preferences': preferences
    }

    response = client_with_frameworks.post('/api/custom-frameworks', json=payload, headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 200
    assert response.json["message"] == "Custom framework for user created successfully!"

    # Test get
    response = client_with_frameworks.get('/api/custom-frameworks', headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 200
    assert response.json["message"] == "Custom frameworks for user successfully retrieved!"
    received_frameworks = response.json["custom_frameworks"]
    assert len(received_frameworks) == 1
    created_framework = received_frameworks[0]
    framework_id = created_framework['framework_id']

    # Test delete
    response = client_with_frameworks.delete(f'/api/custom-frameworks/{framework_id}', headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 200
    assert response.json["message"] == "Custom framework deleted successfully!" 

    # Should no longer exist
    response = client_with_frameworks.get('/api/custom-frameworks', headers={
        'Authorization': f'Bearer {access_token}'
    })
    assert response.status_code == 200
    assert response.json["message"] == "Custom frameworks for user successfully retrieved!"
    received_frameworks = response.json["custom_frameworks"]
    assert len(received_frameworks) == 0


