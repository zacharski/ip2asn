/*
   
   parses the ip2asn-v4.tsv file available at https://iptoasn.com/
   and puts results in db table(s).
*/

const verbose = 1;

require("dotenv").config();
const fs = require("fs");
var readline = require("readline");
const Pool = require("pg").Pool;
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
};

const pool = new Pool(config);

const insertEntry = async (data, generateDescription) => {
  try {
    if (generateDescription) {
      asnToDescription(data[2], data[4]);
    }
    const response = await pool.query(
      `SELECT ('${data[0]}'::inet - '0.0.0.0'::inet) as ip_integer_1,  ('${data[1]}'::inet - '0.0.0.0'::inet) as ip_integer_2`
    );
    const theQuery = `INSERT INTO iptoasn (ip_range, asn) VALUES ('[${response.rows[0].ip_integer_1}, ${response.rows[0].ip_integer_2}]', ${data[2]})`;
    const respI = await pool.query(theQuery);
  } catch (err) {
    console.log(data);
    console.log(theQuery);
    console.log(err);
  }
};

const asnToDescription = async (asn, description) => {
  if (asn != 0) {
    try {
      // add entry
      const r2 = await pool.query(
        "INSERT INTO asntodescription (asn, operator) VALUES ($1, $2)",
        [asn, description]
      );
    } catch (err) {
      if (!err.message.includes("duplicate")) {
        console.log(err.message);
      }
    }
  }
};

// not used but want to keep it around
const ip2int = (ip) => {
  return (
    ip.split(".").reduce(function (ipInt, octet) {
      return (ipInt << 8) + parseInt(octet, 10);
    }, 0) >>> 0
  );
};

// processTSVtoPG
// puts data from tsv file into database tables.
// filename: name of tsv file
// generateDescription: if 1 will populate the asntodescription table
//   otherwise it will only generate the iptoasn table
const processTSVtoPG = (filename, generateDescription) => {
  let data;
  readline
    .createInterface({
      input: fs.createReadStream(filename),
      terminal: false,
    })
    .on("line", function (line) {
      data = line.split("\t");
      if (data.length >= 5) {
        insertEntry(data, generateDescription);
      } else {
        console.log("ERROR: " + line);
      }
    });
};

processTSVtoPG(process.argv[2], 1);
