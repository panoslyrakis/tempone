<?php
/**
 * Plugin Name: [SmartCrawl Pro] Allow full access for editors
 * Description: Enables/disables the SmartCrawl settings for the editor role (User Role Editor compatible)
 * Author: Anderson Salas @ WPMUDEV
 * Task: SLS-4502
 * Author URI: https://premium.wpmudev.org
 * License: GPLv2 or later
 */

// Based on: https://gist.github.com/wpmudev-sls/4f18b2419fa39d2aaf0e4ad3f668e94b

add_action( 'plugins_loaded', function () {

	if ( ! class_exists( 'Smartcrawl_Loader' ) ) {
		return; // SmartCrawl is not installed/enabled.
	}

	if ( ! class_exists( 'SmartCrawl_Editor_Access' ) ) {

		class SmartCrawl_Editor_Access {

			// [>>>] Snippet settings BEGIN --------------------------------------- //

			// (If you are not using any custom capability, set to NULL).
			public $capability_name = 'manage_smartcrawl';

			public $settings = array(
				'dashboard' => true,
				'health'    => true,
				'onpage'    => true,
				'schema'    => true,
				'sitemap'   => true,
				'social'    => true,
				'autolinks' => true,
				'settings'  => true,
			);
			// [<<<] Snippet settings END ---| Do NOT edit below this line ! | ---- //

			private static $instance;

			public static function get() {
				if ( null === self::$instance ) {
					self::$instance = new self();
				}

				return self::$instance;
			}

			public function __construct() {
				$this->add_hooks();
			}

			public function set_editor_permissions( $capabilities ) {
				if ( current_user_can( 'manage_options' ) ) {
					return $capabilities; // No changes.
				}

				if ( ! current_user_can( $capabilities ) ) {
					return $this->capability_name;
				}

				return $capabilities;
			}

			public function get_capability_name() {
				return ! empty( $this->capability_name )
					? $this->capability_name
					: 'edit_others_posts';
			}

			public function add_hooks() {
				$settings = array(
					'autolinks' => Smartcrawl_Autolinks_Settings::class,
					'dashboard' => Smartcrawl_Settings_Dashboard::class,
					'health'    => Smartcrawl_Health_Settings::class,
					'onpage'    => Smartcrawl_Onpage_Settings::class,
					'schema'    => Smartcrawl_Schema_Settings::class,
					'settings'  => Smartcrawl_Settings_Settings::class,
					'sitemap'   => Smartcrawl_Sitemap_Settings::class,
					'social'    => Smartcrawl_Social_Settings::class,
				);

				foreach ( $settings as $page => $class ) {
					if ( ! isset( $this->settings[ $page ] ) || true !== $this->settings[ $page ] ) {
						continue;
					}

					$capability_name = $this->get_capability_name();

					if ( ! empty( $capability_name )
					     && ! current_user_can( $capability_name ) // Not the custom capability.
					     && ! current_user_can( 'manage_options' ) // Not an admin user.
					) {
						continue;
					}

					add_filter( 'init', function () use ( $class, $capability_name ) {
						if ( class_exists( $class ) && method_exists( $class, 'get' ) ) {
							$instance = $class::get();
							$instance->capability = $capability_name;
						}
					} );

					add_filter( 'option_page_capability_wds_' . $page . '_options', array(
						$this,
						'set_editor_permissions'
					) );
				}
			}
		}

		SmartCrawl_Editor_Access::get();
	}


} );
