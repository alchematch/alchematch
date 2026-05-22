package com.secure.jobs.dto.job;

import com.secure.jobs.models.job.EmploymentType;
import com.secure.jobs.models.job.JobStatus;
import com.secure.jobs.models.job.PayPeriod;
import com.secure.jobs.models.job.PayType;

import java.math.BigDecimal;

public record SavedJobResponse(
        Long savedJobId,
        Long jobId,
        String title,
        String tagline,
        EmploymentType employmentType,
        String level,
        BigDecimal payMin,
        BigDecimal payMax,
        PayPeriod payPeriod,
        PayType payType,
        String location,
        JobStatus status,
        String companyName
) {
}
