package com.easydine.billing.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    /**
     * Creates a Stripe Checkout Session for the given reservation and amount.
     * Returns the checkout URL that the frontend should redirect to.
     */
    public String createCheckoutSession(Long reservationId, Long amountInPaise, String successUrl, String cancelUrl) throws StripeException {
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("inr")
                                                .setUnitAmount(amountInPaise)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(reservationId > 0 ? "EasyDine - Dining Session #" + reservationId : "EasyDine - Online Order")
                                                                .setDescription("Payment for your order at EasyDine")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("reservationId", reservationId.toString())
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    /**
     * Verifies a Stripe Checkout Session by its ID.
     * Returns true if the payment was successful.
     */
    public boolean verifySession(String sessionId) throws StripeException {
        Session session = Session.retrieve(sessionId);
        return "complete".equals(session.getStatus()) && "paid".equals(session.getPaymentStatus());
    }
}
