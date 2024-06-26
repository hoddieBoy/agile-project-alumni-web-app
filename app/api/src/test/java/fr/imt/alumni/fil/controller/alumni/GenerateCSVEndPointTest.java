package fr.imt.alumni.fil.controller.alumni;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.domain.enums.Sex;
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

@DisplayName("Given: A request to gerate a CSV file of alumni")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class GenerateCSVEndPointTest {
    private static final String BASE_URL_TEMPLATE = "http://localhost:%d/api/v1/alumni-fil";
    private static final String GENERATE_URL = "/generate-csv";
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

    private void saveAlumniData() {
        alumniDAO.save(new Alumnus(UUID.randomUUID(), "John", "Doe", Sex.MAN, "john.doe@gmail.com",
                "Grey Sloan Memorial", "RHMC", "https://john-doe.fr", "France",
                "Lyon", false, "2022"));
        alumniDAO.save(new Alumnus(UUID.randomUUID(), "Johnathan", "Doe", Sex.MAN,
                "johnathan.doe@yahoo.com", "NMC", "BMC", "https://johnathan-doe.fr",
                "France", "Bordeaux", false, "2024"));
        alumniDAO.save(new Alumnus(UUID.randomUUID(), "Jane", "Jossman", Sex.WOMAN,
                "jane.jossman@gmail.com", "Grey Sloan Memorial", "RHMC",
                "https://jane-jossman.fr", "France", "Lyon", false, "2023"));
        alumniDAO.save(new Alumnus(UUID.randomUUID(), "Jenny", "Peter", Sex.WOMAN,
                "", "", "", "", "", "", false, "2020"));
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
    }

    @AfterEach
    void tearDown() {
        alumniDAO.deleteAll();
        userDAO.deleteAll();
    }

    @DisplayName("When: A request is made to generate a CSV file of alumni with a valid year")
    @Nested
    class GenerateCSVWithValidYear {
        @BeforeEach
        void setUp() {
            saveAlumniData();
        }

        @Test
        @DisplayName("Then: The CSV file is generated successfully")
        void testGenerateCSVWithValidYear() {
            webTestClient.get()
                    .uri(getBaseUrl() + GENERATE_URL + "?year=2022")
                    .header(AUTH_HEADER, BEARER + token)
                    .exchange()
                    .expectStatus().isOk()
                    .expectHeader().contentType("application/octet-stream")
                    .expectBody().consumeWith(response -> {
                        Assertions.assertNotNull(response.getResponseBody());
                        Assertions.assertTrue(response.getResponseBody().length > 0);
                    });
        }
    }

    @DisplayName("When: A request is made to generate a CSV file of alumni with an invalid year")
    @Nested
    class GenerateCSVWithInvalidYear {
        @Test
        @DisplayName("Then: The CSV file is not generated")
        void testGenerateCSVWithInvalidYear() {
            webTestClient.get()
                    .uri(getBaseUrl() + GENERATE_URL + "?year=2021")
                    .header(AUTH_HEADER, BEARER + token)
                    .exchange()
                    .expectStatus().isNotFound();
        }
    }
}
