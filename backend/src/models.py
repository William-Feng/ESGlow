from flask_restx import fields

from .config import Config


def user_authentication_models(api):
    user_model = api.model('User', {
        'email': fields.String(required=True, description='Email Address', example='example@gmail.com'),
        'password': fields.String(required=True, description='Password', example='Password123')
    })

    register_model = api.model('LoginResponse', {
        'message': fields.String(description='Status message', example='User successfully registered.'),
        'token': fields.String(description='JWT access token', example=f'{Config.JWT_EXAMPLE}')
    })

    login_model = api.model('LoginResponse', {
        'message': fields.String(description='Status message', example='Login successful.'),
        'token': fields.String(description='JWT access token', example=f'{Config.JWT_EXAMPLE}')
    })

    return user_model, register_model, login_model


def password_reset_models(api):
    password_reset_request_model = api.model('Password Reset Request', {
        'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
    })

    password_reset_verify_model = api.model('Password Reset Verify', {
        'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
        'code': fields.String(required=True, description='Verification Code', example="5A03BX"),
    })

    password_reset_change_model = api.model('Password Reset Change', {
        'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
        'new_password': fields.String(required=True, description='New Password', example="password123")
    })

    return password_reset_request_model, password_reset_verify_model, password_reset_change_model


def all_industry_company_framework_indicator_models(api):
    industry_names_model = api.model('IndustryNames', {
        'message': fields.String(description='Status message', example='Industries successfully retrieved.'),
        'industries': fields.List(fields.String(example="Industry 1"), description='List of industries names'),
    })

    company_names_model = api.model('CompanyNames', {
        'message': fields.String(description='Status message', example='Companies successfully retrieved.'),
        'companies': fields.List(fields.String(example="Company 1"), description='List of company names'),
    })

    framework_names_model = api.model('FrameworkNames', {
        'message': fields.String(description='Status message', example='Frameworks successfully retrieved.'),
        'frameworks': fields.List(fields.String(example="Framework 1"), description='List of framework names'),
    })

    indicator_names_model = api.model('IndicatorNames', {
        'message': fields.String(description='Status message', example='Indicators successfully retrieved.'),
        'indicators': fields.List(fields.String(example="Indicator 1"), description='List of indicator names & IDs'),
    })

    return industry_names_model, company_names_model, framework_names_model, indicator_names_model


def specific_industry_company_models(api):
    industry_companies_model = api.model('IndustryCompanies', {
        'message': fields.String(description='Status message', example='Companies for industry successfully retrieved.'),
        'companies': fields.List(fields.Integer(example="Company ID 1"), description='List of company IDs'),
    })

    company_info_fields = {
        'company_id': fields.Integer(description='The ID of the company', example=1),
        'company_name': fields.String(description='The name of the company', example="Company 1"),
        'description': fields.String(description='The description of the company', example="Description for Company 1"),
    }

    company_info_model = api.model('CompanyInfo', {
        'message': fields.String(description='Status message', example='Companies\' information successfully retrieved.'),
        'companies': fields.List(fields.Nested(company_info_fields), description="List of companies' information"),
    })

    return industry_companies_model, company_info_model


def framework_metric_indicator_models(api):
    indicator_model = api.model('Indicator', {
        'indicator_id': fields.Integer(description='The indicator ID', example=1),
        'indicator_name': fields.String(description='The name of the indicator', example='Financial Disclosure Accuracy'),
        'predefined_weight': fields.Float(description='The predefined weight for the indicator', example=0.5),
    })

    metric_model = api.model('Metric', {
        'metric_id': fields.Integer(description='The metric ID', example=6),
        'metric_name': fields.String(description='The name of the metric', example='Corporate Transparency'),
        'predefined_weight': fields.Float(description='The predefined weight for the metric', example=0.3),
        'indicators': fields.List(fields.Nested(indicator_model), description='List of indicators')
    })

    framework_model = api.model('Framework', {
        'framework_id': fields.Integer(description='The framework ID', example=3),
        'framework_name': fields.String(description='The name of the framework', example='ESG Global Standard'),
        'metrics': fields.List(fields.Nested(metric_model), description='List of metrics')
    })

    framework_detailed_model = api.model('FrameworkList', {
        'message': fields.String(description='Status message', example='Frameworks successfully retrieved.'),
        'values': fields.List(fields.Nested(framework_model), description='List of frameworks')
    })

    indicator_value_model = api.model('IndicatorValue', {
        'indicator_id': fields.Integer(required=True, description='The indicator ID', example=12),
        'year': fields.Integer(required=True, description='The year of the indicator', example=2022),
        'value': fields.Float(required=True, description='The specific value of the indicator', example=85)
    })

    indicator_value_detailed_model = api.model('IndicatorValueList', {
        'message': fields.String(description='Status message', example='Values successfully retrieved.'),
        'values': fields.List(fields.Nested(indicator_value_model), description='List of indicator values')
    })

    return framework_detailed_model, indicator_value_detailed_model


def value_calculations(api):
    """
    framework_values_model = api.model("FrameworkValue"), {
        'framework_id' : fields.Integer(required=True, description='The indicator ID of framework', example=12),
        'score' : fields.Integer(required=True, description='Score of the framework', example = 76)
    }
    
    company_values_value_model = api.model('CompanyValue', {
        'id' : fields.Integer(required=True, description='The indicator ID of company', example=12),
        'ESGscore' : fields.Integer(required=True, description='Value of company', example=83),
        'year': fields.Integer(required=True, description='The year of the indicator', example=2022),
        'frameworks' : fields.List(fields.Nested(framework_values_model), description="List of framework scores")
    })
    
    
    company_values_model = api.model('CompanyValues', {
        'message': fields.String(description='Status message', example='Values for company retrieved!'),
        'values': fields.List(fields.Nested(company_values_value_model), description = "Company framework value")
    })
    """
    
    company_values_model = api.model('CompanyValues', {
        'message': fields.String(description='Status message', example='Values for company retrieved!'),
        'values': fields.String(description = "Company framework value")
    })
    
    return company_values_model

    
def custom_framework_models(api):
    custom_framework_model = api.model('CustomFramework', {
        'framework_name': fields.String(required=True, description='Custom framework name'),
        'preferences': fields.List(fields.Nested(api.model('Preferences', {
            'indicator_id': fields.Integer(required=True, description='Indicator ID'),
            'predefined_weight': fields.Float(required=True, description='Predefined weight of the indicator')
        })), required=True, description='List of indicator preferences')
    })

    return custom_framework_model