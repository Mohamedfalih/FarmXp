package com.farmxp.scheme.controller;

import com.farmxp.scheme.dto.SchemeRequest;
import com.farmxp.scheme.dto.SchemeResponse;
import com.farmxp.scheme.service.SchemeService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
//@CrossOrigin(origins = "http://localhost:5173")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(
            SchemeService schemeService) {

        this.schemeService = schemeService;
    }

    // ==========================================
    // GET ACTIVE SCHEMES
    // FARMER + ADMIN
    // ==========================================

    @GetMapping
    public ResponseEntity<List<SchemeResponse>>
    getActiveSchemes() {

        return ResponseEntity.ok(
                schemeService.getActiveSchemes()
        );
    }

    // ==========================================
    // GET ALL SCHEMES
    // ADMIN
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<List<SchemeResponse>>
    getAllSchemes() {

        return ResponseEntity.ok(
                schemeService.getAllSchemes()
        );
    }

    // ==========================================
    // GET SCHEME BY ID
    // FARMER + ADMIN
    // ==========================================

    @GetMapping("/{schemeId}")
    public ResponseEntity<SchemeResponse>
    getScheme(
            @PathVariable Long schemeId) {

        return ResponseEntity.ok(
                schemeService.getScheme(
                        schemeId
                )
        );
    }

    // ==========================================
    // GET SCHEMES BY STATE
    // FARMER + ADMIN
    // ==========================================

    @GetMapping("/state/{state}")
    public ResponseEntity<List<SchemeResponse>>
    getSchemesByState(
            @PathVariable String state) {

        return ResponseEntity.ok(
                schemeService.getSchemesByState(
                        state
                )
        );
    }

    // ==========================================
    // CREATE SCHEME
    // ADMIN ONLY
    // ==========================================

    @PostMapping
    public ResponseEntity<SchemeResponse>
    createScheme(
            @Valid @RequestBody
            SchemeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        schemeService.createScheme(
                                request
                        )
                );
    }

    // ==========================================
    // UPDATE SCHEME
    // ADMIN ONLY
    // ==========================================

    @PutMapping("/{schemeId}")
    public ResponseEntity<SchemeResponse>
    updateScheme(
            @PathVariable Long schemeId,
            @Valid @RequestBody
            SchemeRequest request) {

        return ResponseEntity.ok(
                schemeService.updateScheme(
                        schemeId,
                        request
                )
        );
    }

    // ==========================================
    // DELETE SCHEME
    // ADMIN ONLY
    // ==========================================

    @DeleteMapping("/{schemeId}")
    public ResponseEntity<Void>
    deleteScheme(
            @PathVariable Long schemeId) {

        schemeService.deleteScheme(
                schemeId
        );

        return ResponseEntity.noContent()
                .build();
    }
}