import secrets
import smtplib
import ssl
import string
import textwrap

from .config import VERIFICATION_CODE_LENGTH, SENDER_EMAIL_ADDRESS, SENDER_EMAIL_PASSWORD
from .database import db, bcrypt, User


def reset_password_request(email):
    """
    Summary: 
        Wrapper for resetting an email.
        Called by Frontend upon attempting to reset a password.
        Will generate a verification code, and send an email with code.
    Args:
        email (string): email to be reset
    Return:
        ({message: string}, status_code)
    """
    user = User.query.filter_by(email=email).first()
    if user:
        return send_email(email, user)
    else:
        return ({"message": "Email does not exist."}, 400)


def reset_password_verify(email, code):
    """
    Summary:
        Called by Frontend to verify an entered code for a given user.
        Checks if the given code is the same as the User's verification code.
    Args:
        email (string): Email address of the user whose password needs to be reset.
        code (string): verification Code for the User
    Returns:
        ({verified: boolean, message: string}, status_code)
    Error:
        SQLAlchemyError: If there is any error while updating the database. 
    """
    user = User.query.filter_by(email=email).first()
    if user:
        if user.verification_code == code:
            return {
                'verified': True,
                "message": "Password Successfully Reset!",
            }, 200
        else:
            return {
                'verified': False,
                "message": "Verification Code is incorrect."
            }, 400
    else:
        return {
            'verified': False,
            "message": "Email does not exist."
        }, 400


def reset_password_change(email, new_password):
    """
    Summary:
        Called by Frontend to change a password.
        Given a email and new_password, change associated user's password.
    Args:
        email (string): Email address of the user whose password needs to be reset.
        new_password (string): New password for user
    Return:
        ({message: string}, status_code)
    """

    user = User.query.filter_by(email=email).first()
    user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.verification_code = None
    db.session.commit()
    return {
        "message": "Password Successfully Reset!",
    }, 200


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
    code = ''.join(secrets.choice(alphabet)
                   for _ in range(VERIFICATION_CODE_LENGTH))
    user.verification_code = code
    db.session.commit()
    return code


def send_email(receiver_email_address, user):
    """
    Summary
        Send an email to the receiver's email address containing the most recent verification code assigned to the user.
    Args:
        receiver_email_address (string): Email for whom the code is being sent to.
        user (User): User for whom the code is for.
    Return: 
        None
    """
    code = generate_code(user)
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(SENDER_EMAIL_ADDRESS, SENDER_EMAIL_PASSWORD)
        subject = "ESGlow Password Reset Code"
        body = textwrap.dedent(f"""
        Hello {user.name},

        You have recently requested to reset your password for ESGlow. Your verification code is:

        {code}

        If you have not requested to reset your password, please ignore this email.

        Kind Regards,

        ESGlow
        """)

        # Formatting message with headers.
        message = f"Subject: {subject}\nFrom: {SENDER_EMAIL_ADDRESS}\nTo: {receiver_email_address}\n\n{body}"

        server.sendmail(SENDER_EMAIL_ADDRESS, receiver_email_address, message)

    return {"message": "Password Reset Request Successful!"}, 200
