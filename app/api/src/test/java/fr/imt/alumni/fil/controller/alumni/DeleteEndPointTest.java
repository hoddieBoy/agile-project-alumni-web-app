package fr.imt.alumni.fil.controller.alumni;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.Role;
import fr.imt.alumni.fil.domain.enums.Sex;
import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.persistance.AlumniDAO;
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

@DisplayName("Given: A request to delete an alumnus")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DeleteEndPointTest {

    private static final String BASE_URL_TEMPLATE = "http://localhost:%d/api/v1/alumni-fil";
    private static final String DELETE_URL = "/delete-alumnus";
    private static final String AUTH_URL = "/auth/authenticate";
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
        saveAlumniData();
        validateSetup();
    }

    private void registerUser() {
        userDAO.save(new User(UUID.randomUUID(), "john", passwordEncoder.encode("Password1"), Role.ADMIN));
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


    private void saveAlumniData() {
        alumniDAO.save(new Alumnus(UUID.randomUUID(), "John", "Doe", Sex.MAN, "john.doe@gmail.com",
                "Grey Sloan Memorial", "RHMC", "https://john-doe.fr", "France",
                "Lyon", false, "2022"));
    }

    private void validateSetup() {
        Assumptions.assumeTrue(token != null && !token.isEmpty(), "Token should not be null or empty");
        Assumptions.assumeTrue(alumniDAO.count() == 1 , "Alumni count should be 1 but got " + alumniDAO.count() );
    }

    @AfterEach
    void tearDown() {
        alumniDAO.deleteAll();
        userDAO.deleteAll();
    }

    @DisplayName("When: A request to delete an alumnus is made")
    @Nested
    class DeleteRequest{

            @Test
            @DisplayName("Then: The alumnus is deleted")
            void deleteAlumnus() {
                webTestClient.delete()
                        .uri(getBaseUrl() + DELETE_URL + "/" + alumniDAO.findAll().getFirst().getId())
                        .header(AUTH_HEADER, BEARER + token)
                        .exchange()
                        .expectStatus().isNoContent();

                Assertions.assertEquals(0, alumniDAO.count());
            }
    }
}
