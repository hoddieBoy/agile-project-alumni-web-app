package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.persistance.AlumniDAO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlumniService {

    private final AlumniDAO alumniDAO;

    public AlumniService(AlumniDAO alumniDAO) {
        this.alumniDAO = alumniDAO;
    }


    public List<Alumnus> searchAlumni(
            String name, String city, String country,
            String currentCompany, String graduationYear) {
        name = Optional.ofNullable(name).map(String::trim).orElse("");
        city = Optional.ofNullable(city).map(String::trim).orElse("");
        country = Optional.ofNullable(country).map(String::trim).orElse("");
        currentCompany = Optional.ofNullable(currentCompany).map(String::trim).orElse("");
        graduationYear = Optional.ofNullable(graduationYear).map(String::trim).orElse("");
        return (!name.isBlank()|| !city.isBlank() || !country.isBlank() ||
                !currentCompany.isBlank() || !graduationYear.isBlank())
                ? alumniDAO.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseAndCityContainingIgnoreCaseAndCountryContainingIgnoreCaseAndCurrentCompanyContainingIgnoreCaseAndGraduationYearContainingIgnoreCase(name, name, city, country, currentCompany, graduationYear)
                : List.of();

    }
}
