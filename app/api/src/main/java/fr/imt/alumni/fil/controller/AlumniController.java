package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.service.AlumniService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alumni-fil")
public class AlumniController {
    private AlumniService alumniService;

    @GetMapping(path = "/search",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Alumnus>> getAlumni(@RequestParam String name) {
        return ResponseEntity.ok(alumniService.getAlumni(name));
    }

}
