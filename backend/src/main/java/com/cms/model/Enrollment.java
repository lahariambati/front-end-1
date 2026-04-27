package com.cms.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "enrollments")
@Data
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long studentId;
    private Long courseId;
    private String studentName;
}
