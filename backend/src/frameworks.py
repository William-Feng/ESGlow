from .database import db, bcrypt, Framework, Metric, Indicator, User, Company




def retrieve_frameworks_from_company(company):
    """
    Summary:
        Given a company as input, return all frameworks associated with that framework.
    Arguments:
        company (string)
    Returns:
        frameworks
    """
    frameworks = Framework.query.filter_by(framework,)
    for framework in frameworks:
        pass


def frameworks_all(token_identity):
    """
    Summary:
        Upon validating token, return all frameworks, metrics in each framework, and each indicator in each metric.
    Args:
        token_identity (string): Token for user
    Return:
        frameworks, a dictionary of all frameworks, metrics and indicators.
    """

    if User.query.filter_by(email=token_identity).first():
        # Access database
        frameworks = {}

        # Read thru database

        return {"message": 'Frameworks all retrieved!', "frameworks": frameworks}, 200
    else:
        return {"message": 'Unauthorised Token'}, 401


def frameworks_company(token_identity, company):
    """
    Summary:
        Called by endpoint.
        Given a company, return all frameworks associated w/ that company.
    Args:
        token_identity (string): 
        company (string): 
    Returns:
        frameworks:
    """
    if User.query.filter_by(email=token_identity).first():
        # Access database
        frameworks = retrieve_frameworks_from_company(company)
        return {"message": 'Frameworks company retrieved!', "frameworks": frameworks}, 200
    else:
        return {"message": 'Unauthorised Token'}, 401


def all_companies(token_identity):
    """
    Called by endpoint, returns all companies.

    Args:
        token_identity (string): 
    """
    
    if User.query.filter_by(email=token_identity).first():
        # Access database
        companies = [company.name for company in Company.query.all()]
        return {"message": 'All companies retrieved!', "companies": companies}, 200
    else:
        return {"message": 'Unauthorised Token'}, 401