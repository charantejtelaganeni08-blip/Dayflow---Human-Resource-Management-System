```sql
-- ============================================================
-- DAYFLOW HRMS - RLS AUTO-ENABLE EVENT TRIGGER
-- ============================================================
-- Automatically enables Row Level Security on newly created
-- tables in the public schema.
-- ============================================================

CREATE EVENT TRIGGER ensure_rls
ON ddl_command_end
WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
EXECUTE FUNCTION public.rls_auto_enable();

-- ============================================================
-- END OF EVENT TRIGGER
-- ============================================================
```
