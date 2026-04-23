package com.easydine.common.service;

import com.easydine.auth.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationService {

    public void sendNotification(User user, String message) {
        log.info("Sending notification to user {}: {}", user.getEmail(), message);
        // Simulation of SMS/App Push
        System.out.println("--------------------------------------------------");
        System.out.println("NOTIFICATION SENT TO: " + user.getName() + " (" + user.getEmail() + ")");
        System.out.println("MESSAGE: " + message);
        System.out.println("--------------------------------------------------");
    }
}
