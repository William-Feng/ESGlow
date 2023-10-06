from flask import Flask, request
from flask_restx import Api, Resource, fields
from flask_bcrypt import Bcrypt

app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app) 

@api.route("/")
class Hello(Resource):
    def get(self):
        return "Hello, World!"

user_model = api.model('User', {
    'email': fields.String(required=True, description='Email Address', pattern=r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"),
    'password': fields.String(required=True, description='Password')
})

@api.route("/register")
@api.doc(params={'email': 'An email address', 'password': 'A valid password'})
class RegisterUser(Resource):
    @api.expect(user_model, validate=True)
    @api.response(201, 'User created successfully.')
    @api.response(400, 'Validation error or user already exists.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']

        # TODO: check if user exists
        # if user exists
        # return {"message": "Email already exists."}, 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8') 
        # TODO: store new user in database

        return {"message": "User successfully registered."}, 201

if __name__ == "__main__":
    app.run(debug=True)

