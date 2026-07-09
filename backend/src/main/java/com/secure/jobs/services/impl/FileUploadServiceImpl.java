package com.secure.jobs.services.impl;

import com.secure.jobs.dto.upload.PresignedUploadRequest;
import com.secure.jobs.dto.upload.PresignedUploadResponse;
import com.secure.jobs.models.upload.UploadPurpose;
import com.secure.jobs.security.guards.FileUploadGuard;
import com.secure.jobs.security.services.UserDetailsImpl;
import com.secure.jobs.services.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    private final S3Presigner s3Presigner;
    private final FileUploadGuard fileUploadGuard;

    @Value("${app.r2.bucket-name}")
    private String bucketName;

    @Value("${app.r2.public-url}")
    private String publicUrl;

    @Value("${app.r2.presign-expiration-seconds:300}")
    private long expirationSeconds;

    @Override
    public PresignedUploadResponse createPresignedUpload(
            UserDetailsImpl userDetails,
            PresignedUploadRequest request
    ) {
        UploadPurpose purpose = request.purpose();

        fileUploadGuard.requirePurposeAllowedForUser(purpose, userDetails);
        fileUploadGuard.requireAllowedContentType(purpose, request.contentType());

        String objectKey = "%s/%d/%s.%s".formatted(
                purpose.getKeyPrefix(),
                userDetails.getId(),
                UUID.randomUUID(),
                sanitizeExtension(request.fileExtension())
        );

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(request.contentType())
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(expirationSeconds))
                .putObjectRequest(putObjectRequest)
                .build();

        var presigned = s3Presigner.presignPutObject(presignRequest);

        return new PresignedUploadResponse(
                presigned.url().toString(),
                publicUrl + "/" + objectKey,
                objectKey,
                expirationSeconds
        );
    }

    private String sanitizeExtension(String ext) {
        return ext.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }
}