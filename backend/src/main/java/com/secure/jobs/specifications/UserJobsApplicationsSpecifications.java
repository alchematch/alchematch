package com.secure.jobs.specifications;


import com.secure.jobs.models.job.JobApplication;
import com.secure.jobs.models.job.JobApplicationStatus;
import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserJobsApplicationsSpecifications {

    public static Specification<JobApplication> belongsToUser(Long userId) {
        return (root, query, cb) ->
                cb.equal(root.get("user").get("userId"), userId);
    }

    public static Specification<JobApplication> createdBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return cb.conjunction();

            Path<LocalDateTime> createdAt = root.get("createdAt"); // LocalDateTime in your entity

            if (from != null && to != null) {
                LocalDateTime start = from.atStartOfDay();
                LocalDateTime endExclusive = to.plusDays(1).atStartOfDay();
                return cb.and(
                        cb.greaterThanOrEqualTo(createdAt, start),
                        cb.lessThan(createdAt, endExclusive)
                );
            }

            if (from != null) {
                return cb.greaterThanOrEqualTo(createdAt, from.atStartOfDay());
            }

            // to != null
            return cb.lessThan(createdAt, to.plusDays(1).atStartOfDay());
        };
    }


    public static Specification<JobApplication> hasApplicationStatus(JobApplicationStatus status) {
        return (root, query, cb) ->
                cb.equal(root.get("status"), status);
    }

    public static Specification<JobApplication> keyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return cb.conjunction();

            String like = "%" + keyword.toLowerCase() + "%";

            var companyJoin = root.join("company");
            var locationJoin = root.join("job");
            var titleJoin = root.join("job");

            return cb.or(
                    cb.like(cb.lower(companyJoin.get("name")), like),
                    cb.like(cb.lower(locationJoin.get("location")), like),
                    cb.like(cb.lower(titleJoin.get("title")), like)
            );
        };
    }
}
