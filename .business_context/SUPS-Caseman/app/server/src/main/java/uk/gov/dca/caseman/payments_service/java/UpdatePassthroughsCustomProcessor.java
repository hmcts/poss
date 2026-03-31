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

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.payments_service.java.util.ConsolidatedOrder;
import uk.gov.dca.caseman.payments_service.java.util.Debt;
import uk.gov.dca.caseman.payments_service.java.util.Payment;
import uk.gov.dca.caseman.payments_service.java.util.ServiceCaller;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Updates passthrough payments and associated COs/debts.
 * 
 * @author Steve Blair
 */
public class UpdatePassthroughsCustomProcessor extends AbstractCasemanCustomProcessor
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
            final Element paymentsElement =
                    (Element) XPath.selectSingleNode (params, "/params/param[@name='payments']/Payments");
            final List<Payment> payments = Payment.parseElements (paymentsElement, new ServiceCaller (m_context));

            final int reportNumber = updatePayments (payments);

            processCoDebts (payments);

            return new Document (constructReturnDom (reportNumber));
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Commits the payments to the database and performs tasks based on
     * functionality previously contained in table update triggers.
     *
     * @param payments List containing the updated payments
     * @return report number of the PVER report
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private int updatePayments (final List<Payment> payments) throws SystemException, BusinessException
    {
        int reportNumber = 0;
        for (Iterator<Payment> it = payments.iterator (); it.hasNext ();)
        {
            final Payment payment = (Payment) it.next ();
            if (reportNumber > 0)
            {
                payment.setReportNumber (Integer.toString (reportNumber));
            }
            payment.save ();
            reportNumber = Integer.parseInt (payment.getReportNumber ());
        }
        return reportNumber;
    }

    /**
     * Updates status and fees of CO and debts as well as firing/updating
     * relevant events.
     *
     * @param payments List containing the updated payments
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private void processCoDebts (final List<Payment> payments) throws BusinessException, SystemException, JDOMException
    {
        // refPayment only used to extract info' common to all payments
        // (enforcement number, type, etc.)
        final Payment refPayment = (Payment) payments.get (0);

        if (refPayment.isCoPayment ())
        {
            final ConsolidatedOrder co =
                    ConsolidatedOrder.getCo (refPayment.getEnforcementNumber (), new ServiceCaller (m_context));

            updateDebts (co, payments);

            co.updateStatus ();
            if (co.hasStatusChanged ())
            {
                co.updateEvents ();
            }
            co.updateFeeAmount ();

            co.save ();
        }
    }

    /**
     * Updates status and fees of debts as well as firing/updating relevant
     * events.
     *
     * @param co the CO to which the debts belong
     * @param payments List containing the updated payments
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void updateDebts (final ConsolidatedOrder co, final List<Payment> payments)
        throws SystemException, BusinessException, JDOMException
    {
        final Set<String> debtSeqs = extractDebtSeqs (payments);
        for (Iterator<String> it = debtSeqs.iterator (); it.hasNext ();)
        {
            final String debtSeq = (String) it.next ();
            final Debt debt = co.getDebt (debtSeq);
            debt.updateStatus ();
            if (debt.hasStatusChanged ())
            {
                debt.updateEvents ();
            }
            debt.save ();
        }
    }

    /**
     * Iterates through a List of payments and extracts all relevant debt
     * sequence numbers.
     * 
     * @param payments List containing the updated payments
     * @return Set containing relevant debt sequence numbers
     */
    private Set<String> extractDebtSeqs (final List<Payment> payments)
    {
        // Each debt needs only refreshing once so extract unique debt
        // sequence numbers.
        final Set<String> debtSeqs = new HashSet<>();
        for (Iterator<Payment> it = payments.iterator (); it.hasNext ();)
        {
            final Payment payment = (Payment) it.next ();
            debtSeqs.add (payment.getDebtSeq ());
        }
        return debtSeqs;
    }

    /**
     * Constructs a JDOM Element representing the report number to pass back
     * to the client.
     * 
     * @param reportNumber the report number of the PVER report the updates
     *            appear on
     * @return report number wrapped in a JDOM Element
     */
    private Element constructReturnDom (final int reportNumber)
    {
        final Element root = new Element ("ReportData");
        root.addContent (new Element ("ReportNumber").setText (Integer.toString (reportNumber)));
        return root;
    }

}
