package fr.imt.alumni.fil.domain.bo;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_token")
public class RefreshToken {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(nullable = false)
    private  Instant expiryDate;

    private boolean revoked;

    public RefreshToken(UUID id, User user, Instant expiryDate, boolean revoked) {
        this.id = id;
        this.user = user;
        this.expiryDate = expiryDate;
        this.revoked = revoked;
    }

    public RefreshToken(UUID id, User user, Instant expiryDate) {
        this(id, user, expiryDate, false);
    }

    protected RefreshToken() {
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }


    public Instant getExpiryDate() {
        return expiryDate;
    }

    public boolean isRevoked() {
        return revoked;
    }

    public void revoke() {
        this.revoked = true;
    }
}
