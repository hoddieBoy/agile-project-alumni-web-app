package fr.imt.alumni.fil.controller.auth;

import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.Role;
import fr.imt.alumni.fil.payload.request.AuthenticateRequestBody;
import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.persistance.UserDAO;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.Objects;
import java.util.UUID;

@DisplayName("Given: A request to authenticate a user")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public class AuthenticateEndPointTest {

    private static final String BASE_URL_TEMPLATE = "http://localhost:%d/api/v1/alumni-fil";
    private static final String AUTH_URL = "/auth/authenticate";
    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER = "Bearer ";

    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String getBaseUrl() {
        return String.format(BASE_URL_TEMPLATE, port);
    }

    @BeforeEach
    void setUp() {
        registerUser();
        validateSetup();
    }

    private void registerUser() {
        userDAO.save(new User(UUID.randomUUID(), "john", passwordEncoder.encode("Password1"), Role.ADMIN));
    }

    private void validateSetup() {
        Assumptions.assumeTrue(userDAO.count() == 1 && Objects.nonNull(userDAO.findByUsername("john")));
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
                    .uri(getBaseUrl() + AUTH_URL)
                    .bodyValue(requestBody)
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(AuthenticationResponse.class)
                    .returnResult();

            AuthenticationResponse response = result.getResponseBody();
            Assumptions.assumeTrue(response != null);
            accessToken = response.accessToken();
            Assumptions.assumeTrue(accessToken != null && !accessToken.isEmpty());
        }

        @DisplayName("Then: The user can access protected resources")
        @Test
        void testJsonResponse() {
            webTestClient.get()
                    .uri(getBaseUrl() + "/protected")
                    .header(AUTH_HEADER, BEARER + accessToken)
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
                    .uri(getBaseUrl() + AUTH_URL)
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
                    .uri(getBaseUrl() + "/protected")
                    .exchange()
                    .expectStatus().isUnauthorized();
        }
    }
}
