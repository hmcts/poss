CREATE OR REPLACE PROCEDURE obligations_purge (pn_obligations_found OUT NUMBER
                                              ,pn_deleted_succ  OUT NUMBER
                                              ,pn_deleted_fail  OUT NUMBER
                                              )
AS

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Common/database/Coding%20Templates/SUPS%20Oracle%20package%20template.sql $:
|
| SYNOPSIS      : A procedure to remove Obligation records that have been marked
|                 for deletion, that have been deleted over a year ago.
|
|                 Any Obligations that could not be deleted due to an Oracle Exception
|                 will be logged.
|
| PARAMETERS    : pn_obligations_found  OUT     Returns a count of the Obligation Records that qualify for purging
|                 pn_deleted_succ       OUT     Returns a count of the Obligation Records deleted
|                 pn_deleted_fail       OUT     Returns a count of the Obligation Records failed to be deleted
|
|
| $Author: westm $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Requires the existence of the obligations_purge_errors Table.
|
| CHANGES		: 25/10/2010 (Chris Vincent), Obligations table has a composite primary key consisting of obligation_seq
|				  and case_number so using obligation_seq on it's own causes Oracle Errors.  Case Number now added throughout.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3617 $:          Revision of last commit
| $Date: 2009-08-16 10:04:05 +0100 (Sun, 16 Aug 2009) $:         Date of last commit
| $Id: SUPS Oracle package template.sql 3617 2009-08-16 09:04:05Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

	-- constants sets how many records are fetched from the cur_del_obligations cursor at a time.
	-- The figure of a 1000 is the maximum that should be set, as it determines how many records from the cursor
	-- is held in memory when the stored procedure is executed.
    c_purge_batch           CONSTANT    PLS_INTEGER :=  1000;

	-- tallys to record what entries in the obligations table have been purged by this stored procedure.
    n_obligations_found     PLS_INTEGER := 0;
    n_deleted_succ          PLS_INTEGER := 0;
    n_deleted_fail          PLS_INTEGER := 0;

	n_lock					PLS_INTEGER := 0; -- used to aid row locking

	-- variables used to store error details before they're written to the obligation_purge_errors table.
    n_err_seq               obligations_purge_errors.obligation_seq%TYPE;
    v_err_desc              obligations_purge_errors.description%TYPE;
	v_case_no				obligations_purge_errors.case_number%TYPE;

	-- stores cut-off date
    d_purge_from            DATE        := TRUNC(SYSDATE - 365);

    -- get candidate Obligations marked for deletion.
	-- 25/10/2010 (Chris Vincent) Added Case Number added to retrieval list
    CURSOR cur_del_obligations (pd_cutoff   IN obligations.expiry_date%TYPE)
    IS
        SELECT  rowid
     		   ,o.obligation_seq
			   ,case_number
        FROM    obligations o
        WHERE   o.delete_flag = 'Y'
        AND     TRUNC(o.expiry_date) < pd_cutoff;


    TYPE tab_del_obligations_rowids    	IS TABLE OF ROWID INDEX BY BINARY_INTEGER;
    TYPE tab_del_oligations_seqs       	IS TABLE OF obligations.obligation_seq%TYPE INDEX BY BINARY_INTEGER;
	TYPE tab_del_oligations_caseno     	IS TABLE OF obligations.case_number%TYPE INDEX BY BINARY_INTEGER;

	-- PL/SQL tables to store rowids from the obligations table.  The second of the two tables is used to reset the first table after a fetch
	-- from the cur_del_obligations cursor.
    lst_del_obligations_rowids         	tab_del_obligations_rowids;
    lst_del_obligations_rowids_em      	tab_del_obligations_rowids;

	-- PL/SQL tables to store the Primary Key values from the obligations table.  The second of the two tables is used to reset the first table after a fetch
	-- from the cur_del_obligations cursor.
    lst_del_obligations_seqs            tab_del_oligations_seqs;
    lst_del_obligations_seqs_empty  	tab_del_oligations_seqs;

	-- 25/10/2010 (Chris Vincent) Added Case Number variables
	lst_del_obligations_caseno          tab_del_oligations_caseno;
    lst_del_obligations_caseno_em  	    tab_del_oligations_caseno;

	-- An exception for error ORA-00054: "resource busy and acquire with NOWAIT specified" to catch locked record errors
	e_record_locked EXCEPTION;
	PRAGMA EXCEPTION_INIT (e_record_locked, -54);

	-- A local stored procedures to write entries to the obligations_purge_errors table.
	-- The commit here is isolated from the commit in the body of the stored procedure,
	-- which guarantees that entries written to the errors table are retained even when a
	-- rollback is issued.
	-- Change History:
	-- 25/10/2010 (Chris Vincent), added Case Number to the procedure
	PROCEDURE log_err (pn_obligation_seq    IN obligations_purge_errors.obligation_seq%TYPE
					  ,pv_error_desc        IN  obligations_purge_errors.description%TYPE
					  ,pv_case_number       IN  obligations_purge_errors.case_number%TYPE
                      )
    AS

        PRAGMA AUTONOMOUS_TRANSACTION;

   BEGIN

        INSERT INTO   obligations_purge_errors 
            (obligation_seq
            ,description
            ,case_number
            ,error_date
            )       
         VALUES
            (pn_obligation_seq
            ,pv_error_desc
			,pv_case_number
            ,SYSDATE
            );

        COMMIT;

   END log_err;


