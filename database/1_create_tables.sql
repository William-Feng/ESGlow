create database esglow;
\c esglow;

create extension if not exists "uuid-ossp";

create table users (
    user_id     uuid default uuid_generate_v4(),
    email       text unique not null,
    password    text not null,
    primary key (user_id)
);
