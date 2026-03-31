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
package uk.gov.dca.caseman.warrant_service.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.warrant_amounts_service.java.WarrantAmountsXMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: InsertWarrantFeeCustomProcessor.java
 * Description: If the warrant being added is a home warrant, and a warrant fee has been
 * entered, this class inserts a fee entry into the FEES_PAID table via the
 * WarrantAmountsService.updateAmountDetails service call
 * Service: Warrant
 * Method: addWarrant
 * 
 * Created: 17-May-2005
 * 
 * @author Tim Connor
 *
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         04-May-2011 Chris Vincent: if Home Warrant, a fee is always created, even if the fee is not entered (defaults
 *         to 0). Trac 3077.
 *         02-Jan-2014 Chris Vincent: Under new numbering format, needed to change criteria under which fees created.
 *         Trac 5059
 */
public class InsertWarrantFeeCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Constructor.
     */
    public InsertWarrantFeeCustomProcessor ()
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
            final String warrantNumber =
                    ((Element) XPath.selectSingleNode (params, "/ds/Warrant/WarrantNumber")).getText ();
            String feeAmount = ((Element) XPath.selectSingleNode (params, "/ds/Warrant/Fee")).getText ();

            boolean isHomeWarrant = false;

            if (warrantNumber.length () == 8)
            {
                try
                {
                    // If the last 7 digits of the warrant number are numeric and there is no local number,
                    // the warrant is a home warrant, so a fee should be added.
                    // Integer.parseInt(warrantNumber.substring(warrantNumber.length() - 7));

                    final String origNumber =
                            ((Element) XPath.selectSingleNode (params, "/ds/Warrant/OriginalWarrantNumber"))
                                    .getText ();
                    final String localNumber =
                            ((Element) XPath.selectSingleNode (params, "/ds/Warrant/LocalNumber")).getText ();
                    if (WarrantUtils.isEmpty (localNumber) && WarrantUtils.isEmpty (origNumber))
                    {
                        isHomeWarrant = true;
                    }
                }
                catch (final NumberFormatException e)
                {
                }
            }
            if (isHomeWarrant)
            {
                // Insert FEES_PAID record for all Home Warrants, even if no fee specified (Trac 3077)
                if (WarrantUtils.isEmpty (feeAmount))
                {
                    feeAmount = "0";
                }

                final String feeCurrency =
                        ((Element) XPath.selectSingleNode (params, "/ds/Warrant/FeeCurrency")).getText ();
                final String courtCode =
                        ((Element) XPath.selectSingleNode (params, "/ds/Warrant/IssuedBy")).getText ();
                final String createdBy =
                        ((Element) XPath.selectSingleNode (params, "/ds/Warrant/CreatedBy")).getText ();

                final WarrantAmountsXMLBuilder builder =
                        new WarrantAmountsXMLBuilder (warrantNumber, feeAmount, feeCurrency, courtCode);
                builder.setUserID (createdBy);
                final Element warrantAmountsElement = builder.getXMLElement ();

                // Wrap the 'CaseEvent' XML in the 'params/param' structure.
                final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (paramsElement, "WarrantAmounts", warrantAmountsElement);

                // Call the service.
                this.invokeLocalServiceProxy ("ejb/WarrantAmountsServiceLocal", "updateAmountDetailsLocal",
                        paramsElement.getDocument ());
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return params;
    }
}