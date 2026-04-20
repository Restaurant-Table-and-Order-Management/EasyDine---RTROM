package com.easydine.config;

import com.easydine.auth.entity.Role;
import com.easydine.auth.entity.User;
import com.easydine.auth.repository.UserRepository;
import com.easydine.menu.entity.MenuCategory;
import com.easydine.menu.entity.MenuItem;
import com.easydine.menu.repository.MenuItemRepository;
import com.easydine.table.entity.RestaurantTable;
import com.easydine.table.model.TableStatus;
import com.easydine.table.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedTables();
        seedMenuItems();
    }

    // ─────────────────────────────────────────────
    //  USERS
    // ─────────────────────────────────────────────
    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Users already seeded – skipping.");
            return;
        }

        List<User> users = List.of(
            User.builder()
                .name("Admin User")
                .email("1@gmail.com")
                .password(passwordEncoder.encode("123456"))
                .role(Role.ADMIN)
                .build(),
            User.builder()
                .name("Test Customer")
                .email("customer@gmail.com")
                .password(passwordEncoder.encode("123456"))
                .role(Role.CUSTOMER)
                .build()
        );

        userRepository.saveAll(users);
        log.info("✅ Seeded {} users.", users.size());
    }

    // ─────────────────────────────────────────────
    //  TABLES
    // ─────────────────────────────────────────────
    private void seedTables() {
        if (tableRepository.count() > 0) {
            log.info("Tables already seeded – skipping.");
            return;
        }

        List<RestaurantTable> tables = List.of(
            // Indoor – Ground Floor
            table("T1",  2, "Indoor – Window",  1, TableStatus.AVAILABLE),
            table("T2",  2, "Indoor – Window",  1, TableStatus.AVAILABLE),
            table("T3",  4, "Indoor – Central", 1, TableStatus.AVAILABLE),
            table("T4",  4, "Indoor – Central", 1, TableStatus.AVAILABLE),
            table("T5",  6, "Indoor – Corner",  1, TableStatus.AVAILABLE),
            table("T6",  6, "Indoor – Corner",  1, TableStatus.AVAILABLE),

            // Outdoor / Garden
            table("G1",  2, "Garden – Patio",   0, TableStatus.AVAILABLE),
            table("G2",  2, "Garden – Patio",   0, TableStatus.AVAILABLE),
            table("G3",  4, "Garden – Terrace", 0, TableStatus.AVAILABLE),
            table("G4",  4, "Garden – Terrace", 0, TableStatus.AVAILABLE),
            table("G5",  6, "Garden – Poolside",0, TableStatus.AVAILABLE),

            // Private Dining – Upper Floor
            table("P1",  8, "Private Room A",    2, TableStatus.AVAILABLE),
            table("P2", 10, "Private Room B",    2, TableStatus.AVAILABLE),
            table("P3", 12, "Banquet Hall",      2, TableStatus.AVAILABLE),

            // Bar Seating
            table("B1",  2, "Bar Counter",       1, TableStatus.AVAILABLE),
            table("B2",  2, "Bar Counter",       1, TableStatus.AVAILABLE),
            table("B3",  4, "Lounge Area",       1, TableStatus.AVAILABLE)
        );

        tableRepository.saveAll(tables);
        log.info("✅ Seeded {} restaurant tables.", tables.size());
    }

    private RestaurantTable table(String num, int cap, String loc, int floor, TableStatus status) {
        return RestaurantTable.builder()
                .tableNumber(num)
                .capacity(cap)
                .location(loc)
                .floorNumber(floor)
                .status(status)
                .build();
    }

    // ─────────────────────────────────────────────
    //  MENU ITEMS
    // ─────────────────────────────────────────────
    private void seedMenuItems() {
        if (menuItemRepository.count() > 0) {
            log.info("Menu items already seeded – skipping.");
            return;
        }

        List<MenuItem> items = List.of(

            // ── STARTERS ──────────────────────────────────────────────────
            menuItem("Tandoori Mushroom Tikka",
                "Smoky, marinated button mushrooms char-grilled in a clay oven, served with mint chutney.",
                6.99, "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=600&h=400&fit=crop",
                MenuCategory.STARTERS, true, false, true, true),

            menuItem("Crispy Calamari",
                "Golden-fried squid rings with a zesty lemon-aioli dip.",
                8.50, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop",
                MenuCategory.STARTERS, true, false, false, true),

            menuItem("Burrata & Heirloom Tomato",
                "Creamy Italian burrata on a bed of heirloom tomatoes, basil oil, and fleur de sel.",
                9.99, "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=600&h=400&fit=crop",
                MenuCategory.STARTERS, true, false, true, false),

            menuItem("Spiced Lamb Keema Samosas",
                "Crisp pastry pockets filled with spiced minced lamb, served with tamarind chutney.",
                7.50, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
                MenuCategory.STARTERS, true, false, false, false),

            menuItem("Garden Soup du Jour",
                "Chef's daily selection of seasonal garden vegetable soup, served with artisan bread.",
                5.99, "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
                MenuCategory.STARTERS, true, false, true, false),

            // ── MAINS ─────────────────────────────────────────────────────
            menuItem("Grilled Atlantic Salmon",
                "Pan-seared salmon fillet with lemon-butter caper sauce, seasonal greens, and baby potatoes.",
                22.99, "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&h=400&fit=crop",
                MenuCategory.MAINS, true, false, false, true),

            menuItem("Slow-Cooked Lamb Rogan Josh",
                "Classic Kashmiri braised lamb in a rich tomato-yoghurt gravy, served with saffron basmati rice.",
                21.50, "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop",
                MenuCategory.MAINS, true, false, false, true),

            menuItem("Truffle Mushroom Risotto",
                "Arborio rice slowly cooked with wild mushrooms, parmesan, white truffle oil, and fresh thyme.",
                18.99, "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop",
                MenuCategory.MAINS, true, false, true, true),

            menuItem("Classic Beef Tenderloin",
                "8 oz USDA Choice beef tenderloin, served with truffle mashed potatoes and red-wine jus.",
                34.99, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
                MenuCategory.MAINS, true, false, false, false),

            menuItem("Paneer Lababdar",
                "Cottage cheese cubes in a velvety, spiced onion-tomato gravy, served with garlic naan.",
                16.99, "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop",
                MenuCategory.MAINS, true, false, true, false),

            menuItem("Pasta al Tartufo",
                "Tagliatelle tossed in a black truffle cream sauce with sautéed button mushrooms and parmesan.",
                19.50, "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&h=400&fit=crop",
                MenuCategory.MAINS, true, false, true, false),

            menuItem("BBQ Baby Back Ribs",
                "Half-rack of slow-smoked pork ribs glazed with house BBQ sauce, served with coleslaw and fries.",
                26.99, "https://images.unsplash.com/photo-1544025162-d76538671a04?w=600&h=400&fit=crop",
                MenuCategory.MAINS, true, false, false, false),

            // ── DRINKS ────────────────────────────────────────────────────
            menuItem("Mango Passion Cooler",
                "Fresh Alphonso mango blended with passion fruit, lemon, and a hint of ginger. Non-alcoholic.",
                4.99, "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=400&fit=crop",
                MenuCategory.DRINKS, true, false, true, false),

            menuItem("Classic Old Fashioned",
                "Bourbon whiskey, Angostura bitters, sugar, and a twist of orange peel over a large ice cube.",
                11.99, "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop",
                MenuCategory.DRINKS, true, false, false, false),

            menuItem("Fresh-Pressed Green Juice",
                "Spinach, cucumber, green apple, ginger, and lemon – cold-pressed for maximum nutrients.",
                5.50, "https://images.unsplash.com/photo-1622597467836-f3e98561a76f?w=600&h=400&fit=crop",
                MenuCategory.DRINKS, true, false, true, false),

            menuItem("Artisan Cold Brew Coffee",
                "Single-origin beans, steeped 18 hours for a smooth, low-acid concentrate. Served over ice.",
                4.50, "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop",
                MenuCategory.DRINKS, true, false, true, true),

            menuItem("Sparkling Elderflower Lemonade",
                "House-made elderflower cordial topped with sparkling water and fresh mint.",
                3.99, "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=400&fit=crop",
                MenuCategory.DRINKS, true, false, true, false),

            // ── DESSERTS ──────────────────────────────────────────────────
            menuItem("Warm Chocolate Fondant",
                "Decadent dark-chocolate lava cake with a molten centre, served with Madagascan vanilla ice cream.",
                8.99, "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop",
                MenuCategory.DESSERTS, true, true, true, true),

            menuItem("Saffron Panna Cotta",
                "Silky Italian cream set with saffron, topped with rose-water berry compote.",
                7.50, "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop",
                MenuCategory.DESSERTS, true, false, true, false),

            menuItem("Gulab Jamun with Rabri",
                "Classic milk-solid dumplings soaked in rose-cardamom syrup, paired with chilled rabri.",
                6.99, "https://images.unsplash.com/photo-1601303516534-bf4b4a1b96e2?w=600&h=400&fit=crop",
                MenuCategory.DESSERTS, true, false, true, false),

            menuItem("New York Cheesecake",
                "Thick, baked cheesecake on a graham-cracker crust, with a wild-blueberry coulis.",
                8.50, "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop",
                MenuCategory.DESSERTS, true, false, true, false),

            menuItem("Seasonal Sorbet Trio",
                "Three scoops of rotating seasonal sorbets. Today: passion fruit, lychee, and blood orange.",
                5.99, "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop",
                MenuCategory.DESSERTS, true, false, true, false)
        );

        menuItemRepository.saveAll(items);
        log.info("✅ Seeded {} menu items.", items.size());
    }

    private MenuItem menuItem(String name, String description, double price, String imageUrl,
                               MenuCategory category, boolean available, boolean special,
                               boolean vegetarian, boolean popular) {
        return MenuItem.builder()
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .imageUrl(imageUrl)
                .category(category)
                .isAvailable(available)
                .isSpecial(special)
                .isVegetarian(vegetarian)
                .isPopular(popular)
                .build();
    }
}
