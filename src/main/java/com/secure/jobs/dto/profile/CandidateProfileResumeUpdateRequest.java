package com.secure.jobs.dto.profile;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CandidateProfileResumeUpdateRequest {

    @Size(max = 500, message = "resumeUrl must be 500 characters or fewer")
    private String resumeUrl;

    @Size(max = 500, message = "resumePublicId must be 500 characters or fewer")
    private String resumePublicId;
}
