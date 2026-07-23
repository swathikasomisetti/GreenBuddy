package com.greenbuddy.greenbuddy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Paths;

/**
 * Makes the local "uploads/" folder accessible as /uploads/** over HTTP,
 * so the React frontend can load avatar images via:
 *   http://localhost:8082/uploads/avatars/<filename>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = Paths.get(uploadDir).toAbsolutePath().toUri().toString();

        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations(absolutePath);
    }
}