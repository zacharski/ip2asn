drop table iptoasn;
create table iptoasn
(
    id serial primary key,
    ip_range int8range not null,
    asn bigint not null
);

CREATE INDEX ip_range_idx ON iptoasn USING gist
(ip_range);


drop table asntodescription;
create table asntodescription
(
    asn bigint primary key,
    operator text not null
);

