/**
 * Service: Qbp
 * Method: getCaseParties()
 * Class: QbpCaseSearchGenerator.java
 * 
 * @author Chris Hutt
 *         Created: 16th October 2007
 *
 *         Description:
 *         Dynamically produces a SQL statement based on criteria supplied by the customer to support Query By Party
 *         Case
 *
 *         Change History:
 *
 *         Chris Hutt 26 Nov 2007
 *         Specific query for CCBC based on following assumptions:
 *         1)Any person related selection criteria are confined to 'DEFENDANT'
 *         2)Any search results are confined to 'DEFENDANT'
 *         3)Any UPPERS are done client-side
 *         4)No defendants are coded parties.
 *         5)All GIVEN_ADDRESSES rows related to defendants have a PARTY_ID, CASE_NUMBER and PARTY_ROLE_CODE
 *
 *         Chris Hutt 27Nov07 : Performance TRIAL VERSION 1
 *         calls ccbc/non ccbc specific routines
 *
 *         Chris Hutt 5Dec07 : Performance TRIAL VERSION 2
 *         ccbc specific query no longer assumes that PARTY_ID populated on GIVEN_ADDRESSES. This means that
 *         CASE_PARTY_ROLES has to
 *         be used.
 *
 *         Chris Hutt 13Dec07 : TD Caseman 6473 : Performance VERSION FOR CCBC POST GO-LIVE EMERGENCY RELEASE.
 *         This version makes use of the Materialized view 'mv_ccbc_defendants' where the case belongs to CCBC.
 *         However, the SQL option is left in for future reference. The controlling parameter 'queryType' can be
 *         supplied
 *         by the client (with a value other than '1') to invoke the table-based version instead of the materialized
 *         view.
 *         It should be noted that in performance trials the best alternative to the materialized view option was a
 *         version
 *         where the SQL did not include CASE_PARTY_ROLES but instead derived PARTY_ID from GIVEN_ADDRESSES. However,
 *         the problem here is that PARTY_ID is not populated by the Manage Case screen for non-coded parties.
 *
 *         Chris Hutt 8Jan08 :USD 84568
 *         Now nonCCBC cases also make use of a materialized views ..... 'MV_CMAN_PARTIES' and 'MV_CMAN_PARTY_ADDRESSES'
 *         This is included in method 'nonCcbcMvQuery'. The original sql associated with non CCBC cases
 *         is retained in the method 'nonCcbcSqlQuery'which was 'nonCcbcQuery' in the previous version
 *
 *         NOTE: nonCcbcSqlQuery' and 'ccbcSqlQuery'have been retained (even though not called) in the
 *         interests of maintainability in future.
 *
 *         Chris Vincent 24 April 2008: UCT_Group2 Defect 1686
 *         Change to nonCcbcMvQuery() to remove the union all, join the two materialised views on case number
 *         and retrieve the coded party code from the materialised view rather than as null or from the coded_parties
 *         table.
 *
 *         Phil Barton (Valtech) Dec 08
 *         Remove multiple query methods. Change to use new materialized view instead of two.
 * 
 *         Sandeep Mullangi (logica) 27th Jan 2009: Applying RFC486 insolvency number changes.
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
 * The Class QbpCaseSearchGenerator.
 */
public class QbpCaseSearchGenerator implements ISQLGenerator
{

    /** The Constant CCBC_COURT_CODE. */
    public static final String CCBC_COURT_CODE = "335";

    /**
     * Constructor.
     */
    public QbpCaseSearchGenerator ()
    {
        super ();

    }

