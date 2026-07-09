package com.secure.jobs.services;

import com.secure.jobs.dto.upload.PresignedUploadRequest;
import com.secure.jobs.dto.upload.PresignedUploadResponse;
import com.secure.jobs.security.services.UserDetailsImpl;

public interface FileUploadService {
    PresignedUploadResponse createPresignedUpload(UserDetailsImpl userDetails, PresignedUploadRequest request);
}