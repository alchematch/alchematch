package com.secure.jobs.controllers.shared;

import com.secure.jobs.dto.upload.PresignedUploadRequest;
import com.secure.jobs.dto.upload.PresignedUploadResponse;
import com.secure.jobs.security.services.UserDetailsImpl;
import com.secure.jobs.services.FileUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/presign")
    @PreAuthorize("isAuthenticated()")
    public PresignedUploadResponse presign(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody @Valid PresignedUploadRequest request
    ) {
        return fileUploadService.createPresignedUpload(userDetails, request);
    }
}