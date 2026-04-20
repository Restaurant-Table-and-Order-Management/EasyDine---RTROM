package com.easydine.orders.repository;

import com.easydine.orders.entity.Order;
import com.easydine.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByReservationIdOrderByCreatedAtDesc(Long reservationId);
}
