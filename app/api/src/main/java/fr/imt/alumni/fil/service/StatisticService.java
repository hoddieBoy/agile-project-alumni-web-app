package fr.imt.alumni.fil.service;

import org.springframework.stereotype.Service;
import fr.imt.alumni.fil.persistance.AlumniDAO;

@Service
public class StatisticService {
    
    private final AlumniDAO repository;

    public StatisticService(AlumniDAO repository) {
        this.repository = repository;
    }

    public long getTotalAlumni() {
        return repository.getTotal();
    }

    public long getTotalStayed() {
        return repository.getTotalAlumniStayed();
    }

    public long getTotalAlumniInFrance() {
        return repository.getTotalAlumniInFrance();
    }

    public long getTotalAlumniAbroad() {
        return repository.getTotalAlumniAbroad();
    }

    public long getTotalCurrentCompanies() {
        return repository.getTotalCurrentCompanies();
    }

    public long getTotalFemaleAlumni() {
        return repository.getTotalFemaleAlumni();
    }
}