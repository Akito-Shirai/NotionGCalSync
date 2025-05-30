function test_fetchNotionTasks() {
  try {
    const tasks = fetchNotionTasks();
    Logger.log(`✅ fetchNotionTasks success: ${tasks.length} tasks fetched`);
    tasks.forEach((task, idx) => {
      Logger.log(
        `${idx + 1}: ${task.properties.ItemName?.title[0]?.plain_text}`,
      );
    });
  } catch (e) {
    Logger.log(`❌ fetchNotionTasks failed: ${e.message}`);
  }
}

function test_updateNotionPage() {
  const dummyPageId = "your_page_id_here";
  const dummyEventId = "dummy_event_id";
  const now = new Date();

  try {
    updateNotionPage(dummyPageId, dummyEventId, now);
    Logger.log("✅ updateNotionPage success");
  } catch (e) {
    Logger.log(`❌ updateNotionPage failed: ${e.message}`);
  }
}

function test_fetchNotionEventIds() {
  try {
    const ids = fetchNotionEventIds();
    Logger.log(`✅ fetchNotionEventIds: ${ids.length} IDs found`);
    ids.forEach((id, idx) => Logger.log(`${idx + 1}: ${id}`));
  } catch (e) {
    Logger.log(`❌ fetchNotionEventIds failed: ${e.message}`);
  }
}
