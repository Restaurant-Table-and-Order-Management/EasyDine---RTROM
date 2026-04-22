package com.easydine.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;

@Slf4j
@Component
@Order(1) // Run before DataInitializer
@RequiredArgsConstructor
public class SchemaMigrationFix implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("🚀 Starting manual schema migration fix for column lengths...");

        try {
            // Fix status in reservations
            jdbcTemplate.execute("ALTER TABLE reservations MODIFY COLUMN status VARCHAR(100)");
            log.info("✅ Fixed reservations.status length");
            
            // Fix status in orders
            jdbcTemplate.execute("ALTER TABLE orders MODIFY COLUMN status VARCHAR(100)");
            log.info("✅ Fixed orders.status length");
            
            // Fix status in restaurant_tables
            jdbcTemplate.execute("ALTER TABLE restaurant_tables MODIFY COLUMN status VARCHAR(100)");
            log.info("✅ Fixed restaurant_tables.status length");
            
            // Fix role in _user
            jdbcTemplate.execute("ALTER TABLE _user MODIFY COLUMN role VARCHAR(100)");
            log.info("✅ Fixed _user.role length");
            
            // Fix category in menu_items
            jdbcTemplate.execute("ALTER TABLE menu_items MODIFY COLUMN category VARCHAR(100)");
            log.info("✅ Fixed menu_items.category length");

            log.info("✔️ Schema migration fix completed successfully!");
        } catch (Exception e) {
            log.error("⚠️ Manual schema migration failed: {}. This might be because columns are already updated or database permissions.", e.getMessage());
        }
    }
}
