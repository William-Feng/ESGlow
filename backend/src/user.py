from flask_jwt_extended import create_access_token

from .database import db, bcrypt, User


def register(name: str, email: str, password: str):
    """
    Summary:
        Verifies new details, registers a new user and provides a JWT.
    Args:
        name (str): The user's name.
        email (str): The user's email.
        password (str): The user's intended password.
    Returns:
        A dict containing status message and a JWT. 
        HTTP status code
    """
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


def login(email: str, password: str):
    """
    Summary:
        Verifies existing details and provides a JWT.
    Args:
        email (str): The user's email.
        password (str): The user's password.
    Returns:
        A dict containing status message and a JWT. 
        HTTP status code
    """
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


def get_user(email: str):
    """
    Summary:
        Fetches the user details from the database.
    Args:
        email (str): The user's email.
    Returns:
        A dict containing the user's name and email. 
        HTTP status code
    """
    user = User.query.filter_by(email=email).first()
    # Check if user exists
    if not user:
        return {"message": "User doesn't exist."}, 400

    return {
        'name': user.name,
        'email': user.email
    }, 200
