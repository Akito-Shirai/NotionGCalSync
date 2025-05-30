function test_createCalendarEvent() {
  const calendar = CalendarApp.getCalendarById(TARGET_CALENDAR_ID);
  const title = "Test Event";
  const start = new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

  try {
    const event = createCalendarEvent(calendar, title, start, end);
    Logger.log(`✅ createCalendarEvent success: ID = ${event.getId()}`);
  } catch (e) {
    Logger.log(`❌ createCalendarEvent failed: ${e.message}`);
  }
}

function test_updateCalendarEvent() {
  const calendar = CalendarApp.getCalendarById(TARGET_CALENDAR_ID);
  const events = calendar.getEventsForDay(new Date());
  const testEvent = events.find((e) => e.getTitle() === "Test Event");

  if (!testEvent) {
    Logger.log("⚠️ No 'Test Event' found to update");
    return;
  }

  try {
    const newTitle = "Updated Test Event";
    const newStart = new Date();
    const newEnd = new Date(newStart.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    updateCalendarEvent(testEvent, newTitle, newStart, newEnd);
    Logger.log("✅ updateCalendarEvent success");
  } catch (e) {
    Logger.log(`❌ updateCalendarEvent failed: ${e.message}`);
  }
}
