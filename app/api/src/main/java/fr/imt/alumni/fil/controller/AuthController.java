package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.payload.request.AuthenticateRequestBody;
import fr.imt.alumni.fil.payload.request.RefreshTokenRequest;
import fr.imt.alumni.fil.payload.request.RegisterRequestBody;
import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.payload.response.RefreshTokenResponse;
import fr.imt.alumni.fil.service.AuthenticateService;
import fr.imt.alumni.fil.service.JWTService;
import fr.imt.alumni.fil.service.RefreshTokenService;
import fr.imt.alumni.fil.service.RegisterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/alumni-fil/auth")
@SecurityRequirements
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
public class AuthController {

    private final RegisterService registerService;
    private final AuthenticateService authenticateService;
    private final RefreshTokenService refreshTokenService;
    private final JWTService jwtService;

    public AuthController(RegisterService registerService, AuthenticateService authenticateService, RefreshTokenService refreshTokenService,
                          JWTService jwtService) {
        this.registerService = registerService;
        this.authenticateService = authenticateService;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
    }

    @Operation(summary = "Register a new user", description = "Register a new user with a username and password")
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequestBody requestBody) {
        AuthenticationResponse response = registerService.execute(requestBody);
        ResponseCookie jwtCookie = jwtService.createAccessTokenCookie(response.accessToken());
        ResponseCookie refreshTokenCookie = refreshTokenService.createRefreshTokenCookie(response.refreshToken());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(response);
    }

    @Operation(summary = "Authenticate a user", description = "Authenticate a user with username and password")
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticateRequestBody requestBody) {
        AuthenticationResponse response = authenticateService.execute(requestBody);
        ResponseCookie jwtCookie = jwtService.createAccessTokenCookie(response.accessToken());
        ResponseCookie refreshTokenCookie = refreshTokenService.createRefreshTokenCookie(response.refreshToken());

        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(response);
    }

    @Operation(summary = "Refresh JWT token", description = "Refresh the JWT token using the refresh token")
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest requestBody) {
        return ResponseEntity.status(HttpStatus.OK).body(refreshTokenService.generateNewToken(requestBody));
    }

    @Operation(summary = "Refresh JWT token using cookie", description = "Refresh the JWT token using the refresh token stored in a cookie")
    @PostMapping("/refresh-token-cookie")
    public ResponseEntity<RefreshTokenResponse> refreshTokenCookie(HttpServletRequest request) {
        String refreshToken = refreshTokenService.getRefreshTokenFromCookie(request);
        RefreshTokenResponse response = refreshTokenService.generateNewToken(new RefreshTokenRequest(refreshToken));
        ResponseCookie jwtCookie = jwtService.createAccessTokenCookie(response.accessToken());

        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(response);
    }

    @Operation(summary = "Logout user", description = "Logout the user and invalidate the refresh token")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String refreshToken = refreshTokenService.getRefreshTokenFromCookie(request);

        if (refreshToken != null) {
            refreshTokenService.deleteToken(refreshToken);
        }

        ResponseCookie jwtCookie = jwtService.deleteAccessTokenCookie();
        ResponseCookie refreshTokenCookie = refreshTokenService.deleteRefreshTokenCookie();

        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .build();
    }
}