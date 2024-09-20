package net.happykoo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HappyApplication {
    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(HappyApplication.class);
        application.run(args);
    }
}
