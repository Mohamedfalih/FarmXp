package com.farmxp.learning.dto;

public class AnswerResponse {

    private Long questionId;
    private boolean correct;
    private Integer marksObtained;

    public AnswerResponse() {
    }

    public AnswerResponse(
            Long questionId,
            boolean correct,
            Integer marksObtained) {

        this.questionId = questionId;
        this.correct = correct;
        this.marksObtained = marksObtained;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public boolean isCorrect() {
        return correct;
    }

    public Integer getMarksObtained() {
        return marksObtained;
    }
}