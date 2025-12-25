package com.truesplit.TrueSplit.security;

import com.truesplit.TrueSplit.Repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getJwtFromRequest(request);

        if (token != null && jwtUtil.validateToken(token)) {

            String username = jwtUtil.getUsername(token);

            // USER DELETED CHECK
            if (!userRepository.existsByEmail(username)) {

                // Clear auth cookie
                Cookie cookie = new Cookie("TS_AUTH", "");
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                cookie.setMaxAge(0); // delete cookie
                response.addCookie(cookie);

                // Clear security context
                SecurityContextHolder.clearContext();

                // HARD FAIL — user is no longer authenticated
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User deleted");
                return;
            }

            // User exists → authenticate normally
            var userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT from HttpOnly Cookie (PRIMARY) or Authorization Header (FALLBACK)
     */
    private String getJwtFromRequest(HttpServletRequest request) {

        //  Try HttpOnly Cookie first
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("TS_AUTH".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        //  Fallback to Authorization header (optional)
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
