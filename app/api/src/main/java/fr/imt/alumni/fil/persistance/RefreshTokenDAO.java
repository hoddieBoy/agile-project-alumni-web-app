package fr.imt.alumni.fil.persistance;

import fr.imt.alumni.fil.domain.bo.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RefreshTokenDAO extends JpaRepository<RefreshToken, UUID> {
}
