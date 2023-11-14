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
    create_custom_framework,
    get_custom_frameworks,
    delete_custom_framework
)
from .models import(
    AuthModels,
    PasswordResetModels,
    InfoModels,
    DataModels,
    CustomFrameworkModels,
    GraphModels
)
from .reset import reset_password_request, reset_password_verify, reset_password_change
from .user import login, register, get_user
from .calculations import (
    get_company_graph_values,
    get_company_values,
    get_indicator_graph_values,
    get_industry_values,
    get_company_industry_ranking,
    get_years,
)

api = Api()
jwt = JWTManager()


# ===================================================================
#
# User Registration & Login Endpoints
#
# ===================================================================


@api.route("/api/register")
class Register(Resource):
    @api.expect(AuthModels.user_model(api), validate=True)
    @api.response(200, "User created successfully!", model=AuthModels.register_model(api))
    @api.response(400, "User already exists.")
    def post(self):
        data = api.payload
        name = data["name"]
        email = data["email"]
        password = data["password"]

        return register(name, email, password)


@api.route("/api/login")
class Login(Resource):
    @api.expect(AuthModels.user_model(api), validate=True)
    @api.response(200, "Login successful!", model=AuthModels.login_model(api))
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
    @api.response(200, "User authenticated!", model=AuthModels.user_decode_model(api))
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


@api.route("/api/password-reset/request")
class PasswordResetRequest(Resource):
    @api.expect(PasswordResetModels.password_reset_request_model(api), validate=True)
    @api.response(200, "Password Reset Request Successful!")
    @api.response(400, "Email does not exist.")
    def post(self):
        data = api.payload
        email = data["email"]

        # Send email, generate code in backend.
        return reset_password_request(email)


@api.route("/api/password-reset/verify")
class PasswordResetVerify(Resource):
    @api.expect(PasswordResetModels.password_reset_verify_model(api), validate=True)
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
    @api.expect(PasswordResetModels.password_reset_change_model(api), validate=True)
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



@api.route("/api/industries/all")
class IndustriesAll(Resource):
    @api.response(200, "All industries retrieved!", model=InfoModels.industry_names_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "No industries found.")
    @jwt_required()
    def get(self):
        return all_industries()


@api.route("/api/companies/all")
class CompaniesAll(Resource):
    @api.response(200, "All companies retrieved!", model=InfoModels.company_names_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "No companies found.")
    @jwt_required()
    def get(self):
        return all_companies()


@api.route("/api/frameworks/all")
class FrameworksAll(Resource):
    @api.response(200, "All frameworks retrieved!", model=InfoModels.framework_names_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "No frameworks found.")
    @jwt_required()
    def get(self):
        return all_frameworks()


@api.route("/api/indicators/all")
class IndicatorsAll(Resource):
    @api.response(200, "All indicators retrieved!", model=InfoModels.indicator_names_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "No indicators found.")
    @jwt_required()
    def get(self):
        return all_indicators()


@api.route("/api/years/all")
class AllYears(Resource):
    @api.response(200, "All years retrieved!", model=InfoModels.all_years_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @jwt_required()
    def get(self):
        return get_years()


@api.route("/api/industries/<string:industry_name>")
class CompaniesByIndustry(Resource):
    @api.response(
        200,
        "Companies for industry successfully retrieved!",
        model=InfoModels.industry_companies_model(api),
    )
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Industry not found.")
    @jwt_required()
    def get(self, industry_name):
        return get_companies_by_industry(industry_name)


@api.route("/api/companies/<string:company_ids>")
class CompanyInformation(Resource):
    @api.response(200, "Companies' information successfully retrieved!", model=InfoModels.company_info_model(api))
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
        model=DataModels.framework_detailed_model(api),
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
        model=DataModels.indicator_value_detailed_model(api),
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
# Overview Values Calculation
#
# ===================================================================



@api.route("/api/values/company/<string:company_id>")
class CompanyValues(Resource):
    @api.response(200, "Values for company retrieved!", model=InfoModels.company_values_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid company id provided")
    @jwt_required()
    def get(self, company_id):
        try:
            selected_companies = [int(i) for i in company_id.split(",")]
        except ValueError:
            return {"message": "Invalid company id provided"}, 400

        return get_company_values(selected_companies), 200


@api.route("/api/values/industry/<int:industry_id>")
class IndustryValues(Resource):
    @api.response(200, "Values for industry retrieved!", model=DataModels.industry_values_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid industry id or industry has no companies")
    @jwt_required()
    def get(self, industry_id):
        return get_industry_values(industry_id)


@api.route("/api/values/ranking/company/<int:company_id>")
class CompanyRanking(Resource):
    @api.response(200, "Ranking in industry determined!", model=DataModels.company_ranking_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid company id supplied!")
    @jwt_required() 
    def get(self, company_id):
        return get_company_industry_ranking(company_id)


@api.route("/api/values/graph/company/<int:company_id>")
class GraphCompanyValues(Resource):
    @api.response(200, "Graph Values for Company Returned!", model=GraphModels.company_values_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid company id provided")
    @jwt_required()
    def get(self, company_id):
        return get_company_graph_values(company_id)


@api.route("/api/values/graph/indicator/<int:indicator_id>")
class GraphIndicatorValues(Resource):
    @api.response(200, "Graph Values for Indicator Returned!", model=GraphModels.indicator_values_model(api))
    @api.response(401, "Authentication required. Please log in.")
    @api.response(400, "Invalid indicator id provided")
    @jwt_required()
    def get(self, indicator_id):
        return get_indicator_graph_values(indicator_id)


# ===================================================================
#
# Custom Frameworks
#
# ===================================================================



@api.route("/api/custom-frameworks")
class CustomFrameworkList(Resource):
    # Create a new custom framework for a user
    @api.response(201, 'Custom framework for user created successfully!', model=CustomFrameworkModels.custom_framework_model(api))
    @api.response(401, 'Authentication required. Please log in.')
    @api.response(400, 'Invalid custom framework input.')
    @jwt_required()
    def post(self):
        data = api.payload
        email = get_jwt_identity()

        # Verify user exists in backend.
        user = User.query.filter_by(email=email).first()
        if not user:
            return {"message": "User not found."}, 400

        return create_custom_framework(data, user)

    # Retrieve all the custom frameworks associated with a user
    @api.response(200, 'Custom frameworks retrieved successfully.', model=CustomFrameworkModels.custom_framework_data_model(api))
    @api.response(401, 'Authentication required. Please log in.')
    @jwt_required()
    def get(self):
        email = get_jwt_identity()

        # Verify user exists in backend.
        user = User.query.filter_by(email=email).first()
        if not user:
            return {"message": "User not found."}, 400

        return get_custom_frameworks(user)


@api.route("/api/custom-frameworks/<int:framework_id>")
class CustomFramework(Resource):
    @api.response(200, 'Custom framework deleted successfully.')
    @api.response(400, 'Custom framework not found.')
    @api.response(401, 'Authentication required. Please log in.')
    @jwt_required()
    def delete(self, framework_id):
        email = get_jwt_identity()

        # Verify user exists in backend.
        user = User.query.filter_by(email=email).first()
        if not user:
            return {"message": "User not found."}, 400

        return delete_custom_framework(user, framework_id)
