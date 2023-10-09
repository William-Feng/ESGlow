import smtplib
import ssl
import string
import secrets


from .config import VERIFICATION_CODE_LENGTH
from .database import db, bcrypt, User

send_email_address = "xuerichard1@gmail.com"
send_email_password = "gbwv aczd mejn xmvb"


def reset_password_request(email):
    """
    Summary: 
        Wrapper for resetting an email.
        Called by Frontend upon attempting to reset a password.
        Will generate a verification code, and send an email with code.
    Args:
        email (string): email to be reset
    """
    user = User.query.filter_by(email=email).first()
    if user:
        send_email(email, user)
    
def reset_password_verify(token, code):
    """
    Summary:
        Called by Frontend to verify an entered code for a given user.
        Checks if the given code is the same as the User's verification code.
    Args:
        token (Token): Token associated with user
        code (string): verification Code for the User
    Returns:
        ({boolean}, status_code)
    Error:
        SQLAlchemyError: If there is any error while updating the database. 
    """
    # TODO Fix
    user = User.query.filter_by(email=email).first()

    if user and user.verification_code == code:
        return {'verified': True}, 200

    return {'verified': False}, 400

def reset_password_change(token, new_password):
    """
    TODO
    Given a token and new_password, change associated user's password.
    Args:
        token (Token): Token associated with user
        new_password (string): New password for user
    """
    
    """
        user.password = bcrypt.generate_password_hash(
            new_password).decode('utf-8')
        user.verification_code = None
        db.session.commit()
    """
    
def generate_code(user):
    """
    Summary:
        Given an User, generate a verification code of length LENGTH that allows for the email to be reset.
        Add verification code to the database to allow for verification.
        If the user already has a verification code, overwrite the previous verification code.
    Args:
        user (User): User for whom the code is being generated for.
    Returns:
        code (string): Verification code for the email.
    """
    alphabet = string.ascii_uppercase + string.digits
    code = ''.join(secrets.choice(alphabet) for _ in range(VERIFICATION_CODE_LENGTH))
    user.verification_code = code
    db.session.commit()
    return code


def send_email(receiver_email, user):
    """
    Summary
        Given an email address, email the email address the most recent verification code assigned to the email.

    Args:
        receiver_email (string): Email for whom the code is being sent to.
        user (User): User for whom the code is for.
    """
    code = generate_code(user)
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(send_email_address, send_email_password)
        subject = "Your ESGlow Password Reset Code"
        body = f"""
        Hello {receiver_email},

        You have recently requested to reset your password for ESGlow. Your verification code is:

        {code}

        If you have not recently requested to reset your password, please ignore this email!

        Kind Regards,

        ESGlow
        """
        # Formatting message with headers.
        message = f"Subject: {subject}\nFrom: {send_email_address}\nTo: {receiver_email}\n\n{body}"

        server.sendmail(send_email_address, receiver_email, message)
    
        