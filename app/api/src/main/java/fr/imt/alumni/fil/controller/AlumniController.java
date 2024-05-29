package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.service.AlumniService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/alumni-fil")
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    @GetMapping(path = "/search",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getAlumni(@RequestParam String name) {
        List<Map<String, String>> results = new ArrayList<>();
        for (Alumnus alumnus : alumniService.getAlumni(name)) {
            results.add(Map.of(
                    "id", alumnus.getId().toString(),
                    "name", alumnus.getFullName()
            ));
        }
        return ResponseEntity.ok(
                Map.of("search_name", name,
                        "results", results)
        );
    }

}
