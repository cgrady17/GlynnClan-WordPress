<?php
$css = $output = '';
extract(shortcode_atts(array(
    //'bg_image' => '',
    //'bg_color' => '',
    'bg_image_repeat' => '',
    //'font_color' => '',
    'front_status' => '',
    'inner_container' => 'yes',
    'text_align' => '',
    'section_type' => 'main',
    'type' => '',
    'text_color' => '',
    'bg_color' => '',
    'bg_image' => '',
    'bg_position' => 'top',
    'bg_position_horizontal' => 'left',
    'bg_repeat' => '',
    'bg_cover' => '',
    'bg_attachment' => 'false',

    'bg_video_src_mp4' => '',
    'bg_video_src_ogv' => '',
    'bg_video_src_webm' => '',
    'bg_video_cover' => '',

    'full_height' => '',
    'content_placement' => 'middle',
    'video_bg' => '',
    'video_bg_url' => '',
    'video_bg_parallax' => '',

    'column_gap' => '',
    'vertical_align' => '',
    'padding_top' => '40',
    'padding_bottom' => '40',
    'padding_left' => '',
    'padding_right' => '',
    'margin_top' => '',
    'margin_bottom' => '',
    'border' => '',
    'min_height' => '',
    'animation' => '',
    'css_animation' => '',
    'parallax_speed' => '',
    'enable_parallax' => '',
    'video_mute' => '',
    'video_autoplay' => 'true',
    'inline_style' => '',
    'visibility' => '',
    'overflow' => '',
    'parallax' => false,
    'parallax_image' => false,
    'el_class' => '',
    'el_id' => '',
    'css' => ''
), $atts));

// wp_enqueue_style( 'js_composer_front' );
wp_enqueue_script( 'wpb_composer_front_js' );
// wp_enqueue_style('js_composer_custom_css');

if ( $front_status == 'draft' ) {
  return false;
}

$bg_video = '';
$video_output = '';
$style = array();

$css_classes = array( 'container-wrap' );
if ($this->settings( 'base' ) !== 'vc_row_inner' ) {
    $css_classes[] =  $section_type . '-color';
}

if( $el_class != '' ) {
	$css_classes[] = $el_class;
}

//$style_build = $this->buildStyle( $bg_image, $bg_color, $bg_image_repeat );

if ( vc_shortcode_custom_css_class( $css, '' ) != '' ) {
    $css_classes[] = vc_shortcode_custom_css_class( $css, '' );
}

$wrapper_attributes = array();
// build attributes for wrapper
if ( ! empty( $el_id ) ) {
    $wrapper_attributes[] = 'id="' . esc_attr( $el_id ) . '"';
}


if ( ! empty( $full_height ) ) {
    $css_classes[] = ' vc_row-o-full-height';
    if ( ! empty( $content_placement ) ) {
        $css_classes[] = ' vc_row-o-content-' . $content_placement;
    }
}

// use default video if user checked video, but didn't chose url
if ( ! empty( $video_bg ) && empty( $video_bg_url ) ) {
    $video_bg_url = 'https://www.youtube.com/watch?v=lMJXxhRFO1k';
}

$has_video_bg = ( ! empty( $video_bg ) && ! empty( $video_bg_url ) && vc_extract_youtube_id( $video_bg_url ) );

if ( $has_video_bg ) {
    $parallax = $video_bg_parallax;
    $parallax_image = $video_bg_url;
    $css_classes[] = ' vc_video-bg-container';
    wp_enqueue_script( 'vc_youtube_iframe_api_js' );
}

/* Parallax */
if ( ! empty( $parallax ) ) {
    wp_enqueue_script( 'vc_jquery_skrollr_js' );
    $wrapper_attributes[] = 'data-vc-parallax="1.5"'; // parallax speed
    $css_classes[] = 'vc_general vc_parallax vc_parallax-' . $parallax;
    if ( strpos( $parallax, 'fade' ) !== false ) {
        $css_classes[] = 'js-vc_parallax-o-fade';
        $wrapper_attributes[] = 'data-vc-parallax-o-fade="on"';
    } elseif ( strpos( $parallax, 'fixed' ) !== false ) {
        $css_classes[] = 'js-vc_parallax-o-fixed';
    }
}

