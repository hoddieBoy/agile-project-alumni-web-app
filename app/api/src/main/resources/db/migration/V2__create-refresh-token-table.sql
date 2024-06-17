CREATE TABLE refresh_token
(
    id          UUID    NOT NULL,
    user_id     UUID,
    expiry_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    revoked     BOOLEAN NOT NULL,
    CONSTRAINT pk_refresh_token PRIMARY KEY (id)
);

ALTER TABLE refresh_token
    ADD CONSTRAINT FK_REFRESH_TOKEN_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);