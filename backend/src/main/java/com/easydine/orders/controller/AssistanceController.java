package com.easydine.orders.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

@RestController
@RequestMapping("/orders/assistance")
@RequiredArgsConstructor
public class AssistanceController {

    private final SimpMessagingTemplate messagingTemplate;

    // In-memory store for assistance requests (sufficient for demo purposes)
    private static final Queue<Map<String, Object>> pendingRequests = new ConcurrentLinkedQueue<>();

    @PostMapping
    public ResponseEntity<Map<String, Object>> requestAssistance(@RequestBody Map<String, Object> request) {
        Map<String, Object> assistanceRequest = new LinkedHashMap<>();
        assistanceRequest.put("id", UUID.randomUUID().toString());
        assistanceRequest.put("reservationId", request.get("reservationId"));
        assistanceRequest.put("tableNumber", request.get("tableNumber"));
        assistanceRequest.put("message", request.getOrDefault("message", "Guest needs assistance"));
        assistanceRequest.put("timestamp", LocalDateTime.now().toString());
        assistanceRequest.put("status", "PENDING");

        pendingRequests.add(assistanceRequest);

        // Broadcast to Admin/Staff via WebSocket
        messagingTemplate.convertAndSend("/topic/assistance", assistanceRequest);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Assistance request sent. Staff will be with you shortly."
        ));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests() {
        return ResponseEntity.ok(new ArrayList<>(pendingRequests));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<Map<String, Object>> resolveRequest(@PathVariable String id) {
        pendingRequests.removeIf(r -> id.equals(r.get("id")));
        return ResponseEntity.ok(Map.of("success", true, "message", "Request resolved"));
    }
}