if ( ! empty ( $parallax_image ) ) {
    if ( $has_video_bg ) {
        $parallax_image_src = $parallax_image;
    } else {
        $parallax_image_id = preg_replace( '/[^\d]/', '', $parallax_image );
        $parallax_image_src = wp_get_attachment_image_src( $parallax_image_id, 'full' );
        if ( ! empty( $parallax_image_src[0] ) ) {
            $parallax_image_src = $parallax_image_src[0];
        }
    }
    $wrapper_attributes[] = 'data-vc-parallax-image="' . esc_attr( $parallax_image_src ) . '"';
}
if ( ! $parallax && $has_video_bg ) {
    $wrapper_attributes[] = 'data-vc-video-bg="' . esc_attr( $video_bg_url ) . '"';
}

switch ( $inner_container ) {
  case 'yes' :
    $container_start = '<div class="section-container container"><div class="row">';
    $container_end   = '</div></div>';
    break;
  default :
    $container_start = '<div class="section-container container-full"><div class="row">';
    $container_end   = '</div></div>';
}


if ( $text_color != '' ) {
	$style[] = 'color: '.$text_color;
	$css_classes[] = 'custom-color';
}


switch ( $type ) {
	case 'color':

		if ( $bg_color ) {
			$style[] = 'background-color: ' . $bg_color;
		}
		break;
		
	case 'image':
		
		$bg_cover = apply_filters( 'kleo_sanitize_flag', $bg_cover );
		$bg_attachment = in_array( $bg_attachment, array( 'false', 'fixed', 'true' ) ) ? $bg_attachment : 'false';

        if ( $bg_image && !in_array( $bg_image, array('none') ) ) {
            $bg_image_path = wp_get_attachment_image_src($bg_image, 'full');
            if ( $bg_image_path == NULL )  {
                $bg_image_path[0] = get_template_directory_uri() . "/assets/img/row_bg.jpg";
            } //' <small>'.__('This is image placeholder, edit your page to replace it.', 'js_composer').'</small>';

            $style[] = 'background-image: url(' . esc_url($bg_image_path[0]) . ')';
        }

		$position = array();
        if ( $bg_position != 'top' || $bg_position_horizontal != 'left' ) {
            $position[] = $bg_position_horizontal;
			$position[] = $bg_position;
		}

		if ( ! empty( $position ) ) {
			$style[] = 'background-position: ' . join(' ', $position);
		}
		

		if ( $bg_repeat ) {
			$style[] = 'background-repeat: ' . $bg_repeat;
		}

        if ( $bg_color ) {
            $style[] = 'background-color: ' . $bg_color;
        }
		
		if ( $enable_parallax && '' != $parallax_speed ) {

			$parallax_speed = floatval( $parallax_speed );
			if ( false == $parallax_speed ) {
				$parallax_speed = 0.05;
			}

			$css_classes[] = 'bg-parallax';
			$wrapper_attributes[] = 'data-prlx-speed="' . $parallax_speed . '"';

            $style[] = 'background-attachment: fixed';
            $style[] = 'background-size: cover';
		} else {

            if ( 'false' != $bg_attachment ) {
                $style[] = 'background-attachment: fixed';
            } else {
                $style[] = 'background-attachment: scroll';
            }

            if ( 'false' != $bg_cover ) {
                $style[] = 'background-size: cover';
            } else {
                $style[] = 'background-size: auto';
            }

        }
	
		break;
		
	case 'video':

		// video bg
		$bg_video_args = array();

		if ( $bg_video_src_mp4 ) {
			$bg_video_args['mp4'] = $bg_video_src_mp4;
		}

		if ( $bg_video_src_ogv ) {
			$bg_video_args['ogv'] = $bg_video_src_ogv;
		}

		if ( $bg_video_src_webm ) {
			$bg_video_args['webm'] = $bg_video_src_webm;
		}

		if ( !empty($bg_video_args) ) {
			$attr_strings = array(
				'loop',
				'preload="1"',
				'autoplay=""',
				'muted="muted"'
			);
			if ($video_mute) {
				//$attr_strings[] = 'muted="muted"';
			}
			if ($video_autoplay) {
				//$attr_strings[] = 'autoplay=""';
			}
			
			if ( $bg_video_cover && !in_array( $bg_video_cover, array('none') ) ) {
				$bg_video_path = wp_get_attachment_image_src($bg_video_cover, 'kleo-full-width');
				$attr_strings[] = 'poster="' . esc_url($bg_video_path[0]) . '"';
			}

			$bg_video .= sprintf( '<div class="video-wrap"><video %s class="full-video" webkit-playsinline>', join( ' ', $attr_strings ) );

			$source = '<source type="%s" src="%s" />';
			foreach ( $bg_video_args as $video_type=>$video_src ) {

				$video_type = wp_check_filetype( $video_src, wp_get_mime_types() );
				$bg_video .= sprintf( $source, $video_type['type'], esc_url( $video_src ) );

			}

			$bg_video .= '</video></div>';

			$css_classes[] = 'bg-full-video no-video-controls';
		}
		break;

	default:
		break;
}

