package fr.imt.alumni.fil.persistance;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface AlumniDao extends JpaRepository<Alumnus, UUID> {

    @Query(value = "SELECT COUNT(*) FROM alumni", nativeQuery = true)
    long getTotal();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE is_stayed = true", nativeQuery = true)
    long getTotalAlumniStayed();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE country = 'France'", nativeQuery = true)
    long getTotalAlumniInFrance();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE country != 'France'", nativeQuery = true)
    long getTotalAlumniAbroad();

    @Query(value = "SELECT COUNT(DISTINCT current_company) FROM alumni", nativeQuery = true)
    long getTotalCurrentCompanies();

    @Query(value = "SELECT COUNT(*) FROM alumni WHERE sex = 'F'", nativeQuery = true)
    long getTotalFemaleAlumni();
}