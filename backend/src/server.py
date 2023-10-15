from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Api, Resource

from .database import User
from .frameworks import all_frameworks, all_companies, get_framework_info_from_company, get_indicator_values
from .models import user_authentication_models, password_reset_models, framework_metric_indicator_models
from .reset import reset_password_request, reset_password_verify, reset_password_change
from .user import login, register


api = Api()


# ===================================================================
#
# User Registration & Login Endpoints
#
# ===================================================================

user_model, register_model, login_model = user_authentication_models(api)


@api.route("/api/register")
class Register(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'User created successfully.', model=register_model)
    @api.response(400, 'Error: user already exists.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']

        response, status_code = register(email, password)
        return response, status_code


@api.route("/api/login")
class Login(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'Login successful.', model=login_model)
    @api.response(400, 'Invalid email or password.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']
        response, status_code = login(email, password)
        return response, status_code


@api.route("/api/user")
class DecodeUser(Resource):
    @jwt_required()
    def get(self):
        # Decode the JWT token to retrieve the identity
        user_email = get_jwt_identity()

        response = {
            'email': user_email,
            # If we have other user data we want to return in future, add it here
        }

        return response, 200


# ===================================================================
#
# Password-Reset Endpoints
#
# ===================================================================

password_reset_request_model, password_reset_verify_model, password_reset_change_model = password_reset_models(
    api)


@api.route("/api/password-reset/request")
class PasswordResetRequest(Resource):
    @api.expect(password_reset_request_model, validate=True)
    @api.response(200, 'Password Reset Request Successful!')
    @api.response(400, 'Email does not exist!')
    def post(self):
        data = api.payload
        email = data['email']

        # Send email, generate code in backend.
        return reset_password_request(email)


@api.route("/api/password-reset/verify")
class PasswordResetVerify(Resource):
    @api.expect(password_reset_verify_model, validate=True)
    @api.response(200, 'Password Successfully Reset!')
    @api.response(400, 'Verification Code is incorrect!')
    @api.response(400, 'Email does not exist!')
    def post(self):
        data = api.payload
        email = data['email']
        code = data['code']

        # Verify user exists in backend.
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            return {"message": "Email does not exist!"}, 400

        # Request a password reset.
        return reset_password_verify(email, code)


@api.route("/api/password-reset/change")
class PasswordResetChange(Resource):
    @api.expect(password_reset_change_model, validate=True)
    @api.response(200, 'Password Successfully Reset!')
    @api.response(400, 'Email is incorrect!')
    def post(self):
        data = api.payload
        email = data['email']
        new_password = data['new_password']
        return reset_password_change(email, new_password)


# ===================================================================
#
# Company/Framework/Metric/Indicator Selection
#
# ===================================================================

framework_model, indicator_value_model, indicator_arg_parser = framework_metric_indicator_models(
    api)


@api.route("/api/companies/all")
class AllCompanies(Resource):
    @api.response(200, 'All companies retrieved!')
    @jwt_required()
    def get(self):
        return all_companies()


@api.route("/api/frameworks/all")
class FrameworksAll(Resource):
    @api.response(200, 'All frameworks retrieved!')
    @jwt_required()
    def get(self):
        return all_frameworks()


@api.route("/api/frameworks/company/<int:company_id>")
class FrameworksByCompany(Resource):
    @api.response(200, 'Frameworks for company retrieved!', framework_model)
    @jwt_required()
    def get(self, company_id):
        return get_framework_info_from_company(company_id)


@api.route("/api/indicator-values/<int:company_id>")
class IndicatorValues(Resource):
    @api.expect(indicator_arg_parser)
    @api.marshal_list_with(indicator_value_model, envelope='data')
    @jwt_required()
    def get(self, company_id):
        args = indicator_arg_parser.parse_args()
        selected_years = args.get('years', [])
        selected_indicators = args.get('indicators', [])
        response, status_code = get_indicator_values(
            company_id, selected_years, selected_indicators)

        return response, status_code
