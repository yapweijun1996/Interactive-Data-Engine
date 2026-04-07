/**
 * UI controls: filter box positioning, UI toggle, and view switching.
 */
$(document).ready(function() {

    // Close any open filter box, reposition the new one near the clicked pill
    $(document).on('mousedown', '.pvtTriangle', function() {
        $('.pvtFilterBox').removeClass('pvt-ready').hide();
    });

    $(document).on('click', '.pvtTriangle', function() {
        var $pill = $(this).closest('.pvtAttr');
        setTimeout(function() {
            try {
            var $box = $('.pvtFilterBox:visible');
            if (!$box.length) return;

            var pillRect = $pill[0].getBoundingClientRect();
            var boxW = $box.outerWidth();
            var boxH = $box.outerHeight();
            var vw = window.innerWidth;
            var vh = window.innerHeight;

            // Place below the pill, aligned to its left edge
            var top = pillRect.bottom + 8;
            var left = pillRect.left;

            // If overflows right, shift left
            if (left + boxW > vw - 16) left = vw - boxW - 16;
            // If overflows bottom, place above the pill instead
            if (top + boxH > vh - 16) top = pillRect.top - boxH - 8;
            // Clamp to viewport edges
            if (left < 16) left = 16;
            if (top < 16) top = 16;

            // Override PivotTable's inline positioning, then reveal
            $box.css({
                position: 'fixed',
                top: top + 'px',
                left: left + 'px',
                margin: '0'
            }).addClass('pvt-ready');

            $box.find('input.pvtSearch').focus();
            } catch (err) {
                console.error('[IDE Filter Box]', err);
            }
        }, 60);
    });

    // Handle UI Toggle Button Click (Hide/Show pivot config panels)
    $('#btn-toggle-ui').click(function() {
        var $output = $('#pivot-table-output');
        var $btnText = $(this).find('span');
        var $btnIcon = $(this).find('svg');
        var isHidden = $output.toggleClass('pivot-ui-hidden').hasClass('pivot-ui-hidden');

        if (isHidden) {
            $btnText.text('Show UI');
            $btnIcon.html('<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path><line x1="1" y1="1" x2="23" y2="23"></line>');
        } else {
            $btnText.text('Hide UI');
            $btnIcon.html('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>');
        }
    });

    // Handle View Toggle Button Click
    $('#btn-toggle-view').click(function() {
        try {
        if (window.IDE.appData.length === 0) return;

        var $btnText = $(this).find('span');
        var $btnIcon = $(this).find('svg');

        window.IDE.isPivotView = !window.IDE.isPivotView;

        // Pivot-only toolbar controls
        var $pivotOnly = $('#btn-toggle-ui, #btn-export-png, #renderer-host');

        if (window.IDE.isPivotView) {
            // Switch to Pivot Table View
            $('#long-table-output').hide();
            $('#pivot-table-output').fadeIn(200);
            $btnText.text('View Raw Data');
            $btnIcon.html('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>');
            $pivotOnly.show();
            $('.raw-data-controls').hide();
        } else {
            // Switch to Long Table (Raw Data) View
            $('#pivot-table-output').hide();
            $('#long-table-output').fadeIn(200);
            $btnText.text('View Pivot Table');
            $btnIcon.html('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line><line x1="15" y1="3" x2="15" y2="9"></line>');
            $pivotOnly.hide();
            $('.raw-data-controls').css('display', 'flex');

            // Initialize or update Tabulator
            window.IDE.initTabulator();
        }
        } catch (err) {
            window.IDE.showError('View Toggle', err);
        }
    });

});
