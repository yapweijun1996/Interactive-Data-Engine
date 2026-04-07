/**
 * Global application state and configuration.
 * All modules share state via the window.IDE namespace.
 *
 * Initialized immediately (not in document.ready) so that other scripts
 * can attach functions to it at parse time.
 */
window.IDE = {
    appData: [],
    tabulatorTable: null,
    isPivotView: true,
    configStorageKey: 'pivotAdvancedConfig_v2',
    renderers: null,  // set in document.ready when jQuery plugins are available

    /**
     * Display a user-friendly error in the status bar and log to console.
     * @param {string} context - Where the error occurred (e.g. "Pivot Render")
     * @param {Error}  err     - The caught error object
     */
    showError: function(context, err) {
        console.error('[IDE ' + context + ']', err);
        var $statusText = $('#data-status span:last-child');
        var $statusDot  = $('#data-status .status-dot');
        $statusText.text('Error: ' + context + ' — ' + (err.message || 'Unknown error'))
                   .css('color', '#ef4444');
        $statusDot.removeClass('loading active').addClass('error');
    }
};

$(document).ready(function() {
    window.IDE.renderers = $.extend(
        {},
        $.pivotUtilities.renderers,
        $.pivotUtilities.plotly_renderers
    );
});
