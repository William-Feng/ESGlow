from flask_restx import Api, fields, Resource

from .config import JWT_EXAMPLE
from .user import login, register

from flask_restx import Api, Resource, fields
import re

# User-defined module imports
from .database import db, bcrypt, User
from .reset import reset_password_request, reset_password_verify, reset_password_change
api = Api()

    
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
    'token': fields.String(description='JWT access token', example=f'{JWT_EXAMPLE}'),
    'code': fields.String(required=True, description='Verification Code', example="5A03BX")
})

@api.route("/password-reset-verify")
class PasswordResetVerify(Resource):
    @api.expect(password_reset_verify_model, validate=True)
    @api.response(201, 'Password Successfully Reset!')
    @api.response(400, 'Verification Code is incorrect!')
    @api.response(400, 'Email does not exist!')
    def post(self):
    
        token = data['token']
        code = data['code']
        # TODO CHANGE TO WORK
        # Verify user exists in backend.
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            return {"message": "Email does not exist!"}, 400
        
        # Request a password reset.
        if reset_password_verify(email, code, new_password):
            return {"message": "Password Request Successful!"}, 201
        else:
            return {"message": 'Verification Code is incorrect!'}, 400

password_reset_change_model = api.model('Password Reset Change', {
    'token': fields.String(description='JWT access token', example=f'{JWT_EXAMPLE}'),
    'new_password': fields.String(required=True, description='New Password', example="password123")
})

@api.route("/password-reset-verify")
class PasswordResetVerify(Resource):
    @api.expect(password_reset_change_model, validate=True)
    @api.response(201, 'Password Successfully Reset!')
    @api.response(400, 'Token is incorrect!')
    def post(self):
        data = api.payload
        token = data['token']
        new_password = data['new_password']
        return reset_password_change(token, new_password)
        
