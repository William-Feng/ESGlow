from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_restx import Api, Resource, fields
from flask_sqlalchemy import SQLAlchemy
import uuid


app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:54321/esglow'
db = SQLAlchemy(app)


@api.route("/")
class Hello(Resource):
    def get(self):
        return "Hello, World!"

user_model = api.model('User', {
    'email': fields.String(required=True, description='Email Address', example="william.feng@gmail.com"),
    'password': fields.String(required=True, description='Password')
})


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.String, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)


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

        # Generate password hash and uuid
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8') 
        uid = uuid.uuid4()
        
        # Store new user in database
        new_user = User(user_id=uid, email=email, password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()

        return {"message": "User successfully registered."}, 201

if __name__ == "__main__":
    app.run(debug=True)

