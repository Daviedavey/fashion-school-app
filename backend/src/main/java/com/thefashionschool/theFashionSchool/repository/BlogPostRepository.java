package com.thefashionschool.theFashionSchool.repository;

import com.thefashionschool.theFashionSchool.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    // Optimized for homepage
    @Query("SELECT b FROM BlogPost b ORDER BY b.createdAt DESC LIMIT :limit")
    List<BlogPost> findRecentPosts(@Param("limit") int limit);


    // Custom query to get all posts ordered by creation date (newest first)
    List<BlogPost> findAllByOrderByCreatedAtDesc();

    // Optional: Find posts by username
    List<BlogPost> findByUsernameOrderByCreatedAtDesc(String username);
}