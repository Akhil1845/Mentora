package com.mentora.backend.security;

import com.mentora.backend.controller.AuthController;
import com.mentora.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public GoogleOAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof OAuth2User oauth2User)) {
            response.sendRedirect(frontendUrl + "/login?google=failed");
            return;
        }

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        if (email == null || email.isBlank()) {
            response.sendRedirect(frontendUrl + "/login?google=failed");
            return;
        }

        String flow = (String) request.getSession().getAttribute(AuthController.GOOGLE_AUTH_FLOW_SESSION_KEY);
        request.getSession().removeAttribute(AuthController.GOOGLE_AUTH_FLOW_SESSION_KEY);

        var user = userRepository.findByEmail(email).orElse(null);
        boolean exists = user != null;

        if (!exists) {
            response.sendRedirect(
                    frontendUrl + "/register?google=1&email=" + urlEncode(email)
                            + "&name=" + urlEncode(name == null ? "" : name)
            );
            return;
        }

        if ("signup".equalsIgnoreCase(flow)) {
            response.sendRedirect(frontendUrl + "/login?google=account-exists&email=" + urlEncode(email));
            return;
        }

        response.sendRedirect(
                frontendUrl + "/login?google=success&email=" + urlEncode(email)
                        + "&name=" + urlEncode(user.getName())
                        + "&id=" + user.getId()
                        + "&createdAt=" + urlEncode(user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
        );
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
