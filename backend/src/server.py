from flask import Flask
from flask_restx import Api, Resource, fields

from database import db, bcrypt, User
import config


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URI

api = Api(app)
bcrypt.init_app(app)
db.init_app(app)


@api.route("/")
class Hello(Resource):
    def get(self):
        return "Hello, World!"


user_model = api.model('User', {
    'email': fields.String(required=True, description='Email Address', example="william.feng@gmail.com"),
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


if __name__ == "__main__":
    app.run(debug=True)
