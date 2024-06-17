package fr.imt.alumni.fil.domain.enums;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public enum Role {
    ADMIN(
            Set.of(
                    Permission.READ,
                    Permission.WRITE,
                    Permission.DELETE
            )
    ),
    USER(
            Set.of(
                    Permission.READ,
                    Permission.WRITE
            )
    );

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public boolean hasPermission(Permission permission) {
        return permissions.contains(permission);
    }

    public List<SimpleGrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));

        this.getPermissions().forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.name())));

        return authorities;
    }
}
