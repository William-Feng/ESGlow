from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Api, fields, Resource
from flask import request
from .config import JWT_EXAMPLE
from .database import User
from .reset import reset_password_request, reset_password_verify, reset_password_change
from .user import login, register
from .frameworks import frameworks_all, frameworks_company, all_companies, get_company_frameworks


api = Api()


@api.route("/")
class Hello(Resource):
    def get(self):
        return {"message": "Hello, World!"}, 200


user_model = api.model('User', {
    'email': fields.String(required=True, description='Email Address', example='example@gmail.com'),
    'password': fields.String(required=True, description='Password', example='Password123')
})


register_response_model = api.model('LoginResponse', {
    'message': fields.String(description='Status message', example='User successfully registered.'),
    'token': fields.String(description='JWT access token', example=f'{JWT_EXAMPLE}')
})


@api.route("/api/register")
class Register(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'User created successfully.', model=register_response_model)
    @api.response(400, 'Error: user already exists.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']

        response, status_code = register(email, password)
        return response, status_code


login_response_model = api.model('LoginResponse', {
    'message': fields.String(description='Status message', example='Login successful.'),
    'token': fields.String(description='JWT access token', example=f'{JWT_EXAMPLE}')
})


@api.route("/api/login")
class Login(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'Login successful.', model=login_response_model)
    @api.response(400, 'Invalid email or password.')
    def post(self):
        data = api.payload
        email = data['email']
        password = data['password']
        response, status_code = login(email, password)
        return response, status_code


@api.route("/api/user")
class GetUser(Resource):

    @jwt_required()
    def get(self):
        # Decode the JWT token to retrieve the identity
        user_email = get_jwt_identity()

        response = {
            'email': user_email,
            # If we have other user data we want to return in future, add it here
        }

        return response, 200

indicator_value = api.model('IndicatorValue', {
    'indicator_id': fields.Integer(required=True, description='Indicator ID'),
    'year': fields.Integer(required=True, description='Year of the metric'),
    'value': fields.Float(required=True, description='Value of the metric for the year')
})

arg_parser = api.parser()
arg_parser.add_argument('years', type=int, required=True, action='split', help='Years to get indicator values', location='args')
arg_parser.add_argument('indicators', type=int, required=True, action='split', help='Indicator IDs', location='args')

@api.route("/api/indicator-values/<int:company_id>")
class IndicatorValues(Resource):

    @jwt_required()
    @api.expect(arg_parser)
    @api.marshal_list_with(indicator_value, envelope='data')
    def get(self, company_id):
        args = arg_parser.parse_args()
        selected_years = args.get('years', [])
        selected_indicators = args.get('indicators', [])
        response, status_code = get_indicator_values(company_id, selected_years, selected_indicators)
    
        return response, status_code

@api.route("/api/<int:company_id>/frameworks")
class CompanyFrameworks(Resource):
    #TODO req/res models
    def get(self, company_id):
        response, status_code = get_company_frameworks(company_id)
        return response, status_code
        
            
# ======================================================================================
#
# Password-Reset Endpoints
# ===================================================================
#
password_reset_request_model = api.model('Password Reset Request', {
    'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
})


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


password_reset_verify_model = api.model('Password Reset Verify', {
    'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
    'code': fields.String(required=True, description='Verification Code', example="5A03BX"),
})


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


password_reset_change_model = api.model('Password Reset Change', {
    'email': fields.String(required=True, description='Email Address', example="example@gmail.com"),
    'new_password': fields.String(required=True, description='New Password', example="password123")
})


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
# Framework/Metric Selection
# ===================================================================
#


@api.route("/api/frameworks/get-all")
class getFrameworksAll(Resource):
    @api.response(200, 'Frameworks all retrieved!')
    @api.response(401, 'Unauthorised Token')
    @jwt_required()
    def get(self):
        token_identity = get_jwt_identity()
        return frameworks_all(token_identity)


frameworks_get_company = api.model('Framework thru Company', {
    'company': fields.String(required=True, description='Company Name', example="John Street Capital"),
})


@api.route("/api/frameworks/get-company")
class getFrameworksCompany(Resource):
    @api.response(200, 'Frameworks for company retrieved!')
    @api.response(401, 'Unauthorised Token')
    @jwt_required()
    def get(self):
        company = request.args.get('company')
        token_identity = get_jwt_identity()
        return frameworks_company(token_identity, company)



@api.route("/api/frameworks/all-companies")
class getAllCompanies(Resource):
    @api.response(200, 'All companies retrieved!')
    @api.response(401, 'Unauthorised Token')
    @jwt_required()
    def get(self):
        token_identity = get_jwt_identity()
        return all_companies(token_identity)
