CREATE OR REPLACE PACKAGE sups_coded_party_cascade_pack IS
    /******************************************************************************************************************/
    /*                                                 P A C K A G E                                                  */
    /******************************************************************************************************************/

	/******************************************************************************************************************/
    /* Module     : SUPS_CODED_PARTY_CASCADE_PACK.pck                                                                 */
    /* Description: In the SUPS Caseman database snapshots of Coded Party details are                                 */
    /*              held against Warrants and Payments.                                                               */
    /*              When Coded Party details are updated, these details need be cascaded                              */
    /*              into the Warrants and Payments.                                                                   */
    /*                                                                                                                */
    /*              Derived from a Legacy Caseman Central Server script :-                                            */
    /*                  RUN_SCR730_create_cs_general_pack.sql                                                         */
    /*                                                                                                                */
    /* Amendment History                                                                                              */
    /*                                                                                                                */
    /* Date         Name             Amendment                                                                        */
    /* ------------------------------------------------------------------------                                       */
    /* 05-Jul-2006  Phil Haferer     Original Version.                                                                */
    /*                                                                                                                */
    /* 17-Jan-2008  Chris Hutt       Locking / transaction management taken out to reflect                            */
    /*                               the fact that this job is no longer running in the daytime                       */
    /*                               and therefore doesnt have to worry about contention                              */
    /*                               Undertaken as part of CCBC performance fixes                                     */
	/* 20-May-2011	Nilesh Mistry	 TRAC #2804. Amended p_cascade_update_to_warrants so that it					  */
	/*								 does not update warrants at local courts when a CCBC local						  */
	/*								 coded party has been updated													  */
	/* 19-Sep-2011	Chris Vincent	 TRAC #4553. Amended p_cascade_update_to_warrants so that it					  */
	/*								 CCBC National Coded Parties in the range 7000-9999 are 						  */
	/*								 picked up.																		  */
    /*                                                                                                                */
	/******************************************************************************************************************/

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_log_error                                                                                     */	
    /* DESCRIPTION	: Log an error in the database.                                                                   */
    /******************************************************************************************************************/
    PROCEDURE p_log_error(
        p_sqlcode     IN NUMBER,
        p_location    IN VARCHAR,
        p_description IN VARCHAR,
        p_record_id   IN VARCHAR);


    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_cascade_update_to_payments                                                                    */	
    /* DESCRIPTION	: Cascades the changes to Coded Parties to Payments.                                              */
    /******************************************************************************************************************/
    PROCEDURE p_cascade_update_to_payments(
        p_code             IN coded_parties.code%TYPE,
        p_party_id         IN coded_parties.party_id%TYPE,
        p_name             IN parties.person_requested_name%TYPE,
        p_addr_1           IN given_addresses.address_line1%TYPE,
        p_addr_2           IN given_addresses.address_line2%TYPE,
        p_addr_3           IN given_addresses.address_line3%TYPE,
        p_addr_4           IN given_addresses.address_line4%TYPE,
        p_addr_5           IN given_addresses.address_line5%TYPE,
        p_postcode         IN given_addresses.postcode%TYPE,
        p_tel_no           IN parties.tel_no%TYPE,
        p_dx_number        IN parties.dx_number%TYPE,
        p_updated          IN OUT BOOLEAN);



    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_cascade_update_to_warrants                                                                    */	
    /* DESCRIPTION	: Cascades the changes to Coded Parties to Warrants and Payments.                                 */
    /******************************************************************************************************************/
    PROCEDURE p_cascade_update_to_warrants(
        p_code             IN coded_parties.code%TYPE,
        p_name             IN parties.person_requested_name%TYPE,
        p_addr_1           IN given_addresses.address_line1%TYPE,
        p_addr_2           IN given_addresses.address_line2%TYPE,
        p_addr_3           IN given_addresses.address_line3%TYPE,
        p_addr_4           IN given_addresses.address_line4%TYPE,
        p_addr_5           IN given_addresses.address_line5%TYPE,
        p_postcode         IN given_addresses.postcode%TYPE,
        p_tel_no           IN parties.tel_no%TYPE,
        p_dx_number        IN parties.dx_number%TYPE,
        p_court_id         IN VARCHAR2,
        p_updated          IN OUT BOOLEAN);

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_coded_party_cascade_update                                                                    */	
    /* DESCRIPTION	: Cascades the changes to Coded Parties to Warrants and Payments.                                 */
    /******************************************************************************************************************/
    PROCEDURE p_coded_party_cascade_update;
                                                         
