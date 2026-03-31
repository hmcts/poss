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
 * 07-June-2006 Kevin Gichohi (EDS): Removed the catch(BusinessException e) erroneously added.
 */
public class CheckCompletePayoutStatusCustomProcessor extends AbstractCasemanCustomProcessor
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
     * Get pre payout run status method name.
     */
    public static final String GET_PRE_PAYOUT_RUN_STATUS = "getPplRunStatusLocal";
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

            if ( !mPayoutRunning (adminCourtCode) && mPrePayoutRun (adminCourtCode))
            {
                // neither payout or dividend payout are being run and PrePayout HAS run
                mCreateLock (params);

                final Element payoutProceed = new Element ("PayoutProceed");
                ds.addContent (payoutProceed);
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
     * Get payment running status via a service call.
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
     * Get pre payout run status via a service call.
     *
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mPrePayoutRun (final String adminCourtCode) throws SystemException, BusinessException, JDOMException
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
            psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PRE_PAYOUT_RUN_STATUS, inputDoc).getRootElement ();

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/PrePayoutRunning/ppl";
        final String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if ("0".equals (value))
        {
            throw new BusinessException ("Prepayout List must be run before Payout is printed.");
        }

        return true;
    }

    /**
     * (non-Javadoc)
     * Call insertReportDataLocal.
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
