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
public class AppXMLTransform
{

    /**
     * Adds a subject party key.
     *
     * @param element The subject party key element.
     * @return The updated element.
     * @throws JDOMException the JDOM exception
     */
    public static Element addSubjectPartyKey (final Element element) throws JDOMException
    {

        /* Method to add SubjectPartyKey to Element
         * This is a concatenation of PartyRoleCode_CasePartyNo */

        String cpnValue = null;
        String prcValue = null;

        Element prcElement = null;
        Element parentElement = null;
        Element cpnElement = null;
        Element rtnElement = null;

        rtnElement = new Element (element.getName ());

        final XPath partyRoleCodeXPath = XPath.newInstance ("//PartyRoleCode");
        // Get all nodes PartyRoleCode Nodes
        final List<Element> prcNodeList = partyRoleCodeXPath.selectNodes (element);

        final Iterator<Element> it = prcNodeList.iterator ();
        while (it.hasNext ())
        {

            /* For each PartyRoleCode Node
             * 1. extract the text value
             * 2. get the parent Node
             * 3. get the text value of the CasePartNo Node
             * 4. concatenate the values and add to a new node - SubjectPartyKey */

            prcElement = (Element) it.next ();
            prcValue = prcElement.getText ();

            parentElement = prcElement.getParentElement ();

            // cpnElement = (Element)partyCasePartyNoXPath.selectSingleNode(parentElement);
            cpnElement = parentElement.getChild ("CasePartyNumber");

            if (null != cpnElement)
            {

                cpnValue = cpnElement.getValue ();

                final Element spkElement = new Element ("SubjectPartyKey");

                if (null == prcValue || "".equals (prcValue) || null == cpnValue || "".equals (cpnValue))
                {
                    spkElement.addContent ("");
                }
                else
                {
                    spkElement.addContent (prcValue + "_" + cpnValue);
                }

                parentElement.addContent (((Element) spkElement.clone ()).detach ());
            }

        }

        if (parentElement == null)
        {
            return element;
        }

        rtnElement.addContent (((Element) parentElement.clone ()).detach ());

        return rtnElement;
    }

    /**
     * Splits the subject party key.
     *
     * @param element The subject party key element.
     * @return The updated element.
     * @throws JDOMException the JDOM exception
     */
    public static Element splitSubjectPartyKey (final Element element) throws JDOMException
    {

        /* Method to break SubjectPartyKey Element
         * into 2 seperate Elemts within the same Parent - CasePartyNumber and CasePartyRole */

        String cpnValue = null;
        String prcValue = null;
        String spkValue = null;

        Element prcElement = null;
        Element parentElement = null;
        Element cpnElement = new Element ("CasePartyNumber");
        Element rtnElement = null;
        Element spkElement = null;

        int idx;

        rtnElement = new Element (element.getName ());

        final XPath subjectPartyKeyXPath = XPath.newInstance ("//SubjectPartyKey");
        // Get all nodes PartyRoleCode Nodes
        final List<Element> spkNodeList = subjectPartyKeyXPath.selectNodes (element);

        final Iterator<Element> it = spkNodeList.iterator ();
        while (it.hasNext ())
        {

            /* For each SubjectPartyKey Node
             * 1. get the parent Node
             * 2. if no PartyRoleCode exists create one
             * 3. if no CasePartyNumber exists create one
             * 4. Split out the SubjectPartyKey into the PartyRoleCode and CasePartyNumber elements */

            spkElement = (Element) it.next ();
            spkValue = prcElement.getText ();
            idx = cpnValue.indexOf ('_');
            cpnValue = spkValue.substring (idx + 1);
            prcValue = spkValue.substring (0, idx - 1);

            parentElement = spkElement.getParentElement ();

            cpnElement = parentElement.getChild ("CasePartyNumber");
            if (null == cpnElement)
            {
                cpnElement = new Element ("CasePartyNumber");
                cpnElement.setText (cpnValue);
                parentElement.addContent (((Element) cpnElement.clone ()).detach ());
            }
            else
            {
                cpnElement.setText (cpnValue);
            }

            prcElement = parentElement.getChild ("PartyRoleCode");
            if (null == prcElement)
            {
                prcElement = new Element ("PartyRoleCode");
                prcElement.setText (prcValue);
                parentElement.addContent (((Element) prcElement.clone ()).detach ());
            }
            else
            {
                prcElement.setText (prcValue);
            }

        }

        if (parentElement == null)
        {
            return element;
        }

        rtnElement.addContent (((Element) parentElement.clone ()).detach ());

        return rtnElement;
    }

}