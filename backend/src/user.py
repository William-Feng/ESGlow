from flask_jwt_extended import create_access_token

from .database import db, bcrypt, User


def register(name, email, password):
    # Check if user exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return {"message": "User with email already exists."}, 400

    # Generate password hash
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Store new user into the database
    new_user = User(name=name, email=email, password=password_hash)
    db.session.add(new_user)
    db.session.commit()

    # Return a JWT access token to immediately login the new user
    token = create_access_token(identity=email)

    return {
        "message": "User successfully registered.",
        "token": token
    }, 200


def login(email, password):
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return {"message": "User doesn't exist."}, 400

    # Check invalid password
    password_hash = user.password
    if not bcrypt.check_password_hash(password_hash, password):
        return {"message": "Invalid password."}, 400

    token = create_access_token(identity=email)

    return {
        "message": "Login successful.",
        "token": token
    }, 200


def get_user(email):
    user = User.query.filter_by(email=email).first()
    # Check if user exists
    if not user:
        return {"message": "User doesn't exist."}, 400

    return {
        'name': user.name,
        'email': user.email
    }, 200
