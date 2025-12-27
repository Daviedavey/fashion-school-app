package com.thefashionschool.theFashionSchool.repository;
import com.thefashionschool.theFashionSchool.model.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentGroupRepository extends JpaRepository<StudentGroup, Long> {
}