DROP DATABASE IF EXISTS blog;

CREATE DATABASE blog;

\c blog;

CREATE TABLE public.user (
    id serial PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    first_name varchar(55) NOT NULL,
    last_name varchar(55) NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE public.article (
    id serial PRIMARY KEY,
    title varchar(255) UNIQUE NOT NULL,
    preview varchar(255) UNIQUE NOT NULL,
    content text NOT NULL,
    alias varchar(255) UNIQUE NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id int NOT NULL REFERENCES public.user (id)
);

CREATE TABLE public.session (
    sid varchar NOT NULL PRIMARY KEY,
    sess json NOT NULL,
    expire timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

CREATE INDEX IDX_session_expire ON public.session (expire);

\copy public.user (email, password, first_name, last_name) FROM './data/user.csv' CSV;

\copy public.article (title, preview, content, alias, user_id) FROM './data/article.csv' CSV;

