﻿var gw_isMobile = isMobile();
var gw_isIE = document.documentMode != undefined && document.documentMode >5 ? document.documentMode : false;
var supportsSVG = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")

if (!supportsSVG && document.documentElement.className.indexOf('no-svg') == '-1') {
	var htmlClasses=(document.documentElement.className).split(' ');
	htmlClasses.push('no-svg');
	document.documentElement.className = htmlClasses.join(' ').replace(/^\s+|\s+$/g, '');
} 

if (gw_isIE) {
	var htmlClasses=(document.documentElement.className).split(' ');
	if (gw_isIE == 9) { 
		htmlClasses.push('ie9');
	} else if (gw_isIE == 8) {
		htmlClasses.push('ie8');
	} else {
		htmlClasses.push('ie');
	}
	document.documentElement.className = htmlClasses.join(' ').replace(/^\s+|\s+$/g, '');
}

function isMobile() {
	var htmlClasses=(document.documentElement.className).split(' '),
		mobileMq = 'screen and (max-width:782px)';
	if (window.matchMedia && window.matchMedia(mobileMq).matches) {
		if (document.documentElement.className.indexOf('gwa-mobile') == '-1') {
			htmlClasses.push('gwa-mobile');
			document.documentElement.className = htmlClasses.join(' ').replace(/^\s+|\s+$/g, '');
		}
		return true;
	} else {
		if (document.documentElement.className.indexOf('gwa-mobile') != '-1') {
			document.documentElement.className = document.documentElement.className.replace('gwa-mobile', '').replace(/^\s+|\s+$/g, '');
		}
		return false;
	};
	
		
};

/* Detect CSS transition support */
function supportsTransitions() {
	var s = document.createElement('p').style;
	return 'transition' in s || 'WebkitTransition' in s || 'MozTransition' in s || 'msTransition' in s || 'OTransition' in s;		
}
var supportsTransitions = supportsTransitions();

	  

