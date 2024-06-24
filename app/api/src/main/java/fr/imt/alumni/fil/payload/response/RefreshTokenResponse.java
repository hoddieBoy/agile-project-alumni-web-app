package fr.imt.alumni.fil.payload.response;

import fr.imt.alumni.fil.domain.enums.TokenType;

public record RefreshTokenResponse(
        String accessToken,
        String refreshToken,
        TokenType tokenType
) {
}
