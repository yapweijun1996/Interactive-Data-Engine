/**
 * Raw data view with Tabulator grid, search, and column visibility toggle.
 */
$(document).ready(function() {

    window.IDE.initTabulator = function() {
        try {
        if (window.IDE.tabulatorTable) {
            window.IDE.tabulatorTable.setData(window.IDE.appData);
            return;
        }

        window.IDE.tabulatorTable = new Tabulator("#long-table-output", {
            data: window.IDE.appData,
            autoColumns: true,
            nestedFieldSeparator: false,
            autoColumnsDefinitions: function(defs) {
                defs.forEach(function(col) {
                    // Check if this column contains any numeric values
                    var hasNumeric = window.IDE.appData.some(function(r) {
                        var v = r[col.field];
                        if (v === null || v === undefined || v === '') return false;
                        if (typeof v === 'number') return true;
                        if (typeof v === 'string') return /^-?[\d,]+(\.\d+)?$/.test(v.trim());
                        return false;
                    });
                    if (hasNumeric) {
                        col.formatter = function(cell) {
                            var v = cell.getValue();
                            if (v === null || v === undefined || v === '') return '';
                            var num = (typeof v === 'string') ? parseFloat(v.replace(/,/g, '')) : Number(v);
                            if (isNaN(num)) return v;
                            return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        };
                        col.hozAlign = "right";
                    }
                });
                return defs;
            },
            layout: "fitDataFill",
            height: "calc(100vh - 220px)",
            pagination: "local",
            paginationSize: 50,
            paginationSizeSelector: [25, 50, 100, true],
            movableColumns: true,
            resizableColumnFit: true,
            columnDefaults: {
                headerSort: true,
            },
        });

        } catch (err) {
            window.IDE.showError('Raw Data View', err);
            $('#long-table-output').html(
                '<div style="padding: 2rem; text-align: center; color: #ef4444;">' +
                '<p><strong>Failed to initialize data grid.</strong></p>' +
                '<p style="color: var(--text-muted); margin-top: 0.5rem;">Details logged to console.</p></div>'
            );
        }
    };

    // Global search for Raw Data view
    var searchTimeout;
    $('#raw-search').on('keyup', function() {
        clearTimeout(searchTimeout);
        var val = $(this).val().toLowerCase();
        searchTimeout = setTimeout(function() {
            try {
                if (!window.IDE.tabulatorTable) return;
                if (val === '') {
                    window.IDE.tabulatorTable.clearFilter();
                } else {
                    window.IDE.tabulatorTable.setFilter(function(data) {
                        return Object.values(data).some(function(v) {
                            return String(v).toLowerCase().includes(val);
                        });
                    });
                }
            } catch (err) {
                console.error('[IDE Search Filter]', err);
            }
        }, 200);
    });

    // Column visibility toggle
    $('#btn-columns').click(function(e) {
        e.stopPropagation();
        var $dropdown = $('#col-dropdown');
        if ($dropdown.is(':visible')) {
            $dropdown.hide();
            return;
        }
        if (!window.IDE.tabulatorTable) return;

        // Build checkbox list
        var cols = window.IDE.tabulatorTable.getColumns();
        var html = '<div class="col-dropdown-header">Toggle Columns</div>';
        cols.forEach(function(col) {
            var field = col.getField();
            var title = col.getDefinition().title || field;
            var checked = col.isVisible() ? 'checked' : '';
            html += '<label><input type="checkbox" data-field="' + field + '" ' + checked + '><span>' + title + '</span></label>';
        });
        $dropdown.html(html).show();
    });

    // Handle column checkbox change
    $(document).on('change', '#col-dropdown input[type="checkbox"]', function() {
        var field = $(this).data('field');
        if (!window.IDE.tabulatorTable) return;
        try {
            if ($(this).is(':checked')) {
                window.IDE.tabulatorTable.showColumn(field);
            } else {
                window.IDE.tabulatorTable.hideColumn(field);
            }
        } catch (err) {
            console.error('[IDE Column Toggle]', err);
        }
    });

    // Close column dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.col-toggle-wrapper').length) {
            $('#col-dropdown').hide();
        }
    });

});
