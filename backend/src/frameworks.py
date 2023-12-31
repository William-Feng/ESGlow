from .database import (
    db,
    Company,
    Industry,
    Framework,
    Metric,
    Indicator,
    DataValue,
    CompanyFramework,
    FrameworkMetric,
    MetricIndicator,
    CustomFrameworks,
    CustomFrameworkPreferences,
    User
)
from typing import List, Dict


def all_industries():
    """
    Summary:
        Fetches all industry names from the database.
    Args:
        None
    Returns:
        Dictionary containing a successful message and a list of industry names
        HTTP status code
    """

    industries = [industry.name for industry in Industry.query.all()]
    if not industries:
        return {"message": "No industries found."}, 400

    return {"message": "All industries retrieved!", "industries": industries}, 200


def all_companies():
    """
    Summary:
        Fetches all company names from the database.
    Args:
        None
    Returns:
        Dictionary containing a successful message and a list of company names
        HTTP status code
    """

    companies = [
        {"name": company.name, "company_id": company.company_id}
        for company in Company.query.all()
    ]
    if not companies:
        return {"message": "No companies found."}, 400

    return {"message": "All companies retrieved!", "companies": companies}, 200


def all_frameworks():
    """
    Summary:
        Fetches all framework names from the database
    Args:
        None
    Return:
        Dictionary containing a successful message and a list of framework names
        HTTP status code
    """

    frameworks = [framework.name for framework in Framework.query.all()]
    if not frameworks:
        return {"message": "No frameworks found."}, 400

    return {"message": "All frameworks retrieved!", "frameworks": frameworks}, 200


def all_indicators():
    """
    Summary:
        Fetches all indicator information from the database.
    Args:
        None
    Returns:
        Dictionary containing a successful message and a list of indicator IDs, names & descriptions
        HTTP status code
    """

    indicators = [
        {
            "name": indicator.name,
            "indicator_id": indicator.indicator_id,
            "indicator_description": indicator.description,
            "indicator_source": indicator.source,
        }
        for indicator in Indicator.query.all()
    ]
    if not indicators:
        return {"message": "No indicators found."}, 400

    return {"message": "All indicators retrieved!", "indicators": indicators}, 200


def get_companies_by_industry(industry_name: str):
    """
    Summary:
        Fetches all company IDs associated with a given industry name from the database.
    Args:
        industry_name (int): The name of the industry.
    Returns:
        Dictionary containing a successful message and a list of company IDs
        HTTP status code
    """

    # Fetch the industry
    industry = db.session.query(Industry).filter_by(name=industry_name).first()

    if not industry:
        return {"message": f"Industry named '{industry_name}' not found."}, 400

    # Extract company IDs
    companies = (
        db.session.query(Company).filter_by(
            industry_id=industry.industry_id).all()
    )
    company_ids = [company.company_id for company in companies]

    return {
        "message": "Companies for industry successfully retrieved!",
        "companies": company_ids,
    }, 200


def get_company_info(company_ids: List[int]):
    """
    Summary:
        Fetches the company names and descriptions associated with the specified company IDs from the database.
    Args:
        company_ids (List[int]): A list of company IDs.
    Returns:
        Dictionary containing a successful message and a list of nested dictionaries containing the company information.
        HTTP status code
    """

    companies_data = []
    for company_id in company_ids:
        # Query for the company and add the data
        company = db.session.get(Company, company_id)
        if not company:
            return {"message": f"Company with ID {company_id} not found."}, 400

        company_dict = {
            "company_id": company.company_id,
            "name": company.name,
            "description": company.description,
        }
        companies_data.append(company_dict)

    return {
        "message": "Companies' information successfully retrieved!",
        "companies": companies_data,
    }, 200


