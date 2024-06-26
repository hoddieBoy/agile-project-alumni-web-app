package fr.imt.alumni.fil.payload.response;
import java.util.List;

public record SearchResponse (
    String searchName,
    String searchCity,
    String searchCountry,
    String searchCurrentCompany,
    String searchGraduationYear,
    List<AlumniData> results
) {
}
