package com.secure.jobs.models.upload;

import com.secure.jobs.models.user.auth.AppRole;

import java.util.Set;

public enum UploadPurpose {

    RESUME("resumes", AppRole.ROLE_USER, Set.of("application/pdf")),
    PROFILE_PICTURE("profile-pictures", AppRole.ROLE_USER, Set.of("image/png", "image/jpeg", "image/webp")),
    COMPANY_LOGO("company-logos", AppRole.ROLE_COMPANY, Set.of("image/png", "image/jpeg", "image/webp")),
    COMPANY_APPLICATION_DOCUMENT("company-applications", AppRole.ROLE_USER, Set.of("application/pdf"));

    private final String keyPrefix;
    private final AppRole requiredRole;
    private final Set<String> allowedContentTypes;

    UploadPurpose(String keyPrefix, AppRole requiredRole, Set<String> allowedContentTypes) {
        this.keyPrefix = keyPrefix;
        this.requiredRole = requiredRole;
        this.allowedContentTypes = allowedContentTypes;
    }

    public String getKeyPrefix() { return keyPrefix; }
    public AppRole getRequiredRole() { return requiredRole; }
    public Set<String> getAllowedContentTypes() { return allowedContentTypes; }
}