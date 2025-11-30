package com.truesplit.TrueSplit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TrueSplitApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrueSplitApplication.class, args);
        System.out.println("Backend Server Running");
    }
}
