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
    private boolean isAvailable;
    private boolean isSpecial;
    private boolean isVegetarian;
    private boolean isPopular;
}
