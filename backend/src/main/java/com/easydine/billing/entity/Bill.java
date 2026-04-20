package com.easydine.billing.entity;

import com.easydine.billing.enums.PaymentMethod;
import com.easydine.billing.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long billId;

    private Long reservationId;
    private Long tableId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal tipAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();
        if (this.paymentStatus == null) this.paymentStatus = PaymentStatus.PENDING;
        if (this.discountAmount == null) this.discountAmount = BigDecimal.ZERO;
        if (this.tipAmount == null) this.tipAmount = BigDecimal.ZERO;
    }
}