/*--------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : document_load_pkg
| SYNOPSIS      : This package packages loads a pdf file associated with an event into
|                 the Caseman document storage tables as a blob
|                
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) CGI.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/

CREATE OR REPLACE PACKAGE document_load_pkg IS

PROCEDURE   load_document_for_event (
                                    p_case_number   IN  VARCHAR2,
                                    p_pdf_filename  IN  VARCHAR2,
                                    p_event_seq     IN  NUMBER,
                                    p_order_id      IN  VARCHAR2,
                                    p_debug         IN  VARCHAR2,
                                    p_file_loaded   OUT VARCHAR2                
                                    );

PROCEDURE   reload_documents        (p_debug        IN  VARCHAR2);
                                
END; -- end of document_load_pkg
/
/***********************************************************************************************************\
*                                                 P A C K A G E                                            *
\***********************************************************************************************************/
CREATE OR REPLACE PACKAGE BODY document_load_pkg IS

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : load_document_for_event                                                                   *
* DESCRIPTION   : Procedure to load an MCOL PDDF document into the Caseman Database document store          *
\***********************************************************************************************************/

PROCEDURE load_document_for_event(  p_case_number   IN  VARCHAR2,
                                    p_pdf_filename  IN  VARCHAR2,
                                    p_event_seq     IN  NUMBER,
                                    p_order_id      IN  VARCHAR2,
                                    p_debug         IN  VARCHAR2,
                                    p_file_loaded   OUT VARCHAR2 ) IS
                                    
n_content_store_id  NUMBER;
n_document_store_id NUMBER;
n_report_id         NUMBER;
v_file_loc          BFILE;
v_file_con          BLOB;
v_file_size         INTEGER;
err_msg             VARCHAR2(255);
v_source_directory  VARCHAR2(255);
n_user_id           VARCHAR2(10 CHAR);
n_court_id          VARCHAR2(3 CHAR);


