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
package uk.gov.dca.caseman.payments_service.java;

import java.util.Date;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.payments_service.java.util.Payment;
import uk.gov.dca.caseman.payments_service.java.util.ServiceCaller;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Gets next report ID and/or transaction number and populates relevant fields
 * in the payment DOM so payment can be inserted into the database.
 * 
 * @author Steve Blair
 * 
 *         Change History
 *         27/06/2007 - Chris Vincent: Added courtId parameter to the refreshPayment function call.
 *         CaseMan Defect 6334.
 * 
 *         02/07/2007 - Chris Hutt as part of defect 6334 resolution ServiceCourtId node added to Payment
 *
 *         09/07/2007 - Chris Hutt : defect 6366 : defect 6334 extended to cover payments on a CO
 *         of type 'AO' associtated with a warrant
 */
public class PopulateReportIdCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor
     *      #process(org.jdom.Document, org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws BusinessException, SystemException
    {
        try
        {
            final Element paymentElement =
                    (Element) XPath.selectSingleNode (pDocParams, "/params/param[@name='payment']/Payment");
            final Element courtIdElement =
                    (Element) XPath.selectSingleNode (pDocParams, "/params/param[@name='courtId']");

            String courtId = null;
            if (null != courtIdElement)
            {
                courtId = ((Element) XPath.selectSingleNode (pDocParams, "/params/param[@name='courtId']")).getText ();
            }
            else
            {
                courtId = paymentElement.getChildText ("ServiceCourtId");
            }

            final Payment payment =
                    new Payment (paymentElement, new ServiceCaller (m_context)).refreshPayment (courtId);

            payment.populateTransactionNumber ();
            if (payment.populateReportData ())
            {
                updateReportDataTable (payment);
            }

            payment.addServiceCourtIdElement (courtId);

            // Needed for reports to locate relevant records on SUPS_AMENDMENTS.
            if (payment.getReportId ().length () > 0)
            {
                new ServiceCaller (m_context).setBusinessProcessId (payment.getReportId ());
            }

            return pDocParams;
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Insert/update a record on REPORT_DATA table using the new report number.
     *
     * @param payment the payment being processed
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void updateReportDataTable (final Payment payment) throws BusinessException, SystemException
    {
        Element reportData = getReportDataRecord (payment);

        if (reportData == null)
        {
            // Should only be necessary for Counter Payments.
            reportData = createDefaultRecord (payment);
        }

        reportData.getChild ("ReportNumber").setText (payment.getReportNumber ());

        commitReportDataRecord (reportData);
    }

    /**
     * Retrieves a record from REPORT_DATA table representing the payment's
     * report.
     *
     * @param payment the payment being processed
     * @return JDOM Element containing the REPORT_DATA record
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element getReportDataRecord (final Payment payment) throws BusinessException, SystemException
    {
        final Element reportDataParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (reportDataParams, "reportType", payment.getReportType ());
        XMLBuilder.addParam (reportDataParams, "reportDate", Payment.getSupsDateFormat ().format (new Date ()));
        XMLBuilder.addParam (reportDataParams, "courtId", payment.getAdminCourt ());
        XMLBuilder.addParam (reportDataParams, "userId", payment.getCreatedBy ());

        final Document results = new ServiceCaller (m_context).callService ("ejb/PaymentsServiceLocal",
                "getReportDataLocal2", reportDataParams);
        return results.getRootElement ().getChild ("ReportData");
    }

    /**
     * Constructs a new record for inserting into the REPORT_DATA table.
     * 
     * @param payment the payment being processed
     * @return JDOM Element representing the record
     */
    private Element createDefaultRecord (final Payment payment)
    {
        final Element reportData;
        reportData = new Element ("ReportData");
        reportData.addContent (new Element ("UserID"));
        reportData.getChild ("UserID").setText (payment.getCreatedBy ());
        reportData.addContent (new Element ("ReportType"));
        reportData.getChild ("ReportType").setText (payment.getReportType ());
        reportData.addContent (new Element ("ReportNumber"));
        reportData.addContent (new Element ("ReportDate"));
        reportData.getChild ("ReportDate").setText (Payment.getSupsDateFormat ().format (new Date ()));
        reportData.addContent (new Element ("CourtCode"));
        reportData.getChild ("CourtCode").setText (payment.getAdminCourt ());
        return reportData;
    }

    /**
     * Creates/updates a record on the REPORT_DATA table.
     *
     * @param reportData JDOM Element representing the record
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void commitReportDataRecord (final Element reportData) throws BusinessException, SystemException
    {
        final Element reportDataParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (reportDataParams, "reportData", (Element) reportData.clone ());

        new ServiceCaller (m_context).callService ("ejb/PaymentsServiceLocal", "insertReportDataLocal2",
                reportDataParams);
    }

}