def get_framework_info_from_company(company_id: int):
    """
    Summary:
        Fetches all frameworks, metrics and indicators associated with a specified company.
    Args:
        company_id (int): The ID of the company.
    Returns:
        A list of framework info dicts.
        HTTP status code
    """
    company = db.session.get(Company, company_id)
    if not company:
        return {"message": f"Company with ID {company_id} not found."}, 400

    # Query for all frameworks, metrics and indicators associated with the company
    result = (
        db.session.query(
            # Frameworks
            Framework.framework_id.label("framework_id"),
            Framework.name.label("framework_name"),
            Framework.description.label("framework_description"),
            # Metrics
            Metric.metric_id.label("metric_id"),
            Metric.name.label("metric_name"),
            Metric.description.label("metric_description"),
            FrameworkMetric.predefined_weight.label(
                "metric_predefined_weight"),
            # Indicators
            Indicator.indicator_id.label("indicator_id"),
            Indicator.name.label("indicator_name"),
            Indicator.description.label("indicator_description"),
            MetricIndicator.predefined_weight.label(
                "indicator_predefined_weight"),
        )
        .select_from(Company)
        .join(CompanyFramework, Company.company_id == CompanyFramework.company_id)
        .join(Framework, CompanyFramework.framework_id == Framework.framework_id)
        .join(FrameworkMetric, Framework.framework_id == FrameworkMetric.framework_id)
        .join(Metric, FrameworkMetric.metric_id == Metric.metric_id)
        .join(MetricIndicator, Metric.metric_id == MetricIndicator.metric_id)
        .join(Indicator, MetricIndicator.indicator_id == Indicator.indicator_id)
        .filter(Company.company_id == company_id)
        .all()
    )

    framework_data = []
    curr_framework = {}
    curr_metric = {}
    for res in result:
        # Encounter new framework
        if not curr_framework or curr_framework["framework_id"] != res.framework_id:
            # Insert metric into framework
            if curr_metric:
                curr_framework["metrics"].append(curr_metric)
            # Insert framework into response
            if curr_framework:
                framework_data.append(curr_framework)
            # Reset for new framework and metric
            curr_framework = {
                "framework_id": res.framework_id,
                "framework_name": res.framework_name,
                "description": res.framework_description,
                "metrics": [],
            }
            curr_metric = {}

        # Encounter new metric
        if not curr_metric or res.metric_id != curr_metric["metric_id"]:
            # Insert metric into framework
            if curr_metric:
                curr_framework["metrics"].append(curr_metric)
            # Reset for new metric
            curr_metric = {
                "metric_id": res.metric_id,
                "metric_name": res.metric_name,
                "description": res.metric_description,
                "predefined_weight": res.metric_predefined_weight,
                "indicators": [],
            }

        # Add indicator to metric
        curr_metric["indicators"].append(
            {
                "indicator_id": res.indicator_id,
                "indicator_name": res.indicator_name,
                "description": res.indicator_description,
                "predefined_weight": res.indicator_predefined_weight,
            }
        )

    # Add the final metric and framework after exiting the loop.
    if curr_metric:
        curr_framework["metrics"].append(curr_metric)
    if curr_framework:
        framework_data.append(curr_framework)

    response = {
        "message": "Framework, metric & indicator information for company successfully retrieved!",
        "frameworks": framework_data,
    }

    return response, 200


def get_indicator_values(
    company_id: int, selected_indicators: List[int], selected_years: List[int]
):
    """
    Summary:
        Fetches the values of indicators according to the given years and company.
    Args:
        company_ids (int): A company ID.
        selected_indicators (List[int]): A list of indicators IDs.
        selected_years (List[int]): A list of years.
    Returns:
        List of dictionaries containing indicator id, name, year and value.
        HTTP status code
    """
    company = db.session.get(Company, company_id)
    if not company:
        return {"message": f"Company with ID {company_id} not found."}, 400

    # Query for all indicators with the given ids
    existing_indicators = Indicator.query.filter(
        Indicator.indicator_id.in_(selected_indicators)
    ).all()
    if len(existing_indicators) != len(selected_indicators):
        return {"message": "One or more provided indicator_ids do not exist."}, 400

    # Query for all data values for the indicators in the selected years
    values = (
        db.session.query(DataValue, Indicator.name)
        .join(Indicator, DataValue.indicator_id == Indicator.indicator_id)
        .filter(
            DataValue.company_id == company_id,
            DataValue.indicator_id.in_(selected_indicators),
            DataValue.year.in_(selected_years),
        )
        .all()
    )

    if not values:
        return {"message": "No data values found for the provided criteria."}, 400

    # Format data
    indicator_values = []
    for val, indicator_name in values:
        response_item = {
            "indicator_id": val.indicator_id,
            "indicator_name": indicator_name,
            "year": val.year,
            "value": val.rating,
        }
        indicator_values.append(response_item)

    response = {
        "message": "Indicator values for company successfully retrieved!",
        "values": indicator_values,
    }

    return response, 200


