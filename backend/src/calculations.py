from .database import db, Company, Industry, Framework, Metric, Indicator, DataValue, CompanyFramework, FrameworkMetric, MetricIndicator

def get_company_values(company):
    """
    Given a Company Id, return company_values.

    Args:
        company (Int): Company Id
    Return:
        {
            id: Company Id
            ESGscore: Int
            year: Int
            frameworks: [ {name: , score: } ...]
        }
    """
    
    # Find All Frameworks -> Metrics -> Indicators
    
    frameworks = (
        db.session.query(Framework)
        .join(CompanyFramework, Framework.framework_id == CompanyFramework.framework_id)
        .filter(CompanyFramework.company_id == company)
        .all()
    )
    
    metrics = (
        db.session.query(Metric)
        .join(FrameworkMetric, Metric.metric_id == FrameworkMetric.metric_id)
        .filter(FrameworkMetric.framework_id.in_([framework.framework_id for framework in frameworks]))
        .all()
    )
    
    indicators = (
        db.session.query(Indicator)
        .join(MetricIndicator, Indicator.indicator_id == MetricIndicator.indicator_id)
        .filter(MetricIndicator.metric_id.in_([metric.metric_id for metric in metrics]))
        .all()
    )

    # Find the most recent year from all the Data Values associated with company.
    most_recent_year = (
        db.session.query(db.func.max(DataValue.year))
        .filter(
            DataValue.company_id == company,
            DataValue.indicator_id.in_([indicator.indicator_id for indicator in indicators]),
        )
        .scalar()
    )
    
    print(f"Most recent year is {most_recent_year}")
 
    # Calculate the data values of each indicator, then the data values of all metrics.
    metric_values = {}
    for metric in metrics:
        metric_values[metric.metric_id] = calculate_metric(metric, most_recent_year, company)
        
    # Calculate the value of each framework.
    framework_values = {}
    for framework in frameworks:
        framework_values[framework.framework_id] = {
            'framework_id' : framework.framework_id,
            'score' : calculate_framework(framework, metric_values)
        }
        
    return {
        'message' : "Values for company retrieved!",
        'value' : {
            'id': company,
            'ESGscore': sum([framework['score'] for framework in framework_values])//len(framework_values),
            'year': most_recent_year,
            'frameworks': framework_values
        }        
    }
    

def calculate_framework(framework, metric_values):
    """
    Given a framework, find all of the metrics associated with it.
    Multiply the predefined weight by the metric values, and return the sum.

    Args:
        framework (Framework): 
        metric_values ([int]): 
    Return:
        framework_value(int)
    """
    
    framework_metrics = (
        db.session.query(Metric, FrameworkMetric.predefined_weight)
        .join(FrameworkMetric, Metric.metric_id == FrameworkMetric.metric_id)
        .filter(FrameworkMetric.framework_id == framework.framework_id)
        .all()
    )
    
    framework_value = 0
    for metric, weight in framework_metrics:
        framework_value += metric_values[metric.metric_id] * weight
    
    return framework_value
    
    

def calculate_metric(metric, most_recent_year, company):
    """
    Given a metric, and the list of valid data_values
    Find the data_values and indicators for the most_recent_year
    Use Company id to find valid data_values.
    Args:
        metric (Metric)
        data_values ([DataValue])
    Return:
        weighted_sum (int): Sum of data_value of indicator * MetricIndicator.predefined_weight
    """
    
    indicator_weights = (
        db.session.query(Indicator, MetricIndicator.predefined_weight)
        .join(MetricIndicator, Indicator.indicator_id == MetricIndicator.indicator_id)
        .filter(MetricIndicator.metric_id == metric.metric_id)
        .all()
    )
    
    weighted_sum = 0
    for indicator, weight in indicator_weights:
        print(indicator.name)
        most_recent_data_value = (
            db.session.query(DataValue.rating)
            .filter(
                DataValue.company_id == company,
                DataValue.indicator_id == indicator.indicator_id,
                DataValue.year == most_recent_year
            )
            .scalar()
        )

        if most_recent_data_value is not None:
            weighted_sum += most_recent_data_value * weight
    
    return weighted_sum

    
    
"""
def get_framework_values():

    Given a framework_id, return the max, min and mean of the company, across 
    all frameworks it is in.

    Args:
        framework_id (int): _description_
    Return:
        { max, min, mean }
 
    # all Companies under framework
    companies = (
        db.session.query(Company)
        .join(CompanyFramework, Company.company_id == CompanyFramework.company_id)
        .filter(CompanyFramework.framework_id == framework)
        .all()
    )
    # Get all Indicators in framework
    indicators = (
        db.session.query(Indicator)
        .join(MetricIndicator, Indicator.indicator_id == MetricIndicator.indicator_id)
        .join(FrameworkMetric, MetricIndicator.metric_id == FrameworkMetric.metric_id)
        .filter(FrameworkMetric.framework_id == framework)
        .all()
    )

    # Get the filtered data_values, for the most recent year with data.
    data_values = (
        db.session.query(DataValue)
        .filter(
            DataValue.company_id.in_([company.company_id for company in companies]),
            DataValue.indicator_id.in_([indicator.indicator_id for indicator in indicators])
        )
        .all()
    )

    most_recent_year = max(data_value.year for data_value in data_values if data_value.year is not None)
    filtered_data_values = [data_value for data_value in data_values if data_value.year == most_recent_year]
        
    # Now, given each company, rank them.
    # Find average score, max scoring company, min scoring company, return associated values
    # Dict of { company: score }?
"""