BEGIN

    set_sups_app_ctx ('support', '0', 'Obligation Purge');

    OPEN cur_del_obligations(d_purge_from);
    LOOP

		-- 25/10/2010 (Chris Vincent) Added Case Number to fetch list
		FETCH cur_del_obligations
		BULK COLLECT INTO lst_del_obligations_rowids, lst_del_obligations_seqs, lst_del_obligations_caseno
		LIMIT c_purge_batch;
        
		-- 25/10/2010 (Chris Vincent) Moved exit statement to here for efficiency
        EXIT WHEN lst_del_obligations_seqs.COUNT = 0;
        
		n_obligations_found := n_obligations_found + lst_del_obligations_seqs.COUNT;

		FOR i IN 1..lst_del_obligations_seqs.COUNT LOOP

			BEGIN

				n_err_seq   := NULL;
				v_err_desc  := NULL;
				v_case_no	:= NULL;

				SELECT 	1
				INTO 	n_lock
				FROM 	obligations o
				WHERE 	o.obligation_seq = lst_del_obligations_seqs(i)
				AND		o.case_number = lst_del_obligations_caseno(i)
				FOR UPDATE NOWAIT;

				DELETE FROM obligations o
				WHERE o.rowid = lst_del_obligations_rowids(i);

			EXCEPTION

				WHEN e_record_locked THEN

					n_deleted_fail := n_deleted_fail + 1;

					n_err_seq 	:= lst_del_obligations_seqs(i);
					v_err_desc 	:= 'Record locked by another process - therefore it has not been deleted!';
					v_case_no	:= lst_del_obligations_caseno(i);

					log_err(n_err_seq, v_err_desc, v_case_no);

				WHEN OTHERS THEN

					n_deleted_fail := n_deleted_fail + 1;

					n_err_seq 	:= lst_del_obligations_seqs(i);
					v_err_desc := SUBSTR(SQLERRM,1,500);
					v_case_no	:= lst_del_obligations_caseno(i);

					log_err(n_err_seq, v_err_desc, v_case_no);

			END;

		END LOOP ;

        n_deleted_succ := n_obligations_found - n_deleted_fail;

        COMMIT;

        EXIT WHEN cur_del_obligations%NOTFOUND;

        -- reset lists.
        lst_del_obligations_rowids := lst_del_obligations_rowids_em;
        lst_del_obligations_seqs   := lst_del_obligations_seqs_empty;
		lst_del_obligations_caseno := lst_del_obligations_caseno_em;

    END LOOP;

    CLOSE cur_del_obligations;
    
    pn_obligations_found := n_obligations_found;
    pn_deleted_succ      := n_deleted_succ;
    pn_deleted_fail      := n_deleted_fail;

	COMMIT;

EXCEPTION

    WHEN OTHERS THEN

        IF cur_del_obligations%ISOPEN THEN -- close open cursor
            CLOSE cur_del_obligations;
        END IF;

        pn_obligations_found := n_obligations_found;
        pn_deleted_succ      := n_deleted_succ;
        pn_deleted_fail      := n_deleted_fail;

		RAISE;

END obligations_purge;
/
SHOW ERRORS
