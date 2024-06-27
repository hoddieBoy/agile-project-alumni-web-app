package fr.imt.alumni.fil.persistance;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface AlumniDAO extends JpaRepository<Alumnus, UUID> {    
    @Query(value="SELECT COUNT(*) FROM alumni", nativeQuery=true)
    long getTotal();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE is_stayed = true", nativeQuery = true)
    long getTotalAlumniStayed();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE country = 'France'", nativeQuery = true)
    long getTotalAlumniInFrance();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE country != 'France'", nativeQuery = true)
    long getTotalAlumniAbroad();

    @Query(value = "SELECT COUNT(DISTINCT current_company) FROM alumni", nativeQuery = true)
    long getTotalCurrentCompanies();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE sex = '0'", nativeQuery = true)
    long getTotalFemaleAlumni();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE sex = '1'", nativeQuery = true)
    long getTotalHommeAlumni();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE country = 'Portugal'", nativeQuery = true)
    long getTotalAlumniInPortugal();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE country = 'Angleterre'", nativeQuery = true)
    long getTotalAlumniInAngleterre();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE country = 'Espagne'", nativeQuery = true)
    long getTotalAlumniInEspagne();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE country = 'Suisse'", nativeQuery = true)
    long getTotalAlumniInSuisse();

    @Query(value = "SELECT coop_company, COUNT(*) AS alternant_count FROM alumni GROUP BY coop_company ORDER BY alternant_count DESC", nativeQuery = true)
    List<Object[]> getCompaniesByAlumniCount();

    Set<Alumnus> findByGraduationYear(String graduationYear);

    @Query(value = "SELECT * FROM alumni a WHERE " +
            "(LOWER(CONCAT(a.first_name, ' ', a.last_name)) LIKE LOWER(CONCAT('%', :fullName, '%')) ) AND " +
            "(a.current_company LIKE CONCAT('%', :currentCompany, '%')) AND " +
            "a.graduation_year = :graduationYear AND " +
            "(a.country LIKE CONCAT('%', :country, '%')) AND " +
            "(a.city LIKE CONCAT('%', :city, '%'))", nativeQuery = true)
    List<Alumnus> search(@Param("fullName") String name,
                         @Param("currentCompany") String currentCompany,
                         @Param("graduationYear") String graduationYear,
                         @Param("country") String country,
                         @Param("city") String city);
}
