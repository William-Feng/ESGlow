from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
import uuid

from .config import VERIFICATION_CODE_LENGTH


db = SQLAlchemy()
bcrypt = Bcrypt()


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(UUID(as_uuid=True),
                        primary_key=True, default=uuid.uuid4)
    name = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    verification_code = db.Column(db.String(length=VERIFICATION_CODE_LENGTH))


class Industry(db.Model):
    __tablename__ = 'industries'

    industry_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)


class Company(db.Model):
    __tablename__ = 'companies'

    company_id = db.Column(db.Integer, primary_key=True)
    industry_id = db.Column(
        db.Integer, db.ForeignKey('industries.industry_id'))
    name = db.Column(db.Text, unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)


class Framework(db.Model):
    __tablename__ = 'frameworks'

    framework_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)


class Metric(db.Model):
    __tablename__ = 'metrics'

    metric_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)


class Indicator(db.Model):
    __tablename__ = 'indicators'

    indicator_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    source = db.Column(db.Text, nullable=False)


class DataValue(db.Model):
    __tablename__ = 'data_values'

    value_id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'))
    indicator_id = db.Column(
        db.Integer, db.ForeignKey('indicators.indicator_id'))
    year = db.Column(db.Integer)
    rating = db.Column(db.Float)


class CompanyFramework(db.Model):
    __tablename__ = 'company_frameworks'

    company_id = db.Column(db.Integer, db.ForeignKey(
        'companies.company_id'), primary_key=True)
    framework_id = db.Column(db.Integer, db.ForeignKey(
        'frameworks.framework_id'), primary_key=True)


class FrameworkMetric(db.Model):
    __tablename__ = 'framework_metrics'

    framework_id = db.Column(db.Integer, db.ForeignKey(
        'frameworks.framework_id'), primary_key=True)
    metric_id = db.Column(db.Integer, db.ForeignKey(
        'metrics.metric_id'), primary_key=True)
    predefined_weight = db.Column(db.Float)


class MetricIndicator(db.Model):
    __tablename__ = 'metric_indicators'

    metric_id = db.Column(db.Integer, db.ForeignKey(
        'metrics.metric_id'), primary_key=True)
    indicator_id = db.Column(db.Integer, db.ForeignKey(
        'indicators.indicator_id'), primary_key=True)
    predefined_weight = db.Column(db.Float)


class CustomFrameworks(db.Model):
    __tablename__ = 'custom_frameworks'

    custom_framework_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'))
    framework_name = db.Column(db.Text, nullable=False)


class CustomFrameworkPreferences(db.Model):
    __tablename__ = 'custom_framework_preferences'

    custom_framework_id = db.Column(db.Integer, db.ForeignKey(
        'custom_frameworks.custom_framework_id'), primary_key=True)
    indicator_id = db.Column(db.Integer, db.ForeignKey(
        'indicators.indicator_id'), primary_key=True)
    weight = db.Column(db.Float)
