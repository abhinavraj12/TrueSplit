package com.truesplit.TrueSplit.service;

import com.truesplit.TrueSplit.dto.response.AuthResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");
        String googleId = oauthUser.getAttribute("sub");

        AuthResponse authResponse = authService.createOrGetUserFromOauth2(name, email,picture, googleId);

        // Store JWT in HttpOnly cookie
        Cookie cookie = new Cookie("TS_AUTH", authResponse.getAuthToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in HTTPS (prod)
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day

        response.addCookie(cookie);

        Cookie refreshCookie = new Cookie("TS_REFRESH", authResponse.getRefreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/auth");
        refreshCookie.setMaxAge(30 * 24 * 60 * 60);
        response.addCookie(refreshCookie);

        //  CLEAR OAuth2 SESSION
        request.getSession().invalidate();

        // Redirect WITHOUT token
        response.sendRedirect("http://localhost:5000/dashboard");
    }
}
