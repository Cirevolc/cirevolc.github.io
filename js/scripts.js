(function($) {

    // Remove no-js class
    $('html').removeClass('no-js');

    // Scroll to top
    $('#to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

    // Open menu
    $('#menu-open').click(function() {       
            $('#menu-close').show();
            $('#menu').show();
            $(this).hide();
            window.getSelection().removeAllRanges();
    });

    // Close menu
    $('#menu-close').click(function() {       
            $('#menu-close').hide();
            $('#menu').hide();
            $('#menu-open').show();
    });
    
    // Clicking outsite menu also closes menu
    $(document).click(function(event) { 
        if(!$(event.target).closest('#menu-open').length) {
            if($('#menu').is(":visible") && $('#menu-close').is(":visible") && !$('#menu-open').is(":visible")) {
                $('#menu-close').hide();
                $('#menu').hide();
                $('#menu-open').show();
            }
        }        
    });
    
    
    // Animate to section when nav is clicked
    $('header a').click(function(e) {

        // Treat as normal link if no-scroll class
        if ($(this).hasClass('no-scroll')) return;

        e.preventDefault();
        var heading = $(this).attr('href');
        var scrollDistance = $(heading).offset().top;

        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, 500);

    });

    // Scroll to first element
    $('#lead-down span').click(function() {
        var scrollDistance = $('#lead').next().offset().top;
        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, 500);
    });

    // Create timeline
    $('#experience-timeline').each(function() {

        $this = $(this); // Store reference to this
        $userContent = $this.children('div'); // user content

        // Create each timeline block
        $userContent.each(function() {
            $(this).addClass('vtimeline-content').wrap('<div class="vtimeline-point"><div class="vtimeline-block"></div></div>');
        });

        // Add icons to each block
        $this.find('.vtimeline-point').each(function() {
            $(this).prepend('<div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>');
        });

        // Add dates to the timeline if exists
        $this.find('.vtimeline-content').each(function() {
            var date = $(this).data('date');
            if (date) { // Prepend if exists
                $(this).parent().prepend('<span class="vtimeline-date">'+date+'</span>');
            }
        });

        $this.find('.vtimeline-content').each(function() {
            var location = $(this).data('location');
            if (location) { // Prepend if exists
                $(this).parent().prepend('<span class="vtimeline-location">'+location+'</span>');
            }
        });

    });

    

    // Load additional projects
    $('#view-more-projects').click(function(e){
        e.preventDefault();
        $(this).fadeOut(300, function() {
            $('#more-projects').fadeIn(300);
        });
    });

})(jQuery);
