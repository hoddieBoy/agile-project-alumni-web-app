package fr.imt.alumni.fil.payload.request;

public record AuthenticateRequestBody(
        String username,
        String password
) {
}
