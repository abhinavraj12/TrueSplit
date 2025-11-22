package com.truesplit.TrueSplit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuration class for Spring Security.
 *
 * This class defines basic HTTP security for the application.
 * It allows open access to authentication endpoints and secures all others.
 */
@Configuration
public class SecurityConfig {

    /**
     * Configures HTTP security rules for the application.
     *
     * @param http the HttpSecurity object to configure
     * @return a configured SecurityFilterChain
     * @throws Exception if an error occurs while building the security chain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for simplicity (not recommended for production without protection)
                .csrf(csrf -> csrf.disable())

                // Define authorization rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()  // Allow register/login
                        .anyRequest().authenticated()                  // All others need authentication
                )

                // Enable HTTP Basic Authentication
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    /**
     * Provides a BCrypt password encoder bean to securely hash passwords.
     *
     * @return PasswordEncoder instance using BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
