/*************************************************************************
 Module:            sups_scheduled_jobs
 
 Description:       Contains jobs to be executed by the scheduler in the SUPS Environment.

 Amendment History

 Version   Date         Name             Amendment
 ------------------------------------------------------------------------  
1.1       12/12/06      P.Haferer	  Created using code provided by Hilary Bannister/Alistair Brown.
1.2       25/06/07      C J Hutt       Added in the CCBC scheduled job 'cc_clear_document_store'
1.3       06/09/07	    P. Scanlon     Modified cc_clear_document_store to 
                                       also clear orphaned wp_outputs. ICR0395
1.4       25/10/07      P Scanlon      Defect 1126. Modified  delete of document_store to remove
                                       records only if no corresponding wp_output. 
1.5       15/04/07      C Vincent      Modified delete from REPORT_QUEUE to wrap XMLSOURCE
									   with the xmlsource_numcheck function for performance.
1.6		  18/02/15		C Vincent	   Rewrote cc_clear_document_store to use bulk collect
									   and FORALL to delete the report rows
2.0		  17/06/2015	C Vincent	   Performance changes to the document cleardown procedures
*******************************************************************************/

create or replace package sups_scheduled_jobs is

    PROCEDURE cm_set_new_server_secret (new_expiry_date  IN VARCHAR2 DEFAULT TO_CHAR(SYSDATE+1,'YYYY-MM-DD HH24:MI:SS'));
    
    PROCEDURE cc_clear_document_store;
	
	PROCEDURE clear_report_queue (batchsize IN INTEGER);

	PROCEDURE clear_documents (batchsize IN INTEGER);

end sups_scheduled_jobs;
/

create or replace package body sups_scheduled_jobs is

   set_raise_application_error BOOLEAN;

   procedure cm_set_new_server_secret (new_expiry_date  IN VARCHAR2 DEFAULT TO_CHAR(SYSDATE+1,'YYYY-MM-DD HH24:MI:SS'))
   as
      l_found_server_secret   NUMBER := 0;
      l_new_expiry_date       DATE;
      l_new_secret_main       VARCHAR2(4000);
      function f_new_secret return varchar2
      is
         l_current_length        NUMBER := 0;
         l_new_length            NUMBER := 128;
         l_new_secret            VARCHAR2(4000);
      begin
         for r_new_length in (select round(dbms_random.value(128,512),0) new_length from dual)
         loop
            l_new_length := r_new_length.new_length;
         end loop;
         l_new_secret := '{' ;
         while l_current_length < l_new_length
         loop
            l_current_length := l_current_length + 1;
            for r_next_hex in (select lpad(trim(to_char(round(dbms_random.value(0,255),0),'xx')),2,'0') next_hex from dual)
            loop
               if l_current_length = l_new_length
               then
                  l_new_secret := l_new_secret || '0x' || r_next_hex.next_hex || '}' ;
               else
                  l_new_secret := l_new_secret || '0x' || r_next_hex.next_hex || ':' ;
               end if;
            end loop;
         end loop;
         return l_new_secret;
      end f_new_secret;
   begin
      begin
         l_new_expiry_date := to_date(new_expiry_date,'YYYY-MM-DD HH24:MI:SS');
      exception
         when others then
            l_new_expiry_date := sysdate + 1;
      end;
      for r_server_secret in (select SERVER_SECRET_ID, EXPIRY_DATE, SECRET
                              from   server_secret)
      loop
         l_found_server_secret := 1;
         l_new_secret_main := f_new_secret;
         update server_secret set secret = l_new_secret_main,
                                  expiry_date = l_new_expiry_date
         where  server_secret_id = r_server_secret.SERVER_SECRET_ID;
      end loop;
      if l_found_server_secret = 0
      then
         l_new_secret_main := f_new_secret;
         insert into server_secret (SERVER_SECRET_ID, EXPIRY_DATE, SECRET)
         values (1,l_new_expiry_date,l_new_secret_main);
      end if;
      commit;
   end cm_set_new_server_secret;

/************************************************************************************************************\
* TYPE          : PROCEDURE                                                                                  *
* NAME          : cc_clear_document_store                                                                    *
* DESCRIPTION   : Identify all documents that are not permanently stored (dont have a value -1) and that 	 *
*				: the storage duration has expired (CREATED_DATE+STORAGE_DURATION) is younger than today's   *
*				: date. 																					 *
*               : delete all the content_store rows that the documents use                                   * 
*               : delete all the document_store rows														 *
*               : delete all the report queue rows that refer to these documents 							 *
*               : 																							 *
\************************************************************************************************************/
PROCEDURE cc_clear_document_store AS

	batchsize INTEGER := 200;

BEGIN

	-- Delete Report_queue rows
	clear_report_queue(batchsize);

	-- delete all "parent-less" document_store rows and content_store rows
	clear_documents(batchsize);

	-- if we do not reach here then this is probably because we have blown a rollback segment somewhere
	-- this procedure may need to be broken down into smaller commit blocks.
	COMMIT;

	dbms_output.put_line('Successfully completed cc_clear_document_store.');
	
