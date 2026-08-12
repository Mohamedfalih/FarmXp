package com.farmxp.learning.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class AnswerRequest {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotBlank(message = "Selected option is required")
    @Pattern(
            regexp = "[ABCD]",
            message = "Selected option must be A, B, C or D"
    )
    private String selectedOption;

    public AnswerRequest() {
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }
}