package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.payload.response.AlumniData;
import fr.imt.alumni.fil.payload.response.SearchResponse;
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

import java.util.*;

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
    public ResponseEntity<SearchResponse> searchAlumni(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String currentCompany,
            @RequestParam(required = false) String graduationYear ){
        List<AlumniData> results = new ArrayList<>();
        for (Alumnus alumnus : alumniService.searchAlumni(name, city, country, currentCompany, graduationYear)) {
            results.add(new AlumniData(alumnus.getId().toString(),
                    alumnus.getFullName(),
                    alumnus.getCurrentCompany(),
                    alumnus.getCity(), alumnus.getCountry(), alumnus.getGraduationYear())
            );
        }

        SearchResponse response = new SearchResponse(
                name, city, country, currentCompany, graduationYear, results
        );

        return ResponseEntity.ok(response);
    }

}
