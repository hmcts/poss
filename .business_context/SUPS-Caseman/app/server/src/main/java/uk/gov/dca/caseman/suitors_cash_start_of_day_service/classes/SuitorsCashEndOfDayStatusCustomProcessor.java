/* Copyrights and Licenses
 * 
 * Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes CaseMan (County Court management system)."
 * - Products derived from this software may not be called "CaseMan" nor may
 * "CaseMan" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes CaseMan."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * TODO Id: $
 * TODO LastChangedRevision: $
 * TODO LastChangedDate: $
 * TODO LastChangedBy: $ 
 */
package uk.gov.dca.caseman.suitors_cash_start_of_day_service.classes;

import java.text.SimpleDateFormat;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: SuitorCashStartOfDay Method: getSuitorsCashEndOfDayStatus
 * Class: SuitorsCashEndOfDayStatusCustomProcessor.java
 * 
 * @author Mark Hallam
 *         Created: 16-Nov-2005
 * 
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 */
public class SuitorsCashEndOfDayStatusCustomProcessor extends AbstractCasemanCustomProcessor
{

    // Services.

    /** The Constant SUITORS_CASH_START_OF_DAY_SERVICE. */
    private static final String SUITORS_CASH_START_OF_DAY_SERVICE = "ejb/SuitorsCashStartOfDayServiceLocal";
    
    /** The Constant GET_LATEST_ITEM_DATE. */
    private static final String GET_LATEST_ITEM_DATE = "getLatestItemDateLocal";
    
    /** The Constant GET_PAYMENT_SUMMARY. */
    private static final String GET_PAYMENT_SUMMARY = "getPaymentSummaryLocal";

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param log the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log log) throws BusinessException, SystemException
    {
        final Document dom = new Document ();
        final Element ds = new Element ("ds");
        String adminCourtCode = null;

        try
        {
            adminCourtCode =
                    ((Element) XPath.selectSingleNode (params, "params/param[@name='adminCourtCode'")).getText ();

            // Check for End Of Day processing.
            final SimpleDateFormat sdf = new SimpleDateFormat ("dd-MM-yyyy");
            final String today = sdf.format (new java.util.Date ());
            final Element endOfDayElement = new Element ("EndOfDay");

            if (mEndOfDayProcessing (today, adminCourtCode))
            {
                ds.addContent (endOfDayElement);
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        /* Framework dictates that something must be returned to the client */
        dom.setRootElement (ds);
        return dom;
    }

    /**
     * (non-Javadoc)
     * Given todays date, check against the Payment Summary table
     * that the End Of Day process has been run.
     *
     * @param today the today
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mEndOfDayPaymentSummary (final String today, final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        boolean endOfDaySummary = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "date", today);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

        // Call the service with a date parameters.
        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, GET_PAYMENT_SUMMARY, inputDoc)
                .getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ResultSet/Row/Total";
        String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (value == null)
        {
            value = "0";
        }

        if (Integer.valueOf (value).intValue () > 0)
        {
            endOfDaySummary = true;
        }

        return endOfDaySummary;
    }

    /**
     * (non-Javadoc)
     * Check against the DCS table.
     * If the DCS table has no date record then it is safe to assume
     * that the End Of Month processing has run
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mEndOfDayDcs (final String adminCourtCode) throws SystemException, BusinessException, JDOMException
    {

        boolean endOfDayDcs = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

        psElement = invokeLocalServiceProxy (SUITORS_CASH_START_OF_DAY_SERVICE, GET_LATEST_ITEM_DATE, inputDoc)
                .getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ResultSet/Row/ItemDate";
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (value == null)
        {

            endOfDayDcs = true;
        }

        return endOfDayDcs;
    }

    /**
     * (non-Javadoc)
     * Check to ensure that End Of Day Processing has or has not run.
     * 
     * - If the DCS table has no date record then it is safe to assume that
     * the End Of Month processing has run
     * - If the PaymentSummary table has an entry for 'todaysDate' then the
     * 'end-of-day' has run.
     *
     * @param today the today
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mEndOfDayProcessing (final String today, final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {
        boolean endOfDayProcessing = false;
        if (mEndOfDayDcs (adminCourtCode))
        {
            endOfDayProcessing = true;
        }
        else
        {
            if (mEndOfDayPaymentSummary (today, adminCourtCode))
            {
                endOfDayProcessing = true;
            }
        }

        return endOfDayProcessing;
    }
}
