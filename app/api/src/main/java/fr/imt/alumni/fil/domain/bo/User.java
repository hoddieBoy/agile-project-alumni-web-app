package fr.imt.alumni.fil.domain.bo;

import fr.imt.alumni.fil.domain.enums.Role;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    private UUID id;

    @Column(name = "username", unique = true)
    private String username;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public User(UUID id, String username, String passwordHash) {
        this(id, username, passwordHash, Role.USER);
    }

    public User(UUID id, String username, String passwordHash, Role role) {
        Objects.requireNonNull(id, "id must not be null");
        Objects.requireNonNull(username, "username must not be null");
        Objects.requireNonNull(passwordHash, "passwordHash must not be null");
        Objects.requireNonNull(role, "role must not be null");
        this.id = id;
        this.username = username;
        this.password = passwordHash;
        this.role = role;
    }

    protected User() {
    }

    public UUID getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public Role getRole() {
        return role;
    }

    public void updateUsername(String username) {
        this.username = username;
    }

    public void updatePasswordHash(String passwordHash) {
        this.password = passwordHash;
    }
}
