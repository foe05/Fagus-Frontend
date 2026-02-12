<?php
/**
 * Plugin Name: Fagus Menu REST API
 * Description: Exposes WordPress menus via a public REST endpoint for the Next.js frontend.
 * Version: 1.0.0
 */

// Auto-set permalink structure to /%postname%/ on first install
// Ensures REST API pretty URLs and correct slug routing from the start
add_action('init', function () {
    if (get_option('fagus_permalinks_set')) {
        return;
    }
    global $wp_rewrite;
    $wp_rewrite->set_permalink_structure('/%postname%/');
    $wp_rewrite->flush_rules();
    update_option('fagus_permalinks_set', true);
}, 99);

// Register menu locations
add_action('after_setup_theme', function () {
    register_nav_menus([
        'header-menu' => 'Hauptnavigation (Header)',
        'footer-menu' => 'Footer-Navigation',
    ]);
});

// Register REST route
add_action('rest_api_init', function () {
    register_rest_route('fagus/v1', '/menus/(?P<location>[a-z0-9_-]+)', [
        'methods'             => 'GET',
        'callback'            => 'fagus_get_menu_by_location',
        'permission_callback' => '__return_true',
        'args'                => [
            'location' => [
                'required'          => true,
                'validate_callback' => function ($param) {
                    return is_string($param) && preg_match('/^[a-z0-9_-]+$/', $param);
                },
            ],
        ],
    ]);
});

/**
 * REST callback: return hierarchical menu for a given location.
 */
function fagus_get_menu_by_location(WP_REST_Request $request) {
    $location  = $request->get_param('location');
    $locations = get_nav_menu_locations();

    if (empty($locations[$location])) {
        return new WP_REST_Response([], 200);
    }

    $menu = wp_get_nav_menu_object($locations[$location]);
    if (!$menu) {
        return new WP_REST_Response([], 200);
    }

    $items = wp_get_nav_menu_items($menu->term_id);
    if (!$items) {
        return new WP_REST_Response([], 200);
    }

    // Build flat map
    $flat = [];
    foreach ($items as $item) {
        $path = wp_parse_url($item->url, PHP_URL_PATH);
        $flat[$item->ID] = [
            'id'          => (int) $item->ID,
            'title'       => $item->title,
            'url'         => $item->url,
            'path'        => $path ?: '/',
            'target'      => $item->target ?: '_self',
            'css_classes' => array_values(array_filter($item->classes)),
            'description' => $item->description ?: '',
            'parent'      => (int) $item->menu_item_parent,
            'children'    => [],
        ];
    }

    // Build tree
    $tree = [];
    foreach ($flat as $id => &$node) {
        if ($node['parent'] && isset($flat[$node['parent']])) {
            $flat[$node['parent']]['children'][] = &$node;
        } else {
            $tree[] = &$node;
        }
    }
    unset($node);

    return new WP_REST_Response($tree, 200);
}
