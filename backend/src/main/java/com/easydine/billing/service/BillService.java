package com.easydine.billing.service;

import com.easydine.billing.dto.BillItem;
import com.easydine.billing.dto.BillResponse;
import com.easydine.billing.dto.RevenueReportResponse;
import com.easydine.common.exception.ResourceNotFoundException;
import com.easydine.orders.entity.Order;
import com.easydine.orders.entity.OrderItem;
import com.easydine.orders.repository.OrderRepository;
import com.easydine.reservation.entity.Reservation;
import com.easydine.reservation.repository.ReservationRepository;
import com.easydine.table.model.TableStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BillService {

    private final OrderRepository orderRepository;
    private final ReservationRepository reservationRepository;
    
    private static final BigDecimal TAX_RATE = new BigDecimal("0.05");
    private static final BigDecimal ONE_PLUS_TAX = BigDecimal.ONE.add(TAX_RATE);

    public BillResponse generateBill(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        List<Order> orders = orderRepository.findByReservationIdOrderByCreatedAtDesc(reservationId);
        
        // Aggregate items across all non-cancelled orders
        Map<String, BillItem> itemMap = new HashMap<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (Order order : orders) {
            if (order.getStatus().name().equals("CANCELLED")) continue;

            for (OrderItem orderItem : order.getOrderItems()) {
                String itemName = orderItem.getMenuItem().getName();
                BigDecimal unitPrice = orderItem.getPriceAtTimeOfOrder();
                int qty = orderItem.getQuantity();

                BillItem existing = itemMap.get(itemName);
                if (existing != null) {
                    existing.setQuantity(existing.getQuantity() + qty);
                    existing.setTotalPrice(unitPrice.multiply(BigDecimal.valueOf(existing.getQuantity())));
                } else {
                    itemMap.put(itemName, BillItem.builder()
                            .name(itemName)
                            .quantity(qty)
                            .unitPrice(unitPrice)
                            .totalPrice(unitPrice.multiply(BigDecimal.valueOf(qty)))
                            .build());
                }
                subtotal = subtotal.add(unitPrice.multiply(BigDecimal.valueOf(qty)));
            }
        }

        // Calculations (Tax: 5% GST)
        BigDecimal taxAmount = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        
        // Placeholder for discount (e.g., 0 for now unless loyalty exists)
        BigDecimal discountAmount = BigDecimal.ZERO;
        
        BigDecimal grandTotal = subtotal.add(taxAmount).subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);

        return BillResponse.builder()
                .reservationId(reservationId)
                .customerName(reservation.getUser().getName())
                .tableNumber(reservation.getTable().getTableNumber())
                .items(new ArrayList<>(itemMap.values()))
                .subtotal(subtotal)
                .taxAmount(taxAmount)
                .discountAmount(discountAmount)
                .grandTotal(grandTotal)
                .build();
    }

    public void confirmPayment(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        
        // Final bill calculation for persistence
        BillResponse finalBill = generateBill(reservationId);
        reservation.setTotalPaid(finalBill.getGrandTotal());
        reservation.setStatus(com.easydine.reservation.model.ReservationStatus.COMPLETED);
        
        if (reservation.getTable() != null) {
            reservation.getTable().setStatus(TableStatus.AVAILABLE);
        }
        
        reservationRepository.save(reservation);
    }

    public RevenueReportResponse getRevenueReport() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        
        // Sum of all non-cancelled orders today (subtotal)
        BigDecimal todaySubtotal = orderRepository.sumTotalAmountSince(startOfToday);
        if (todaySubtotal == null) todaySubtotal = BigDecimal.ZERO;
        
        // Count of orders today
        long orderCount = orderRepository.findAllByCreatedAtAfter(startOfToday).size();
        
        // Calculate tax (Simulated 5% GST flow)
        BigDecimal totalTax = todaySubtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        
        // Dynamic Revenue = Subtotal + Tax
        BigDecimal totalRevenue = todaySubtotal.add(totalTax).setScale(2, RoundingMode.HALF_UP);
        
        BigDecimal avgOrderValue = orderCount > 0 
            ? todaySubtotal.divide(BigDecimal.valueOf(orderCount), 2, RoundingMode.HALF_UP) 
            : BigDecimal.ZERO;

        return RevenueReportResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(orderCount)
                .averageOrderValue(avgOrderValue)
                .totalTax(totalTax)
                .build();
    }

    public void simulateEmailReceipt(Long reservationId, String email) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        
        System.out.println("=================================================");
        System.out.println("SIMULATING EMAIL RECEIPT SENDING");
        System.out.println("TO: " + email);
        System.out.println("RESERVATION: #" + reservationId);
        System.out.println("AMOUNT: ₹" + reservation.getTotalPaid());
        System.out.println("=================================================");
    }

    public List<BillResponse> getAllBillsByDate(String dateStr) {
        java.time.LocalDate date = java.time.LocalDate.parse(dateStr);
        return reservationRepository.findByReservationDateOrderByCreatedAtDesc(date).stream()
                .filter(r -> r.getTotalPaid() != null)
                .map(r -> BillResponse.builder()
                        .id(r.getId())
                        .reservationId(r.getId())
                        .customerName(r.getUser().getName())
                        .tableNumber(r.getTable().getTableNumber())
                        .grandTotal(r.getTotalPaid())
                        .discountAmount(BigDecimal.ZERO) 
                        .taxAmount(r.getTotalPaid().subtract(r.getTotalPaid().divide(ONE_PLUS_TAX, 2, java.math.RoundingMode.HALF_UP)))
                        .subtotal(r.getTotalPaid().divide(ONE_PLUS_TAX, 2, java.math.RoundingMode.HALF_UP))
                        // We'll reuse the discount field or add status to BillResponse if needed, 
                        // but for now the Admin UI will handle status from the Reservation
                        .build())
                .collect(Collectors.toList());
    }

    public void processRefund(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));
        
        if (reservation.getStatus() != com.easydine.reservation.model.ReservationStatus.COMPLETED) {
            throw new IllegalStateException("Only completed bills can be refunded");
        }
        
        reservation.setStatus(com.easydine.reservation.model.ReservationStatus.REFUNDED);
        reservationRepository.save(reservation);
    }
}
