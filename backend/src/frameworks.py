from .database import db, bcrypt, Framework, Metric, Indicator, User


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


def frameworks_all():
    """
    Summary:
        return all frameworks, metrics in each framework, and each indicator in each metric.

    Return:
        frameworks, a dictionary of all frameworks, metrics and indicators.
    """

    frameworks = {}

    # Read thru database

    return {"message": 'Frameworks all retrieved!', "frameworks": frameworks}, 200


def frameworks_company(company):
    """
    Summary:
        Called by endpoint.
        Given a company, return all frameworks associated w/ that company.
    Args:
        company (string): 
    Returns:
        frameworks:
    """
    frameworks = retrieve_frameworks_from_company(company)
    return {"message": 'Frameworks company retrieved!', "frameworks": frameworks}, 200
