WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$     
|
| SYNOPSIS      : This script sets up a temporary table to hold the exceptions
|				  for the next AE/Warrant/CO sequence at each court when reset at the
|				  end of the year.  Normally, the maximum ae/warrant number will be
|				  used, but not in every instance.
|
| $Author:$       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$	Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4572_b.log

BEGIN
        
        EXECUTE IMMEDIATE 'DROP TABLE tmp_end_year_reset_exceptions';
        
        EXCEPTION
        
        WHEN OTHERS THEN
               NULL;
END;
/

-- Create temporary table
CREATE TABLE tmp_end_year_reset_exceptions
	(court_code NUMBER(3)
	,year_code	VARCHAR2(1)
	,item       VARCHAR2(30)
	,item_value NUMBER(*,2)
);

COMMENT ON TABLE tmp_end_year_reset_exceptions IS 'Temporary table used to store the exceptions to the starting AE, CO, HOME, FOREIGN and REISSUE sequence numbers for each court at the start of the year.';

-- Insert exceptions
INSERT INTO tmp_end_year_reset_exceptions
VALUES
    (124
    ,'A'
    ,'AE'
	,1
    );
	
INSERT INTO tmp_end_year_reset_exceptions
VALUES
    (139
    ,'C'
    ,'AE'
	,392
    );
	
INSERT INTO tmp_end_year_reset_exceptions
VALUES
    (140
    ,'C'
    ,'AE'
	,1456
    );
	
INSERT INTO tmp_end_year_reset_exceptions
VALUES
    (360
    ,'C'
    ,'AE'
	,200
    );
	
INSERT INTO tmp_end_year_reset_exceptions
VALUES
    (373
    ,'C'
    ,'AE'
	,1
    );

COMMIT;

/

SPOOL OFF