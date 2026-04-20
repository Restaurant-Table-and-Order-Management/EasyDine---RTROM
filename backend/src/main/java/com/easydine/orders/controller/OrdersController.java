package com.easydine.orders.controller;

<<<<<<< HEAD
import com.easydine.auth.entity.User;
import com.easydine.orders.dto.OrderRequest;
import com.easydine.orders.dto.OrderResponse;
import com.easydine.orders.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal User user) {
        return new ResponseEntity<>(orderService.placeOrder(request, user), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getMyOrders(user));
    }

    @GetMapping("/reservation/{id}")
    public ResponseEntity<List<OrderResponse>> getByReservation(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrdersByReservation(id));
    }
=======
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {
    // Skeleton only - implementation pending
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
}
