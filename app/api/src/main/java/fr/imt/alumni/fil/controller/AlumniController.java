package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.service.AlumniService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/alumni-fil")
@SecurityRequirement(name = "Bearer Authentification")
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    @GetMapping(path = "/search",produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Search alumni",
            description = "Search alumni by name, city, country, or current company",
            tags = {"alumni"},
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Found alumni"
                )
        }
    )
    public ResponseEntity<Map<String, Object>> searchAlumni(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String currentCompany) {
        List<Map<String, String>> results = new ArrayList<>();
        for (Alumnus alumnus : alumniService.searchAlumni(name, city, country, currentCompany)) {
            results.add(
                    Map.of("id", alumnus.getId().toString(),
                            "fullName", alumnus.getFullName(),
                            "currentCompany", alumnus.getCurrentCompany(),
                            "city", alumnus.getCity(),
                            "country", alumnus.getCountry()
                    )
            );
        }

        Map<String, Object> response = new HashMap<>();

        if (name != null && !name.isBlank()) {
            response.put("search_name", name);
        }

        if (city != null && !city.isBlank()) {
            response.put("search_city", city);
        }

        if (country != null && !country.isBlank()) {
            response.put("search_country", country);
        }

        if (currentCompany != null && !currentCompany.isBlank()) {
            response.put("search_current_company", currentCompany);
        }

        response.put("results", results);

        return ResponseEntity.ok(response);
    }

}
