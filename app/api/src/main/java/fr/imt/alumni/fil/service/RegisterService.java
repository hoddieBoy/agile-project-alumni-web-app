package fr.imt.alumni.fil.service;

import fr.imt.alumni.fil.domain.bo.User;
import fr.imt.alumni.fil.persistance.UserDAO;
import fr.imt.alumni.fil.request.BodyValidator;
import fr.imt.alumni.fil.request.RegisterRequestBody;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RegisterService {

    private final UserDAO userDAO;

    private final PasswordEncoder passwordEncoder;

    private final BodyValidator bodyValidator;

    public RegisterService(UserDAO userDAO, PasswordEncoder passwordEncoder, BodyValidator bodyValidator) {
        this.userDAO = userDAO;
        this.passwordEncoder = passwordEncoder;
        this.bodyValidator = bodyValidator;
    }

    public User execute(RegisterRequestBody requestBody) {

        bodyValidator.validate(requestBody);

        return userDAO.save(
                new User(
                        UUID.randomUUID(),
                        requestBody.username(),
                        passwordEncoder.encode(requestBody.password())
                )
        );
    }
}
