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
package uk.gov.dca.caseman.co_service.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.CoFeeAmountHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Co
 * Method: updateCoDebtList()
 * Class: UpdateCoFeeAmountCustomProcessor.java
 * Created: 09-Jun-2006
 * Description:
 * This CustomProcessor is called after ALLOWED_DEBTS have been updated.
 * If the status of any of these Allowed Debts has changed, this will an affect on the Consolidated
 * Order's Fee Amount.
 * Therefore, this CustomProcessor re-calculates the Fee Amount, and updates the CONSOLIDATED_ORDERS.FEE_AMOUNT
 * column.
 * Note that updateCodebtList() is called by Word Processing screens that are triggered in relation to
 * a number of CO Events.
 * 
 * Change History:
 * 
 * @author Phil Haferer
 */
public class UpdateCoFeeAmountCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /** The Constant CO_SERVICE. */
    private static final String CO_SERVICE = "ejb/CoServiceLocal";
    
    /** The Constant UPDATE_CO_FEE_AMOUNT_METHOD. */
    private static final String UPDATE_CO_FEE_AMOUNT_METHOD = "updateCoFeeAmountLocal";

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws BusinessException, SystemException
    {
        try
        {
            final Element dsElement = pDocParams.getRootElement ();
            final String coNumber = XMLBuilder.getXPathValue (dsElement, "/ds/MaintainCO/CONumber");
            final double coFeeAmount = CoFeeAmountHelper.calculateCoFeeAmount (coNumber, this.m_context);
            final String sCoFeeAmount = Double.toString (coFeeAmount);
            mUpdateCoFeeAmount (coNumber, sCoFeeAmount);

            // If the input document contains a FeeAmount element, update it.
            final Element feeAmountElement =
                    (Element) XPath.selectSingleNode (dsElement, "/ds/MaintainCO/DebtSummary/FeeAmount");
            if (feeAmountElement != null)
            {
                feeAmountElement.setText (sCoFeeAmount);
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    } // process()

    /**
     * (non-Javadoc)
     * Call a service to update the co fee amount.
     *
     * @param pCoNumber the co number
     * @param pCoFeeAmount the co fee amount
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mUpdateCoFeeAmount (final String pCoNumber, final String pCoFeeAmount)
        throws BusinessException, SystemException
    {
        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement (inputDoc);
        XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);
        XMLBuilder.addParam (paramsElement, "coFeeAmount", pCoFeeAmount);

        // Call the service.
        invokeLocalServiceProxy (CO_SERVICE, UPDATE_CO_FEE_AMOUNT_METHOD, inputDoc);

        return;
    } // mUpdateCoFeeAmount()

} // class UpdateCoFeeAmountCustomProcessor
