package com.cms.service;

import com.cms.model.Submission;
import com.cms.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubmissionService {
    @Autowired
    private SubmissionRepository submissionRepository;

    public Submission submitAssignment(Submission submission) {
        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<Submission> getSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    public Submission giveMarks(Long submissionId, Integer marks) {
        Submission submission = submissionRepository.findById(submissionId).orElseThrow();
        submission.setMarks(marks);
        return submissionRepository.save(submission);
    }
}
