package fr.imt.alumni.fil.controller.auth;

import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.TokenType;
import fr.imt.alumni.fil.persistance.UserDAO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.Map;

@DisplayName("Given: A request to register a new user")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public class RegistrerEndPointTest {

    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private UserDAO userDAO;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/v1/alumni-fil/auth/register";
    }

    @DisplayName("When: we provide a valid username and password")
    @Nested
    class ValidRequest {

        @DisplayName("Then: The response should be a JSON with an uuid of the new user")
        @Test
        void testJsonResponse() {
            webTestClient.post()
                    .uri(getBaseUrl())
                    .bodyValue(Map.of("username", "john", "password", "Password1"))
                    .exchange()
                    .expectStatus().isCreated()
                    .expectBody()
                    .jsonPath("$.user_id").isNotEmpty()
                    .jsonPath("$.username").isEqualTo("john")
                    .jsonPath("$.roles").isNotEmpty()
                    .jsonPath("$.access_token").isNotEmpty()
                    .jsonPath("$.refresh_token").isNotEmpty()
                    .jsonPath("$.token_type").isEqualTo(TokenType.BEARER.toString());
        }

        @DisplayName("And: The user should be saved in the database")
        @Nested
        class UserSaved {

            @DisplayName("Then: The user should be saved in the database")
            @Test
            void testUserSaved() {
                webTestClient.post()
                        .uri(getBaseUrl())
                        .bodyValue(Map.of("username", "john", "password", "Password1"))
                        .exchange()
                        .expectStatus().isCreated()
                        .expectBody()
                        .jsonPath("$.user_id").isNotEmpty();

                User user = userDAO.findAll().getFirst();
                assert user.getUsername().equals("john");
                assert user.getPassword().startsWith("$2a$");
            }
        }
    }

    @DisplayName("When: we provide an invalid username and password")
    @Nested
    class InvalidRequest {

        @DisplayName("Then: The response should be a bad request")
        @Test
        void testBadRequest() {
            webTestClient.post()
                    .uri(getBaseUrl())
                    .bodyValue(Map.of("username", "jo", "password", "password"))
                    .exchange()
                    .expectStatus().isBadRequest();
        }

        @DisplayName("And: The user should not be saved in the database")
        @Nested
        class UserNotSaved {

            @DisplayName("Then: The user should not be saved in the database")
            @Test
            void testUserNotSaved() {
                webTestClient.post()
                        .uri(getBaseUrl())
                        .bodyValue(Map.of("username", "jo", "password", "password"))
                        .exchange()
                        .expectStatus().isBadRequest();

                assert userDAO.findAll().isEmpty();
            }
        }
    }
}
