package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.request.RegisterRequestBody;
import fr.imt.alumni.fil.service.RegisterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/alumni-fil/")
public class AuthController {

    private final RegisterService registerService;

    public AuthController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> register(@Valid @RequestBody RegisterRequestBody requestBody) {
        return Map.of("id", registerService.execute(requestBody).getId().toString());
    }
}
