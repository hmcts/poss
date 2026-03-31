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

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 8th Aug 2007
 * 
 * Description: Used to put an event in error, and perform all the other associated updates
 * Created as part of addressing defect UCTGroup2 1474 which requires an events 230,240,250
 * to be 'errored off' if the user decides not to proceed once getting into the Q&A screen.
 * By this stage the event will have already been committed to the database.
 *
 * @author gzyysf
 */
public class UpdateCaseEventErrorOffCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws SystemException, BusinessException
    {

        Element caseEventElementForUpdate = null;
        String caseEventSeq = null;

        try
        {

            // Extract the Case Event Sequence Number
            final XPath caseEventSeqParamPath = XPath.newInstance ("params/param[@name='caseEventSeq']");
            caseEventSeq = ((Element) caseEventSeqParamPath.selectSingleNode (pDocParams)).getText ();

            // Get the Case Event
            caseEventElementForUpdate = mGetCaseEvent (caseEventSeq);

            // Set error flag on the Case Event
            XMLBuilder.setXPathValue (caseEventElementForUpdate, "DeletedFlag", "Y");

            // Update case event
            mErrorOffCaseEvent (caseEventElementForUpdate);

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        finally
        {
            caseEventSeq = null;
        }

        return pDocParams;
    } // process()

    /**
     * (non-Javadoc)
     * Call a service to get the Case Event For Update.
     *
     * @param pCaseEventSeq the case event seq
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mGetCaseEvent (final String pCaseEventSeq) throws SystemException, JDOMException, BusinessException
    {
        Element getCaseEventParamsElement = null;
        Element caseEventElement = null;

        try
        {
            getCaseEventParamsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (getCaseEventParamsElement, "caseEventSeq", pCaseEventSeq);

            caseEventElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.GET_CASE_EVENT_METHOD, getCaseEventParamsElement.getDocument ()).getRootElement ();
        }
        finally
        {
            getCaseEventParamsElement = null;
        }

        return caseEventElement;
    } // mGetCaseEvent()

    /**
     * (non-Javadoc)
     * Call a service to update the case event.
     *
     * @param pCaseEventElement the case event element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mErrorOffCaseEvent (final Element pCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {

        Element caseEventElement = null;
        Element paramsElement = null;

        caseEventElement = (Element) ((Element) pCaseEventElement.clone ()).detach ();
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

        invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.UPDATE_CASE_EVENT_ROW_METHOD,
                paramsElement.getDocument ());

    } // mErrorOffCaseEvent()

} // class UpdateCaseEventErrorOffCustomProcessor
