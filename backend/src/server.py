from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Api, Resource

from .database import User
from .frameworks import all_frameworks, all_companies, get_framework_info_from_company, get_indicator_values
from .models import user_authentication_models, password_reset_models, framework_metric_indicator_models
from .reset import reset_password_request, reset_password_verify, reset_password_change
from .user import login, register, invalid_auth


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
    @api.response(200, 'User created successfully!', model=register_model)
    @api.response(400, 'User already exists.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']

        return register(email, password)


@api.route("/api/login")
class Login(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'Login successful!', model=login_model)
    @api.response(400, 'Invalid email or password.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']

        return login(email, password)


@api.route("/api/user")
class DecodeUser(Resource):
    @api.response(200, 'User authenticated!')
    @api.response(401, 'Authentication required. Please log in.')
    @jwt_required()
    def get(self):
        # Decode the JWT token to retrieve the identity
        token = get_jwt_identity()

        if not token:
            return invalid_auth()

        response = {
            'email': token,
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
    @api.response(400, 'Email does not exist.')
    def post(self):
        data = api.payload
        email = data['email']

        # Send email, generate code in backend.
        return reset_password_request(email)


@api.route("/api/password-reset/verify")
class PasswordResetVerify(Resource):
    @api.expect(password_reset_verify_model, validate=True)
    @api.response(200, 'Password Successfully Reset!')
    @api.response(400, 'Verification Code is incorrect.')
    @api.response(400, 'Email does not exist.')
    def post(self):
        data = api.payload
        email = data['email']
        code = data['code']

        # Verify user exists in backend.
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            return {"message": "Email does not exist."}, 400

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

framework_model, indicator_value_model = framework_metric_indicator_models(api)


@api.route("/api/companies/all")
class CompaniesAll(Resource):
    @api.response(200, 'All companies retrieved!')
    @api.response(401, 'Authentication required. Please log in.')
    @api.response(404, 'An error occured.')
    @jwt_required()
    def get(self):
        if not get_jwt_identity():
            return invalid_auth()

        return all_companies()


@api.route("/api/frameworks/all")
class FrameworksAll(Resource):
    @api.response(200, 'All frameworks retrieved!')
    @api.response(401, 'Authentication required. Please log in.')
    @api.response(404, 'An error occured.')
    @jwt_required()
    def get(self):
        if not get_jwt_identity():
            return invalid_auth()

        return all_frameworks()


@api.route("/api/frameworks/<int:company_id>")
class FrameworksByCompany(Resource):
    @api.response(200, 'Framework, metric & indicator information for company retrieved!', framework_model)
    @api.response(401, 'Authentication required. Please log in.')
    @api.response(404, 'An error occured.')
    @jwt_required()
    def get(self, company_id):
        if not get_jwt_identity():
            return invalid_auth()

        return get_framework_info_from_company(company_id)


@api.route("/api/values/<int:company_id>/<string:indicator_ids>/<string:years>")
class IndicatorValues(Resource):
    @api.response(200, 'Indicator values for company retrieved!', indicator_value_model)
    @api.response(401, 'Authentication required. Please log in.')
    @api.response(404, 'An error occured.')
    @jwt_required()
    def get(self, company_id, indicator_ids, years):
        if not get_jwt_identity():
            return invalid_auth()

        try:
            selected_indicators = [int(i) for i in indicator_ids.split(',')]
            selected_years = [int(y) for y in years.split(',')]
        except ValueError:
            return {"message": "Invalid indicator_ids or years provided."}, 404

        return get_indicator_values(company_id, selected_indicators, selected_years)
