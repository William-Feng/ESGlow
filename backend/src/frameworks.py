from .database import *
from collections import defaultdict
import logging

def retrieve_frameworks_from_company(company):
    """
    Summary:
        Given a company as input, return all frameworks associated with that framework.
    Arguments:
        company (string)
    Returns:
        frameworks
    """
    #frameworks = Framework.query.filter_by(framework,)
    #for framework in frameworks:
       #pass
       
    query = (
        db.session.query(
            Framework.framework_id,
            Framework.name.label("framework_name"),
            Company.company_id,
            Company.name.label("company_name")
        )
        .join(FrameworkMetric, Framework.framework_id == FrameworkMetric.framework_id)
        .join(Metric, FrameworkMetric.metric_id == Metric.metric_id)
        .join(MetricIndicator, Metric.metric_id == MetricIndicator.metric_id)
        .join(Indicator, MetricIndicator.indicator_id == Indicator.indicator_id)
        .join(DataValue, Indicator.indicator_id == DataValue.indicator_id)
        .join(Company, DataValue.company_id == Company.company_id)
        .group_by(
            Framework.framework_id,
            Framework.name,
            Company.company_id,
            Company.name
        )
        .order_by(Company.company_id)
    )
    
    
    results = query.all()

    # Initialize an empty dictionary to store the results
    company_frameworks = defaultdict(list)

    """
    # Loop through the results
    for framework_id, framework_name, company_id, company_name in results:
        # Check if the company is already in the dictionary
        if company_name in company_frameworks:
            # Add the framework to the list of frameworks for this company
            company_frameworks[company_name].append({
                "framework_id": framework_id,
                "framework_name": framework_name
            })
    logging.info(company_frameworks)
    """
    return company_frameworks


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
    if True:
    #if User.query.filter_by(email=token_identity).first():
        # Access database
        frameworks = retrieve_frameworks_from_company(company)
        return {"message": 'Frameworks company retrieved!', "frameworks": frameworks}, 200
    else:
        return {"message": 'Unauthorised Token'}, 401
