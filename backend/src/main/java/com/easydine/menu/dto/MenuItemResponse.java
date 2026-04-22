package com.easydine.menu.dto;

import com.easydine.menu.entity.MenuCategory;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class MenuItemResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
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
