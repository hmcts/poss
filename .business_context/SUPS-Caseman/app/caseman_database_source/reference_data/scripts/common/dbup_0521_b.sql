WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| TITLE    : dbup_0521_b
|
| FILENAME : dbup_0521_b.sql
|
| SYNOPSIS : Data Migration script to set the a View Only Role against
|            users with Admin Rights in a specific court.
|
| AUTHOR   : Mark West
|
| VERSION  : $Revision$
|
| PROJECT   : SUPS Development
|
| COPYRIGHT : (c) 2008 Logica UK Ltd.
|             This file contains information which is confidential and of
|             value to Logica. It may be used only for the specific purpose for
|             which it has been provided. Logica's prior written consent is
|             required before any part is reproduced.
|
| COMMENTS  : Requires receipt of a SUPS Court Code inorder to process.
|
|             Script 2 of 2 for RFC 521
|
|---------------------------------------------------------------------------------
|
| $Log$
--------------------------------------------------------------------------------*/


DEFINE CourtToProcess = &&1

SPOOL dbup_0521_b_for_Court_code_&&1..log

    INSERT  INTO user_role (user_id, role_id, court_code)
    SELECT  r.user_id
           ,'viewOnly' role_id
           ,r.court_code
    FROM    user_role r
    WHERE   UPPER(r.role_id) = 'ADMIN'
      AND   r.court_code = &&CourtToProcess
      AND   r.user_id NOT IN
           (SELECT  NULL
            FROM    user_role vo
             WHERE  vo.user_id = r.user_id
               AND  vo.court_code = r.court_code
               AND  UPPER(vo.role_id) = 'VIEWONLY'
           )
   ;

COMMIT;

SPOOL OFF

