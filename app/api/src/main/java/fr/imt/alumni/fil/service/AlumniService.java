package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.domain.enums.Sex;
import fr.imt.alumni.fil.exception.NotFoundException;
import fr.imt.alumni.fil.payload.request.AlumnusDTO;
import fr.imt.alumni.fil.persistance.AlumniDAO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class AlumniService {

    private final AlumniDAO alumniDAO;

    private final EntityManager entityManager;

    public AlumniService(AlumniDAO alumniDAO, EntityManager entityManager) {
        this.alumniDAO = alumniDAO;
        this.entityManager = entityManager;
    }

    public List<Alumnus> searchAlumni(String fullName, String city, String country, String currentCompany, String graduationYear) {
        String sqlQuery = "SELECT * FROM alumni a WHERE 1=1"; // Toujours vrai pour simplifier l'ajout de conditions
        if (fullName != null && !fullName.isEmpty()) {
            sqlQuery += " AND LOWER(CONCAT(a.first_name, ' ', a.last_name)) LIKE LOWER(CONCAT('%', :fullName, '%'))";
        }
    
        if (currentCompany != null && !currentCompany.isEmpty()) {
            sqlQuery += " AND a.current_company LIKE CONCAT('%', :currentCompany, '%')";
        }
    
        if (graduationYear != null && !graduationYear.isEmpty()) {
            sqlQuery += " AND a.graduation_year = :graduationYear";
        }
    
        if (country != null && !country.isEmpty()) {
            sqlQuery += " AND a.country LIKE CONCAT('%', :country, '%')";
        }
    
        if (city != null && !city.isEmpty()) {
            sqlQuery += " AND a.city LIKE CONCAT('%', :city, '%')";
        }
    
        Query alumniquery = entityManager.createNativeQuery(sqlQuery, Alumnus.class);
    
        if (fullName != null && !fullName.isEmpty()) {
            alumniquery.setParameter("fullName", fullName);
        }
    
        if (currentCompany != null && !currentCompany.isEmpty()) {
            alumniquery.setParameter("currentCompany", currentCompany);
        }
    
        if (graduationYear != null && !graduationYear.isEmpty()) {
            alumniquery.setParameter("graduationYear", graduationYear);
        }
    
        if (country != null && !country.isEmpty()) {
            alumniquery.setParameter("country", country);
        }
    
        if (city != null && !city.isEmpty()) {
            alumniquery.setParameter("city", city);
        }
    
        return (List<Alumnus>) alumniquery.getResultList();
    }

    public void addAlumni(List<AlumnusDTO> alumni) {

        for (AlumnusDTO alumnusDTO : alumni) {
            Alumnus alumnus = new Alumnus(
                    UUID.randomUUID(),
                    alumnusDTO.firstName(),
                    alumnusDTO.lastName(),
                    Sex.values()[alumnusDTO.sex()],
                    alumnusDTO.mail(),
                    alumnusDTO.coopCompany(),
                    alumnusDTO.currentCompany(),
                    alumnusDTO.website(),
                    alumnusDTO.country(),
                    alumnusDTO.city(),
                    alumnusDTO.isStayed(),
                    alumnusDTO.graduationYear()
            );
            alumniDAO.save(alumnus);
        }
    }

    public String generateCsv(int year) {
        Set<Alumnus> alumni = alumniDAO.findByGraduationYear(String.valueOf(year));

        if (alumni.isEmpty()) {
            throw new NotFoundException("No alumni found for year " + year);
        }
        String CSV_SEPARATOR = ",";
        StringBuilder csv = new StringBuilder();

        String header = String.format(
                "First Name%sLast Name%sSex%sMail%sCoop Company%sCurrent Company%sWebsite%sCountry%sCity%sIs Stayed%sGraduation Year",
                CSV_SEPARATOR, CSV_SEPARATOR, CSV_SEPARATOR, CSV_SEPARATOR, CSV_SEPARATOR, CSV_SEPARATOR, CSV_SEPARATOR, CSV_SEPARATOR, CSV_SEPARATOR, CSV_SEPARATOR
        );

        csv.append(header).append("\n");

        for (Alumnus alumnus : alumni) {
            csv.append(alumnus.getFirstName()).append(CSV_SEPARATOR)
                    .append(alumnus.getLastName()).append(CSV_SEPARATOR)
                    .append(alumnus.getSex()).append(CSV_SEPARATOR)
                    .append(alumnus.getMail()).append(CSV_SEPARATOR)
                    .append(alumnus.getCoopCompany()).append(CSV_SEPARATOR)
                    .append(alumnus.getCurrentCompany()).append(CSV_SEPARATOR)
                    .append(alumnus.getWebsite()).append(CSV_SEPARATOR)
                    .append(alumnus.getCountry()).append(CSV_SEPARATOR)
                    .append(alumnus.getCity()).append(CSV_SEPARATOR)
                    .append(alumnus.getIsStayed()).append(CSV_SEPARATOR)
                    .append(alumnus.getGraduationYear()).append("\n");
        }

        return csv.toString();
    }

    public void deleteAlumnus(String id) {
        id = Optional.ofNullable(id).map(String::trim).orElse("");
        alumniDAO.deleteById(UUID.fromString(id));
    }
}
