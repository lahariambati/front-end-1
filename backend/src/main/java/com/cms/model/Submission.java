package com.cms.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "submissions")
@Data
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long assignmentId;
    
    private Long studentId;
    
    private String fileUrl;
    
    private Integer marks;
}
