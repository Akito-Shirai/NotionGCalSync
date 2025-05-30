# 📆 Notion to Google Calendar Sync (GAS)

This Google Apps Script (GAS) project synchronizes tasks from a Notion database to Google Calendar and logs all actions to a Google Spreadsheet. It's designed for task tracking, calendar integration, and historical logging.

---

## 📁 Project Structure

| File          | Purpose                                                          |
| ------------- | ---------------------------------------------------------------- |
| `main.gs`     | Entry point for syncing Notion tasks to Google Calendar          |
| `notion.gs`   | Handles fetching and updating tasks from Notion                  |
| `calendar.gs` | Creates, updates, and deletes calendar events                    |
| `log.gs`      | Writes sync logs to a Google Spreadsheet                         |
| `config.gs`   | **Contains private configuration constants (excluded from Git)** |

> ⚠️ `config.gs` is excluded from version control. Each user must create it individually based on their environment.

---

## 🚀 Features

- Fetches tasks from a Notion database using specific filters (`Status`, `isDated`)
- Creates or updates events in Google Calendar
- Deletes calendar events that no longer exist in Notion
- Logs all actions (created, updated, deleted, failed) to a Google Spreadsheet

---

## 1. Clone This Repository

```bash
git clone https://github.com/your-username/notion-calendar-sync.git
```

---

## 2. Set Up Your Google Apps Script Project

### 2.1 Create a new GAS project:

1. Visit [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Upload all `.gs` files from this repository **except `config.gs`**
4. Manually create and define `config.gs` as described below

---

## 3. Configure `config.gs` (Local Only)

This file is excluded via `.gitignore`. You must define the following constants in your own environment:

```javascript
const NOTION_TOKEN = "ntn_XXXXXXXXXXXXXXXXXXXXXXXX"; // Your Notion integration token
const MAIN_DB_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"; // Main Notion database ID
const ARCHIVE_DB_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"; // Archive DB ID (optional)
const TARGET_CALENDAR_ID = "your_calendar_id@group.calendar.google.com"; // Calendar ID
const NOTION_VERSION = "2022-06-28"; // Notion API version
const LOG_SHEET_NAME = "SyncLog"; // Log sheet name
const SPREADSHEET_ID = "your_spreadsheet_id"; // Google Spreadsheet ID
```

📌 Ensure that the Notion integration has been invited to the database via the Notion UI.
📌 The target calendar and spreadsheet must already exist and be accessible from the script.

---

## 4. Required Notion Database Properties

This project assumes the following structure and property names in the Notion database:

| Property Name     | Type               | Description                                                 |
| ----------------- | ------------------ | ----------------------------------------------------------- |
| `ItemName`        | `title`            | Task title                                                  |
| `Date`            | `date`             | Task date or start/end timestamps                           |
| `Status`          | `select`           | Task status (see note below)                                |
| `CalendarEventId` | `rich_text`        | Stores the Google Calendar event ID                         |
| `LastSyncedTime`  | `date`             | The timestamp of the last successful sync to Calendar       |
| `LastEditedTime`  | `last_edited_time` | (Read-only) Auto-populated timestamp of last edit in Notion |
| `isDated`         | `formula`          | Returns `"Y"` for tasks that should be synced               |

### ⚠️ Status field assumptions

By default, the script expects the `Status` property to include the following options:

- `Not Started`
- `In Progress`
- `Complete`
- `Pending`
- `Cancelled`

Only `Not Started` and `In Progress` tasks are considered for synchronization.
If your Notion database uses different labels or naming conventions, you must **update the filter logic** in `notion.gs` accordingly, inside the `fetchNotionTasks()` function.

---

## 5. Core Functionality

- ✅ Fetches upcoming or ongoing tasks from Notion
- ✅ Creates or updates Google Calendar events
- ✅ Deletes events from the calendar if they no longer exist in Notion
- ✅ Logs all changes to a designated Google Spreadsheet

---

## 6. Logging

All actions are logged in a specified Google Spreadsheet sheet (`LOG_SHEET_NAME`). If the sheet does not exist, it will be automatically created.

### Log Entry Format:

| Column    | Description                                  |
| --------- | -------------------------------------------- |
| Timestamp | When the action occurred                     |
| Action    | `Created`, `Updated`, `Deleted`, or `Failed` |
| Title     | Task title                                   |
| Start     | Start date/time                              |
| End       | End date/time (optional)                     |
| Error     | Error message, if any                        |

---

## 7. Automation (Optional)

To automatically sync tasks at regular intervals, use GAS’s built-in trigger system:

### How to set up a time-based trigger:

1. Open the GAS project
2. Click the ⏰ “Triggers” icon
3. Select the `syncNotionToGoogle` function
4. Choose “Time-driven” trigger and set a schedule (e.g., every day at 8 AM)

---

## 8. Important Notes

- `config.gs` must be created locally for each environment. It is not tracked in version control.
- Ensure property names and types in Notion match what the script expects.
- The script must have access to the designated Google Calendar and Spreadsheet.

---

## 9. License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
