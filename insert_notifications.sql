-- Insert statements for notifications from notificationPanel.tsx
-- Note: Replace USER_ID_PLACEHOLDER with actual user UUIDs or use a specific user ID

-- Notification 1: "הודעה למתנדבים"
INSERT INTO notification (
    id,
    user_id,
    title,
    message,
    date,
    read,
    created_at,
    created_by
) VALUES (
    uuid_generate_v4(),
    'cc64fcef-5edb-4ad7-b8ef-e205e4d8fafd', -- Replace with actual user_id
    'הודעה למתנדבים',
    'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית לפרומי בלוף קינץ תתיח לרעח. לת צשחמי צש בליא, מנסוטו צמלח לביקו ננבי, צמוקו בלוקריה שיצמה ברורק.',
    '2025-07-11 14:45:00+00'::timestamp with time zone,
    FALSE,
    '2025-07-11 14:45:00+00'::timestamp with time zone,
    '2c722ede-eb04-413f-b30b-aec09fa83caa' -- System user
);

-- Notification 2: "בקשת השיבוץ שלך אושרה 😃"
INSERT INTO notification (
    id,
    user_id,
    title,
    message,
    date,
    read,
    created_at,
    created_by
) VALUES (
    uuid_generate_v4(),
    'cc64fcef-5edb-4ad7-b8ef-e205e4d8fafd', -- Replace with actual user_id
    'בקשת השיבוץ שלך אושרה 😃',
    'שובצת למשמרת ערב ביום רביעי (16/7/2025) בנה״ז ת״א 2.',
    '2025-07-08 11:17:00+00'::timestamp with time zone,
    FALSE,
    '2025-07-08 11:17:00+00'::timestamp with time zone,
    '2c722ede-eb04-413f-b30b-aec09fa83caa' -- System user
);

-- Notification 3: "בקשת השיבוץ שלך נדחתה ☹️"
INSERT INTO notification (
    id,
    user_id,
    title,
    message,
    date,
    read,
    created_at,
    created_by
) VALUES (
    uuid_generate_v4(),
    'cc64fcef-5edb-4ad7-b8ef-e205e4d8fafd', -- Replace with actual user_id
    'בקשת השיבוץ שלך נדחתה ☹️',
    'לצערנו לא ניתן לשבץ אותך למשמרת בוקר ביום שישי (18/7/2025) בנה״ז נט״ן ת״א 1. בכל שאלה או הבהרה אנא פני לרכז שלך.',
    '2025-07-06 08:32:00+00'::timestamp with time zone,
    FALSE,
    '2025-07-06 08:32:00+00'::timestamp with time zone,
    '2c722ede-eb04-413f-b30b-aec09fa83caa' -- System user
);

