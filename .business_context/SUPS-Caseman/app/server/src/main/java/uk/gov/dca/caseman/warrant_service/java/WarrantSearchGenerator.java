/**
 * Service: Qbp
 * Method: searchWarrants()
 * Class: WarrantSearchGenerator.java
 * 
 * @author Chris Hutt
 *         Created: 2nd October 2007
 * 
 *         Description:
 *         Dynamically produces a SQL statement based on criteria supplied by the customer
 * 
 *         Change History:
 * 
 *         Chris Hutt 8th Oct 2006. Defect TD caseman 6460
 *         Data Loading Error on Reprint warrant of Execution - N42 screen
 * 
 */

package uk.gov.dca.caseman.warrant_service.java;

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
public class WarrantSearchGenerator implements ISQLGenerator
{

    /**
     * Constructor.
     */
    public WarrantSearchGenerator ()
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

        String caseNumber = "";
        String executedBy = "";
        String warrantNumber = "";
        String CONumber = "";
        String localNumber = "";
        String issuedBy = "";
        String issueDate = "";

        final Object oIssueDate = context.getValue ("issueDate");
        if (null != oIssueDate)
        {
            issueDate = oIssueDate.toString ();
        }
        final Object oIssuedBy = context.getValue ("issuedBy");
        if (null != oIssuedBy)
        {
            issuedBy = oIssuedBy.toString ();
        }

        final Object oLocalNumber = context.getValue ("localNumber");
        if (null != oLocalNumber)
        {
            localNumber = oLocalNumber.toString ();
        }

        final Object oCONumber = context.getValue ("CONumber");
        if (null != oCONumber)
        {
            CONumber = oCONumber.toString ();
        }

        final Object oWarrantNumber = context.getValue ("warrantNumber");
        if (null != oWarrantNumber)
        {
            warrantNumber = oWarrantNumber.toString ();
        }

        final Object oExecutedBy = context.getValue ("executedBy");
        if (null != oExecutedBy)
        {
            executedBy = oExecutedBy.toString ();
        }

        final Object oCaseNumber = context.getValue ("caseNumber");
        if (null != oCaseNumber)
        {
            caseNumber = oCaseNumber.toString ();
        }

        caseNumber = cleanInput (caseNumber);
        executedBy = cleanInput (executedBy);
        warrantNumber = cleanInput (warrantNumber);
        CONumber = cleanInput (CONumber);
        localNumber = cleanInput (localNumber);
        issuedBy = cleanInput (issuedBy);
        issueDate = cleanInput (issueDate);

        final StringBuffer buffer = new StringBuffer ();

        buffer.append ("SELECT  C.NAME 		       AS \"C.NAME\" ");
        buffer.append (", 		W.CASE_NUMBER          AS \"W.CASE_NUMBER\" ");
        buffer.append (", 		W.CCBC_WARRANT         AS \"W.CCBC_WARRANT\" ");
        buffer.append (", 		W.CO_NUMBER            AS \"W.CO_NUMBER\" ");
        buffer.append (", 		W.CURRENTLY_OWNED_BY   AS \"W.CURRENTLY_OWNED_BY\" ");
        buffer.append (", 		W.DEF1_CASE_PARTY_NO   AS \"W.DEF1_CASE_PARTY_NO\" ");
        buffer.append (", 		W.DEF1_PARTY_ROLE_CODE AS \"W.DEF1_PARTY_ROLE_CODE\" ");
        buffer.append (", 		W.DEF2_CASE_PARTY_NO   AS \"W.DEF2_CASE_PARTY_NO\" ");
        buffer.append (", 		W.DEF2_PARTY_ROLE_CODE AS \"W.DEF2_PARTY_ROLE_CODE\" ");
        buffer.append (", 		W.DEFENDANT1           AS \"W.DEFENDANT1\" ");
        buffer.append (", 		W.DEFENDANT2           AS \"W.DEFENDANT2\" ");
        buffer.append (", 		W.EXECUTED_BY          AS \"W.EXECUTED_BY\" ");
        buffer.append (", 		W.ISSUED_BY            AS \"W.ISSUED_BY\" ");
        buffer.append (", 		W.LOCAL_WARRANT_NUMBER AS \"W.LOCAL_WARRANT_NUMBER\" ");
        buffer.append (", 		W.PLAINTIFF_NAME       AS \"W.PLAINTIFF_NAME\" ");
        buffer.append (", 		W.RECEIPT_DATE         AS \"W.RECEIPT_DATE\" ");
        buffer.append (", 		W.REP_CASE_PARTY_NO    AS \"W.REP_CASE_PARTY_NO\" ");
        buffer.append (", 		W.REP_PARTY_ROLE_CODE  AS \"W.REP_PARTY_ROLE_CODE\" ");
        buffer.append (", 		W.TO_TRANSFER          AS \"W.TO_TRANSFER\" ");
        buffer.append (", 		W.WARRANT_ID           AS \"W.WARRANT_ID\" ");
        buffer.append (", 		W.WARRANT_ISSUE_DATE   AS \"W.WARRANT_ISSUE_DATE\" ");
        buffer.append (", 		W.WARRANT_NUMBER       AS \"W.WARRANT_NUMBER\" ");
        buffer.append (", 		W.WARRANT_TYPE         AS \"W.WARRANT_TYPE\" ");
        buffer.append (", 		W.ORA_ROWSCN           AS \"W_ORA_ROWSCN\" ");
        buffer.append (", 		C.ORA_ROWSCN           AS \"C_ORA_ROWSCN\" ");
        buffer.append ("FROM 	WARRANTS W ");
        buffer.append (", 		COURTS C  ");
        buffer.append ("WHERE 	C.CODE = W.ISSUED_BY  ");

        if (null != executedBy && !executedBy.equals (""))
        {
            buffer.append ("	AND W.EXECUTED_BY = '" + executedBy + "' ");
        }

        if (null != caseNumber && !caseNumber.equals (""))
        {
            buffer.append ("	AND W.CASE_NUMBER = '" + caseNumber + "' ");
        }

        if (null != warrantNumber && !warrantNumber.equals (""))
        {
            buffer.append ("	AND W.WARRANT_NUMBER = '" + warrantNumber + "' ");
        }

        if (null != CONumber && !CONumber.equals (""))
        {
            buffer.append (" AND	W.CO_NUMBER = '" + CONumber + "' ");
        }

        if (null != localNumber && !localNumber.equals (""))
        {
            buffer.append ("	AND W.LOCAL_WARRANT_NUMBER = '" + localNumber + "' ");
        }

        if (null != issuedBy && !issuedBy.equals (""))
        {
            buffer.append ("	AND W.ISSUED_BY = '" + issuedBy + "' ");
        }

        if (null != issueDate && !issueDate.equals (""))
        {
            buffer.append ("	AND TRUNC(W.WARRANT_ISSUE_DATE ) = TO_DATE('" + issueDate + "', 'YYYY-MM-DD') ");
        }

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
        return new WarrantSearchGenerator ();
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
