package com.secure.jobs.dto.upload;

public record PresignedUploadResponse(
        String uploadUrl,
        String publicUrl,
        String objectKey,
        long expiresInSeconds
) {}