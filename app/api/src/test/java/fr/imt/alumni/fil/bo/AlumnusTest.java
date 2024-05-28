package fr.imt.alumni.fil.bo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class AlumnusTest {

    private Alumnus alumnus ;
    private UUID id;
    @Test
    void AlumusTest(){
        id  = UUID.randomUUID();
        alumnus = new Alumnus(id, "jay", "z",Sex.WOMAN);

        assertEquals(alumnus.getId(), id);
        assertEquals(alumnus.getFirstName(), "jay");
        assertEquals(alumnus.getLastName(), "z");
        assertEquals(alumnus.getSex(),Sex.WOMAN);
    }

}