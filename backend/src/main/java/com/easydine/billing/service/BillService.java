package com.easydine.billing.service;

import com.easydine.billing.dto.BillItem;
import com.easydine.billing.dto.BillResponse;
import com.easydine.billing.dto.RevenueReportResponse;
import com.easydine.common.exception.ResourceNotFoundException;
import com.easydine.orders.entity.Order;
import com.easydine.orders.entity.OrderItem;
import com.easydine.orders.repository.OrderRepository;
import com.easydine.reservation.entity.Reservation;
import com.easydine.reservation.model.ReservationStatus;
import com.easydine.reservation.repository.ReservationRepository;
import com.easydine.table.model.TableStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final com.easydine.billing.repository.BillRepository billRepository;
    
    private static final BigDecimal TAX_RATE = new BigDecimal("0.05");
    private static final BigDecimal ONE_PLUS_TAX = BigDecimal.ONE.add(TAX_RATE);

    @Transactional(readOnly = true)
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

    @Transactional
    public void confirmPayment(Long reservationId, String paymentMethod) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        
        if (reservation.getStatus() == ReservationStatus.COMPLETED) {
            return; // Already completed, avoid duplicate processing
        }

        // Check if a bill already exists for this reservation to avoid unique constraint violations
        if (billRepository.findByReservationId(reservationId).isPresent()) {
            reservation.setStatus(ReservationStatus.COMPLETED);
            reservationRepository.save(reservation);
            return;
        }
        
        // Final bill calculation for persistence
        BillResponse finalBill = generateBill(reservationId);
        reservation.setTotalPaid(finalBill.getGrandTotal());
        reservation.setStatus(ReservationStatus.COMPLETED);
        
        if (reservation.getTable() != null) {
            reservation.getTable().setStatus(TableStatus.AVAILABLE);
        }
        
        reservationRepository.save(reservation);

        // Save permanent bill record
        com.easydine.billing.entity.Bill bill = com.easydine.billing.entity.Bill.builder()
                .billNumber("ED-BILL-" + System.currentTimeMillis())
                .reservation(reservation)
                .subtotal(finalBill.getSubtotal())
                .taxAmount(finalBill.getTaxAmount())
                .discountAmount(finalBill.getDiscountAmount())
                .grandTotal(finalBill.getGrandTotal())
                .paymentMethod(paymentMethod != null ? paymentMethod : "UNKNOWN")
                .build();
        
        billRepository.save(bill);
    }

    public RevenueReportResponse getRevenueReport() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDate today = LocalDate.now();
        
        // 1. Total Running Revenue (All non-cancelled orders today)
        BigDecimal todaySubtotal = orderRepository.sumTotalAmountSince(startOfToday);
        if (todaySubtotal == null) todaySubtotal = BigDecimal.ZERO;
        BigDecimal totalRevenue = todaySubtotal.multiply(ONE_PLUS_TAX).setScale(2, RoundingMode.HALF_UP);
        
        // 2. Settled Revenue (Actually paid via COMPLETED reservations + Direct Orders which are PAID by default)
        BigDecimal settledFromReservations = reservationRepository.findByReservationDateOrderByCreatedAtDesc(today).stream()
                .filter(r -> r.getStatus() == ReservationStatus.COMPLETED)
                .map(r -> r.getTotalPaid() != null ? r.getTotalPaid() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Direct orders are always paid in our current flow
        BigDecimal settledFromDirect = orderRepository.findAllByCreatedAtAfter(startOfToday).stream()
                .filter(o -> o.getReservation() == null && !o.getStatus().name().equals("CANCELLED"))
                .map(o -> o.getTotalAmount().multiply(ONE_PLUS_TAX))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal settledRevenue = settledFromReservations.add(settledFromDirect).setScale(2, RoundingMode.HALF_UP);
        BigDecimal pendingRevenue = totalRevenue.subtract(settledRevenue).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);

        long orderCount = orderRepository.findAllByCreatedAtAfter(startOfToday).size();
        BigDecimal totalTax = totalRevenue.subtract(todaySubtotal).setScale(2, RoundingMode.HALF_UP);
        
        BigDecimal avgOrderValue = orderCount > 0 
            ? todaySubtotal.divide(BigDecimal.valueOf(orderCount), 2, RoundingMode.HALF_UP) 
            : BigDecimal.ZERO;

        return RevenueReportResponse.builder()
                .totalRevenue(totalRevenue)
                .settledRevenue(settledRevenue)
                .pendingRevenue(pendingRevenue)
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
        java.time.LocalDateTime startOfDay = date.atStartOfDay();
        java.time.LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        // 1. Get bills from reservations
        List<BillResponse> bills = reservationRepository.findByReservationDateOrderByCreatedAtDesc(date).stream()
                .filter(r -> r.getTotalPaid() != null || !orderRepository.findByReservationIdOrderByCreatedAtDesc(r.getId()).isEmpty())
                .map(r -> {
                    BigDecimal amount = r.getTotalPaid();
                    if (amount == null) {
                        try {
                            amount = generateBill(r.getId()).getGrandTotal();
                        } catch (Exception e) {
                            amount = BigDecimal.ZERO;
                        }
                    }
                    return BillResponse.builder()
                            .id(r.getId())
                            .reservationId(r.getId())
                            .customerName(r.getUser().getName())
                            .tableNumber(r.getTable().getTableNumber())
                            .grandTotal(amount)
                            .discountAmount(BigDecimal.ZERO) 
                            .taxAmount(amount.subtract(amount.divide(ONE_PLUS_TAX, 2, RoundingMode.HALF_UP)))
                            .subtotal(amount.divide(ONE_PLUS_TAX, 2, RoundingMode.HALF_UP))
                            .build();
                })
                .collect(Collectors.toCollection(ArrayList::new));

        // 2. Add direct orders (no reservation) for that date
        List<Order> directOrders = orderRepository.findAllByCreatedAtAfter(startOfDay).stream()
                .filter(o -> o.getCreatedAt().isBefore(endOfDay))
                .filter(o -> o.getReservation() == null)
                .collect(Collectors.toList());

        for (Order o : directOrders) {
            BigDecimal subtotal = o.getTotalAmount();
            BigDecimal tax = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
            BigDecimal total = subtotal.add(tax);
            
            bills.add(BillResponse.builder()
                    .id(o.getId() + 1000000L) // Virtual ID
                    .reservationId(null)
                    .customerName(o.getUser().getName() + " (Walk-in)")
                    .tableNumber(o.getTable() != null ? o.getTable().getTableNumber() : "N/A")
                    .grandTotal(total)
                    .subtotal(subtotal)
                    .taxAmount(tax)
                    .discountAmount(BigDecimal.ZERO)
                    .build());
        }
        
        return bills;
    }

    public void processRefund(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));
        
        if (reservation.getStatus() != ReservationStatus.COMPLETED) {
            throw new IllegalStateException("Only completed bills can be refunded");
        }
        
        reservation.setStatus(ReservationStatus.REFUNDED);
        reservationRepository.save(reservation);
    }
}
