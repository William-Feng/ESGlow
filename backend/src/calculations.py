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
)


def get_company_values(companies):
    """
    Given a list of companies, return all values of the companies

    Args:
        companies ([int]): list of company ids

    Returns:
        {
            company_id:
            {
                id: Company Id
                ESGscore: Int
                year: Int
                frameworks: [ {name: , score: } ...]
            }
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
        .filter(
            FrameworkMetric.framework_id.in_(
                [framework.framework_id for framework in frameworks]
            )
        )
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
            DataValue.indicator_id.in_(
                [indicator.indicator_id for indicator in indicators]
            ),
        )
        .scalar()
    )

    # Calculate the data values of each indicator, then the data values of all metrics.
    metric_values = {}
    for metric in metrics:
        metric_values[metric.metric_id] = calculate_metric(
            metric, most_recent_year, company
        )

    # Calculate the value of each framework.
    framework_values = {}
    for framework in frameworks:
        framework_values[framework.framework_id] = {
            "framework_id": framework.framework_id,
            "name": framework.name,
            "score": calculate_framework(framework, metric_values),
        }

    return {
        "message": "Values for company retrieved!",
        "value": {
            "id": company,
            "ESGscore": sum(
                [framework["score"] for framework in framework_values.values()]
            )
            // len(framework_values),
            "year": most_recent_year,
            "frameworks": [framework_values[key] for key in framework_values.keys()],
        },
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
        most_recent_data_value = (
            db.session.query(DataValue.rating)
            .filter(
                DataValue.company_id == company,
                DataValue.indicator_id == indicator.indicator_id,
                DataValue.year == most_recent_year,
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
    existing_industry = Industry.query.filter_by(industry_id=industry_id).first()
    if not existing_industry:
        return ({"message": "Invalid industry id provided"}, 400)

    # Find all companies associated with the industry
    companies = [
        company[0]
        for company in db.session.query(Company.company_id).filter(
            Company.industry_id == industry_id
        )
    ]

    values = get_company_values(companies)
    scores = []
    for company_value in values.values():
        # Calculate value of all framework_scores
        company_value = company_value["value"]
        framework_scores = sum(
            [framework["score"] for framework in company_value["frameworks"]]
        )
        scores.append(framework_scores / len(company_value["frameworks"]))

    if len(scores) == 0:
        return ({"message": "Industry has no companies!"}, 400)

    return (
        {
            "message": "Values for industry retrieved!",
            "min_score": min(scores),
            "max_score": max(scores),
            "average_score": sum(scores) // len(scores),
        },
        200,
    )


def get_company_industry_ranking(company_id):
    """
    Given a company_id, search thru it's industry, and determine it's ranking.

    Args:
        company_id (int):
    Return:
        {
            message: string,
            ranking: int
        },
        HTTP Status Code

    """

    # Grab Company Object
    company = db.session.query(Company).filter(Company.company_id == company_id).first()
    if not company:
        return {"message": "Invalid company id supplied!"}, 400
    print(company)

    # Determine all industry rankings...
    company_scores = get_industry_company_values(company.industry_id)

    # Brute Force Method
    ranking = -1
    company_score = -1
    for index, (id, score) in enumerate(company_scores):
        if id == company_id:
            ranking = index + 1
            company_score = score
            break

    return {
        "message": "Ranking in industry determined!",
        "ranking": ranking,
        "company_score": company_score,
        "industry_company_count": len(company_scores),
    }, 200


def get_industry_company_values(industry_id):
    """
    Given an industry id, find all of the companies associated with that industry.
    Return all of these companies with their scores.

    Args:
        industry_id (number)
    Return:
        [(company_id, company_score)], descending order
    """

    company_scores = []

    companies = [
        company[0]
        for company in db.session.query(Company.company_id).filter(
            Company.industry_id == industry_id
        )
    ]

    values = get_company_values(companies)
    for company_key in values:
        # Calculate value of all framework_scores
        company_value = values[company_key]["value"]
        framework_scores = sum(
            [framework["score"] for framework in company_value["frameworks"]]
        )
        company_scores.append(
            (company_key, framework_scores / len(company_value["frameworks"]))
        )

    print(company_scores)
    return sorted(company_scores, key=lambda x: (-x[1], x[0]))



def get_company_graph_values(company_id):
    """
    Given a company_id,
    Return a list of tuples containing years and values for that year.

    Args:
        company_id (int)
    Return:
        {
            message:
            year_values: [(year, score)]
        },
        HTTP Status Code
    """
    company = db.session.query(Company).filter(Company.company_id == company_id).first()
    if not company:
        return {"message": "Invalid company id supplied!"}, 400

    year_values = get_company_year_scores(company_id)

    return {
        "message": "Graph Values for Company Returned!",
        "year_values": year_values,
    }, 200


def get_company_year_scores(company):
    """
    Given a company id, return a list of (year, score) tuples

    Args:
        company (int)
    Return:
        [(year, score)]
    """
    year_scores = []
    frameworks = (
        db.session.query(Framework)
        .join(CompanyFramework, Framework.framework_id == CompanyFramework.framework_id)
        .filter(CompanyFramework.company_id == company)
        .all()
    )

    metrics = (
        db.session.query(Metric)
        .join(FrameworkMetric, Metric.metric_id == FrameworkMetric.metric_id)
        .filter(
            FrameworkMetric.framework_id.in_(
                [framework.framework_id for framework in frameworks]
            )
        )
        .all()
    )

    indicators = (
        db.session.query(Indicator)
        .join(MetricIndicator, Indicator.indicator_id == MetricIndicator.indicator_id)
        .filter(MetricIndicator.metric_id.in_([metric.metric_id for metric in metrics]))
        .all()
    )

    # For each year,find
    years = (
        db.session.query(DataValue.year.distinct())
        .filter(
            DataValue.company_id == company,
            DataValue.indicator_id.in_(
                [indicator.indicator_id for indicator in indicators]
            ),
        )
        .all()
    )

    years = sorted([year[0] for year in years])
    print(years)
    # Calculate the data values of each indicator, then the data values of all metrics.
    for year in years:
        metric_values = {}
        for metric in metrics:
            metric_values[metric.metric_id] = calculate_metric(metric, year, company)

        # Calculate the value of each framework.
        framework_values = {}
        for framework in frameworks:
            framework_values[framework.framework_id] = {
                "framework_id": framework.framework_id,
                "name": framework.name,
                "score": calculate_framework(framework, metric_values),
            }

        year_scores.append(
            (
                year,
                sum([framework["score"] for framework in framework_values.values()])
                / len(framework_values),
            )
        )

    return year_scores


def get_all_years():
    years = (
        db.session.query(DataValue.year.distinct())
        .all()
    )

    return sorted([year[0] for year in years])

def get_indicator_graph_values(indicator_id):
    """
    Given an indicator ID, return the value for it each year.

    Args:
        indicator_id (number):
        
    Return:
        {
            message: ,
            indicator_scores: [(year, score)]
        }, 
        HTTP Status Code
    """
    
    # Check if indicator id exists
    indicator = db.session.query(Indicator).filter(Indicator.indicator_id == indicator_id).first()
    if not indicator:
        return {
            "message" : "Invalid indicator id provided"
        }, 400
        
    
    
    # This all years...
    years = get_all_years()
    # Get all data Values for indicator?
    
    # For each year, find all DataValues with Indicator.
    indicator_years = []
    for year in years:
        data_values = db.session.query(DataValue).filter(DataValue.year == year, DataValue.indicator_id == indicator_id).all()
        if data_values:
            # Average the values
            score = sum(data_value.rating for data_value in data_values) / len(data_values)
            indicator_years.append((year, score))
        
    return {
        "message" : "Graph Values for Indicator Returned!",
        "indicator_scores" : indicator_years
    }, 200
    
    
def get_years():
    """
    Retrieve all unique years as a list of years.
    Return:
        {
            message: ,
            years: [2018,2019...]
        }
    """

    years = sorted(
        [year[0] for year in db.session.query(DataValue.year.distinct()).all()]
    )
    return {"message": "All years retrieved!", "years": years}
