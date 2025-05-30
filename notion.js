// === notion.gs ===
/*----------------------------------------------------------------
Fetch tasks from Notion that meet specified criteria
<Variables>
- payload: Query filter object for Notion API
- options: HTTP request settings
- res: HTTP response from Notion
- results: List of matching Notion pages
----------------------------------------------------------------*/
function fetchNotionTasks() {
  const payload = {
    filter: {
      and: [
        {
          property: "isDated",
          formula: {
            string: { equals: "Y" },
          },
        },
        {
          or: [
            {
              property: "Status",
              select: { equals: "Not Started" },
            },
            {
              property: "Status",
              select: { equals: "In Progress" },
            },
          ],
        },
      ],
    },
  };

  const options = {
    method: "post",
    payload: JSON.stringify(payload),
    headers: {
      Authorization: "Bearer " + NOTION_TOKEN,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    muteHttpExceptions: true,
  };

  const res = UrlFetchApp.fetch(
    `https://api.notion.com/v1/databases/${MAIN_DB_ID}/query`,
    options,
  );

  // Error Check
  if (res.getResponseCode() !== 200) {
    Logger.log("HTTP" + res.getResponseCode());
    Logger.log(res.getContentText());
    throw new Error("Notion query failed");
  }

  return JSON.parse(res.getContentText()).results;
}

/*----------------------------------------------------------------
Update Notion page with corresponding Google Calendar event ID and sync time
<Variables>
- pageId: ID of the Notion page to update
- eventId: ID of the Google Calendar event to set in Notion
- syncTime: Timestamp of synchronization
----------------------------------------------------------------*/
function updateNotionPage(pageId, eventId, syncTime) {
  const body = {
    properties: {
      CalendarEventId: {
        rich_text: [{ text: { content: eventId } }],
      },
      LastSyncedTime: {
        date: { start: syncTime.toISOString() },
      },
    },
  };
  UrlFetchApp.fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "patch",
    payload: JSON.stringify(body),
    headers: {
      Authorization: "Bearer " + NOTION_TOKEN,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
  });
}

/*----------------------------------------------------------------
Fetch calendar_event_ids from current Notion tasks
<Variables>
- page: Individual Notion task
- id: Extracted calendar_event_id
----------------------------------------------------------------*/
function fetchNotionEventIds() {
  return fetchNotionTasks()
    .map((p) => p.properties.CalendarEventId?.rich_text?.[0]?.plain_text)
    .filter((id) => id);
}
