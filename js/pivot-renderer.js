/**
 * Pivot table configuration and rendering.
 *
 * IMPORTANT: We do NOT rearrange PivotTable.js's DOM structure.
 * PivotTable.js rebuilds its entire DOM on every refresh (drag-and-drop,
 * aggregator change, etc.). Heavy DOM manipulation in onRefresh is fragile
 * and breaks on re-render.
 *
 * We only do two safe, idempotent operations:
 *   1. Wrap the output table for sticky headers
 *   2. Move the renderer dropdown to the toolbar
 *
 * Everything else is handled purely by CSS.
 */
$(document).ready(function() {

    window.IDE.getBaseOptions = function() {
        return {
            renderers: window.IDE.renderers,
            rendererName: "Table",
            onRefresh: function(config) {
                var configCopy = JSON.parse(JSON.stringify(config));
                delete configCopy["aggregators"];
                delete configCopy["renderers"];
                delete configCopy["dataClass"];
                delete configCopy["onRefresh"];

                try {
                    localStorage.setItem(window.IDE.configStorageKey, JSON.stringify(configCopy));
                } catch (e) {
                    console.error("Failed to save state to localStorage", e);
                }

                try {
                    // Wrap pvtTable for sticky headers
                    var $table = $('table.pvtTable');
                    if ($table.length > 0 && !$table.parent().hasClass('pvtTableWrapper')) {
                        $table.wrap('<div class="pvtTableWrapper"></div>');
                    }

                    // Move renderer dropdown to toolbar immediately
                    var $host = $('#renderer-host');
                    var $renderer = $('#pivot-table-output select.pvtRenderer');
                    if ($renderer.length && $host.length) {
                        $host.empty();
                        $renderer.appendTo($host);
                    }

                    // Move pvtUnused to TR0 first td, with rowspan=2
                    var $pvtUi = $('#pivot-table-output table.pvtUi');
                    var $tr0 = $pvtUi.find('tr').eq(0);
                    var $emptyCell = $tr0.find('td.pvtUiCell').not('.pvtVals').not('.pvtAxisContainer').first();
                    var $unused = $pvtUi.find('td.pvtAxisContainer.pvtUnused');
                    if ($unused.length && $emptyCell.length) {
                        $unused.attr('rowspan', 2);
                        $emptyCell.replaceWith($unused);
                    }

                } catch (err) {
                    console.error('[IDE Pivot Layout]', err);
                }
            }
        };
    };

    window.IDE.renderPivot = function(data, preferredNumericCols) {
        try {
            preferredNumericCols = preferredNumericCols || [];
            var options = window.IDE.getBaseOptions();

            try { localStorage.removeItem(window.IDE.configStorageKey); } catch (e) {}

            if (data.length > 0) {
                var analysis = window.IDE.analyzeColumns(data, preferredNumericCols);

                if (analysis.valueCols.length > 0) {
                    options.vals = [analysis.valueCols[analysis.valueCols.length - 1]];
                    options.aggregatorName = "Sum";
                }

                if (analysis.lowCardCols.length > 0) {
                    options.rows = [analysis.lowCardCols[0]];
                } else if (analysis.highCardCols.length > 0) {
                    options.rows = [analysis.highCardCols[0]];
                }

                if (analysis.dateCol) {
                    options.cols = [analysis.dateCol];
                } else if (analysis.lowCardCols.length > 1) {
                    options.cols = [analysis.lowCardCols[1]];
                }
            }

            $("#pivot-table-output").pivotUI(data, options, true);

        } catch (err) {
            window.IDE.showError('Pivot Render', err);
            $("#pivot-table-output").html(
                '<div style="padding: 2rem; text-align: center; color: #ef4444;">' +
                '<p><strong>Failed to render pivot table.</strong></p>' +
                '<p style="color: var(--text-muted); margin-top: 0.5rem;">Try re-uploading your file. Details logged to console.</p></div>'
            );
        }
    };

});
