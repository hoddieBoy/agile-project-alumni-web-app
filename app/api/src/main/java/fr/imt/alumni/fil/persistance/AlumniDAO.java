package fr.imt.alumni.fil.persistance;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AlumniDAO extends JpaRepository<Alumnus, UUID>{

    List<Alumnus> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}
