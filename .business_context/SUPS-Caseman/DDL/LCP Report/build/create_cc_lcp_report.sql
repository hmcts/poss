/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/DDL/LCP%20Report/build/create_cc_lcp_report.sql $:
|
| SYNOPSIS      : Create the LCP_REPORT procedure.
|
| $Author: westm $:    Jon Fane
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 10/03/2011 - TRAC 4281 - Updated driving cursor to include 
|                 code < 7000 as top end LCP's are 2000-6999.
|
|                 Also updated the CAPS select statement to use the upper LCP range.
|
|                 11/03/2011 - TRAC 4283 - Updated to count Payments in CAPS
|
|                 15/03/2011 - TRAC 4283 - Amended post review to UPPER the CAPS
|                 name/address details. 
|---------------------------------------------------------------------------------
|
| $Rev: 8756 $:       Revision of last commit
| $Date: 2011-05-12 09:02:03 +0100 (Thu, 12 May 2011) $:      Date of last commit
| $Id: create_cc_lcp_report.sql 8756 2011-05-12 08:02:03Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/
SPOOL create_cc_lcp_report.log


CREATE OR REPLACE PROCEDURE lcp_report ( pn_court_code IN NUMBER )
IS


 
  /*------------------------------------------------------------------------------*
  |                                                                              |
  | PROCEDURE     : lcp_report                                                   |
  |                                                                              |
  | DESCRIPTION   : Procedure that will export the LCP details for a particular  |
  |                 court as well as metadata such as the number of cases the    |
  |                 LCP is associated with in FMAN/CAPS. Number of AEs in CAPS   |
  |                                                                              |
  |                 The Information is outputted to a flat file in a fixed width |
  |                 format that can then be transferred to the MOJ.              |
  |                                                                              |
  |                                                                              |
  | PARAMETERS    : p_court_code        IN   The 3 digit identifier for the court|
  |                                                                              |
  -------------------------------------------------------------------------------*/
  
   --------------------------------------------
   -- Build a Cursor of coded parties for a  --
   -- particular court using caseman         --
   -- as the master of the data              --
   --------------------------------------------
   --                                        --
   -- Updated Cursor to fix TRAC #4281       --
   -- included code < 7000                   --
   -------------------------------------------- 
    CURSOR cur_coded_parties
    IS
    SELECT   party_id prty
            ,admin_court_code cc
            ,code lcp
            ,person_requested_name name
            ,address_line1 addr1
            ,address_line2 addr2
            ,address_line3 addr3
            ,address_line4 addr4
            ,address_line5 addr5
            ,postcode pcode
    FROM     cman.coded_parties
    WHERE    admin_court_code = pn_court_code
             AND ( (code < 1500) OR (code > 1999 AND code < 7000))
    ORDER BY person_requested_name
            ,address_line1
            ,address_line2
            ,address_line3
            ,address_line4
            ,address_line5
            ,postcode;
    
    --------------------------------------------
    -- Create variables to hold the counts    --
    -- of the metadata                        --
    --------------------------------------------
    n_cman_cases   NUMBER := 0;
    n_cos          NUMBER := 0;
    n_wrnts        NUMBER := 0;
    n_pymnts       NUMBER := 0;
    n_fman_cases   NUMBER := 0;
    n_caps_aes     NUMBER := 0;
    n_caps_pymnts  NUMBER := 0;

    --------------------------------------------
    -- Procedure that is used to write out    --
    -- the header record that aids the opening--
    -- of the file in excel                   --
    --------------------------------------------
   PROCEDURE write_header
   IS
   BEGIN
  
        DBMS_OUTPUT.PUT_LINE ( 
            RPAD('A',3,' ' )  ||
            RPAD('B',6,' ' )  ||
            RPAD('C',70,' ')  ||
            RPAD('D',35,' ')  ||
            RPAD('E',35,' ')  ||
            RPAD('F',35,' ')  ||
            RPAD('G',35,' ')  ||
            RPAD('H',35,' ')  ||
            RPAD('I',8,' ' )  ||
            RPAD('J',7,' ' )  ||
            RPAD('K',7,' ' )  ||
            RPAD('L',7,' ' )  ||
            RPAD('M',7,' ' )  ||
            RPAD('N',7,' ' )  ||
            RPAD('O',7,' ')   ||
            RPAD('P',7,' '));

    END write_header;
 
  --------------------------------------------------------
  -- Procedure to populate the local version of the     --
  -- CAPS parties table, which has additional indexes   --
  -- to improve the performance of the LCP report.      --
  --------------------------------------------------------
  PROCEDURE populate_local_caps_table
  IS
  BEGIN
  
    INSERT INTO lcp_report_caps_parties
    (
     party_seq          
    ,code               
    ,crt_code           
    ,name               
    ,addr_1             
    ,addr_2             
    ,addr_3             
    ,addr_4             
    ,addr_5             
    ,postcode           	
    ,tel_no             
    ,dx_no              
    ,rd_chq_date        
    ,fax_no             
    ,email_addr         
    ,pcm          
    )
    SELECT 
     party_seq          
    ,code               
    ,crt_code           
    ,name               
    ,addr_1             
    ,addr_2             
    ,addr_3             
    ,addr_4             
    ,addr_5             
    ,postcode           	
    ,tel_no             
    ,dx_no              
    ,rd_chq_date        
    ,fax_no             
    ,email_addr         
    ,pcm 
    FROM caps_parties@CC_USER_SUPSA;
    
    COMMIT;
  
  EXCEPTION 
   
   WHEN OTHERS THEN
     raise_application_error (-20001,'An error occureds populating lcp_report_caps_parties');
    
  END populate_local_caps_table;
 
  --------------------------------------------------------
  -- Procedure to clear down the 
  --------------------------------------------------------
  PROCEDURE truncate_local_caps_table
  IS 
  BEGIN
    EXECUTE IMMEDIATE 'TRUNCATE TABLE lcp_report_caps_parties';
  EXCEPTION 
   WHEN OTHERS THEN
     raise_application_error (-20002,'An error occureds truncating lcp_report_caps_parties');
  END truncate_local_caps_table;
 
 --------------------------------------------
 ----------    MAIN PROCESSING     ---------- 
 --------------------------------------------
 
 BEGIN


    ---------------------------------------------
    -- Clear down the local CAPS table         --
    ---------------------------------------------
    truncate_local_caps_table;
    
    ---------------------------------------------
    -- Populate the local CAPS table           --
    ---------------------------------------------
    populate_local_caps_table;
    
    ---------------------------------------------
    -- Write the header record to the file.    --
    ---------------------------------------------
    write_header;

    ---------------------------------------------
    -- Loop through each LCP record in the court-
    ---------------------------------------------
          
    FOR i IN cur_coded_parties LOOP
      
        ---------------------------------------------
        -- Run the Counts from each of the business -
        -- objects.                                 -
        ---------------------------------------------
              
        /*******************************************
        *******          CASEMAN             ******* 
        ********************************************/
                
        ---------------------------------------------
        -- Count the Number of individual cases    --
        -- the LCP is attached with in Caseman     --
        ---------------------------------------------
                
        SELECT COUNT (DISTINCT case_number)
        INTO   n_cman_cases
        FROM   cman_case_party_roles
        WHERE  party_id = i.prty;
                  
        --------------------------------------------- 
        -- Count the Number of individual payments --
        -- that the LCP is associated with.        --
        ---------------------------------------------
                
        SELECT COUNT(*) 
        INTO n_pymnts 
        FROM   (SELECT DISTINCT 
                     transaction_number 
                    ,admin_court_code 
                FROM cman_payments 
                WHERE payee_id=i.prty 
               );   

        --------------------------------------------- 
        -- Count the Number of individual warrants --
        -- that are associated with the LCP.       --
        ---------------------------------------------
                
        SELECT COUNT (DISTINCT warrant_id )
        INTO n_wrnts
        FROM cman_warrants
        WHERE issued_by = i.cc
        AND  (coded_party_claimant_code=i.lcp  OR 
              coded_party_rep_code=i.lcp 
             ) ;

        ---------------------------------------------
        -- Count the Number of individual           -
        -- consolidated orders that are associated  -
        -- with the LCP.                            -
        ---------------------------------------------
                
        SELECT COUNT (*)
        INTO n_cos
        FROM cman_allowed_debts a
            ,cman_consolidated_orders b
        WHERE a.debt_co_number = b.co_number 
        AND ( a.cp_payee_id=i.prty OR a.cp_creditor_id = i.prty );
              
              
        /*******************************************
         *******       FAMILYMAN             ******* 
         *******************************************/

        ---------------------------------------------
        -- Count the number of cases in familyman   -
        -- that are linked to a Coded Party from    -
        -- a particular Court.                      -
        ---------------------------------------------
               
        SELECT COUNT(*)
        INTO n_fman_cases
        FROM fman_tucs_parties@cc_user_supsa tp
            ,fman_tucs_roles@cc_user_supsa   tr
            ,fman_tucs_courts_mv@cc_user_supsa mv
        WHERE mv.code=i.cc 
        AND mv.court=tp.default_court_id
        AND tp.code=i.lcp
        AND tp.party=tr.party
        AND tr.case_number IS NOT NULL;
             
        /*******************************************
         *******            CAPS             ******* 
         *******************************************/

        ---------------------------------------------
        -- Count the number of AES in CAPS          -
        -- that are linked to a Coded Party from    -
        -- a particular Court.                      -
        ---------------------------------------------
                
        SELECT COUNT(DISTINCT ae_seq)
        INTO n_caps_aes
        FROM lcp_report_caps_parties  p
            ,caps_ae_parties@CC_USER_SUPSA ap
        WHERE p.crt_code=i.cc 
        AND p.code=i.lcp
        AND p.party_seq=ap.party_seq;
              
        ---------------------------------------------- 
        -- In CAPS it may be the case that the codes -
        -- are not entirely in line with CMAN. So if -
        -- the code is not matched to an AE, (0 recs -
        -- from the previous select statement) then  -
        -- try to find a match in the court based    -
        -- on matching the LCP details and then if   -
        -- a match check to see if its associated to -
        -- an AE.                                    -
        --                                           -
        -- Include NVL for matching as columns       -
        -- can be Null which causes issues.          -
        ---------------------------------------------- 
        --                                          --
        -- 4281 Updated addition of AND p.code < 7000-
        ---------------------------------------------- 
                 
        IF n_caps_aes = 0 THEN
                 
            SELECT COUNT(DISTINCT ae_seq)
            INTO n_caps_aes
            FROM lcp_report_caps_parties  p
                ,caps_ae_parties@CC_USER_SUPSA ap
            WHERE p.crt_code=i.cc 
            AND UPPER(NVL(p.name,'XX')) = UPPER(NVL(i.name,'XX'))
            AND UPPER(NVL(p.addr_1,'XX'))=UPPER(NVL(i.addr1,'XX'))
            AND UPPER(NVL(p.addr_2,'XX'))=UPPER(NVL(i.addr2,'XX'))
            AND UPPER(NVL(p.addr_3,'XX'))=UPPER(NVL(i.addr3,'XX'))
            AND UPPER(NVL(p.addr_4,'XX'))=UPPER(NVL(i.addr4,'XX'))
            AND UPPER(NVL(p.addr_5,'XX'))=UPPER(NVL(i.addr5,'XX'))
            AND UPPER(NVL(p.postcode,'XX'))=UPPER(NVL(i.pcode,'XX'))
            AND ((p.code < 1500) OR (p.code > 1999 AND p.code < 7000 ))
            AND p.party_seq=ap.party_seq;
                  
        END IF;
                  

        ---------------------------------------------
        -- Count the number of Payable Orders      --
        -- in CAPS that are linked to a Coded Party-- 
        -- from a particular Court.                --
        ---------------------------------------------
        --          TRAC #4283 Change              --
        ---------------------------------------------
                
        SELECT COUNT(DISTINCT po_number)
        INTO n_caps_pymnts
        FROM lcp_report_caps_parties  p
            ,caps_payable_orders@CC_USER_SUPSA po
        WHERE p.crt_code=i.cc 
        AND p.code=i.lcp
        AND p.party_seq=po.party_seq;
              
        ---------------------------------------------- 
        -- In CAPS it may be the case that the codes -
        -- are not entirely in line with CMAN. So if -
        -- the code is not matched to an PO, (0 recs -
        -- from the previous select statement) then  -
        -- try to find a match in the court based    -
        -- on matching the LCP details and then if   -
        -- a match check to see if its associated to -
        -- an PO.                                    -
        --                                           -
        -- Include NVL for matching as columns       -
        -- can be Null which causes issues.          -
        ---------------------------------------------- 
        --                                          --
        -- 4281 Updated addition of AND p.code < 7000-
        ---------------------------------------------- 
        --          TRAC #4283 Change              --
        ---------------------------------------------
                
        IF n_caps_pymnts = 0 THEN
                 
            SELECT COUNT(DISTINCT po_number)
            INTO n_caps_pymnts
            FROM lcp_report_caps_parties  p
                ,caps_payable_orders@CC_USER_SUPSA po
            WHERE p.crt_code=i.cc 
            AND UPPER(NVL(p.name,'XX')) = UPPER(NVL(i.name,'XX'))
            AND UPPER(NVL(p.addr_1,'XX'))=UPPER(NVL(i.addr1,'XX'))
            AND UPPER(NVL(p.addr_2,'XX'))=UPPER(NVL(i.addr2,'XX'))
            AND UPPER(NVL(p.addr_3,'XX'))=UPPER(NVL(i.addr3,'XX'))
            AND UPPER(NVL(p.addr_4,'XX'))=UPPER(NVL(i.addr4,'XX'))
            AND UPPER(NVL(p.addr_5,'XX'))=UPPER(NVL(i.addr5,'XX'))
            AND UPPER(NVL(p.postcode,'XX'))=UPPER(NVL(i.pcode,'XX'))
            AND ((p.code < 1500) OR (p.code > 1999 AND p.code < 7000 ))
            AND p.party_seq=po.party_seq;
                  
        END IF;
                  
                  
        /*********************************************
        ** Output the Final Line with the data in   **
        **********************************************/
              
         DBMS_OUTPUT.PUT_LINE ( 
            RPAD(NVL(TO_CHAR(i.cc),' '),3,' ')    ||
            RPAD(NVL(TO_CHAR(i.lcp),' '),6,' ')   ||
            RPAD(NVL(i.name,' '),70,' ')          ||
            RPAD(NVL(i.addr1,' '),35,' ')         ||
            RPAD(NVL(i.addr2,' '),35,' ')         ||
            RPAD(NVL(i.addr3,' '),35,' ')         ||
            RPAD(NVL(i.addr4,' '),35,' ')         ||
            RPAD(NVL(i.addr5,' '),35 ,' ')        || 
            RPAD(NVL(i.pcode,' '),8,' ')          ||
            RPAD(n_cman_cases,7,' ')              || 
            RPAD(n_cos,7,' ')                     ||
            RPAD(n_wrnts,7,' ')                   ||
            RPAD(n_pymnts,7,' ')                  ||
            RPAD(n_fman_cases,7,' ')              ||
            RPAD(n_caps_aes,7,' ')                ||
            RPAD(n_caps_pymnts,7,' ') );
        			  
    END LOOP;
    
    ---------------------------------------------
    -- Clear down the local CAPS table         --
    ---------------------------------------------
    truncate_local_caps_table;
     
END lcp_report;
/
SHOW ERRORS

SPOOL OFF