jQuery(document).ready(function($, undefined) {	
	
	/* ---------------------------------------------------------------------- /
		[1] SETUP & COMMON
	/ ---------------------------------------------------------------------- */	
	
		var $wpContent = $('#wpcontent');
			$goPricingAdmin = $('#go-pricing-admin-wrap'),
			$goPricingForm = $goPricingAdmin.find('#go-pricing-form');
				
	/* ---------------------------------------------------------------------- /
		[4] POPUP FUNCTIONS & EVENTS 
	/ ---------------------------------------------------------------------- */

		/* get cursor positions */
		var getCurPos = function($obj) {
			var input = $obj[0];
			var pos = {start: 0, end:0};
			if (input.setSelectionRange) {
				pos.start=input.selectionStart;
				pos.end=input.selectionEnd;
			} else if (input.createTextRange) { 
				input.focus();
				var c = "\001",
					sel=document.selection.createRange(),
					dul=sel.duplicate(),
					len=0;
					
				dul.moveToElementText(input);
				sel.text = c;
				len	= (dul.text.indexOf(c));
				sel.moveStart('character',-1);
				sel.text = "";
				pos.start = len;
				pos.end = len + sel.text.length;
			}
			return pos;
		};
		
		var setCurPos = function($obj, pos) {
			var input = $obj[0];
			if (input.setSelectionRange) {
				input.setSelectionRange(pos.start, pos.end);
			} else if (input.createTextRange) {
				var selection = input.createTextRange();
				selection.collapse(true);
				selection.moveEnd('character', pos.end);
				selection.moveStart('character', pos.start);
				selection.select();
			}
		};
		
		
		/* Get cursor position of taget input */
		$goPricingAdmin.on('blur', 'input[type="text"][data-popup], textarea[data-popup]', function(e) {			
			if (typeof this.type !=='undefined' && (this.type =='textarea' || this.type =='text' ) ) {
				var $this = $(this), pos=getCurPos($this);
				$this.data('cur-start',pos.start).data('cur-end',pos.end);
			}
		});						
		
		
		
		$goPricingAdmin.on('click', '[data-action*="font-style"]', function(e) {
			var $this = $(this);
			if (!$this.hasClass('gwa-current')) {
				$this.addClass('gwa-current');
				$this.find('input').val(1);
			} else {
				$this.removeClass('gwa-current');
				$this.find('input').val('');				
			}
		});		
		
		$goPricingAdmin.on('click', '[data-action="add-tag"]', function(e) {
			var $this = $(this), 
				$wrapper = $this.closest('.gwa-tags'), 
				$tags = $wrapper.find('.gwa-tags-inner'),
				$input = $wrapper.find('select');

			if ($tags.find('[value="'+$input.find('option').eq($input[0].selectedIndex).html()+'"]').length) return;
			$('<span class="gwa-tag">'+$input.find('option').eq($input[0].selectedIndex).html()+'<a href="#" title="Remove" class="gwa-tag-remove"></a><input name="google-fonts[]"type="hidden" value="'+$input.find('option').eq($input[0].selectedIndex).html()+'"></span>').appendTo($tags);								
		});
		
		$goPricingAdmin.on('click', '.gwa-tag-remove', function(e) {
			var $this = $(this);
			
			$this.closest('.gwa-tag').remove();
			e.preventDefault();
		});			
							
		/* Open & Close Admin Box panels */
		$goPricingAdmin.on('click', '.gwa-col-box-header', function() {
			var $this=$(this), $box=$this.closest('.gwa-col-box'), $boxContent=$box.find('.gwa-col-box-content');
			if (!$this.find('.gwa-col-box-ctrl').length) return;
			
			if ($this.hasClass('ui-sortable-handle') && $this.closest('.ui-sortable-helper').length) {
				return;
			}
			
			if ($boxContent.is(':visible')) {
				$boxContent.css('display','block');
				$boxContent.slideUp();
				$box.removeClass('gwa-open');
			} else {
				$boxContent.slideDown();
				$box.addClass('gwa-open');
			}
		});

		$goPricingAdmin.on('focusin focusout', '.gwa-textarea-btn textarea', function(e) {
			var $this = $(this);
			if (e.type == 'focusin' ) {
				$this.closest('.gwa-textarea-btn').addClass('gwa-focus');
			} else {
				$this.closest('.gwa-textarea-btn').removeClass('gwa-focus');
			}
			
		});


		/* Open & Close Admin Box panels */
		$goPricingAdmin.on('click', '.gwa-abox-tab', function(e) {
			var $this=$(this), $tab=$this.closest('.gwa-abox-tabs'), index = $tab.find('.gwa-abox-tab').index( $this );
			
			$this.addClass('gwa-current').siblings().removeClass('gwa-current');
			$tab.find('.gwa-abox-tab-content').eq(index).addClass('gwa-current').siblings().removeClass('gwa-current');
			
			e.preventDefault();
			
		});

		/* Open & Close Admin Box panels */
		$goPricingAdmin.on('click', '.gwa-abox-header-tab', function(e) {
			var $this=$(this), 
				$box=$this.closest('.gwa-abox'), 
				$boxContent=$box.find('.gwa-abox-content'),
				currentIndex = $box.find('.gwa-abox-header-tab').index($this);

			if (!$this.hasClass('gwa-current')) {
				$this.addClass('gwa-current').siblings().removeClass('gwa-current');
				$boxContent.eq(currentIndex).addClass('gwa-current').css('display','block').siblings().removeClass('gwa-current').css('display','none'); 				
				if ($box.hasClass('gwa-closed')) $boxContent.eq(currentIndex).css('display','none'); 
			}

		});

		/* Open & Close Admin Box panels */
		$goPricingAdmin.on('click', '.gwa-abox-header', function(e) {
			var $this=$(this), $box=$this.closest('.gwa-abox'), 
				$boxContent = $box.find('.gwa-abox-content.gwa-current').length ? $box.find('.gwa-abox-content.gwa-current') : $box.find('.gwa-abox-content:first');
			if (!$this.find('.gwa-abox-ctrl').length) return;
			
			if ($this.hasClass('ui-sortable-handle') && $this.closest('.ui-sortable-helper').length) {
				return;
			}
			if ($(e.target).closest('.gwa-abox-header-tab').length) {
				return;
			}			 
			if (!$box.hasClass('gwa-closed')) {
				$boxContent.css('display','block');
				$boxContent.slideUp();
				$box.addClass('gwa-closed');
			} else {
				
				$boxContent.slideDown(function(){ });
				$box.removeClass('gwa-closed');
			}
		});

		/* Select Help Mode */
		$goPricingAdmin.on('change', 'select[data-action="help"]', function() {
			$goPricingAdmin.find('.gwa-pcontent, .gwa-popup').attr('data-help', $(this).val());
			document.cookie='go_pricing[settings][help]['+userSettings.uid+']='+$(this).val();
		});
		
		/* Select Help Mode */
		$goPricingAdmin.on('change', 'select[data-action="tm-rows"]', function() {
			var $this =$(this), $parent = $goPricingAdmin.find('#go-pricing-table-manager');
			document.cookie='go_pricing[settings][tm-rows]['+userSettings.uid+']='+$(this).val();
			if ($this.val()==5) {
				$parent.addClass('gwa-thumbs-rows5');
				$parent.removeClass('gwa-thumbs-rows10');
			} else if ($this.val()==10) {
				$parent.addClass('gwa-thumbs-rows10');
				$parent.removeClass('gwa-thumbs-rows5');				
			} else {
				$parent.removeClass('gwa-thumbs-rows5');
				$parent.removeClass('gwa-thumbs-rows10');
			}
			loadThumbInview();			
		});		
		
		
		/* Set Top Bar */
		function setTopBar() {
			var $topBar = $goPricingAdmin.find('.gwa-ptopbar');
			$topBar.css('width', $('#wpcontent').width()-22);

			if ( $(document).scrollTop() >=20 ) {
				$topBar.css({ 'top' : 32, 'box-shadow' : '0 2px 5px -2px rgba(0,0,0,0.1)' });
			} else {
				$topBar.css({ 'top' : -47, 'box-shadow' : '0 2px 5px -2px rgba(0,0,0,0)' });
				hideAjaxMsg();
			};

		};		
				
		$(window).on('scroll resize', function() { setTopBar(); });		
		
		/* Site loader */
		function setLoader() {
			var $siteLoader = $goPricingAdmin.find('.gwa-site-loader');
			$siteLoader.css('width', $wpContent.width()-22);
		};	
		
		setLoader();
		$(window).on('scroll resize', function() { setLoader(); });
		
		function showLoader(pageEffect, fullScreen) {
			var $siteLoader = $goPricingAdmin.find('.gwa-site-loader');

			$siteLoader.addClass('gwa-show');			
			if (pageEffect===true) $goPricingAdmin.addClass('gwa-loading');
			
			if ($goPricingAdmin.find('#gwa-popup-wrap').length || fullScreen===true) {
				$siteLoader.addClass('gwa-site-loader-fullwidth');
			} else {
				$siteLoader.removeClass('gwa-site-loader-fullwidth');
			}

		};
		
		function hideLoader() {
			var $siteLoader = $goPricingAdmin.find('.gwa-site-loader');

			$siteLoader.removeClass('gwa-show');
			$goPricingAdmin.removeClass('gwa-loading');

		};		
		

		/* Ajax Notification */
		var ajaxMsgTimeout = false;
		function showAjaxMsg(message, type) {			

			if (typeof message === 'undefined') return;
			if (typeof type === 'undefined') type = 'updated';
			
			var $msg = $('.gwa-ajaxmsg'),
				hasMsg = $msg.length  ? true : false,
				$newMsg = createAjaxMsg(message, type);

			$goPricingAdmin.find('.gwa-ptopbar').append($newMsg);
			
			if (hasMsg) {
				$msg.remove();
				$newMsg.addClass('.gwa-notrans').css({ 'opacity' : 1, 'marginTop' : 0 });
			} else {
				setTimeout(function(){
					$newMsg.css({ 'opacity' : 1, 'marginTop' : 0 });				
				},150);
			}
			clearTimeout(ajaxMsgTimeout);
			ajaxMsgTimeout = setTimeout(function(){
				hideAjaxMsg();
			},5000);														
			
		}
		
		function hideAjaxMsg() {
			var $msg = $('.gwa-ajaxmsg');
			$msg.removeClass('.gwa-notrans').css('opacity', 0);
			setTimeout(function() { $msg.remove(); }, 150);	
		}
		function createAjaxMsg(message, type) {
			if (typeof message === 'undefined') return;
			if (typeof type === 'undefined') type = 'updated';
			
			var msgClass = '',
				msgIcon = '';			
			
			if (type == 'updated') {
				msgClass = 'gwa-ajaxmsg-updated';
				msgIcon = 'fa fa-check';
			} else if ( type == 'error' ) {
				msgClass = 'gwa-ajaxmsg-error';
				msgIcon = 'fa fa-exclamation-triangle';					
			} else if ( type == 'info' ) {
				msgClass = 'gwa-ajaxmsg-info';
				msgIcon = 'fa fa-info-circle';					
			};
			
			return $('<div />', { 'class' : 'gwa-ajaxmsg ' + msgClass, 'html' : '<div class="gwa-ajaxmsg-content"><div class="gwa-ajaxmsg-icon"><i class="'+msgIcon+'"></i></div>'+message+'<a href="#" class="gwa-ajaxmsg-close"></a></div>' });
								
		}
		
		$goPricingAdmin.on('click', '.gwa-ajaxmsg-close', function(e) {
			e.preventDefault();
			clearTimeout(ajaxMsgTimeout);
			hideAjaxMsg();
		});		
		

		/* Table Manager */

		/* Search table name */
		function seachTable($elem) {
			if (!$elem) return; 
			var $parent = $elem.closest('.gwa-search-input'), 
				$input = $parent.find('input[type="text"]'),
				$label = $parent.find('span'),
				$assets = $goPricingAdmin.find('.gwa-search-assets');
				$filter = $goPricingAdmin.find('[data-action="tm-filter-skin"]');
				thumbCnt = 0;

			$goPricingAdmin.find('#go-pricing-table-manager').find('.gwa-thumb').not('.gwa-thumb-new').each(function(index, element) {		
				if ($(element).find('.gwa-thumb-title').text().toLowerCase().indexOf($input.val().toLowerCase()) == -1 && $(element).find('.gwa-thumb-title').data('id').indexOf($input.val().toLowerCase()) == -1 || ( $filter.val() != $(element).data('style') && $filter.val() != '' ) ) {	
					$(element).hide();
				} else {
					$(element).show();
					thumbCnt++;					
				};
			});
			
			if ($input.val() == '' && $filter.val() == '') { 
				$assets.hide();
			} else {
				$assets.show();
			}
			$assets.find('span').text('('+thumbCnt+')');						
			loadThumbInview();
		};
		
		$goPricingAdmin.on('keydown','[data-action="tm-search"] input[type="text"]', function(e) {
			var code = e.keyCode || e.which;
			if (code==13) {
				seachTable($(this));
				return false;
			};
		});

		$goPricingAdmin.on('click','[data-action="tm-search"] a', function(e) {
			seachTable($(this));
			e.preventDefault();
		});
		
		$goPricingAdmin.on('change','[data-action="tm-filter-skin"]', function(e) {
			$goPricingAdmin.find('[data-action="tm-search"] a').trigger('click');
		});
		
		$goPricingAdmin.on('click','[data-action="tm-search-reset"]', function(e) {
			$goPricingAdmin.find('[data-action="tm-search"] input[type="text"]').val('');
			$goPricingAdmin.find('[data-action="tm-filter-skin"]').prop('selectedIndex',0);	
			$goPricingAdmin.find('[data-action="tm-search"] a').trigger('click');					
			e.preventDefault();
		});
		
		/* Select thumbnail number of rows to show */
		if (typeof $goPricingAdmin.data('settings') != undefined || !$goPricingAdmin.data('settings').hasOwnProperty('tm-max-rows')) {
			$goPricingAdmin.data('settings', $.extend( $goPricingAdmin.data('settings'), { 'tm-max-rows' : 3 }));
			setTimeout(function() { 
				$goPricingAdmin.find('[data-id="tm-max-rows"]').val($goPricingAdmin.data('settings')['tm-max-rows']).trigger('change');
			}, 5);
		};

		$goPricingAdmin.on('change','#go-pricing-table-manager [data-id="tm-max-rows"]', function() {
			var $this = $(this), $parent = $goPricingAdmin.find('#go-pricing-table-manager');
			if ($this.val() == 5) {
				$parent.addClass('gwa-thumbs-rows5').removeClass('gwa-thumbs-rows10');
			} else if ($this.val() == 10) {
				$parent.addClass('gwa-thumbs-rows10').removeClass('gwa-thumbs-rows5');
			} else {
				$parent.removeClass('gwa-thumbs-rows10').removeClass('gwa-thumbs-rows5');
			}
		});		
		
		/* Function to load thumbnail image */
		function loadThumbInview() {
			var $parent = $goPricingAdmin.find('#go-pricing-table-manager .gwa-thumbs'),
				parentOffset = $parent.offset(),
				parentHeight = $parent.outerHeight();
			
			if (!$parent.length) return;
			
			if ($parent.length) {	
				$goPricingAdmin.find('.gwa-thumb').each(function(index, element) {
					var thumbOffset = $(element).offset(),
						$thumbMedia = $(element).find('.gwa-thumb-media'),
						thumbSrc = $thumbMedia.data('src')
					
					if (thumbOffset.top < parentOffset.top+parentHeight && typeof $(element).data('loading') == 'undefined' && typeof thumbSrc != 'undefined' && !$(element).hasClass('.gwa-thumb-new')) {
						$(element).data('loading', true)
						var thumbImg = new Image;
						thumbImg.onload=function(){
							$('<img>', { src : thumbImg.src }).appendTo($thumbMedia);
							if (!$(element).find('img').hasClass('gwa-visible')) setTimeout(function() { $(element).find('img').addClass('gwa-visible'); },5);
						}
						thumbImg.onerror=function(){ }
						thumbImg.src=thumbSrc;
						
						if (thumbOffset.top < 0) $(element).find('img').addClass('gwa-visible');					


						setTimeout(function(){ 
							$(element).css({ 'opacity' : 1, 'top': 0 })
						},100*index);


					} else {
						$(element).css({ 'opacity' : 1, 'top': 0 })					
					}
					
					
				});
				
				$('.gwa-thumbs-assets').css('right',$goPricingAdmin.find('.gwa-thumbs').outerWidth()-$goPricingAdmin.find('.gwa-thumbs')[0].scrollWidth);

			};
		};
		
		loadThumbInview();
		
		/* Load thumbs on scroll and resize event */
		$(window).on('scroll',function() { 
		
			if ($goPricingAdmin.find('#go-pricing-table-manager').length) {
								
				if ($(document).scrollTop()-$('#go-pricing-table-manager').offset().top>=0 && $(document).scrollTop()-$('#go-pricing-table-manager').offset().top-$('.gwa-thumbs').outerHeight()+$('.gwa-thumbs-assets').outerHeight()+20<-20) {
					$('.gwa-thumbs-assets').css({'top': $(document).scrollTop()-$('#go-pricing-table-manager').offset().top});
				} else if ($(document).scrollTop()-$('#go-pricing-table-manager').offset().top-$('.gwa-thumbs').outerHeight()+$('.gwa-thumbs-assets').outerHeight()+20>=-20) {
					$('.gwa-thumbs-assets').css({'top': $('.gwa-thumbs-inner').height()-$('.gwa-thumbs-assets').outerHeight()-20});
				} else if ($(document).scrollTop()-$('#go-pricing-table-manager').offset().top<0) { 
					$('.gwa-thumbs-assets').css({'top': 0});
				}
				
			}
				

		});
		
		$goPricingAdmin.find('#go-pricing-table-manager .gwa-thumbs').on('scroll',function() {  loadThumbInview(); });
		$(window).on('resize', function() { loadThumbInview(); });			
		
		function getThumbIndex() {
			$goPricingAdmin.find('#go-pricing-table-manager .gwa-thumb').each(function(index, element) {
				$(element).data('index', index);
			});
		};
		
		getThumbIndex();
		
		/* Function to select & unselect thumbnails */
		function selectThumbs(i, deselect, inverse) {
			var $aBox= $goPricingAdmin.find('#go-pricing-table-manager'),
				$thumbs = $goPricingAdmin.find('#go-pricing-table-manager .gwa-thumb').not('.gwa-thumb-new'), 
				$visibleThumbs = $thumbs.filter(':visible');
				$selectedThumbs = $thumbs.filter('.gwa-current'),
				selectedCnt = $selectedThumbs.length;
				
			if (i == undefined && $visibleThumbs.length != $selectedThumbs.length) {
				$visibleThumbs.data('selected', true);
				selectedCnt == $visibleThumbs.length;
			} else if (i == undefined || i == -1) {
				$thumbs.removeData('selected');
				selectedCnt == 0;
			} else {
				i = i+''; /* convert to string */
				var selection = i.split(',');
			}
			$thumbs.each(function(index, element) {
				if ($.inArray(index+'',selection)!=-1) { 
					if (deselect===true) {
						$(element).removeData('selected');
					} else {
						$(element).data('selected', true);
					}
				} else if (inverse===true) {
					$(element).removeData('selected');		
				};
			});
			var selected = [];							
			$thumbs.each(function(index, element) {		
				if (typeof $(element).data('selected') !== "undefined") { 
					selected.push($(element).closest('.gwa-thumb').data('id'));
					$(element).addClass('gwa-current');
				} else {
					$(element).removeClass('gwa-current');
				}
			});
			
			$goPricingAdmin.find('#go-pricing-tm-select').val(selected.join(','));		
		};		
		
		/* Thumbnail hover */	
		$goPricingAdmin.on('mouseenter mouseleave focusin focusout', '#go-pricing-table-manager .gwa-thumb', function(e) {
			var $this = $(this), 
				$parent = $this.closest('.gwa-thumbs'),
				selectedLinkCnt = $parent.find('.gwa-thumb').filter(function() { return typeof $(this).data('selected') !== "undefined" }).length;
			
			if (e.type=='mouseenter' || e.type=='focusin') {
				if (e.type=='mouseenter') $('#go-pricing-table-manager .gwa-thumb').find('.gwa-assets-nav').removeClass('gwa-show');
				
			if (selectedLinkCnt<=1) {
				if (e.type=='mouseenter') $this.find('.gwa-assets-nav').addClass('gwa-show');
			}				
				
				$this.addClass('gwa-current');

			} else if (e.type=='mouseleave' || e.type=='focusout') {
				if (typeof $this.data('selected') === "undefined") {
					$this.removeClass('gwa-current');
					$this.find('.gwa-assets-nav').removeClass('gwa-show');
				}
				if (e.type=='mouseleave') $this.find('.gwa-assets-nav').removeClass('gwa-show');
				
			} 
						
		});
		
		/* Keydown handler for multi select */
		var shiftPressed = false,
			ctrlPressed = false;
		
		$(document).delegate(this, 'keydown keyup', function(e) {
			
			var code = e.keyCode || e.which;			
			if (e.type == 'keydown') {
				if(code == 17) { ctrlPressed = true; }
				if(code == 16) { shiftPressed = true; }	
				if(code == 46) { $goPricingAdmin.find('.gwa-assets-nav.gwa-show a[data-action="delete"]').trigger('click'); }	
							
			} else {
				if(code == 17) { ctrlPressed = false; }
				if(code == 16) { shiftPressed = false; }							
			};
			
		});			
		
		/* Thumbnail (multi) select */
		$goPricingAdmin.on('dblclick click keydown', '.gwa-thumb', function(e) {
			var $this = $(this), 
				$parent = $this.closest('.gwa-thumbs'),
				currentIndex = $this.data('index'),
				thumbCnt = $parent.find('.gwa-thumb-link').length,
				selectedCnt = 0, selected = [], hidden = [], minIndex, maxIndex;

			if (e.type == 'keydown') { 
				var code = e.keyCode || e.which;
				if (code!=32 && code!=13) return;
				$('#go-pricing-table-manager .gwa-thumb').find('.gwa-assets-nav').removeClass('gwa-show');
				$this.trigger('click');
				if (code==13) $this.trigger('dblclick');
				return false;
			} 

			if (e.type == 'dblclick') { 
				$this.find('.gwa-assets-nav a[data-action="edit"]').trigger('click');
			}

			if (thumbCnt>1 && currentIndex < thumbCnt-1) {
				if (typeof $this.data('selected') === "undefined") {
					if (!ctrlPressed && !shiftPressed ) { 
						selectThumbs(currentIndex, false, true);
					} else {
						selectThumbs(currentIndex);
					}
				} else {
					if (!ctrlPressed && !shiftPressed ) { 
						selectThumbs(currentIndex, false, true);
						$parent.find('.gwa-thumb').eq(currentIndex).trigger('mouseenter');	
					} else {
						selectThumbs(currentIndex, true);
						
					}					
							
				}
			} else if ( thumbCnt>1 ) { selectThumbs(-1);  }
			
			$parent.find('.gwa-thumb').each(function(index, element) {
				if (typeof $(element).data('selected') !== "undefined") { selected.push(index); };
				if ($(element).closest('.gwa-thumb').is(':visible')) { hidden.push(index); };
			});

			selectedCnt = selected.length;
			if (selectedCnt>=1 && shiftPressed) { 
				minIndex = selected[0];
				maxIndex = selected[selectedCnt-1];			
				for (var i=minIndex; i<maxIndex+1; i++) {
					if ($.inArray(i,hidden)!=-1) { 
						selected.push(i);
					};
				};
				selectThumbs(selected.join(','));							
			};
			if (selectedCnt>1) { 
				$parent.find('.gwa-assets-nav').removeClass('gwa-show');
				$parent.closest('.gwa-abox-content').find('.gwa-thumbs-assets').addClass('gwa-show');
				$(window).trigger('scroll');
			} else {
				$parent.find('.gwa-thumb.gwa-current').find('.gwa-assets-nav').addClass('gwa-show');
				$parent.closest('.gwa-abox-content').find('.gwa-thumbs-assets').removeClass('gwa-show');				
			}
			
		});	
		
		$goPricingAdmin.on('click', '.gwa-thumb-link', function(e) {
			if (!$(this).closest('.gwa-thumb-new').length) {
				e.preventDefault();
			}			
		});

		/* Remove thumb clicked state */
		$goPricingAdmin.on('click', this, function(e){
			if (!$(e.target).closest('.gwa-thumb').length && !$(e.target).closest('.gwa-thumbs-assets').length) {
				$goPricingAdmin.find('.gwa-thumbs-assets').removeClass('gwa-show');	
				selectThumbs(-1);
			}
		});
				
		/* Show & hide thumb assets */
		$goPricingAdmin.on('mouseenter mouseleave', '.gwa-assets-nav a', function(e) {
			var $this = $(this);	
			if (e.type=='mouseenter') {
				$this.find('span').css('opacity',1).end().siblings().find('span').css('opacity',0.35)
			} else if (e.type=='mouseleave') {
				$this.siblings().find('span').css('opacity',1)
			};
		});
		
		/* Show assets */
		$goPricingAdmin.on('click', '.gwa-thumb .gwa-assets-nav a', function(e) {
			selectThumbs($(this).closest('.gwa-thumb').data('index'), false, true)
		});
		
		$goPricingAdmin.on('click change', '[data-action]', function(e) {
			
			var $this = $(this), 
				$form = $this.closest('.gwa-wrap').find('form'), 
				$actionType = $form.find('#action-type');
			
			
				
			if ($goPricingAdmin.find('#go-pricing-table-manager').length) {
			
				
				if (typeof $this.data('action') !== 'undefined') {		
					if ($this.data('action')=='create') { 
						$actionType.val('create');
						$form.find('#go-pricing-tm-select').val('');
						$form.submit();
					}
					if ($this.data('action')=='edit') { 
						$actionType.val('edit');
						$form.submit();
					}
					if ($this.data('action')=='clone') {
						if (confirm($this.data('confirm'))) { 
							$actionType.val('copy');			
							$form.submit();
						}
					}				
					if ($this.data('action')=='delete') { 
						if (confirm($this.data('confirm'))) {
							$actionType.val('delete');			
							$form.submit();
						}
					}
					if ($this.data('action')=='order') {
						if (this.tagName.toLowerCase()=='select' && e.type == 'change') {
							$actionType.val('order');			
							$form.submit();
						}
					}					
					if ($this.data('action')=="select") { selectThumbs(); }		
	
				}
			
			}

			if ($this.data('action')=="submit") $form.submit();
			
			e.preventDefault();
		});		
		
		/* Page Submit */
		
		var ajaxRq = null;
		$goPricingAdmin.on('submit', '#go-pricing-form', function(e) {
									
			var $this=$(this), $box = $this.closest('.gwa-pcontent');
				/*$this.find('*:focus').trigger('blur');*/
				formName = typeof $this.attr('name') !== 'undefined' ? $this.attr('name') : null, 
				ajaxEnabled = typeof $box.data('ajax') !== 'undefined' && $box.data('ajax') === true ? true : false;
				
			
			if (ajaxEnabled === true ) showLoader(true);

			if (!formName || !ajaxEnabled) return;
			
			/* Page specific codes */
			
			/* Table manager page */
			if (formName == "tm-form") {
				var $action_type=$this.find('[name="_action_type"]');
				if ( $action_type.length && ( $action_type.val() != "copy" && $action_type.val() != "delete" && $action_type.val() != "order" ) ) return;
			}			
			
			/* Table editor page */
			if (formName  == "te-form") {
				$goPricingAdmin.find('.go-pricing-col').each(function(index, element) {
				});
			}
		
			ajaxRq = $.ajax({  
				type: 'post',
				url: ajaxurl, 
				data: $.param({ action: 'go_pricing_ajax_action' })+'&'+$this.serialize(),
				beforeSend: function () { }
			}).always(function() {
				hideLoader();
				$goPricingAdmin.find('#result').remove();
			}).fail(function(jqXHR, textStatus) {
				showAjaxMsg('<p><strong>'+$goPricingAdmin.data('ajaxerror')+'</strong></p>', 'error');					
			}).done(function(data) {

				var $ajaxResponse=$('<div />', { 'class':'ajax-response', 'html' : data });
				
				/* Page specific codes */
				
				/* Table manager page */
				if (formName == "tm-form") {
					if ( $ajaxResponse.find('.gwa-thumbs').length ) {
						$goPricingAdmin.find('.gwa-thumbs').html( $ajaxResponse.find('.gwa-thumbs').html() );
						$goPricingAdmin.find('.gwa-thumbs-assets').removeClass('gwa-show');
						$goPricingAdmin.find('.gwa-thumb').addClass('.gwa-notrans').css({ 'opacity' : 1, 'top': 0 })
						/* ?? */ $goPricingAdmin.find('#go-pricing-table-manager .gwa-abox-content-header-cell-left').html($ajaxResponse.find('#go-pricing-table-manager .gwa-abox-content-header-cell-left').html());
						$goPricingAdmin.find('#go-pricing-table-manager .gwa-abox-title .gwa-info').html( $ajaxResponse.find('#go-pricing-table-manager .gwa-abox-title .gwa-info').html());
						getThumbIndex();
						loadThumbInview();
					};
					
				}
				
				if (formName == "te-form") {
					
					if ($ajaxResponse.find('#postid').length && !$goPricingAdmin.find('[name="postid"]').length) {	
						$this.prepend('<input type="hidden" name="postid" value="'+$ajaxResponse.find('#postid').text()+'">');
						$goPricingAdmin.find('[data-popup="live-preview-edit"]').data('id', $ajaxResponse.find('#postid').text());
						$goPricingAdmin.find('[data-popup="live-preview-edit"]').data('popup-subtitle', $goPricingAdmin.find('[name="name"]').val());
						$goPricingAdmin.find('[data-popup="live-preview-edit"]').data('alert', '');
									
						if (window.history.replaceState) {
							history.replaceState({
								content: $('form').html()+'-',
								form: 'go-pricing-form'						
							}, document.title, window.location.search.split('&')[0]+'&action=edit&id='+$ajaxResponse.find('#postid').text());
							
		
						};
					};
					
				};
	
				if (formName == "import-form" || formName == "impex-form") {
					
					if ( $ajaxResponse.find('.gwa-pcontent').length ) {
						$('.gwa-wrap').find('.gwa-pcontent').html( $ajaxResponse.find('.gwa-pcontent').html() )
					}
					if ( $ajaxResponse.find('.gwa-ptopbar').length ) {
						$('.gwa-wrap').find('.gwa-ptopbar').html( $ajaxResponse.find('.gwa-ptopbar').html() )
					}										
					$goPricingAdmin.find('select').trigger('change');
				};
				
				if ( $ajaxResponse.find('#result').length && typeof $ajaxResponse.find('#result')[0].className !== "undefined" ) {
					showAjaxMsg($ajaxResponse.find('#result').html(), $ajaxResponse.find('#result')[0].className);
					console.log($ajaxResponse.find('#result').html())
					console.log($ajaxResponse.find('#result')[0].className)					
				};				
				
			
			});
					
			return false;
			
		});

		function setColWidth(width) {
			
			var $editor = $goPricingAdmin.find('#go-pricing-column-editor'),
				$cols = $editor.find('.go-pricing-col'),
			    colWidth = width !== undefined ? width : 0;
			
			if (width === undefined) {
				for (var x=0; x < $cols.length; x++) {
					var $elem = $cols.eq(x);
					colWidth += $elem.outerWidth(true);	
				}
			}
			
			$cols.closest('.go-pricing-cols').css('width',colWidth+290);

							
		}

		function setColIndex() {
			var $editor = $goPricingAdmin.find('#go-pricing-column-editor'),
				$cols = $editor.find('.go-pricing-col'),
			    colWidth = 0;
			
			for (var x=0; x < $cols.length; x++) {
				var $elem = $cols.eq(x);
					
				colWidth += $elem.outerWidth(true);				
				$elem.data('index', x).find('.go-pricing-col-index').html('#'+(x+1)).end().find('div.go-pricing-col-index').val(x);
				
				var $inputs = $elem.find('[name*="col-data"], [data-parent-id*="col-data"]');
				
				for (var z=0; z < $inputs.length; z++) {
					var	el = $inputs[z];
					if (el.type !== undefined) { 
						el.setAttribute('name', el.getAttribute('name').replace(/col-data\[([0-9]+)?\]/g, 'col-data['+x+']'));
					} else {
						el.setAttribute('data-parent-id', el.getAttribute('data-parent-id').replace(/col-data\[([0-9]+)?\]/g, 'col-data['+x+']'));
					}
				}
								
			}
			
			setColWidth(colWidth);

			
		};
		
		
		
		function setSortableCols() {
			if (typeof jQuery().sortable !== 'undefined') {
				var $colsParent = $goPricingAdmin.find('#go-pricing-column-editor').find('.go-pricing-cols');
				$colsParent.sortable({
					axis: 'x',
					revert: 100,
					items: '.go-pricing-col',
					distance: 5,
					handle: '.gwa-abox-header',
					scrollSpeed: 30,
					scrollSensitivity: 50,
					placeholder: 'go-pricing-col-placeholder',
					tolerance: 'pointer',
					start: function( event, ui ) { 
						ui.item.closest('.go-pricing-cols').css('height', ui.item.outerHeight(true))
						ui.item.siblings('.go-pricing-col').css('opacity',0.5)
						ui.item.next().css('height',ui.item.height()-10); 
						
					},
					stop: function( event, ui ) { ui.item.siblings().css('opacity',1) },
					update: function( event, ui ) { 
						setColIndex();
						$(document).trigger('click');
						ui.item.closest('.go-pricing-cols').css('height', 'auto')
					}				
				});	
			};			
		};
		
		function setSytle($elem) {
			
			var mainparent = $goPricingAdmin.find('.go-pricing-cols');
			var html2=[];
			if ($elem === undefined) {
				$elem = $goPricingAdmin.find('select[name*="[col-style-type]"]');
			}
			
			for (var x=0; x < $elem.length; x++) {
				var $el = $elem.eq(x),
					el = $elem[x],
					$parentCol = $el.closest('.go-pricing-col');
					index = el.selectedIndex,
					styleType = $el.find('option').eq(index).data('type');
				
				if (typeof styleType === 'undefined') return;
					
				$parentCol.find('.go-pricing-style-type').filter(function(index) {
					var types = this.getAttribute('data-type').split(' '),
						inArr=false;
						
					for (var x=0; x< types.length; x++) {
						if (types[x] == styleType) inArr = true;
					}
					
					if (inArr===true) { this.style.display = 'block'; } else { this.style.display = 'none';  }

				});
								
			}
			

		};
		
		$goPricingAdmin.on('click', '.gwa-textarea-align a', function(e) {
			var $this = $(this), $input = $this.closest('.gwa-textarea-align').find('input');
			if (typeof $this.data('align') !== 'undefined') {
				$this.siblings().removeClass('gwa-current').end().addClass('gwa-current');
				$input.val($this.data('align'));
			}
			e.preventDefault();
			
		});
		
		$goPricingAdmin.on('change', 'select[name*="[col-style-type]"]', function(e) {
			var foo ='[data-parent-id="'+this.name+'"][data-parent-value="'+this.value+'"] select'
			$(this).closest('.go-pricing-col').find(foo).trigger('change', true);
		});

		$goPricingAdmin.on('change', 'select[name*="[col-style-type]"]', function(e, force) {
			var $this = $(this), $parentCol = $this.closest('.go-pricing-col'), family = $parentCol.find('select[name="col-style-family"]').val();
			if (($this).is(':visible') || force === true) setSytle($this);
		});
		
		
		$goPricingAdmin.on('click', '.go-pricing-col', function(e) {
			if ($goPricingAdmin.find('#go-pricing-column-editor').data('ready') === undefined) {
				$goPricingAdmin.find('#go-pricing-column-editor').data('ready',true)
			} 
		});

		setSytle();
		


		
		/* Delete, Clone & Expand column */
		$goPricingAdmin.on('click', '[data-action="delete-col"], [data-action="clone-col"], [data-action="expand-col"]', function(e) {
			var $this = $(this), $parentCol = $this.closest('.go-pricing-col');
			if ($this.data('action')=="delete-col") {
				if (confirm($this.data('confirm'))){
					$this.closest('.go-pricing-col').remove();
					setColIndex();
				};	
			} else if ($this.data('action')=="clone-col") {
				if (confirm($this.data('confirm'))){
					$newCol=$parentCol.clone().insertAfter($parentCol);
					$newCol.find('select, textarea').each(function(index, element) {
						$(element).val($parentCol.find('select, textarea').eq(index).val())
					});
					setColIndex();
				};					
			} else if ($this.data('action')=="expand-col") {
				if ($parentCol.find('.gwa-abox.gwa-closed').length) {
					$parentCol.find('.gwa-abox.gwa-closed').find('.gwa-abox-header').trigger('click');
				} else {
					$parentCol.find('.gwa-abox').find('.gwa-abox-header').trigger('click');
				}
			};
			e.preventDefault();
		});		
		
		/* Add new column */
		var editorParams = {};
		
		$goPricingAdmin.on('change', '#go-pricing-style', function(e) {
			editorParams['style'] = this.value;
			reloadEditor();
			hideEditorPopup();
		});
		
		function reloadEditor() {
		
				if (!$goPricingAdmin.find('.go-pricing-col').length) return;
		
				$.ajax({  
					type: 'post',
					url: ajaxurl, 
					data: $.param({ action: 'go_pricing_ajax_action', _action :'editor_columns', _nonce : $goPricingAdmin.find('form').find("#_nonce").val(), postid : ( $goPricingAdmin.find('[name="postid"]').length ? $goPricingAdmin.find('[name="postid"]').val() : null ), param : editorParams }),
					beforeSend: function () {
						showLoader(true);
					}
				}).always(function() {
					hideLoader();
				}).fail(function(jqXHR, textStatus) {
					
				}).done(function(data) {
					$goPricingAdmin.find('.go-pricing-col').remove();
					$(data).insertBefore($goPricingAdmin.find('.go-pricing-col-new'));
					setColIndex();
					setSytle();
				});			
			
		}
		
		$goPricingAdmin.on('mouseenter mouseleave click', '.go-pricing-col-new', function(e) {
			var $this = $(this), 
				$cols = $(this).closest('.go-pricing-cols').find('.go-pricing-col');
				
			if (e.type=='mouseenter') {
				 $this.addClass('gwa-current');
			} else if (e.type=='mouseleave') {
				$this.removeClass('gwa-current');
			} else {
				if ($cols.length==10) {
					alert( 'You have reached the maximum number of columns');
					return;
				}
				$this.data('param', editorParams);
				showLoader();
				$goPricingAdmin.addClass('gwa-loading');
				$.ajax({  
					type: 'post',
					url: ajaxurl, 
					data: $.param({ action: 'go_pricing_ajax_action', _action :'table_column', _nonce : $this.closest('form').find("#_nonce").val(), param : $this.data('param') }),
					beforeSend: function () {
						showLoader(true);
					}
				}).always(function() {
					hideLoader();
				}).fail(function(jqXHR, textStatus) {
					
				}).done(function(data) {
					$(data).insertBefore($this);
					setColIndex();
					setSortableCols();
					setSytle();
				});			
				e.preventDefault();	
			};
		});
		
		/* Rows & Buttons */
		function setSortableRowsBtns() {
			if (typeof jQuery().sortable !== 'undefined') {
				var $colsParent = $goPricingAdmin.find('#go-pricing-column-editor .go-pricing-cols');

				$goPricingAdmin.find('#go-pricing-column-editor').find('.gwa-col-box-wrap').each(function(index, element) {
				$(element).sortable({
					axis: 'y',
					revert: 100,
					items: '.gwa-col-box',
					distance: 5,
					placeholder: 'gwa-col-box-placeholder',
					tolerance: 'pointer',
					start: function( event, ui ) { 
						ui.item.next().css('height',ui.item.height()); 
						ui.item.siblings('.gwa-col-box').css('opacity',0.5)
					},
					beforeStop: function( event, ui ) {
					},
					stop: function( event, ui ) {
						ui.item.siblings().css('opacity',1)
					},
					update: function( event, ui ) {
						$(document).trigger('click');
						setColRowBtnIndex($(element));
					}				
				});
				});
	
			};			
		};

		$goPricingAdmin.on('click', '.go-pricing-col', function() {
			
			setSortableRowsBtns2($(this))
			
		});


		function setSortableRowsBtns2($col) {
			if (typeof jQuery().sortable !== 'undefined') {
				 $col.find('.gwa-col-box-wrap').not('.ui-sortable').each(function(index, element) {
				$(element).sortable({
					axis: 'y',
					revert: 100,
					items: '.gwa-col-box',
					distance: 5,
					placeholder: 'gwa-col-box-placeholder',
					tolerance: 'pointer',
					start: function( event, ui ) { 
						ui.placeholder.css('height',ui.item.outerHeight()); 
						ui.item.siblings('.gwa-col-box').css('opacity',0.5)
					},
					beforeStop: function( event, ui ) {
					},
					stop: function( event, ui ) {
						ui.item.addClass('gwa-notrans').css('background', '#e4f5ff');
						ui.item.siblings().css('opacity',1)
						setTimeout(function() { 
							ui.item.removeClass('gwa-notrans').css('background','#fff');
						}, 10);	
					},
					update: function( event, ui ) {
						$(document).trigger('click');
						setColRowBtnIndex($(element));
						if ($currentElem !== undefined && $('#gwa-editor-popup-wrap').length) {
							$('#gwa-editor-popup-wrap').find('.gwa-popup-title span').eq(0).html($currentElem.find('.gwa-col-box-title span').eq(0).html())
						}						
						setEditorPopupNav();
					}				
				});
				});
	
			};			
		};

		function setColRowBtnIndex($wrap) {
			$wrap.find('.gwa-col-box').each(function(index, element) {
				$(element).find('.gwa-col-box-title span[data="index"]').html(index+1);
				$(element).find('[name*="col-data"], [data-parent-id*="col-data"]').each(function(i, elem) {
					if (elem.type !== undefined) {
						$(elem).attr('name', $(elem).attr('name').replace(/-row\]\[([0-9]+)\]/g, '-row]['+(index)+']'))
					} else {
						$(elem).attr('data-parent-id', $(elem).attr('data-parent-id').replace(/-row\]\[([0-9]+)\]/g, '-row]['+(index)+']'))
					}
				});
			});
			
		}

		/* Add, Remove, Clone row & button */	
		$goPricingAdmin.on('click', '[data-action="delete-row"], [data-action="clone-row"], [data-action="add-row"], [data-action="delete-footer-row"], [data-action="clone-footer-row"], [data-action="add-footer-row"]', function(e) {
			var $this = $(this), $parentBox = $this.closest('.gwa-col-box'), $parentBoxWrap = $this.closest('.gwa-abox-content').find('.gwa-col-box-wrap');
			
			if ($this.data('action')=="delete-row" || $this.data('action')=="delete-footer-row") {
				if ($this.data('confirm') !== undefined && $this.data('confirm') != '') {
					if (!confirm($this.data('confirm'))) return;
				}				
				$parentBox.remove();
				setColRowBtnIndex($parentBoxWrap);
				setEditorPopupNav();
				hideEditorPopup();
			} else if ($this.data('action')=="clone-row" || $this.data('action')=="clone-footer-row") {
				var $newBox = $parentBox.clone().insertAfter($parentBox);
				$newBox.find('select, textarea, input[type="hidden"]').each(function(index, element) {
					$(element).val($parentBox.find('select, textarea, input[type="hidden"]').eq(index).val())
				});
				$newBox.css('background', '#e4f5ff');
				$newBox.removeClass('gwa-current').data('selected', false).find('.gwa-assets-nav').removeClass('gwa-visible');
				setTimeout(function() { 
					$newBox.css('background', '#fff');
				}, 10);				
				setColRowBtnIndex($parentBoxWrap);
				$newBox.find('.gwa-assets-nav a').trigger('mouseleave');
				setEditorPopupNav();
				
			} else if ($this.data('action')=="add-row" || $this.data('action')=="add-footer-row") {
				var currentAction = $this.data('action')=='add-row' ? 'table_row' : 'table_button';
				$.ajax({  
					type: 'post',
					url: ajaxurl, 
					data: $.param({ action: 'go_pricing_ajax_action', _action : currentAction, _nonce : $this.closest('form').find("#_nonce").val(), col_index : $this.closest('.go-pricing-col').data('index') }),
					beforeSend: function () {
						showLoader(true);
					}
				}).always(function() {
					hideLoader();
				}).fail(function(jqXHR, textStatus) {
					
				}).done(function(data) {
					var $response = $('<div />', { 'html' : data });
					$response.find('.gwa-col-box').css('background', '#e4f5ff').appendTo($parentBoxWrap);
					setTimeout(function() { 
						$parentBoxWrap.find('.gwa-col-box:last').css('background', '#fff');
					}, 10);		
					setColRowBtnIndex($parentBoxWrap);
					setColIndex();
					setEditorPopupNav();
				});
							
				e.preventDefault();					
			}
			
		});
		


		function showHideChilds($elem) {
			if (typeof $elem =='undefined' || typeof $elem.attr('name') =='undefined' ) return;
			var $parent = $elem.closest('.gwa-col-box-content').length != 0 ? $elem.closest('.gwa-col-box-content') : $elem.closest('.gwa-abox-content'),
				parentId ='[data-parent-id~="'+$elem.attr('name').split('[]')[0]+'"]',
				parentValue = '[data-parent-value~="'+$elem.val()+'"]';
				if ($elem.val() != '') parentValue += ', [data-parent-value="*"]'+parentId;
			
			$parent.find(parentId).hide();
			if ($elem.is(':visible')) { $parent.find(parentId+parentValue).show(); };
			$parent.find(parentId).find('select').each(function(index, element) {
				showHideChilds($(element))
			});			
		}


		$goPricingAdmin.on('change', 'select', function(e) {
			showHideChilds($(this));
		});

		/* new */		
		$goPricingAdmin.on('click', '.gwa-img-upload-media-remove', function(e) {
			var $this = $(this), 
				$parent = $this.closest('.gwa-img-upload'),
				$input = $parent.find('input[type="text"]');
				$input.val($this.val());			
			
			if ($this.closest('.gwa-img-upload-media').find('span').length) $this.closest('.gwa-img-upload-media').find('.gwa-img-upload-media-popup').unwrap().remove();
			$this.closest('.gwa-img-upload-media').find('select').remove();
			$this.closest('.gwa-img-upload-media').css('display','none');
			$parent.find('.gwa-input-btn').show();			
			e.preventDefault();
		});
		
		$goPricingAdmin.on('change keydown', '.gwa-img-upload input[type="text"]', function(e) {
			var $this = $(this), 
				$parent = $this.closest('.gwa-img-upload');
				$media = $parent.find('.gwa-img-upload-media'),
				code = e.keyCode || e.which,
				result = 0;
				
				$media.find('select option').each(function(index, element) {
					if (element.value == $this.val()) result = 1;
				});
				
				if (result==0) $media.find('select').remove();
					
			if ((e.type == 'keydown' && code == 13) || e.type == 'change') {
				if ($this.val() != '') {
					var newImg = new Image;
					newImg.onload=function(){
						$media.css('display', 'block');
						$media.find('.gwa-img-upload-media-popup').remove();
						if (!$media.find('.gwa-img-upload-media-container').length) $media.find('a').wrapAll('<span class="gwa-img-upload-media-container"></span>');
						
						$('<a>', { 
							'href' : '#', 
							'title' : 'Preview',
							'class' : 'gwa-img-upload-media-popup', 
							'data-id' : newImg.src,
							'data-popup-type' : 'image',
							'data-action' : 'popup', 
							'data-popup' : 'image-preview',
							'data-popup-subtitle' : newImg.src
						}).wrap('span').prependTo($media.find('.gwa-img-upload-media-container'));
						$('<img>', { src : newImg.src }).wrap('span').prependTo($media.find('.gwa-img-upload-media-popup'));
						$parent.find('.gwa-input-btn').hide();
						
					}
					newImg.onerror=function(){ alert('Invalid image!'); $media.find('a').trigger('click'); $this.val(''); }
					newImg.src=$(this).val();
				} else {
					$parent.find('.gwa-input-btn').show();
					$media.find('.gwa-img-upload-media-remove').trigger('click');
				}
				
			}
			if (e.type == 'keydown' && code == 13) e.preventDefault(); 
			
		});
		
		$goPricingAdmin.on('change', '.gwa-img-upload select', function(e) {
			var $this = $(this), 
				$parent = $this.closest('.gwa-img-upload'),
				$input = $parent.find('input[type="text"]');
				$input.val($this.val()).trigger('change');
		});
		
		$goPricingAdmin.on('click', '[data-action="img-upload"], [data-action="file-upload"]', function(e) {
			var $this = $(this),
				$parent = $this.closest('.gwa-input-btn');
				type = $this.data('file-type') !== undefined ? $this.data('file-type') : 'image';
				
			if ($this.data('action') == "img-upload") {
				$parent = $this.closest('.gwa-img-upload'),
				$media = $parent.find('.gwa-img-upload-media'),
				$media.find('.gwa-img-upload-media-remove').trigger('click');
			} 
			$input = $parent.find('input[type="text"]');
				
			if ( typeof wp.media != 'undefined' ) {
				var file_frame = wp.media({
					title: 'Select an Image',
					library: {
						type: type,
					},
					button: {
						text: 'Use Image'
					},
					multiple: false,
				});
				
				file_frame.on('select', function() {

					if (typeof file_frame.state().get('selection').first().toJSON().type === 'unedfined') return;

					switch( file_frame.state().get('selection').first().toJSON().type ) {
					
						case 'video' :
						case 'audio' : 						
							$input.val(file_frame.state().get('selection').first().toJSON().url); 
							break;
														
						case 'image' :
						
							var sizes = typeof file_frame.state().get('selection').first().toJSON().sizes !== 'undefined' ? file_frame.state().get('selection').first().toJSON().sizes : null,
								optsHtml='';
							
							for (var x in sizes) {
								optsHtml += '<option value="'+sizes[x].url+'"'+ ( x == 'full' ? ' selected="selected"' : '' ) +'>'+x+' ('+sizes[x].width+'x'+sizes[x].height+')</option>';
							};
								
							if (optsHtml != '') $('<select>', { html : optsHtml, style : 'margin-bottom:0;' }).appendTo($media);
		
							$input.val(file_frame.state().get('selection').first().toJSON().url).trigger('change');
							break;
						
					}

				});
				
				file_frame.open();
			
			}
										
		});			
		
		/* Img selector */
		
		$goPricingAdmin.on('change', '.gwa-img-selector', function(e) {
			var $this = $(this), 
				$media = $this.closest('td').find('.gwa-img-selector-media'),
				index = this.selectedIndex, 
				imgData = $this.find('option').eq(index).data('src');

			if (typeof imgData !== 'undefined' && imgData != '') {
					var newImg = new Image;
					newImg.onload=function(){
						$media.find('img').remove();
						if (!$media.length)	$('<div>', { 'class' : 'gwa-img-selector-media' }).appendTo($this.closest('td'));
						$('<img>', { src : newImg.src }).prependTo($this.closest('td').find('.gwa-img-selector-media'));
					}
					newImg.onerror=function(){ alert('Invalid image!'); }
					newImg.src=imgData;				
			} else {
				$this.closest('td').find('.gwa-img-selector-media img').remove();
			}
		});			
		
		var clickPressed = null;
		var clickPressed2 = null;
		var clickPressed3 = null;

		$(document).on('mousedown mouseup mousemove', function(e) {
			var $target = $(e.target),
				$colEditor = $('#go-pricing-column-editor').find('.go-pricing-cols-wrap'),
				$col = $target.closest('.go-pricing-col');
		
		
			if (e.type=="mouseup") { clickPressed = null;  clickPressed2 = null; clickPressed3 = null; }
		
			if (e.type=="mousemove") {


				if  (clickPressed!=null) {
					$goPricingAdmin.find('*:focus').blur();
					$colEditor.scrollLeft(clickPressed-e.pageX);
					e.preventDefault();
				} else {
					if (!$col.length && $colEditor.width()<$colEditor.find('.go-pricing-cols').outerWidth()) {
						$colEditor.css('cursor','move');
					} else {
						$colEditor.css('cursor','auto');
					}
				}

				
			}
						
			if ($colEditor.length && $colEditor.width()<$colEditor.find('.go-pricing-cols').outerWidth()) {
				if (e.type=='mousedown' && !$col.length && $target.closest('.go-pricing-cols-wrap').length ) {	
					clickPressed = e.pageX+$colEditor.scrollLeft();

					e.preventDefault();
				}
				
	

			}
			if (e.type=="mousemove" && clickPressed!=null) {
				return false;
			}

		});
		 
		var tooltipTimeout = null;
		
		$goPricingAdmin.on('focusin focusout', '.gwa-abox-content input[type="text"], .gwa-abox-content select, .gwa-abox-content textarea, .gwa-abox-content .gwa-checkbox, .gwa-abox-content .gwa-colorpicker, .gwa-abox-content .gwa-checkbox-list', function(e) {
			
			if ($goPricingAdmin.find('.gwa-pcontent').attr('data-help') != 1 ) return;
			
			var $this = $(this), 
				$td = $this.closest('td'), 
				$tr = $this.closest('tr'), 
				$aboxContent = $this.closest('.gwa-abox-content'),
				$tooltip = $td.find('.gwa-table-tooltip'),
				$help = $this.closest('tr').find('.gwa-abox-info');
			

			if (e.type == 'focusin' && $help.length) {

				if (!$tooltip.length) {
					
					if ($this.closest('.gwa-checkbox-list').length) {
						$tooltip = $('<div />', { 'class' : 'gwa-table-tooltip', 'html' : '<div>'+$help.html()+'</div>' } ).insertAfter($this.parents('.gwa-checkbox-list:last'));
					} else if ( $this.closest('.gwa-img-upload').length )  {
						$tooltip = $('<div />', { 'class' : 'gwa-table-tooltip', 'html' : '<div>'+$help.html()+'</div>' } ).insertAfter($this.closest('.gwa-img-upload').find('.gwa-input-btn input[type="text"]'));						
					} else {
						$tooltip = $('<div />', { 'class' : 'gwa-table-tooltip', 'html' : '<div>'+$help.html()+'</div>' } ).insertAfter($this);
					}

					setTimeout(function() { 
						$tooltip.addClass('gwa-visible');
					}, 10);					
				} else {
					$tooltip.addClass('gwa-visible');
				}
				
				if ($aboxContent.height()-$tr.position().top == 50 && $aboxContent.closest('#gwa-editor-popup-wrap').length) {
					$tooltip.addClass('gwa-tooltip-last');
				}
				
				if ($this.closest('.gwa-popup').length && $tr.outerWidth(true)-$td.outerWidth(true)-$td.position().left-20 < 300) {
					$tooltip.css('max-width', $tr.outerWidth(true)-$td.outerWidth(true)-$td.position().left-10)
				}
				
			} else if ($help.length) {
				$tooltip.removeClass('gwa-visible');
			}
			
			
			
		})
		 
		
		function showTooltip($elem, content)  {
			
			
		}

		 

	/* ---------------------------------------------------------------------- /
		[3] ADMIN CUSTOM - ICONPICKER
	/ ---------------------------------------------------------------------- */
		 
		
		/* Select icon */
		$goPricingAdmin.on('click', '[data-action="ip-bg-switch"], [data-action="ip-select"], [data-action="ip-select-blank"], [data-action="ip-select-custom"]', function(e) {
			var $this = $(this),
				$parent = $this.closest('.gwa-icon-picker'),
				$preview = $parent.find('.gwa-icon-picker-selected .gwa-icon-picker-icon'),
				$input = $parent.find('.gwa-icon-picker-selected input[type="hidden"]'),
				action = $this.data('action');
			
			$this.closest('tr').next('tr').hide().find('input').val('');
			
			switch(action) {
				
				case 'ip-bg-switch' :
					if (!$parent.hasClass('gwa-icon-picker-dark')) {
						$parent.addClass('gwa-icon-picker-dark');
					} else {
						$parent.removeClass('gwa-icon-picker-dark');
					}
					break;
					
				case 'ip-select' :
					$this.addClass('gwa-current').siblings().removeClass('gwa-current');				
					$preview[0].innerHTML = this.innerHTML;
					if ($this.data('value') !== undefined && $this.data('value') != '') {
						$input.val($this.data('value'));
					} else {
						if ($this.find('i').length) {
							$input.val($this.find('i')[0].getAttribute('class'));
						}
						if ($this.find('img').length) {
							$input.val($this.find('img')[0].getAttribute('src'));
						}						
					}
					break;
					
				case 'ip-select-blank' :
					$this.addClass('gwa-current').siblings().removeClass('gwa-current');				
					$preview.html('');
					$input.val('');
					break;
					
				case 'ip-select-custom' :
					$this.addClass('gwa-current').siblings().removeClass('gwa-current');				
					$preview.html('');
					$input.val('');
					$this.closest('tr').next('tr').show();				
					break;

			}
			
		});	
		
		/* Search icon */
		function seachIcon($elem) {
			if (!$elem) return; 
			var $parent = $elem.closest('.gwa-search-input'), 
				$input = $parent.find('input[type="text"]'),
				$label = $parent.find('span'),
				$iconContainer = $elem.closest('.gwa-icon-picker').find('.gwa-icon-picker-content');
				resultCnt=0,
				$icons = $iconContainer.find('.gwa-icon-picker-icon[data-action="ip-select"]');

			if ($input[0].value == '' && !$parent.hasClass('gwa-visible')) return;
			
			for (var x = 0; x < $icons.length; x++) {

				var $icon = $icons.eq(x),
					$iconEl = $icon.find('i');

				if (!$iconEl.length) continue;
				
				if ($iconEl[0].getAttribute('class').split('-')[1].toLowerCase().indexOf($input[0].value.toLowerCase()) == -1) {
					$icon.css('display', 'none');
				} else {
					$icon.css('display', 'block');
					resultCnt++;					
				};					

			}
			
			if ($input[0].value !='') { 
				$parent.addClass('gwa-visible');
			} else {
				$parent.removeClass('gwa-visible');
			}
			$label[0].innerHTML = '('+resultCnt+')';
			
		};
		
		
		/* Searchfield "ENTER" key event */
		$goPricingAdmin.on('keydown','[data-action="ip-search"] input[type="text"]', function(e) {

			if (e.keyCode == 13 || e.which == 13) {
				seachIcon($(this));
				return false;
			};

		});
		
		
		/* Searchfield button click event */		
		$goPricingAdmin.on('click','[data-action="ip-search"] a', function(e) {

			seachIcon($(this));
			e.preventDefault();

		});	
		
		
		/* Show icon title on hover */
		$goPricingAdmin.on('mouseenter','a[data-action="ip-select"]', function(e) {			

			var $this = $(this), $fontIcon = $this.find('i');
			if (!$fontIcon.length && this.getAttribute('title') !== undefined) return;
			var title = $fontIcon[0].getAttribute('class').split('-')[1];	
			this.setAttribute('title', title);
			e.preventDefault();

		});			
	

	/* ---------------------------------------------------------------------- /
		[3] ADMIN UI - ICONBUTTONS *
	/ ---------------------------------------------------------------------- */	


		/* Iconbutton click event */
		$goPricingAdmin.on('click', '.gwa-icon-btn a', function(e) {
			
			var $this = $(this);
				$input = $this.closest('.gwa-icon-btn').find('input[type="hidden"]');
			if ($this.data('id') === undefined || !$input.length) return;
			
			if (!$this.hasClass('gwa-current')) {
				$this.addClass('gwa-current').siblings().removeClass('gwa-current');
				$input.val($this.data('id'));
			}

		});



	/* ---------------------------------------------------------------------- /
		[3] ADMIN UI - GENERAL LABEL CLICK EVENT *
	/ ---------------------------------------------------------------------- */		


		$goPricingAdmin.on('click', '.gwa-abox label', function(e) {
			
			var $this = $(this),
				isParent = !$this.closest('th').length ? true : false,
				$input = isParent === true ? $this.find('input[type=text], textarea, select') : $this.closest('tr').find('td').find('input[type=text], textarea, select');
			
			if (!$input.length || $input.eq(0).attr('tabindex') == -1) return;
			
			$input.eq(0).not(':focus').focus();			
		
		});


	/* ---------------------------------------------------------------------- /
		[3] ADMIN UI - CHECKBOX *
	/ ---------------------------------------------------------------------- */


		/* Label click event */
		$goPricingAdmin.on('click', '.gwa-abox label', function(e) {

			var $this = $(this),
				isParent = !$this.closest('th').length ? true : false,
				$input = isParent === true ? $this.find('.gwa-checkbox') : $this.closest('tr').find('td').find('.gwa-checkbox');			
			
			if (!$input.length) return;
			
			$input.eq(0).not(':focus').focus();
			if (isParent === false) $input.eq(0).trigger('click', true);

		});


		/* Checkbox change event */
		$goPricingAdmin.on('change', '.gwa-checkbox input[type=checkbox]', function(e) {
			
			var $this = $(this), $cb = $this.closest('.gwa-checkbox');
			if (this.checked === true) { 
				$cb.addClass('gwa-checked');
				this.checked = true;
			} else {
				$cb.removeClass('gwa-checked');
				this.checked = false;
			}

		});
			
		
		/* Checkbox change on SPACE keypress */
		$(document).on('keydown', function(e) {

			var $targetEl = $(e.target);
			if (e.keyCode == 32 && $targetEl.is('.gwa-checkbox')) { 
				$targetEl.find('input[type=checkbox]').trigger('click');
				e.preventDefault();		
			}

		});	
				
								
	/* ---------------------------------------------------------------------- /
		[3] ADMIN UI - CHECKBOX LIST
	/ ---------------------------------------------------------------------- */

		/* Checkbox list */
		$goPricingAdmin.on('click', '.gwa-checkbox-list .gwa-checkbox, .gwa-checkbox-list-toggle', function(e, isTriggered) {

			var $this = $(this);
			if ($this.hasClass('gwa-checkbox-list-toggle')) {
				var $parent = $this.closest('.gwa-checkbox-list');
				
				if ($parent.hasClass('gwa-closed')) {
					$parent.removeClass('gwa-closed');
				} else {
					$parent.addClass('gwa-closed');
				}
				e.preventDefault();
				return;	
			}
			
			var	isParent = $this.parents('.gwa-checkbox-list').length == 1 ? true : false,
				isChecked = $this.find('input[type="checkbox"]').is(':checked');

			if (isParent && (isChecked || isTriggered === true)) {
				var $cb = $this.closest('.gwa-checkbox-list').find('.gwa-checkbox-list .gwa-checkbox');
				for (var x=0; x < $cb.length; x++) $cb.eq(x).removeClass('gwa-checked').find('input[type="checkbox"]')[0].checked = false;
			} else if (isChecked) {
				$this.parents('.gwa-checkbox-list:last').find('.gwa-checkbox:first')
				.removeClass('gwa-checked').find('input[type="checkbox"]')[0].checked = false;
			}
			
		});


	/* ---------------------------------------------------------------------- /
		[3] ADMIN UI - COLORPICKER FUNCTIONS *
	/ ---------------------------------------------------------------------- */


		/* Get favourite colors */
		function getFavColors() {
			
			var cookies = document.cookie.replace(/\s/g, '').split(';'), colors = [];
			
			for (var x in cookies) {
				var cookie = {
					key : cookies[x].split('=')[0],
					value : cookies[x].split('=')[1]
				};	

				if (cookie.key == 'go_pricing[colors]['+userSettings.uid+']') {
					if (cookie.value != '') colors = cookie.value.split(',');
				};
				
			}
			
			return colors;
			
		}
		
		
		/* Add color to favourites */
		function addFavColor(color, $elem) {
			
			if (color === undefined || $elem === undefined) return;
			var colors = getFavColors();

			if ($.inArray(color, colors) && color != '' ) colors.splice(0,0, color);
			if (colors.length>6) colors = colors.slice(0,6);
				
			if (colors.length) {
				document.cookie='go_pricing[colors]['+userSettings.uid+']='+colors.join(',');
				showFavColors($elem);
			}
				
		};
		
		
		/* Show favourite colors */		
		function showFavColors($elem) {

			var colors = getFavColors(), code = '';
			
			if ($elem === undefined) return;
		
			var $popup = $elem.is('.gwa-colorpicker') ? $elem.find('.gwa-cp-popup') : $elem.closest('.gwa-cp-popup'),
				$favcolors = $popup.find('.gwa-cp-favcolors');

			for (var x in colors) code += '<span class="gwa-cp-picker" title="'+colors[x]+'" style="background:'+colors[x]+'"></span>';
			
			if (!$favcolors.length) {
				$popup.append('<div class="gwa-cp-favcolors">'+code+'</div>');
			} else {
				$favcolors.html(code);
			}
		};
		
			
	/* ---------------------------------------------------------------------- /
		[3] ADMIN UI - COLORPICKER EVENTS *
	/ ---------------------------------------------------------------------- */

		/* Label click event */		
		$goPricingAdmin.on('click', '.gwa-abox label', function(e) {

			var $this = $(this),
				isParent = !$this.closest('th').length ? true : false,
				$input = isParent === true ? $this.find('.gwa-colorpicker') : $this.closest('tr').find('td').find('.gwa-colorpicker');
			
			if (!$input.length) return;
			
			if (isParent === true) {
				e.preventDefault();
			} else {
				$input.eq(0).not(':focus').focus();
			}			
			
		});			

		/* Show & hide colorpicker */
		$goPricingAdmin.on('focusin focusout', '.gwa-colorpicker input[type=text], .gwa-colorpicker', function(e) {
			
			var $this = $(this);
				$colorpicker = this.type === undefined ? $this : $this.closest('.gwa-colorpicker'),
				$popupInner = $this.find('.gwa-cp-popup-inner');
			
			switch(e.type) {
				
				case 'focusin' :
					$colorpicker.addClass('gwa-focus');
					if (!$popupInner.length) break;		
					
					showFavColors($this);
					
					$.farbtastic('.gwa-focus .gwa-cp-popup-inner', function(color) { 
						$colorpicker.find('input').val(color);
						$colorpicker.find('.gwa-cp-label').text(color);
						$colorpicker.find('.gwa-cp-picker span').css('background', color)
					}).setColor($colorpicker.find('input').val());

					break;
				
				case 'focusout' :
					if (!$popupInner.length) break;
					$colorpicker.removeClass('gwa-focus');
					break;				
			}
			
		});	

		/* Colorpicker input change evt ! */
		$goPricingAdmin.on('change keydown', '.gwa-cp-popup input', function(e) {
			
			var $this = $(this), $parent = $this.closest('.gwa-colorpicker'), code = e.keyCode || e.which;
			
			if ((e.type == 'keydown' && code == 13) || e.type == 'change') {
				if ($this.val().match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g)) {
					$parent.find('input[type="hidden"]').val($this.val()).end().find('.gwa-cp-picker span').css('background', $this.val()).end().find('.gwa-cp-label').text($this.val());
					$.farbtastic('.gwa-focus .gwa-cp-popup-inner').setColor($this.closest('.gwa-colorpicker').find('input').val())
				} else if ($this.val() == '') {
					$parent.find('input[type="hidden"]').val('').end().find('.gwa-cp-picker span').css('background', 'transparent').end().find('.gwa-cp-label').html('&nbsp;');
				}
				
			e.preventDefault(); 				
			
			}
			
		});
		
		$goPricingAdmin.on('click', 'a[data-action="cp-fav"]', function(e) {
			var $this = $(this), $parent = $this.closest('.gwa-input-btn'), $input = $parent.find('input');
			if ($input.val().match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g)) {
				addFavColor($input.val(), $parent);
			}
			e.preventDefault();
		});

		$goPricingAdmin.on('click', '.gwa-cp-favcolors span', function(e) {
			var $this = $(this), $colorpicker = $this.closest('.gwa-colorpicker'); color = $this.attr('title');
			$colorpicker.find('input').val(color);
			$colorpicker.find('.gwa-cp-label').text(color);
			$colorpicker.find('.gwa-cp-picker span').css('background', color);		
			$.farbtastic('.gwa-focus .gwa-cp-popup-inner').setColor(color) ;
			$($this).closest('.gwa-colorpicker').trigger('focus');
			return false;
		});
	

	/* ---------------------------------------------------------------------- /
		[3] TABLE CREATOR PAGE
	/ ---------------------------------------------------------------------- */


		setColWidth();
		
				
	/* ---------------------------------------------------------------------- /
		[4.X] POPUP FUNCTIONS
	/ ---------------------------------------------------------------------- */	
		
		function showPopupOverlay() {
	
			var $popup = $('#gwa-popup-wrap');
			if ($popup.length) return;
			
			var wrapBeforeWidth = $goPricingAdmin.outerWidth(true);
			$('body').css('overflow-y', 'hidden');
			var widthDiff = $goPricingAdmin.outerWidth(true)-wrapBeforeWidth;
			if (widthDiff > 0) $('body').css('padding-right', widthDiff);

			$goPricingAdmin.prepend('<div id="gwa-popup-wrap"></div><div id="gwa-popup-overlay"></div>');

			setTimeout(function() { 
	
				$('#gwa-popup-overlay').css({ opacity : 0.75, visibility: 'visible' });
			}, 10);
			
		}
		
		
		function createPopup(data) {

			var $popup = $('#gwa-popup-wrap');
			if (!$popup.length || data === undefined) return;

			var $popupContent = $(data);
			$popupContent.appendTo($popup).wrap('<div class="gwa-popup-wrap"></div>');
			
			var $popupImage = $popupContent.find('img.gwa-popup-img');
			if ($popupImage.length) $popupContent.data('type', 'image');

			var $popupIframe = $popupContent.find('iframe.gwa-popup-iframe');
			if ($popupIframe.length) $popupContent.data('type', 'iframe');
			
			var popupType = $popupContent.data('type');
				
			switch (popupType) {
									
				case 'iframe' : 
					$popupIframe.load(function() {						
						setTimeout(function() { $popupContent.addClass('gwa-visible').parent().siblings().find('.gwa-popup').addClass('gwa-inactive'); }, 100);
						setPopupSize($popupContent);
						hideLoader();										
					});
					break;
					
				default :
					setTimeout(function() { $popupContent.addClass('gwa-visible').parent().siblings().find('.gwa-popup').addClass('gwa-inactive'); }, 100);
					setPopupSize($popupContent);
					hideLoader();
			}

		}
		
		function removePopup() {
			
			var $popup = $('#gwa-popup-wrap');
			if (!$popup.length) return;			
			
			if (!$popup.find('.gwa-popup.gwa-visible').length) {
				if ($popup.find('.gwa-popup').length) {
					$('#gwa-popup-wrap').remove();
					
				} else {
					$('#gwa-popup-wrap').remove();
				}

				$('#gwa-popup-overlay').css({ opacity : 0, visibility: 'hidden' });
				
				if (supportsTransitions) {
					$('#gwa-popup-overlay').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){ 
						$('#gwa-popup-overlay').remove(); $('body').css({'overflow-y' : 'auto', 'padding-right' : 0}); 
					});
				} else {
					$('#gwa-popup-overlay').remove(); 
					$('body').css({'overflow-y' : 'auto', 'padding-right' : 0}); 
				}
				
				hideLoader();
				
			} else {

				if (popupXHR !== null) {
					popupXHR.abort();
					hideLoader();
					return;
				} 

				$popup.find('.gwa-popup.gwa-visible:last').removeClass('gwa-visible').parent().siblings().find('.gwa-popup').removeClass('gwa-inactive');
				if (supportsTransitions) {
					$popup.find('.gwa-popup:last').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){ 
						$popup.find('.gwa-popup-wrap:last').remove();
						if (!$popup.find('.gwa-popup.gwa-visible').length) removePopup();
					});
				} else {
					$popup.find('.gwa-popup-wrap:last').remove();
					if (!$popup.find('.gwa-popup.gwa-visible').length) removePopup();
				};
					
			};

		}
		
		
		function setPopupSize($popupContent) {
			
			var $popup = $('#gwa-popup-wrap');
			if (!$popup.length) return;
			
			if ($popupContent === undefined) $popupContent = $popup.find('.gwa-popup');
			
			for (var x=0; x < $popupContent.length; x++) {
				
				var $popupImage = $popupContent.eq(x).find('img.gwa-popup-img'),
					$popupIframe = $popupContent.eq(x).find('iframe.gwa-popup-iframe'),
					popupType = $popupContent.eq(x).data('type');
				
				switch (popupType) {
					
					case 'image' : 
						$popupImage.css('max-height', $popup.height()-80);
						break;						
						
					case 'iframe' : 
						if ($popupIframe.contents().find('body').outerHeight(true)>$popup.height()-150) {
							$popupIframe.css('height', $popup.height()-150);				
						} else {
							$popupIframe.css('height', $popupIframe.contents().find('body').outerHeight(true));
						}
						break;	
					
					default :
						if ($popupContent.eq(x).find('.gwa-popup-footer').length) {
							$popupContent.eq(x).find('.gwa-popup-content').css({'max-height' : $popup.height()-150 , 'overflow' : 'auto' });					
						} else {
							$popupContent.eq(x).find('.gwa-popup-content').css({'max-height' : $popup.height()-80 , 'overflow' : 'auto' });	
						}
						$popupContent.eq(x).find('select').trigger('change');
				}								
				
			}

		}		
		
		
		
	/* ---------------------------------------------------------------------- /
		[4.X] POPUP LOAD
	/ ---------------------------------------------------------------------- */			
		
		var popupXHR = null;
				
		
		$goPricingAdmin.on('click', '[data-popup="live-preview-edit"]', function(e) {
			
			$(this).data('popup-subtitle', $goPricingAdmin.find('[name="name"]').val());
			
		});
				

				
		$goPricingAdmin.on('click', '[data-action="popup"]', function(e) {
			
			if (popupXHR !== null) return;
			
			var $this = $(this);
			
			if ($this.data('alert') !== undefined && $this.data('alert') != '') {
				alert($this.data('alert'));
				return;
			}
			
			if ($this.data('confirm') !== undefined && $this.data('confirm') != '') {
				if (!confirm($this.data('confirm'))) return;
			}
			
			if ($this.closest('td').find('[data-popup="'+$this.data('popup')+'"]').not($this).length) {
				$popupTarget = $this.closest('td').find('[data-popup="'+$this.data('popup')+'"]').not($this); 
			}
							
			showLoader(false, true);
			
			setTimeout(function() { 
			popupXHR = $.ajax({  
					type: 'post',
					url: ajaxurl, 
					data: $.param({ 
						action : 'go_pricing_ajax_action', 
						_action :'popup', _action_type: $this.data('popup'), 
						_nonce : $goPricingAdmin.find("#_nonce").val(), 
						data: typeof $this.data('id') !== 'undefined' ? $this.data('id') : '',
						title : typeof $this.data('popup-title') !== 'undefined' ? $this.data('popup-title') : '', 
						subtitle : typeof $this.data('popup-subtitle') !== 'undefined' ? $this.data('popup-subtitle') : '', 
						maxwidth : typeof $this.data('popup-maxwidth') !== 'undefined' ? $this.data('popup-maxwidth') : ''
					}),
					beforeSend: function () {
						showPopupOverlay();
					}
				}).always(function() {
					popupXHR = null;
				}).fail(function(jqXHR, textStatus) {
					if (textStatus != 'abort') showAjaxMsg('<p><strong>'+$goPricingAdmin.data('ajaxerror')+'</strong></p>', 'error');
				}).done(function(data) {
					var $ajaxResponse = $('<div />', { 'class':'ajax-response', 'html' : data });
					
					/* load image dinamically */
					if ($ajaxResponse.find('.gwa-popup-img-wrap img').length && $this.data('id') !== undefined && $this.data('id') != '') {
						$ajaxResponse.find('.gwa-popup-img-wrap img').prop('src', $this.data('id'));
					};
					createPopup($ajaxResponse.html());
					
				});	
			}, 1);
				
			e.preventDefault();
			
		});
		
	/* ---------------------------------------------------------------------- /
		[4.X] POPUP CORE EVENTS
	/ ---------------------------------------------------------------------- */				

		/* Resize on window resize */
		$(window).on('resize', function() { setPopupSize(); });
		
		/* Close popup on click */
		$('body').on('click', function(e) {

			var $popup = $('#gwa-popup-wrap');
			if (!$popup.length) return;
			
			if (!$(e.target).closest('.gwa-popup-inner').length && !$(e.target).closest('.media-modal').length) removePopup();
			
		});
		
		$goPricingAdmin.on('click', '.gwa-popup-close', function(e) {
			
			var $this = $(this), $popup = $('#gwa-popup-wrap');
			if (!$popup.length || !$this.closest('#gwa-popup-wrap').length) return;
			removePopup();
			
			e.preventDefault();
			
		});
		
		
		/* Close popup on ESC keypress */
		$(document).on('keydown', function(e) {
			
			var $popup = $('#gwa-popup-wrap');
			if (!$popup.length) return;
			if (e.keyCode == 27 || e.which == 27) removePopup();
			if (popupXHR !== null) popupXHR.abort();
			
		});

	/* ---------------------------------------------------------------------- /
		[4.X] POPUP EVENTS
	/ ---------------------------------------------------------------------- */	

		
		/* Toggle views in live preview */
		$goPricingAdmin.on('click', 'a[data-view]', function(e) {
			
			var $this = $(this), $popup = $('#gwa-popup-wrap');
			
			if ($this.data('view') === undefined) return;
			$this.addClass('gwa-current').siblings().removeClass('gwa-current');

			switch( $this.data('view') ) {
				
				case 'desktop' :
					$popup.find('.gwa-popup:last').css('max-width', 1020);
					$popup.find('a[data-action="popup-export"]').css('display','inline-block');					
					break;
					
				case 'tablet' :
					$popup.find('.gwa-popup:last').css('max-width', 700);
					$popup.find('a[data-action="popup-export"]').css('display','inline-block');				
					break;	
					
				case 'mobile' :
					$popup.find('.gwa-popup:last').css('max-width', 400);
					$popup.find('a[data-action="popup-export"]').css('display','none');
					break;													
				
			}
			
			document.cookie='go_pricing[settings][popup]['+userSettings.uid+']='+$this.data('view');
			
		});		
		

		/* Create export popup */
		$goPricingAdmin.on('click', '[data-action="popup"][data-popup="export"]', function(e) {
			$(this).data('id', $('#go-pricing-tm-select').val());
		});
		
		/* Popup edit button event */
		$goPricingAdmin.on('click', '[data-action="popup-edit"]', function(e) {
			
			var $this = $(this), $popup = $('#gwa-popup-wrap');
			$('#go-pricing-tm-select').val($this.data('id'));		
			$goPricingAdmin.find('[name="_action_type"]').val('edit').end().find('form').submit();

		});	
		
		/* Popup export button event */
		$goPricingAdmin.on('click', '[data-action="popup-export"]', function(e) {
			
			var $this = $(this), 
				$popup = $('#gwa-popup-wrap'), 
				$footer = $popup.find('.gwa-popup-footer');
				
			$footer.find('.gwa-popup-views').css('display', 'none');
			$footer.find('.gwa-popup-assets').css('display', 'none');

			$('#go-pricing-export-popup').css('display', 'block').closest('.gwa-popup-content').css('overflow', 'auto');
			$popup.find('iframe.gwa-popup-iframe').css('display', 'none');

		});	
		
		/* Popup export close button event */
		$goPricingAdmin.on('click', 'a.gwa-export-close', function(e) {
			
			var $this = $(this), 
				$popup = $('#gwa-popup-wrap'), 
				$footer = $popup.find('.gwa-popup-footer');
			
			$footer.find('.gwa-popup-views').css('display', 'inline-block');
			$footer.find('.gwa-popup-assets').css('display', 'block');			
			
			$('#go-pricing-export-popup').css('display', 'none').closest('.gwa-popup-content').css('overflow', 'hidden');			
			$popup.find('iframe.gwa-popup-iframe').css('display', 'block');
			
		});						
		
		
	/* ---------------------------------------------------------------------- /
		[4.X] POPUP SHROTCODE EDITOR
	/ ---------------------------------------------------------------------- */			
		
		var $popupTarget;
		
		$goPricingAdmin.on('click', 'a[data-action="insert-sc"]', function(e) {
			var $this = $(this),
				$scFields = $('[data-id="sc-fields"]:visible'),
				shortcode,
				shortcodeAtt = '';
				atts = [],
				$scFieldEls = $scFields.find('[data-attr]');
			
			if (!$scFieldEls.length) return;
			
			for (var x=0; x < $scFieldEls.length; x++) {
				
				var $currentField = $scFieldEls.eq(x),
					attribute = $scFieldEls[x].getAttribute('data-attr') ? $scFieldEls[x].getAttribute('data-attr') : '',
					value = $scFieldEls[x].value,
					dataType = $scFieldEls[x].getAttribute('data-type') ? $scFieldEls[x].getAttribute('data-type') : '';
					dataTypeOverride = $scFieldEls[x].getAttribute('data-type-override') ? true : false;


				if (attribute == '' || value == '' || ($scFieldEls[x].type == 'checkbox' && $scFieldEls[x].checked === false)) continue;
							
				atts[attribute] = atts[attribute] !== undefined ? atts[attribute] : { 
					'value' : [], 
					'separator' : $scFieldEls[x].getAttribute('data-attr-separator') ? $scFieldEls[x].getAttribute('data-attr-separator') : ' '
				};
				


				switch(dataType) {
				
					case 'int' :
						value = value.replace(/[^0-9]/g, '');
						break;
				
					case 'alphanum' :
						value = value.replace(/[^a-zA-Z0-9]/g, '');
						break;					
					
				}
				
				value =  $scFieldEls[x].getAttribute('data-value') && $scFieldEls[x].getAttribute('data-value') != '' ? $scFieldEls[x].getAttribute('data-value').replace('{value}', value) : value;		
				
				if (dataType != '' && dataTypeOverride === false) {
					$currentField.val(value);
				}
				
				if (value == '') { 
					delete atts[attribute];
				} else {
					$.extend( true, atts[attribute].value , atts[attribute].value.push( value ) );	
				}
				
			}

			for (var x in atts) shortcodeAtt += ' '+x+'="'+(atts[x].value.join(atts[x].separator)).trim(atts[x].separator)+'"';
			shortcode = $scFields[0].getAttribute('data-shortcode').replace('{atts}',  shortcodeAtt);
				
			if ($popupTarget === undefined || !$goPricingAdmin.find($popupTarget).length) return;
			
			var curPos = {
				start :	$popupTarget.data('cur-start'),
				end : $popupTarget.data('cur-end')
			};
			
			if (curPos.start === undefined || curPos.end  === undefined) {			
				$popupTarget[0].value += shortcode;
			} else {			
				var contentArr = $popupTarget[0].value.split('');
				contentArr.splice(curPos.start, curPos.end - curPos.start, shortcode);
				$popupTarget[0].value = contentArr.join('');
			}
			
			removePopup();

			$popupTarget.focus();
			

		});			

	/* ---------------------------------------------------------------------- /
		[5] POPUP FUNCTIONS & EVENTS 
	/ ---------------------------------------------------------------------- */	

		var $currentElem, editorPopupXHR;

		$goPricingAdmin.on('click', 'a[data-action="edit-box"]', function(e) {

			var $this = $(this);
			
			if ($this.data('alert') !== undefined && $this.data('alert') != '') {
				alert($this.data('alert'));
				return;
			}
			
			if ($this.data('confirm') !== undefined && $this.data('confirm') != '') {
				if (!confirm($this.data('confirm'))) return;
			}

			if ($currentElem !== undefined) {
				$currentElem.data('selected', false).removeClass('gwa-current');
			}
			$currentElem = $this.closest('.gwa-col-box');
			$currentElem.data('selected', true).addClass('gwa-current');			
			
			
			/*$currentElem.data('selected', false).removeClass('gwa-current');
			$currentElem = $this.closest('.gwa-col-box');
			$currentElem.data('selected', true).addClass('gwa-current');*/
			

			$popupTarget = $this.closest('td').find('[data-popup="'+$this.data('popup')+'"]').not($this); 
			$popupTarget = $popupTarget.length ? $popupTarget : undefined;
			
					
			showLoader();
			
			
			var $popup = $('#gwa-editor-popup-wrap');
					
			setTimeout(function() { 
			editorPopupXHR = $.ajax({  
					type: 'post',
					url: ajaxurl, 
					data: $.param({ 
						action : 'go_pricing_ajax_action', 
						_action :'editor_popup', 
						_action_type: $this.data('popup'), 
						_nonce : $goPricingAdmin.find("#_nonce").val(),
						icon_color : $this.closest('.gwa-abox').data('color') !== undefined ? $this.closest('.gwa-abox').data('color') : '',
						icon : $this.closest('.gwa-col-box').find('.gwa-col-box-header-icon i.fa').attr('class') !== undefined ? $this.closest('.gwa-col-box').find('.gwa-col-box-header-icon i.fa').attr('class') : '',						
						data: $this.closest('.gwa-col-box').find('input[type="hidden"]').val(),
						col_type: $this.closest('.go-pricing-col').find('[name*="[col-style-type]"]').find('option').eq($this.closest('.go-pricing-col').find('[name*="[col-style-type]"]').prop('selectedIndex')).data('type'),
						title : $this.data('popup-title') !== undefined ? $this.data('popup-title') : $this.closest('.gwa-col-box').find('.gwa-col-box-title').html(), 
						subtitle : typeof $this.data('popup-subtitle') !== 'undefined' ? $this.data('popup-subtitle') : ''
					}),
					beforeSend: function () {
						$popup.addClass('gwa-loading');
					}
				}).fail(function(jqXHR, textStatus) {
					if (textStatus != 'abort') showAjaxMsg('<p><strong>'+$goPricingAdmin.data('ajaxerror')+'</strong></p>', 'error');
				}).done(function(data) {
					
					$popup.removeClass('gwa-loading');
					var $ajaxResponse = $('<div />', { 'class':'ajax-response', 'html' : data });
					showEditorPopup($ajaxResponse.html());
					setEditorPopupNav();
				});	
			}, 1);
				
			e.preventDefault();

		});
		
	$goPricingAdmin.on('change', '#gwa-editor-popup-wrap select[data-title="type"]', function(e) {
		
		var $this = $(this);

		$this.closest('.gwa-popup-inner').find('.gwa-popup-title span').eq(1).html($this.prop('options')[$this.prop('selectedIndex')].innerHTML)
		
	});
	
	$goPricingAdmin.on('click', 'a[data-action="next"], a[data-action="prev"]', function(e) {
		
		if ($currentElem === undefined) return;

		var $popup = $('#gwa-editor-popup-wrap'), $this = $(this);
			
		if (!$popup.length)  return;
		
		if ($this.data('action') == 'next') {
			$currentElem.next('.gwa-col-box').trigger('dblclick');
		} else {
			$currentElem.prev('.gwa-col-box').trigger('dblclick');
		}
		
		e.preventDefault();
			
	});
		

	function setEditorPopupNav() {
				
		if ($currentElem === undefined) return;
		
		var $popup = $('#gwa-editor-popup-wrap'),
			$nav = $popup.find('.gwa-popup-nav'),
			$next = $nav.find('[data-action="next"]').closest('span'),
			$prev = $nav.find('[data-action="prev"]').closest('span'),
			$assets = $popup.find('[data-action="delete-data"], [data-action="clone-data"], [data-action="add-new-row"]');
		
		if (!$popup.length) return;
		
		var $parent = $currentElem.closest('.gwa-abox-content'),
			$boxLinks = $parent.find('.gwa-col-box-link:visible');
			$boxes = $parent.find('.gwa-col-box:visible').not('.gwa-col-box-main');
		
		if (!$boxes.length) return;
		
		if ($boxes.length == 1) {
			
			$next.addClass('gwa-disabled').css('display', 'none');
			$prev.addClass('gwa-disabled').css('display', 'none');
		
		} else {
			
			$next.css('display', 'inline-block');
			$prev.css('display', 'inline-block');
			
			if ($currentElem.prev('.gwa-col-box:visible').length) {
				$prev.removeClass('gwa-disabled');
			} else {
				$prev.addClass('gwa-disabled');
			}
			
			if ($currentElem.next('.gwa-col-box:visible').length) {
				$next.removeClass('gwa-disabled');
			} else {
				$next.addClass('gwa-disabled');
			}			
			
		}
		
		if ($currentElem.find('.gwa-assets-nav').find('[data-action^="clone-"], [data-action^="delete-"]').length) {
			$assets.css('display', 'inline-block');
		} else {
			$assets.css('display', 'none');	
			
		}
		
	}
	
	$goPricingAdmin.on('change', '[name*="[col-style-type"]', function(e) {
		
		var $popup = $('#gwa-editor-popup-wrap');
		
		if (!$popup.length)  return;
		
		hideEditorPopup();
		
	});
	

	$goPricingAdmin.on('click', '[data-action="clone-data"], [data-action="delete-data"], [data-action="add-new-row"]', function(e) {
		
		if ($currentElem === undefined) return;
		
		var $this = $(this);
		
		if ($this.data('action') == 'clone-data') {
			$currentElem.find('.gwa-assets-nav').find('[data-action^="clone"]').trigger('click');
		} else if ($this.data('action') == 'delete-data') {
			$currentElem.find('.gwa-assets-nav').find('[data-action^="delete"]').trigger('click');
		} else {
			$currentElem.closest('.gwa-abox-content').find('.gwa-col-box-add [data-action^="add"]').trigger('click');
		}
		
	});

	$goPricingAdmin.find('.gwa-assets-nav').each(function(index, element) {
		
		$this = $(element);
		
		

		
	});

	$goPricingAdmin.on('mouseenter mouseleave dblclick', '.gwa-col-box', function(e) {
		
		var $this = $(this);


		
		switch(e.type) {
			
			case 'mouseenter' :
				
				if ($this.find('.gwa-assets-nav').find('a').length == 1) $this.find('.gwa-assets-nav').find('a').css({'top' : '50%', 'margin-top' : -16});
				
				if (($this.closest('.go-pricing-cols').find('.ui-sortable-helper').length && $this.hasClass('ui-sortable-helper')) || !$this.closest('.go-pricing-cols').find('.ui-sortable-helper').length) {
				
					$this.addClass('gwa-current')
					$this.find('.gwa-assets-nav').addClass('gwa-visible');
				}
				break;
				
			case 'mouseleave' :
			
				if ($this.data('selected') !== true) {
					$this.removeClass('gwa-current');
				}
				
				$this.find('.gwa-assets-nav').removeClass('gwa-visible');
				break;
				
			case 'dblclick' :
			
				if (!$(e.target).closest('.gwa-assets-nav').length) $this.find('[data-action="edit-box"]').trigger('click');
				break;				
		}
		e.preventDefault();
	});
	

	$goPricingAdmin.on('click', '.gwa-col-box-link', function(e) {
		
		e.preventDefault();
		
	});
	
		function createEditorPopup() {
			
		}

		function showEditorPopup(data) {

			var $popup = $('#gwa-editor-popup-wrap'), firstLoad = false;
			if (!$popup.length) {
				firstLoad = true;
				$popup = $('<div id="gwa-editor-popup-wrap"></div>').prependTo($goPricingAdmin);
			} else {
				$popup.css('display','block');
			}
			if (data === undefined) return;

			if (firstLoad === true) {
				$popup.html(data);
			} else {
				$popup.find('.gwa-popup').html($(data).html());
			}

			$popup.find('.gwa-abox-content').find('select').trigger('change');
			
			
			$popup.draggable({ handle: ".gwa-popup-header", cursor: "move" }).find('.gwa-popup-content').css('max-height' , (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)-300);
			
			setTimeout(function() { $popup.find('.gwa-popup').addClass('gwa-visible'); }, 100);			
			hideLoader();		
			
		}
		
		function hideEditorPopup() {
			
			var $popup = $('#gwa-editor-popup-wrap');
			if (!$popup.length) return;			
			
			if ($popup.find('.gwa-popup.gwa-visible').length) {
				$popup.find('.gwa-popup').removeClass('gwa-visible');
				if (supportsTransitions && $popup.find('.gwa-popup').length) {
					$popup.find('.gwa-popup').one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){ 
						if ($currentElem !== undefined && !$currentElem.find('.gwa-assets-nav.gwa-visible').length) {
							$currentElem.removeClass('gwa-current').find('.gwa-assets-nav').removeClass('gwa-visible');
						}				
						$currentElem.data('selected', false);
						$popup.css('display', 'none');
					});
				} else {
					$popup.css('display', 'none');
				}
				
				hideLoader();
				
			} else {
				editorPopupXHR.abort();
				$popup.css('display', 'none');	
				hideLoader();
			}

		}	
	
	
	$goPricingAdmin.on('click', '[data-action="insert-data"]', function(e) {
		
		var $this = $(this);
			$popup = $this.closest('.gwa-popup'),
			$popupContent = $popup.find('.gwa-popup-content');

		if ($currentElem !== undefined) {
			$currentElem.find('input[type="hidden"]').val($popupContent.find('[name]').serialize());
						
			var elemCnt = 0;
			for (var x = 0; x < $popupContent.find('[name]').length; x++ ) {
				
				
				if (elemCnt == 2) break;
				
				var $currentField = $popupContent.find('[name]').eq(x);
				
				if ($currentField.closest('[data-parent-id]').length && !$currentField.closest('[data-parent-id]:visible').length) continue;
				
				if ($currentField.data('preview') !== undefined && $currentField.data('preview') != '' ) {
					
					if (elemCnt == 0) $currentElem.find('.gwa-col-box-content').html('');
					
					var val = $('<div>').text($currentField.val())
					if ($currentField.prop('type').toLowerCase() == 'select-one') val = $('<div>').text($currentField.prop('options')[$currentField.prop('selectedIndex')].innerHTML)
					
					if (val.html()=='') val.html('-');

					$currentElem.find('.gwa-col-box-content').append('<p>'+$currentField.data('preview')+': <span>'+val.html()+'</span></p>');
					elemCnt++;
				}
				
				if ($currentField.data('title') !== undefined && $currentField.data('title') != '' && $currentField.prop('type').toLowerCase() == 'select-one') {
					$currentElem.find('.gwa-col-box-title').find('span[data="type"]').text($currentField.prop('options')[$currentField.prop('selectedIndex')].innerHTML)
				}
				
			}
			
			$currentElem.addClass('gwa-notrans').css('background', '#e4f5ff');
			setTimeout(function() {
				$currentElem.removeClass('gwa-notrans').css('background', '#fff')
			}, 10);				
	
		}
		

		e.preventDefault();
		
	});
	
	$goPricingAdmin.on('click', '.gwa-popup-close', function(e) {
		
		var $this = $(this), $popup = $('#gwa-editor-popup-wrap');
		if (!$popup.length || !$this.closest('#gwa-editor-popup-wrap').length) return;
		hideEditorPopup();
		
		e.preventDefault();
		
	});
	
		
	/* Close popup on ESC keypress */
	$(document).on('keydown', function(e) {
		
		if (e.keyCode == 27 || e.which == 27) {

			var $popupOverlay = $('#gwa-popup-overlay');		
			if ($popupOverlay.length) return;
		
			var $popup = $('#gwa-editor-popup-wrap');
			if (!$popup.length) return;
			
			hideEditorPopup();
			
		}
		
	});	
		
		
	/* ---------------------------------------------------------------------- /
		[5] POPUP FUNCTIONS & EVENTS 
	/ ---------------------------------------------------------------------- */	

	$(window).load(function() {
		
		setTopBar();
		setSortableCols();

	});
	
	$(window).on('resize', function() {

		$( "#gwa-editor-popup-wrap" ).find('.gwa-popup-content').css('max-height' , (window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight)-300);
				
	});
		
});	