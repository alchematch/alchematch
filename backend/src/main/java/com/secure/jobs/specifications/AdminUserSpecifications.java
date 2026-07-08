package com.secure.jobs.specifications;

import com.secure.jobs.models.user.auth.AppRole;
import com.secure.jobs.models.user.auth.User;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AdminUserSpecifications {

    public static Specification<User> keyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return cb.conjunction();

            String like = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("username")), like),
                    cb.like(cb.lower(root.get("email")), like)
            );
        };
    }

    public static Specification<User> hasRole(AppRole role) {
        return (root, query, cb) ->
                cb.equal(root.get("role").get("roleName"), role);
    }

    public static Specification<User> createdBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return cb.conjunction();

            var createdDate = root.<LocalDateTime>get("createdDate");

            if (from != null && to != null) {
                LocalDateTime start = from.atStartOfDay();
                LocalDateTime endExclusive = to.plusDays(1).atStartOfDay();
                return cb.and(
                        cb.greaterThanOrEqualTo(createdDate, start),
                        cb.lessThan(createdDate, endExclusive)
                );
            }

            if (from != null) {
                return cb.greaterThanOrEqualTo(createdDate, from.atStartOfDay());
            }

            return cb.lessThan(createdDate, to.plusDays(1).atStartOfDay());
        };
    }
}