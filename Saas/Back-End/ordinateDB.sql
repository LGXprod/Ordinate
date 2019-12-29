create database if not exists ordinateDB;

use ordinateDB;

-- create table patient(
--     ordinateID Integer NOT NULL,
--     fName varchar(40),
--     sName varchar(40),
--     dob DATE,
--     avgTimeWDoc numeric(4, 4),
--     avgTimeOfArrival time,
--     constraint patientPK primary key (ordinateID)
-- );

    create table pastVisitsPat(
        timeOfArrival time,
        timeWDoc numeric(3,2), -- 3 hour digits, 2 minute digits
        ordinateID Integer NOT NULL,
        constraint pastVisitsPatFK foreign key (ordinateID) references patient(ordinateID)
    );

create table client_com(
    clientID Integer NOT NULL,
    comName varchar(30),
    paymentStatus boolean,
    constraint clientPK primary key (clientID)
);

create table doctor(
    doctorID Integer NOT NULL,
    fName varchar(40),
    sName varchar(40),
    avgTimeWPat numeric(4,4),
    clientID Integer NOT NULL,
    constraint doctorPK primary key (doctorID),
    constraint doctorFK foreign key (clientID) references client_com(clientID)
);

    -- Need to revise this table heavily, doesn't make sense. Move some attributes to the doctor table.
    -- create table pastVisitsDoc(
    --     timeWPat time,
    --     numPatSeen smallint
    -- );

create table qlist(
    eta numeric(4,4),
    ordinateID Integer NOT NULL,
    doctorID Integer NOT NULL,
    constraint qlistFK1 foreign key (ordinateID) references patient(ordinateID),
    constraint qlistFK2 foreign key (doctorID) references doctor(doctorID)
);