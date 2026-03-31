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
package uk.gov.dca.caseman.window_for_trial_service.java;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.caseman.common.java.XMLBuilder;

/**
 * Created on 3-Mar-2005.
 *
 * @author gzyysf
 */
public class WftNavigationXMLBuilder
{
    
    /** The m navigate to. */
    private String mNavigateTo;
    
    /** The m prompt. */
    private String mPrompt;

    /**
     * Constructor.
     */
    public WftNavigationXMLBuilder ()
    {
    }

    /**
     * Returns navigation data xml element.
     * 
     * @param pNavigateTo Navigate to string.
     * @param pPrompt The prompt string.
     * @return The xml element.
     */
    public Element getXMLElement (final String pNavigateTo, final String pPrompt)
    {

        final Element navDataElement = new Element ("WindowForTrialNavigationData");
        final Element navigationToElement = new Element ("NavigationTo");
        final Element paramsElement = new Element ("Params");
        final Element wftElement = new Element ("WindowForTrial");

        XMLBuilder.add (wftElement, "Prompt", pPrompt);
        XMLBuilder.add (navigationToElement, "WindowForTrial", pNavigateTo);

        mAddElementDeepCopy (navDataElement, navigationToElement);
        mAddElementDeepCopy (paramsElement, wftElement);
        mAddElementDeepCopy (navDataElement, paramsElement);

        final Document doc = new Document ();
        doc.setRootElement (navDataElement);

        return navDataElement;

    } // getXMLElement()

    /**
     * Clone and add an element.
     *
     * @param pElement the element
     * @param pElementToAdd the element to add
     */
    private void mAddElementDeepCopy (final Element pElement, final Element pElementToAdd)
    {
        pElement.addContent (((Element) pElementToAdd.clone ()).detach ());
    } // mAddElementDeepCopy

} // class WftNavigationXMLBuilder
