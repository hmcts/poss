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
package uk.gov.dca.caseman.warrant_amounts_service.java;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

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
 * Class: UpdateErrorIndicatorsCustomProcessor.java
 * Description: Updates the error indicator for returns and case events linked to refunds
 * added in error that are subsequently removed on warrants
 * Service: WarrantAmounts
 * Method: updateAmountDetails
 * 
 * Created: 18-August-2005
 * 
 * @author Tun Shwe, Chris Vincent
 *
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *
 */
public class UpdateErrorIndicatorsCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Constructor.
     */
    public UpdateErrorIndicatorsCustomProcessor ()
    {
        super ();
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log pLog) throws SystemException, BusinessException
    {
        try
        {
            boolean refundRemoved = false;

            final Element warrantAmountsElement = (Element) XPath.selectSingleNode (params,
                    "/params/param[@name='WarrantAmounts']/ds/WarrantAmounts");
            if (warrantAmountsElement != null)
            {
                // Determine if total fees is zero
                final List<Element> l = XPath.selectNodes (params,
                        "/params/param[@name='WarrantAmounts']/ds/WarrantAmounts/Warrant[./Deleted = 'N']");
                final Iterator<Element> iter = l.iterator ();
                boolean hasFee = false;
                int totalFee = 0;
                while (iter.hasNext ())
                {
                    hasFee = true;
                    final Element amountElement = (Element) iter.next ();
                    final String amountString = amountElement.getChildText ("Amount");
                    final float amount = Float.parseFloat (amountString);
                    totalFee += amount;
                }

                if (hasFee && totalFee > 0)
                {
                    // Fees exist and the total fee is not 0, check for removed amounts
                    final List<Element> l2 = XPath.selectNodes (params,
                            "/params/param[@name='WarrantAmounts']/ds/WarrantAmounts/Warrant[./Deleted = 'Y']");
                    final Iterator<Element> iter2 = l2.iterator ();
                    while (iter2.hasNext () && !refundRemoved)
                    {
                        final Element amountElement = (Element) iter2.next ();
                        final String amountString = amountElement.getChildText ("Amount");
                        final float amount = Float.parseFloat (amountString);

                        // If the removed amount was a refund which returned the total fee to 0, set flag
                        if (totalFee + amount == 0)
                        {
                            refundRemoved = true;
                        }
                    }
                }
            }

            if (refundRemoved)
            {
                // Set 157 return's error indicator to "Y" and update the database
                final String warrantID =
                        ((Element) XPath.selectSingleNode (warrantAmountsElement, "WarrantID")).getText ();
                final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
                final Document warrantReturns = getWarrantReturns (warrantID);
                ((Element) XPath.selectSingleNode (warrantReturns,
                        "/ds/WarrantReturns/WarrantEvents/WarrantEvent[./Code='157' and ./ReceiptDate='" + todaysDate +
                                "']/Error")).setText ("Y");

                final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                final Element warrantReturnsElement = (Element) XPath.selectSingleNode (warrantReturns, "/ds");
                XMLBuilder.addParam (paramsElement, "NewReturn", (Element) warrantReturnsElement.clone ());

                // Call updateWarrantReturns service locally
                this.invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "updateWarrantReturnsLocal",
                        paramsElement.getDocument ());
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return params;
    }

    /**
     * Retrieves a warrant's returns by calling the getWarrantReturns service.
     *
     * @param warrantID The ID of the warrant to get
     * @return Document The warrant returns
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Document getWarrantReturns (final String warrantID) throws SystemException, BusinessException
    {
        // Wrap the "WarrantReturns" XML in the "params/param" structure
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "warrantID", warrantID);

        // Call getWarrantReturns service locally
        return this.invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "getWarrantReturnsLocal",
                paramsElement.getDocument ());
    }

}