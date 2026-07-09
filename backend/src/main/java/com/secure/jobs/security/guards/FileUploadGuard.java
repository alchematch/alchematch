package com.secure.jobs.security.guards;

import com.secure.jobs.exceptions.ApiException;
import com.secure.jobs.models.upload.UploadPurpose;
import com.secure.jobs.security.services.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class FileUploadGuard {

    public void requirePurposeAllowedForUser(UploadPurpose purpose, UserDetailsImpl userDetails) {
        boolean hasRole = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(purpose.getRequiredRole().name()));

        if (!hasRole) {
            throw new ApiException(
                    "Your role is not permitted to upload files for this purpose",
                    HttpStatus.FORBIDDEN
            );
        }
    }

    public void requireAllowedContentType(UploadPurpose purpose, String contentType) {
        if (!purpose.getAllowedContentTypes().contains(contentType)) {
            throw new ApiException(
                    "Invalid content type for " + purpose.name() + ". Allowed: " + purpose.getAllowedContentTypes(),
                    HttpStatus.BAD_REQUEST
            );
        }
    }
}