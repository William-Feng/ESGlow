from .database import DataValue, FrameworkMetric, MetricIndicator, db, bcrypt, Framework, Metric, Indicator, User, Company


def retrieve_frameworks_from_company(company_id):
    """
    Summary:
        Given a company as input, return all frameworks associated with that framework.
    Arguments:
        company (string)
    Returns:
        [
            {
            'framework_id': 1,
            'framework_name': 'Framework',
            'metrics': [
                'metric_id': 2,
                'metric_name': 'Metric',
                'predefined_weight': 40,
                'indicators': [
                    'indicator_id': 2,
                    'indicator_name': 'Indicator',
                    'predefined_weight': 30
                ]
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
            FrameworkMetric.predefined_weight.label("metric_predefined_weight"),
            # Indicators
            Indicator.indicator_id.label("indicator_id"),
            Indicator.name.label("indicator_name"),
            MetricIndicator.predefined_weight.label("indicator_predefined_weight")
        ).distinct()
        .join(FrameworkMetric, Framework.framework_id == FrameworkMetric.framework_id)
        .join(Metric, FrameworkMetric.metric_id == Metric.metric_id)
        .join(MetricIndicator, Metric.metric_id == MetricIndicator.metric_id)
        .join(Indicator, MetricIndicator.indicator_id == Indicator.indicator_id)
        .join(DataValue, Indicator.indicator_id == DataValue.indicator_id)
        .join(Company, DataValue.company_id == Company.company_id)
        .filter(Company.company_id == company_id)
        .order_by(Framework.framework_id)
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
    

def get_indicator_values(company_id, selected_years, selected_indicators):
    indicator_values = db.session.query(DataValue).filter(
        DataValue.company_id == company_id,
        DataValue.year.in_(selected_years),
        DataValue.indicator_id.in_(selected_indicators)
    ).all()

    # Format for response
    response = []
    for val in indicator_values:
        response_item = {
            'indicator_id': val.indicator_id,
            'year': val.year,
            'value': val.rating
        }
        response.append(response_item)

    return response, 200
