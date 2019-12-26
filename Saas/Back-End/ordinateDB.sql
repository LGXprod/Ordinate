create table patient(
    ordinateID Integer NOT NULL,
    fName varchar(40),
    sName varchar(40),
    dob DATE,
    avgTimeWDoc numeric(4, 4),
    avgTimeOfArrival time,
    constraint patientPK primary key (ordinateID)
);

    create table pastVisitsPat(
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
    constraint clientFK foreign key clientID references client(clientID)
);

    -- Need to revise this table heavily, doesn't make sense. Move some attributes to the doctor table.
    create table pastVisitsDoc(
        timeWPat time,
        numPatSeen smallint
    );

create table list(
    eta numeric(4,4),
    constraint patientFK foreign key ordinateID references patient(ordinateID),
    constraint doctorFK foreign key doctorID references doctor(doctorID)
);

create table client(
    clientID Integer NOT NULL,
    comName varchar(30),
    paymentStatus boolean,
    constraint clientPK primary key clientID
);
