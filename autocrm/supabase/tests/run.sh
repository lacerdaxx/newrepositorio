#!/usr/bin/env bash
# Aplica as migrations num Postgres descartável e roda os testes de RLS.
# Uso: PGHOST=/tmp PGPORT=54329 PGUSER=postgres ./supabase/tests/run.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB=autocrm_test
psql -v ON_ERROR_STOP=1 -q -d postgres -c "drop database if exists $DB" -c "create database $DB"
psql -v ON_ERROR_STOP=1 -q -d $DB -f tests/supabase-stub.sql 2>&1 | grep -v -E "wal_level|HINT" || true
for f in migrations/*.sql; do
  echo "→ $f"
  psql -v ON_ERROR_STOP=1 -q -d $DB -f "$f"
done
echo "→ tests/rls.test.sql"
psql -v ON_ERROR_STOP=1 -q -o /dev/null -d $DB -f tests/rls.test.sql
echo "✓ migrations e RLS ok"
