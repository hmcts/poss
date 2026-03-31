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

import java.util.Iterator;
import java.util.List;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

/**
 * Created on 18-Feb-2005.
 *
 * @author Chris Hutt
 */
public class PartyKeyXMLTransformer
{

    /**
     * Add a party key.
     *
     * @param pInputElement The input parameters element.
     * @param pPartyRoleCodeElementName The party role code element name.
     * @param pCasePartyNumberElementName The case party number element name.
     * @param pNewPartyKeyElementName The new party key element name.
     * @throws JDOMException the JDOM exception
     */
    public static void addPartyKey (final Element pInputElement, final String pPartyRoleCodeElementName,
                                    final String pCasePartyNumberElementName, final String pNewPartyKeyElementName)
        throws JDOMException
    {

        /* Method to add PartyKey to Element
         * This is a concatenation of PartyRoleCode_CasePartyNo. */

        String casePartyNumberValue = null;
        String partyRoleCodeValue = null;

        Element partyRoleCodeElement = null;
        Element parentElement = null;
        Element casePartyNumberElement = null;
        final XPath partyRoleCodeXPath = XPath.newInstance ("//" + pPartyRoleCodeElementName);

        Element partyKeyElement = null;

        // Get all nodes PartyRoleCode Nodes
        final List<Element> partyRoleCodeNodeList = partyRoleCodeXPath.selectNodes (pInputElement);
        final Iterator<Element> it = partyRoleCodeNodeList.iterator ();
        while (it.hasNext ())
        {
            /* For each PartyRoleCode Node
             * 1. extract the text value
             * 2. get the parent Node
             * 3. get the text value of the CasePartNo Node
             * 4. concatenate the values and add to a new node - SubjectPartyKey */
            partyRoleCodeElement = (Element) it.next ();
            partyRoleCodeValue = partyRoleCodeElement.getText ();

            parentElement = partyRoleCodeElement.getParentElement ();

            casePartyNumberElement = parentElement.getChild (pCasePartyNumberElementName);

            if (null != casePartyNumberElement)
            {
                casePartyNumberValue = casePartyNumberElement.getValue ();

                partyKeyElement = new Element (pNewPartyKeyElementName);
                if (partyRoleCodeValue.equals (""))
                {
                    partyKeyElement.addContent ("");
                }
                else
                {
                    partyKeyElement.addContent (partyRoleCodeValue + "_" + casePartyNumberValue);
                }

                parentElement.addContent (partyKeyElement);
            }
        }
    }

    /**
     * Splits the party key.
     *
     * @param element The party key element.
     * @param pPartyKeyElementName The party key element name.
     * @param pPartyRoleCodeElementName The party role code element name.
     * @param pCasePartyNumberElementName The case party number element name.
     * @throws JDOMException the JDOM exception
     */
    public static void splitPartyKey (final Element element, final String pPartyKeyElementName,
                                      final String pPartyRoleCodeElementName, final String pCasePartyNumberElementName)
        throws JDOMException
    {
        /* Method to break SubjectPartyKey Element
         * into 2 seperate Elemts within the same Parent - CasePartyNumber and CasePartyRole */

        String casePartyNumberValue = null;
        String partyRoleCodeValue = null;
        String partyKeyValue = null;

        Element partyRoleCodeElement = null;
        Element parentElement = null;
        Element casePartyNumberElement = new Element (pCasePartyNumberElementName);
        Element partyKeyElement = null;

        int idx;

        final XPath partyKeyXPath = XPath.newInstance ("//" + pPartyKeyElementName);

        // Get all nodes PartyRoleCode Nodes
        final List<Element> partyKeyNodeList = partyKeyXPath.selectNodes (element);

        final Iterator<Element> it = partyKeyNodeList.iterator ();
        while (it.hasNext ())
        {
            /* For each SubjectPartyKey Node
             * 1. get the parent Node
             * 2. if no PartyRoleCode exists create one
             * 3. if no CasePartyNumber exists create one
             * 4. Split out the SubjectPartyKey into the PartyRoleCode and CasePartyNumber elements */
            partyKeyElement = (Element) it.next ();
            partyKeyValue = partyKeyElement.getText ();
            idx = partyKeyValue.indexOf ('_');
            if (idx == -1)
            {
                casePartyNumberValue = "";
                partyRoleCodeValue = "";
            }
            else
            {
                casePartyNumberValue = partyKeyValue.substring (idx + 1);
                partyRoleCodeValue = partyKeyValue.substring (0, idx);
            }

            parentElement = partyKeyElement.getParentElement ();

            casePartyNumberElement = parentElement.getChild (pCasePartyNumberElementName);
            if (null == casePartyNumberElement)
            {
                casePartyNumberElement = new Element (pCasePartyNumberElementName);
                casePartyNumberElement.setText (casePartyNumberValue);
                parentElement.addContent (casePartyNumberElement);
            }
            else
            {
                casePartyNumberElement.setText (casePartyNumberValue);
            }

            partyRoleCodeElement = parentElement.getChild (pPartyRoleCodeElementName);
            if (null == partyRoleCodeElement)
            {
                partyRoleCodeElement = new Element (pPartyRoleCodeElementName);
                partyRoleCodeElement.setText (partyRoleCodeValue);
                parentElement.addContent (partyRoleCodeElement);
            }
            else
            {
                partyRoleCodeElement.setText (partyRoleCodeValue);
            }
        } // while
    } // splitPartyKey()

}