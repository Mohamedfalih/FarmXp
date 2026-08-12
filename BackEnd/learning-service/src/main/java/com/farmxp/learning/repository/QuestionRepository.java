package com.farmxp.learning.repository;

import com.farmxp.learning.entity.Question;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository
        extends JpaRepository<Question, Long> {

    List<Question> findByGameGameId(Long gameId);

    long countByGameGameId(Long gameId);
}