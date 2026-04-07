/**
 * Analyze CSV columns to auto-generate a suitable pivot layout.
 * Classifies columns as date, value, low-cardinality, high-cardinality, or ID.
 */
window.IDE.analyzeColumns = function(data, preferredNumericCols) {
    var result = { dateCol: null, valueCols: [], lowCardCols: [], highCardCols: [], idCols: [] };

    try {

    if (!data || data.length === 0 || !data[0]) return result;

    var keys = Object.keys(data[0]);
    var totalRows = data.length;

    keys.forEach(function(key) {
        var nonEmpty = data.filter(function(r) {
            return r[key] !== null && r[key] !== undefined && r[key] !== '';
        });
        if (nonEmpty.length === 0) return;

        // Financial columns (comma-formatted numbers that were converted)
        if (preferredNumericCols.includes(key)) {
            result.valueCols.push(key);
            return;
        }

        // Date columns
        var dateCount = nonEmpty.filter(function(r) {
            var v = String(r[key]).trim();
            return /^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}$/.test(v) ||
                   /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(v);
        }).length;
        if (dateCount / nonEmpty.length >= 0.8) {
            if (!result.dateCol) result.dateCol = key;
            return;
        }

        // Native numeric columns can be either measures or identifiers.
        // Treat integer-like, highly unique ID/code fields as IDs; everything
        // else is a candidate measure for default aggregation.
        if (nonEmpty.every(function(r) { return typeof r[key] === 'number'; })) {
            var uniqueRatio = new Set(nonEmpty.map(function(r) { return r[key]; })).size / nonEmpty.length;
            var allIntegers = nonEmpty.every(function(r) { return Number.isInteger(r[key]); });
            var keyLooksLikeId = /(id|code|number|num|no|ref|key)$/i.test(key.trim());

            if (keyLooksLikeId || (allIntegers && uniqueRatio >= 0.95)) {
                result.idCols.push(key);
            } else {
                result.valueCols.push(key);
            }
            return;
        }

        // Text columns — classify by cardinality
        var uniqueVals = new Set(nonEmpty.map(function(r) { return r[key]; })).size;
        if (uniqueVals <= Math.max(totalRows * 0.5, 20)) {
            result.lowCardCols.push(key);
        } else {
            result.highCardCols.push(key);
        }
    });

    return result;

    } catch (err) {
        window.IDE.showError('Column Analysis', err);
        return result;
    }
};
