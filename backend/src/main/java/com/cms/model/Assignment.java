package com.cms.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "assignments")
@Data
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long courseId;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private LocalDate deadline;
}
