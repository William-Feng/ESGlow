from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Api, fields, Resource
from flask import request
from .config import JWT_EXAMPLE

from .database import User
from .reset import reset_password_request, reset_password_verify, reset_password_change
from .user import login, register
from .frameworks import frameworks_all, frameworks_company


api = Api()


@api.route("/")
class Hello(Resource):
    def get(self):
        return {"message": "Hello, World!"}, 200


user_model = api.model('User', {
    'email': fields.String(required=True, description='Email Address', example='example@gmail.com'),
    'password': fields.String(required=True, description='Password', example='Password123')
})


register_response_model = api.model('LoginResponse', {
    'message': fields.String(description='Status message', example='User successfully registered.'),
    'token': fields.String(description='JWT access token', example=f'{JWT_EXAMPLE}')
})


@api.route("/api/register")
class Register(Resource):
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


@api.route("/api/login")
class Login(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'Login successful.', model=login_response_model)
    @api.response(400, 'Invalid email or password.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']
        response, status_code = login(email, password)
        return response, status_code


@api.route("/api/user")
class GetUser(Resource):

    @jwt_required()
    def get(self):
        # Decode the JWT token to retrieve the identity
        user_email = get_jwt_identity()

        response = {
            'email': user_email,
            # If we have other user data we want to return in future, add it here
        }

        return response, 200


# ===================================================================
#
# Password-Reset Endpoints
# ===================================================================
#
password_reset_request_model = api.model('Password Reset Request', {
    'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
})


@api.route("/api/password-reset/request")
class PasswordResetRequest(Resource):
    @api.expect(password_reset_request_model, validate=True)
    @api.response(200, 'Password Reset Request Successful!')
    @api.response(400, 'Email does not exist!')
    def post(self):
        data = api.payload
        email = data['email']

        # Send email, generate code in backend.
        return reset_password_request(email)


password_reset_verify_model = api.model('Password Reset Verify', {
    'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
    'code': fields.String(required=True, description='Verification Code', example="5A03BX"),
})


@api.route("/api/password-reset/verify")
class PasswordResetVerify(Resource):
    @api.expect(password_reset_verify_model, validate=True)
    @api.response(200, 'Password Successfully Reset!')
    @api.response(400, 'Verification Code is incorrect!')
    @api.response(400, 'Email does not exist!')
    def post(self):
        data = api.payload
        email = data['email']
        code = data['code']

        # Verify user exists in backend.
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            return {"message": "Email does not exist!"}, 400

        # Request a password reset.
        return reset_password_verify(email, code)


password_reset_change_model = api.model('Password Reset Change', {
    'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
    'new_password': fields.String(required=True, description='New Password', example="password123")
})


@api.route("/api/password-reset/change")
class PasswordResetChange(Resource):
    @api.expect(password_reset_change_model, validate=True)
    @api.response(200, 'Password Successfully Reset!')
    @api.response(400, 'Email is incorrect!')
    def post(self):
        data = api.payload
        email = data['email']
        new_password = data['new_password']
        return reset_password_change(email, new_password)

# ===================================================================
#
# Framework/Metric Selection
# ===================================================================
#


@api.route("/api/frameworks/get-all")
class getFrameworksAll(Resource):
    @api.response(200, 'Frameworks all retrieved!')
    @api.response(401, 'Unauthorised Token')
    @jwt_required()
    def get(self):
        token_identity = get_jwt_identity()
        return frameworks_all(token_identity)


frameworks_get_company = api.model('Framework thru Company', {
    'company': fields.String(required=True, description='Company Name', example="John Street Capital"),
})


@api.route("/api/frameworks/get-company")
class getFrameworksCompany(Resource):
    @api.response(200, 'Frameworks for company retrieved!')
    @api.response(401, 'Unauthorised Token')
    #@jwt_required()
    def get(self):
        company = request.args.get('company')
        #token_identity = get_jwt_identity()
        token_identity = ''
        return frameworks_company(token_identity, company)
