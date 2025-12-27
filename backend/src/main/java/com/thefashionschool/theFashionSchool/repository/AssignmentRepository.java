package com.thefashionschool.theFashionSchool.repository;

import com.thefashionschool.theFashionSchool.model.Assignment;
import com.thefashionschool.theFashionSchool.model.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    // Find all assignments, ordered by the creation date (closest first)
    List<Assignment> findAllByOrderByCreatedAtDesc();


    // It finds all assignments where the 'level' is in the provided collection of levels.
    List<Assignment> findByLevelInOrderByCreatedAtDesc(Collection<Level> levels);

    // finders here later if needed, e.g., by exercise
}