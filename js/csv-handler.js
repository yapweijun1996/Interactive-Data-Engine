/**
 * CSV file upload handling, parsing via PapaParse, and empty state UI.
 */
$(document).ready(function() {

    // Show an empty state placeholder initially
    $("#pivot-table-output").html(
        '<div id="empty-state-upload" style="text-align: center; padding: 4rem 2rem; color: var(--text-muted); border: 2px dashed var(--border-light); border-radius: 8px; margin-top: 1rem; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor=\'var(--bg-body)\'" onmouseout="this.style.backgroundColor=\'transparent\'">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" style="margin-bottom: 1rem; opacity: 0.5;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>' +
        '<h3 style="color: var(--text-main); font-size: 1.25rem; font-weight: 600;">No Data Loaded</h3>' +
        '<p style="margin-top: 0.5rem;">Click here or the "Upload CSV File" button above to generate a pivot table.</p>' +
        '</div>'
    );

    // Allow user to click the empty state to trigger upload
    $(document).on('click', '#empty-state-upload', function() {
        $('#csv-file-input').click();
    });

    // Handle CSV Import Button Click
    $('#btn-import-csv').click(function() {
        $('#csv-file-input').click();
    });

    // Shared: process parsed CSV results and render
    function processParseResults(results, sourceName) {
        var $statusText = $('#data-status span:last-child');
        var $statusDot = $('#data-status .status-dot');

        try {

        var criticalErrors = results.errors.filter(function(err) {
            return err.code !== "TooFewFields" && err.code !== "TooManyFields";
        });

        if (criticalErrors.length > 0) {
            console.error('Critical CSV Parsing Errors:', criticalErrors);
            $statusText.text('Error parsing CSV. Check console.').css('color', '#ef4444');
            $statusDot.removeClass('loading').addClass('error');
            return;
        }

        var cleaned = window.IDE.cleanData(results.data);

        if (cleaned.data.length === 0) {
            $statusText.text('CSV file contains no readable data.').css('color', '#ef4444');
            $statusDot.removeClass('loading').addClass('error');
            return;
        }

        window.IDE.appData = cleaned.data;
        window.IDE.renderPivot(cleaned.data, cleaned.convertedNumericCols);

        $('#header-toolbar').css('display', 'flex');

        if (!window.IDE.isPivotView && window.IDE.tabulatorTable) {
            try {
                window.IDE.tabulatorTable.setData(window.IDE.appData);
            } catch (tabErr) {
                console.error('[IDE Tabulator setData]', tabErr);
            }
        }

        var recordCount = cleaned.data.length.toLocaleString();
        $statusText
            .text('Loaded ' + recordCount + ' clean rows from ' + sourceName)
            .css('color', 'var(--text-muted)');
        $statusDot.removeClass('loading error').addClass('active');

        } catch (err) {
            window.IDE.showError('File Processing', err);
            $statusDot.removeClass('loading').addClass('error');
        }
    }

    // Handle CSV File Selection and Parsing
    $('#csv-file-input').change(function(e) {
        var file = e.target.files[0];
        if (!file) return;

        var $statusText = $('#data-status span:last-child');
        var $statusDot = $('#data-status .status-dot');

        $statusText.text('Parsing ' + file.name + '...').css('color', 'var(--primary)');
        $statusDot.removeClass('active error').addClass('loading');

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: 'greedy',
            complete: function(results) {
                processParseResults(results, file.name);
                $('#csv-file-input').val('');
            },
            error: function(err) {
                console.error('Fatal PapaParse Error:', err);
                $statusText.text('Fatal Error parsing CSV.').css('color', '#ef4444');
                $statusDot.removeClass('loading').addClass('error');
            }
        });
    });

    // Handle Load Sample Data Button
    $('#btn-load-sample').click(function() {
        var $statusText = $('#data-status span:last-child');
        var $statusDot = $('#data-status .status-dot');

        $statusText.text('Loading sample data...').css('color', 'var(--primary)');
        $statusDot.removeClass('active error').addClass('loading');

        Papa.parse('sample-csv/Sales_Invoice_Report.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: 'greedy',
            complete: function(results) {
                processParseResults(results, 'Sales_Invoice_Report.csv');
            },
            error: function(err) {
                console.error('Fatal PapaParse Error:', err);
                $statusText.text('Failed to load sample data.').css('color', '#ef4444');
                $statusDot.removeClass('loading').addClass('error');
            }
        });
    });

    // Auto-load sample data on page load
    $('#btn-load-sample').trigger('click');

});
