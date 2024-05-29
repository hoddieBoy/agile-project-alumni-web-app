package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.persistance.AlumniDAO;

import java.util.List;
import java.util.Optional;

public class AlumniService {

    private AlumniDAO alumniDAO;

    private Alumnus alumnus;

    public AlumniService(AlumniDAO alumniDAO, Alumnus alumnus) {
        this.alumniDAO = alumniDAO;
        this.alumnus = alumnus;
    }

    public List<Alumnus> getAlumni(String name) {
        name = Optional.ofNullable(name).map(String::trim).orElse(null);
        return(name != null)
                ? alumniDAO.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name)
                : alumniDAO.findAll();
    }
}
