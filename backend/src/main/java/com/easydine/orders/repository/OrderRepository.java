package com.easydine.orders.repository;

import org.springframework.data.jpa.repository.EntityGraph;

import com.easydine.orders.entity.Order;
import com.easydine.orders.entity.OrderStatus;
import com.easydine.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    @EntityGraph(attributePaths = {"orderItems", "user", "table", "orderItems.menuItem"})
    List<Order> findByReservationIdOrderByCreatedAtDesc(Long reservationId);
    @EntityGraph(attributePaths = {"orderItems", "user", "table", "orderItems.menuItem"})
    List<Order> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);

    @EntityGraph(attributePaths = {"orderItems", "user", "table", "orderItems.menuItem"})
    List<Order> findWithItemsByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED' AND o.createdAt >= :since")
    BigDecimal sumTotalAmountSince(@Param("since") LocalDateTime since);

    List<Order> findAllByCreatedAtAfter(LocalDateTime since);
}
