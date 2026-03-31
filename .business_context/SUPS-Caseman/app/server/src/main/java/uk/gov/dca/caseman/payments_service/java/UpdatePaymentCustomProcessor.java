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
import uk.gov.dca.caseman.payments_service.java.helpers.BmsHelper;
import uk.gov.dca.caseman.payments_service.java.helpers.DcsHelper;
import uk.gov.dca.caseman.payments_service.java.util.Enforcement;
import uk.gov.dca.caseman.payments_service.java.util.Payment;
import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
import uk.gov.dca.caseman.payments_service.java.util.ServiceCaller;
import uk.gov.dca.caseman.payments_service.java.util.Warrant;
import uk.gov.dca.caseman.payments_service.java.util.WarrantReturn;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Performs functionality previously taken care of by the update payments
 * trigger.
 * 
 * @author Steve Blair
 * 
 *         28/06/2007 - Chris Vincent: additional changes for 6334. Introduced the courtId field from the original
 *         service
 *         call and used it to set the Payment object.
 * 
 *         02/07/2007 - Chris Hutt as part of defect 6334 resolution ServiceCourtId node added to Payment
 *
 *         09/07/2007 - Chris Hutt : defect 6366 : defect 6334 extended to cover payments on a CO
 *         of type 'AO' associtated with a warrant
 */
public class UpdatePaymentCustomProcessor extends AbstractCasemanCustomProcessor
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

            final Element base = (Element) XPath.selectSingleNode (params, "/Input");
            final Payment payment = new Payment (base.getChild ("Payment"), services);

            final String courtId = base.getChild ("Payment").getChildText ("ServiceCourtId");

            processWarrantReturns (base, payment);

            processDcsData (base, payment);

            processBms (payment);

            processAssociatedAoPassthrough (payment, courtId);

            return params.setRootElement (payment.toElement ());
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Updates relevant warrant returns for fully paid warrants.
     *
     * @param base CustomProcessor input DOM
     * @param payment the updated payment
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void processWarrantReturns (final Element base, final Payment payment)
        throws BusinessException, SystemException
    {
        if (payment.isExecutionWarrant ())
        {
            final Warrant warrant = (Warrant) Enforcement.getInstance (payment, new ServiceCaller (m_context));
            if (warrant.getNumberEvents () == 0)
            {
                final Element returnDom = base.getChild ("WarrantReturnDOM").getChild ("ds");
                final WarrantReturn warrantReturn = new WarrantReturn (returnDom, new ServiceCaller (m_context));
                warrant.createFullyPaidWarrantReturns (warrantReturn);
            }
            else if (warrant.getOutstandingBalance () > 0)
            {
                warrant.errorFullyPaidWarrantReturns ();
            }
        }
    }

    /**
     * Creates/updates a record on the DCS table logging the payment details.
     *
     * @param base CustomProcessor input DOM
     * @param payment the updated payment
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void processDcsData (final Element base, final Payment payment) throws BusinessException, SystemException
    {
        final boolean hasPayoutRepId = payment.getPayoutReportId ().length () > 0;
        if ( !payment.isPassthrough () && !payment.isAdhocReport () && payment.haveFinancialDetailsChanged ())
        {
            DcsHelper.logDcsData (base.getChild ("NonPayoutDCSDOM").getChild ("DCSData"), true,
                    new ServiceCaller (m_context));
        }
        else if (payment.getPayoutDate () != null && hasPayoutRepId)
        {
            DcsHelper.logDcsData (base.getChild ("PayoutDCSDOM").getChild ("DCSData"), false,
                    new ServiceCaller (m_context));
        }
    }

    /**
     * Logs BMS data for the update.
     *
     * @param payment the updated payment
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void processBms (final Payment payment) throws SystemException, BusinessException
    {
        if (payment.getRdDate () != null)
        {
            BmsHelper.logBms (payment, new ServiceCaller (m_context));
        }
    }

    /**
     * Updates a passthrough payment for the AO warrant attached to a CO (if
     * applicable).
     *
     * @param payment the updated payment
     * @param courtId the court id
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void processAssociatedAoPassthrough (final Payment payment, final String courtId)
        throws BusinessException, SystemException
    {
        if ( !payment.isPassthrough () && payment.isCoPayment ())
        {
            final Payment aoPayment = payment.getAoPassthrough (courtId);
            if (payment.getWarrantId ().length () > 0)
            {
                aoPayment.save ();
            }
            else
            {
                aoPayment.delete ();
            }
        }
    }

}