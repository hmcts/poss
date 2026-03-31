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

/**
 * Class: JudgmentHelper.java
 * 
 * @author Chris hutt
 *         Created: 6 Jan 2006
 *         Description: Helper class for judgment services
 * 
 *         Change History:
 *         19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 */
public class JudgmentHelper
{

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Judgment service name.
     */
    public static final String JUDGMENT_SERVICE = "ejb/JudgmentServiceLocal";
    /**
     * Get judgment party against method name.
     */
    public static final String GET_JUDGMENT_PARTY_AGAINST_METHOD = "getJudgmentPartyAgainstAddressLocal";

    /** The retrieved address path. */
    private final XPath retrievedAddressPath;

    /** The out. */
    private final XMLOutputter out;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public JudgmentHelper () throws JDOMException
    {
        localServiceProxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getPrettyFormat ());

        retrievedAddressPath = XPath.newInstance ("/PartyAgainstAddresses/Address");

    }

    /**
     * Add Address recorded against the PartyAgainst at the time of the judgment to the judgment node.
     *
     * @param pJudgment The judgment element.
     * @param pCaseNumber The case number.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public void addJudgmentPartyAgainstAddress (final Element pJudgment, final String pCaseNumber)
        throws BusinessException, SystemException
    {
        Element partyAgainstElement = null;
        Element addressElement = null;

        partyAgainstElement = pJudgment.getChild ("PartyAgainst");
        addressElement = mGetJudgmentPartyAgainstAddress (pCaseNumber);
        partyAgainstElement.addContent (addressElement.detach ());
    }

    /**
     * (non-Javadoc)
     * Return Address recorded against the PartyAgainst at the time of the judgment.
     *
     * @param pCaseNumber the case number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetJudgmentPartyAgainstAddress (final String pCaseNumber) throws BusinessException, SystemException
    {

        Element resultRootElement = null;
        Element resultElement = null;

        try
        {

            final Element editDetailsParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (editDetailsParamsElement, "caseNumber", pCaseNumber);

            resultRootElement = localServiceProxy.getJDOM (JUDGMENT_SERVICE, GET_JUDGMENT_PARTY_AGAINST_METHOD,
                    getXMLString (editDetailsParamsElement)).getRootElement ();

            resultElement = (Element) retrievedAddressPath.selectSingleNode (resultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return resultElement;
    }

    /**
     * Gets the XML string.
     *
     * @param e the e
     * @return the XML string
     */
    private String getXMLString (final Element e)
    {
        return out.outputString (e);
    }

} // class JudgmentHelper
