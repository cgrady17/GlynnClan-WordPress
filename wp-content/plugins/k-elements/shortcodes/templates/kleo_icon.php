<?php
/**
 * ICON Shortcode
 * 
 * 
 * @package WordPress
 * @subpackage K Elements
 * @author SeventhQueen <themesupport@seventhqueen.com>
 * @since K Elements 1.0
 */


$output = $size = $icon = $el_class = '';
extract(shortcode_atts(array(
    'icon' => '',
    'icon_size' => '',
    'tooltip' => '',
    'tooltip_position' => '',
    'tooltip_title' => '',
    'tooltip_text' => '',
    'tooltip_action' => 'hover',
    'el_class' => '',
    'href' => '',
    'target' => '_self'
), $atts));

if ( $icon != '' && $icon != '0') {

    $icon = str_replace( 'icon-', '', $icon );

	$tooltip_class = '';
	$tooltip_data = '';
	if( $tooltip != '' ) {
		if ( $tooltip == 'popover' ) {
			$tooltip_class = ' '.$tooltip_action.'-pop';
            $tooltip_data .= ' data-toggle="popover" data-container="body" data-title="'.$tooltip_title.'" data-content="'.$tooltip_text.'" data-placement="'.$tooltip_position.'"';
		} else {
			$tooltip_class .= ' '.$tooltip_action.'-tip';
            $tooltip_data .= ' data-toggle="tooltip" data-original-title="'.$tooltip_title.'" data-placement="'.$tooltip_position.'"';
		}
	}
	$class = esc_attr( $el_class );
	$class .= ' icon-' . esc_attr( $icon );
	$class .= $icon_size != '' ? ' icon-' . esc_attr($icon_size) : '';
	$class .= $tooltip_class;

	$output = '<i class="' . trim( $class ) . '"' . $tooltip_data . '></i> ';

    if ( $href != '' ) {
        $output = '<a class="kleo-icon-anchor" href="' . $href . '" target="' . $target . '">' . trim( $output ) . '</a>';
    }

}
