package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.domain.bo.RefreshToken;
import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.domain.enums.TokenType;
import fr.imt.alumni.fil.exception.NotFoundException;
import fr.imt.alumni.fil.exception.TokenException;
import fr.imt.alumni.fil.payload.request.RefreshTokenRequest;
import fr.imt.alumni.fil.payload.response.RefreshTokenResponse;
import fr.imt.alumni.fil.persistance.RefreshTokenDAO;
import fr.imt.alumni.fil.persistance.UserDAO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.web.util.WebUtils;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenDAO refreshTokenDAO;

    private final UserDAO userDAO;

    private final JWTService jwtService;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long expiration;

    public RefreshTokenService(RefreshTokenDAO refreshTokenDAO, UserDAO userDAO, JWTService jwtService) {
        this.refreshTokenDAO = refreshTokenDAO;
        this.userDAO = userDAO;
        this.jwtService = jwtService;
    }

    public RefreshToken createRefreshToken(UUID userId) {
        User user = userDAO.findById(userId).orElseThrow(() -> new NotFoundException("No user found with id " + userId));

        return refreshTokenDAO.save(
                new RefreshToken(
                        UUID.randomUUID(),
                        user,
                        Instant.now().plusSeconds(expiration)
                )
        );
    }

    public RefreshTokenResponse generateNewToken(RefreshTokenRequest request) {
        try {
            RefreshToken refreshToken = refreshTokenDAO.findById(UUID.fromString(request.refreshToken())).orElseThrow(() -> new NotFoundException("No refresh token found with id " + request.refreshToken()));
            if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
                throw new TokenException(request.refreshToken(), "Refresh token has expired");
            }

            User user = refreshToken.getUser();
            String jwt = jwtService.generateToken(user);
            String newRefreshToken = createRefreshToken(user.getId()).getId().toString();

            return new RefreshTokenResponse(
                    jwt,
                    newRefreshToken,
                    TokenType.BEARER
            );
        } catch (IllegalArgumentException e) {
            throw new TokenException(request.refreshToken(), "Invalid refresh token");
        }
    }

    public void deleteToken(String refreshToken) {
        try {
            refreshTokenDAO.findById(UUID.fromString(refreshToken)).ifPresent(refreshTokenDAO::delete);
        } catch (IllegalArgumentException e) {
            throw new TokenException(refreshToken, "Invalid refresh token");
        }
    }

    public ResponseCookie createRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(expiration)
                .sameSite("Strict")
                .build();
    }

    public ResponseCookie deleteRefreshTokenCookie() {
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
    }

    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, "refreshToken");

        return cookie != null ? cookie.getValue() : null;
    }
}
