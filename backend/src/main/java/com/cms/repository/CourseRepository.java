package com.cms.repository;

import com.cms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCreatedBy(Long createdBy);
}
