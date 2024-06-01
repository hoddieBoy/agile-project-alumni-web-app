package fr.imt.alumni.fil.controller.auth;

import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.persistance.UserDAO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.Map;

@DisplayName("Given: A request to logout a new user")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public class LogoutEndPointTest {
    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private UserDAO userDAO;

    private AuthenticationResponse authenticationResponse;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/v1/alumni-fil/auth/register";
    }

    @BeforeEach
    void setUp() {
        EntityExchangeResult<AuthenticationResponse> result = webTestClient.post()
                .uri(getBaseUrl())
                .bodyValue(Map.of("username", "john", "password", "Password1"))
                .exchange()
                .expectStatus().isCreated()
                .expectBody(AuthenticationResponse.class)
                .returnResult();

        authenticationResponse = result.getResponseBody();
    }

    @DisplayName("When: an user is logged out")
    @Nested
    class Logout {
        @DisplayName("Then: The response should be a JSON with a message")
        @Test
        void testJsonResponse() {
            webTestClient.post()
                    .uri("http://localhost:" + port + "/api/v1/alumni-fil/auth/logout")
                    .header("Authorization", "Bearer " + authenticationResponse.accessToken())
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody()
                    .jsonPath("$.message").isEqualTo("Logout successful");
        }
    }


}
