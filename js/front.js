$(function () {

    /* =========================================
     * tooltip
     *  =======================================*/

    $('.customer img').tooltip();


    /* =========================================
     * counters
     *  =======================================*/

    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });

    /* =================================================
     * Preventing URL update on navigation link click
     *  ==============================================*/

    $('.link-scroll').on('click', function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 1000);
        e.preventDefault();
    });


    /* =========================================
     *  Scroll Spy
     *  =======================================*/

    $('body').scrollspy({
        target: '#navbarcollapse',
        offset: 80
    });


    /* =========================================
     * testimonial slider
     *  =======================================*/

    $(".testimonials").owlCarousel({
        nav: false,
        dots: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });


    /* =========================================
     * Leflet map
     *  =======================================*/
    map();


    /* =========================================
     * parallax
     *  =======================================*/
    $(window).scroll(function () {

        var scroll = $(this).scrollTop();

        if ($(window).width() > 1250) {
            $('.parallax').css({
                'background-position': 'left -' + scroll / 8 + 'px'
            });
        } else {
            $('.parallax').css({
                'background-position': 'center center'
            });
        }
    });

    /* =========================================
     * filter
     *  =======================================*/

    $('#project-filter a, #hobby-filter a').click(function (e) {
        e.preventDefault();
        console.log('Filter link clicked:', $(this).attr('data-filter'));

        var $filterLink = $(this);
        var $filterList = $filterLink.closest('ul'); // Gets the specific ul (project-filter or hobby-filter)

        // Deactivate other active links within THIS filter list only
        $filterList.find('li').removeClass('active');
        // Activate the clicked link's parent li
        $filterLink.parent('li').addClass('active');

        var categoryToFilter = $filterLink.attr('data-filter');
        var $masonryContainer;

        // Determine which masonry container to filter based on the filter list ID
        if ($filterList.attr('id') === 'project-filter') {
            $masonryContainer = $('#references-masonry');
            console.log('Filtering #references-masonry');
        } else if ($filterList.attr('id') === 'hobby-filter') {
            $masonryContainer = $('#hobby-masonry');
            console.log('Filtering #hobby-masonry');
        }

        if ($masonryContainer && $masonryContainer.length) {
            $masonryContainer.find('.reference-item').each(function () {
                if ($(this).data('category') === categoryToFilter || categoryToFilter === 'all') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            console.error('Could not find the masonry container for the filter:', $filterList.attr('id'));
        }
    });


    /* =========================================
     * reference functionality
     *  =======================================*/
$('.reference a').on('click', function (e) {
    e.preventDefault();
    console.log('---- Reference item clicked ----');

    const $referenceLink = $(this);
    const $referenceItem = $referenceLink.closest('.reference-item');

    if (!$referenceItem.length) {
        console.error('Could not find .reference-item ancestor for clicked link.');
        return;
    }
    console.log('Clicked item $referenceItem:', $referenceItem);

    const title = $referenceItem.find('.reference-title').text();
    const descriptionHTML = $referenceItem.find('.reference-description').html(); // Get inner HTML for description
    const imagesData = $referenceItem.find('.reference-description').data('images');

    console.log('Title:', title);
    console.log('Description HTML found:', descriptionHTML ? 'Yes' : 'No');
    console.log('Raw data-images attribute:', imagesData);

    $('#detail-title').text(title || "Details"); // Set title, fallback if empty
    $('#detail-content').html(descriptionHTML || "<p>No description available.</p>"); // Set description, fallback if empty

    let sliderContent = '';
    if (imagesData && typeof imagesData === 'string' && imagesData.trim() !== '') {
        const images = imagesData.split(',');
        console.log('Images array:', images);
        for (let i = 0; i < images.length; ++i) {
            if (images[i].trim() !== '') { // Ensure image path is not empty
                sliderContent += `<div class="item"><img src="<span class="math-inline">\{images\[i\]\.trim\(\)\}" alt\="</span>{title} image ${i + 1}" class="img-fluid"></div>`;
            }
        }
    } else {
        console.warn('No images found or data-images attribute is empty/invalid for:', title);
        // Optionally, provide placeholder content if no images
        sliderContent = '<div class="item"><p class="text-center">No images to display.</p></div>';
    }
    console.log('Generated slider content:', sliderContent.length > 100 ? sliderContent.substring(0,100) + "..." : sliderContent);

    // Determine which masonry section to hide/show later
    const $hobbyMasonry = $referenceItem.closest('#hobby-masonry');
    const parentSectionId = $hobbyMasonry.length ? '#hobby-masonry' : '#references-masonry';
    console.log('Identified parent section for slideUp/slideDown:', parentSectionId);
    
    $('#detail').data('lastSection', parentSectionId); // Store the ID of the section to reopen
    console.log('Hiding:', parentSectionId, 'and showing #detail');
    $(parentSectionId).slideUp(400, function() {
        console.log(parentSectionId + ' hidden.');
    });
    $('#detail').slideDown(400, function() {
        console.log('#detail shown.');
    });


    const $slider = $('#detail-slider');
    console.log('Slider element $slider:', $slider);

    if ($slider.hasClass('owl-loaded')) {
        console.log('Slider is already loaded. Replacing and refreshing.');
        $slider.trigger('replace.owl.carousel', sliderContent).trigger('refresh.owl.carousel');
    } else {
        console.log('Slider not loaded. Initializing.');
        $slider.html(sliderContent); // Set content before initializing
        if (sliderContent.includes('<img')) { // Only initialize if there are images
            $slider.owlCarousel({
                nav: false,
                dots: true,
                items: 1
            });
            console.log('Owl Carousel initialized.');
        } else {
            $slider.html('<p class="text-center">No images to display in slider.</p>'); // Fallback if sliderContent was empty after checks
            console.log('Skipped Owl Carousel initialization as no valid image content.');
        }
    }
    console.log('---- End of Reference item click handler ----');
});


function closeReference() {
    const lastSection = $('#detail').data('lastSection') || '#references-masonry'; // Fallback
    console.log('Closing #detail, showing:', lastSection);
    $(lastSection).slideDown();
    $('#detail').slideUp();
}
/*
    function closeReference() {
        var lastSection = $('#detail').data('lastSection') || '#references-masonry';
        $(lastSection).slideDown();
        $('#detail').slideUp();


        $('#references-masonry').slideDown();
        $('#detail').slideUp();


    }
*/
$('#detail .close').on('click', function () {
        console.log('#detail .close button clicked');
        closeReference();
});








    /* =========================================
     *  animations
     *  =======================================*/

    delayTime = 0;

    $('[data-animate]').waypoint(function (direction) {
        delayTime += 250;

        var element = $(this.element);

        $(this.element).delay(delayTime).queue(function (next) {
            element.toggleClass('animated');
            element.toggleClass(element.data('animate'));
            delayTime = 0;
            next();
        });

        this.destroy();

    }, {
        offset: '90%'
    });
    
    $('[data-animate-hover]').hover(function () {
        $(this).css({
            opacity: 1
        });
        $(this).addClass('animated');
        $(this).removeClass($(this).data('animate'));
        $(this).addClass($(this).data('animate-hover'));
    }, function () {
        $(this).removeClass('animated');
        $(this).removeClass($(this).data('animate-hover'));
    });

    /* =========================================
     * for demo purpose
     *  =======================================*/

    var stylesheet = $('link#theme-stylesheet');
    $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
    var alternateColour = $('link#new-stylesheet');

    if ($.cookie("theme_csspath")) {
        alternateColour.attr("href", $.cookie("theme_csspath"));
    }

    $("#colour").change(function () {

        if ($(this).val() !== '') {

            var theme_csspath = 'css/style.' + $(this).val() + '.css';

            alternateColour.attr("href", theme_csspath);

            $.cookie("theme_csspath", theme_csspath, {
                expires: 365,
                path: document.URL.substr(0, document.URL.lastIndexOf('/'))
            });

        }

        return false;
    });

});



