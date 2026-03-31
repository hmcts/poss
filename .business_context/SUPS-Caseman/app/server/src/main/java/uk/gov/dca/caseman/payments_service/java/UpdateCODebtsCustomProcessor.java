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
import uk.gov.dca.caseman.payments_service.java.util.ConsolidatedOrder;
import uk.gov.dca.caseman.payments_service.java.util.Debt;
import uk.gov.dca.caseman.payments_service.java.util.Payment;
import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
import uk.gov.dca.caseman.payments_service.java.util.ServiceCaller;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Updates a debt on CO.
 * 
 * @author Steve Blair
 */
public class UpdateCODebtsCustomProcessor extends AbstractCasemanCustomProcessor
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
            final ServiceAdaptor services = new ServiceCaller (m_context);
            services.resetBusinessProcessId ();

            final Element payEl = (Element) XPath.selectSingleNode (params, "/Payment");
            final Payment payment = new Payment (payEl, services);

            processCoDebts (payment);

            // Output input.
            return params;
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Updates status and fees of CO and debts as well as firing/updating
     * relevant events.
     *
     * @param payment the new payment
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private void processCoDebts (final Payment payment) throws BusinessException, SystemException, JDOMException
    {
        if (payment.isPassthrough () && payment.isCoPayment ())
        {
            final ConsolidatedOrder co =
                    ConsolidatedOrder.getCo (payment.getEnforcementNumber (), new ServiceCaller (m_context));
            final Debt debt = co.getDebt (payment.getDebtSeq ());

            debt.updateStatus ();
            if (debt.hasStatusChanged ())
            {
                debt.updateEvents ();
            }
            debt.save ();

            co.updateStatus ();
            if (co.hasStatusChanged ())
            {
                co.updateEvents ();
            }
            co.updateFeeAmount ();

            co.save ();
        }
    }

}
