-- Menambahkan kolom history pembayaran ke tabel work
-- Struktur JSONB yang akan disimpan: [{ "amount": 5000000, "date": "2024-03-15T..." }]

ALTER TABLE work
ADD COLUMN IF NOT EXISTS payment_history JSONB DEFAULT '[]'::jsonb;
