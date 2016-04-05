<?php
/**
 * Visibility Shortcode
 * 
 * 
 * @package WordPress
 * @subpackage K Elements
 * @author SeventhQueen <themesupport@seventhqueen.com>
 * @since K Elements 1.0
 */


$output = '';
extract( shortcode_atts( array(
	'class'  => '',
	'type'   => '',
	'inline' => ''
), $atts ) );

$class = ( $class != '' ) ? 'kleo-visibility ' . esc_attr( $class ) : 'kleo-visibility';
$class .= ( $type  != '' ) ? " ".str_replace(',', ' ', $type) : '';

$output = "<div class=\"{$class}\">" . do_shortcode( $content ) . "</div>";
