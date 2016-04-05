<?php
/**
 * Animated numbers shortcode Shortcode
 * [kleo_animate_numbers timer=9000 animation="animate-when-almost-visible"]1000[/kleo_animate_numbers]
 * 
 * @package WordPress
 * @subpackage K Elements
 * @author SeventhQueen <themesupport@seventhqueen.com>
 * @since K Elements 1.0
 */

$output = '';
wp_enqueue_script( 'waypoints' );

extract(shortcode_atts(array(
		'timer' => '',
		'animation' => 'animate-when-almost-visible',
		'el_class' => ''
), $atts));

$data_attr = '';
$class = esc_attr($el_class);

if ( $animation != '' ) {
	$class .= " kleo-animate-number {$animation}";
}

if ($timer != '') {
	$data_attr .= ' data-timer="'. (int)$timer .'"';
}

$inner_content = do_shortcode($content);

$output = '<span data-number="'.(int)$inner_content.'" class="'.$class.'"'.$data_attr.'>' . (int)$inner_content . '</span>';