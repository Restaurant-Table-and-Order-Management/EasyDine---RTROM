package com.easydine.table.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.easydine.reservation.repository.ReservationRepository;
import com.easydine.orders.repository.OrderRepository;
import com.easydine.table.dto.TableDTO;
import com.easydine.table.dto.TableMapper;
import com.easydine.table.entity.RestaurantTable;
import com.easydine.table.model.TableStatus;
import com.easydine.table.repository.RestaurantTableRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TableService {

    private final RestaurantTableRepository tableRepository;
    private final ReservationRepository reservationRepository;
    private final OrderRepository orderRepository;
    private final TableMapper tableMapper;

    public List<TableDTO> getAllTables() {
        boolean isStaffOrAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF"));

        if (isStaffOrAdmin) {
            return tableRepository.findAll().stream()
                    .map(tableMapper::toDto)
                    .collect(Collectors.toList());
        } else {
            return tableRepository.findByStatus(TableStatus.AVAILABLE).stream()
                    .map(tableMapper::toDto)
                    .collect(Collectors.toList());
        }
    }

    public List<TableDTO> findAvailableTables(LocalDate date, LocalTime time, Integer capacity) {
        List<RestaurantTable> tables = tableRepository.findByCapacityGreaterThanEqual(capacity);
        
        LocalTime endTime = time.plusHours(2);

        return tables.stream()
                .filter(table -> isTableAvailable(table.getId(), date, time, endTime))
                .map(tableMapper::toDto)
                .collect(Collectors.toList());
    }

    private boolean isTableAvailable(Long tableId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        return reservationRepository.findOverlappingReservations(tableId, date, startTime, endTime).isEmpty();
    }

    @Transactional
    public TableDTO createTable(TableDTO tableDTO) {
        if (tableRepository.findByTableNumber(tableDTO.getTableNumber()).isPresent()) {
            throw new RuntimeException("Table number already exists");
        }
        RestaurantTable table = tableMapper.toEntity(tableDTO);
        table.setStatus(TableStatus.AVAILABLE);
        RestaurantTable savedTable = tableRepository.save(table);
        return tableMapper.toDto(savedTable);
    }

    @Transactional
    public TableDTO updateTableStatus(Long id, TableStatus newStatus) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        validateStatusTransition(table.getStatus(), newStatus);
        
        table.setStatus(newStatus);
        return tableMapper.toDto(tableRepository.save(table));
    }

    private void validateStatusTransition(TableStatus currentStatus, TableStatus newStatus) {
        if (newStatus == TableStatus.MAINTENANCE) return;
        if (currentStatus == TableStatus.MAINTENANCE && newStatus == TableStatus.AVAILABLE) return;

        boolean valid = switch (currentStatus) {
            case AVAILABLE -> newStatus == TableStatus.RESERVED || newStatus == TableStatus.OCCUPIED;
            case RESERVED -> newStatus == TableStatus.OCCUPIED || newStatus == TableStatus.AVAILABLE;
            case OCCUPIED -> newStatus == TableStatus.AVAILABLE || newStatus == TableStatus.MAINTENANCE;
            default -> false;
        };

        if (!valid) {
            throw new RuntimeException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
    }

    public TableDTO getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        return tableMapper.toDto(table);
    }

    @Transactional
    public TableDTO updateTable(Long id, TableDTO tableDTO) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setCapacity(tableDTO.getCapacity());
        table.setLocation(tableDTO.getLocation());
        table.setFloorNumber(tableDTO.getFloorNumber());
        
        return tableMapper.toDto(tableRepository.save(table));
    }

    @Transactional
    public void deleteTable(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        // Check for dependencies
        if (reservationRepository.existsByTableId(id)) {
            throw new RuntimeException("Cannot delete table: It has associated reservations. Try setting it to MAINTENANCE instead.");
        }
        
        if (orderRepository.existsByTableId(id)) {
            throw new RuntimeException("Cannot delete table: It has associated orders.");
        }

        tableRepository.delete(table);
    }
}
