package com.easydine.billing.dto;

import com.easydine.billing.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentInitiateDTO {

    @NotNull
    private Long billId;

    @NotNull
    private PaymentMethod paymentMethod;

    private BigDecimal tipAmount;
}