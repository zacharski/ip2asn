## ip2asn code

### loadtable.sql

This file only creates the tables, not a database since I was unsure of how this would
fit in with your database stuff

### ip2asnDUMP.sql

The dump of the complete populatied database. the database is called ip

### process_ip2asn.js

The code that reads the tsv file and inserts data into the table.
By default it creates two tables. one maps ips to asns. The other maps asns to operator names.

To run the program ...

```
node process_ip2asn.js ip2asn-v4.tsv
```

To have it generate only the ip2asn table change the last line to

```
processTSVtoPG(process.argv[2], 1);
```

### queryIP.js

sample code querying the database.

#### queryIP(ipEntry)

give an IP and it returns the ASN

#### queryIPHost(ipEntry)

give an IP and it returns a Javascript Object with asn and operator

for example

```
{ asn: '14061', operator: 'DIGITALOCEAN-ASN - DigitalOcean, LLC' }
{ asn: '15169', operator: 'GOOGLE - Google LLC' }
{ asn: '15169', operator: 'GOOGLE - Google LLC' }
```