/* =========================================
 * styled Leaflet Map
 *  =======================================*/
// ------------------------------------------------------ //
// styled Leaflet  Map
// ------------------------------------------------------ //

function map() {

    var mapId = 'map',
        mapCenter = [53.14, 8.22],
        mapMarker = true;

    if ($('#' + mapId).length > 0) {

        var icon = L.icon({
            iconUrl: 'img/marker.png',
            iconSize: [25, 37.5],
            popupAnchor: [0, -18],
            tooltipAnchor: [0, 19]
        });

        var dragging = false,
            tap = false;

        if ($(window).width() > 700) {
            dragging = true;
            tap = true;
        }

        var map = L.map(mapId, {
            center: mapCenter,
            zoom: 13,
            dragging: dragging,
            tap: tap,
            scrollWheelZoom: false
        });

        var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });

        Stamen_TonerLite.addTo(map);

        map.once('focus', function () {
            map.scrollWheelZoom.enable();
        });

        if (mapMarker) {
            var marker = L.marker(mapCenter, {
                icon: icon
            }).addTo(map);

            marker.bindPopup("<div class='p-4'><h5>Info Window Content</h5><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p></div>", {
                minwidth: 200,
                maxWidth: 600,
                className: 'map-custom-popup'
            })

        }
    }
    
}
