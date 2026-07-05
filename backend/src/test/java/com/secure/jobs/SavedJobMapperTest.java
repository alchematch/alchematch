package com.secure.jobs;

import com.secure.jobs.dto.job.SavedJobResponse;
import com.secure.jobs.mappers.SavedJobMapper;
import com.secure.jobs.models.company.Company;
import com.secure.jobs.models.job.Job;
import com.secure.jobs.models.job.SavedJob;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit test for SavedJobMapper.toResponse().
 *
 * Verifies that savedJobId maps to the saved-job row ID and jobId maps to the
 * actual job ID — not the same value — which was the Phase 0.1 bug.
 */
class SavedJobMapperTest {

    @Test
    void toResponse_savedJobId_isRowId_notJobId() {
        Company company = mock(Company.class);
        when(company.getName()).thenReturn("Acme");

        Job job = mock(Job.class);
        when(job.getId()).thenReturn(42L);
        when(job.getCompany()).thenReturn(company);

        SavedJob savedJob = mock(SavedJob.class);
        when(savedJob.getId()).thenReturn(99L);
        when(savedJob.getJob()).thenReturn(job);

        SavedJobResponse response = SavedJobMapper.toResponse(savedJob);

        assertEquals(99L, response.savedJobId(), "savedJobId must be the saved-job row ID");
        assertEquals(42L, response.jobId(),     "jobId must be the job's own ID");
        assertNotEquals(response.savedJobId(), response.jobId(),
                "savedJobId and jobId must not be the same value");
    }
}
