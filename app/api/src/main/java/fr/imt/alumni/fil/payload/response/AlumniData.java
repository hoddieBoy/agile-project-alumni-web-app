package fr.imt.alumni.fil.payload.response;

public record AlumniData(
    String id,
    String fullName,
    String currentCompany,
    String city,
    String country,
    String graduationYear,
    String website
) {
}
