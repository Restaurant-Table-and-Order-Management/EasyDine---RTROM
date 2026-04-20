package com.easydine.reservation.controller;

import com.easydine.common.response.ApiResponse;
import com.easydine.reservation.dto.ReservationDTO;
import com.easydine.reservation.model.ReservationStatus;
import com.easydine.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ReservationDTO>> createReservation(@RequestBody ReservationDTO reservationDTO) {
        return ResponseEntity.ok(ApiResponse.success("Reservation request sent", 
                reservationService.createReservation(reservationDTO)));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<ReservationDTO>>> getMyReservations() {
        return ResponseEntity.ok(ApiResponse.success("Your reservations retrieved", 
                reservationService.getMyReservations()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ReservationDTO>>> getAllReservations(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) ReservationStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Reservations retrieved", 
                reservationService.getReservationsAdmin(date, status)));
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReservationDTO>> confirmReservation(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Reservation confirmed", 
                reservationService.confirmReservation(id)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ReservationDTO>> cancelReservation(@PathVariable Long id) {
        // Both ADMIN and OWNER (handled in service if needed) can cancel
        return ResponseEntity.ok(ApiResponse.success("Reservation cancelled", 
                reservationService.cancelReservation(id)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationDTO>> getReservation(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Reservation retrieved", 
                reservationService.getReservationById(id)));
    }
}
