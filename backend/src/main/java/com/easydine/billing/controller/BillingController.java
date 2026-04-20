package com.easydine.billing.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.easydine.billing.dto.*;
import com.easydine.billing.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/billing")
public class BillingController {
    // Skeleton only - implementation pending
    private final BillingService billingService;
    // POST /billing/bills/generate/{tableId}
    @PostMapping("/bills/generate/{tableId}")
    public ResponseEntity<BillResponseDTO> generateBill(
            @PathVariable Long tableId,
            @RequestParam Long reservationId,
            @RequestBody List<BillItemDTO> items) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(billingService.generateBill(tableId, reservationId, items));
    }

    // GET /billing/bills/{billId}
    @GetMapping("/bills/{billId}")
    public ResponseEntity<BillResponseDTO> getBill(@PathVariable Long billId) {
        return ResponseEntity.ok(billingService.getBillById(billId));
    }

    // POST /billing/payments/initiate
    @PostMapping("/payments/initiate")
    public ResponseEntity<Map<String, Object>> initiatePayment(
            @RequestBody @Valid PaymentInitiateDTO dto) {
        return ResponseEntity.ok(billingService.initiatePayment(dto));
    }

    // POST /billing/payments/webhook
    @PostMapping("/payments/webhook")
    public ResponseEntity<Void> paymentWebhook(@RequestBody Map<String, Object> payload) {
        billingService.handlePaymentWebhook(payload);
        return ResponseEntity.ok().build();
    }

    // PUT /billing/payments/cash/{billId}
    @PutMapping("/payments/cash/{billId}")
    public ResponseEntity<BillResponseDTO> markCashPayment(@PathVariable Long billId) {
        return ResponseEntity.ok(billingService.markPaidByCash(billId));
    }

    // GET /billing/bills/{billId}/receipt
    @GetMapping("/bills/{billId}/receipt")
    public ResponseEntity<String> downloadReceipt(@PathVariable Long billId) {
        return ResponseEntity.ok("Receipt for bill " + billId);
    }
}
