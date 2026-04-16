package com.easydine.table.repository;

import com.easydine.table.entity.RestaurantTable;
import com.easydine.table.model.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    Optional<RestaurantTable> findByTableNumber(String tableNumber);
    List<RestaurantTable> findByStatus(TableStatus status);
    List<RestaurantTable> findByCapacityGreaterThanEqual(Integer capacity);
}
