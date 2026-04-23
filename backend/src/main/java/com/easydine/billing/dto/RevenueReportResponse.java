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
public class RevenueReportResponse {
    private BigDecimal totalRevenue; // Sum of all orders (running total)
    private BigDecimal settledRevenue; // Actually paid
    private BigDecimal pendingRevenue; // Still to be paid
    private long totalOrders;
    private BigDecimal averageOrderValue;
    private BigDecimal totalTax;
    private BigDecimal totalTips;
}
