package com.farmxp.learning.dto;

public class QuestionResponse {

    private Long questionId;
    private Long gameId;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private Integer marks;

    public QuestionResponse() {
    }

    public QuestionResponse(
            Long questionId,
            Long gameId,
            String questionText,
            String optionA,
            String optionB,
            String optionC,
            String optionD,
            Integer marks) {

        this.questionId = questionId;
        this.gameId = gameId;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.marks = marks;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public Long getGameId() {
        return gameId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getOptionA() {
        return optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public Integer getMarks() {
        return marks;
    }
}