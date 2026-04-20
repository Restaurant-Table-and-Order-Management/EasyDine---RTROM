package com.easydine.billing.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BillItemDTO {
    private String itemName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
    private String customizationNotes;
}