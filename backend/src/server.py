from flask_jwt_extended import get_jwt_identity, jwt_required, JWTManager
from flask_restx import Api, Resource

from .database import User
from .frameworks import (
    all_industries,
    all_companies,
    all_frameworks,
    all_indicators,
    get_companies_by_industry,
    get_framework_info_from_company,
    get_indicator_values,
    get_company_info,
)
from .models import (
    user_authentication_models,
    password_reset_models,
    all_industry_company_framework_indicator_models,
    specific_industry_company_models,
    framework_metric_indicator_models,
    value_calculations,
)
from .reset import reset_password_request, reset_password_verify, reset_password_change
from .user import login, register, get_user
from .calculations import (
    get_company_values,
    get_industry_values,
    get_company_industry_ranking,
)

api = Api()
jwt = JWTManager()


# ===================================================================
#
# User Registration & Login Endpoints
#
# ===================================================================

user_model, register_model, login_model = user_authentication_models(api)


@api.route("/api/register")
class Register(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, "User created successfully!", model=register_model)
    @api.response(400, "User already exists.")
    def post(self):
        data = api.payload
        name = data["name"]
        email = data["email"]
        password = data["password"]

        return register(name, email, password)


@api.route("/api/login")
class Login(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, "Login successful!", model=login_model)
    @api.response(400, "Invalid email or password.")
    def post(self):
        data = api.payload
        email = data["email"]
        password = data["password"]

        return login(email, password)


# Callback for invalid tokens
@jwt.invalid_token_loader
def invalid_token_response(invalid_token):
    return {
        "message": "Authentication required. Please log in.",
        "error": "invalid_token",
        "description": str(invalid_token),
    }, 401


@api.route("/api/user")
class DecodeUser(Resource):
    @api.response(200, "User authenticated!")
    @api.response(401, "Authentication required. Please log in.")
    @jwt_required()
    def get(self):
        # Decode the JWT token to retrieve the identity
        token = get_jwt_identity()

        return get_user(token)


# ===================================================================
#
# Password-Reset Endpoints
#
# ===================================================================

(
    password_reset_request_model,
    password_reset_verify_model,
    password_reset_change_model,
) = password_reset_models(api)


@api.route("/api/password-reset/request")
class PasswordResetRequest(Resource):
    @api.expect(password_reset_request_model, validate=True)
    @api.response(200, "Password Reset Request Successful!")
    @api.response(400, "Email does not exist.")
    def post(self):
        data = api.payload
        email = data["email"]

        # Send email, generate code in backend.
        return reset_password_request(email)


@api.route("/api/password-reset/verify")
class PasswordResetVerify(Resource):
    @api.expect(password_reset_verify_model, validate=True)
    @api.response(200, "Password Successfully Reset!")
    @api.response(400, "Verification Code is incorrect.")
    @api.response(400, "Email does not exist.")
    def post(self):
        data = api.payload
        email = data["email"]
        code = data["code"]

        # Verify user exists in backend.
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            return {"message": "Email does not exist."}, 400

        # Request a password reset.
        return reset_password_verify(email, code)


@api.route("/api/password-reset/change")
class PasswordResetChange(Resource):
    @api.expect(password_reset_change_model, validate=True)
    @api.response(200, "Password Successfully Reset!")
    @api.response(400, "Email is incorrect.")
    def post(self):
        data = api.payload
        email = data["email"]
        new_password = data["new_password"]

        return reset_password_change(email, new_password)


# ===================================================================
#
# Company/Framework/Metric/Indicator Selection
#
# ===================================================================

(
    industry_names_model,
    company_names_model,
    framework_names_model,
    indicator_names_model,
) = all_industry_company_framework_indicator_models(api)
industry_companies_model, company_info_model = specific_industry_company_models(api)
(
    framework_detailed_model,
    indicator_value_detailed_model,
) = framework_metric_indicator_models(api)


@api.route("/api/industries/all")
class IndustriesAll(Resource):
    @api.response(200, "All industries retrieved!", model=industry_names_model)
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "No industries found.")
    @jwt_required()
    def get(self):
        return all_industries()


@api.route("/api/companies/all")
class CompaniesAll(Resource):
    @api.response(200, "All companies retrieved!", model=company_names_model)
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "No companies found.")
    @jwt_required()
    def get(self):
        return all_companies()


@api.route("/api/frameworks/all")
class FrameworksAll(Resource):
    @api.response(200, "All frameworks retrieved!", model=framework_names_model)
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "No frameworks found.")
    @jwt_required()
    def get(self):
        return all_frameworks()


@api.route("/api/indicators/all")
class IndicatorsAll(Resource):
    @api.response(200, "All indicators retrieved!", model=indicator_names_model)
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "No indicators found.")
    @jwt_required()
    def get(self):
        return all_indicators()


@api.route("/api/industries/<string:industry_name>")
class CompaniesByIndustry(Resource):
    @api.response(
        200,
        "Companies for industry successfully retrieved!",
        model=industry_companies_model,
    )
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Industry not found.")
    @jwt_required()
    def get(self, industry_name):
        return get_companies_by_industry(industry_name)


@api.route("/api/companies/<string:company_ids>")
class CompanyInformation(Resource):
    @api.response(200, "Companies' information successfully retrieved!")
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Company not found.")
    def get(self, company_ids):
        try:
            selected_companies = [int(i) for i in company_ids.split(",")]
        except ValueError:
            return {"message": "Invalid company_ids provided."}, 400

        return get_company_info(selected_companies)


@api.route("/api/frameworks/<int:company_id>")
class FrameworksByCompany(Resource):
    @api.response(
        200,
        "Framework, metric & indicator information for company successfully retrieved!",
        model=framework_detailed_model,
    )
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid company.")
    @jwt_required()
    def get(self, company_id):
        return get_framework_info_from_company(company_id)


@api.route("/api/values/<int:company_id>/<string:indicator_ids>/<string:years>")
class IndicatorValues(Resource):
    @api.response(
        200,
        "Indicator values for company successfully retrieved!",
        model=indicator_value_detailed_model,
    )
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid company, indicator or none found.")
    @jwt_required()
    def get(self, company_id, indicator_ids, years):
        try:
            selected_indicators = [int(i) for i in indicator_ids.split(",")]
            selected_years = [int(y) for y in years.split(",")]
        except ValueError:
            return {"message": "Invalid indicator_ids or years provided."}, 400

        return get_indicator_values(company_id, selected_indicators, selected_years)


# ===================================================================
#
# Company/Framework Calculations
#
# ===================================================================


company_values_model = value_calculations(api)


@api.route("/api/values/<string:company_id>")
class CompanyValues(Resource):
    @api.response(200, "Values for company retrieved!", model=company_values_model)
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid company id provided")
    @jwt_required()
    def get(self, company_id):
        try:
            selected_companies = [int(i) for i in company_id.split(",")]
        except ValueError:
            return {"message": "Invalid company id provided"}, 400

        return get_company_values(selected_companies), 200


@api.route("/api/values/<int:industry_id>")
class IndustryValues(Resource):
    # TODO: Model has been removed for error
    @api.response(200, "Values for industry retrieved!")
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid industry id provided")
    @api.response(400, "Industry has no companies!")
    @jwt_required()
    def get(self, industry_id):
        return get_industry_values(industry_id)


@api.route("/api/values/ranking/company/<int:company_id>")
class CompanyRanking(Resource):
    @api.response(200, "Ranking in industry determined!")
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid company id supplied!")
    @jwt_required()
    def get(self, company_id):
        return get_company_industry_ranking(company_id)
