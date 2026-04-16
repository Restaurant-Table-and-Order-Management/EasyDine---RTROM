package com.easydine.table.controller;

import com.easydine.common.response.ApiResponse;
import com.easydine.table.dto.TableDTO;
import com.easydine.table.model.TableStatus;
import com.easydine.table.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TableDTO>> createTable(@RequestBody TableDTO tableDTO) {
        return ResponseEntity.ok(ApiResponse.success("Table created", tableService.createTable(tableDTO)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TableDTO>>> listAllTables() {
        return ResponseEntity.ok(ApiResponse.success("Tables retrieved", tableService.getAllTables()));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<TableDTO>>> getAvailableTables(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time,
            @RequestParam Integer capacity) {
        return ResponseEntity.ok(ApiResponse.success("Available tables retrieved", 
                tableService.findAvailableTables(date, time, capacity)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TableDTO>> getTable(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Table retrieved", tableService.getTableById(id)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TableDTO>> updateTableStatus(
            @PathVariable Long id, 
            @RequestParam TableStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Table status updated", tableService.updateTableStatus(id, status)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TableDTO>> updateTable(@PathVariable Long id, @RequestBody TableDTO tableDTO) {
        return ResponseEntity.ok(ApiResponse.success("Table updated", tableService.updateTable(id, tableDTO)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok(ApiResponse.success("Table deleted"));
    }
}
