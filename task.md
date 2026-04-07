# Interactive Data Engine — Improvement Roadmap

**Date:** 2026-04-07  
**Status:** Planning

---

## Priority 1 — High Impact, Low Effort

### Task 1: Excel (.xlsx) Import Support
- [ ] Add SheetJS (xlsx.js) library
- [ ] Update file input to accept `.xlsx, .xls, .csv`
- [ ] Parse Excel sheets and feed into existing data pipeline
- [ ] Handle multi-sheet files (sheet selector UI)
- **Why:** Most users have Excel files, not CSV. This is the #1 missing feature.

### Task 2: Drag-and-Drop File Upload
- [ ] Add dragover/dragleave/drop event listeners on upload area
- [ ] Show visual drop zone highlight on drag
- [ ] Process dropped file same as file input
- **Why:** Standard UX expectation for file upload.

### Task 3: Row Count & Data Summary
- [ ] Show total row count in status bar after upload (e.g. "1,234 rows loaded")
- [ ] Show column count
- [ ] Show quick summary: numeric columns (min/max/avg), text columns (unique count)
- **Why:** Users need to confirm data loaded correctly.

### Task 4: Negative Number Formatting (Red)
- [ ] Detect negative numbers in pivot table cells and add CSS class
- [ ] Detect negative numbers in Tabulator cells and apply red color
- [ ] Style: red text or red background for negative values
- **Why:** Essential for financial data analysis.

---

## Priority 2 — High Impact, Medium Effort

### Task 5: KPI / Scorecard Renderer
- [ ] Create custom PivotTable.js renderer for KPI cards
- [ ] Display single metric as large number with label
- [ ] Optional: trend arrow (up/down), comparison to previous period
- [ ] Responsive grid layout for multiple KPI cards
- **Why:** Transforms the tool from a table viewer into a dashboard.

### Task 6: Chart Title Auto-Generation
- [ ] Generate title from pivot config (e.g. "Sum of Revenue by Region")
- [ ] Display above Plotly charts
- [ ] Include in PNG export
- **Why:** Exported charts without titles are unusable in presentations.

### Task 7: Color Theme Picker for Charts
- [ ] Add theme dropdown (e.g. Default, Corporate, Pastel, Dark)
- [ ] Apply Plotly colorway based on selection
- [ ] Persist theme choice in localStorage
- **Why:** Default Plotly colors look generic and unprofessional.

---

## Priority 3 — Medium Impact, Medium Effort

### Task 8: Calculated Fields
- [ ] Add "Add Calculated Field" button in pivot UI
- [ ] Simple formula builder (field A +/-/×/÷ field B)
- [ ] Inject calculated column into data before pivot renders
- **Why:** Users frequently need derived metrics (Profit = Revenue - Cost).

### Task 9: Top N Filter
- [ ] Add "Top N" option in field filter dropdown
- [ ] Allow user to select top/bottom N by a value column
- [ ] Apply filter before pivot renders
- **Why:** Large datasets need quick focus on top performers.

### Task 10: Enhanced Date Parsing
- [ ] Support formats: `DD-MMM-YYYY`, `YYYY-MM-DDTHH:mm:ss`, `DD/MM/YYYY`
- [ ] Auto-detect date format per column
- [ ] Add date grouping options (Year, Quarter, Month, Week)
- **Why:** Current parser misses many common date formats.

### Task 11: Export Enhancements
- [ ] Add SVG export option for charts
- [ ] Add PDF export (html2canvas + jsPDF or similar)
- [ ] Add `@media print` CSS for print-friendly view
- **Why:** PNG is not enough for professional reports.

---

## Priority 4 — Nice to Have

### Task 12: Share as Link
- [ ] Encode pivot config in URL hash (base64)
- [ ] "Copy Link" button in toolbar
- [ ] On page load, detect hash and restore config
- **Why:** Easy collaboration without file sharing.

### Task 13: Save Multiple Configurations
- [ ] "Save Layout" button with name input
- [ ] Dropdown to switch between saved layouts
- [ ] Store in localStorage as array
- **Why:** Users analyze same data from different angles.

### Task 14: Raw Data Enhancements
- [ ] Column-specific filters (numeric range, text contains)
- [ ] Inline cell editing (Tabulator supports it)
- [ ] Row selection and bulk actions
- **Why:** Power users need more control over data inspection.

### Task 15: Code Architecture Refactor
- [x] Split into separate files: `styles.css`, `app.js`, `data-utils.js`
- [x] Add error boundaries / try-catch for Plotly and Tabulator
- [ ] Add localStorage quota check before saving
- **Why:** 1,750 lines in one file is hard to maintain.

---

## Additional Chart Types to Consider

| Chart Type | Use Case | Library |
|-----------|----------|---------|
| Treemap | Hierarchical breakdown (region > product) | Plotly (built-in) |
| Funnel | Sales pipeline stages | Plotly (built-in) |
| Gauge / Donut | Progress, ratios, KPIs | Plotly (built-in) |
| Combo (Bar + Line) | Volume vs trend comparison | Plotly (built-in) |
| Waterfall | Financial flow (revenue → expenses → profit) | Plotly (built-in) |
| Sankey | Flow between categories | Plotly (built-in) |

---

## Completed

### QA Fixes (2026-04-07)
- [x] Fix: Invoice No. & Inv. Date empty in Raw Data (nestedFieldSeparator)
- [x] Fix: Inconsistent number formatting in Raw Data (autoColumnsDefinitions)
- [x] Fix: Duplicate renderer dropdown (clear host before move)
- [x] UI: Toolbar redesign (ghost buttons, container background)
- [x] UI: Renderer dropdown moved to top position

### Error Boundaries (2026-04-07)
- [x] Added `showError()` utility for unified error display in status bar
- [x] Wrapped data cleaning pipeline with fallback to raw data
- [x] Wrapped column analysis with empty-data guard + fallback
- [x] Wrapped pivot render with inline error message fallback
- [x] Wrapped pivot `onRefresh` DOM layout manipulations
- [x] Wrapped CSV file processing pipeline (complete callback)
- [x] Wrapped Tabulator init, search filter, and column toggle
- [x] Wrapped CSV export (pivot + raw data) and Plotly PNG export
- [x] Wrapped view toggle and filter box positioning
- [x] Protected `localStorage` operations (setItem already had try-catch, added removeItem)
