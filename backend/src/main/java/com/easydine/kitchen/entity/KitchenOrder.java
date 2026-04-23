package com.easydine.kitchen.entity;

import com.easydine.orders.entity.Order;
import com.easydine.orders.entity.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "kitchen_orders")
public class KitchenOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime receivedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer estimatedMinutes;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (receivedAt == null) {
            receivedAt = createdAt;
        }
        if (status == null) {
            status = OrderStatus.PLACED;
        }
    }
}