EXCEPTION                                                                       
	WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
        DBMS_OUTPUT.PUT_LINE('while executing procedure cc_clear_document_store as part of clear doc store job.');
        DBMS_OUTPUT.PUT_LINE('Rolling Back changes');
        ROLLBACK;
        -- re-raise exception so control.sh and autosys picks up the failure
        RAISE;

END cc_clear_document_store;
  
/************************************************************************************************************\
* TYPE          : PROCEDURE                                                                                  *
* NAME          : clear_report_queue                                                                         *
* DESCRIPTION   : Deletes any REPORT_QUEUE rows no longer referenced or have exceeded their retention period *
*               :                                                                                            * 
\************************************************************************************************************/
PROCEDURE clear_report_queue (batchsize IN INTEGER) AS

    CURSOR  cur_rq1 IS
	SELECT RQ.ID
    FROM REPORT_QUEUE RQ
    WHERE  RQ.STORAGE_DURATION != -1
    AND    TRUNC(SYSDATE) > RQ.CREATED_DATE + RQ.STORAGE_DURATION;
	
	CURSOR  cur_rq2 IS
	SELECT RQ.ID
    FROM REPORT_QUEUE RQ
	WHERE RQ.TYPE in ('3','4')
    AND RQ.STORAGE_DURATION = -1
    AND NOT EXISTS (SELECT 1 FROM WP_OUTPUT W WHERE xmlsource_numcheck(W.XMLSOURCE) = RQ.DOCUMENT_ID)
	AND NOT EXISTS (SELECT 1 FROM REPORT_MAP M WHERE M.REPORT_QUEUE_ID = RQ.ID);
	
	i	INTEGER;

BEGIN

	i := 0;
	FOR rq1_rec IN cur_rq1 LOOP
	
		-- Delete the REPORT_QUEUE row and increment count
		DELETE FROM report_queue WHERE id = rq1_rec.id;
		i := i + 1;
		
		-- Perform a commit when the count reaches the batch size
		IF MOD(i, batchsize) = 0 THEN
			COMMIT;
		END IF;
		
	END LOOP;
	
	dbms_output.put_line('First REPORT_QUEUE delete: ' || i || ' records.');
	
	-- final commit to mop up any deletes that fell under the batchsize threshold
	COMMIT;
	
	i := 0;
	FOR rq2_rec IN cur_rq2 LOOP
	
		-- Delete the REPORT_QUEUE row and increment count
		DELETE FROM report_queue WHERE id = rq2_rec.id;
		i := i + 1;
		
		-- Perform a commit when the count reaches the batch size
		IF MOD(i, batchsize) = 0 THEN
			COMMIT;
		END IF;
		
	END LOOP;
	
	dbms_output.put_line('Second REPORT_QUEUE delete: ' || i || ' records.');

	-- final commit to mop up any deletes that fell under the batchsize threshold
	COMMIT;
	
EXCEPTION                                                                       
	WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
        DBMS_OUTPUT.PUT_LINE('while executing procedure clear_report_queue as part of clear doc store job.');
        DBMS_OUTPUT.PUT_LINE('Rolling Back changes');
        ROLLBACK;
        -- re-raise exception so control.sh and autosys picks up the failure
        RAISE;

END clear_report_queue;

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : clear_documents                                                                      		*
* DESCRIPTION   : Deletes any DOCUMENT_STORE and CONTENT_STORE rows no longer referenced or have exceeded  	*
*				: their retention period 																	*
*               :                                                                                           * 
\***********************************************************************************************************/
PROCEDURE clear_documents (batchsize IN INTEGER) AS

    CURSOR  cur_ds IS
	SELECT D.ID, D.CONTENT_STORE_ID
    FROM DOCUMENT_STORE D 
	WHERE NOT EXISTS (SELECT 1 FROM REPORT_QUEUE R WHERE R.DOCUMENT_ID = D.ID)
	AND   NOT EXISTS (SELECT 1 FROM WP_OUTPUT W WHERE xmlsource_numcheck(W.XMLSOURCE) = D.ID AND NVL(W.FINAL_IND,'N') = 'N'   );
		 
	i	INTEGER;

BEGIN

	i := 0;
	FOR doc_rec IN cur_ds LOOP
	
		-- Delete the DOCUMENT_STORE and CONTENT_STORE rows and increment count
		DELETE FROM document_store WHERE id = doc_rec.id;
		DELETE FROM content_store WHERE id = TO_NUMBER(doc_rec.content_store_id);
		i := i + 1;
		
		-- Perform a commit when the count reaches the batch size
		IF MOD(i, batchsize) = 0 THEN
			COMMIT;
		END IF;
		
	END LOOP;
	
	dbms_output.put_line('DOCUMENT_STORE and CONTENT_STORE deletes: ' || i || ' records.');
	
	-- final commit to mop up any deletes that fell under the batchsize threshold
	COMMIT;
	
EXCEPTION                                                                       
	WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
        DBMS_OUTPUT.PUT_LINE('while executing procedure clear_documents as part of clear doc store job.');
        DBMS_OUTPUT.PUT_LINE('Rolling Back changes');
        ROLLBACK;
        -- re-raise exception so control.sh and autosys picks up the failure
        RAISE;

END clear_documents;

BEGIN
   set_raise_application_error := FALSE;
END sups_scheduled_jobs;

/