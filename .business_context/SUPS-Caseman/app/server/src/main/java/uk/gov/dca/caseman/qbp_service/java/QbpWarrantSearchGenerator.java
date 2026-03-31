/**
 * Service: Qbp
 * Method: getCaseParties()
 * Class: QbpCaseSearchGenerator.java
 * 
 * @author Chris Hutt
 *         Created: 4th October 2007
 * 
 *         Description:
 *         Dynamically produces a SQL statement based on criteria supplied by the customer
 * 
 *         Change History:
 * 
 */

package uk.gov.dca.caseman.qbp_service.java;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;

/**
 * Generates a complex SQL query string
 * (to search for each instance of a particular event model) which is
 * used in the getEventInstances service.
 * 
 * @author Chris Hutt
 * 
 */
public class QbpWarrantSearchGenerator implements ISQLGenerator
{

    /** The Constant HINT_FOR_CASE_NO. */
    public static final String HINT_FOR_CASE_NO = "/*+ INDEX_DESC(GA GIVEN_ADDRESSES) INDEX_DESC(P XPKPARTIES)  */";

    /** The Constant HINT_FOR_CO_NO. */
    public static final String HINT_FOR_CO_NO = "/*+ INDEX_DESC(GA XIF2GIVEN_ADDRESSES) */";

    /**
     * Constructor.
     */
    public QbpWarrantSearchGenerator ()
    {
        super ();

    }

    /**
     * Not used.
     *
     * @param arg0 the arg 0
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ISQLGenerator#initialise(org.jdom.Element)
     * @Param arg0 an element
     */
    public void initialise (final Element arg0) throws SystemException
    {
    }

