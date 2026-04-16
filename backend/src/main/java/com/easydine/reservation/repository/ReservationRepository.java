package com.easydine.reservation.repository;

import com.easydine.reservation.entity.Reservation;
import com.easydine.reservation.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    
    List<Reservation> findByReservationDateAndStatus(LocalDate date, ReservationStatus status);
    
    @Query("SELECT r FROM Reservation r WHERE r.table.id = :tableId AND r.reservationDate = :date " +
           "AND r.status = 'CONFIRMED' " +
           "AND (r.startTime < :endTime AND r.endTime > :startTime)")
    List<Reservation> findOverlappingReservations(Long tableId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
