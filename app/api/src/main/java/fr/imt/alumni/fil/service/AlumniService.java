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

    public List<Alumnus> getAlumni(String name) {
        name = Optional.ofNullable(name).map(String::trim).orElse("");
        return(!name.isBlank())
                ? alumniDAO.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name)
                : List.of();
    }
}
