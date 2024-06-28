package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.payload.request.AlumnusDTO;
import fr.imt.alumni.fil.payload.response.AlumniData;
import fr.imt.alumni.fil.payload.response.MessageResponse;
import fr.imt.alumni.fil.payload.response.SearchResponse;
import fr.imt.alumni.fil.service.AlumniService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

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
                    alumnus.getCity(), alumnus.getCountry(), alumnus.getGraduationYear(), alumnus.getWebsite())
            );
        }

        SearchResponse response = new SearchResponse(
                name, city, country, currentCompany, graduationYear, results
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/add-alumni",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Add an alumni",
            description = "Add an alumni to the database",
            tags = {"alumni"},
            responses = {
                @ApiResponse(
                        responseCode = "201",
                        description = "Alumni added"
                )
        }
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> addAlumni(@RequestBody @Valid List<AlumnusDTO> alumni){
        alumniService.addAlumni(alumni);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponse("The alumni were added successfully"));
    }

    @DeleteMapping(path = "/delete-alumnus/{alumnus_id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Delete an alumnus",
            description = "Delete an alumnus from the database",
            tags = {"alumnus"},
            responses = {
                @ApiResponse(
                        responseCode = "204",
                        description = "Alumnus deleted"
                ),
                @ApiResponse(
                        responseCode = "400",
                        description = "Bad request",
                        content = @Content
                )
        }
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> deleteAlumnus(
            @PathVariable("alumnus_id")
            @Pattern(regexp = "[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}")
                String id) {
        alumniService.deleteAlumnus(id);

        return ResponseEntity.noContent().build();

    }
    @GetMapping(path = "/generate-csv", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @Operation(
            summary = "Generate a CSV file",
            description = "Generate a CSV file with alumni data",
            tags = {"alumni"},
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "CSV file generated"
                    )
            }
    )
    public ResponseEntity<byte[]> generateCsv(@RequestParam int year) {
        String csv = alumniService.generateCsv(year);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=alumni.csv")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(csv.getBytes());
    }

    @PostMapping(
            path = "/upload-csv",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Operation(
            summary = "Upload a CSV file",
            description = "Upload a CSV file with alumni data",
            tags = {"alumni"},
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "CSV file uploaded"
                    )
            }
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> uploadCsv(@RequestParam("file") MultipartFile file, @RequestParam("promotion") int year) {
        alumniService.uploadCsv(file, year);

        return ResponseEntity.ok(new MessageResponse("The CSV file was uploaded successfully"));
    }
}
