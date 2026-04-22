package com.easydine.orders.entity;

import com.easydine.auth.entity.User;
import com.easydine.reservation.entity.Reservation;
import com.easydine.table.entity.RestaurantTable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id")
    private RestaurantTable table;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 100, columnDefinition = "varchar(100)")
    private OrderStatus status;

    @Column(length = 100, unique = true)
    private String orderNumber;

    @Column
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 1000)
    private String cancellationReason;

    private Integer estimatedMinutes;

    @Column(length = 50)
    private String paymentMethod;

    @Column(length = 50)
    private String paymentStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        if (orderDate == null) {
            orderDate = now;
        }
        if (status == null) {
            status = OrderStatus.PLACED;
        }
    }
}
