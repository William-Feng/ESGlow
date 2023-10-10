from flask_restx import Api, fields, Resource

from .config import JWT_EXAMPLE
from .user import login, register

api = Api()

<<<<<<< HEAD

=======
EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    
>>>>>>> main
@api.route("/")
class Hello(Resource):
    def get(self):
        return {"message" : "Hello, World!"}, 200


user_model = api.model('User', {
    'email': fields.String(required=True, description='Email Address', example='example@gmail.com'),
    'password': fields.String(required=True, description='Password', example='Password123')
})


register_response_model = api.model('LoginResponse', {
    'message': fields.String(description='Status message', example='User successfully registered.'),
    'token': fields.String(description='JWT access token', example=f'{JWT_EXAMPLE}')
})


@api.route("/api/register")
class RegisterUser(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'User created successfully.', model=register_response_model)
    @api.response(400, 'Error: user already exists.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']

        response, status_code = register(email, password)
        return response, status_code


login_response_model = api.model('LoginResponse', {
    'message': fields.String(description='Status message', example='Login successful.'),
    'token': fields.String(description='JWT access token', example=f'{JWT_EXAMPLE}')
})

<<<<<<< HEAD

@api.route("/login")
class Login(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'Login successful.', model=login_response_model)
    @api.response(400, 'Invalid email or password.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']
=======
@api.route("/password-reset-request")
class PasswordResetRequest(Resource):
    @api.expect(password_reset_request_model, validate=True)
    @api.response(201, 'Password Reset Request Successful!')
    @api.response(400, 'Email does not exist!')
    def post(self):
        data = api.payload
        email = data['email']
        
        
        # Verify email exists.
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            return {"message": "Email does not exist!"}, 400
        
        # Send email, generate code in backend.
        reset_password_request(email)
        return {"message": "Password Reset Request Successful!"}, 201

# NOTE: Email needs to passed in again from the frontend for this to work; Could we change this?
password_reset_verify_model = api.model('Password Reset Verify', {
    'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
    'code': fields.String(required=True, description='Verification Code', example="5A03BX"),
    'new_password': fields.String(required=True, description='New Password', example="password123")
})

@api.route("/password-reset-verify")
class PasswordResetVerify(Resource):
    @api.expect(password_reset_verify_model, validate=True)
    @api.response(201, 'Password Successfully Reset!')
    @api.response(400, 'Verification Code is incorrect!')
    @api.response(400, 'Email does not exist!')
    def post(self):
        data = api.payload
        email = data['email']
        code = data['code']
        new_password = data['new_password']
        
        
        # Verify user exists in backend.
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            return {"message": "Email does not exist!"}, 400
        
        # Request a password reset.
        if reset_password_verify(email, code, new_password):
            return {"message": "Password Request Successful!"}, 201
        else:
            return {"message": 'Verification Code is incorrect!'}, 400
>>>>>>> main

        response, status_code = login(email, password)
        return response, status_code
