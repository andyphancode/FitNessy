\echo 'Delete and recreate fitnessy db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE fitnessy;
CREATE DATABASE fitnessy;
\connect fitnessy

\i seed_schema.sql
\i seed_data.sql

\echo 'Delete and recreate fitnessy_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE fitnessy_test;
CREATE DATABASE fitnessy_test;
\connect fitnessy_test

\i seed_schema.sql
