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
package uk.gov.dca.caseman.case_service.java;

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
 * Service: Case
 * Method: addCase/updateCase
 * Class: ManageCasePartiesCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 04-Apr-2005
 *         Description:
 *         This class implements a step in hte pipeline for the addCase and updateCase methods.
 *         It allows the Solicitor and LitigousParty nodes to only be updated if they are not
 *         Coded Parties.
 *
 *         Change History:
 *         01-Nov-2005 Phil Haferer: Performance - Framework enhancement: Passing the JDOM between pipeline steps.
 *         16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 */
public class ManageCasePartiesCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws BusinessException, SystemException
    {
        Element partiesElement = null;
        Element updatePartiesElement = null;
        List<Element> partiesElementList = null;
        int partieslistSize = 0;
        int updatePartieslistSize = 0;
        Element partyElement = null;
        Element codeElement = null;
        String codeValue = null;
        List<Element> updatePartiesElementList = null;
        Element paramsElement = null;
        Element rootElement = null;

        try
        {
            // Locate the list of Parties in the original XML document.
            partiesElement = (Element) XPath.selectSingleNode (pDocParams, "/ds/ManageCase/Parties");

            if (null != partiesElement)
            {
                partiesElementList = partiesElement.getChildren ();

                partieslistSize = partiesElementList.size ();
                for (int idx = 0; idx < partieslistSize; idx++)
                {
                    partyElement = (Element) partiesElementList.get (idx);

                    // Is it it Coded Party?
                    codeElement = partyElement.getChild ("Code");
                    if (null != codeElement)
                    {
                        codeValue = codeElement.getText ();
                        if (codeValue.equals (""))
                        {
                            // Party isn't Coded, so go ahead and add to list for update.
                            if (null == updatePartiesElement)
                            {
                                updatePartiesElement = new Element ("Parties");
                            }
                            partyElement = (Element) partyElement.detach ();
                            partieslistSize--;
                            idx--;
                            updatePartiesElement.addContent (partyElement);
                        }
                    }
                } // for

                // Were any non-coded parties found?
                if (null != updatePartiesElement)
                {
                    updatePartiesElement = mMaintainCaseParties (updatePartiesElement);

                    // Move the updated Party nodes back into the original list.
                    updatePartiesElementList = updatePartiesElement.getChildren ();
                    updatePartieslistSize = updatePartiesElementList.size ();
                    for (int idx = 0; idx < updatePartieslistSize; idx++)
                    {
                        partyElement = (Element) updatePartiesElementList.get (idx);
                        partyElement = (Element) partyElement.detach ();
                        updatePartieslistSize--;
                        idx--;
                        partiesElement.addContent (partyElement);
                    } // for
                }
            } // if (null != partiesElement)

            // Wrap the original XML in a 'params' structure for reference by the
            // next pipeline step.
            paramsElement = XMLBuilder.getNewParamsElement ();
            rootElement = pDocParams.getRootElement ();
            pDocParams.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "caseNumber", rootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    } // process()

    /**
     * (non-Javadoc)
     * Call the maintain coded parties service.
     *
     * @param pPartiesElement the parties element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mMaintainCaseParties (final Element pPartiesElement) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        Element partiesElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "parties", pPartiesElement);

            outputDoc =
                    invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.MAINTAIN_CASE_PARTIES_METHOD, inputDoc);

            partiesElement = outputDoc.getRootElement ();
        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
            outputDoc = null;
        }

        return partiesElement;
    } // mMaintainCaseParties()

} // class ManageCasePartiesCustomProcessor
