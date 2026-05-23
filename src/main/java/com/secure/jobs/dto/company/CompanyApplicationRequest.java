package com.secure.jobs.dto.company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CompanyApplicationRequest(

        @NotBlank(message = "companyName is required")
        @Size(max = 150, message = "companyName must be 150 characters or fewer")
        String companyName,

        @NotBlank(message = "documentPublicId is required")
        @Size(max = 500, message = "documentPublicId must be 500 characters or fewer")
        String documentPublicId,

        @NotBlank(message = "documentUrl is required")
        @Size(max = 500, message = "documentUrl must be 500 characters or fewer")
        String documentUrl
) {}