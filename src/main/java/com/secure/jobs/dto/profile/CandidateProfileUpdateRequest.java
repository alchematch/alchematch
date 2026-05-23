package com.secure.jobs.dto.profile;

import com.secure.jobs.models.user.profile.EducationLevel;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

// All fields are optional: null means "do not change this field".
// @Size / @PositiveOrZero still reject out-of-range values when a field IS provided.
@Data
public class CandidateProfileUpdateRequest {

    private EducationLevel educationLevel;

    private Long degreeFieldId;

    @PositiveOrZero(message = "yearsExperience must be 0 or greater")
    private BigDecimal yearsExperience;

    @Size(max = 30, message = "phone must be 30 characters or fewer")
    private String phone;

    @Size(max = 120, message = "location must be 120 characters or fewer")
    private String location;
}
