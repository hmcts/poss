WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/DDL/ddl_trac_5057.sql $:
|
| SYNOPSIS : DB schema changes for DFJ Areas.  *** TO BE APPLIED to CaseMan ***
|            - Contains DDL statements to create the new dfj_areas reference table
|            - Contains DDL statements to create a new foreign key column and associated 
|              index on the COURTS table.
|
| $Author: jumanii $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2014 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : TRAC ticket #5057
|
|---------------------------------------------------------------------------------
|
| $Rev: 10253 $:          Revision of last commit
| $Date: 2014-01-24 10:43:38 +0000 (Fri, 24 Jan 2014) $:         Date of last commit
| $Id: ddl_trac_5057.sql 10253 2014-01-24 10:43:38Z jumanii $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_5057.log

PROMPT ************************************************************************
PROMPT Create table dfj_areas
PROMPT ************************************************************************
CREATE TABLE dfj_areas
    (dfj_area_id        VARCHAR2(3)          NOT NULL
    ,description        VARCHAR2(40)         NOT NULL
    );

PROMPT ************************************************************************
PROMPT table dfj_areas created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Primary Key on dfj_areas
PROMPT ************************************************************************

ALTER TABLE dfj_areas ADD CONSTRAINT DFJ_AREAS_PK
PRIMARY KEY (dfj_area_id);

PROMPT ************************************************************************
PROMPT Primary Key on dfj_areas created
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Insert the default row in dfj_areas to enable correct 
PROMPT referential integrity before the new column is created and defaulted.
PROMPT ************************************************************************

INSERT INTO dfj_areas
VALUES
('NON'
,'No DFJ Area'
);
PROMPT ************************************************************************
PROMPT Default row in dfj_areas inserted.
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Create new DFJ area column on COURTS table with a default of 'NON' (no DFJ)
PROMPT Note: the DEFAULT clause will have the affect of defaulting this column 
PROMPT for ALL existing rows in the table.
PROMPT ************************************************************************

ALTER TABLE courts
 ADD (dfj_area_id VARCHAR2(3)         DEFAULT 'NON'  NOT NULL);

PROMPT ************************************************************************
PROMPT Added new column dfj_area_id.
PROMPT ************************************************************************ 
 
PROMPT ************************************************************************
PROMPT Add comment for new column dfj_area_id.
PROMPT ************************************************************************

COMMENT ON COLUMN COURTS.dfj_area_id
  IS 'Foreign key to dfj_areas reference table'; 

PROMPT ************************************************************************
PROMPT Added comment for new column dfj_area_id.
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create index on courts table
PROMPT ************************************************************************

CREATE INDEX COURTS_IX1 ON courts
    (dfj_area_id asc);

PROMPT ************************************************************************
PROMPT Index COURTS_IX1 on courts table created
PROMPT ************************************************************************
 
PROMPT ************************************************************************
PROMPT Create Foreign Key on courts table
PROMPT ************************************************************************

ALTER TABLE courts
ADD CONSTRAINT COURTS_FK1
    FOREIGN KEY (dfj_area_id)
    REFERENCES dfj_areas (dfj_area_id);

PROMPT ************************************************************************
PROMPT Foreign Key on COURTS TABLE created
PROMPT ************************************************************************


SPOOL OFF

