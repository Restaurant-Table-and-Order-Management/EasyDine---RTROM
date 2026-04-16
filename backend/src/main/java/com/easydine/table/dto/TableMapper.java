package com.easydine.table.dto;

import com.easydine.table.entity.RestaurantTable;

public interface TableMapper {
    TableDTO toDto(RestaurantTable entity);
    RestaurantTable toEntity(TableDTO dto);
}
