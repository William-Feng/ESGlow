CREATE DATABASE esglow;
\c esglow;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id             UUID DEFAULT uuid_generate_v4(),
    email               TEXT UNIQUE NOT NULL,
    password            TEXT NOT NULL,      -- Note that the password hash is stored instead
    verification_code   CHAR(6),
    PRIMARY KEY (user_id)
);

CREATE TABLE companies (
    company_id          SERIAL,
    name                TEXT UNIQUE NOT NULL,
    description         TEXT,
    PRIMARY KEY (company_id)
);

CREATE TABLE frameworks (
    framework_id        SERIAL,
    name                TEXT UNIQUE NOT NULL,
    description         TEXT,
    PRIMARY KEY (framework_id)
);

CREATE TABLE metrics (
    metric_id           SERIAL,
    name                TEXT NOT NULL,
    description         TEXT,
    PRIMARY KEY (metric_id)
);

CREATE TABLE indicators (
    indicator_id        SERIAL,
    name                TEXT NOT NULL,
    description         TEXT,
    source              TEXT,
    weight              FLOAT CHECK (weight >= 0 AND weight <= 1),
    PRIMARY KEY (indicator_id)
);

CREATE TABLE data_values (
    value_id            SERIAL,
    indicator_id        INT REFERENCES Indicators(indicator_id),
    company_id          INT REFERENCES Companies(company_id),
    year                INT CHECK (year > 1900 AND year <= 2030),
    value               FLOAT,
    PRIMARY KEY (value_id)
);

CREATE TABLE framework_metrics (
    framework_id        INT REFERENCES frameworks(framework_id),
    metric_id           INT REFERENCES metrics(metric_id),
    PRIMARY KEY (framework_id, metric_id)
);

CREATE TABLE metric_indicators (
    metric_id           INT REFERENCES metrics(metric_id),
    indicator_id        INT REFERENCES indicators(indicator_id),
    PRIMARY KEY (metric_id, indicator_id)
);

CREATE TABLE user_preferences (
    preference_id       SERIAL,
    user_id             UUID REFERENCES users(user_id),
    framework_id        INT REFERENCES Frameworks(framework_id),
    metric_id           INT REFERENCES Metrics(metric_id),
    indicator_id        INT REFERENCES Indicators(indicator_id),
    weight              FLOAT CHECK (weight >= 0 AND weight <= 1),
    saved_date          DATE,
    PRIMARY KEY (preference_id)
);