    /**
     * Builds a search string using the inputXML.
     *
     * @param inputXML the input xml in the form of a document that is to be processed
     * @param context the context
     * @return String the sql query
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ISQLGenerator#generate(org.jdom.Document, uk.gov.dca.db.pipeline.IQueryContextReader)
     */
    public String generate (final Document inputXML, final IQueryContextReader context)
        throws BusinessException, SystemException
    {

        String owningCourtCode = context.getValue ("owningCourtCode").toString ();
        String caseNumber = context.getValue ("caseNumber").toString ();
        String coNumber = context.getValue ("CONumber").toString ();
        String partyName = context.getValue ("partyName").toString ();
        String address1 = context.getValue ("address1").toString ();
        String address2 = context.getValue ("address2").toString ();
        String postCode = context.getValue ("postCode").toString ();
        String executingCourtCode = context.getValue ("executingCourtCode").toString ();
        // String executingCourtName = context.getValue("executingCourtName").toString();

        final Object opageNumber = context.getValue ("pageNumber");
        final String pageNumber = opageNumber.toString ();

        final Object oPageSize = context.getValue ("pageSize");
        final String pageSize = oPageSize.toString ();

        owningCourtCode = cleanInput (owningCourtCode);
        caseNumber = cleanInput (caseNumber);
        coNumber = cleanInput (coNumber);
        partyName = cleanInput (partyName);
        address1 = cleanInput (address1);
        address2 = cleanInput (address2);
        postCode = cleanInput (postCode);
        executingCourtCode = cleanInput (executingCourtCode);

        boolean criteriaAdded = false;

        // Work out correct hint
        String sqlHint = "";
        if (null != caseNumber)
        {
            sqlHint = HINT_FOR_CASE_NO;
        }
        else
        {
            if (null != coNumber)
            {
                sqlHint = HINT_FOR_CO_NO;
            }
        }

        final StringBuffer buffer = new StringBuffer ();

        buffer.append ("SELECT * FROM ( ");
        buffer.append (
                "		SELECT ROW_NUMBER() OVER (ORDER BY rownum) AS R, \"W.WARRANT_ID\", \"PARTY_ROLE_CODE\", \"W.WARRANT_NUMBER\", \"W.LOCAL_WARRANT_NUMBER\", \"W.CASE_NUMBER\", \"PARTY_NAME\", \"PARTY_ADDR_1\", \"PARTY_ADDR_2\", \"W.LIVE\" FROM  ");
        buffer.append ("					(SELECT " + sqlHint + " W.WARRANT_ID AS \"W.WARRANT_ID\", ");
        buffer.append ("        			W.REP_PARTY_ROLE_CODE AS \"PARTY_ROLE_CODE\", ");
        buffer.append ("        			W.WARRANT_NUMBER AS \"W.WARRANT_NUMBER\", ");
        buffer.append ("        			W.LOCAL_WARRANT_NUMBER AS \"W.LOCAL_WARRANT_NUMBER\", ");
        buffer.append ("        			W.CASE_NUMBER AS \"W.CASE_NUMBER\", ");
        buffer.append ("       			W.PLAINTIFF_NAME AS \"PARTY_NAME\", ");
        buffer.append ("			W.REP_ADDR_1 AS \"PARTY_ADDR_1\", ");
        buffer.append ("			W.REP_ADDR_2 AS \"PARTY_ADDR_2\", ");
        buffer.append ("			(SELECT DECODE( COUNT(*), 0 , '', 'Y') FROM WARRANTS W1 ");
        buffer.append ("			  WHERE W1.WARRANT_ID = W.WARRANT_ID AND ");
        buffer.append ("			  ( ");
        buffer.append ("			    ( ");
        buffer.append ("			      W1.WARRANT_ID NOT IN ");
        buffer.append ("			      ( ");
        buffer.append ("			        SELECT WR2.WARRANT_ID FROM WARRANT_RETURNS WR2, RETURN_CODES RC2 WHERE ");
        buffer.append ("			        ((WR2.DEFENDANT_ID IS NOT NULL) AND (WR2.DEFENDANT_ID = '1')) AND ");
        buffer.append ("			        WR2.ERROR_INDICATOR != 'Y' AND ");
        buffer.append ("			        RC2.RETURN_CODE = WR2.RETURN_CODE AND ");
        buffer.append ("			        RC2.RETURN_TYPE = 'F' ");
        buffer.append ("			      ) ");
        buffer.append ("			    ) ");
        buffer.append ("			    OR ");
        buffer.append ("			    ( ");
        buffer.append ("			      W1.DEFENDANT2 IS NOT NULL AND ");
        buffer.append ("			      W1.WARRANT_ID NOT IN ");
        buffer.append ("			      ( ");
        buffer.append ("			        SELECT WR2.WARRANT_ID FROM WARRANT_RETURNS WR2, RETURN_CODES RC2 WHERE ");
        buffer.append ("			          ((WR2.DEFENDANT_ID IS NOT NULL) AND (WR2.DEFENDANT_ID = '2')) AND ");
        buffer.append ("			          WR2.ERROR_INDICATOR IS NOT NULL AND ");
        buffer.append ("			          WR2.ERROR_INDICATOR != 'Y' AND ");
        buffer.append ("			          RC2.RETURN_CODE = WR2.RETURN_CODE AND ");
        buffer.append ("			          RC2.RETURN_TYPE = 'F' ");
        buffer.append ("			      ) ");
        buffer.append ("			    ) ");
        buffer.append ("			  )	  ");
        buffer.append ("			) AS \"W.LIVE\" ");
        buffer.append ("		FROM WARRANTS W ");
        buffer.append ("		WHERE  ");
        buffer.append ("		(    ");

        criteriaAdded = false;

        if (null != owningCourtCode && !owningCourtCode.equals (""))
        {
            buffer.append ("	    W.ISSUED_BY = '" + owningCourtCode + "' ");
            criteriaAdded = true;
        }

        if (null != executingCourtCode && !executingCourtCode.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.EXECUTED_BY = '" + executingCourtCode + "' ");
        }

        if (null != caseNumber && !caseNumber.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.CASE_NUMBER LIKE '" + caseNumber + "' ");

        }

        if (null != coNumber && !coNumber.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.CO_NUMBER LIKE '" + coNumber + "' ");
        }

        if (null != partyName && !partyName.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.PLAINTIFF_NAME LIKE '" + partyName + "' ");
        }

        if (null != address1 && !address1.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.REP_ADDR_1 LIKE '" + address1 + "' ");
        }

        if (null != address2 && !address2.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.REP_ADDR_2 LIKE '" + address2 + "' ");
        }

        if (null != postCode && !postCode.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.REP_POSTCODE LIKE '" + postCode + "' ");
        }

        buffer.append ("		) ");
        buffer.append ("		UNION ALL ");
        buffer.append ("		SELECT " + sqlHint + " W.WARRANT_ID AS \"W.WARRANT_ID\", ");
        buffer.append ("			W.DEF1_PARTY_ROLE_CODE AS \"PARTY_ROLE_CODE\", ");
        buffer.append ("			W.WARRANT_NUMBER AS \"W.WARRANT_NUMBER\", ");
        buffer.append ("			W.LOCAL_WARRANT_NUMBER AS \"W.LOCAL_WARRANT_NUMBER\", ");
        buffer.append ("			W.CASE_NUMBER AS \"W.CASE_NUMBER\", ");
        buffer.append ("			W.DEFENDANT1 AS \"PARTY_NAME\", ");
        buffer.append ("			W.DEF1_ADDR_1 AS \"PARTY_ADDR_1\", ");
        buffer.append ("			W.DEF1_ADDR_2 AS \"PARTY_ADDR_2\", ");
        buffer.append ("			(SELECT DECODE( COUNT(*), 0 , '', 'Y') FROM WARRANTS W1 ");
        buffer.append ("			  WHERE W1.WARRANT_ID = W.WARRANT_ID AND ");
        buffer.append ("			  ( ");
        buffer.append ("			    ( ");
        buffer.append ("			      W1.WARRANT_ID NOT IN ");
        buffer.append ("			      ( ");
        buffer.append ("			        SELECT WR2.WARRANT_ID FROM WARRANT_RETURNS WR2, RETURN_CODES RC2 WHERE ");
        buffer.append ("			        ((WR2.DEFENDANT_ID IS NOT NULL) AND (WR2.DEFENDANT_ID = '1')) AND ");
        buffer.append ("			        WR2.ERROR_INDICATOR != 'Y' AND ");
        buffer.append ("			        RC2.RETURN_CODE = WR2.RETURN_CODE AND ");
        buffer.append ("			        RC2.RETURN_TYPE = 'F' ");
        buffer.append ("			      ) ");
        buffer.append ("			    ) ");
        buffer.append ("			    OR ");
        buffer.append ("			    ( ");
        buffer.append ("			      W1.DEFENDANT2 IS NOT NULL AND ");
        buffer.append ("			      W1.WARRANT_ID NOT IN ");
        buffer.append ("			      ( ");
        buffer.append ("			        SELECT WR2.WARRANT_ID FROM WARRANT_RETURNS WR2, RETURN_CODES RC2 WHERE ");
        buffer.append ("			          ((WR2.DEFENDANT_ID IS NOT NULL) AND (WR2.DEFENDANT_ID = '2')) AND ");
        buffer.append ("			          WR2.ERROR_INDICATOR IS NOT NULL AND ");
        buffer.append ("			          WR2.ERROR_INDICATOR != 'Y' AND ");
        buffer.append ("			          RC2.RETURN_CODE = WR2.RETURN_CODE AND ");
        buffer.append ("			          RC2.RETURN_TYPE = 'F' ");
        buffer.append ("			      ) ");
        buffer.append ("			    ) ");
        buffer.append ("			  )	    ");
        buffer.append ("			) AS \"W.LIVE\" ");
        buffer.append ("		FROM WARRANTS W ");
        buffer.append ("		WHERE  ");
        buffer.append ("		(    ");

        criteriaAdded = false;

        if (null != owningCourtCode && !owningCourtCode.equals (""))
        {
            buffer.append ("	    W.ISSUED_BY = '" + owningCourtCode + "' ");
            criteriaAdded = true;
        }

        if (null != executingCourtCode && !executingCourtCode.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.EXECUTED_BY = '" + executingCourtCode + "' ");
        }

        if (null != caseNumber && !caseNumber.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.CASE_NUMBER LIKE '" + caseNumber + "' ");

        }

        if (null != coNumber && !coNumber.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.CO_NUMBER LIKE '" + coNumber + "' ");
        }

        if (null != partyName && !partyName.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.DEFENDANT1 LIKE '" + partyName + "' ");
        }

        if (null != address1 && !address1.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.DEF1_ADDR_1 LIKE '" + address1 + "' ");
        }

        if (null != address2 && !address2.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.DEF1_ADDR_2 LIKE '" + address2 + "' ");
        }

        if (null != postCode && !postCode.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.DEF1_POSTCODE LIKE '" + postCode + "' ");
        }

        buffer.append ("		) ");
        buffer.append ("		UNION ALL ");
        buffer.append ("		SELECT " + sqlHint + " W.WARRANT_ID AS \"W.WARRANT_ID\", ");
        buffer.append ("			W.DEF2_PARTY_ROLE_CODE AS \"PARTY_ROLE_CODE\", ");
        buffer.append ("			W.WARRANT_NUMBER AS \"W.WARRANT_NUMBER\", ");
        buffer.append ("			W.LOCAL_WARRANT_NUMBER AS \"W.LOCAL_WARRANT_NUMBER\", ");
        buffer.append ("			W.CASE_NUMBER AS \"W.CASE_NUMBER\", ");
        buffer.append ("			W.DEFENDANT2 AS \"PARTY_NAME\", ");
        buffer.append ("			W.DEF2_ADDR_1 AS \"PARTY_ADDR_1\", ");
        buffer.append ("			W.DEF2_ADDR_2 AS \"PARTY_ADDR_2\", ");
        buffer.append ("			(SELECT DECODE( COUNT(*), 0 , '', 'Y') FROM WARRANTS W1 ");
        buffer.append ("			  WHERE W1.WARRANT_ID = W.WARRANT_ID AND ");
        buffer.append ("			  ( ");
        buffer.append ("			    ( ");
        buffer.append ("			      W1.WARRANT_ID NOT IN ");
        buffer.append ("			      ( ");
        buffer.append ("			        SELECT WR2.WARRANT_ID FROM WARRANT_RETURNS WR2, RETURN_CODES RC2 WHERE ");
        buffer.append ("			        ((WR2.DEFENDANT_ID IS NOT NULL) AND (WR2.DEFENDANT_ID = '1')) AND ");
        buffer.append ("			        WR2.ERROR_INDICATOR != 'Y' AND ");
        buffer.append ("			        RC2.RETURN_CODE = WR2.RETURN_CODE AND ");
        buffer.append ("			        RC2.RETURN_TYPE = 'F' ");
        buffer.append ("			      ) ");
        buffer.append ("			    ) ");
        buffer.append ("			    OR ");
        buffer.append ("			    ( ");
        buffer.append ("			      W1.DEFENDANT2 IS NOT NULL AND ");
        buffer.append ("			      W1.WARRANT_ID NOT IN ");
        buffer.append ("			      ( ");
        buffer.append ("			        SELECT WR2.WARRANT_ID FROM WARRANT_RETURNS WR2, RETURN_CODES RC2 WHERE ");
        buffer.append ("			          ((WR2.DEFENDANT_ID IS NOT NULL) AND (WR2.DEFENDANT_ID = '2')) AND ");
        buffer.append ("			          WR2.ERROR_INDICATOR IS NOT NULL AND ");
        buffer.append ("			          WR2.ERROR_INDICATOR != 'Y' AND ");
        buffer.append ("			          RC2.RETURN_CODE = WR2.RETURN_CODE AND ");
        buffer.append ("			          RC2.RETURN_TYPE = 'F' ");
        buffer.append ("			      ) ");
        buffer.append ("			    ) ");
        buffer.append ("			  )	        	 ");
        buffer.append ("			) AS \"W.LIVE\" ");
        buffer.append ("		FROM WARRANTS W ");
        buffer.append ("		WHERE  ");
        buffer.append ("		(    ");
        buffer.append ("			W.DEFENDANT2 IS NOT NULL  ");
        buffer.append ("			AND ");
        buffer.append ("			( ");

        criteriaAdded = false;

        if (null != owningCourtCode && !owningCourtCode.equals (""))
        {
            buffer.append ("	    W.ISSUED_BY = '" + owningCourtCode + "' ");
            criteriaAdded = true;
        }

        if (null != executingCourtCode && !executingCourtCode.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.EXECUTED_BY = '" + executingCourtCode + "' ");
        }

        if (null != caseNumber && !caseNumber.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.CASE_NUMBER LIKE '" + caseNumber + "' ");

        }

        if (null != coNumber && !coNumber.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.CO_NUMBER LIKE '" + coNumber + "' ");
        }

        if (null != partyName && !partyName.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.DEFENDANT2 LIKE '" + partyName + "' ");
        }

        if (null != address1 && !address1.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.DEF2_ADDR_1 LIKE '" + address1 + "' ");
        }

        if (null != address2 && !address2.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.DEF2_ADDR_2 LIKE '" + address2 + "' ");
        }

        if (null != postCode && !postCode.equals (""))
        {
            if (criteriaAdded)
            {
                buffer.append ("	AND ");
            }
            else
            {
                criteriaAdded = true;
            }
            buffer.append ("	W.DEF2_POSTCODE LIKE '" + postCode + "' ");
        }

        buffer.append ("			) ");
        buffer.append ("		) ");
        buffer.append ("		ORDER BY 3,4,2,6,7,8,9 ");
        buffer.append ("	) ) ");
        buffer.append (
                " WHERE R < " + pageNumber + " * " + pageSize + " +1 AND R> " + "(" + pageNumber + "-1)* " + pageSize);

        return buffer.toString ();
    }

    /**
     * Clone.
     *
     * @return the return object
     * @see java.lang.Object#clone()
     */
    public Object clone ()
    {
        return new QbpWarrantSearchGenerator ();
    }

    /**
     * Clean input.
     *
     * @param data the data
     * @return the string
     */
    private String cleanInput (final String data)
    {

        return data.replaceAll ("'", "''");
    }
}
