package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.persistance.RefreshTokenDAO;
import fr.imt.alumni.fil.persistance.UserDAO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserDAO userDAO;
    private final RefreshTokenDAO refreshTokenDAO;

    public UserService(UserDAO userDAO, RefreshTokenDAO refreshTokenDAO) {
        this.userDAO = userDAO;
        this.refreshTokenDAO = refreshTokenDAO;
    }

    @Transactional
    public void deleteUser(String id) {
        String idTrimmed = Optional.ofNullable(id).map(String::trim).orElse("");
        UUID uuid = UUID.fromString(idTrimmed);
        userDAO.findById(uuid).ifPresent(user -> {
            refreshTokenDAO.deleteAllByUser(user);
            userDAO.delete(user);
        });
    }
}
