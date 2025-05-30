/*----------------------------------------------------------------
Write log entries to the designated Google Sheet
<Variables>
- logEntries: Array of [timestamp, action, title, start, end, (optional) error]
----------------------------------------------------------------*/
function writeLogToSheet(logEntries) {
  const sheet = getOrCreateLogSheet();
  if (logEntries.length > 0) {
    sheet
      .getRange(
        sheet.getLastRow() + 1,
        1,
        logEntries.length,
        logEntries[0].length,
      )
      .setValues(logEntries);
  }
}

/*----------------------------------------------------------------
Create or retrieve the logging sheet
<Variables>
- ss: Active spreadsheet
- sheet: Target log sheet
----------------------------------------------------------------*/
function getOrCreateLogSheet() {
  // const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(LOG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(LOG_SHEET_NAME);
    sheet.appendRow(["Timestamp", "Action", "Title", "Start", "End", "Error"]);
  }
  return sheet;
}
