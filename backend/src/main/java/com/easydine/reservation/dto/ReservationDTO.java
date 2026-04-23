package com.easydine.reservation.dto;

import com.easydine.reservation.model.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private Long tableId;
    private String tableNumber;
    private String tableLocation;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer guestCount;
    private ReservationStatus status;
    private String specialRequests;
    private java.math.BigDecimal totalPaid;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
