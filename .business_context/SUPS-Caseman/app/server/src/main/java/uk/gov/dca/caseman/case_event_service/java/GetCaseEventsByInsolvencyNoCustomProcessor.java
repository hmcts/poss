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
package uk.gov.dca.caseman.case_event_service.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_service.java.CaseDefs;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class GetCaseEventsByInsolvencyNoCustomProcessor.
 */
public class GetCaseEventsByInsolvencyNoCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * {@inheritDoc}
     */
    public Document process (final Document docParams, final Log pLog) throws SystemException, BusinessException
    {
        final Document caseNumberDoc =
                invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_NO_FROM_INSOLVENCY_NO, docParams);

        Element caseNumberElement = null;
        try
        {
            if (caseNumberDoc != null)
            {
                caseNumberElement =
                        (Element) XPath.selectSingleNode (caseNumberDoc, "/InsolvencyNumber/Case/CASENUMBER");
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        if (caseNumberElement == null)
        {
            return new Document (new Element ("ds"));
        }

        final String caseNumber = caseNumberElement.getText ();

        try
        {
            // getting the params element and adding the caseNumber
            final Element paramsElement = (Element) XPath.selectSingleNode (docParams, "/params");
            XMLBuilder.addParam (paramsElement, "caseNumber", caseNumber);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.GET_CASE_EVENTS_METHOD,
                docParams);
    }

}
