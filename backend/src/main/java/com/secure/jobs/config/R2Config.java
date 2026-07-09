package com.secure.jobs.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Configuration
public class R2Config {

    @Value("${app.r2.account-id}")
    private String accountId;

    @Value("${app.r2.access-key-id}")
    private String accessKeyId;

    @Value("${app.r2.secret-access-key}")
    private String secretAccessKey;

    @Bean
    public S3Presigner s3Presigner() {
        return S3Presigner.builder()
                // R2 ignores region, but the SDK needs a valid-looking one.
                // If "auto" throws at boot, swap for Region.US_EAST_1 — common R2 workaround.
                .region(Region.of("auto"))
                .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                ))
                .build();
    }
}