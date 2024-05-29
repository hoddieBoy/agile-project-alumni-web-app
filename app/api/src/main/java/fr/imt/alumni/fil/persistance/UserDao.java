package fr.imt.alumni.fil.persistance;

import fr.imt.alumni.fil.domain.bo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserDao extends JpaRepository<User, UUID> {
}
