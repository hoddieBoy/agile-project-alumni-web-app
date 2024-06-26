package fr.imt.alumni.fil.controller.user;


import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.Role;
import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.persistance.AlumniDAO;
import fr.imt.alumni.fil.persistance.UserDAO;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.Objects;
import java.util.UUID;

@DisplayName("Given: A request to delete an alumnus")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DeleteUserEndPointTest {

    private static final String BASE_URL_TEMPLATE = "http://localhost:%d/api/v1/alumni-fil/users";
    private static final String DELETE_URL = "/delete-user";
    private static final String REGISTER_URL = "/auth/register";
    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER = "Bearer ";

    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private UserDAO userDAO;

    private String token;

    private String getBaseUrl() {
        return String.format(BASE_URL_TEMPLATE, port);
    }

    @BeforeEach
    void setUp() {
        saveUserData();
        registerUserAndGenerateToken();
        validateSetup();
    }

    private void saveUserData() {
        //userDAO.save(new User(UUID.randomUUID(), "john", "Password1", Role.ADMIN));
        userDAO.save(new User(UUID.randomUUID(), "Jay", "Pass23word10", Role.USER));
    }

    private void registerUserAndGenerateToken() {
        EntityExchangeResult<AuthenticationResponse> response = webTestClient.post()
                .uri(getBaseUrl() + REGISTER_URL)
                .header("Content-Type", "application/json")
                .bodyValue("{\"username\":\"john\",\"password\":\"Password1\"}")
                .exchange()
                .expectStatus().isCreated()
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

        @Test
        @DisplayName("Then: The user is deleted")
        void deleteAlumnus() {
            webTestClient.delete()
                    .uri(getBaseUrl() + DELETE_URL + "/" + userDAO.findAll().get(1).getId())
                    .header(AUTH_HEADER, BEARER + token)
                    .exchange()
                    .expectStatus().isNoContent();

            Assertions.assertEquals(1, userDAO.count());
        }
    }
}
