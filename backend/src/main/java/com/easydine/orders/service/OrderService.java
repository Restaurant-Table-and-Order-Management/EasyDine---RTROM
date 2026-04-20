package com.easydine.orders.service;

import com.easydine.auth.entity.User;
import com.easydine.common.exception.ResourceNotFoundException;
import com.easydine.menu.entity.MenuItem;
import com.easydine.menu.repository.MenuItemRepository;
import com.easydine.reservation.entity.Reservation;
import com.easydine.reservation.repository.ReservationRepository;
import com.easydine.orders.dto.OrderItemRequest;
import com.easydine.orders.dto.OrderItemResponse;
import com.easydine.orders.dto.OrderRequest;
import com.easydine.orders.dto.OrderResponse;
import com.easydine.orders.entity.Order;
import com.easydine.orders.entity.OrderItem;
import com.easydine.orders.entity.OrderStatus;
import com.easydine.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final ReservationRepository reservationRepository;

    @Transactional
    public OrderResponse placeOrder(OrderRequest request, User user) {
        Reservation reservation = null;
        if (request.getReservationId() != null) {
            reservation = reservationRepository.findById(request.getReservationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + request.getReservationId()));
        }

        Order order = Order.builder()
                .user(user)
                .reservation(reservation)
                .table(reservation != null ? reservation.getTable() : null)
                .status(OrderStatus.PENDING)
                .orderItems(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + itemRequest.getMenuItemId()));

            if (!menuItem.isAvailable()) {
                throw new RuntimeException("Item " + menuItem.getName() + " is currently out of stock");
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(itemRequest.getQuantity())
                    .priceAtTimeOfOrder(menuItem.getPrice())
                    .specialInstructions(itemRequest.getSpecialInstructions())
                    .build();

            order.getOrderItems().add(orderItem);
            
            BigDecimal itemTotal = menuItem.getPrice().multiply(new BigDecimal(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);
        
        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByReservation(Long reservationId) {
        return orderRepository.findByReservationIdOrderByCreatedAtDesc(reservationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .menuItemId(item.getMenuItem().getId())
                        .menuItemName(item.getMenuItem().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPriceAtTimeOfOrder())
                        .specialInstructions(item.getSpecialInstructions())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getUser().getName())
                .reservationId(order.getReservation() != null ? order.getReservation().getId() : null)
                .tableId(order.getTable() != null ? order.getTable().getId() : null)
                .tableNumber(order.getTable() != null ? order.getTable().getTableNumber() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
