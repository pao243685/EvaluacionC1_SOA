
CREATE ROLE just_vw_role;

CREATE USER vw_user WITH PASSWORD 'annara20';

GRANT just_vw_role TO vw_user;

GRANT CONNECT ON DATABASE tarea5 TO just_vw_role;

GRANT USAGE ON SCHEMA public TO just_vw_role;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM just_vw_role;


GRANT SELECT ON
  vw_most_borrowed_books,
  vw_overdue_loans,
  vw_fines_summary,
  vw_member_activity,
  vw_inventory_health
TO just_vw_role;


ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO just_vw_role;
