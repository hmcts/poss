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
 * Service: CaseEvent
 * Method: updateCaseEvents()
 * Class: UpdateCaseEventDispatcherCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 10-Mar-2005
 *         Description:
 *         Updates the Case Event Details for all events, followed by the Error state for a single event.
 * 
 *         Change History:
 *         05-Oct-2005 Phil Haferer: Modified process() so that it always returns at least a minimal document (i.e.
 *         <ds/>)
 *         thereby never leaving the pipeline empty (required following the removal of SOAP from the framework).
 *         16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 *         23-May-2006 Phil Haferer (EDS): Following the conversion to CasemanAbstractCustomProcessor, where Document
 *         now
 *         get shared with called service methods, restructured process() method so that an errored CaseEvent
 *         is not lost by the call to mUpdateCaseEventDetails().
 * @author Phil Haferer
 */
public class UpdateCaseEventDispatcherCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * The obligation event service name.
     */
    public static final String OBLIGATION_EVENT_SERVICE = "ejb/ObligationServiceLocal";
    /**
     * The determine active obligations method name.
     */
    public static final String DETERMINE_ACTIVE_OBLIGATIONS_METHOD = "determineActiveObligationsLocal";

    /** The Constant CASE_EVENT_TYPE. */
    private static final String CASE_EVENT_TYPE = "C";

    /**
     * Constructor.
     */
    public UpdateCaseEventDispatcherCustomProcessor ()
    {
        super ();
    }

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
        Element paramsElement = null;
        Element caseEventElement = null;
        Element obligationsElement = null;

        Document outputDoc = null;

        try
        {
            paramsElement = pDocParams.getRootElement ();

            // Extract any CaseEvent with a modified "Error" flag?
            // (Before the document is passed to another service where it may be modified).
            caseEventElement = mGetErrorChangedCaseEventElement (paramsElement);

            // Updated the Details columns of all changed CaseEvents.
            mUpdateCaseEventDetails (pDocParams);

            // If necessary, deal with the CaseEvent with a modified "Error" flag.
            if (null != caseEventElement)
            {
                // Update the CaseEvent with the changed Error flag, and do
                // associated updates.
                mUpdateCaseEventRow (caseEventElement);
                obligationsElement = mDetermineActiveObligations (caseEventElement);
                outputDoc = obligationsElement.getDocument ();
            }
            else
            {
                final Element dsElement = new Element ("ds");
                outputDoc = new Document ();
                outputDoc.addContent (dsElement);
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return outputDoc;
    } // process()

    /**
     * (non-Javadoc)
     * Call service to update the case event details.
     *
     * @param pDocParams the doc params
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mUpdateCaseEventDetails (final Document pDocParams) throws BusinessException, SystemException
    {
        invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.UPDATE_CASE_EVENT_DETAILS_METHOD,
                pDocParams);
    } // mUpdateCaseEventDetails()

    /**
     * (non-Javadoc)
     * Call a service to update the case event row.
     *
     * @param pCaseEventElement the case event element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mUpdateCaseEventRow (final Element pCaseEventElement) throws BusinessException, SystemException
    {
        Element caseEventElement = null;
        Element paramsElement = null;

        caseEventElement = (Element) ((Element) pCaseEventElement.clone ()).detach ();
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

        invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.UPDATE_CASE_EVENT_ROW_METHOD,
                paramsElement.getDocument ());

    } // mUpdateCaseEventRow()

    /**
     * (non-Javadoc)
     * Call a service to determine the active obligations for the case and event.
     *
     * @param pCaseEventElement the case event element
     * @return the element
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mDetermineActiveObligations (final Element pCaseEventElement)
        throws JDOMException, SystemException, BusinessException
    {
        Element obligationsElement = null;
        CaseEventUpdateHelper caseEventUpdateHelper = null;
        Element caseEventElement = null;
        String sValue = null;
        Element paramsElement = null;
        Document document = null;

        // Retrieve a "complete" CaseEvent, which includes the CaseNumber.
        caseEventUpdateHelper = new CaseEventUpdateHelper (this.m_context);
        caseEventElement = (Element) pCaseEventElement.clone ();
        caseEventElement = (Element) caseEventElement.detach ();
        document = new Document ();
        document.setRootElement (caseEventElement);
        caseEventElement = caseEventUpdateHelper.GetCaseEvent (caseEventElement);

        // Extract the Case Number, and build the params structure.
        sValue = XMLBuilder.getXPathValue (caseEventElement, "/CaseEvent/CaseNumber");
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", sValue);
        XMLBuilder.addParam (paramsElement, "eventType", CASE_EVENT_TYPE);

        // Call the Obligations service.
        obligationsElement = invokeLocalServiceProxy (OBLIGATION_EVENT_SERVICE, DETERMINE_ACTIVE_OBLIGATIONS_METHOD,
                paramsElement.getDocument ()).getRootElement ();

        return obligationsElement;
    } // mDetermineActiveObligations()

    /**
     * (non-Javadoc)
     * Return the case event with a status of 'ERROR_CHANED'.
     *
     * @param pCaseEventsElement the case events element
     * @return the element
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     */
    private Element mGetErrorChangedCaseEventElement (final Element pCaseEventsElement)
        throws JDOMException, SystemException
    {
        Element caseEventElement = null;
        List<Element> caseEventList = null;
        int numberOfErrorChanged = 0;

        try
        {
            caseEventList = XPath.selectNodes (pCaseEventsElement,
                    "/params/param[@name = 'caseEvents']/CaseEvents/CaseEvent[Status = 'ERROR_CHANGED']");
            numberOfErrorChanged = caseEventList.size ();
            if (numberOfErrorChanged > 1)
            {
                throw new SystemException (
                        "Updating Case Events Deleted Flag: Only one CaseEvent can be specified with Status of ERROR_CHANGED!");
            }
            else if (numberOfErrorChanged == 1)
            {
                caseEventElement = (Element) caseEventList.get (0);
                // Remove the errored CaseEvent from the document.
                caseEventElement.detach ();
            }
        }
        finally
        {
            caseEventList = null;
        }

        return caseEventElement;
    } // mGetErrorChangedCaseEventElement()

} // class UpdateCaseEventDispatcherCustomProcessor
