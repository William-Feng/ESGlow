create database esglow;
\c esglow;

create table users (
    user_id     uuid,
    email       text unique not null,
    password    text not null,
    primary key (user_id)
);
