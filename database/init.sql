create database esglow;
\c esglow;

create table users (
    user_id         serial,
    email           text unique not null,
    password_hash   text not null,
    primary key (user_id)
);