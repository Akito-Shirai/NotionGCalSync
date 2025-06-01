// === main.gs ===
/*----------------------------------------------------------------
Main synchronization function: fetch tasks from Notion and reflect them in Google Calendar
Skips update if Notion task was not edited since last sync
<Variables>
- pages: List of Notion tasks fetched via API
- calendar: User's default Google Calendar
- prop: Properties of each Notion page
- title: Task title
- dateProp: Date property from Notion
- pageId: Notion page ID
- start: Start date/time
- end: End date/time (optional)
- eventId: Existing Google Calendar event ID (if any)
- lastEditedTime: Timestamp of last edit in Notion
- lastSyncedTime: Timestamp of last sync stored in Notion
----------------------------------------------------------------*/
function syncNotionToGoogle() {
  const pages = fetchNotionTasks();
  // const calendar = CalendarApp.getDefaultCalendar();
  const calendar = CalendarApp.getCalendarById(TARGET_CALENDAR_ID);
  const logEntries = [];
  const now = new Date();

  pages.forEach((p) => {
    const prop = p.properties;
    const title = prop.ItemName.title[0]?.plain_text || "Untitled";
    const dateProp = prop.Date?.date;
    const pageId = p.id;

    if (!dateProp || !dateProp.start) return;

    const start = new Date(dateProp.start);
    const end = dateProp.end ? new Date(dateProp.end) : null;
    const eventId = prop.CalendarEventId?.rich_text?.[0]?.plain_text;

    const lastEditedTime = new Date(p.last_edited_time);
    const lastSyncedTimeStr = prop.LastSyncedTime?.date?.start;
    const lastSyncedTime = lastSyncedTimeStr
      ? new Date(lastSyncedTimeStr)
      : null;
    const logTime = `(lastEdited: ${lastEditedTime}, lastSynced: ${lastSyncedTime})`;

    // Skip if not updated
    if (
      lastSyncedTime &&
      lastEditedTime.getTime() <= lastSyncedTime.getTime()
    ) {
      /*
      logEntries.push([
        now,
        "Skipped",
        title,
        start,
        end,
        `No update needed ${logTime}`,
      ]);*/
      return;
    }

    try {
      let event;
      if (eventId) {
        event = calendar.getEventById(eventId);
        if (!event) throw new Error("Event not found");
        updateCalendarEvent(event, title, start, end);
        logEntries.push([now, "Updated", title, start, end, logTime]);
      } else {
        event = createCalendarEvent(calendar, title, start, end);
        logEntries.push([now, "Created", title, start, end, ""]);
      }

      updateNotionPage(pageId, event.getId(), new Date());
    } catch (e) {
      Logger.log(`Event sync failed: ${title}, ${e.message}`);
      logEntries.push([now, "Failed", title, start, end, e.message]);
    }
  });

  cleanUpDeletedCalendarEvents(logEntries, now);
  writeLogToSheet(logEntries);
}
