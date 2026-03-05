# Interactive Data Engine

A powerful, browser-based tool for advanced data analysis and visualization. The Interactive Data Engine allows you to upload CSV files, generate dynamic pivot tables, and create interactive charts entirely locally within your web browser.

## Features

* **Client-Side Processing**: All data parsing and rendering happens in your browser. No data is sent to a server, ensuring your data remains private and secure.
* **Advanced Pivot Tables**: Intuitive drag-and-drop interface to slice and dice your data using [PivotTable.js](https://pivottable.js.org/).
* **Interactive Charting**: Built-in integration with [Plotly.js](https://plotly.com/javascript/) for rich, interactive data visualizations (Bar charts, Line charts, Scatter plots, etc.).
* **Raw Data Viewer**: View, sort, and filter your raw uploaded data using a high-performance [Tabulator](https://tabulator.info/) grid.
* **Smart Data Cleaning**: Automatically handles empty columns, junk columns, and formatting issues (like comma-separated financial numbers) upon upload.
* **Export Capabilities**: 
  * Export your pivot table configurations to CSV.
  * Export generated charts to PNG images.

## Technologies Used

* **HTML5, CSS3, JavaScript** (Vanilla + jQuery)
* **[PapaParse](https://www.papaparse.com/)**: For fast and reliable client-side CSV parsing.
* **[PivotTable.js](https://pivottable.js.org/)**: The core drag-and-drop pivot table functionality.
* **[Plotly.js](https://plotly.com/javascript/)**: For advanced rendering and interactive charting.
* **[Tabulator](https://tabulator.info/)**: For displaying the raw data in a sortable, filterable table.

## How to Use

1. Clone this repository or download the source code.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
3. Click the **"Upload CSV File"** button to load your dataset.
4. Use the drag-and-drop interface to configure your pivot table:
   * Drag fields to the **Rows** or **Columns** areas.
   * Select an **Aggregator** (e.g., Count, Sum, Average) and the target value field.
   * Change the **Renderer** to switch between table views and various charts.
5. Click **"View Raw Data"** to toggle between the pivot view and your underlying data.
6. Use the Export buttons to save your tables or charts.

## License

MIT License.
