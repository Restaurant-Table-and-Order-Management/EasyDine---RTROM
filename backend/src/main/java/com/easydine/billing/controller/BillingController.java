package com.easydine.billing.controller;

import com.easydine.billing.dto.BillResponse;
import com.easydine.billing.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillService billService;

    @GetMapping("/reservation/{id}")
    public ResponseEntity<BillResponse> getBill(@PathVariable Long id) {
        return ResponseEntity.ok(billService.generateBill(id));
    }

    @PostMapping("/confirm/{reservationId}")
    public ResponseEntity<Void> confirmPayment(@PathVariable Long reservationId) {
        billService.confirmPayment(reservationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/report/revenue")
    public ResponseEntity<com.easydine.billing.dto.RevenueReportResponse> getRevenueReport() {
        return ResponseEntity.ok(billService.getRevenueReport());
    }

    @PostMapping("/email-receipt")
    public ResponseEntity<Void> sendEmail(@org.springframework.web.bind.annotation.RequestParam Long reservationId, @org.springframework.web.bind.annotation.RequestParam String email) {
        billService.simulateEmailReceipt(reservationId, email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/ledger")
    public ResponseEntity<List<com.easydine.billing.dto.BillResponse>> getLedger(@org.springframework.web.bind.annotation.RequestParam String date) {
        return ResponseEntity.ok(billService.getAllBillsByDate(date));
    }

    @PostMapping("/admin/refund/{id}")
    public ResponseEntity<Void> refund(@PathVariable Long id) {
        billService.processRefund(id);
        return ResponseEntity.ok().build();
    }
}
