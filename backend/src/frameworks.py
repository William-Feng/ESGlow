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

    companies = [company.name for company in Company.query.all()]
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
                'metrics': [
                    {
                        'metric_id': 2,
                        'metric_name': 'Metric',
                        'predefined_weight': 0.4,
                        'indicators': [
                            {
                                'indicator_id': 1,
                                'indicator_name': 'Indicator',
                                'predefined_weight': 0.3
                            }
                        ]
                    }
                ]
            }
        ], status_code
    """
    result = (
        db.session.query(
            Framework.framework_id.label("framework_id"),
            Framework.name.label("framework_name"),
            # Metrics
            Metric.metric_id.label("metric_id"),
            Metric.name.label("metric_name"),
            FrameworkMetric.predefined_weight.label(
                "metric_predefined_weight"),
            # Indicators
            Indicator.indicator_id.label("indicator_id"),
            Indicator.name.label("indicator_name"),
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
    cur_framework = {}
    cur_metric = {}
    for res in result:
        if not cur_framework or cur_framework['framework_id'] != res.framework_id:
            if cur_framework:
                response.append(cur_framework)
            cur_framework = {
                'framework_id': res.framework_id,
                'framework_name': res.framework_name,
                'metrics': [],
            }
            cur_metric = {
                'metric_id': res.metric_id,
                'metric_name': res.metric_name,
                'predefined_weight': res.metric_predefined_weight,
                'indicators': [],
            }

        if res.metric_id != cur_metric['metric_id']:
            # New metric
            cur_framework['metrics'].append(cur_metric)
            cur_metric = {
                'metric_id': res.metric_id,
                'metric_name': res.metric_name,
                'predefined_weight': res.metric_predefined_weight,
                'indicators': []
            }

        cur_metric['indicators'].append({
            'indicator_id': res.indicator_id,
            'indicator_name': res.indicator_name,
            'predefined_weight': res.indicator_predefined_weight
        })

    # Append final one
    if cur_framework:
        response.append(cur_framework)

    return response, 200


def get_indicator_values(company_id, selected_indicators, selected_years):
    values = db.session.query(DataValue).filter(
        DataValue.company_id == company_id,
        DataValue.indicator_id.in_(selected_indicators),
        DataValue.year.in_(selected_years)
    ).all()

    response = []
    for val in values:
        response_item = {
            'indicator_id': val.indicator_id,
            'year': val.year,
            'value': val.rating
        }
        response.append(response_item)

    return response, 200
