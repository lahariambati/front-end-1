package com.cms.service;

import com.cms.model.Course;
import com.cms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getCoursesByEducator(Long educatorId) {
        return courseRepository.findByCreatedBy(educatorId);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
