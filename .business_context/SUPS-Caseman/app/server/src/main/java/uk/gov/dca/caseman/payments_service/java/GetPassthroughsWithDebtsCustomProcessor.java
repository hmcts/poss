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

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.payments_service.java.util.ConsolidatedOrder;
import uk.gov.dca.caseman.payments_service.java.util.Debt;
import uk.gov.dca.caseman.payments_service.java.util.Payment;
import uk.gov.dca.caseman.payments_service.java.util.ServiceCaller;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * The Class GetPassthroughsWithDebtsCustomProcessor.
 *
 * @author Tony White
 */
public class GetPassthroughsWithDebtsCustomProcessor extends AbstractCasemanCustomProcessor
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
            final String enfType =
                    ((Element) XPath.selectSingleNode (params, "/params/param[@name='enforcementType']")).getText ();
            final String enfCourt =
                    ((Element) XPath.selectSingleNode (params, "/params/param[@name='enforcementCourt']")).getText ();
            final String enfNumber =
                    ((Element) XPath.selectSingleNode (params, "/params/param[@name='enforcementNumber']")).getText ();

            final Document payments =
                    Payment.getPassthroughPayments (enfNumber, enfCourt, enfType, new ServiceCaller (m_context));

            if (enfType.equals ("CO"))
            {
                final Element paymentsNode = (Element) XPath.selectSingleNode (payments, "/Payments");
                final Element retTypes = getCoDebtDetails (enfNumber, m_context);
                paymentsNode.addContent (retTypes);
            }

            return payments;
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Gets all debts for a CO and wraps them in a JDOM Element as retention
     * types.
     *
     * @param enfNumber CO number of the CO
     * @param context CustomProcessor context
     * @return JDOM of retention types, each type containing information on a
     *         debt's creditor, sequence number and balance.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public static Element getCoDebtDetails (final String enfNumber, final IComponentContext context)
        throws SystemException, BusinessException, JDOMException
    {
        final SupsLocalServiceProxy2 localServiceProxy = new SupsLocalServiceProxy2 ();
        final ComponentInput inputHolder = new ComponentInput (context.getInputConverterFactory ());
        final ComponentInput outputHolder = new ComponentInput (context.getInputConverterFactory ());

        final Element debtParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (debtParams, "coNumber", enfNumber);

        inputHolder.setData (new Document (debtParams), Document.class);
        localServiceProxy.invoke ("ejb/CoServiceLocal", "getCoDebtListLocal2", context, inputHolder, outputHolder);

        final Element debtList = ((Document) outputHolder.getData (Document.class)).getRootElement ();
        final List<Element> debts = XPath.selectNodes (debtList, "/ds/MaintainCO/Debts/Debt");

        final Element retTypes = new Element ("RetentionTypes");
        for (Iterator<Element> debtIt = debts.iterator (); debtIt.hasNext ();)
        {
            final Element debt = (Element) debtIt.next ();
            final String debtStatus = debt.getChildText ("DebtStatus");
            if (debtStatus.equals ("LIVE") || debtStatus.equals ("SCHEDULE2"))
            {
                final Element retType = new Element ("RetentionType");
                retTypes.addContent (retType);

                final Element debtSeq = new Element ("Code");
                debtSeq.setText (debt.getChildText ("DebtSeq"));
                retType.addContent (debtSeq);

                final Element creditor = new Element ("Display");
                creditor.setText (debt.getChild ("Creditor").getChildText ("Name"));
                retType.addContent (creditor);

                final ConsolidatedOrder co = ConsolidatedOrder.getCo (enfNumber, new ServiceCaller (context));
                final Debt d = co.getDebt (debt.getChildText ("DebtSeq"));
                final double balance = d.getDebtBalance ();
                retType.addContent (new Element ("DebtBalance").setText (Double.toString (balance)));
                retType.addContent (new Element ("DebtStatus").setText (debt.getChildText ("DebtStatus")));
            }
        }
        return retTypes;
    }

}