END sups_coded_party_cascade_pack;
/
CREATE OR REPLACE PACKAGE BODY sups_coded_party_cascade_pack IS
    /**********************************************************************************************************************/
    /*                                            P A C K A G E  B O D Y                                                  */
    /**********************************************************************************************************************/

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_log_error                                                                                     */
    /* DESCRIPTION	: Log an error in the database.                                                                   */
    /******************************************************************************************************************/
    PROCEDURE p_log_error(
        p_sqlcode     IN NUMBER,
        p_location    IN VARCHAR,
        p_description IN VARCHAR,
        p_record_id   IN VARCHAR)
    IS
    BEGIN
        INSERT INTO VALIDATE_ERRORS
        ( MODULE_ID
        , ERR_NUMBER
        , ERR_DATE
        , LOCATION
        , DESCRIPTION
        , RECORD_ID
        ) VALUES
        ( 'CP_CASCD'
        , p_sqlcode
        , sysdate
        , SUBSTR(p_location   , 1, 20)
        , SUBSTR(p_description, 1, 100)
        , SUBSTR(p_record_id  , 1, 20));

        COMMIT;

    END p_log_error;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_cascade_update_to_payments                                                                    */
    /* DESCRIPTION	        : Cascades the changes to Coded Parties to Payments.                                              */
    /******************************************************************************************************************/
    PROCEDURE p_cascade_update_to_payments(
        p_code             IN coded_parties.code%TYPE,
        p_party_id         IN coded_parties.party_id%TYPE,
        p_name             IN parties.person_requested_name%TYPE,
        p_addr_1           IN given_addresses.address_line1%TYPE,
        p_addr_2           IN given_addresses.address_line2%TYPE,
        p_addr_3           IN given_addresses.address_line3%TYPE,
        p_addr_4           IN given_addresses.address_line4%TYPE,
        p_addr_5           IN given_addresses.address_line5%TYPE,
        p_postcode         IN given_addresses.postcode%TYPE,
        p_tel_no           IN parties.tel_no%TYPE,
        p_dx_number        IN parties.dx_number%TYPE,
        p_updated          IN OUT BOOLEAN)
    IS


        CURSOR c_courts
        IS
            SELECT crt.code
            FROM   courts crt
            WHERE  crt.sups_centralised_flag = 'Y'
            ORDER BY crt.code;
            
         l_courts               c_courts%ROWTYPE;      

    BEGIN
        p_updated := TRUE;

        /* Coded Party's Court Codes may not always correspond to the Court Code
           of the Payment it has been used on.
           This will be the case for National Coded Parties.
           Therefore, we will iterate through each of the SUPS Courts in turn
           processing the payments related to the given Coded Party .
        */
        OPEN c_courts;
        LOOP
            FETCH c_courts INTO l_courts;
            IF c_courts%NOTFOUND THEN
                CLOSE c_courts;
                EXIT;
            END IF;

            UPDATE payments py
            SET    py.payee_name     = p_name
            ,      py.payee_addr_1   = p_addr_1
            ,      py.payee_addr_2   = p_addr_2
            ,      py.payee_addr_3   = p_addr_3
            ,      py.payee_addr_4   = p_addr_4
            ,      py.payee_addr_5   = p_addr_5
            ,      py.payee_postcode = p_postcode
            ,      py.payee_tel_no   = p_tel_no
            ,      py.payee_rep_dx   = p_dx_number
            WHERE  py.admin_court_code   = l_courts.code
            AND    py.payee_id           = p_party_id;
                 
            COMMIT;
                   
        END LOOP;

    EXCEPTION
	WHEN others THEN
            -- Tidy up the cursors we're working on.
            BEGIN
                CLOSE c_courts;
            EXCEPTION
                WHEN OTHERS THEN
                     NULL;
            END;

            -- Log the problem.
            p_log_error(
                /* p_sqlcode     */SQLCODE,
                /* p_location    */'CascadUpdtToPayments',
                /* p_description */'Payment updates failed ... ' ||sqlerrm,
                /* p_record_id   */'['||p_code||']');

    	    -- Raise the error.
    	    RAISE;

    END p_cascade_update_to_payments;


    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_cascade_update_to_warrants                                                                    */
    /* DESCRIPTION	        : Cascades the changes to Coded Parties to Warrants                                */
    /******************************************************************************************************************/
    PROCEDURE p_cascade_update_to_warrants(
        p_code             IN coded_parties.code%TYPE,
        p_name             IN parties.person_requested_name%TYPE,
        p_addr_1           IN given_addresses.address_line1%TYPE,
        p_addr_2           IN given_addresses.address_line2%TYPE,
        p_addr_3           IN given_addresses.address_line3%TYPE,
        p_addr_4           IN given_addresses.address_line4%TYPE,
        p_addr_5           IN given_addresses.address_line5%TYPE,
        p_postcode         IN given_addresses.postcode%TYPE,
        p_tel_no           IN parties.tel_no%TYPE,
        p_dx_number        IN parties.dx_number%TYPE,
        p_court_id         IN VARCHAR2,
        p_updated          IN OUT BOOLEAN)
    IS

    BEGIN
    
         p_updated := TRUE;
     
		-- Update any warrants that have NOT been created via the Create Foreign Warrants screen
		-- so if is a local coded party then will be associated with the warrant issuing court.
        UPDATE 	warrants w
        SET    	w.rep_name             = p_name
        ,      	w.rep_addr_1           = p_addr_1
        ,      	w.rep_addr_2           = p_addr_2
        ,      	w.rep_addr_3           = p_addr_3
        ,      	w.rep_addr_4           = p_addr_4
        ,      	w.rep_addr_5           = p_addr_5
        ,      	w.rep_postcode         = p_postcode
        ,      	w.rep_tel_no           = p_tel_no
        ,      	w.rep_dx_number        = p_dx_number
        WHERE  	w.coded_party_rep_code = p_code
        AND   	(w.issued_by   = p_court_id
				OR p_court_id          = 0
				OR 	(p_court_id        = 335
					AND p_code		   BETWEEN 1500 AND 1999)
				OR 	(p_court_id        = 335
					AND p_code		   BETWEEN 7000 AND 9999))
		AND		w.warrant_id NOT IN
					(SELECT w2.warrant_id
					FROM 	warrants w2
					WHERE 	w2.coded_party_rep_code = p_code
					AND   	(w2.issued_by   = p_court_id
					OR 		p_court_id          = 0
					OR 		(p_court_id        = 335
							AND p_code		   BETWEEN 1500 AND 1999)
					OR 		(p_court_id        = 335
							AND p_code		   BETWEEN 7000 AND 9999))
					AND	   	w2.local_warrant_number IS NOT NULL
					AND	    w2.date_printed IS NOT NULL
					AND		w2.date_reprinted IS NOT NULL
					AND		TRUNC(w2.date_printed) = TRUNC(w2.date_reprinted)
					AND		w2.reprinted_by IS NULL
					AND		w2.def1_party_role_code IS NULL
					AND		w2.def1_case_party_no IS NULL);
		
		-- Update any warrants created on Create Foreign Warrants screen which use
		-- local coded parties of the executing court (at time of creation) as opposed 
		-- to the issuing court
		UPDATE 	warrants w
        SET    	w.rep_name             = p_name
        ,      	w.rep_addr_1           = p_addr_1
        ,      	w.rep_addr_2           = p_addr_2
        ,      	w.rep_addr_3           = p_addr_3
        ,      	w.rep_addr_4           = p_addr_4
        ,      	w.rep_addr_5           = p_addr_5
        ,      	w.rep_postcode         = p_postcode
        ,      	w.rep_tel_no           = p_tel_no
        ,      	w.rep_dx_number        = p_dx_number
        WHERE 	w.coded_party_rep_code = p_code
        AND   	(w.currently_owned_by   = p_court_id
				OR 	p_court_id          = 0
				OR 	(p_court_id         = 335
					AND p_code			BETWEEN 1500 AND 1999)
				OR 	(p_court_id         = 335
					AND p_code			BETWEEN 7000 AND 9999))
		AND	   	w.local_warrant_number IS NOT NULL
		AND	    w.date_printed IS NOT NULL
		AND		w.date_reprinted IS NOT NULL
		AND		TRUNC(w.date_printed) = TRUNC(w.date_reprinted)
		AND		w.reprinted_by IS NULL
		AND		w.def1_party_role_code IS NULL
		AND		w.def1_case_party_no IS NULL;

        COMMIT;
 
    EXCEPTION
	WHEN OTHERS THEN
            -- Log the problem.
            p_log_error(
                /* p_sqlcode     */SQLCODE,
                /* p_location    */'CascdUpdtToWarrant',
                /* p_description */'Warrant updates failed ... ' ||sqlerrm,
                /* p_record_id   */'['||p_code||']');

    	    -- Raise the error.
    	    RAISE;

    END p_cascade_update_to_warrants;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_coded_party_cascade_update                                                                    */
    /* DESCRIPTION	: Cascades the changes to Coded Parties to Warrants and Payments.                                 */
    /******************************************************************************************************************/
    PROCEDURE p_coded_party_cascade_update IS

        CURSOR c_updated_coded_parties IS
            SELECT cp.party_id
            ,      cp.admin_court_code
            ,      cp.code
            ,      p.person_requested_name
            ,      ga.address_line1
            ,      ga.address_line2
            ,      ga.address_line3
            ,      ga.address_line4
            ,      ga.address_line5
            ,      ga.postcode
            ,      p.tel_no
            ,      p.dx_number
            FROM   coded_parties   cp
            ,      parties         p
            ,      given_addresses ga
            WHERE  cp.cascade_update_flag = 'Y'
            AND    p.party_id             = cp.party_id
            AND    ga.party_id            = cp.party_id
            AND    ga.address_type_code   = 'CODED PARTY';

        l_payments_updated BOOLEAN;
        l_warrants_updated BOOLEAN;

        l_user_id    sups_amendments.user_id%TYPE;
        l_court_id   sups_amendments.court_id%TYPE;
        l_process_id sups_amendments.process_id%TYPE;

    BEGIN

        -- Iterate through each of the updated Coded Parties.
        FOR updated_coded_party IN c_updated_coded_parties
        LOOP
            -- Set up the 'Context' for the Audit triggers.
            l_user_id    := 'casm_'||TO_CHAR(updated_coded_party.admin_court_code);
            l_court_id   := TO_CHAR(updated_coded_party.admin_court_code);
            l_process_id := 'CPCasUpdate';
            sys.set_sups_app_ctx(l_user_id, l_court_id, l_process_id);

            p_cascade_update_to_payments(
                /* p_code             */updated_coded_party.code,
                /* p_party_id       */updated_coded_party.party_id,
                /* p_name           */updated_coded_party.person_requested_name,
                /* p_addr_1         */updated_coded_party.address_line1,
                /* p_addr_2         */updated_coded_party.address_line2,
                /* p_addr_3         */updated_coded_party.address_line3,
                /* p_addr_4         */updated_coded_party.address_line4,
                /* p_addr_5         */updated_coded_party.address_line5,
                /* p_postcode       */updated_coded_party.postcode,
                /* p_tel_no         */updated_coded_party.tel_no,
                /* p_dx_number      */updated_coded_party.dx_number,
                /* p_updated        */l_payments_updated);
                
            p_cascade_update_to_warrants(
                /* p_code             */updated_coded_party.code,
                /* p_name             */updated_coded_party.person_requested_name,
                /* p_addr_1           */updated_coded_party.address_line1,
                /* p_addr_2           */updated_coded_party.address_line2,
                /* p_addr_3           */updated_coded_party.address_line3,
                /* p_addr_4           */updated_coded_party.address_line4,
                /* p_addr_5           */updated_coded_party.address_line5,
                /* p_postcode         */updated_coded_party.postcode,
                /* p_tel_no           */updated_coded_party.tel_no,
                /* p_dx_number        */updated_coded_party.dx_number,
                /* p_court_id         */l_court_id,  
                /* p_updated          */l_warrants_updated);

            -- Drop the Cascade Update Flag on the Coded Party.
            IF  l_payments_updated
            AND l_warrants_updated
            THEN
                UPDATE CODED_PARTIES CP
                SET    CP.CASCADE_UPDATE_FLAG = NULL
                WHERE  CP.ADMIN_COURT_CODE = updated_coded_party.admin_court_code
                AND    CP.CODE             = updated_coded_party.code;
                COMMIT;
            END IF;

        END LOOP;

    EXCEPTION
		WHEN others THEN
            -- Log the problem.
            p_log_error(
                /* p_sqlcode     */SQLCODE,
                /* p_location    */'CodedPrtyCascadUpdat',
                /* p_description */'Failed! '||
                                   SQLERRM,
                /* p_record_id   */'');

    END p_coded_party_cascade_update;

END sups_coded_party_cascade_pack;
/
