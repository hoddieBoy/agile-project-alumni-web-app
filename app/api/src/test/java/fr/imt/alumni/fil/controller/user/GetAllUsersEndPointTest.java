package fr.imt.alumni.fil.controller.user;

import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.Role;
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

@DisplayName("Given: A request to get all users")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public class GetAllUsersEndPointTest {
    private static final String BASE_URL_TEMPLATE = "http://localhost:%d/api/v1/alumni-fil";
    private static final String GET_ALL_USERS_URL = "/users/all-users";
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
        userDAO.save(new User(UUID.randomUUID(), "john", passwordEncoder.encode("Password1"), Role.ADMIN));
    }

    private void validateSetup() {
        Assumptions.assumeTrue(userDAO.count() == 1 && Objects.nonNull(userDAO.findByUsername("john")));
        Assumptions.assumeTrue(token != null && !token.isEmpty());
    }

    private void authenticateUserAndGenerateToken() {
        EntityExchangeResult<AuthenticationResponse> response = webTestClient.post()
                .uri(getBaseUrl() + AUTH_URL)
                .header("Content-Type", "application/json")
                .bodyValue("{\"username\":\"john\",\"password\":\"Password1\"}")
                .exchange()
                .expectStatus().isOk()
                .expectBody(AuthenticationResponse.class)
                .returnResult();

        token = Objects.requireNonNull(response.getResponseBody()).accessToken();
    }

    @AfterEach
    void tearDown() {
        userDAO.deleteAll();
    }

    @DisplayName("When: A request is made to get all users")
    @Nested
    class GetAllUsers {
        @DisplayName("Then: All users should be returned")
        @Test
        void testGetAllUsers() {
            webTestClient.get()
                    .uri(getBaseUrl() + GET_ALL_USERS_URL)
                    .header(AUTH_HEADER, BEARER + token)
                    .exchange()
                    .expectStatus().isOk()
                    .expectBodyList(User.class)
                    .hasSize(1);
        }
    }
}
