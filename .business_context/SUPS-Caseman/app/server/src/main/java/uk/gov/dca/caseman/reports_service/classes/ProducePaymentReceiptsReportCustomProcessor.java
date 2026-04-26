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
package uk.gov.dca.caseman.reports_service.classes;

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
 * Service: Reports Method: producePaymentReceipts
 * Class: ProducePaymentReceiptsReportCustomProcessor.java
 * 
 * @author Mark Hallam
 *         Created: 26-01-2006
 * 
 *         Description: run the payment receipts report for a given user on a given date
 *         and update Payments Receipt_Required flag to 'P'rinted.
 *
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 */
public class ProducePaymentReceiptsReportCustomProcessor extends AbstractCasemanCustomProcessor
{

    // Services.

    /** The Constant REPORTS_SERVICE. */
    private static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";

    /** The Constant REQUEST_REPORT. */
    private static final String REQUEST_REPORT = "requestReportLocal";

    /** The Constant PAYMENTS_SERVICE. */
    private static final String PAYMENTS_SERVICE = "ejb/PaymentsServiceLocal";
    
    /** The Constant CHECK_POSTAL_RECEIPTS. */
    private static final String CHECK_POSTAL_RECEIPTS = "checkPostalReceiptsLocal";
    
    /** The Constant UPDATE_POSTAL_RECEIPTS. */
    private static final String UPDATE_POSTAL_RECEIPTS = "updatePaymentReceiptsFlagLocal";

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

        RequestReportXMLBuilder requestReportBuilder = null;
        final Element RequestReportElement = null;
        final Element paramsElement = null;

        String inputBy = null;
        String dateCreated = null;
        String runBy = null;
        // defect 2713 - see above
        String courtId = null;
        String userId = null;

        try
        {

            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();

            inputBy = ((Element) XPath.selectSingleNode (params, "params/param[@name='inputBy'")).getText ();
            dateCreated = ((Element) XPath.selectSingleNode (params, "params/param[@name='dateCreated'")).getText ();
            runBy = ((Element) XPath.selectSingleNode (params, "params/param[@name='runBy'")).getText ();

            if (mCheckReportsToPrint (inputBy, dateCreated, courtId))
            {
                // Create to requestReportBuilder (a object holding params which can be easily
                // converted into XML for submission to report service) and load with common properties
                requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                        "", // String pPrintJobId
                        "", // String pJobId
                        courtId, // String pCourtCode
                        userId // String pCourtUser
                );

                requestReportBuilder.addSpecificParameter ("P_INPUT_BY", inputBy);
                requestReportBuilder.addSpecificParameter ("P_PAYMENT_DATE", dateCreated);
                requestReportBuilder.addSpecificParameter ("P_COUNTER_PAYMENT", "N");

                mRunReport ("CM_RCPT.rdf", requestReportBuilder);

                mUpdatePaymentReceipts (inputBy, dateCreated, courtId);
            }
            else
            {
                String message = null;
                if ("supervisor".equals (runBy))
                {
                    message = "There are no receipts to be printed for this user and date";
                }
                else
                {
                    message = "There are no receipts to be printed today";
                }
                throw new BusinessException (message);
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        /* Framework dictates that something must be returned to the client */
        return params;
    }

    /**
     * (non-Javadoc)
     * Update the RECEIPT_REQUIRED field on the PAYMENTS table with the value of 'P'
     * matching on inputBy, dateCreated and AdminCourtCode.
     *
     * @param inputBy the input by
     * @param dateCreated the date created
     * @param pCourtId - added as part of defect 2713 change
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdatePaymentReceipts (final String inputBy, final String dateCreated, final String pCourtId)
        throws SystemException, BusinessException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        final String receiptRequiredFlag = "P";

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "receiptRequiredFlag", receiptRequiredFlag);
        XMLBuilder.addParam (paramsElement, "inputBy", inputBy);
        XMLBuilder.addParam (paramsElement, "dateCreated", dateCreated);
        XMLBuilder.addParam (paramsElement, "courtId", pCourtId);

        psElement = invokeLocalServiceProxy (PAYMENTS_SERVICE, UPDATE_POSTAL_RECEIPTS, inputDoc).getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Runs Report.
     *
     * @param pReport the report
     * @param pRequestReportXMLBuilder the request report XML builder
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mRunReport (final String pReport, final RequestReportXMLBuilder pRequestReportXMLBuilder)
        throws BusinessException, SystemException
    {

        Element RequestReportElement = null;
        Element paramsElement = null;
        Document reportParams = null;

        reportParams = new Document ();
        pRequestReportXMLBuilder.setReportModule (pReport);
        RequestReportElement = pRequestReportXMLBuilder.getXMLElement ("Report");
        paramsElement = XMLBuilder.getNewParamsElement (reportParams);
        XMLBuilder.addParam (paramsElement, "reportRequest", (Element) RequestReportElement.clone ());

        // Call the request report service via a proxy
        invokeLocalServiceProxy (REPORTS_SERVICE, REQUEST_REPORT, reportParams).getRootElement ();
    }

    /**
     * (non-Javadoc)
     * Determines if reports are to be printed.
     *
     * @param inputBy the input by
     * @param dateCreated the date created
     * @param pCourtId - added as part of defect 2713 change
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mCheckReportsToPrint (final String inputBy, final String dateCreated, final String pCourtId)
        throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;

        boolean reportsToPrint = false;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "userId", inputBy);
        XMLBuilder.addParam (paramsElement, "dateCreated", dateCreated);
        XMLBuilder.addParam (paramsElement, "adminCrownCourt", pCourtId);

        psElement = invokeLocalServiceProxy (PAYMENTS_SERVICE, CHECK_POSTAL_RECEIPTS, inputDoc).getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/PostalReceipts/NoOfPayments";
        String value = XMLBuilder.getXPathValue (psElement, returnValueXPath);

        if (value == null)
        {
            value = "0";
        }
        if (Integer.valueOf (value).intValue () > 0)
        {
            reportsToPrint = true;
        }

        return reportsToPrint;

    }
}
