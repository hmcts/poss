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
package uk.gov.dca.caseman.judgment_service.java;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.db.exception.SystemException;

/**
 * The purpose of this class is to remove unwanted addresses from the PartyAgainst address
 * list. We only want the most recent address, which is identified by the highest AddressId number
 * 
 * Service: Judgment
 * Method: getJudgment calls this class
 * Class: RemoveOldAddressesCustomProcessor.java
 * 
 * @author Ian Stainer
 *         Created: 07-Apr-2006
 *         Description:
 *         Removes old addresses from the Partyagainst address list.
 *
 *         Change History:
 *         19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 */
public class RemoveOldAddressesCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /**
     * (non-Javadoc).
     *
     * @param doc the doc
     * @param log the log
     * @return the document
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document doc, final Log log) throws SystemException
    {
        try
        {

            // Get the list of PartyAgainst elements - there is one for each judgment
            final XPath myXPath = XPath.newInstance ("/ds/MaintainJudgment/Judgments/Judgment/PartyAgainst");
            final List<Element> partyAgainstList = myXPath.selectNodes (doc);

            for (Iterator<Element> i = partyAgainstList.iterator (); i.hasNext ();)
            {
                // Get the PartyAgainst element out of the list
                final Element partyAgainstElement = (Element) i.next ();

                // We need to see if it has > 1 address. If so we select
                // the latest otherwise we leave it alone
                if (partyAgainstElement.getChildren ().size () > 1)
                {
                    // We now need to remove all addresses which are not the most recent.
                    // The most recent is identified because it has the largest AddressId
                    final List<Element> addressList = partyAgainstElement.getChildren ();

                    // Work out which address is the most recent
                    long maxAddressId = 0;
                    for (Iterator<Element> j = addressList.iterator (); j.hasNext ();)
                    {
                        final Element addressElement = (Element) j.next ();
                        final Element addressIdElement = addressElement.getChild ("AddressId");
                        final long addressId = Long.parseLong (addressIdElement.getText ());
                        if (addressId > maxAddressId)
                        {
                            maxAddressId = addressId;
                        }
                    }

                    // Remove all old addresses - can't use an iterator this time because we
                    // will be removing addresses from the list
                    for (int idx = 0, listSize = addressList.size (); idx < listSize;)
                    {
                        final Element addressElement = (Element) addressList.get (idx);
                        final Element addressIdElement = addressElement.getChild ("AddressId");
                        final long addressId = Long.parseLong (addressIdElement.getText ());
                        // Remove the address from the document if it doesn't have the correct AddressId
                        if (addressId != maxAddressId)
                        {
                            addressElement.detach ();
                            listSize--;
                        }
                        else
                        {
                            idx++;
                        }
                    } // End for
                } // End if
            } // End for

            // Return the modified document
            return doc;

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }
}
