<?php
/**
 * @package WordPress
 * @subpackage KLEO
 * @author SeventhQueen <themesupport@seventhqueen.com>
 * @since 1.6
 */

  if ( bp_is_active('notifications') ) {
    require_once( KLEO_LIB_DIR . '/plugin-buddypress/menu-notifications.php' );
  }



/* BuddyPress Avatar in menu item */
add_filter('kleo_nav_menu_items', 'kleo_add_user_avatar_nav_item' );
function kleo_add_user_avatar_nav_item( $menu_items ) {
    $menu_items[] = array(
        'name' => __( 'My Account', 'kleo_framework' ),
        'slug' => 'user_avatar',
        'link' => '#',
    );

    return $menu_items;
}

add_filter('kleo_setup_nav_item_user_avatar' , 'kleo_setup_user_avatar_nav');
function kleo_setup_user_avatar_nav( $menu_item ) {

    add_filter( 'walker_nav_menu_start_el_user_avatar', 'kleo_menu_user_avatar', 10, 4 );
    add_filter( 'walker_nav_menu_start_el_li_user_avatar', 'kleo_menu_user_avatar_li', 10, 4 );

    return $menu_item;
}
if ( ! function_exists( 'kleo_menu_user_avatar' ) ) {
    /**
     * Render user avatar menu item
     *
     * @param string $item_output
     * @param  array $item
     * @param  integer $depth
     * @param  object $args
     * @return string
     */
    function kleo_menu_user_avatar( $item_output, $item, $depth, $args ) {

        $output = '';

        if ( is_user_logged_in() ) {

            $url = bp_loggedin_user_domain();

            $attr_title = strip_tags( $item->attr_title );

            $output .= '<a title="' . bp_get_loggedin_user_fullname() . '" class="kleo-bp-user-avatar' . ( $args->has_children && in_array($depth, array(0,1)) ? ' js-activated' : '' ) . '" href="' . $url . '" title="' . $attr_title .'">'
                .  '<img src="' . bp_get_loggedin_user_avatar(array('width' => 25, 'height' => 25, 'html' => false)) . '" class="kleo-rounded" alt="">' . ($item->attr_title != '' ? ' ' . $item->attr_title : '');

            $output .= ( $args->has_children && in_array($depth, array(0,1))) ? ' <span class="caret"></span></a>' : '</a>';

            return $output;
        } elseif ( $args->has_children && in_array( $depth, array( 0, 1 ) ) ) {
            return $item_output;
        } else {
            return '';
        }
    }
}

function kleo_menu_user_avatar_li( $item_output, $item, $depth, $args ) {
    $output = '';
    if ( is_user_logged_in() || ($args->has_children && in_array( $depth, array( 0, 1 ) )) ) {
        $output = $item_output;
    }
    return $output;
}



/* Fix for members search form placeholder */
add_filter( 'bp_directory_members_search_form', 'kleo_bp_fix_members_placeholder' );

function kleo_bp_fix_members_placeholder( $html ) {
    if ( isset($_GET['s']) && $_GET['s'] != '' ) {
        $html = str_replace('placeholder', 'value', $html);
    }

    return $html;
}



/* Display BuddyPress Member Types Filters in Members Directory */

add_action( 'bp_members_directory_member_types', 'kleo_bp_member_types_tabs' );
function kleo_bp_member_types_tabs() {
    if( ! bp_get_current_member_type() ){
        $member_types = bp_get_member_types( array(), 'objects' );
        if( $member_types ) {
            foreach ( $member_types as $member_type ) {
                if ( $member_type->has_directory == 1 ) {
                    echo '<li id="members-' . esc_attr($member_type->name) . '" class="bp-member-type-filter">';
                    echo '<a href="' . bp_get_members_directory_permalink() . 'type/' . $member_type->directory_slug . '/">' . sprintf('%s <span>%d</span>', $member_type->labels['name'], kleo_bp_count_member_types($member_type->name)) . '</a>';
                    echo '</li>';
                }
            }
        }
    }
}