def create_custom_framework(data: Dict, user: User):
    """
    Summary:
        Creates a custom framework and stores it in the database.
    Args:
        data (Dict): Framework data as per the 'CustomFramework' Flask model.
        user (User): The User creating the framework.
    Returns:
        Dictionary containing a status message.
        HTTP status code
    """
    # Check if the custom framework name is null
    if data['name'] == '':
        return {"message": "Custom framework name cannot be empty."}, 400

    # Check for unique custom framework name for the user
    existing_framework = CustomFrameworks.query.filter_by(
        user_id=user.user_id,
        name=data['name']
    ).first()
    if existing_framework:
        return {"message": "Custom framework with this name already exists."}, 400

    # Create new custom framework instance that is linked to the user
    new_custom_framework = CustomFrameworks(
        user_id=user.user_id,
        name=data['name'],
        description=data['description']
    )
    db.session.add(new_custom_framework)
    db.session.commit()

    # Add preferences to the custom framework
    for pref in data["preferences"]:
        new_pref = CustomFrameworkPreferences(
            custom_framework_id=new_custom_framework.custom_framework_id,
            indicator_id=pref['indicator_id'],
            weight=pref['weight']
        )
        db.session.add(new_pref)

    db.session.commit()

    response = {
        "message": "Custom framework for user created successfully!",
    }

    return response, 200


def get_custom_frameworks(user: User):
    """
    Summary:
        Get all custom frameworks associated with the given user.
    Args:
        user (User): The User who created the frameworks.
    Returns:
        Dictionary containing a status message and a list of info about
        custom frameworks created by the user.
        HTTP status code
    """
    # Get all custom frameworks associated with the user
    custom_frameworks = CustomFrameworks.query.filter_by(
        user_id=user.user_id
    ).all()

    custom_frameworks_data = []
    for cf in custom_frameworks:
        # Get preferences for each custom framework
        preferences = CustomFrameworkPreferences.query.filter_by(
            custom_framework_id=cf.custom_framework_id
        ).all()
        # Transform preferences into a list of dictionaries
        preferences_data = [{
            'indicator_id': pref.indicator_id,
            'weight': pref.weight
        } for pref in preferences]

        # Append the framework and its preferences to the custom_frameworks_data list
        custom_frameworks_data.append({
            'framework_id': cf.custom_framework_id,
            'framework_name': cf.name,
            'description': cf.description,
            'preferences': preferences_data
        })

    response = {
        "message": "Custom frameworks for user successfully retrieved!",
        "custom_frameworks": custom_frameworks_data
    }

    return response, 200


def delete_custom_framework(user: User, framework_id: int):
    """
    Summary:
        Deletes a custom framework from the database.
    Args:
        user (User): The User who created the frameworks.
        framework_id (int): ID of the framework to be deleted.
    Returns:
        Dictionary containing a status message.
        HTTP status code
    """
    # Fetch the specified custom framework
    custom_framework = CustomFrameworks.query.filter_by(
        custom_framework_id=framework_id,
        user_id=user.user_id
    ).first()

    # Check if custom framework exists and belongs to the user
    if not custom_framework:
        return {"message": "Custom framework not found."}, 404

    # Delete related preferences
    CustomFrameworkPreferences.query.filter_by(
        custom_framework_id=framework_id
    ).delete()

    # Delete the custom framework
    db.session.delete(custom_framework)
    db.session.commit()

    response = {
        "message": "Custom framework deleted successfully!",
    }

    return response, 200
