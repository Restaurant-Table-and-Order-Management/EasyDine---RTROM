package com.easydine.orders.controller;

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
}
