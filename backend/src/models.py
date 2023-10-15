from flask_restx import fields

from .config import JWT_EXAMPLE


def user_authentication_models(api):
    user_model = api.model('User', {
        'email': fields.String(required=True, description='Email Address', example='example@gmail.com'),
        'password': fields.String(required=True, description='Password', example='Password123')
    })

    register_model = api.model('LoginResponse', {
        'message': fields.String(description='Status message', example='User successfully registered.'),
        'token': fields.String(description='JWT access token', example=f'{JWT_EXAMPLE}')
    })

    login_model = api.model('LoginResponse', {
        'message': fields.String(description='Status message', example='Login successful.'),
        'token': fields.String(description='JWT access token', example=f'{JWT_EXAMPLE}')
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


def framework_metric_indicator_models(api):
    indicator_model = api.model('Indicator', {
        'indicator_id': fields.Integer(description='The indicator ID', example=1),
        'indicator_name': fields.String(description='The name of the indicator', example='Financial Disclosure Accuracy'),
        'predefined_weight': fields.Float(description='The predefined weight for the indicator', example=0.5),
    })

    metric_model = api.model('Metric', {
        'metric_id': fields.Integer(description='The metric ID', example=6),
        'metric_name': fields.String(description='The name of the metric', example='Corporate Transparency'),
        # If not always present
        'predefined_weight': fields.Float(description='The predefined weight for the metric', required=False, example=0.3),
        'indicators': fields.List(fields.Nested(indicator_model), description='List of indicators')
    })

    framework_model = api.model('Framework', {
        'framework_id': fields.Integer(description='The framework ID', example=3),
        'framework_name': fields.String(description='The name of the framework', example='ESG Global Standard'),
        'metrics': fields.List(fields.Nested(metric_model), description='List of metrics')
    })

    indicator_value_model = api.model('IndicatorValue', {
        'indicator_id': fields.Integer(required=True, description='Indicator ID'),
        'year': fields.Integer(required=True, description='Year of the metric'),
        'value': fields.Float(required=True, description='Value of the metric for the year')
    })

    indicator_arg_parser = api.parser()
    indicator_arg_parser.add_argument('years', type=int, required=True,
                                      action='split', help='Years to get indicator values', location='args')
    indicator_arg_parser.add_argument('indicators', type=int, required=True,
                                      action='split', help='Indicator IDs', location='args')

    return framework_model, indicator_value_model, indicator_arg_parser
