package fr.imt.alumni.fil.controller.auth;

import fr.imt.alumni.fil.payload.request.AuthenticateRequestBody;
import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.persistance.UserDAO;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

@DisplayName("Given: A request to authenticate a user")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public class AuthenticateEndPointTest {

    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private UserDAO userDAO;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/v1/alumni-fil/";
    }

    @BeforeEach
    void setUp() {
        AuthenticateRequestBody requestBody = new AuthenticateRequestBody("john", "Password1");

        webTestClient.post()
                .uri(getBaseUrl() + "auth/register")
                .bodyValue(requestBody)
                .exchange()
                .expectStatus().isCreated();
    }

    @AfterEach
    void tearDown() {
        userDAO.deleteAll();
    }

    @DisplayName("When: an registrered user tries to authenticate")
    @Nested
    class Authenticate {

        private String accessToken;

        @BeforeEach
        void setUp() {
            AuthenticateRequestBody requestBody = new AuthenticateRequestBody("john", "Password1");

            EntityExchangeResult<AuthenticationResponse> result = webTestClient.post()
                    .uri(getBaseUrl() + "auth/authenticate")
                    .bodyValue(requestBody)
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(AuthenticationResponse.class)
                    .returnResult();

            AuthenticationResponse response = result.getResponseBody();

            accessToken = response.accessToken();
        }

        @DisplayName("Then: The user can access protected resources")
        @Test
        void testJsonResponse() {
            webTestClient.get()
                    .uri(getBaseUrl() + "protected")
                    .header("Authorization", "Bearer " + accessToken)
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody()
                    .jsonPath("$").isEqualTo("This route is for testing purposes only");
        }
    }

    @DisplayName("When: an unregistrered user tries to authenticate")
    @Nested
    class Unregistrered {

        @DisplayName("Then: The user can't authenticate")
        @Test
        void testJsonResponse() {
            AuthenticateRequestBody requestBody = new AuthenticateRequestBody("john", "Passwor1");

            webTestClient.post()
                    .uri(getBaseUrl() + "auth/authenticate")
                    .bodyValue(requestBody)
                    .exchange()
                    .expectStatus().isUnauthorized();
        }
    }

    @DisplayName("When: an unauthenticated user tries to access protected resources")
    @Nested
    class Unauthenticate {

        @DisplayName("Then: The user can't access protected resources")
        @Test
        void testJsonResponse() {
            webTestClient.get()
                    .uri(getBaseUrl() + "protected")
                    .exchange()
                    .expectStatus().isUnauthorized();
        }
    }
}
