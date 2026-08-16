package com.farmxp.scheme.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "auth-service")
public interface AuthServiceClient {

    @GetMapping("/api/auth/users/by-role")
    List<Long> getUsersByRole(@RequestParam("role") String role);

}