-- constants
v_mime_type           VARCHAR2(15) := 'application/pdf';                                  

    BEGIN
        p_file_loaded := 'Y';
        
        DBMS_OUTPUT.PUT_LINE('Start of load_document_for_event seq '||p_event_seq||' on case '||p_case_number);
        
        -- get the directory path for the SOURCE_DIR
        SELECT  a.directory_path
        INTO    v_source_directory
        FROM    all_directories a
        WHERE   a.directory_name = 'SOURCE_DIR';
        
        -- get the user id and court id 
        n_user_id   := sys_context('sups_app_ctx','app_user_id');
        n_court_id  := sys_context('sups_app_ctx','app_court_id');

        
        -- get the report id immediately as its needed to record errors
        
        SELECT  report_queue_sequence.NEXTVAL
        INTO    n_report_id
        FROM    dual;
       
        -- initialize the bfile locator
        v_file_loc := BFILENAME( 'SOURCE_DIR', p_pdf_filename );

        IF DBMS_LOB.FILEEXISTS( v_file_loc ) = 0 THEN
            -- file load failed
            p_file_loaded := 'N';
            DBMS_OUTPUT.PUT_LINE
            (p_pdf_filename||' does not exist in directory '||v_source_directory||' on case '||p_case_number);
            -- record the failure to upload the document
            INSERT INTO report_queue 
                        (
                        id, 
                        parent_id, 
                        status , 
                        mime_type, 
                        type , 
                        parameters, 
                        user_id , 
                        court_id, 
                        created_date, 
                        storage_duration, 
                        is_parent, 
                        error_message, 
                        send_status, 
                        print_status
                        )
            VALUES
                        (
                        n_report_id, 
                        n_report_id, 
                        4, 
                        v_mime_type,
                        -1,
                        '<params />',
                        n_user_id,
                        n_court_id,
                        SYSDATE,  
                        -1, 
                        0, 
                        'Failed to find file '||p_pdf_filename||' to upload',
                        0, 
                        0 
                        );
        ELSE
            -- document exists, so check it contains some data
            v_file_size := DBMS_LOB.GETLENGTH(v_file_loc);
                          
            IF  v_file_size != 0    THEN
                
                -- file has content so we need to upload to the database
                
                -- get the sequence numbers which are required.
                BEGIN
                    SELECT  content_sequence.NEXTVAL
                    INTO    n_content_store_id
                    FROM    dual;
                    
                    SELECT document_sequence.NEXTVAL
                    INTO n_document_store_id
                    FROM dual;                    
                    
                    IF p_debug = 'Y' THEN
                        DBMS_OUTPUT.PUT_LINE('Content id = '||n_content_store_id|| 'doc id = '||n_document_store_id);
                    END IF;
                    -- create a record with an empty blob into which the file will be loaded
                    INSERT INTO CONTENT_STORE (ID, DATA)
                    VALUES ( n_content_store_id, EMPTY_BLOB() )
                    RETURNING DATA INTO v_file_con;
                    
                    IF p_debug = 'Y' THEN
                        DBMS_OUTPUT.PUT_LINE('content store  '||SQL%ROWCOUNT);
                    END IF; -- debug
                    
                    -- open the file and upload the file into the record which was just created
                    DBMS_LOB.FILEOPEN(v_file_loc);
                    DBMS_LOB.LOADFROMFILE(v_file_con, v_file_loc, v_file_size);                    
                    
                    -- populate Document_store
                    INSERT INTO document_store (id, user_id , court_id, mime_type, is_viewed, is_persistent, content_store_id, created_date)
                    VALUES     ( n_document_store_id  ,n_user_id , n_court_id , v_mime_type ,'F', 'T', n_content_store_id, SYSDATE );
                    
                    IF p_debug = 'Y' THEN
                        DBMS_OUTPUT.PUT_LINE('Documents  '||SQL%ROWCOUNT);
                    END IF; -- debug
                    
                    -- populate report_queue
                    INSERT INTO report_queue (id, parent_id, status , mime_type, type , parameters, user_id , court_id, created_date, storage_duration, is_parent, document_id, send_status, print_status)
                    VALUES      (n_report_id, n_report_id, 2, v_mime_type , 0 , '<params />', n_user_id , n_court_id , SYSDATE,  -1, 0, n_document_store_id, 0, 0);

                    IF p_debug = 'Y' THEN
                        DBMS_OUTPUT.PUT_LINE('Report queue good  '||SQL%ROWCOUNT);
                    END IF; -- debug
                    
                    -- populate report_output
                    INSERT INTO REPORT_OUTPUT (output_id, date_created, printed, event_seq, report_id, order_id, user_id )
                    VALUES ( report_output_seq.NEXTVAL, SYSDATE, 'Y', p_event_seq, n_report_id, p_order_id, n_user_id );

                    IF p_debug = 'Y' THEN
                        DBMS_OUTPUT.PUT_LINE('Report output  '||SQL%ROWCOUNT);
                    END IF; -- debug
                    
                    -- close the lob if its still open
                    IF  DBMS_LOB.FILEISOPEN(v_file_loc) = 1 THEN
                        DBMS_LOB.FILECLOSE(v_file_loc);
                    END IF;
                    
                    EXCEPTION
                    WHEN OTHERS THEN
                        -- fail load failed
                        p_file_loaded := 'N';
                        err_msg:= sqlerrm;
                        dbms_output.put_line (err_msg);
                        INSERT INTO report_queue (id, parent_id, status , mime_type, type , parameters, user_id , court_id, created_date, storage_duration, is_parent, error_message, send_status, print_status)
                        VALUES
                            (n_report_id, n_report_id, 4, v_mime_type ,  -1 , '<params />', n_user_id , n_court_id , SYSDATE,  -1, 0, 'Failed to upload file: ' || err_msg , 0, 0 );
                                            -- close the lob if its still open
                    IF  DBMS_LOB.FILEISOPEN(v_file_loc) = 1  THEN
                        DBMS_LOB.FILECLOSE(v_file_loc);
                    END IF;

                END;
            ELSE
                -- record the fact the file is empty
                -- fail load failed
                p_file_loaded := 'N';
                DBMS_OUTPUT.PUT_LINE
                (p_pdf_filename||' contains 0 bytes of data in directory '||v_source_directory||' on case '||p_case_number);
                INSERT INTO report_queue 
                            (
                            id, 
                            parent_id, 
                            status , 
                            mime_type, 
                            type , 
                            parameters, 
                            user_id , 
                            court_id, 
                            created_date, 
                            storage_duration, 
                            is_parent, 
                            error_message, 
                            send_status, 
                            print_status
                            )
                VALUES
                            (
                            n_report_id, 
                            n_report_id, 
                            4, 
                            v_mime_type,
                            -1,
                            '<params />',
                            n_user_id,
                            n_court_id ,
                            SYSDATE,  
                            -1, 
                            0, 
                            'File '||p_pdf_filename||'contained 0 bytes',
                            0, 
                            0 
                            );
            END IF;  -- end of check for empty 
                 
        END IF; -- end of check for file exists
    END; -- end of load_document_for_event procedure
