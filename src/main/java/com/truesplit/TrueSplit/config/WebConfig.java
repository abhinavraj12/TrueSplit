package com.truesplit.TrueSplit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve frontend files from the Frontend directory
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/", "classpath:/Frontend/")
                .setCachePeriod(3600);
        
        // For development, also serve from file system
        registry.addResourceHandler("/css/**", "/js/**", "/**")
                .addResourceLocations(
                        "classpath:/Frontend/css/",
                        "classpath:/Frontend/js/",
                        "file:./Frontend/"
                );
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Map routes to your HTML files
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/auth").setViewName("forward:/auth.html");
        registry.addViewController("/login").setViewName("forward:/auth.html");
        registry.addViewController("/dashboard").setViewName("forward:/index.html");
        
        // Handle common routes
        registry.addViewController("/home").setViewName("forward:/index.html");
        registry.addViewController("/app").setViewName("forward:/index.html");
    }
}