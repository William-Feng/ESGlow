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


def login(email, password):
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return {"message": "User doesn't exist."}, 400
    
    # Check password
    password_hash = user.password
    if bcrypt.check_password_hash(password_hash, password):
        return {
            "message": "Login successful.",
            "user_id": str(user.user_id)
        }, 201
    else:
        return {"message": "Invalid password."}, 400
    