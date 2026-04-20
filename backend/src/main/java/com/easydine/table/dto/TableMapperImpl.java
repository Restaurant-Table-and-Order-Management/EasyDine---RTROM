package com.easydine.table.dto;

import com.easydine.table.entity.RestaurantTable;
import com.easydine.table.model.TableStatus;
import org.springframework.stereotype.Component;

@Component
public class TableMapperImpl implements TableMapper {

    @Override
    public TableDTO toDto(RestaurantTable entity) {
        if (entity == null) return null;
        return TableDTO.builder()
                .id(entity.getId())
                .tableNumber(entity.getTableNumber())
                .capacity(entity.getCapacity())
                .status(entity.getStatus())
                .location(entity.getLocation())
                .floorNumber(entity.getFloorNumber())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    @Override
    public RestaurantTable toEntity(TableDTO dto) {
        if (dto == null) return null;
        return RestaurantTable.builder()
                .id(dto.getId())
                .tableNumber(dto.getTableNumber())
                .capacity(dto.getCapacity())
                .status(dto.getStatus())
                .location(dto.getLocation())
                .floorNumber(dto.getFloorNumber())
                .build();
    }
}
