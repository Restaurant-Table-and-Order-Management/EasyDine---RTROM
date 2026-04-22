package com.easydine.billing.service;

import com.easydine.billing.dto.*;
import com.easydine.billing.entity.*;
import com.easydine.billing.enums.*;
import com.easydine.billing.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BillingService {

    private final BillRepository billRepository;
    private final PaymentRepository paymentRepository;

    private static final BigDecimal GST_RATE = new BigDecimal("0.05");

    public BillResponseDTO generateBill(Long tableId, Long reservationId, List<BillItemDTO> items) {

        BigDecimal subtotal = items.stream()
                .map(BillItemDTO::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal taxAmount = subtotal.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal tipAmount = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(taxAmount).setScale(2, RoundingMode.HALF_UP);

        Bill bill = Bill.builder()
                .tableId(tableId)
                .reservationId(reservationId)
                .subtotal(subtotal)
                .taxAmount(taxAmount)
                .discountAmount(discountAmount)
                .tipAmount(tipAmount)
                .totalAmount(totalAmount)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        bill = billRepository.save(bill);
        log.info("Bill {} generated for table {}", bill.getBillId(), tableId);

        return toBillResponseDTO(bill, items);
    }

    public BillResponseDTO getBillById(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));
        return toBillResponseDTO(bill, new ArrayList<>());
    }

    public BillResponseDTO markPaidByCash(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));

        if (bill.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Bill already paid.");
        }

        Payment payment = Payment.builder()
                .billId(bill.getBillId())
                .amountPaid(bill.getTotalAmount())
                .status(TransactionStatus.SUCCESS)
                .gatewayResponse("{\"method\":\"CASH\"}")
                .paidAt(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        bill.setPaymentStatus(PaymentStatus.PAID);
        bill.setPaymentMethod(PaymentMethod.CASH);
        billRepository.save(bill);

        return toBillResponseDTO(bill, new ArrayList<>());
    }

    public Map<String, Object> initiatePayment(PaymentInitiateDTO dto) {
        Bill bill = billRepository.findById(dto.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (bill.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Bill already paid.");
        }

        Payment payment = Payment.builder()
                .billId(bill.getBillId())
                .amountPaid(bill.getTotalAmount())
                .status(TransactionStatus.FAILED)
                .gatewayResponse("{}")
                .build();
        payment = paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("paymentId", payment.getPaymentId());
        response.put("amount", bill.getTotalAmount());
        response.put("currency", "INR");
        response.put("gatewayUrl", "https://payment-gateway.example.com/pay?ref=" + payment.getPaymentId());

        if (dto.getPaymentMethod() == PaymentMethod.UPI) {
            response.put("upiQrCode", "upi://pay?pa=easydine@upi&am=" + bill.getTotalAmount());
        }

        return response;
    }

    public void handlePaymentWebhook(Map<String, Object> payload) {
        String txnId = (String) payload.get("transactionId");
        String statusStr = (String) payload.get("status");
        Long paymentId = Long.valueOf(payload.get("paymentId").toString());

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setPaymentGatewayTxnId(txnId);
        payment.setGatewayResponse(payload.toString());
        payment.setPaidAt(LocalDateTime.now());

        if ("SUCCESS".equalsIgnoreCase(statusStr)) {
            payment.setStatus(TransactionStatus.SUCCESS);
            Bill bill = billRepository.findById(payment.getBillId())
                    .orElseThrow(() -> new RuntimeException("Bill not found"));
            bill.setPaymentStatus(PaymentStatus.PAID);
            bill.setPaymentMethod(PaymentMethod.CARD);
            billRepository.save(bill);
        } else {
            payment.setStatus(TransactionStatus.FAILED);
        }

        paymentRepository.save(payment);
    }

    private BillResponseDTO toBillResponseDTO(Bill bill, List<BillItemDTO> items) {
        return BillResponseDTO.builder()
                .billId(bill.getBillId())
                .tableId(bill.getTableId())
                .reservationId(bill.getReservationId())
                .items(items)
                .subtotal(bill.getSubtotal())
                .taxAmount(bill.getTaxAmount())
                .discountAmount(bill.getDiscountAmount())
                .tipAmount(bill.getTipAmount())
                .totalAmount(bill.getTotalAmount())
                .paymentStatus(bill.getPaymentStatus().name())
                .paymentMethod(bill.getPaymentMethod() != null ? bill.getPaymentMethod().name() : null)
                .createdDate(bill.getCreatedDate())
                .build();
    }
}