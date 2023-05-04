export default {
  client: 'pg',
  connection: {
    user: 'postgres',
    database: 'hasura-test',
    password: 'Slashnyu24'
  },
  onUpdateTrigger: table => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `
}