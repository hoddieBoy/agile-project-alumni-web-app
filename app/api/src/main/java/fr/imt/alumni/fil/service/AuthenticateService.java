package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.TokenType;
import fr.imt.alumni.fil.payload.request.AuthenticateRequestBody;
import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.persistance.UserDAO;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class AuthenticateService {

    private final JWTService jwtService;

    private final AuthenticationManager authenticationManager;

    private final RefreshTokenService refreshTokenService;

    private final UserDAO userDAO;

    public AuthenticateService(JWTService jwtService, AuthenticationManager authenticationManager, RefreshTokenService refreshTokenService, UserDAO userDAO) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
        this.userDAO = userDAO;
    }

    public AuthenticationResponse execute(AuthenticateRequestBody requestBody) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(requestBody.username(), requestBody.password())
        );

        User user = userDAO.findByUsername(requestBody.username()).orElseThrow(() -> new BadCredentialsException(String.format("Failed to authenticate user %s", requestBody.username())));
        String jwt = jwtService.generateToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getId().toString();

        return new AuthenticationResponse(
                user.getId(),
                user.getUsername(),
                user.getRole().getAuthorities().stream().map(SimpleGrantedAuthority::getAuthority).toList(),
                jwt,
                refreshToken,
                TokenType.BEARER
        );
    }
}
