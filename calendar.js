// === calendar.gs ===

/*----------------------------------------------------------------
Create a new calendar event
<Variables>
- calendar: Google Calendar object
- title: Event title
- start: Start date/time
- end: End date/time (optional)
----------------------------------------------------------------*/
function createCalendarEvent(calendar, title, start, end) {
  return end
    ? calendar.createEvent(title, start, end)
    : calendar.createAllDayEvent(title, start);
}

/*----------------------------------------------------------------
Update an existing calendar event
<Variables>
- event: Calendar event object
- title: Updated title
- start: Updated start time
- end: Updated end time (optional)
----------------------------------------------------------------*/
function updateCalendarEvent(event, title, start, end) {
  event.setTitle(title);
  if (end) {
    event.setTime(start, end);
  } else {
    event.setAllDayDate(start);
  }
}

/*----------------------------------------------------------------
Delete Google Calendar events that are no longer present in Notion
<Variables>
- notionEventIds: Array of all valid event IDs from Notion
- calendar: Google Calendar object
- now: Current date/time
- oneYearAhead: One year from now
- events: List of calendar events within range
- id: ID of each event
- logEntries: Array to collect log rows
----------------------------------------------------------------*/
function cleanUpDeletedCalendarEvents(logEntries, now) {
  const notionEventIds = fetchNotionEventIds();
  // const calendar = CalendarApp.getDefaultCalendar();
  const calendar = CalendarApp.getCalendarById(TARGET_CALENDAR_ID);
  const oneYearAhead = new Date();
  oneYearAhead.setFullYear(now.getFullYear() + 1);

  const events = calendar.getEvents(now, oneYearAhead);
  events.forEach((event) => {
    const id = event.getId();
    if (!notionEventIds.includes(id)) {
      try {
        event.deleteEvent();
        logEntries.push([
          now,
          "Deleted",
          event.getTitle(),
          event.getStartTime(),
          event.getEndTime(),
          "",
        ]);
      } catch (e) {
        logEntries.push([
          now,
          "Delete Failed",
          event.getTitle(),
          event.getStartTime(),
          event.getEndTime(),
          e.message,
        ]);
      }
    }
  });
}
