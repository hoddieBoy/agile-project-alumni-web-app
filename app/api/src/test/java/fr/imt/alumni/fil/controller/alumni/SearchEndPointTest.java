package fr.imt.alumni.fil.controller.alumni;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.domain.bo.Sex;
import fr.imt.alumni.fil.persistance.AlumniDAO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.UUID;

@DisplayName("Given: A request to search for alumni")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public class SearchEndPointTest {
    @LocalServerPort
    private int port;

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private AlumniDAO alumniDAO;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/v1/alumni-fil/search";
    }

    @BeforeEach
    void setUp() {
        alumniDAO.deleteAll();
        Alumnus john = new Alumnus(UUID.randomUUID(), "John", "Doe", Sex.MAN,"john.doe@gmail.com "
                ," Grey Sloan Memorial", "RHMC "," https://john-doe.fr",
                "France "," Lyon",false);
        Alumnus johnathan = new Alumnus(UUID.randomUUID(), "Johnathan", "Doe", Sex.MAN,
                " johnathan.doe@yahoo.com","NMC", " BMC ",
                " https://johnathan-doe.fr", "France "," Bordeaux",false);
        Alumnus jane = new Alumnus(UUID.randomUUID(), "Jane", "Jossman", Sex.WOMAN
                ," jane.jossman@gmail.com"," Grey Sloan Memorial", "RHMC ",
                " https://jane-jossman.fr", "France "," Lyon",false);
        Alumnus jenny = new Alumnus(UUID.randomUUID(), "Jenny", "Peter", Sex.WOMAN,
                " "," "," "," "," "," ",false);

        alumniDAO.save(john);
        alumniDAO.save(johnathan);
        alumniDAO.save(jane);
        alumniDAO.save(jenny);
    }

    @DisplayName("When: The request is a GET request")
    @Nested
    class GetRequest {

        @DisplayName("Then: The response should be a JSON")
        @Test
        void testJsonResponse() {
            webTestClient.get()
                    .uri(getBaseUrl() + "?name=JacK")
                    .exchange()
                    .expectStatus().isOk()
                    .expectHeader().contentType("application/json");
        }


        @DisplayName("And When: The request is a GET request with a specific search name")
        @Nested
        class GetRequestWithSearchName {

            @DisplayName("Then: The search should be case insensitive and return results regardless of the case of the input name.")
            @ParameterizedTest
            @ValueSource(strings = {"John", "john", "JOHN"})
            void testSearchCaseInsensitive(String searchName) {
                webTestClient.get()
                        .uri(getBaseUrl() + "?name=" + searchName)
                        .exchange()
                        .expectStatus().isOk()
                        .expectBody()
                        .jsonPath("$.results.length()").isEqualTo(2)
                        .jsonPath("$.search_name").isEqualTo(searchName)
                        .jsonPath("$.results[0].fullName").isEqualTo("John Doe")
                        .jsonPath("$.results[1].fullName").isEqualTo("Johnathan Doe")
                        .jsonPath("$.results[0].currentCompany").isEqualTo("RHMC")
                        .jsonPath("$.results[1].currentCompany").isEqualTo("BMC")
                        .jsonPath("$.results[0].city").isEqualTo("Lyon")
                        .jsonPath("$.results[1].city").isEqualTo("Bordeaux")
                        .jsonPath("$.results[0].country").isEqualTo("France")
                        .jsonPath("$.results[1].country").isEqualTo("France");
            }
        }

        @DisplayName("And When: The request is a GET request with partial search name")
        @Nested
        class GetRequestWithPartialSearchName {

            @DisplayName("Then: The search should return results that contain the input name.")
            @ParameterizedTest
            @ValueSource(strings = {"Jo", "jo", "JO"})
            void testPartialSearch(String searchName) {
                webTestClient.get()
                        .uri(getBaseUrl() + "?name=" + searchName)
                        .exchange()
                        .expectStatus().isOk()
                        .expectBody()
                        .jsonPath("$.results.length()").isEqualTo(3);
            }
        }

        @DisplayName("And When: The request is a GET request with a name that does not match any alumni")
        @Nested
        class GetRequestWithNoMatch {
            @DisplayName("Then: The search should return an empty list.")
            @ParameterizedTest
            @ValueSource(strings = {"Zoe", "zoe", "ZOE", " "})
            void testNoMatch(String searchName) {
                webTestClient.get()
                        .uri(getBaseUrl() + "?name=" + searchName)
                        .exchange()
                        .expectStatus().isOk()
                        .expectBody()
                        .jsonPath("$.results.length()").isEqualTo(0);
            }
        }
    }
}
