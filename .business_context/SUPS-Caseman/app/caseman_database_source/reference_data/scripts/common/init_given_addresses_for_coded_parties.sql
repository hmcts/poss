-- Project:     SUPS Caseman
-- File:        init_given_addresses_for_coded_parties.sql
-- Author:      Chris Hutt
-- Created:     22 Oct 2007
-- Description: 
--              This PL/SQL will create one GIVEN_ADDRESSES row (with a default set of values)
--              for each CODED_PARTIES row that does not already have one.
--              
--
-- Change History:

INSERT INTO GIVEN_ADDRESSES ( 
	ADDRESS_ID ,
        ADDRESS_LINE1,
        ADDRESS_LINE2,
	ADDRESS_LINE3,
	ADDRESS_LINE4,
	ADDRESS_LINE5,
	POSTCODE,
        PARTY_ID,
        ADDRESS_TYPE_CODE)
SELECT
	ADDR_SEQUENCE.nextval 	AS ADDRESS_ID,
        CP.ADDRESS_LINE1	AS ADDRESS_LINE1,
	CP.ADDRESS_LINE2	AS ADDRESS_LINE2,
	CP.ADDRESS_LINE3	AS ADDRESS_LINE3,
	CP.ADDRESS_LINE4	AS ADDRESS_LINE4,
	CP.ADDRESS_LINE5	AS ADDRESS_LINE5,
        CP.POSTCODE 		AS POSTCODE,
        PARTY_ID 		AS PARTY_ID,
        'CODED PARTY'		AS ADDRESS_TYPE_CODE
FROM 	CODED_PARTIES CP
WHERE 	CP.PARTY_ID NOT IN (	SELECT 
					GA.PARTY_ID 
				FROM 
					GIVEN_ADDRESSES GA 
				WHERE 
					GA.PARTY_ID = CP.PARTY_ID);
	
COMMIT;

/