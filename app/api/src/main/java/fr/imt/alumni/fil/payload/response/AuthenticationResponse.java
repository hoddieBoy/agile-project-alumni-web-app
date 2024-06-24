package fr.imt.alumni.fil.payload.response;

import fr.imt.alumni.fil.domain.enums.TokenType;

import java.util.List;
import java.util.UUID;

public record AuthenticationResponse(
        UUID userId,
        String username,
        List<String> roles,
        String accessToken,
        String refreshToken,
        TokenType tokenType
) {
}
