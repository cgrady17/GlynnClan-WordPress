<?php

// Run all hooks and filters after theme is loaded
add_action('after_setup_theme', 'kleo_geodir_init', 999);
function kleo_geodir_init(){
// Add specific class in Geo Directory pages

    // Main wrapper open / close
    remove_action('geodir_wrapper_open', 'geodir_action_wrapper_open', 10);
    add_action('geodir_wrapper_open', 'kleo_geodir_action_wrapper_open', 9);
    remove_action('geodir_wrapper_close', 'geodir_action_wrapper_close', 10);
    add_action('geodir_wrapper_close', 'kleo_geodir_action_wrapper_close', 9);

    // Remove GeoDirectory home page breadcrumbs
    remove_action('geodir_home_before_main_content', 'geodir_breadcrumb', 20);
    remove_action('geodir_location_before_main_content', 'geodir_breadcrumb', 20);

    // Remove GeoDirectory listing page title and breadcrumbs
    remove_action('geodir_listings_before_main_content', 'geodir_breadcrumb', 20);
    remove_action('geodir_listings_page_title', 'geodir_action_listings_title', 10);

    // Remove GeoDirectory details page title and breadcrumbs
    remove_action('geodir_detail_before_main_content', 'geodir_breadcrumb', 20);
    remove_action('geodir_details_main_content', 'geodir_action_page_title', 20);

    // Remove GeoDirectory search page title and breadcrumbs
    remove_action('geodir_search_before_main_content', 'geodir_breadcrumb', 20);
    remove_action('geodir_search_page_title', 'geodir_action_search_page_title', 10);

    // Remove GeoDirectory author page title and breadcrumbs
    remove_action('geodir_author_before_main_content', 'geodir_breadcrumb', 20);
    remove_action('geodir_author_page_title', 'geodir_action_author_page_title', 10);

    // Menu items
    remove_filter('wp_nav_menu_items','geodir_location_menu_items', 110);
    remove_filter('wp_nav_menu_items','geodir_menu_items', 100);

}

// Add specific class in Geo Directory pages
add_action('wp', 'kleo_geodir_body_class_init', 999);
function kleo_geodir_body_class_init(){
    if(function_exists('geodir_is_geodir_page')){
        if(geodir_is_geodir_page() || is_page(get_option('geodir_location_page'))){
            add_filter('body_class', 'kleo_geodir_body_class');
            function kleo_geodir_body_class($classes){
                $classes[] = 'kleo-geodir';
                return $classes;
            }
        }
    }
}

// Main wrapper open
function kleo_geodir_action_wrapper_open(){
    kleo_switch_layout('no');
    get_template_part('page-parts/general-title-section');
    get_template_part('page-parts/general-before-wrap');
}

// Main wrapper close
function kleo_geodir_action_wrapper_close(){
    get_template_part('page-parts/general-after-wrap');
}

// Add GeoDirectory styling
add_action( 'wp_enqueue_scripts', 'kleo_geodir_css', 999 );
function kleo_geodir_css(){
    wp_register_style( 'kleo-geodir', trailingslashit( get_template_directory_uri() ) . 'lib/plugin-geodirectory/kleo-geodir.css', array(), KLEO_THEME_VERSION, 'all' );
    wp_enqueue_style( 'kleo-geodir' );
}