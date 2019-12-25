create table patient(
    ordinateID Integer NOT NULL,
    fName varchar(40),
    sName varchar(40),
    dob DATE,
    avgTimeWDoc numeric(4, 4),
    avgTimeOfArrival time,
    constraint patientPK primary key (ordinateID)
);

create table PastVisitsPat(
    timeOfArrival time,
    timeWDoc numeric(3,2), -- 3 hour digits, 2 minute digits
    constraint patientFK foreign key (patientID) references patient(ordinateID)
);

create table doctor(
    doctorID Integer NOT NULL,
    fName varchar(40),
    sName varchar(40),
    avgTimeWPat numeric(4,4),
    constraint doctorPK primary key (doctorID)
);

-- Need to revise this table heavily, doesn't make sense. Move some attributes to the doctor table.
create table PastVisitsDoc(
    timeWPat time,
    numPatSeen smallint,
);