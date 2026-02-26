package com.devopstitans.civic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class CivicApplication {

    public static void main(String[] args) {
        SpringApplication.run(CivicApplication.class, args);
    }

    // This Bean allows Spring to "Inject" RestTemplate into your GeminiService
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}