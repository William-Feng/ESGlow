CREATE DATABASE esglow;
\c esglow;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id             UUID DEFAULT uuid_generate_v4(),
    email               TEXT UNIQUE NOT NULL,
    password            TEXT NOT NULL,
    verification_code   CHAR(6),
    PRIMARY KEY (user_id)
<<<<<<< HEAD
);
=======
);
>>>>>>> main
