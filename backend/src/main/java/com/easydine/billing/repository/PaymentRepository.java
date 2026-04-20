package com.easydine.billing.repository;

import com.easydine.billing.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBillId(Long billId);

    Optional<Payment> findByPaymentGatewayTxnId(String txnId);
}