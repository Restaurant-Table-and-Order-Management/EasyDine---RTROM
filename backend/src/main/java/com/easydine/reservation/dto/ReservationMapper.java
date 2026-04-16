package com.easydine.reservation.dto;

import com.easydine.reservation.entity.Reservation;

public interface ReservationMapper {
    ReservationDTO toDto(Reservation entity);
    Reservation toEntity(ReservationDTO dto);
}
