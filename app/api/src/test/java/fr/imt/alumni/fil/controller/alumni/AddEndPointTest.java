package fr.imt.alumni.fil.controller.alumni;

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

@DisplayName("Given: A request to add alumni")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AddEndPointTest {

    private static final String BASE_URL_TEMPLATE = "http://localhost:%d/api/v1/alumni-fil";
    private static final String ADD_URL = "/add-alumni";
    private static final String REGISTER_URL = "/auth/register";
    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER = "Bearer ";

    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private AlumniDAO alumniDAO;

    @Autowired
    private UserDAO userDAO;

    private String token;

    private String getBaseUrl() {
        return String.format(BASE_URL_TEMPLATE, port);
    }

    @BeforeEach
    void setUp() {
        registerUserAndGenerateToken();
        validateSetup();
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
        Assumptions.assumeTrue(token != null && !token.isEmpty(),
                "Token should not be null or empty");
    }

    @AfterEach
    void tearDown() {
        alumniDAO.deleteAll();
        userDAO.deleteAll();
    }

    @DisplayName("When: The request is a POST request")
    @Nested
    class PostRequest {

        @DisplayName("Then: The response should be in a JSON format")
        @Test
        void responseShouldBeInJsonFormat() {
            webTestClient.post()
                    .uri(getBaseUrl() + ADD_URL)
                    .header(AUTH_HEADER, BEARER + token)
                    .header("Content-Type", "application/json")
                    .bodyValue("""
                            [
                                {
                                     "first_name": "John",
                                     "last_name": "Doe",
                                     "sex": 0,
                                     "mail": "john.doe@yahoo.com",
                                     "coop_company": "Grey Sloan Memorial",
                                     "current_company": "RHMC",
                                     "website": "https://john-doe.fr",
                                     "country": "France",
                                     "city": "Lyon",
                                     "is_stayed": false,
                                     "graduation_year": "2022"
                                }
                            ]
                            """)
                    .exchange()
                    .expectStatus().isCreated()
                    .expectHeader().contentType("application/json")
                    .expectBody().jsonPath("$.message").isEqualTo("The alumni were added successfully");

            assert alumniDAO.count() == 1;
        }


    }
}
