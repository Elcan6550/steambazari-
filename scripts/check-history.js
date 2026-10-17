const fs = require('fs');
const path = require('path');
const historyPath = path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data', 'Default', 'History');
const dest = path.join(process.env.TEMP, 'ch_hist.db');

try {
  fs.copyFileSync(historyPath, dest);
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database(dest);
  db.all("SELECT url, title, datetime(last_visit_time/1000000-11644473600, 'unixepoch', 'localtime') as time FROM urls ORDER BY last_visit_time DESC LIMIT 15", (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log(JSON.stringify(rows, null, 2));
    }
    db.close();
  });
} catch (e) {
  console.error(e.message);
}
