package com.easydine.orders.service;

import com.easydine.orders.dto.OrderStatusUpdateRequest;
import com.easydine.orders.entity.Order;
import com.easydine.orders.model.OrderStatus;
import com.easydine.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional
    public Order updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        if (currentStatus == null) {
            currentStatus = OrderStatus.PENDING;
        }

        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new RuntimeException("Invalid status transition");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
