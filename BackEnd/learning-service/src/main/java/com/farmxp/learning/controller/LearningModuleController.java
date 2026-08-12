package com.farmxp.learning.controller;

import com.farmxp.learning.dto.ModuleRequest;
import com.farmxp.learning.dto.ModuleResponse;
import com.farmxp.learning.service.ModuleService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning/modules")
@CrossOrigin(origins = "http://localhost:5173")
public class LearningModuleController {

    private final ModuleService moduleService;

    public LearningModuleController(
            ModuleService moduleService) {

        this.moduleService = moduleService;
    }

    // ==========================================
    // CREATE MODULE
    // ==========================================

    @PostMapping
    public ResponseEntity<ModuleResponse> createModule(
            @Valid @RequestBody ModuleRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(moduleService.createModule(request));
    }

    // ==========================================
    // GET PUBLISHED MODULES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<ModuleResponse>>
    getPublishedModules() {

        return ResponseEntity.ok(
                moduleService.getPublishedModules()
        );
    }

    // ==========================================
    // GET MODULE BY ID
    // ==========================================

    @GetMapping("/{moduleId}")
    public ResponseEntity<ModuleResponse>
    getModule(
            @PathVariable Long moduleId) {

        return ResponseEntity.ok(
                moduleService.getModule(moduleId)
        );
    }
}