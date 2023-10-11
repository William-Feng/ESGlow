from .database import db, bcrypt, User
from flask import jsonify

def frameworks_all(token):
    """
    Summary:
        Upon validating token, return all frameworks, metrics in each framework, and each indicator in each metric.
    Args:
        token (token): Token for user
    Return:
        frameworks
    """
    
    #if valid_token(token):
    if True:
        # Access database
        frameworks = {}
        
        # Read thru database
        
        return jsonify({"message" : 'Frameworks all retrieved!', "frameworks" : frameworks}), 200
    else:
        return {"message" : 'Unauthorised Token'}, 401
    