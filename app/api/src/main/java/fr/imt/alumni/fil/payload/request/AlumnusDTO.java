package fr.imt.alumni.fil.payload.request;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AlumnusDTO(
        @NotBlank(message = "firstName is mandatory")
        String firstName,
        @NotBlank(message = "lastName is mandatory")
        String lastName,
        @NotNull(message = "must not be null")
         @Min(0) @Max(1)
        Integer sex,
        @NotBlank(message = "mail is mandatory")
        String mail,
        @NotBlank(message = "coopCompany is mandatory")
        String coopCompany,
        @NotBlank(message = "currentCompany is mandatory")
        String currentCompany,
        @NotBlank(message = "website is mandatory")
        String website,
        @NotBlank(message = "country is mandatory")
        String country,
        @NotBlank(message = "city is mandatory")
        String city,
        @NotNull(message = "must not be null")
        Boolean isStayed,
        @NotBlank(message = "graduationYear is mandatory")
        String graduationYear
) {
}
