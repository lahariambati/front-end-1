package com.cms.controller;

import com.cms.model.Enrollment;
import com.cms.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @PostMapping
    public ResponseEntity<Enrollment> enroll(@RequestBody Enrollment enrollment) {
        return ResponseEntity.ok(enrollmentRepository.save(enrollment));
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<List<Enrollment>> getByStudent(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentRepository.findByStudentId(id));
    }

    @GetMapping("/course/{id}")
    public ResponseEntity<List<Enrollment>> getByCourse(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentRepository.findByCourseId(id));
    }
}
