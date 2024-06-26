package fr.imt.alumni.fil.controller;

import fr.imt.alumni.fil.service.StatisticService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alumni-fil/statistic")
@SecurityRequirement(name = "Bearer Authentification")
public class PromotionController {

    @Autowired
    private StatisticService statistic;

    @GetMapping("/total-alumni")
    public ResponseEntity<Long> getTotalAlumni() {
        long totalAlumni = statistic.getTotalAlumni();
        return ResponseEntity.ok(totalAlumni);
    }

    @GetMapping("/total-stayed-alumni")
    public ResponseEntity<Long> getTotalStayed() {
        return ResponseEntity.ok(statistic.getTotalStayed());
    }

    @GetMapping("/total-alumni-france")
    public ResponseEntity<Long> getTotalAlumniInFrance() {
        return ResponseEntity.ok(statistic.getTotalAlumniInFrance());
    }

    @GetMapping("/total-alumni-abroad")
    public ResponseEntity<Long> getTotalAlumniAbroad() {
        return ResponseEntity.ok(statistic.getTotalAlumniAbroad());
    }

    @GetMapping("/total-current-companies")
    public ResponseEntity<Long> getTotalCurrentCompanies() {
        return ResponseEntity.ok(statistic.getTotalCurrentCompanies());
    }

    @GetMapping("/total-female-alumni")
    public ResponseEntity<Long> getTotalFemaleAlumni() {
        return ResponseEntity.ok(statistic.getTotalFemaleAlumni());
    }

    @GetMapping("/total-homme-alumni")
    public ResponseEntity<Long> getTotalHommeAlumni() {
        return ResponseEntity.ok(statistic.getTotalHommeAlumni());
    }

    @GetMapping("/total-alumni-espagne")
    public ResponseEntity<Long> getTotalAlumniInEspagne() {
        return ResponseEntity.ok(statistic.getTotalAlumniInEspagne());
    }

    @GetMapping("/total-alumni-portugal")
    public ResponseEntity<Long> getTotalAlumniInPortugal() {
        return ResponseEntity.ok(statistic.getTotalAlumniInPortugal());
    }

    @GetMapping("/total-alumni-angleterre")
    public ResponseEntity<Long> getTotalAlumniInAngleterre() {
        return ResponseEntity.ok(statistic.getTotalAlumniInAngleterre());
    }

    @GetMapping("/total-alumni-suisse")
    public ResponseEntity<Long> getTotalAlumniInSuisse() {
        return ResponseEntity.ok(statistic.getTotalAlumniInSuisse());
    }

    @GetMapping("/companies-by-alumni-count")
    public ResponseEntity<List<Object[]>> getCompaniesByAlumniCount() {
        return ResponseEntity.ok(statistic.getCompaniesByAlumniCount());
    }
}
