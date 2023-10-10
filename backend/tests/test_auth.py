def get_access_token(client):
    # Registering a test user will return a access token
    response = client.post(
        '/register', json={"email": "testjwt@example.com", "password": "password123"})

    return response.json['access_token']


'''
Uncomment these tests once the protected endpoints have been created to ensure JWT Tokens work as expected

def test_valid_jwt(client):
    access_token = get_access_token(client)
    headers = {'Authorization': f'Bearer {access_token}'}

    # TODO: Test JWT once we have created the endpoint that needs to be protected
    response = client.get('/protected-endpoint', headers=headers)
    assert response.status_code == 200


def test_invalid_jwt(client):
    headers = {'Authorization': 'Bearer invalidtoken'}

    # TODO: Test JWT once we have created the endpoint that needs to be protected
    response = client.get('/protected-endpoint', headers=headers)
    assert response.status_code == 400


def test_no_jwt(client):
    # TODO: Test JWT once we have created the endpoint that needs to be protected
    response = client.get('/protected-endpoint')
    assert response.status_code == 400
'''
