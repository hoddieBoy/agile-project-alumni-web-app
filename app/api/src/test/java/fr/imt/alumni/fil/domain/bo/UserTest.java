package fr.imt.alumni.fil.domain.bo;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserTest {

    @Test
    void testUserWithValidParameters() {
        User user = new User(
                UUID.randomUUID(),
                "username",
                "passwordHash"
        );
        assertEquals("username", user.getUsername());
        assertEquals("passwordHash", user.getPasswordHash());
    }

    @Test
    void testUserWithNullId() {
        assertThrows(NullPointerException.class, () -> new User(
                null,
                "username",
                "passwordHash"
        ));
    }

    @Test
    void testUserWithNullUsername() {
        assertThrows(NullPointerException.class, () -> new User(
                UUID.randomUUID(),
                null,
                "passwordHash"
        ));
    }

    @Test
    void testUserWithNullPasswordHash() {
        assertThrows(NullPointerException.class, () -> new User(
                UUID.randomUUID(),
                "username",
                null
        ));
    }
}