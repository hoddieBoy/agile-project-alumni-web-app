package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.domain.enums.Sex;
import fr.imt.alumni.fil.exception.NotFoundException;
import fr.imt.alumni.fil.payload.request.AlumnusDTO;
import fr.imt.alumni.fil.persistance.AlumniDAO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class AlumniService {

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(AlumniService.class);
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

    private static List<AlumnusDTO> csvToAlumniDTO(int year, InputStream csvFile) {
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(csvFile));

            CSVParser csvParser = new CSVParser(br, CSVFormat.DEFAULT.withFirstRecordAsHeader().withTrim());
            List<AlumnusDTO> alumni = new ArrayList<>();

            Iterable<CSVRecord> csvRecords = csvParser.getRecords();
            for (CSVRecord csvRecord : csvRecords) {
                AlumnusDTO alumnus = getAlumnusDTO(year, csvRecord);
                alumni.add(alumnus);
            }

            return alumni;
        } catch (IOException e) {
            throw new RuntimeException("Error reading file", e);
        }
    }

    private static AlumnusDTO getAlumnusDTO(int year, CSVRecord csvRecord) {
        String firstName = csvRecord.get("Prenom");
        String lastName = csvRecord.get("Nom");
        String mail = csvRecord.get("Email");
        int sex = csvRecord.get("Sexe").equals("M") ? 1 : 0;
        String coopCompany = csvRecord.get("Entreprise durant la formation");
        String currentCompany = csvRecord.get("Entreprise actuelle");
        String website = csvRecord.get("Site web");
        String country = csvRecord.get("Pays");
        String city = csvRecord.get("Ville");

        return new AlumnusDTO(firstName, lastName, sex, mail, coopCompany, currentCompany, website, country, city, coopCompany.equals(currentCompany), "" + year);
    }

    public void uploadCsv(MultipartFile file, int year) {
        try {
            List<AlumnusDTO> alumni = csvToAlumniDTO(year, file.getInputStream());
            addAlumni(alumni);
        } catch (IOException e) {
            throw new RuntimeException("Error reading file", e);
        }
    }
}
