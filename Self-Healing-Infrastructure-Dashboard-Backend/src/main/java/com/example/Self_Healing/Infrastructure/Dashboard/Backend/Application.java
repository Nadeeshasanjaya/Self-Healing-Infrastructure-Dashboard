package com.example.Self_Healing.Infrastructure.Dashboard.Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.selfhealing", "com.example.Self_Healing.Infrastructure.Dashboard.Backend"})
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
