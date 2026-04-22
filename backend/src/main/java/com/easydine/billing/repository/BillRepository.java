package com.easydine.billing.repository;

import com.easydine.billing.entity.Bill;
import com.easydine.billing.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    Optional<Bill> findByTableIdAndPaymentStatus(Long tableId, PaymentStatus status);

    List<Bill> findAllByCreatedDateBetween(LocalDateTime from, LocalDateTime to);
}