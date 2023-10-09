from flask_restx import Api, fields, Resource

from .user import login, register


api = Api()


@api.route("/")
class Hello(Resource):
    def get(self):
        return "Hello, World!"


user_model = api.model('User', {
    'email': fields.String(required=True, description='Email Address', example='example@gmail.com'),
    'password': fields.String(required=True, description='Password', example='Password123')
})


@api.route("/register")
class Register(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'User created successfully.')
    @api.response(400, 'Error: user already exists.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']

        response, status_code = register(email, password)
        return response, status_code


login_response_model = api.model('LoginResponse', {
    'message': fields.String(description='Status message', example='Login successful.'),
    'user_id': fields.String(description='User ID in UUID format', example='fa73dc42-8475-44d8-bd3d-89f7fa288974')
})


@api.route("/login")
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
