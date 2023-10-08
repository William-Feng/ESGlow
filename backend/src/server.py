from flask_restx import Api, Resource, fields

# User-defined module imports
from .database import db, bcrypt, User
from .user import register_user

api = Api()

EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"


@api.route("/")
class Hello(Resource):
    def get(self):
        return "Hello, World!"


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

        response, status_code = register_user(email, password)
        return response, status_code
