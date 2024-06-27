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
import java.util.Optional;
import java.util.UUID;

@DisplayName("Given: A request to delete an alumnus")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DeleteUserEndPointTest {

    private static final String BASE_URL_TEMPLATE = "http://localhost:%d/api/v1/alumni-fil";
    private static final String DELETE_URL = "/users/delete-user/{uuid}";
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

    private AuthenticationResponse response;

    @BeforeEach
    void setUp() {
        registerUser();
        authenticateUserAndGenerateToken();
        validateSetup();
    }

    private void registerUser() {
        userDAO.save(new User(UUID.randomUUID(), "jane", passwordEncoder.encode("Password1"), Role.ADMIN));
        userDAO.save(new User(UUID.randomUUID(), "john", passwordEncoder.encode("Password1"), Role.USER));
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
        Assumptions.assumeTrue(token != null && !token.isEmpty(), "Token should not be null or empty");
        Assumptions.assumeTrue(userDAO.count() == 2 , "Users count should be 2 but got " + userDAO.count() );
    }

    @AfterEach
    void tearDown() {
        userDAO.deleteAll();
    }

    @DisplayName("When: A request to delete a user is made")
    @Nested
    class DeleteRequest{

        String uuid;

        @BeforeEach
        void setUp() {
            Optional<User> user = userDAO.findByUsername("john");
            Assumptions.assumeTrue(user.isPresent());
            uuid = user.get().getId().toString();
        }

        @Test
        @DisplayName("Then: The user is deleted")
        void deleteAlumnus() {
            webTestClient.delete()
                    .uri(getBaseUrl() + DELETE_URL, uuid)
                    .header(AUTH_HEADER, BEARER + token)
                    .exchange()
                    .expectStatus().isNoContent();

            Assertions.assertEquals(1, userDAO.count());
        }
    }
}
