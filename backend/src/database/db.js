const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./smart_monitor.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("SQLite connected");
    }
});

db.run(`
CREATE TABLE IF NOT EXISTS smart_logs (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

    drive_type TEXT,

    model TEXT,

    health_score INTEGER,

    failure_probability REAL,

    temperature INTEGER,

    power_on_hours INTEGER,

    raw_read_error_rate INTEGER,
    spin_up_time INTEGER,
    start_stop_count INTEGER,
    reallocated_sectors INTEGER,
    seek_error_rate INTEGER,
    spin_retry_count INTEGER,
    power_cycle_count INTEGER,
    reported_uncorrect INTEGER,
    load_cycle_count INTEGER,
    pending_sectors INTEGER,
    offline_uncorrectable INTEGER,
    crc_error_count INTEGER,

    critical_warning INTEGER,
    available_spare INTEGER,
    available_spare_threshold INTEGER,
    percentage_used INTEGER,
    unsafe_shutdowns INTEGER,
    media_errors INTEGER,
    data_units_read INTEGER,
    data_units_written INTEGER
)
`);

module.exports = db;