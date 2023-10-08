from .database import db, bcrypt, User


def register_user(email, password):
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
