package com.easydine.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillItem {
    private String name;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}
