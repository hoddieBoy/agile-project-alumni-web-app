package fr.imt.alumni.fil.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import fr.imt.alumni.fil.exception.NotFoundException;
import fr.imt.alumni.fil.persistance.UserDAO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

@Configuration
@ComponentScan("fr.imt.alumni.fil")
public class AuthConfig {

    @Value("${application.security.jwt.secret-key}")
    private String jwtSecret;

    private final UserDAO userDAO;

    public AuthConfig(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * we provide an implementation of the UserDetailsService functional interface, which has a loadByUsername method
     * throws UsernameNotFoundException */
    @Bean
    public UserDetailsService userDetailsService(){
        return username -> userDAO.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("No user found with username " + username));
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecret.getBytes()));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

}