if ( $column_gap == 'no' ) {
    $css_classes[] = 'no-col-gap';
}
if ( $vertical_align == 'yes' ) {
    $css_classes[] = 'vertical-col';
}

if( $padding_top != '' ) {
    $style[] = 'padding-top: '.(preg_match('/(px|em|\%|pt|cm)$/', $padding_top) ? $padding_top : $padding_top.'px');
}
if( $padding_bottom != '' ) {
    $style[] = 'padding-bottom: '.(preg_match('/(px|em|\%|pt|cm)$/', $padding_bottom) ? $padding_bottom : $padding_bottom.'px');
}
if( $padding_left != '' ) {
    $style[] = 'padding-left: '.(preg_match('/(px|em|\%|pt|cm)$/', $padding_left) ? $padding_left : $padding_left.'px');
}
if( $padding_right != '' ) {
    $style[] = 'padding-right: '.(preg_match('/(px|em|\%|pt|cm)$/', $padding_right) ? $padding_right : $padding_right.'px');
}
if( $margin_top != '' ) {
    $style[] = 'margin-top: '.(preg_match('/(px|em|\%|pt|cm)$/', $margin_top) ? $margin_top : $margin_top.'px');
}
if( $margin_bottom != '' ) {
    $style[] = 'margin-bottom: '.(preg_match('/(px|em|\%|pt|cm)$/', $margin_bottom) ? $margin_bottom : $margin_bottom.'px');
}
if( $min_height != '' ) {
    $style[] = 'min-height: '.(preg_match('/(px|em|\%|pt|cm)$/', $min_height) ? $min_height : $min_height.'px');
}

switch ( $border ) {
	case 'top' :
		$border = ' border-top';
		break;
	case 'left' :
		$border = ' border-left';
		break;
	case 'right' :
		$border = ' border-right';
		break;
	case 'bottom' :
		$border = ' border-bottom';
		break;
	case 'vertical' :
		$border = ' border-top border-bottom';
		break;
	case 'horizontal' :
		$border = ' border-left border-right';
		break;
	case 'all' :
		$border = ' border-top border-left border-right border-bottom';
		break;
	default :
		$border = '';
}
$css_classes[] = $border;

if ($overflow) {
	$css_classes[] = 'ov-hidden';
}


if ( $inline_style ) {
	$style[] = $inline_style;
}

$style = implode(';', $style);

$video_output .= $bg_video;

	if ( isset($style) ) {
		$style = wp_kses( $style, array() );
		$style = ' style="' . esc_attr($style) . '"';
	} else {
		$style = '';
	}

if ( $animation != '' ) {
	wp_enqueue_script( 'waypoints' );
	$css_classes[] = "animated {$animation} {$css_animation}";
}

if($text_align != '') {
	$css_classes[] = 'text-'.$text_align;
}

if ($visibility != '') {
	$css_classes[] = str_replace(',', ' ', $visibility);
}

//echo $style_build;

$output .= "\n" . '<section ' . implode( ' ', $wrapper_attributes ) . 'class="' . esc_attr(trim(implode(' ', $css_classes))) .'"' . $style. '>';

$output .= $container_start;
$output .= wpb_js_remove_wpautop($content);
$output .= $container_end;
$output .= $video_output;
$output .= '</section><!-- end section -->';
echo $output;