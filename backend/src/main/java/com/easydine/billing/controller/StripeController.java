package com.easydine.billing.controller;

import com.easydine.billing.service.BillService;
import com.easydine.billing.service.StripeService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/billing/stripe")
@RequiredArgsConstructor
public class StripeController {

    private final StripeService stripeService;
    private final BillService billService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, Object>> createCheckoutSession(@RequestBody Map<String, Object> request) {
        try {
            Long reservationId = 0L;
            if (request.get("reservationId") != null) {
                try {
                    reservationId = Long.valueOf(request.get("reservationId").toString());
                } catch (NumberFormatException ignored) {}
            }
            // Amount comes in as rupees (e.g. 525.00), Stripe expects paise (smallest currency unit)
            double amount = Double.parseDouble(request.get("amount").toString());
            long amountInPaise = Math.round(amount * 100);

            String successUrl = (String) request.get("successUrl");
            String cancelUrl = (String) request.get("cancelUrl");

            String checkoutUrl = stripeService.createCheckoutSession(reservationId, amountInPaise, successUrl, cancelUrl);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "url", checkoutUrl
            ));
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Stripe error: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to create checkout session: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestParam String sessionId,
            @RequestParam Long reservationId) {
        try {
            boolean isValid = stripeService.verifySession(sessionId);

            if (isValid) {
                // Confirm the payment in our system
                billService.confirmPayment(reservationId, "STRIPE");
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Payment verified and session completed"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "success", false,
                        "message", "Payment not yet completed on Stripe"
                ));
            }
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Stripe verification error: " + e.getMessage()
            ));
        }
    }
}
