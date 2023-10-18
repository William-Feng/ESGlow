from .database import db, Company, Framework, Metric, Indicator, DataValue, CompanyFramework, FrameworkMetric, MetricIndicator


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
        return {"message": "No frameworks found."}, 404

    return {"message": 'All frameworks retrieved!', "frameworks": frameworks}, 200


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

    companies = [{'name': company.name, 'company_id': company.company_id} for company in Company.query.all()]
    if not companies:
        return {"message": "No companies found."}, 404

    return {"message": 'All companies retrieved!', "companies": companies}, 200


def get_framework_info_from_company(company_id):
    """
    Summary:
        Fetches all frameworks, metrics and indicators associated with a specified company.
    Args:
        company_id (int): The ID of the company.
    Returns:
        [
            {
                'framework_id': 1,
                'framework_name': 'Framework',
                'description': 'Framework description',
                'metrics': [
                    {
                        'metric_id': 2,
                        'metric_name': 'Metric',
                        'description: 'Metric description',
                        'predefined_weight': 0.4,
                        'indicators': [
                            {
                                'indicator_id': 1,
                                'indicator_name': 'Indicator',
                                'description': 'Indicator description',
                                'predefined_weight': 0.3
                            }
                        ]
                    }
                ]
            }
        ], status_code
    """
    company = Company.query.get(company_id)
    if not company:
        return {"message": f"Company with ID {company_id} not found."}, 404

    result = (
        db.session.query(
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
                "indicator_predefined_weight")
        ).select_from(Company)
        .join(CompanyFramework, Company.company_id == CompanyFramework.company_id)
        .join(Framework, CompanyFramework.framework_id == Framework.framework_id)
        .join(FrameworkMetric, Framework.framework_id == FrameworkMetric.framework_id)
        .join(Metric, FrameworkMetric.metric_id == Metric.metric_id)
        .join(MetricIndicator, Metric.metric_id == MetricIndicator.metric_id)
        .join(Indicator, MetricIndicator.indicator_id == Indicator.indicator_id)
        .filter(Company.company_id == company_id)
        .all()
    )

    response = []
    curr_framework = {}
    curr_metric = {}
    for res in result:
        # Encounter new framework
        if not curr_framework or curr_framework['framework_id'] != res.framework_id:
            # Insert metric into framework
            if curr_metric:
                curr_framework['metrics'].append(curr_metric)
            # Insert framework into response
            if curr_framework:
                response.append(curr_framework)
            # Reset for new framework and metric
            curr_framework = {
                'framework_id': res.framework_id,
                'framework_name': res.framework_name,
                'description': res.framework_description,
                'metrics': [],
            }
            curr_metric = {}

        # Encounter new metric
        if not curr_metric or res.metric_id != curr_metric['metric_id']:
            # Insert metric into framework
            if curr_metric:
                curr_framework['metrics'].append(curr_metric)
            # Reset for new metric
            curr_metric = {
                'metric_id': res.metric_id,
                'metric_name': res.metric_name,
                'description': res.metric_description,
                'predefined_weight': res.metric_predefined_weight,
                'indicators': []
            }

        # Add indicator to metric
        curr_metric['indicators'].append({
            'indicator_id': res.indicator_id,
            'indicator_name': res.indicator_name,
            'description': res.indicator_description,
            'predefined_weight': res.indicator_predefined_weight
        })

    # Add the final metric and framework after exiting the loop.
    if curr_metric:
        curr_framework['metrics'].append(curr_metric)
    if curr_framework:
        response.append(curr_framework)

    return response, 200


def get_indicator_values(company_id, selected_indicators, selected_years):
    company = Company.query.get(company_id)
    if not company:
        return {"message": f"Company with ID {company_id} not found."}, 404

    existing_indicators = Indicator.query.filter(
        Indicator.indicator_id.in_(selected_indicators)).all()
    if len(existing_indicators) != len(selected_indicators):
        return {"message": "One or more provided indicator_ids do not exist."}, 400

    values = db.session.query(DataValue, Indicator.name).join(
        Indicator, DataValue.indicator_id == Indicator.indicator_id
    ).filter(
        DataValue.company_id == company_id,
        DataValue.indicator_id.in_(selected_indicators),
        DataValue.year.in_(selected_years)
    ).all()

    if not values:
        return {"message": "No data values found for the provided criteria."}, 404

    response = []
    for val, indicator_name in values:
        response_item = {
            'indicator_id': val.indicator_id,
            'indicator_name': indicator_name,
            'year': val.year,
            'value': val.rating
        }
        response.append(response_item)

    return response, 200
