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
package uk.gov.dca.caseman.common.java;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Class: CoFeeAmountHelper.java
 * 
 * @author Phil Haferer
 *         Created: 07-Jun-2006
 *         Description:
 *         When of status of a Consolidated Order or one of its' Allowed Debts changes
 *         the Fee Amount often needs to be re-calculated.
 * 
 *         This 'helper' class provides a number of alternative methods associated with the
 *         calculation of the Consolidated Order Fee Amount.
 * 
 *         The appropriate method should be selected by considering how many (if any) of the
 *         constituant values of required for the calculation you may already have.
 * 
 *         The main calculation if performed by :-
 *         calculateCoFeeAmount(pCoFeeRate, pTotalAllowedDebts, pTotalSchedule2Debts, pTotalPassthroughs)
 * 
 *         If the Fee Rate is already known, but none of the other parameters available, the
 *         following method may be called :-
 *         calculateCoFeeAmount(pCoNumber, pCoFeeRate)
 *
 *         If only the Consolidated Order Number is known, the following method may be called :-
 *         calculateCoFeeAmount(pCoNumber)
 *
 *         Note that the 'parent' helper service method :-
 *         Co.updateCoFeeAmount()
 *         is provided.
 *         This performs the calculation and updates the CONSOLIDATED_ORDERS row with the result.
 */
public class CoFeeAmountHelper
{

    /**
     * The co service name.
     */
    public static final String CO_SERVICE = "ejb/CoServiceLocal";
    /**
     * The get co fee amount calculation method name.
     */
    public static final String GET_CO_FEE_AMOUNT_CALC_METHOD = "getCoFeeAmountCalcLocal2";
    /**
     * The get co fee amount calculation with rate method name.
     */
    public static final String GET_CO_FEE_AMOUNT_CALC_WITH_RATE_METHOD = "getCoFeeAmountCalcWithRateLocal2";

    /**
     * Calculates the total Fee Amount on a Consolidated Order, given all the required amounts for the calculation.
     *
     * @param pCoFeeRate Fee rate as a decimal.
     * @param pTotalAllowedDebts Sum of debts on the CO with status = 'LIVE' or 'PAID'.
     * @param pTotalSchedule2Debts Sum of debts on the CO with status = 'SCHEDULE2'.
     * @param pTotalPassthroughs Total amount of passthrough payments made on the CO.
     * @return CO Fee amount (2 decimal places).
     */
    public static double calculateCoFeeAmount (final double pCoFeeRate, final double pTotalAllowedDebts,
                                               final double pTotalSchedule2Debts, final double pTotalPassthroughs)
    {
        double coFeeAmount = 0;

        if (pCoFeeRate > 0 && pTotalAllowedDebts + pTotalSchedule2Debts > 0)
        {
            double liveDebtFeeAmount = Math.ceil (pTotalAllowedDebts - pTotalPassthroughs) * pCoFeeRate / 100;
            double schedule2FeeAmount = Math.ceil (pTotalSchedule2Debts) * pCoFeeRate / 100;

            if (schedule2FeeAmount > 0)
            {
                coFeeAmount =
                        Math.ceil (pTotalAllowedDebts - pTotalPassthroughs + pTotalSchedule2Debts) * pCoFeeRate / 100;

                if (liveDebtFeeAmount + schedule2FeeAmount > coFeeAmount)
                {
                    // Reduce fee by 5p due to rounding errors.
                    liveDebtFeeAmount -= 0.05;
                    schedule2FeeAmount -= 0.05;
                }
            }

            // Make sure rounding is consistant with JavaScript.
            coFeeAmount = (int) ((liveDebtFeeAmount + schedule2FeeAmount + 0.005) * 100) / 100D;
        }

        return coFeeAmount;
    } // calculateCoFeeAmount(pCoFeeRate, pTotalAllowedDebts, pTotalSchedule2Debts, pTotalPassthroughs)

