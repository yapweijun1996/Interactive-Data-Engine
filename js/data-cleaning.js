/**
 * CSV data cleaning pipeline.
 * Removes empty columns, junk columns, converts comma-formatted numbers,
 * and filters empty rows.
 */
window.IDE.cleanData = function(rawData) {
    var convertedNumericCols = [];

    try {

    // 1. Remove entirely empty columns
    if (rawData.length > 0) {
        var allKeys = Object.keys(rawData[0]);
        var emptyKeys = allKeys.filter(function(key) {
            return rawData.every(function(row) {
                return row[key] === null || row[key] === undefined || row[key] === '';
            });
        });

        if (emptyKeys.length > 0) {
            console.log('Cleaned up ' + emptyKeys.length + ' completely empty columns:', emptyKeys);
            rawData.forEach(function(row) {
                emptyKeys.forEach(function(key) { delete row[key]; });
            });
        }
    }

    // 2. Remove junk/unnamed columns (e.g. "_1", "_2", "__parsed_extra")
    if (rawData.length > 0) {
        var junkKeys = Object.keys(rawData[0]).filter(function(key) {
            return /^_\d*$/.test(key) || key === '__parsed_extra' || key.trim() === '';
        });
        if (junkKeys.length > 0) {
            console.log('Cleaned up ' + junkKeys.length + ' junk columns:', junkKeys);
            rawData.forEach(function(row) {
                junkKeys.forEach(function(key) { delete row[key]; });
            });
        }
    }

    // 3. Convert comma-formatted number strings to actual numbers
    if (rawData.length > 0) {
        var remainingKeys = Object.keys(rawData[0]);
        remainingKeys.forEach(function(key) {
            var nonEmpty = rawData.filter(function(row) {
                return row[key] !== null && row[key] !== undefined && row[key] !== '';
            });
            if (nonEmpty.length === 0) return;
            var looksNumeric = nonEmpty.filter(function(row) {
                if (typeof row[key] !== 'string') return false;
                var val = row[key].trim();
                return /^-?[\d,]+(\.\d+)?$/.test(val);
            });
            // If at least 80% of non-empty values match, convert the whole column
            if (looksNumeric.length / nonEmpty.length >= 0.8) {
                convertedNumericCols.push(key);
                rawData.forEach(function(row) {
                    if (row[key] !== null && row[key] !== undefined && row[key] !== '') {
                        var parsed = parseFloat(String(row[key]).replace(/,/g, ''));
                        if (!isNaN(parsed)) {
                            row[key] = parsed;
                        }
                    }
                });
            }
        });
    }

    // 4. Remove rows that have no useful data
    var cleanedData = rawData.filter(function(row) {
        return Object.values(row).some(function(val) {
            return val !== null && val !== undefined && val !== '';
        });
    });

    return {
        data: cleanedData,
        convertedNumericCols: convertedNumericCols
    };

    } catch (err) {
        window.IDE.showError('Data Cleaning', err);
        // Return raw data as fallback so the app can still render
        return {
            data: rawData.filter(function(row) {
                return row && Object.keys(row).length > 0;
            }),
            convertedNumericCols: []
        };
    }
};
