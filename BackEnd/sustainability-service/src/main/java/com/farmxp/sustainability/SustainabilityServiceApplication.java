package com.farmxp.sustainability;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class SustainabilityServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SustainabilityServiceApplication.class, args);
	}

}
