/**
 * Service: DmsReport
 * Method: getOverdueObligations()
 * Class: ObligationSearchGenerator.java
 * 
 * @author Chris Vincent
 *         Created: 17 January 2013
 * 
 *         Description:
 *         Dynamically produces a SQL statement based on criteria supplied by the customer
 * 
 *         Change History:
 * 
 */

package uk.gov.dca.caseman.dms_report_service.java;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;

/**
 * Generates a complex SQL query string.
 *
 * @author Chris Vincent
 */
public class ObligationSearchGenerator implements ISQLGenerator
{

    /**
     * Constructor.
     */
    public ObligationSearchGenerator ()
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

        final String owningCourtCode = context.getValue ("CourtCode").toString ();
        final String startDate = context.getValue ("startDate").toString ();
        final String endDate = context.getValue ("endDate").toString ();
        final String obligationType = context.getValue ("obligationType").toString ();

        final Object opageNumber = context.getValue ("pageNumber");
        final String pageNumber = opageNumber.toString ();

        final Object oPageSize = context.getValue ("pageSize");
        final String pageSize = oPageSize.toString ();

        final boolean criteriaAdded = false;

        final StringBuffer buffer = new StringBuffer ();

        buffer.append ("SELECT * ");
        buffer.append ("		FROM (SELECT ROW_NUMBER() OVER(ORDER BY OBLIGATION_TYPE_SEQ) AS R, ");
        buffer.append ("					\"OB.CASE_NUMBER\", ");
        buffer.append ("        			\"OB.OBLIGATION_TYPE\", ");
        buffer.append ("        			\"OT.OBLIGATION_TEXT\", ");
        buffer.append ("        			\"OB.EXPIRY_DATE\", ");
        buffer.append ("        			\"OB.LAST_USED_BY\", ");
        buffer.append ("       			\"OB.NOTES\", ");
        buffer.append ("       			\"OB.OBLIGATION_SEQ\", ");
        buffer.append ("       			\"OB.DELETE_FLAG\", ");
        buffer.append ("       			\"OBLIGATION_TYPE_SEQ\" ");
        buffer.append ("			  FROM (SELECT OB.CASE_NUMBER AS \"OB.CASE_NUMBER\", ");
        buffer.append ("						   OB.OBLIGATION_TYPE AS \"OB.OBLIGATION_TYPE\", ");
        buffer.append ("						   OT.OBLIGATION_TEXT AS \"OT.OBLIGATION_TEXT\", ");
        buffer.append ("						   OB.EXPIRY_DATE AS \"OB.EXPIRY_DATE\", ");
        buffer.append ("						   OB.LAST_USED_BY AS \"OB.LAST_USED_BY\", ");
        buffer.append ("						   OB.NOTES AS \"OB.NOTES\", ");
        buffer.append ("						   OB.OBLIGATION_SEQ AS \"OB.OBLIGATION_SEQ\", ");
        buffer.append ("						   OB.DELETE_FLAG AS \"OB.DELETE_FLAG\", ");
        buffer.append ("						   DECODE(OB.OBLIGATION_TYPE, ");
        buffer.append ("						   		  2,1, ");
        buffer.append ("						   		  32,2, ");
        buffer.append ("						   		  33,3, ");
        buffer.append ("						   		  4,4, ");
        buffer.append ("						   		  3,5, ");
        buffer.append ("						   		  1,6, ");
        buffer.append ("						   		  5,7, ");
        buffer.append ("						   		  6,8, ");
        buffer.append ("						   		  7,9, ");
        buffer.append ("						   		  8,10, ");
        buffer.append ("						   		  9,11, ");
        buffer.append ("						   		  10,12, ");
        buffer.append ("						   		  13,13, ");
        buffer.append ("						   		  14,14, ");
        buffer.append ("						   		  15,15, ");
        buffer.append ("						   		  16,16, ");
        buffer.append ("						   		  18,17, ");
        buffer.append ("						   		  21,18, ");
        buffer.append ("						   		  23,19, ");
        buffer.append ("						   		  24,20, ");
        buffer.append ("						   		  25,21, ");
        buffer.append ("						   		  28,22, ");
        buffer.append ("						   		  29,23, ");
        buffer.append ("						   		  30,24, ");
        buffer.append ("						   		  31,25, ");
        buffer.append ("						   		  32,26, ");
        buffer.append ("						   		  33,27, ");
        buffer.append ("						   		  27,30) AS \"OBLIGATION_TYPE_SEQ\" ");
        buffer.append ("			  		FROM OBLIGATIONS      OB, ");
        buffer.append ("			  			 OBLIGATION_TYPES OT, ");
        buffer.append ("			  			 CASES            CA ");
        buffer.append ("			  		WHERE CA.ADMIN_CRT_CODE = " + owningCourtCode + " ");
        buffer.append ("			  		AND   OB.CASE_NUMBER = CA.CASE_NUMBER ");

        if (null != startDate && !startDate.equals ("") && null != endDate && !endDate.equals (""))
        {
            buffer.append ("			  		AND   TRUNC(OB.EXPIRY_DATE) BETWEEN TO_DATE('" + startDate +
                    "','YYYY-MM-DD') AND TO_DATE('" + endDate + "','YYYY-MM-DD') ");
        }
        else
        {
            buffer.append ("			  		AND   TRUNC(SYSDATE) > TRUNC(OB.EXPIRY_DATE) ");
        }

        buffer.append ("			  		AND   OB.DELETE_FLAG = 'N' ");

        if (null != obligationType && !obligationType.equals (""))
        {
            buffer.append ("			  		AND   OB.OBLIGATION_TYPE = " + obligationType + " ");
        }

        buffer.append ("			  		AND   OB.OBLIGATION_TYPE = OT.OBLIGATION_TYPE ");
        buffer.append ("			  		) ");
        buffer.append ("			  ) ");
        buffer.append ("		WHERE R < (" + pageNumber + " * " + pageSize + ") + 1 ");
        buffer.append ("		AND   R > (" + pageNumber + " * " + pageSize + ") - " + pageSize + " ");

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
        return new ObligationSearchGenerator ();
    }

}
