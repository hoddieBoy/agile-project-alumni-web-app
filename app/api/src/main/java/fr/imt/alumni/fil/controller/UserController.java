package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.payload.response.UserResponse;
import fr.imt.alumni.fil.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alumni-fil/users")
@SecurityRequirement(name = "Bearer Authentification")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @DeleteMapping(path = "/delete-user/{user_id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Delete a user",
            description = "Delete a user by its id",
            tags = {"users"},
            responses = {
                    @ApiResponse(
                            responseCode = "204",
                            description = "User deleted"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Bad request",
                            content = @Content
                    )
            }
    )
    public ResponseEntity<Object> deleteAlumnus(
            @PathVariable("user_id")
            @Pattern(regexp = "[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}")
            String id) {

        userService.deleteUSer(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping(path = "/all-users",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get all users",
            description = "Retrieve the username and role of all users",
            tags = {"users"},
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "List of users",
                            content = @Content
                    )
            }
    )
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

}
