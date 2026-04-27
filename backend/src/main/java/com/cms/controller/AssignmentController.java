package com.cms.controller;

import com.cms.model.Assignment;
import com.cms.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {
    @Autowired
    private AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        return ResponseEntity.ok(assignmentService.createAssignment(assignment));
    }

    @GetMapping("/course/{id}")
    public ResponseEntity<List<Assignment>> getByCourse(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByCourse(id));
    }
}
