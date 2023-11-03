from .database import db, Company, Industry, Framework, Metric, Indicator, DataValue, CompanyFramework, FrameworkMetric, MetricIndicator



def get_company_values(companies):
    """
    Given a list of companies, return all values of the companies

    Args:
        companies ([int]): list of company ids

    Returns:
        {
            company_id: company_value...
        }
    """
    values = {}
    for company in companies:
        values[company] = get_company_value(company)
    return values
    

def get_company_value(company):
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
            'name' : framework.name,
            'score' : calculate_framework(framework, metric_values)
        }
        
    return {
        'message' : "Values for company retrieved!",
        'value' : {
            'id': company,
            'ESGscore': sum([framework['score'] for framework in framework_values.values()])//len(framework_values),
            'year': most_recent_year,
            'frameworks': [framework_values[key] for key in framework_values.keys()]
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

    
def get_industry_values(industry_id):
    """
    Given a industry_id, return the min, max and average score of the industry.

    Args:
        industry_id (int): Id for a given Industry
    Return:
        {
            message: 
            min_score: ,
            max_score: ,
            average_score: 
        }
    """
    
    
    # Find all companies associated with the industry
    companies = db.session.query(Company).filter(Company.industry_id == industry_id).all()
    values = get_company_values(companies)
    return ({
        "message" : "Values for industry retrieved!",
        "min_score": min(values.values()),
        "max_score": max(values.values()),
        "average_score": sum(values.values()) // len(values)
        }, 
        200)
    