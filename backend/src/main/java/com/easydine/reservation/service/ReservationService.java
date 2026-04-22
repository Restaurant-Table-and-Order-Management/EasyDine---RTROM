package com.easydine.reservation.service;

import com.easydine.auth.entity.User;
import com.easydine.auth.repository.UserRepository;
import com.easydine.reservation.dto.ReservationDTO;
import com.easydine.reservation.dto.ReservationMapper;
import com.easydine.reservation.entity.Reservation;
import com.easydine.reservation.model.ReservationStatus;
import com.easydine.reservation.repository.ReservationRepository;
import com.easydine.table.entity.RestaurantTable;
import com.easydine.table.model.TableStatus;
import com.easydine.table.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository tableRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;

    @Transactional
    public ReservationDTO createReservation(ReservationDTO reservationDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RestaurantTable table = tableRepository.findById(reservationDTO.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        // Validate capacity
        if (table.getCapacity() < reservationDTO.getGuestCount()) {
            throw new RuntimeException("Table capacity (" + table.getCapacity() + ") is insufficient for " + reservationDTO.getGuestCount() + " guests");
        }

        // Check for overlaps (Only CONFIRMED reservations block others)
        boolean hasOverlap = !reservationRepository.findOverlappingReservations(
                table.getId(), 
                reservationDTO.getReservationDate(), 
                reservationDTO.getStartTime(), 
                reservationDTO.getEndTime()
        ).isEmpty();

        if (hasOverlap) {
            throw new RuntimeException("Table is already reserved for the selected time slot");
        }

        Reservation reservation = reservationMapper.toEntity(reservationDTO);
        reservation.setUser(user);
        reservation.setTable(table);
        reservation.setStatus(ReservationStatus.PENDING);

        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    public List<ReservationDTO> getMyReservations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reservationRepository.findByUserId(user.getId()).stream()
                .map(reservationMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> getReservationsAdmin(LocalDate date, ReservationStatus status) {
        if (date != null && status != null) {
            return reservationRepository.findByReservationDateAndStatus(date, status).stream()
                    .map(reservationMapper::toDto)
                    .collect(Collectors.toList());
        }
        return reservationRepository.findAll().stream()
                .map(reservationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationDTO confirmReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(ReservationStatus.CONFIRMED);
        
        // Update table status to RESERVED
        RestaurantTable table = reservation.getTable();
        table.setStatus(TableStatus.RESERVED);
        tableRepository.save(table);

        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationDTO checkInGuest(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new RuntimeException("Only CONFIRMED reservations can be checked in");
        }

        // Table becomes OCCUPIED
        RestaurantTable table = reservation.getTable();
        if (table != null) {
            table.setStatus(TableStatus.OCCUPIED);
            tableRepository.save(table);
        }

        return reservationMapper.toDto(reservation);
    }

    @Transactional
    public ReservationDTO cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(ReservationStatus.CANCELLED);

        // Release the table
        RestaurantTable table = reservation.getTable();
        table.setStatus(TableStatus.AVAILABLE);
        tableRepository.save(table);

        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    public ReservationDTO getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return reservationMapper.toDto(reservation);
    }
}
