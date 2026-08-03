-- Optional custom email signature per user. Appended after the generated email
-- body at send time. When null/empty we fall back to "Regards, <full name>".
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_signature text;
