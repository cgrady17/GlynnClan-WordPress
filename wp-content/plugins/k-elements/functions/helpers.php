<?php


//Fontello icons array
if ( ! function_exists( 'kleo_icons_array' ) ) {
    function kleo_icons_array( $prefix = '' ) {

        $icons= array('');

        $icons_json = file_get_contents( KLEO_LIB_DIR . '/assets/font-icons.json');
        if ( $icons_json ) {
            $arr = json_decode( $icons_json, true );
            foreach($arr['glyphs'] as $icon)
            {
                $icons[$prefix . $icon['css']] = $icon['css'];
                asort($icons);
            }
        }

        return $icons;
    }
}


if (!function_exists('kleo_has_shortcode')) {
	function kleo_has_shortcode( $shortcode = '', $post_id = null ) {

		if ( ! $post_id ) {
			if ( ! is_singular() ) {
				return false;
			}
			$post_id = get_the_ID();
		}
		if (is_page() || is_single()) {
			$current_post = get_post( $post_id );
			$post_content  = $current_post->post_content;
			$found         = false;

			if ( ! $shortcode ) {
				return $found;
			}

			if ( stripos( $post_content, '[' . $shortcode ) !== false ) {
				$found = true;
			}

			return $found;
		} else {
			return false;
		}
	}
}


function find_shortcode_template($shortcode) {
	if (file_exists(trailingslashit( get_stylesheet_directory() ) . 'k_elements/' . $shortcode . '.php')) {
		return trailingslashit( get_stylesheet_directory() ) . 'k_elements/' . $shortcode . '.php';
	}
	elseif ( file_exists( trailingslashit( get_template_directory() ) . 'k_elements/' . $shortcode . '.php' ) ) {
		return trailingslashit( get_template_directory() ) . 'k_elements/' . $shortcode . '.php';
	} else {
		return trailingslashit( K_ELEM_PLUGIN_DIR ) . 'shortcodes/templates/' . $shortcode . '.php';
	}
}

function kleo_shortcode_not_found() {
	return "!! Shortcode template not found !!";
}


/* Buddypress */


