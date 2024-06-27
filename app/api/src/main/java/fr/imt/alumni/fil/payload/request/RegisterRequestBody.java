package fr.imt.alumni.fil.payload.request;

import fr.imt.alumni.fil.domain.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestBody(
        @NotBlank(message = "username is mandatory")
        @Size(min = 3, max = 20, message = "username must be between 3 and 20 characters")
        @Pattern(regexp = "^[a-zA-Z0-9]*$", message = "username must contain only letters and numbers")
        String username,
        @NotBlank(message = "password is mandatory")
        @Size(min = 8, max = 20, message = "password must be between 8 and 20 characters")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]*$", message = "password must contain at least one uppercase letter, one lowercase letter and one number")
        String password,
        Role role
) implements RequestBody {
}
