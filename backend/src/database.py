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
    email = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    verification_code = db.Column(db.Text(length=VERIFICATION_CODE_LENGTH))


class Company(db.Model):
    __tablename__ = 'companies'

    company_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)
    description = db.Column(db.Text)


class Framework(db.Model):
    __tablename__ = 'frameworks'

    framework_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)
    description = db.Column(db.Text)


class Metric(db.Model):
    __tablename__ = 'metrics'

    metric_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)


class Indicator(db.Model):
    __tablename__ = 'indicators'

    indicator_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    source = db.Column(db.Text)


class DataValue(db.Model):
    __tablename__ = 'data_values'

    value_id = db.Column(db.Integer, primary_key=True)
    indicator_id = db.Column(
        db.Integer, db.ForeignKey('indicators.indicator_id'))
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'))
    year = db.Column(db.Integer)
    value = db.Column(db.Float)


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


class UserMetricPreference(db.Model):
    __tablename__ = 'user_metric_preferences'

    preference_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.user_id'))
    framework_id = db.Column(
        db.Integer, db.ForeignKey('frameworks.framework_id'))
    metric_id = db.Column(db.Integer, db.ForeignKey('metrics.metric_id'))
    custom_weight = db.Column(db.Float)
    saved_date = db.Column(db.Date)


class UserIndicatorPreference(db.Model):
    __tablename__ = 'user_indicator_preferences'

    preference_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.user_id'))
    metric_id = db.Column(db.Integer, db.ForeignKey('metrics.metric_id'))
    indicator_id = db.Column(
        db.Integer, db.ForeignKey('indicators.indicator_id'))
    custom_weight = db.Column(db.Float)
    saved_date = db.Column(db.Date)
