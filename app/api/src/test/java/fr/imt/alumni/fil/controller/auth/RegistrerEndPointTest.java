package fr.imt.alumni.fil.controller.auth;

import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.Role;
import fr.imt.alumni.fil.domain.enums.TokenType;
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

import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Given: A request to register a new user")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public class RegistrerEndPointTest {

    private static final String BASE_URL_TEMPLATE = "http://localhost:%d/api/v1/alumni-fil";
    private static final String REGISTRATION_URL = "/auth/register";
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

    private String token;
    private AuthenticationResponse response;

    private String getBaseUrl() {
        return String.format(BASE_URL_TEMPLATE, port);
    }

    @BeforeEach
    void setUp() {
        registerUser();
        authenticateUserAndGenerateToken();
        validateSetup();
    }

    private void registerUser() {
        userDAO.save(new User(UUID.randomUUID(), "jane", passwordEncoder.encode("Password1"), Role.ADMIN));
    }

    private void authenticateUserAndGenerateToken() {
        EntityExchangeResult<AuthenticationResponse> response = webTestClient.post()
                .uri(getBaseUrl() + AUTH_URL)
                .header("Content-Type", "application/json")
                .bodyValue("{\"username\":\"jane\",\"password\":\"Password1\"}")
                .exchange()
                .expectStatus().isOk()
                .expectBody(AuthenticationResponse.class)
                .returnResult();

        token = Objects.requireNonNull(response.getResponseBody()).accessToken();
    }

    private void validateSetup() {
        Assumptions.assumeTrue(token != null && !token.isEmpty(),
                "Token should not be null or empty");
    }

    @AfterEach
    void tearDown() {
        userDAO.deleteAll();
    }

    @DisplayName("When: we provide a valid username and password")
    @Nested
    class ValidRequestWithUsernameAndPassword {
        @BeforeEach
        void setUp() {
            response = webTestClient.post()
                    .uri(getBaseUrl() + REGISTRATION_URL)
                    .header(AUTH_HEADER, BEARER + token)
                    .bodyValue(Map.of("username", "john", "password", "Password1"))
                    .exchange()
                    .expectStatus().isCreated()
                    .expectBody(AuthenticationResponse.class)
                    .returnResult()
                    .getResponseBody();

            Assumptions.assumeTrue(response != null);
        }

        @AfterEach
        void tearDown() {
            userDAO.deleteAll();
        }

        @DisplayName("Then: The response should be a JSON with an uuid of the new user")
        @Test
        void testJsonResponse() {
            assertNotNull(response.userId());
            assertEquals("john", response.username());
            assertNotNull(response.accessToken());
            assertFalse(response.accessToken().isEmpty());
            assertNotNull(response.refreshToken());
            assertFalse(response.refreshToken().isEmpty());
            assertEquals(TokenType.BEARER, response.tokenType());
        }

        @DisplayName("Then: The user should be saved in the database")
        @Test
        void testUserSaved() {
            assertNotNull(userDAO.findByUsername("john").orElse(null));
        }
    }

    @DisplayName("When: we provide a valid username, password and role")
    @Nested
    class ValidRequestWithUsernamePasswordAndRole {

        @BeforeEach
        void setUp() {
            response = webTestClient.post()
                    .uri(getBaseUrl() + REGISTRATION_URL)
                    .header(AUTH_HEADER, BEARER + token)
                    .bodyValue(Map.of("username", "john", "password", "Password1", "role", "ADMIN"))
                    .exchange()
                    .expectStatus().isCreated()
                    .expectBody(AuthenticationResponse.class)
                    .returnResult()
                    .getResponseBody();

            Assumptions.assumeTrue(response != null);
        }

        @AfterEach
        void tearDown() {
            userDAO.deleteAll();
        }

        @DisplayName("Then: The response should be a JSON with an uuid of the new user")
        @Test
        void testJsonResponse() {
            assertNotNull(response.userId());
            assertEquals("john", response.username());
            assertNotNull(response.accessToken());
            assertFalse(response.accessToken().isEmpty());
            assertNotNull(response.refreshToken());
            assertFalse(response.refreshToken().isEmpty());
            assertEquals(TokenType.BEARER, response.tokenType());
        }

        @DisplayName("Then: The user should be saved in the database")
        @Test
        void testUserSaved() {
            User user = userDAO.findByUsername("john").orElse(null);
            assertNotNull(user);
            assertEquals(Role.ADMIN, user.getRole());
        }
    }

    @DisplayName("When: we provide a valid username, password and an invalid role")
    @Nested
    class ValidRequestWithUsernamePasswordAndInvalidRole {

        WebTestClient.ResponseSpec response;

        @BeforeEach
        void setUp() {
            response = webTestClient.post()
                    .uri(getBaseUrl() + REGISTRATION_URL)
                    .header(AUTH_HEADER, BEARER + token)
                    .bodyValue(Map.of("username", "john", "password", "Password1", "role", "INVALID_ROLE"))
                    .exchange();
        }

        @DisplayName("Then: The response should be a bad request")
        @Test
        void testBadRequest() {
            response.expectStatus().isBadRequest();
        }

        @DisplayName("Then: The user should not be saved in the database")
        @Test
        void testUserNotSaved() {
            assertEquals(1, userDAO.count());
        }
    }

    @DisplayName("When: we provide an invalid username and password")
    @Nested
    class InvalidRequest {
        WebTestClient.ResponseSpec response;

        @BeforeEach
        void setUp() {
            response = webTestClient.post()
                    .uri(getBaseUrl() + REGISTRATION_URL)
                    .header(AUTH_HEADER, BEARER + token)
                    .bodyValue(Map.of("username", "jo", "password", "password"))
                    .exchange();
        }

        @DisplayName("Then: The response should be a bad request")
        @Test
        void testBadRequest() {
            response.expectStatus().isBadRequest();
        }

        @DisplayName("Then: The user should not be saved in the database")
        @Test
        void testUserNotSaved() {
            assertEquals(1, userDAO.count());
        }
    }
}
