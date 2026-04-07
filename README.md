# Interactive Data Engine

A powerful, browser-based tool for advanced data analysis and visualization. Upload CSV files, generate dynamic pivot tables, and create interactive charts — all processed locally in your browser with zero server dependencies.

## Features

- **Client-Side Processing** — All data parsing and rendering happens in your browser. No data is sent to any server, ensuring complete privacy.
- **Smart Data Cleaning** — Automatically removes empty columns, junk columns (`_1`, `__parsed_extra`), and converts comma-formatted financial numbers (e.g. `86,116.00` → `86116.00`).
- **Intelligent Auto-Layout** — Analyzes column types (date, numeric, categorical) and auto-configures the initial pivot table layout.
- **Advanced Pivot Tables** — Drag-and-drop interface powered by [PivotTable.js](https://pivottable.js.org/) with 20+ aggregator functions (Sum, Average, Median, etc.).
- **Interactive Charting** — 8+ chart types via [Plotly.js](https://plotly.com/javascript/) (Bar, Line, Scatter, Heatmap, Area, Pie, etc.).
- **Raw Data Viewer** — Sortable, filterable, paginated data grid via [Tabulator](https://tabulator.info/) with global search and column visibility toggle.
- **Sample Data** — One-click "Load Sample Data" button to explore the tool instantly.
- **Export** — CSV export (pivot table or raw data) and PNG export (charts).

## Project Structure

```
Interactive-Data-Engine/
├── index.html                  # Main HTML entry point (~100 lines)
├── css/
│   ├── variables.css           # CSS custom properties / design tokens
│   ├── layout.css              # Page layout (body, content-area, scrollbars)
│   ├── pivot.css               # PivotTable.js UI customization
│   ├── components.css          # Buttons, status indicators, upload header
│   └── tabulator-custom.css    # Tabulator grid + raw data controls
├── js/
│   ├── config.js               # Global window.IDE namespace + shared state
│   ├── column-analysis.js      # Column type detection (date/numeric/categorical)
│   ├── data-cleaning.js        # CSV cleaning pipeline
│   ├── pivot-renderer.js       # Pivot table config, rendering, layout fixes
│   ├── csv-handler.js          # File upload, PapaParse parsing, sample data
│   ├── export-handler.js       # CSV and PNG export logic
│   ├── raw-data-view.js        # Tabulator grid, search, column toggle
│   └── ui-controls.js          # Filter box positioning, UI/view toggle
├── libs/
│   ├── js/                     # jQuery, jQuery UI, PapaParse, PivotTable.js,
│   │                           # Plotly.js, Plotly renderers, Tabulator
│   ├── css/                    # PivotTable.js, Tabulator, Inter font styles
│   └── fonts/                  # Inter font (WOFF2)
├── sample-csv/
│   └── Sales_Invoice_Report.csv  # Sample dataset (100 rows, 10 columns)
├── task.md                     # Improvement roadmap
└── README.md
```

## Architecture

All application modules share state via the `window.IDE` namespace:

```
CSV Upload → PapaParse → IDE.cleanData() → IDE.analyzeColumns() → IDE.renderPivot()
                                                                        ↓
                                                              PivotTable.js UI
                                                              (drag-and-drop)
                                                                        ↓
                                                         Toggle → Tabulator Grid
```

**JS load order matters** (no build tools, no ES modules):
`config.js` → `column-analysis.js` → `data-cleaning.js` → `pivot-renderer.js` → `csv-handler.js` → `export-handler.js` → `raw-data-view.js` → `ui-controls.js`

## Technologies

| Library | Version | Purpose |
|---------|---------|---------|
| [jQuery](https://jquery.com/) | 3.6.0 | DOM manipulation |
| [jQuery UI](https://jqueryui.com/) | — | Drag-and-drop |
| [PapaParse](https://www.papaparse.com/) | — | CSV parsing |
| [PivotTable.js](https://pivottable.js.org/) | — | Pivot table UI |
| [Plotly.js](https://plotly.com/javascript/) | — | Interactive charts |
| [Tabulator](https://tabulator.info/) | — | Data grid |

## How to Use

1. Open `index.html` in any modern browser — or run a local server (`npx serve`).
2. Sample data loads automatically. Or click **Upload CSV File** to load your own.
3. Drag fields between **Available Fields**, **Row Fields**, **Column Fields**, and **Values**.
4. Select an aggregator (Sum, Count, Average, etc.) and value field.
5. Change the renderer in the toolbar dropdown (Table, Bar Chart, Line Chart, etc.).
6. Click **View Raw Data** to switch to the filterable data grid.
7. Click **Hide UI** to collapse the pivot controls and focus on the output.
8. Export via **Export to CSV** or **Export Chart** (PNG).

## License

MIT License.
