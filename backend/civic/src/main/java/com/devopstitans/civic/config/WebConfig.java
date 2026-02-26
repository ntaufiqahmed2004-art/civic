package com.devopstitans.civic.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This maps the URL "http://localhost:8080/uploads/..." 
        // to your actual folder "C:/CIVIC/uploads/"
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///C:/CIVIC/uploads/");
    }
}