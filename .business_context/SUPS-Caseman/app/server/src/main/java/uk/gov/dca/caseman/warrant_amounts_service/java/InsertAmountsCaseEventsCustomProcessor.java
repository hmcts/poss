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
import uk.gov.dca.caseman.warrant_returns_service.java.WarrantReturnsXMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: InsertAmountsCaseEventsCustomProcessor.java
 * Description: Checks the fees on a warrant and inserts a 157 final return (which
 * subsequently generates a 620 case event) if the warrant has fees and the
 * total fees value is zero
 * Service: WarrantAmounts
 * Method: updateAmountDetails
 * 
 * Created: 28-Jul-2005
 * 
 * @author Tun Shwe
 *
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         29-Nov-2006 Chris Hutt (EDS): Defensively code around lack of CaseNumber node in the DOM when the warrant
 *         is on a CO where there in no associated case (Defect UCT809)
 *
 */
public class InsertAmountsCaseEventsCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Constructor.
     */
    public InsertAmountsCaseEventsCustomProcessor ()
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
            boolean createFinalReturn = false;
            float totalFee = 0;
            String userId = "";
            String issuingCourtCode = "";

            final Element warrantAmountsElement = (Element) XPath.selectSingleNode (params, "/ds/WarrantAmounts");
            if (warrantAmountsElement != null)
            {
                // Assign user's details for possible creation of final return shortly
                userId = warrantAmountsElement.getChildText ("UserId");
                issuingCourtCode = warrantAmountsElement.getChildText ("IssuingCourtCode");
                // Determine if total fees is zero
                final List<Element> l = XPath.selectNodes (params, "/ds/WarrantAmounts/Warrant[./Deleted = 'N']");
                final Iterator<Element> iter = l.iterator ();
                boolean hasFee = false;
                while (iter.hasNext ())
                {
                    hasFee = true;
                    final Element amountElement = (Element) iter.next ();
                    final String amountString = amountElement.getChildText ("Amount");
                    final float amount = Float.parseFloat (amountString);
                    totalFee += amount;
                }
                if (hasFee && totalFee == 0)
                {
                    createFinalReturn = true;
                }
            }

            // If warrant has fees and the total fees value is zero, create the return
            if (createFinalReturn)
            {
                final Element caseNumberElement =
                        (Element) XPath.selectSingleNode (params, "/ds/WarrantAmounts/CaseNumber");
                if (null != caseNumberElement)
                {
                    final String caseNumber = caseNumberElement.getText ();
                    if (caseNumber != "")
                    {
                        // Only add if warrant is linked to a Case Number
                        final String warrantID =
                                ((Element) XPath.selectSingleNode (params, "/ds/WarrantAmounts/WarrantID"))
                                        .getText ();
                        final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
                        final String returnCode = "157";
                        // Create a 157 final return (which subsequently creates a 620 case event)
                        insertReturn (warrantID, caseNumber, returnCode, issuingCourtCode, userId, todaysDate);
                    }
                }
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return params;
    }

    /**
     * Inserts a return from the specified return code against a warrant.
     *
     * @param warrantID The specific warrant to generate the 157 final return against
     * @param caseNumber The case to which the warrant belongs
     * @param returnCode The return code of the return to be created
     * @param courtCode The court code of the user's court
     * @param createdBy The user's username
     * @param todaysDate The current day
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void insertReturn (final String warrantID, final String caseNumber, final String returnCode,
                               final String courtCode, final String createdBy, final String todaysDate)
        throws SystemException, BusinessException
    {
        final WarrantReturnsXMLBuilder builder = new WarrantReturnsXMLBuilder (warrantID, returnCode, todaysDate);
        builder.setCaseNumber (caseNumber);
        builder.setCourtCode ("0"); // 157 is a National return code, so set to '0'
        builder.setCreatedBy (createdBy);
        builder.setDefendantID ("1"); // Set return against the first party against
        builder.setExecutedBy (courtCode);
        builder.setReceiptDate (todaysDate);
        builder.setAdditionalDetails ("Full fees refund generated");

        final Element warrantReturnsElement = builder.getXMLElement ();
        // Wrap the "WarrantReturns" XML in the "params/param" structure
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "NewReturn", warrantReturnsElement);

        // Call the insertWarrantReturns service locally
        this.invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal",
                paramsElement.getDocument ());
    }

}
