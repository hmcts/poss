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

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Runs counter receipt report CM_CTR_RCPT.
 * 
 * @author Kevin Gichohi
 */
public class RunCounterReceiptReportCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param log the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor
     *      #process(org.jdom.Document, org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log log) throws BusinessException, SystemException
    {
        try
        {
            final Element payment =
                    (Element) XPath.selectSingleNode (params, "params/param[@name='payment']/Payment");

            if (payment.getChildText ("ReportType").equals ("CVER"))
            {
                runCverReport (payment, m_context);
            }

            return params;
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Runs the Counter Payments Receipts Report (CM_CTR_RCPT) using details of
     * payment passed in.
     *
     * @param payment payment DOM matching map_payment.xml structure
     * @param context CustomProcessor context
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static void runCverReport (final Element payment, final IComponentContext context)
        throws SystemException, BusinessException
    {
        final SupsLocalServiceProxy2 localServiceProxy = new SupsLocalServiceProxy2 ();
        final ComponentInput inputHolder = new ComponentInput (context.getInputConverterFactory ());
        final ComponentInput outputHolder = new ComponentInput (context.getInputConverterFactory ());

        final Element reportData = new Element ("ReportData");
        reportData.addContent (new Element ("ReportNumber"));
        reportData.getChild ("ReportNumber").setText (payment.getChildText ("ReportNumber"));
        reportData.addContent (new Element ("ReportType"));
        reportData.getChild ("ReportType").setText (payment.getChildText ("ReportType"));
        reportData.addContent (new Element ("TransactionNumber"));
        reportData.getChild ("TransactionNumber").setText (payment.getChildText ("TransactionNumber"));
        reportData.addContent (new Element ("EnforcementCourtCode"));
        reportData.getChild ("EnforcementCourtCode").setText (payment.getChildText ("AdminCourt"));

        final Element reportParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (reportParams, "reportData", (Element) reportData.clone ());
        XMLBuilder.addParam (reportParams, "userId", payment.getChildText ("CreatedBy"));
        XMLBuilder.addParam (reportParams, "courtId", payment.getChildText ("AdminCourt"));

        inputHolder.setData (new Document (reportParams), Document.class);
        localServiceProxy.invoke ("ejb/ReportsServiceLocal", "produceCreatePaymentsReportsLocal2", context, inputHolder,
                outputHolder);
    }

}