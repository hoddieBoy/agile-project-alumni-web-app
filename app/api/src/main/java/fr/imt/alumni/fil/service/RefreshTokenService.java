package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.domain.bo.RefreshToken;
import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.exception.NotFoundException;
import fr.imt.alumni.fil.persistance.RefreshTokenDAO;
import fr.imt.alumni.fil.persistance.UserDAO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenDAO refreshTokenDAO;

    private final UserDAO userDAO;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long expiration;

    public RefreshTokenService(RefreshTokenDAO refreshTokenDAO, UserDAO userDAO) {
        this.refreshTokenDAO = refreshTokenDAO;
        this.userDAO = userDAO;
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
}