/* Get User online */
if (!function_exists('kleo_is_user_online')):
	/**
	 * Check if a Buddypress member is online or not
	 * @global object $wpdb
	 * @param integer $user_id
	 * @param integer $time
	 * @return boolean
	 */
	function kleo_is_user_online($user_id, $time=5)
	{
		global $wpdb;
		$sql = $wpdb->prepare( "
			SELECT u.user_login FROM $wpdb->users u JOIN $wpdb->usermeta um ON um.user_id = u.ID
			WHERE u.ID = %d
			AND um.meta_key = 'last_activity'
			AND DATE_ADD( um.meta_value, INTERVAL %d MINUTE ) >= UTC_TIMESTAMP()", $user_id, $time);
		$user_login = $wpdb->get_var( $sql );
		if(isset($user_login) && $user_login !=""){
			return true;
		}
		else {return false;}
	}
endif;


if (!function_exists('kleo_get_online_status')):
	function kleo_get_online_status($user_id) {
		$output = '';
		if (kleo_is_user_online($user_id)) {
			$output .= '<span class="kleo-online-status high-bg"></span>';
		} else {
			$output .= '<span class="kleo-online-status"></span>';
		}
		return $output;
	}
endif;


/**
 * Render the html to show if a user is online or not
 */
if( !function_exists('kleo_online_status') ) :
	function kleo_online_status($user_id) {
		echo kleo_get_online_status($user_id);
	}
endif;



if (!function_exists('kleo_bp_member_stats')):
	function kleo_bp_member_stats($field=false,$value=false, $online=false)
	{
		global $wpdb;

		if (!$field || !$value) {
			return;
		}

		$where = " WHERE name = '".$field."' AND value = '".esc_sql($value)."'";
		$sql = "SELECT ".$wpdb->base_prefix."bp_xprofile_data.user_id FROM ".$wpdb->base_prefix."bp_xprofile_data
				JOIN ".$wpdb->base_prefix."bp_xprofile_fields ON ".$wpdb->base_prefix."bp_xprofile_data.field_id = ".$wpdb->base_prefix."bp_xprofile_fields.id
				$where";

		$match_ids = $wpdb->get_col($sql);
		if ( !$online ) {
			return count($match_ids);
		}

		if ( !$match_ids ) {
			$match_ids = array(0);
		}

		if( !empty($match_ids) )
		{
			$include_members = '&include='.join(",",$match_ids);
		}
		else
		{
			$include_members = '';
		}

		$i = 0;
		if ( bp_has_members( 'user_id=0&type=online&per_page=999999999&populate_extras=0'.$include_members ) ) :
			while ( bp_members() ) : bp_the_member();
				$i++;
			endwhile;
		endif;

		return apply_filters('kleo_bp_member_stats',$i, $value);
	}
endif;



if (!function_exists('get_profile_id_by_name')) :
	/**
	 * Return profile field ID by profile name
	 * @global object $wpdb
	 * @param string $name
	 * @return integer
	 */
	function get_profile_id_by_name($name)
	{
		global $wpdb;
		if (!isset($name))
				return false;

		$sql = "SELECT id FROM ".$wpdb->base_prefix."bp_xprofile_fields WHERE name = '".$name."'";
		return $wpdb->get_var($sql);
	}
endif;


if(!function_exists('get_group_id_by_name')) :
	function get_group_id_by_name($name)
	{
		global $wpdb;
		if (!isset($name))
				return false;

		$sql = "SELECT id FROM ".$wpdb->base_prefix."bp_xprofile_groups WHERE name = '".$name."'";
		return $wpdb->get_var($sql);
	}
endif;


if( ! function_exists( 'get_cfield' ) ) {

    function get_cfield( $meta = NULL, $id = NULL ) {
        if( $meta === NULL ) {
            return false;
        }

        if ( ! $id && ! in_the_loop() && is_home() && get_option( 'page_for_posts' ) ) {
            $id = get_option( 'page_for_posts' );
        }

        if ( $id === NULL ) {
            $id = get_the_ID();
        }

        if ( ! $id ) {
            return false;
        }

        return get_post_meta( $id, '_kleo_' . $meta, true );
    }
}

/*
 * Echo the custom field
 */
if( ! function_exists( 'the_cfield' ) ) {
    function the_cfield($meta = NULL, $id = NULL) {
        echo get_cfield($meta, $id);
    }
}



if ( ! function_exists('kleo_get_img_overlay') ) {
    function kleo_get_img_overlay() {
        global $kleo_config;

        if (isset($kleo_config['image_overlay'])) {
            return $kleo_config['image_overlay'];
        }
        return '';
    }
}

if (! function_exists('kleo_parse_multi_attribute')) {
    /**
     * Parse string like "title:Hello world|weekday:Monday" to array('title' => 'Hello World', 'weekday' => 'Monday')
     *
     * @param $value
     * @param array $default
     *
     * @return array
     */
    function kleo_parse_multi_attribute($value, $default = array())
    {
        $result = $default;
        $params_pairs = explode('|', $value);
        if (!empty($params_pairs)) {
            foreach ($params_pairs as $pair) {
                $param = preg_split('/\:/', $pair);
                if (!empty($param[0]) && isset($param[1])) {
                    $result[$param[0]] = rawurldecode($param[1]);
                }
            }
        }

        return $result;
    }
}

if ( ! function_exists('kleo_get_post_media')) {
    /**
     * Return post media by format
     *
     * @param $post_format
     * @param $options
     * @return string
     *
     * @since 3.0
     */
    function kleo_get_post_media($post_format = 'standard', $options = array())
    {

        global $kleo_config;

        if (isset($options['icons']) && $options['icons']) {
            $icons = true;
        } else {
            $icons = false;
        }

        if (isset($options['media_width']) && isset($options['media_height'])) {
            $media_width = $options['media_width'];
            $media_height = $options['media_height'];
        } else {
            $media_width = $kleo_config['post_gallery_img_width'];
            $media_height = $kleo_config['post_gallery_img_height'];
        }

        $output = '';

        switch ($post_format) {

            case 'video':

                //oEmbed video
                $video = get_cfield('embed');
                // video bg self hosted
                $bg_video_args = array();
                $k_video = '';

                if (get_cfield('video_mp4')) {
                    $bg_video_args['mp4'] = get_cfield('video_mp4');
                }
                if (get_cfield('video_ogv')) {
                    $bg_video_args['ogv'] = get_cfield('video_ogv');
                }
                if (get_cfield('video_webm')) {
                    $bg_video_args['webm'] = get_cfield('video_webm');
                }

                if (!empty($bg_video_args)) {
                    $attr_strings = array(
                        'preload="none"'
                    );

                    if (get_cfield('video_poster')) {
                        $attr_strings[] = 'poster="' . get_cfield('video_poster') . '"';
                    }

                    $k_video .= '<div class="kleo-video-wrap"><video ' . join(' ', $attr_strings) . ' controls="controls" class="kleo-video" style="width: 100%; height: 100%;">';

                    $source = '<source type="%s" src="%s" />';
                    foreach ($bg_video_args as $video_type => $video_src) {
                        $video_type = wp_check_filetype($video_src, wp_get_mime_types());
                        $k_video .= sprintf($source, $video_type['type'], esc_url($video_src));
                    }

                    $k_video .= '</video></div>';

                    $output .= $k_video;
                } // oEmbed
                elseif (!empty($video)) {
                    global $wp_embed;
                    $output .= apply_filters('kleo_oembed_video', $video);
                }

                break;

            case 'audio':

                $audio = get_cfield('audio');

                if (!empty($audio)) {
                    $output .=
                        '<div class="post-audio">' .
                        '<audio preload="none" class="kleo-audio" id="audio_' . get_the_ID() . '" style="width:100%;" src="' . $audio . '"></audio>' .
                        '</div>';
                }
                break;

            case 'gallery':

                $slides = get_cfield('slider');

                $output .= '<div class="kleo-banner-slider">'
                    . '<div class="kleo-banner-items" >';

                if ($slides) {
                    foreach ($slides as $slide) {
                        if ($slide) {
                            $image = aq_resize($slide, $media_width, $media_height, true, true, true);
                            //small hack for non-hosted images
                            if (!$image) {
                                $image = $slide;
                            }
                            $output .= '<article>
								<a href="' . $slide . '" data-rel="prettyPhoto[inner-gallery]">
									<img src="' . $image . '" alt="' . get_the_title() . '">'
                                . kleo_get_img_overlay()
                                . '</a>
							</article>';
                        }
                    }
                }

                $output .= '</div>'
                    . '<a href="#" class="kleo-banner-prev"><i class="icon-angle-left"></i></a>'
                    . '<a href="#" class="kleo-banner-next"><i class="icon-angle-right"></i></a>'
                    . '<div class="kleo-banner-features-pager carousel-pager"></div>'
                    . '</div>';

                break;


            case 'aside':
                if ($icons) {
                    $output .= '<div class="post-format-icon"><i class="icon icon-doc"></i></div>';
                }
                break;

            case 'link':
                if ($icons) {
                    $output .= '<div class="post-format-icon"><i class="icon icon-link"></i></div>';
                }
                break;

            case 'quote':
                if ($icons) {
                    $output .= '<div class="post-format-icon"><i class="icon icon-quote-right"></i></div>';
                }
                break;

            case 'image':
            default:
                if (kleo_get_post_thumbnail_url() != '') {
                    $output .= '<div class="post-image">';

                    $img_url = kleo_get_post_thumbnail_url();
                    $image = aq_resize($img_url, $media_width, null, true, true, true);
                    if (!$image) {
                        $image = $img_url;
                    }
                    $output .= '<a href="' . get_permalink() . '" class="element-wrap">'
                        . '<img src="' . $image . '" alt="' . get_the_title() . '">'
                        . kleo_get_img_overlay()
                        . '</a>';

                    $output .= '</div><!--end post-image-->';
                } elseif ($icons) {
                    $post_icon = $post_format == 'image' ? 'picture' : 'doc';
                    $output .= '<div class="post-format-icon"><i class="icon icon-' . $post_icon . '"></i></div>';
                }

                break;
        }

        return $output;
    }
}