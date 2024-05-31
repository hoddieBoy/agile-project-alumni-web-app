package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.domain.bo.RefreshToken;
import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.TokenType;
import fr.imt.alumni.fil.payload.request.BodyValidator;
import fr.imt.alumni.fil.payload.request.RegisterRequestBody;
import fr.imt.alumni.fil.payload.response.AuthenticationResponse;
import fr.imt.alumni.fil.persistance.UserDAO;
import jakarta.transaction.Transactional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Transactional
public class RegisterService {

    private final UserDAO userDAO;

    private final PasswordEncoder passwordEncoder;

    private final BodyValidator bodyValidator;

    private final JWTService jwtService;

    private final RefreshTokenService refreshTokenService;

    public RegisterService(UserDAO userDAO, PasswordEncoder passwordEncoder, BodyValidator bodyValidator, JWTService jwtService, RefreshTokenService refreshTokenService) {
        this.userDAO = userDAO;
        this.passwordEncoder = passwordEncoder;
        this.bodyValidator = bodyValidator;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public AuthenticationResponse execute(RegisterRequestBody requestBody) {
        bodyValidator.validate(requestBody);

        userDAO.findByUsername(requestBody.username()).ifPresent(user -> {
            throw new IllegalArgumentException("Username already exists");
        });

        User user = new User(
                UUID.randomUUID(),
                requestBody.username(),
                passwordEncoder.encode(requestBody.password())
        );

        userDAO.save(user);

        String jwt = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new AuthenticationResponse(
                user.getId(),
                user.getUsername(),
                user.getRole().getAuthorities().stream().map(SimpleGrantedAuthority::getAuthority).toList(),
                jwt,
                refreshToken.getId().toString(),
                TokenType.BEARER
        );
    }
}