/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : reload_documents                                                                          *
* DESCRIPTION   : This procedure will scan the MCOL_PDF_STATUS table looking for documents which have not   *
*               : loaded. If it finds any it will attempt to load them using the control data in the        *
*               : MCOL_PDF_STATUS table                                                                     *
*               :                                                                                           *
*               : This situation may occur when the orginal document load failed due to the specified file  *
*               : being empty or missing. It is hoped that this issue will have been subsequently           *
*               : remedied by MCOL supplying the correct document file                                      *
\***********************************************************************************************************/
PROCEDURE reload_documents ( p_debug IN  VARCHAR2) IS

-- cursor to find unloaded pdf files.
CURSOR  cur_unloaded_files IS
SELECT  mps.pdf_file_name, 
        mps.loaded, 
        mps.event_seq, 
        mps.case_number, 
        mps.order_id
FROM    mcol_pdf_status mps
WHERE   mps.loaded = 'N'
AND     mps.event_seq IS NOT NULL -- this eliminates documents which
                                  -- have not been loaded due to the mcol event
                                  -- being rejected
FOR UPDATE OF mps.loaded;

l_loaded    VARCHAR2(1) := 'N';
l_event_seq NUMBER(9);

BEGIN

    -- Process all unloaded files.
    FOR unloaded_rec IN cur_unloaded_files
    LOOP
        -- first check to see if a file have already been loaded for the event
        BEGIN
            SELECT  ro.event_seq
            INTO    l_event_seq
            FROM    report_output ro
            WHERE   ro.event_seq = unloaded_rec.event_seq;
            
            -- PDF document has already been loaded and associated with this event
            -- set loaded flag to true , so we don't attempt a reload and the load status will be 
            -- updated
            
            l_loaded := 'Y';
            
            EXCEPTION WHEN NO_DATA_FOUND THEN
                -- no file loaded for the event, so set flag to attempt to load it
                l_loaded := 'N';
        END;
        
        IF l_loaded = 'N' THEN
            -- no MCOL PDF document has been associated with the specified event, so load the document
            load_document_for_event (
                                    unloaded_rec.case_number,
                                    unloaded_rec.pdf_file_name,
                                    unloaded_rec.event_seq,
                                    unloaded_rec.order_id,
                                    p_debug,
                                    l_loaded
                                    );
        END IF;
        
        IF l_loaded = 'N' THEN
            DBMS_OUTPUT.PUT_LINE('PDF reload of '||unloaded_rec.pdf_file_name||'for case '||unloaded_rec.case_number||' failed !');
        END IF;
        
        -- update the loading status
        
        UPDATE mcol_pdf_status mps
        SET mps.loaded = l_loaded
        WHERE CURRENT OF cur_unloaded_files;       
        
    END LOOP; -- end of loop processing unloaded files.
    COMMIT;
END;


END; -- end of document_load_pkg body
/