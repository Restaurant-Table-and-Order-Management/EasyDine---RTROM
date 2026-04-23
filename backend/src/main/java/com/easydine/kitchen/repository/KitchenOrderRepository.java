package com.easydine.kitchen.repository;

import com.easydine.kitchen.entity.KitchenOrder;
import com.easydine.orders.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KitchenOrderRepository extends JpaRepository<KitchenOrder, Long> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"order", "order.orderItems", "order.user"})
    List<KitchenOrder> findByStatusInOrderByReceivedAtAsc(List<OrderStatus> statuses);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"order", "order.orderItems", "order.user"})
    List<KitchenOrder> findByStatusInOrderByReceivedAtDesc(List<OrderStatus> statuses);
    
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"order", "order.orderItems", "order.user"})
    Optional<KitchenOrder> findByOrderId(Long orderId);
}
