
def test_valid_jwt(client_with_frameworks, access_token):
    response = client_with_frameworks.get('/api/frameworks/all', headers={
        'Authorization': f'Bearer {access_token}'
    })

    assert response.status_code == 200


def test_invalid_jwt(client_with_frameworks, access_token):
    valid_jwt = access_token
    
    # Altering a few characters in the valid JWT
    invalid_jwt = valid_jwt[:-2] + "XY"
    headers = {'Authorization': f'Bearer {invalid_jwt}'}

    response = client_with_frameworks.get('/api/companies/all', headers=headers)
    assert response.status_code == 401


def test_malformed_jwt(client_with_frameworks):
    headers = {'Authorization': 'Bearer invalidtoken'}

    response = client_with_frameworks.get('/api/companies/all', headers=headers)
    assert response.status_code == 422


def test_no_jwt(client_with_frameworks):
    response = client_with_frameworks.get('/api/companies/all')
    assert response.status_code == 401
