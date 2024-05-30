package fr.imt.alumni.fil.payload.request;

public record LoginRequest(
        String username,
        String password
) {
}
