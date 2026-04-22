package com.easydine.menu.dto;

import com.easydine.menu.entity.MenuCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class MenuItemRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be positive")
    private BigDecimal price;

    private String imageUrl;

    @NotNull(message = "Category is required")
    private MenuCategory category;

    @com.fasterxml.jackson.annotation.JsonProperty("available")
    private boolean isAvailable;

    @com.fasterxml.jackson.annotation.JsonProperty("special")
    private boolean isSpecial;

    @com.fasterxml.jackson.annotation.JsonProperty("vegetarian")
    private boolean isVegetarian;

    @com.fasterxml.jackson.annotation.JsonProperty("popular")
    private boolean isPopular;
}
