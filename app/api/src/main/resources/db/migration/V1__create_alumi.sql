CREATE TABLE alumni
(
    id         UUID NOT NULL,
    first_name VARCHAR(255),
    last_name  VARCHAR(255),
    age        VARCHAR(255),
    sex        SMALLINT,
    company    VARCHAR(255),
    country    VARCHAR(255),
    city       VARCHAR(255),
    is_stayed  BOOLEAN,

    CONSTRAINT pk_alumni PRIMARY KEY (id)
);