    /**
     * Not used.
     *
     * @param arg0 an element
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ISQLGenerator#initialise(org.jdom.Element)
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

        String address1 = context.getValue ("address1").toString ();
        String address2 = context.getValue ("address2").toString ();
        String owningCourtCode = context.getValue ("owningCourtCode").toString ();
        String caseNumber = context.getValue ("caseNumber").toString ();
        String partyName = context.getValue ("partyName").toString ();
        String partyType = context.getValue ("partyType").toString ();
        String insolvencyNo = context.getValue ("insolvencyNumber").toString ();

        final int pageNumber;
        final int pageSize;
        try
        {
            pageNumber = Integer.parseInt (context.getValue ("pageNumber").toString ());
            pageSize = Integer.parseInt (context.getValue ("pageSize").toString ());
        }
        catch (final NumberFormatException e)
        {
            throw new BusinessException (e);
        }

        final int rowEnd = pageNumber * pageSize + 1;
        final int rowStart = (pageNumber - 1) * pageSize;

        address1 = cleanInput (address1);
        address2 = cleanInput (address2);
        owningCourtCode = cleanInput (owningCourtCode);
        caseNumber = cleanInput (caseNumber);
        partyName = cleanInput (partyName);
        partyType = stripPercent (partyType);
        insolvencyNo = cleanInput (insolvencyNo);

        if (owningCourtCode.equals (CCBC_COURT_CODE))
        {
            // a CCBC query
            return ccbcQuery (address1, address2, caseNumber, partyName, insolvencyNo, rowStart, rowEnd);
        }
        else
        {
            // not a CCBC query
            return nonCcbcQuery (address1, address2, owningCourtCode, caseNumber, partyName, partyType, insolvencyNo,
                    rowStart, rowEnd);
        }

    } // generate

    /**
     * Produce the SQL query for a NON CCBC case based on a view.
     *
     * @param address1 the address 1
     * @param address2 the address 2
     * @param owningCourtCode the owning court code
     * @param caseNumber the case number
     * @param partyName the party name
     * @param partyType the party type
     * @param insolvencyNo the insolvency no
     * @param rowStart the row start
     * @param rowEnd the row end
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String nonCcbcQuery (final String address1, final String address2, final String owningCourtCode,
                                 final String caseNumber, final String partyName, final String partyType,
                                 final String insolvencyNo, final int rowStart, final int rowEnd)
        throws BusinessException, SystemException
    {

        final StringBuffer buffer = new StringBuffer ();

        buffer.append ("SELECT * FROM ( ");
        buffer.append (
                "		SELECT ROW_NUMBER() OVER (ORDER BY rownum) AS R,\"CP.CODE\",\"CPR.CASE_NUMBER\",\"GA.ADDRESS_LINE1\", \"GA.ADDRESS_LINE2\", \"P.PERSON_REQUESTED_NAME\", \"PR.PARTY_ROLE_DESCRIPTION\", \"C.INSOLVENCY_NUMBER\" FROM ");
        buffer.append ("		(SELECT C.CODE 	AS \"CP.CODE\", ");
        buffer.append ("			C.CASE_NUMBER 			AS \"CPR.CASE_NUMBER\", ");
        buffer.append ("			C.ADDRESS_LINE1 			AS \"GA.ADDRESS_LINE1\",");
        buffer.append ("			C.ADDRESS_LINE2 			AS \"GA.ADDRESS_LINE2\",");
        buffer.append ("			C.PERSON_REQUESTED_NAME 	AS \"P.PERSON_REQUESTED_NAME\", ");
        buffer.append ("			C.PARTY_ROLE_DESCRIPTION	AS \"PR.PARTY_ROLE_DESCRIPTION\", ");
        buffer.append ("         C.INSOLVENCY_NUMBER AS \"C.INSOLVENCY_NUMBER\"");
        buffer.append ("		FROM 	MV_QBP_CASE C");
        buffer.append ("		WHERE   C.ADMIN_CRT_CODE = '").append (owningCourtCode).append ("' ");

        if (null != partyName && !partyName.equals (""))
        {
            buffer.append ("	AND C.PERSON_REQUESTED_NAME LIKE '").append (partyName).append ("' ");
        }

        if (null != partyType && !partyType.equals (""))
        {
            buffer.append ("	AND C.PARTY_ROLE_CODE = '").append (partyType).append ("' ");
        }

        if (null != address1 && !address1.equals (""))
        {
            buffer.append (" AND C.ADDRESS_LINE1 LIKE '").append (address1).append ("' ");
        }

        if (null != address2 && !address2.equals (""))
        {
            buffer.append ("	AND C.ADDRESS_LINE2 LIKE '").append (address2).append ("' ");
        }

        if (null != caseNumber && !caseNumber.equals (""))
        {
            buffer.append (" AND	C.CASE_NUMBER LIKE '").append (caseNumber).append ("' ");
        }
        if (null != insolvencyNo && !insolvencyNo.equals (""))
        {
            buffer.append (" AND C.INSOLVENCY_NUMBER = '" + insolvencyNo + "'");
        }

        buffer.append (") )");

        buffer.append (" WHERE R < ").append (rowEnd).append (" AND R> ").append (rowStart);

        return buffer.toString ();
    } // nonCcbcQuery

    /**
     * Produce the SQL query for a CCBC case based on a view.
     *
     * @param address1 the address 1
     * @param address2 the address 2
     * @param caseNumber the case number
     * @param partyName the party name
     * @param insolvencyNo the insolvency no
     * @param rowStart the row start
     * @param rowEnd the row end
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String ccbcQuery (final String address1, final String address2, final String caseNumber,
                              final String partyName, final String insolvencyNo, final int rowStart, final int rowEnd)
        throws BusinessException, SystemException
    {

        final StringBuffer buffer = new StringBuffer ();
        boolean filterAdded = false;

        buffer.append ("SELECT * FROM ( ");
        buffer.append (
                "		SELECT ROW_NUMBER() OVER (ORDER BY rownum) AS R,\"CP.CODE\",\"CPR.CASE_NUMBER\",\"GA.ADDRESS_LINE1\", \"GA.ADDRESS_LINE2\", \"P.PERSON_REQUESTED_NAME\", \"PR.PARTY_ROLE_DESCRIPTION\" FROM ");
        buffer.append ("		(SELECT null 	AS \"CP.CODE\", ");
        buffer.append ("			cdd.CASE_NUMBER 			AS \"CPR.CASE_NUMBER\", ");
        buffer.append ("			cdd.ADDRESS_LINE1 			AS \"GA.ADDRESS_LINE1\",");
        buffer.append ("			cdd.ADDRESS_LINE2 			AS \"GA.ADDRESS_LINE2\",");
        buffer.append ("			cdd.PERSON_REQUESTED_NAME 	AS \"P.PERSON_REQUESTED_NAME\", ");
        buffer.append ("			'Defendant' 				AS \"PR.PARTY_ROLE_DESCRIPTION\", ");
        buffer.append ("         null AS \"C.INSOLVENCY_NUMBER\" ");
        buffer.append ("		FROM MV_CCBC_DEFENDANTS CDD");
        buffer.append ("		WHERE 	");

        if (null != address1 && !address1.equals (""))
        {
            buffer.append ("	  	CDD.ADDRESS_LINE1 LIKE '").append (address1).append ("' ");
            filterAdded = true;
        }

        if (null != address2 && !address2.equals (""))
        {
            if (filterAdded)
            {
                buffer.append ("			AND  ");
            }
            else
            {
                filterAdded = true;
            }
            buffer.append ("	CDD.ADDRESS_LINE2 LIKE '").append (address2).append ("' ");
        }

        if (null != caseNumber && !caseNumber.equals (""))
        {
            if (filterAdded)
            {
                buffer.append ("			AND  ");
            }
            else
            {
                filterAdded = true;
            }
            buffer.append ("			CDD.CASE_NUMBER LIKE '").append (caseNumber).append ("'");
        }

        if (null != partyName && !partyName.equals (""))
        {
            if (filterAdded)
            {
                buffer.append ("			AND  ");
            }
            else
            {
                filterAdded = true;
            }
            buffer.append ("			CDD.PERSON_REQUESTED_NAME LIKE '").append (partyName).append ("' ");
        }
        // when insolvency number is searched on CCBC court the result should be empty
        if (null != insolvencyNo && !insolvencyNo.equals (""))
        {
            if (filterAdded)
            {
                buffer.append ("			AND  ");
            }
            else
            {
                filterAdded = true;
            }
            buffer.append ("	            1 < 0 ");
        }

        buffer.append ("		ORDER BY 2,6,5,1,3,4 ");
        buffer.append ("	) ) ");
        buffer.append (" WHERE R < ").append (rowEnd).append (" AND R> ").append (rowStart);

        return buffer.toString ();
    } // ccbcQuery

    /**
     * Clone.
     *
     * @return the return object
     * @see java.lang.Object#clone()
     */
    public Object clone ()
    {
        return new QbpCaseSearchGenerator ();
    }

    /**
     * (non-Javadoc)
     * protect all apostrophes with an additional single quote (SQL requirement).
     *
     * @param data the data
     * @return corrected string
     */
    private String cleanInput (final String data)
    {

        return data.replaceAll ("'", "''");
    }

    /**
     * Strip percent.
     *
     * @param data the data
     * @return the string
     */
    private String stripPercent (final String data)
    {

        return data.replaceAll ("%", "");
    }

}
