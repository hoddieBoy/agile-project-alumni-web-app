package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.service.StatisticService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/alumni-fil/statistic")
@SecurityRequirement(name = "Bearer Authentification")
public class PromotionController {

    @Autowired
    private StatisticService statistic;

    @GetMapping("/total-alumni")
    public long getTotalAlumni() {
        return statistic.getTotalAlumni();
    }

    @GetMapping("/total-stayed-alumni")
    public long getTotalStayed() {
        return statistic.getTotalStayed();
    }

    @GetMapping("/total-alumni-france")
    public long getTotalAlumniInFrance() {
        return statistic.getTotalAlumniInFrance();
    }

    @GetMapping("/total-alumni-abroad")
    public long getTotalAlumniAbroad() {
        return statistic.getTotalAlumniAbroad();
    }

    @GetMapping("/total-current-companies")
    public long getTotalCurrentCompanies() {
        return statistic.getTotalCurrentCompanies();
    }

    @GetMapping("/total-female-alumni")
    public long getTotalFemaleAlumni() {
        return statistic.getTotalFemaleAlumni();
    }
}
