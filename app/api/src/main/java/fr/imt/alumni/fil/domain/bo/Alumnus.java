package fr.imt.alumni.fil.domain.bo;

import fr.imt.alumni.fil.domain.enums.Sex;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "Alumni")
public class Alumnus {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "sex")
    private Sex sex;

    public Alumnus(UUID id, String firstName, String lastName, Sex sex){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.sex = sex;
    }

    protected Alumnus() {
    }

    public UUID getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Sex getSex() {
        return sex;
    }

    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
