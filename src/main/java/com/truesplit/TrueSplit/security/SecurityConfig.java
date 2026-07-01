package com.truesplit.TrueSplit.security;

import com.truesplit.TrueSplit.Repository.UserRepository;
import com.truesplit.TrueSplit.service.OAuth2LoginSuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@Slf4j
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final UserRepository userRepository;

    public SecurityConfig(
            JwtUtil jwtUtil,
            CustomUserDetailsService customUserDetailsService,
            OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
            UserRepository userRepository
    ) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        var jwtFilter = new JwtAuthenticationFilter(
                jwtUtil,
                customUserDetailsService,
                userRepository
        );

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/**",
                                "/otp/**",
                                "/oauth2/**",
                                "/login/**",
                                "/error**",
                                "/api/me"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .successHandler(oAuth2LoginSuccessHandler)
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint((req, res, exx) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"success\":false,\"error\":{\"code\":\"UNAUTHORIZED\",\"message\":\"Please sign in to continue.\"}}");
                }))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
