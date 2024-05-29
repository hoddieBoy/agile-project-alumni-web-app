package fr.imt.alumni.fil.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class BodyValidator {

    private final Validator validator;

    public BodyValidator(Validator validator) {
        this.validator = validator;
    }

    public void validate(RequestBody body) {
        Set<ConstraintViolation<RequestBody>> violations = validator.validate(body);

        if (!violations.isEmpty()) {
            StringBuilder message = new StringBuilder();
            for (ConstraintViolation<RequestBody> violation : violations) {
                message.append(violation.getMessage()).append("\n");
            }

            throw new ConstraintViolationException(message.toString(), violations);
        }
    }
}
