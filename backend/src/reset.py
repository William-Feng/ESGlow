import smtplib, ssl, asyncio


send_email_address = "xuerichard1@gmail.com"
send_email_password = "gbwv aczd mejn xmvb"


def generate_code(email):
    """
    Summary:
        Given an email, generate a verification code that allows for the email to be reset.
        Add the email and verification code to the database to allow for verification.
        If the email already has a verification code, overwrite the previous verification code.
        
        
        If the email does not exist in the user database, throw an error.
    Args:
        email (string): Email for whom the code is being generated for.
    Returns:
        code (string): Verification code for the email.
    Errors:
        NO EMAIL IN TABLE:
        
    """
    pass


def verify_code(email, code):
    """
    Summary:
        Given a code and an email, verify the code correlates to the code for each email. 
        If the email's code does not match, or the email does not exist, throw an error.
        Otherwise, return a boolean.
    Args:
        email (string): Email for whom the code is for.
        code (string): Verification code for the given email.
    Error:
    """
    
    
def reset_password(email, new_password):
    """
    NOTE: This is a temporary function and does not work as some variable names/packages are missing.
    
    Need to restructure and abstract out the database functions.
    """
    
    user = User.query.filter_by(email=email).first()

    if user:
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.password_hash = hashed_password

        db.session.commit()
        return True

    return False
    

async def send_email(receiver_email, code):
    """
    Summary
        Given an email address, email the email address the most recent verification code assigned to the email.
        After 5 minutes, the verification code will expire and be replaced by null. TODO
    Args:
        receiver_email (string): Email for whom the code is being sent to.
        code (string): Verification code for the given email address.
    """
    
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(send_email_address, send_email_password)
        subject = "Your ESGlow Password Reset Code"
        body = f"""
        Hello {receiver_email},

        You've recently requested to reset your password for ESGlow. Your verification code is:

        {code}

        If you have not recently requested to reset your password, please ignore this email!

        Kind Regards,

        ESGlow
        """
        # Formatting message with headers.
        message = f"Subject: {subject}\nFrom: {send_email_address}\nTo: {receiver_email}\n\n{body}"
        
        server.sendmail(send_email_address, receiver_email, message)
    
        await asyncio.sleep(300)
        
        # TODO: Reset verification code for receiver_email to NULL.
    
    
if __name__ == "__main__":
    send_email(send_email_address, "000000")
    print("Hello!")