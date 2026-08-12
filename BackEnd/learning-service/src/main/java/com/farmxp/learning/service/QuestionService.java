package com.farmxp.learning.service;

import com.farmxp.learning.dto.*;
import com.farmxp.learning.entity.Game;
import com.farmxp.learning.entity.Question;
import com.farmxp.learning.exception.ResourceNotFoundException;
import com.farmxp.learning.repository.QuestionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final GameService gameService;

    public QuestionService(
            QuestionRepository questionRepository,
            GameService gameService) {

        this.questionRepository = questionRepository;
        this.gameService = gameService;
    }

    @Transactional
    public QuestionResponse createQuestion(
            Long gameId,
            QuestionRequest request) {

        Game game =
                gameService.getGameEntity(gameId);

        Question question = new Question();

        question.setGame(game);
        question.setQuestionText(
                request.getQuestionText()
        );
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectOption(
                request.getCorrectOption()
        );
        question.setMarks(request.getMarks());

        return toResponse(
                questionRepository.save(question)
        );
    }

    public List<QuestionResponse> getQuestions(
            Long gameId) {

        gameService.getGameEntity(gameId);

        return questionRepository
                .findByGameGameId(gameId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Question getQuestionEntity(
            Long questionId) {

        return questionRepository.findById(questionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found"
                        ));
    }

    public AnswerResponse checkAnswer(
            AnswerRequest request) {

        Question question =
                getQuestionEntity(
                        request.getQuestionId()
                );

        boolean correct =
                question.getCorrectOption()
                        .equalsIgnoreCase(
                                request.getSelectedOption()
                        );

        int marks =
                correct
                        ? question.getMarks()
                        : 0;

        return new AnswerResponse(
                question.getQuestionId(),
                correct,
                marks
        );
    }

    @Transactional
    public QuestionResponse updateQuestion(
            Long questionId,
            QuestionRequest request) {

        Question question =
                getQuestionEntity(questionId);

        question.setQuestionText(
                request.getQuestionText()
        );
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectOption(
                request.getCorrectOption()
        );
        question.setMarks(request.getMarks());

        return toResponse(
                questionRepository.save(question)
        );
    }

    @Transactional
    public void deleteQuestion(Long questionId) {

        Question question =
                getQuestionEntity(questionId);

        questionRepository.delete(question);
    }

    private QuestionResponse toResponse(
            Question question) {

        return new QuestionResponse(
                question.getQuestionId(),
                question.getGame().getGameId(),
                question.getQuestionText(),
                question.getOptionA(),
                question.getOptionB(),
                question.getOptionC(),
                question.getOptionD(),
                question.getMarks()
        );
    }
}