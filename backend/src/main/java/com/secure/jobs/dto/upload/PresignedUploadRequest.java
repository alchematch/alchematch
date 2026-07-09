package com.secure.jobs.dto.upload;

import com.secure.jobs.models.upload.UploadPurpose;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PresignedUploadRequest(

        @NotNull(message = "purpose is required")
        UploadPurpose purpose,

        @NotBlank(message = "contentType is required")
        String contentType,

        @NotBlank(message = "fileExtension is required")
        String fileExtension
) {}