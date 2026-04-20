package com.easydine.menu.service;

import com.easydine.common.exception.ResourceNotFoundException;
import com.easydine.menu.dto.MenuItemRequest;
import com.easydine.menu.dto.MenuItemResponse;
import com.easydine.menu.entity.MenuItem;
import com.easydine.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return mapToResponse(menuItem);
    }

    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        MenuItem menuItem = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .isAvailable(request.isAvailable())
                .isSpecial(request.isSpecial())
                .isVegetarian(request.isVegetarian())
                .isPopular(request.isPopular())
                .build();

        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return mapToResponse(savedMenuItem);
    }

    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setImageUrl(request.getImageUrl());
        menuItem.setCategory(request.getCategory());
        menuItem.setAvailable(request.isAvailable());
        menuItem.setSpecial(request.isSpecial());
        menuItem.setVegetarian(request.isVegetarian());
        menuItem.setPopular(request.isPopular());

        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);
        return mapToResponse(updatedMenuItem);
    }

    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    private MenuItemResponse mapToResponse(MenuItem menuItem) {
        return MenuItemResponse.builder()
                .id(menuItem.getId())
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .imageUrl(menuItem.getImageUrl())
                .category(menuItem.getCategory())
                .isAvailable(menuItem.isAvailable())
                .isSpecial(menuItem.isSpecial())
                .isVegetarian(menuItem.isVegetarian())
                .isPopular(menuItem.isPopular())
                .build();
    }
}
