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
package uk.gov.dca.caseman.dom_service.java;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Created on 11-Jul-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 
 * Amended:
 * Mark Groen - 18 April 2007 - Caseman 6145
 * Changed so now includes Pending debts in calculation.
 *
 * @author kznwpr
 */
public class CalculateTotalDebtsCustomProcessor implements ICustomProcessor
{

    /** The Constant DOM_SERVICE. */
    private static final String DOM_SERVICE = "ejb/DomServiceLocal";
    
    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public CalculateTotalDebtsCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param document the document
     * @param writer the writer
     * @param log the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document document, final Writer writer, final Log log)
        throws BusinessException, SystemException
    {
        try
        {
            final Element root = document.getRootElement ();
            // Get the co number out of the xml
            final String coNumber = XMLBuilder.getXPathValue (root, "/ds/DeterminationOfMeans/CONumber");

            double creditorPaymentsMade = getCreditorPaymentsMade (coNumber);
            if (creditorPaymentsMade > 0)
            {
                final double feesPaid = getFeesPaid (coNumber);
                // Add the fees paid to the creditor payments to get the total paid out
                creditorPaymentsMade = creditorPaymentsMade + feesPaid;
            }

            final double passthroughsPaid = getPassthroughsPaid (coNumber);
            final double schedule2PassthroughsPaid = getSchedule2PassthroughsPaid (coNumber);
            final double passthroughs = passthroughsPaid + schedule2PassthroughsPaid;

            final double debts = getLiveDebts (coNumber);
            final double totalDebts = debts;

            // MGG . Defect - Caseman 6145. The fee elemnt was the total fees for the debts, not including Pending
            // debts,
            // which do not have associated fees until they become Live or schedule 2. Now retrieve the actual fee
            // amount - e.g. 10%
            // and calculate the fee from the total debts etc value.
            final double feeElement = getFeeElement (coNumber);
            double feeAmount = 0;
            // Only calculate a proportion if there are valid debts
            if (totalDebts - passthroughs > 0 && feeElement != 0)
            {
                // old code feeElement = feeElement * (liveDebts - passthroughs)/(totalDebts - passthroughs);
                // new code from defect 6145
                feeAmount = Math.ceil (debts - passthroughs) / 100 * feeElement;

                // need to ensure no rounding up. If yes need to remove 5 pence
                final double liveAndPendingDebts = getLiveAndPendingDebts (coNumber);
                final double schedule2Debts = getSchedTwoDebts (coNumber);
                double feeAmountPendingAndLive = 0;
                double feeAmountScheduleTwo = 0;
                if (schedule2Debts != 0)
                {
                    feeAmountPendingAndLive = Math.ceil (liveAndPendingDebts - passthroughsPaid) / 100 * feeElement;
                    feeAmountScheduleTwo = Math.ceil (schedule2Debts - schedule2PassthroughsPaid) / 100 * feeElement;

                    if (feeAmountPendingAndLive + feeAmountScheduleTwo > feeAmount)
                    {
                        feeAmount = feeAmount - 0.05;
                    }
                } // if(schedule2Debts != 0){
            }

            final double balance = debts + feeAmount - (creditorPaymentsMade + passthroughs);

            // Locate the total debts node and set its contents
            final Element totalDebtsNode =
                    (Element) XPath.newInstance ("/ds/DeterminationOfMeans/TotalDebts").selectSingleNode (root);
            if (totalDebtsNode != null)
            {
                totalDebtsNode.setText (String.valueOf (balance));
            }

            // Write the resulting xml which contains the entire dom to be sent to the client
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String xmlString = xmlOutputter.outputString (root);
            writer.write (xmlString);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * Method to return the creditor payments made.
     *
     * @param coNumber the co number
     * @return The creditor payments made.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private double getCreditorPaymentsMade (final String coNumber)
        throws SystemException, BusinessException, JDOMException
    {
        // Invoke the service
        final String methodName = "getCreditorPaymentsMadeLocal";
        return invokeServiceAndReturnValue (coNumber, methodName);
    }

    /**
     * Method to return the fees paid.
     *
     * @param coNumber the co number
     * @return The fees paid.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private double getFeesPaid (final String coNumber) throws SystemException, BusinessException, JDOMException
    {
        // Invoke the service
        final String methodName = "getFeesPaidLocal";
        return invokeServiceAndReturnValue (coNumber, methodName);
    }

    /**
     * Method to return the passthroughs paid.
     *
     * @param coNumber the co number
     * @return The pass throughs paid.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private double getPassthroughsPaid (final String coNumber) throws SystemException, BusinessException, JDOMException
    {
        // Invoke the service
        final String methodName = "getPassthroughsPaidLocal";
        return invokeServiceAndReturnValue (coNumber, methodName);
    }

    /**
     * Method to return the schedule2 passthroughs paid.
     *
     * @param coNumber the co number
     * @return The schedule 2 passthroughs paid.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private double getSchedule2PassthroughsPaid (final String coNumber)
        throws SystemException, BusinessException, JDOMException
    {
        // Invoke the service
        final String methodName = "getSchedule2PassthroughsPaidLocal";
        return invokeServiceAndReturnValue (coNumber, methodName);
    }

    /**
     * Method to return the live debts.
     *
     * @param coNumber the co number
     * @return The live debts.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private double getLiveDebts (final String coNumber) throws SystemException, BusinessException, JDOMException
    {
        // Invoke the service
        final String methodName = "getLiveDebtsLocal";
        return invokeServiceAndReturnValue (coNumber, methodName);
    }

    /**
     * Method to return the debt totals of all pending, paid and live debts.
     *
     * @param pCONumber the CO number
     * @return The live debts.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private double getLiveAndPendingDebts (final String pCONumber)
        throws SystemException, BusinessException, JDOMException
    {
        // Invoke the service
        final String methodName = "getLiveAndPendingDebtsLocal";
        return invokeServiceAndReturnValue (pCONumber, methodName);
    }

    /**
     * Method to return the debt totals of all schedule two debts.
     *
     * @param pCONumber the CO number
     * @return The schedule two debts.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private double getSchedTwoDebts (final String pCONumber) throws SystemException, BusinessException, JDOMException
    {
        // Invoke the service
        final String methodName = "getSchedTwoDebtsLocal";
        return invokeServiceAndReturnValue (pCONumber, methodName);
    }

    /**
     * Method to return the fee element.
     *
     * @param coNumber the co number
     * @return The fee element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private double getFeeElement (final String coNumber) throws SystemException, BusinessException, JDOMException
    {
        // Invoke the service
        final String methodName = "getFeeElementLocal";
        return invokeServiceAndReturnValue (coNumber, methodName);
    }

    /**
     * Generic method to invoke the specified method on the dom service and return the resulting data.
     *
     * @param coNumber The co number
     * @param methodName The name of the method to invoke on the service
     * @return The return value.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private double invokeServiceAndReturnValue (final String coNumber, final String methodName)
        throws SystemException, BusinessException, JDOMException
    {
        // Create the params element that contains the co number
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coNumber", coNumber);

        // Turn it into string format
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String xmlParams = xmlOutputter.outputString (paramsElement);

        // Invoke the service
        final Element resultsElement = localServiceProxy.getJDOM (DOM_SERVICE, methodName, xmlParams).getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ResultSet/Row/Amount";
        String value = XMLBuilder.getXPathValue (resultsElement, returnValueXPath);
        if (value == null)
        {
            value = "0";
        }

        // Convert to primitive and return
        return Double.parseDouble (value);
    }
}
