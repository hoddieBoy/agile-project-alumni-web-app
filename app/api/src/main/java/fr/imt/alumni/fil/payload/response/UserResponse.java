package fr.imt.alumni.fil.payload.response;

import fr.imt.alumni.fil.domain.enums.Role;

public record UserResponse(
        String id,
        String username,
        Role role
) {
}
