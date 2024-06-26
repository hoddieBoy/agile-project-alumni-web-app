package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.persistance.UserDAO;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserDAO userDAO;

    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public void deleteUSer(String id) {
        id = Optional.ofNullable(id).map(String::trim).orElse("");
        userDAO.deleteById(UUID.fromString(id));
    }
}
