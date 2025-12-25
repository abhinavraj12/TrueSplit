package com.truesplit.TrueSplit.service;

import jakarta.servlet.ServletException;
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
    
    @Value("${frontend.redirect-home}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        String jwt = authService.createOrGetUserFromOauth2(name, email);
        
        // Redirect to a token handler page instead of directly to dashboard
        // The token handler will store the token in localStorage and redirect to dashboard
        String redirectUrl = frontendUrl + "/oauth-callback.html?token=" + jwt;
        response.sendRedirect(redirectUrl);
    }
}