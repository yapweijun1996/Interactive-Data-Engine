/**
 * Export functionality for CSV (pivot + raw data) and PNG (charts).
 */
$(document).ready(function() {

    // Handle CSV Export Button Click
    $('#btn-export-csv').click(function() {
        try {
        // If we are currently viewing the Raw Data (Long Table), export from Tabulator
        if (!window.IDE.isPivotView) {
            if (window.IDE.tabulatorTable) {
                window.IDE.tabulatorTable.download("csv", "raw_data_export.csv");
            } else {
                alert("No raw data available to export.");
            }
            return;
        }

        // Otherwise, export the Pivot Table view
        var $table = $('table.pvtTable');
        if ($table.length === 0) {
            alert("No pivot table to export. Please upload data first.");
            return;
        }

        var grid = [];
        var $rows = $table.find('tr');

        $rows.each(function(rowIndex) {
            if (!grid[rowIndex]) grid[rowIndex] = [];
            var colIndex = 0;

            $(this).find('th, td').each(function() {
                // Find the next available empty slot in this row's grid
                while (grid[rowIndex][colIndex] !== undefined) {
                    colIndex++;
                }

                var text = $(this).text().trim();
                text = '"' + text.replace(/"/g, '""') + '"'; // Escape quotes for CSV

                var rowspan = parseInt($(this).attr('rowspan')) || 1;
                var colspan = parseInt($(this).attr('colspan')) || 1;

                // Fill the grid according to row/col spans
                for (var r = 0; r < rowspan; r++) {
                    for (var c = 0; c < colspan; c++) {
                        if (!grid[rowIndex + r]) grid[rowIndex + r] = [];

                        // Place the actual text only in the top-left cell of the spanned area
                        if (r === 0 && c === 0) {
                            grid[rowIndex + r][colIndex + c] = text;
                        } else {
                            grid[rowIndex + r][colIndex + c] = '""';
                        }
                    }
                }
                colIndex += colspan;
            });
        });

        // Convert the 2D grid array into a CSV formatted string
        var csvContent = grid.map(function(row) {
            for (var i = 0; i < row.length; i++) {
                if (row[i] === undefined) row[i] = '""';
            }
            return row.join(',');
        }).join('\n');

        // Trigger the file download
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "pivot_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        } catch (err) {
            window.IDE.showError('CSV Export', err);
            alert('Failed to export CSV. See console for details.');
        }
    });

    // Handle Chart Export Button Click
    $('#btn-export-png').click(function() {
        var $chart = $('.js-plotly-plot');
        if ($chart.length === 0) {
            alert("No chart available to export. Please select a chart renderer (e.g., Bar Chart, Line Chart) first.");
            return;
        }

        try {
            var chartElement = $chart[0];
            Plotly.downloadImage(chartElement, {
                format: 'png',
                filename: 'pivot_chart_export'
            });
        } catch (err) {
            window.IDE.showError('Chart Export', err);
            alert('Failed to export chart. See console for details.');
        }
    });

});
