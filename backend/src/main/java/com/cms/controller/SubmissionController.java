package com.cms.controller;

import com.cms.model.Submission;
import com.cms.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {
    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<Submission> submit(@RequestBody Submission submission) {
        return ResponseEntity.ok(submissionService.submitAssignment(submission));
    }

    @GetMapping("/assignment/{id}")
    public ResponseEntity<List<Submission>> getByAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(id));
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<List<Submission>> getByStudent(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStudent(id));
    }

    @PutMapping("/{id}/marks")
    public ResponseEntity<Submission> giveMarks(@PathVariable Long id, @RequestBody Integer marks) {
        return ResponseEntity.ok(submissionService.giveMarks(id, marks));
    }
}
