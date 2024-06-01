package fr.imt.alumni.fil.controller.auth;

import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.TokenType;
import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.persistance.UserDAO;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

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

    private AuthenticationResponse response;

    @DisplayName("When: we provide a valid username and password")
    @Nested
    class ValidRequest {

        @BeforeEach
        void setUp() {
            response = webTestClient.post()
                    .uri(getBaseUrl())
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
            User user = userDAO.findAll().getFirst();
            assertEquals(response.userId(), user.getId());
        }
    }

    @DisplayName("When: we provide an invalid username and password")
    @Nested
    class InvalidRequest {
        WebTestClient.ResponseSpec response;

        @BeforeEach
        void setUp() {
            response = webTestClient.post()
                    .uri(getBaseUrl())
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
            assertTrue(userDAO.findAll().isEmpty());
        }
    }
}
