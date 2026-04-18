package com.easydine.orders.model;

public enum OrderStatus {
    PENDING,
    COOKING,
    READY;

    public boolean canTransitionTo(OrderStatus nextStatus) {
        if (this == PENDING && nextStatus == COOKING) return true;
        if (this == COOKING && nextStatus == READY) return true;
        return false;
    }
}
