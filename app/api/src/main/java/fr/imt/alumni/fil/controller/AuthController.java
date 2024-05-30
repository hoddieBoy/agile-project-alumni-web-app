package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.payload.request.RegisterRequestBody;
import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.service.RegisterService;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/alumni-fil/auth")
@SecurityRequirements()
public class AuthController {

    private final RegisterService registerService;

    public AuthController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequestBody requestBody) {
        return ResponseEntity.status(HttpStatus.CREATED).body(registerService.execute(requestBody));
    }
}
