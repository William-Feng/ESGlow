import re

from .database import db, bcrypt, User

EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"


def register_user(email, password):
    # Validate email format
    if not re.match(EMAIL_REGEX, email):
        return {"message": "Invalid email format."}, 400

    # Check if user exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return {"message": "Email already exists."}, 400

    # Generate password hash
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Store new user into the database
    new_user = User(email=email, password=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return {"message": "User successfully registered."}, 201
