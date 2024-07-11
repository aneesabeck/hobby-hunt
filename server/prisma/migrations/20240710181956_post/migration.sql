-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- CREATE OR REPLACE FUNCTION notify_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     PERFORM pg_notify('new_user', row_to_json(NEW)::text)
--     RETURN NEW;
-- END
-- $$ LANGUAGE plpgsql

-- CREATE OR REPLACE FUNCTION notify_new_post()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     PERFORM pg_notify('new_post', row_to_json(NEW)::text)
--     RETURN NEW;
-- END
-- $$ LANGUAGE plpgsql

-- CREATE TRIGGER new_user_trigger
-- AFTER INSERT ON "User"
-- FOR EACH ROW EXECUTE PROCEDURE notify_new_user()

-- CREATE TRIGGER new_post_trigger
-- AFTER INSERT ON "Post"
-- FOR EACH ROW EXECUTE PROCEDURE notify_new_post()
