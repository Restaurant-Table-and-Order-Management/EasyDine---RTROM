package com.easydine.kitchen.controller;

import com.easydine.kitchen.service.KitchenService;
import com.easydine.orders.dto.OrderResponse;
import com.easydine.orders.entity.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kitchen")
@RequiredArgsConstructor
public class KitchenController {

    private final KitchenService kitchenService;

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getActiveOrders() {
        return ResponseEntity.ok(kitchenService.getActiveOrders());
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(kitchenService.updateOrderStatus(id, status));
    }
}
