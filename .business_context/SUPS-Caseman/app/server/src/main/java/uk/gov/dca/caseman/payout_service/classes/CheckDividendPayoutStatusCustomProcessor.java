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
package uk.gov.dca.caseman.payout_service.classes;

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
 * Class: SuitorsCashEndOfDayStatusCustomProcessor.java @author Mark Hallam
 * Created: 16-Nov-2005
 * 
 * Description:
 * 
 * Change History:
 * 17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 */
public class CheckDividendPayoutStatusCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Payout service name.
     */
    public static final String PAYOUT_SERVICE = "ejb/PayoutServiceLocal";
    /**
     * Get payout running status method name.
     */
    public static final String GET_PAYOUT_RUNNING_STATUS = "getPayoutRunningStatusLocal";
    /**
     * Get payable order header method name.
     */
    public static final String GET_PAYABLE_ORDER_HEADER = "getPayableOrderHeaderLocal";
    /**
     * Get payable order count method name.
     */
    public static final String GET_PAYABLE_ORDER_COUNT = "getPayableOrderCountLocal";
    /**
     * Insert report data method name.
     */
    public static final String INSERT_REPORT_DATA = "insertReportDataLocal";

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

            if ( !mPayoutRunning (adminCourtCode))
            {
                final boolean weeklyPayout = mPayableOrderHeader (adminCourtCode);
                if ( !weeklyPayout || weeklyPayout && !mPPLDataIsCurrent (adminCourtCode))
                {

                    // neither payout or dividend payout are being run
                    // and weekly payout is the latest
                    // and it's not just historical data

                    mCreateLock (params);

                    final Element payoutProceed = new Element ("PayoutProceed");
                    ds.addContent (payoutProceed);
                }
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        /* Framework dictates that something must be returned to the client */
        // dom.addContent(ds);
        dom.setRootElement (ds);
        return dom;
    }

    /**
     * (non-Javadoc)
     * Determine the payout running status.
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mPayoutRunning (final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

            // Call the service with a date parameters.
            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYOUT_RUNNING_STATUS, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/PayoutRunning/reportType";
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if ("PAY".equals (value))
        {
            throw new BusinessException ("Payout currently being run by another user.");
        }
        else if ("DIV".equals (value))
        {
            throw new BusinessException ("Dividend Payout currently being run by another user.");
        }

        return false;
    }

    /**
     * (non-Javadoc)
     * Get the payable order header.
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mPayableOrderHeader (final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        boolean weeklyPayout = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYABLE_ORDER_HEADER, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/PayableOrderHeader/reportId";
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if ( !"DIV".equals (value))
        {
            weeklyPayout = true;
        }

        return weeklyPayout;
    }

    /**
     * (non-Javadoc)
     * Determines if the PPL data is current.
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mPPLDataIsCurrent (final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        final boolean historic = false;

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYABLE_ORDER_COUNT, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/PayableOrderHeader/reportId";
        String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (value == null)
        {
            value = "0";
        }

        if (Integer.valueOf (value).intValue () > 0)
        {
            throw new BusinessException ("Pre-Payout List has been run as part of Payout Processing.");
        }

        return historic;
    }

    /**
     * (non-Javadoc)
     * Inserts report data.
     *
     * @param params the params
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mCreateLock (final Document params) throws SystemException, BusinessException
    {

        Element psElement = null;

        try
        {
            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, INSERT_REPORT_DATA, params).getRootElement ();

        }
        finally
        {
        }
    }
}
