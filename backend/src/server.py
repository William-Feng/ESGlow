from flask_restx import Api, Resource, fields
import re

# User-defined module imports
from .database import db, bcrypt, User
from .reset import reset_password_request, reset_password_verify, reset_password_change
api = Api()

EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    
@api.route("/")
class Hello(Resource):
    def get(self):
        return {"message" : "Hello, World!"}, 200


user_model = api.model('User', {
    'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
    'password': fields.String(required=True, description='Password')
})


@api.route("/register")
class RegisterUser(Resource):
    @api.expect(user_model, validate=True)
    @api.response(201, 'User created successfully.')
    @api.response(400, 'Validation error or user already exists.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']

        # Validate email format
        if not re.match(EMAIL_REGEX, email):
            return {"message": "Invalid email format."}, 400

        # Check if user exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {"message": "Email already exists."}, 400

        # Generate password hash
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        # Store new user in database
        new_user = User(email=email, password=password_hash)
        db.session.add(new_user)
        db.session.commit()

        return {"message": "User successfully registered."}, 201

password_reset_request_model = api.model('Password Reset Request', {
    'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
})

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
        
