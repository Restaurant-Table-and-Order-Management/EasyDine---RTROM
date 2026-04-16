package com.easydine.table.dto;

import com.easydine.table.model.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableDTO {
    private Long id;
    private String tableNumber;
    private Integer capacity;
    private TableStatus status;
    private String location;
    private Integer floorNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
