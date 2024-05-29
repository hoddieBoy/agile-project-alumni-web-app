CREATE TABLE alumni
(
    id         UUID NOT NULL,
    first_name VARCHAR(255),
    last_name  VARCHAR(255),
    sex        SMALLINT,
    CONSTRAINT pk_alumni PRIMARY KEY (id)
);

CREATE TABLE users
(
    id            UUID NOT NULL,
    username      VARCHAR(255),
    password_hash VARCHAR(255),
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_username UNIQUE (username);