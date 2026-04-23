package com.easydine.kitchen.repository;

import com.easydine.kitchen.entity.KitchenOrder;
import com.easydine.orders.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KitchenOrderRepository extends JpaRepository<KitchenOrder, Long> {
    List<KitchenOrder> findByStatusInOrderByReceivedAtAsc(List<OrderStatus> statuses);
    Optional<KitchenOrder> findByOrderId(Long orderId);
}
