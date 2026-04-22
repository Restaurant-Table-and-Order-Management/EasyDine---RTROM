package com.easydine.kitchen.service;

import com.easydine.common.exception.ResourceNotFoundException;
import com.easydine.orders.dto.OrderItemResponse;
import com.easydine.orders.dto.OrderResponse;
import com.easydine.orders.entity.Order;
import com.easydine.orders.entity.OrderStatus;
import com.easydine.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KitchenService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public List<OrderResponse> getActiveOrders() {
        return orderRepository.findByStatusInOrderByCreatedAtAsc(
                Arrays.asList(OrderStatus.PLACED, OrderStatus.IN_KITCHEN)
        ).stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
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
                .orderNumber(order.getOrderNumber())
                .orderDate(order.getOrderDate())
                .createdAt(order.getCreatedAt())
                .estimatedMinutes(order.getEstimatedMinutes())
                .items(items)
                .build();
    }
}
