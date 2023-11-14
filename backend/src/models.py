from flask_restx import fields

from .config import Config


class AuthModels:
    @staticmethod
    def user_model(api):
        return api.model('User', {
            'email': fields.String(required=True, description='Email Address', example='example@gmail.com'),
            'password': fields.String(required=True, description='Password', example='Password123')
        })

    @staticmethod
    def register_model(api):
        return api.model('RegisterResponse', {
            'message': fields.String(description='Status message', example='User successfully registered.'),
            'token': fields.String(description='JWT access token', example=f'{Config.JWT_EXAMPLE}')
        })
    
    @staticmethod
    def login_model(api):
        return api.model('LoginResponse', {
        'message': fields.String(description='Status message', example='Login successful.'),
        'token': fields.String(description='JWT access token', example=f'{Config.JWT_EXAMPLE}')
    })


class PasswordResetModels:
    @staticmethod
    def password_reset_request_model(api):
        return api.model('PasswordResetRequest', {
            'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
        })

    @staticmethod
    def password_reset_verify_model(api):
        return api.model('PasswordResetVerify', {
            'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
            'code': fields.String(required=True, description='Verification Code', example="5A03BX"),
        })

    @staticmethod
    def password_reset_change_model(api):
        return api.model('PasswordResetChange', {
            'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
            'new_password': fields.String(required=True, description='New Password', example="password123")
        })


class InfoModels:
    @staticmethod
    def industry_names_model(api):
        return api.model('IndustryNames', {
        'message': fields.String(description='Status message', example='Industries successfully retrieved.'),
        'industries': fields.List(fields.String(example="Industry 1"), description='List of industries names'),
    })

    @staticmethod
    def company_names_model(api):
        return api.model('CompanyNames', {
            'message': fields.String(description='Status message', example='Companies successfully retrieved.'),
            'companies': fields.List(fields.String(example="Company 1"), description='List of company names'),
        })

    @staticmethod
    def framework_names_model(api):
        return api.model('FrameworkNames', {
            'message': fields.String(description='Status message', example='Frameworks successfully retrieved.'),
            'frameworks': fields.List(fields.String(example="Framework 1"), description='List of framework names'),
        })

    @staticmethod
    def indicator_names_model(api):
        return api.model('IndicatorNames', {
            'message': fields.String(description='Status message', example='Indicators successfully retrieved.'),
            'indicators': fields.List(fields.String(example="Indicator 1"), description='List of indicator names & IDs'),
        })
    
    @staticmethod
    def industry_companies_model(api):
        return api.model('IndustryCompanies', {
            'message': fields.String(description='Status message', example='Companies for industry successfully retrieved.'),
            'companies': fields.List(fields.Integer(example="Company ID 1"), description='List of company IDs'),
        })

    @staticmethod
    def company_info_fields(api):
        return {
            'company_id': fields.Integer(description='The ID of the company', example=1),
            'company_name': fields.String(description='The name of the company', example="Company 1"),
            'description': fields.String(description='The description of the company', example="Description for Company 1"),
        }

    @staticmethod
    def company_info_model(api):
        return api.model('CompanyInfo', {
            'message': fields.String(description='Status message', example='Companies\' information successfully retrieved.'),
            'companies': fields.List(fields.Nested(InfoModels.company_info_fields(api)), description="List of companies' information"),
        })
    
    @staticmethod
    def company_values_model(api):
        return api.model('CompanyValues', {
            'message': fields.String(description='Status message', example='Values for company retrieved!'),
            'values': fields.String(description = "Company framework value")
        })


class DataModels:
    def indicator_model(api):
        return api.model('Indicator', {
            'indicator_id': fields.Integer(description='The indicator ID', example=1),
            'indicator_name': fields.String(description='The name of the indicator', example='Financial Disclosure Accuracy'),
            'predefined_weight': fields.Float(description='The predefined weight for the indicator', example=0.5),
        })

    def metric_model(api):
        return api.model('Metric', {
            'metric_id': fields.Integer(description='The metric ID', example=6),
            'metric_name': fields.String(description='The name of the metric', example='Corporate Transparency'),
            'predefined_weight': fields.Float(description='The predefined weight for the metric', example=0.3),
            'indicators': fields.List(fields.Nested(DataModels.indicator_model(api)), description='List of indicators')
        })

    def framework_model(api):
        return api.model('Framework', {
            'framework_id': fields.Integer(description='The framework ID', example=3),
            'framework_name': fields.String(description='The name of the framework', example='ESG Global Standard'),
            'metrics': fields.List(fields.Nested(DataModels.metric_model(api)), description='List of metrics')
        })

    def framework_detailed_model(api):
        return api.model('FrameworkList', {
            'message': fields.String(description='Status message', example='Frameworks successfully retrieved.'),
            'values': fields.List(fields.Nested(DataModels.framework_model(api)), description='List of frameworks')
        })

    def indicator_value_model(api):
        return api.model('IndicatorValue', {
            'indicator_id': fields.Integer(required=True, description='The indicator ID', example=12),
            'year': fields.Integer(required=True, description='The year of the indicator', example=2022),
            'value': fields.Float(required=True, description='The specific value of the indicator', example=85)
        })

    def indicator_value_detailed_model(api):
        return api.model('IndicatorValueList', {
            'message': fields.String(description='Status message', example='Values successfully retrieved.'),
            'values': fields.List(fields.Nested(DataModels.indicator_value_model(api)), description='List of indicator values')
        })


class CustomFrameworkModels:
    @staticmethod
    def preferences_model(api):
        return api.model('Preferences', {
            'indicator_id': fields.Integer(required=True, description='Indicator ID'),
            'predefined_weight': fields.Float(required=True, description='Predefined weight of the indicator')
        })
    
    @staticmethod
    def custom_framework_model(api):
        return api.model('CustomFramework', {
            'framework_name': fields.String(required=True, description='Custom framework name'),
            'preferences': fields.List(fields.Nested(CustomFrameworkModels.preferences_model(api)), required=True, description='List of indicator preferences')
        })
    