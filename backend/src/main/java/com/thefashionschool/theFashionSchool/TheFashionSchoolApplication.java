package com.thefashionschool.theFashionSchool;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootApplication(scanBasePackages = "com.thefashionschool.theFashionSchool")
public class TheFashionSchoolApplication {

	@Value("${file.upload-dir}")
	private String uploadDir;

	public static void main(String[] args) {
		SpringApplication.run(TheFashionSchoolApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void createUploadsDirectory() {
		try {
			Files.createDirectories(Paths.get(uploadDir));
			System.out.println("Upload directory created at: " + Paths.get(uploadDir).toAbsolutePath());
		} catch (IOException e) {
			System.err.println("Could not create upload directory: " + e.getMessage());
			throw new RuntimeException("Could not create upload directory", e);
		}
	}

	@Bean
	public WebMvcConfigurer webMvcConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {
				registry.addResourceHandler("/uploads/**")
						.addResourceLocations("file:" + uploadDir + "/");
			}
		};
	}
}
