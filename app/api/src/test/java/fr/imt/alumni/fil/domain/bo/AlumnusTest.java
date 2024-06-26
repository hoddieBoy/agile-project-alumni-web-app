package fr.imt.alumni.fil.domain.bo;

import fr.imt.alumni.fil.domain.enums.Sex;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AlumnusTest {

    @Test
    void AlumnusConstructorTest(){
        UUID id = UUID.randomUUID();
        Alumnus alumnus = new Alumnus(id, "jay", "z", Sex.WOMAN, "jay.z@gmail.com",
                "DGFiP", "DGFiP", "https://www.jayz.com",
                "France", "Paris", true, "2026");

        assertEquals(alumnus.getId(), id);
        assertEquals("jay", alumnus.getFirstName());
        assertEquals("z", alumnus.getLastName());
        assertEquals(Sex.WOMAN, alumnus.getSex());
        assertEquals("jay.z@gmail.com", alumnus.getMail());
        assertEquals("DGFiP", alumnus.getCoopCompany());
        assertEquals("DGFiP", alumnus.getCurrentCompany());
        assertEquals("https://www.jayz.com", alumnus.getWebsite());
        assertEquals("France", alumnus.getCountry());
        assertEquals("Paris", alumnus.getCity());
        assertTrue(alumnus.getIsStayed());
        assertEquals("2026", alumnus.getGraduationYear());

    }

}