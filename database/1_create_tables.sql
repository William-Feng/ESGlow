CREATE DATABASE esglow;
\c esglow;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id             UUID DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL,
    email               TEXT UNIQUE NOT NULL,
    password            TEXT NOT NULL,      -- Note that the password hash is stored instead
    verification_code   CHAR(6),
    PRIMARY KEY (user_id)
);

CREATE TABLE industries (
    industry_id         SERIAL,
    name                TEXT UNIQUE NOT NULL,
    PRIMARY KEY (industry_id)
);

CREATE TABLE companies (
    company_id          SERIAL,
    industry_id         INT REFERENCES industries(industry_id),
    name                TEXT UNIQUE NOT NULL,
    description         TEXT NOT NULL,
    PRIMARY KEY (company_id)
);

CREATE TABLE frameworks (
    framework_id        SERIAL,
    name                TEXT UNIQUE NOT NULL,
    description         TEXT NOT NULL,
    PRIMARY KEY (framework_id)
);

CREATE TABLE metrics (
    metric_id           SERIAL,
    name                TEXT NOT NULL,
    description         TEXT NOT NULL,
    PRIMARY KEY (metric_id)
);

CREATE TABLE indicators (
    indicator_id        SERIAL,
    name                TEXT NOT NULL,
    description         TEXT NOT NULL,
    source              TEXT NOT NULL,
    PRIMARY KEY (indicator_id)
);

CREATE TABLE data_values (
    value_id            SERIAL,
    company_id          INT REFERENCES companies(company_id),
    indicator_id        INT REFERENCES indicators(indicator_id),
    year                INT CHECK (year > 1900 AND year <= 2030),
    rating              FLOAT CHECK (rating >= 0.0 AND rating <= 100.0),
    PRIMARY KEY (value_id)
);

CREATE TABLE company_frameworks (
    company_id          INT REFERENCES companies(company_id),
    framework_id        INT REFERENCES frameworks(framework_id),
    PRIMARY KEY (company_id, framework_id)
);

CREATE TABLE framework_metrics (
    framework_id        INT REFERENCES frameworks(framework_id),
    metric_id           INT REFERENCES metrics(metric_id),
    predefined_weight   FLOAT CHECK (predefined_weight >= 0 AND predefined_weight <= 1),
    PRIMARY KEY (framework_id, metric_id)
);

CREATE TABLE metric_indicators (
    metric_id           INT REFERENCES metrics(metric_id),
    indicator_id        INT REFERENCES indicators(indicator_id),
    predefined_weight   FLOAT CHECK (predefined_weight >= 0 AND predefined_weight <= 1),
    PRIMARY KEY (metric_id, indicator_id)
);

CREATE TABLE custom_frameworks (
    custom_framework_id SERIAL PRIMARY KEY,
    user_id             UUID REFERENCES users(user_id),
    framework_name      TEXT NOT NULL,
)

CREATE TABLE custom_framework_preferences (
    custom_framework_id INT REFERENCES custom_frameworks(custom_framework_id),
    indicator_id        INT REFERENCES indicators(indicator_id),
    weight              FLOAT CHECK (weight >= 0 AND weight <= 1),
    PRIMARY KEY (custom_framework_id, indicator_id)
)
