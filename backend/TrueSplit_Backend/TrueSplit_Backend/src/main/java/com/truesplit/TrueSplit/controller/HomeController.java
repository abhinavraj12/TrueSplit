package com.truesplit.TrueSplit.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/api/protected")
    public String protectedEndpoint() {
        return "This is protected content - authenticated!";
    }
}
