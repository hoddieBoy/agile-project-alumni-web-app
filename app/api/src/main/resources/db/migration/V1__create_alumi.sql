CREATE TABLE alumni
(
    id         UUID NOT NULL,
    first_name VARCHAR(255),
    last_name  VARCHAR(255),
    sex        SMALLINT,
    CONSTRAINT pk_alumni PRIMARY KEY (id)
);