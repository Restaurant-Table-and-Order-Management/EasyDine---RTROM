package com.easydine.kitchen.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.easydine.common.exception.ResourceNotFoundException;
import com.easydine.common.service.NotificationService;
import com.easydine.kitchen.entity.KitchenOrder;
import com.easydine.kitchen.repository.KitchenOrderRepository;
import com.easydine.orders.dto.OrderItemResponse;
import com.easydine.orders.dto.OrderResponse;
import com.easydine.orders.entity.Order;
import com.easydine.orders.entity.OrderStatus;
import com.easydine.orders.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KitchenService {

    private final OrderRepository orderRepository;
    private final KitchenOrderRepository kitchenOrderRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<OrderResponse> getActiveOrders() {
        return kitchenOrderRepository.findByStatusInOrderByReceivedAtAsc(
                Arrays.asList(OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY)
        ).stream()
        .map(ko -> mapToResponse(ko.getOrder(), ko))
        .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getPastOrders() {
        return kitchenOrderRepository.findByStatusInOrderByReceivedAtDesc(
                Arrays.asList(OrderStatus.SERVED, OrderStatus.CANCELLED)
        ).stream()
        .map(ko -> mapToResponse(ko.getOrder(), ko))
        .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        KitchenOrder ko = kitchenOrderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Kitchen order not found for order id: " + orderId));
        
        ko.setStatus(newStatus);
        if (newStatus == OrderStatus.PREPARING && ko.getStartedAt() == null) {
            ko.setStartedAt(java.time.LocalDateTime.now());
        } else if (newStatus == OrderStatus.READY && ko.getCompletedAt() == null) {
            ko.setCompletedAt(java.time.LocalDateTime.now());
            // Send notification to customer
            notificationService.sendNotification(ko.getOrder().getUser(), "Your food is ready 🍽️ Order #" + ko.getOrder().getId());
        }
        kitchenOrderRepository.save(ko);

        // Sync with main order
        Order order = ko.getOrder();
        order.setStatus(newStatus);
        orderRepository.save(order);

        OrderResponse response = mapToResponse(order, ko);
        broadcastActiveOrders();
        return response;
    }

    public void broadcastActiveOrders() {
        List<OrderResponse> activeOrders = getActiveOrders();
        messagingTemplate.convertAndSend("/topic/kitchen/orders", activeOrders);
    }

    private OrderResponse mapToResponse(Order order, KitchenOrder kitchenOrder) {
        if (order == null) return null;
        
        List<OrderItemResponse> items = order.getOrderItems() != null ? order.getOrderItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .menuItemId(item.getMenuItem().getId())
                        .menuItemName(item.getMenuItem().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPriceAtTimeOfOrder())
                        .specialInstructions(item.getSpecialInstructions())
                        .build())
                .collect(Collectors.toList()) : java.util.Collections.emptyList();

        return OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getUser() != null ? order.getUser().getName() : "Guest")
                .reservationId(order.getReservation() != null ? order.getReservation().getId() : null)
                .tableId(order.getTable() != null ? order.getTable().getId() : null)
                .tableNumber(order.getTable() != null ? order.getTable().getTableNumber() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .orderNumber(order.getOrderNumber())
                .orderDate(order.getOrderDate())
                .createdAt(order.getCreatedAt())
                .estimatedMinutes(kitchenOrder != null ? kitchenOrder.getEstimatedMinutes() : order.getEstimatedMinutes())
                .items(items)
                .build();
    }
}
