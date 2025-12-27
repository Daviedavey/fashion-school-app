package com.thefashionschool.theFashionSchool.repository;

import com.thefashionschool.theFashionSchool.model.FashionIcon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FashionIconRepository extends JpaRepository<FashionIcon, Long> {

    // This custom query efficiently finds the single most recently updated record.
    Optional<FashionIcon> findTopByOrderByUpdatedAtDesc();
}