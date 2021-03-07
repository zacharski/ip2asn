// queryIP

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
const queryIP = async (ip_address) => {
  try {
    const query =
      "select asn from iptoasn where ip_range @> ($1::inet - '0.0.0.0'::inet)";
    const response = await pool.query(query, [ip_address]);
    return response.rows[0].asn;
  } catch (err) {
    console.log(err);
  }
};

const queryIPHost = async (ip_address) => {
  try {
    const query =
      "select iptoasn.asn, asntodescription.operator from iptoasn JOIN asntodescription ON asntodescription.asn = iptoasn.asn where ip_range @> ($1::inet - '0.0.0.0'::inet)";
    const response = await pool.query(query, [ip_address]);
    //console.log(response);
    return response.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const test = async () => {
  // test it
  const ipTestAddresses = ["198.199.65.227", "172.217.11.238", "35.229.53.137"];
  for (ipEntry of ipTestAddresses) {
    let result = await queryIPHost(ipEntry);
    console.log(result);
    // check just asn
    let result2 = await queryIP(ipEntry);
    console.log(result2);
  }
};

test();