    /**
     * Calculates the total Fee Amount on a Consolidated Order, given only the CO Number and the Fee Rate.
     *
     * @param pCoNumber The unique number that identifies the Consolidated Order.
     * @param pCoFeeRate Fee rate as a decimal.
     * @param pContext The component context.
     * @return CO Fee amount (2 decimal places).
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public static double calculateCoFeeAmount (final String pCoNumber, final double pCoFeeRate,
                                               final IComponentContext pContext)
        throws BusinessException, SystemException
    {
        double coFeeAmount = 0;

        final Element coFeeAmountCalcElement = mGetCoFeeAmountCalc (pCoNumber, pContext);
        final double totalAllowed = mGetElementAsDouble (coFeeAmountCalcElement, "TotalAllowed");
        final double totalPassthrough = mGetElementAsDouble (coFeeAmountCalcElement, "TotalPassthrough");
        final double totalSchedule2 = mGetElementAsDouble (coFeeAmountCalcElement, "TotalSchedule2");

        coFeeAmount = calculateCoFeeAmount (pCoFeeRate, totalAllowed, totalSchedule2, totalPassthrough);

        return coFeeAmount;
    } // calculateCoFeeAmount(pCoNumber, pCoFeeRate, pContext)

    /**
     * Calculates the total Fee Amount on a Consolidated Order, given only the CO Number.
     *
     * @param pCoNumber The unique number that identifies the Consolidated Order.
     * @param pContext The component context.
     * @return CO Fee amount (2 decimal places).
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public static double calculateCoFeeAmount (final String pCoNumber, final IComponentContext pContext)
        throws BusinessException, SystemException
    {
        double coFeeAmount = 0;

        final Element coFeeAmountCalcElement = mGetCoFeeAmountCalcWithRate (pCoNumber, pContext);
        final double totalAllowed = mGetElementAsDouble (coFeeAmountCalcElement, "TotalAllowed");
        final double totalPassthrough = mGetElementAsDouble (coFeeAmountCalcElement, "TotalPassthrough");
        final double totalSchedule2 = mGetElementAsDouble (coFeeAmountCalcElement, "TotalSchedule2");
        final double coFeeRate = mGetElementAsDouble (coFeeAmountCalcElement, "FeeRate");

        coFeeAmount = calculateCoFeeAmount (coFeeRate, totalAllowed, totalSchedule2, totalPassthrough);

        return coFeeAmount;
    } // calculateCoFeeAmount(pCoNumber, pContext)

    /**
     * Retrieve an Element which holds all the values required to calculate the
     * Fee Amount on a Consolidated Order.
     *
     * @param pCoNumber The unique number that identifies the Consolidated Order.
     * @param pContext The Context object required to construct the objects used to call
     *            the service method.
     * @return The XML element holding required sub-elements.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private static Element mGetCoFeeAmountCalc (final String pCoNumber, final IComponentContext pContext)
        throws SystemException, BusinessException
    {
        Element coFeeAmountCalcElement = null;

        coFeeAmountCalcElement =
                mCallElementRetrievalService (/* String pParamName */"coNumber", /* String pParamValue */pCoNumber,
                        /* String pServiceName */CO_SERVICE, /* String pMethodName */GET_CO_FEE_AMOUNT_CALC_METHOD,
                        /* String pRetrievedElementName */"CoFeeAmountCalc", /* IComponentContext pContext */pContext);

        return coFeeAmountCalcElement;
    } // mGetCoFeeAmountCalc()

    /**
     * Retrieve an Element which holds all the values required to calculate the
     * Fee Amount on a Consolidated Order, including the Fee Rate and the original
     * Fee Amount.
     *
     * @param pCoNumber The unique number that identifies the Consolidated Order.
     * @param pContext The Context object required to construct the objects used to call
     *            the service method.
     * @return The XML element holding required sub-elements.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private static Element mGetCoFeeAmountCalcWithRate (final String pCoNumber, final IComponentContext pContext)
        throws SystemException, BusinessException
    {
        Element coFeeAmountCalcElement = null;

        coFeeAmountCalcElement = mCallElementRetrievalService (/* String pParamName */"coNumber",
                /* String pParamValue */pCoNumber, /* String pServiceName */CO_SERVICE,
                /* String pMethodName */GET_CO_FEE_AMOUNT_CALC_WITH_RATE_METHOD,
                /* String pRetrievedElementName */"CoFeeAmountCalc", /* IComponentContext pContext */pContext);

        return coFeeAmountCalcElement;
    } // mGetCoFeeAmountCalc()

    /**
     * Retrieve an Element from a given Service Method.
     *
     * @param pParamName The name of the parameter passed to the service.
     *            i.e. The value of attribute 'name' of 'param' tag.
     * @param pParamValue The value of the parameter.
     *            i.e. The primary key which identifies what is to be retrieved.
     * @param pServiceName The name of the service holding the method that does the retrieval
     * @param pMethodName The name of the method doing the retrieval.
     * @param pRetrievedElementName The name of XML tag element which holds the results.
     * @param pContext The Context object required to construct the objects used to call
     *            the service method.
     * @return The XML element holding required sub-elements.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private static Element
            mCallElementRetrievalService (final String pParamName, final String pParamValue, final String pServiceName,
                                          final String pMethodName, final String pRetrievedElementName,
                                          final IComponentContext pContext)
                throws SystemException, BusinessException
    {
        Element retrievedElement = null;
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        ComponentInput inputHolder = null;
        ComponentInput outputHolder = null;
        SupsLocalServiceProxy2 localServiceProxy = null;
        Element dsElement = null;

        // Build the parameter document for the service call.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement (inputDoc);
        XMLBuilder.addParam (paramsElement, pParamName, pParamValue);

        // Create the other object used by the service methods.
        inputHolder = new ComponentInput (pContext.getInputConverterFactory ());
        inputHolder.setData (inputDoc, Document.class);

        outputHolder = new ComponentInput (pContext.getInputConverterFactory ());
        localServiceProxy = new SupsLocalServiceProxy2 ();

        // Call the service which retrieves the CO Fee amounts.
        localServiceProxy.invoke (pServiceName, pMethodName, pContext, inputHolder, outputHolder);

        // Extract the result.
        outputDoc = (Document) outputHolder.getData (Document.class);
        dsElement = outputDoc.getRootElement ();

        // Retrieve the element that contains all 'amount' elements.
        retrievedElement = dsElement.getChild (pRetrievedElementName);

        return retrievedElement;
    } // mGetCoFeeAmountCalc()

    /**
     * Extract the text value of a child Element and convert it to a double.
     * 
     * @param pParentElement An Element object that contains a child Element
     *            which in turn contains a textual value which may be interpreted as a 'double'.
     * @param pValueElementName The name of a child element contain text representing a 'double' numerical value.
     * @return Returns the extracted value as type 'double'.
     */
    private static double mGetElementAsDouble (final Element pParentElement, final String pValueElementName)
    {
        double dValue = 0;
        String sValue = null;

        sValue = pParentElement.getChildText (pValueElementName);
        if (sValue == null)
        {
            sValue = "0";
        }

        dValue = Double.parseDouble (sValue);

        return dValue;
    } // mGetElementAsDouble()

} // class CoFeeAmountHelper
