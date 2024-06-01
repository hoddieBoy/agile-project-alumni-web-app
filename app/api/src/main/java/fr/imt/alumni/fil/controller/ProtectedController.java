package fr.imt.alumni.fil.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/alumni-fil/protected")
@SecurityRequirement(name = "Bearer Authentification")
@RestController
public class ProtectedController {

    @GetMapping
    public ResponseEntity<String> getProtected() {
        return ResponseEntity.ok("This route is for testing purposes only");
    }
}
