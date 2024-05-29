package fr.imt.alumni.fil.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class OpenApiConfig implements WebMvcConfigurer {

    @Value("${springdoc.swagger-ui.path}")
    private String swaggerPath;

    @Override
    public void addViewControllers(org.springframework.web.servlet.config.annotation.ViewControllerRegistry registry) {
        registry.addRedirectViewController("/", swaggerPath);
        registry.addRedirectViewController("/api", swaggerPath);
        registry.addRedirectViewController("/api/", swaggerPath);
    }
}
