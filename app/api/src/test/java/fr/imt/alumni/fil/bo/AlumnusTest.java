package fr.imt.alumni.fil.bo;

import fr.imt.alumni.fil.domain.bo.Alumnus;
import fr.imt.alumni.fil.domain.enums.Sex;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AlumnusTest {

    private Alumnus alumnus ;
    private UUID id;
    @Test
    void AlumusTest(){
        id  = UUID.randomUUID();
        alumnus = new Alumnus(id, "jay", "z", Sex.WOMAN);

        assertEquals(id, alumnus.getId());
        assertEquals("jay", alumnus.getFirstName());
        assertEquals("z", alumnus.getLastName());
        assertEquals(Sex.WOMAN, alumnus.getSex());
    }

}