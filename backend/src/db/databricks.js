const { DBSQLClient } = require('@databricks/sql');

const {
  DATABRICKS_SERVER_HOSTNAME,
  DATABRICKS_HTTP_PATH,
  DATABRICKS_TOKEN,
} = process.env;

function assertConfigured() {
  const missing = ['DATABRICKS_SERVER_HOSTNAME', 'DATABRICKS_HTTP_PATH', 'DATABRICKS_TOKEN']
    .filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing Databricks env vars: ${missing.join(', ')}`);
  }
}

async function runQuery(sql) {
  assertConfigured();
  const client = new DBSQLClient();

  try {
    const connection = await client.connect({
      host: DATABRICKS_SERVER_HOSTNAME,
      path: DATABRICKS_HTTP_PATH,
      token: DATABRICKS_TOKEN,
    });

    const session = await connection.openSession();
    const queryOperation = await session.executeStatement(sql, {
      runAsync: true,
      maxRows: 10000,
    });

    const rows = await queryOperation.fetchAll();
    await queryOperation.close();
    await session.close();
    return rows;
  } finally {
    await client.close();
  }
}

module.exports = { runQuery };