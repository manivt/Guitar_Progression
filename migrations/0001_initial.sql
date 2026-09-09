CREATE TABLE performances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    performance_date TEXT NOT NULL,
    song TEXT NOT NULL,
    artist TEXT,
    youtube_video_id TEXT NOT NULL,
    instrument TEXT,
    performance_type TEXT,
    location TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_performances_date ON performances(performance_date DESC);