<?php
/**
 * DIVIDER Shortcode
 * [kleo_divider type="full|long|double|short" double="yes|no" position="center|left|right" text="" class="" id=""]
 * 
 * @package WordPress
 * @subpackage K Elements
 * @author SeventhQueen <themesupport@seventhqueen.com>
 * @since K Elements 1.0
 */

$output = $icon_el = '';
extract( shortcode_atts( array(
		'id'    => '',
		'class' => '',
		'style' => '',
		'type'  => 'full',
		'double' => false,
		'icon' => '',
		'icon_size' => '',
		'position' => 'center',
		'text' => '',
		
), $atts ) );

$id    = ( $id    != '' ) ? 'id="' . esc_attr( $id ) . '"' : '';
$class = ( $class != '' ) ? 'hr-title ' . esc_attr( $class ) : 'hr-title';
$style = ( $style != '' ) ? $style : '';

if ($type) {
	$class .= ' hr-' . $type;
}
if ($position) {
	$class .= ' hr-' . $position;
}
if ($double) {
	$class .= ' hr-double';
}

$text_inside = '';
if( $icon != '' && $icon != '0'  ) {
	$icon = 'icon-' . str_replace( "icon-", "", $icon );
	if ( $icon_size != '' ) {
		$icon .= ' icon-' . $icon_size;
	}
	$icon_el = '<i class="' . $icon . '"></i> ';
}
$text = ( $text != '' ) ? $text : '';

$text_inside = '<abbr>' . $icon_el . $text . '</abbr>';

$output .= "\n\t"."<div {$id} class=\"{$class}\" style=\"{$style}\">{$text_inside}</div>";