// for development on personal PC
"use strict";
/** Database setup for FitNessy. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;




try // windows route
{
  if (process.env.NODE_ENV === "production") {
    db = new Client({
      host: "/var/run/postgresql",
      database: getDatabaseUri(),
      ssl: {
        rejectUnauthorized: false
      }
    });
  } else {
    db = new Client({
      host: "/var/run/postgresql",
      database: getDatabaseUri()
    });
  }
  db.connect();

  module.exports = db;
} 
catch // mac route
{
  if (process.env.NODE_ENV === "production") {
    db = new Client({
      // connectionString: `postgresql:///${getDatabaseUri()}`,
      connectionString: getDatabaseUri(),
      ssl: {
        rejectUnauthorized: false
      }
    });
  } else {
    db = new Client({
      // connectionString: `postgresql:///${getDatabaseUri()}`
      connectionString: getDatabaseUri()
    });
  }
  db.connect();

  module.exports = db;
}

// "use strict";
// /** Database setup for FitNessy. */
// const { Client } = require("pg");
// const { getDatabaseUri } = require("./config");

// let db;

// try {
//   if (process.env.NODE_ENV === "production") {
//     db = new Client({
//       connectionString: process.env.DATABASE_URL,
//       ssl: {
//         rejectUnauthorized: false
//       }
//     });
//   } else {
//     db = new Client({
//       connectionString: getDatabaseUri()
//     });
//   }
//   db.connect();
// } catch (error) {
//   console.error("Error connecting to the database:", error);
// }

// module.exports = db;