add_filter( 'bp_modify_page_title', 'kleo_bp_members_type_directory_page_title', 9, 4 );
function kleo_bp_members_type_directory_page_title( $title, $original_title, $sep, $seplocation  ) {
    $member_type = bp_get_current_member_type();
    if( bp_is_directory() && $member_type ){
        $member_type = bp_get_member_type_object( $member_type );
        if( $member_type ) {
            global $post;
            $post->post_title = $member_type->labels['name'];
            $title = $member_type->labels['name'] . " " . $sep . " " . $original_title;
        }
    }
    return $title;
}



add_filter( 'bp_get_total_member_count', 'kleo_bp_get_total_member_count_member_type' );
function kleo_bp_get_total_member_count_member_type(){
    $count = bp_core_get_active_member_count();
    $member_type = bp_get_current_member_type();
    if( bp_is_directory() && $member_type ){
        $count = kleo_bp_count_member_types( $member_type );
    }
    return $count;
}



add_filter( 'bp_get_total_friend_count', 'kleo_bp_get_total_friend_count_member_type' );
function kleo_bp_get_total_friend_count_member_type(){
    $user_id = get_current_user_id();
    $count = friends_get_total_friend_count( $user_id );
    $member_type = bp_get_current_member_type();
    if( bp_is_directory() && $member_type ){
        global $bp, $wpdb;
        $friends =  $wpdb->get_results("SELECT count(1) as count FROM {$bp->friends->table_name} bpf
        LEFT JOIN {$wpdb->term_relationships} tr ON (bpf.initiator_user_id = tr.object_id || bpf.friend_user_id = tr.object_id )
        LEFT JOIN {$wpdb->terms} t ON t.term_id = tr.term_taxonomy_id
        WHERE t.slug = '" . $member_type . "' AND (bpf.initiator_user_id = $user_id || bpf.friend_user_id = $user_id ) AND tr.object_id != $user_id AND bpf.is_confirmed = 1", ARRAY_A);
        $count = 0;
        if( isset( $friends['0']['count'] ) && is_numeric( $friends['0']['count'] ) ){
            $count = $friends['0']['count'];
        }
    }
    return $count;
}



function kleo_bp_count_member_types( $member_type = '' ) {
    if ( ! bp_is_root_blog() ) {
        switch_to_blog( bp_get_root_blog_id() );
    }
    global $wpdb;
    $sql = array(
        'select' => "SELECT t.slug, tt.count FROM {$wpdb->term_taxonomy} tt LEFT JOIN {$wpdb->terms} t",
        'on'     => 'ON tt.term_id = t.term_id',
        'where'  => $wpdb->prepare( 'WHERE tt.taxonomy = %s', 'bp_member_type' ),
    );
    $members_count = $wpdb->get_results( join( ' ', $sql ) );
    $members_count = wp_filter_object_list( $members_count, array( 'slug' => $member_type ), 'and', 'count' );
    $members_count = array_values( $members_count );
    if( isset( $members_count[0] ) && is_numeric( $members_count[0] ) ) {
        $members_count = $members_count[0];
    }else{
        $members_count = 0;
    }
    restore_current_blog();
    return $members_count;
}



add_filter( 'bp_before_has_members_parse_args', 'kleo_bp_set_has_members_type_arg', 10, 1 );
function kleo_bp_set_has_members_type_arg( $args ) {
    $member_type = bp_get_current_member_type();
    $member_types = bp_get_member_types(array(), 'names');
    if ( isset( $args['scope'] ) && !isset( $args['member_type'] ) && in_array( $args['scope'], $member_types ) ) {
        if( $member_type ) {
            unset( $args['scope'] );
        }else{
            $args['member_type'] = $args['scope'];
        }
    }
    return $args;
}

add_action( 'bp_before_member_header_meta', 'kleo_bp_profile_member_type_label' );
function kleo_bp_profile_member_type_label() {
    $member_type = bp_get_member_type( bp_displayed_user_id() );
    if ( empty( $member_type ) ) {
        return;
    }
    $member_type_object = bp_get_member_type_object( $member_type );
    if($member_type_object){
        $member_type_label = '<p class="kleo_bp_profile_member_type_label">' . esc_html( $member_type_object->labels['singular_name'] ) . '</p>';
        echo apply_filters('kleo_bp_profile_member_type_label', $member_type_label);
    }
}