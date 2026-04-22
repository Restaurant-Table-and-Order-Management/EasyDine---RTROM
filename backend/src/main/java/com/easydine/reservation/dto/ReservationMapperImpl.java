package com.easydine.reservation.dto;

import com.easydine.reservation.entity.Reservation;
import com.easydine.reservation.model.ReservationStatus;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapperImpl implements ReservationMapper {

    @Override
    public ReservationDTO toDto(Reservation entity) {
        if (entity == null) return null;
        return ReservationDTO.builder()
                .id(entity.getId())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .userEmail(entity.getUser() != null ? entity.getUser().getEmail() : null)
                .userName(entity.getUser() != null ? entity.getUser().getName() : null)
                .tableId(entity.getTable() != null ? entity.getTable().getId() : null)
                .tableNumber(entity.getTable() != null ? entity.getTable().getTableNumber() : null)
                .tableLocation(entity.getTable() != null ? entity.getTable().getLocation() : null)
                .reservationDate(entity.getReservationDate())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .guestCount(entity.getGuestCount())
                .status(entity.getStatus())
                .specialRequests(entity.getSpecialRequests())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    @Override
    public Reservation toEntity(ReservationDTO dto) {
        if (dto == null) return null;
        return Reservation.builder()
                .id(dto.getId())
                .reservationDate(dto.getReservationDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .guestCount(dto.getGuestCount())
                .status(dto.getStatus())
                .specialRequests(dto.getSpecialRequests())
                .build();
    }
}
