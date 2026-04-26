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

import java.io.IOException;
import java.io.Writer;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.ccbc_service.java.CCBCHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * Created on 07-feb-2008
 * Change History:
 * 18/10/2013 - Chris Vincent, Trac 4997. Refactored into components for ease of reading and added CCBC MCOL inserts
 * for CCBC SDT.
 *
 * @author rzhh8k
 */
public class UpdateCaseEvent140ResultRefusedCustomProcessor extends AbstractCustomProcessor
{
    /**
     * Case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * The insert case event row method name.
     */
    public static final String GET_EVENT_SEQ_LIST_METHOD = "getEventSeqListLocal";
    
    /** The Constant UPDATE_CASE_EVENT_RESULT_METHOD. */
    public static final String UPDATE_CASE_EVENT_RESULT_METHOD = "updateCaseEventResultLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public UpdateCaseEvent140ResultRefusedCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pWriter the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pDocParams, final Writer pWriter, final Log pLog)
        throws BusinessException, SystemException
    {
        Element variationResultElement = null;
        List<Element> judgmentElementList = null;
        XMLOutputter xmlOutputter = null;
        String eventSeq = null;
        Element judgmentElement = null;
        String judgmentSequence = "";
        String caseNumber = "";

        try
        {
            variationResultElement = pDocParams.getRootElement ();
            caseNumber = ((Element) XPath.selectSingleNode (variationResultElement, "//CaseNumber")).getText ();

            judgmentElementList = XPath.selectNodes (variationResultElement, "//Judgment");

            for (Iterator<Element> x = judgmentElementList.iterator (); x.hasNext ();)
            {
                judgmentElement = (Element) x.next ();

                /* Check to see if the Event 140 needs an update */
                if (mCheckIfEventNeedsUpdate (judgmentElement))
                {
                    // Get the Judgment Sequence
                    judgmentSequence = ((Element) XPath.selectSingleNode (judgmentElement, "JudgmentId")).getText ();

                    // Get the event sequene to update
                    eventSeq = mGetLatestApplicationToVaryEvent (judgmentSequence);

                    // Update the event result
                    mUpdateCaseEventResult (eventSeq);

                    // Handle CCBC/MCOL updates
                    mCCBCUpdates (judgmentElement, caseNumber);

                } // if(mCheckIfEventNeedsUpdate(judgmentElement)){
            } // for
            /* Output the original XML. */
            xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            final String sXml = xmlOutputter.outputString (variationResultElement);
            pWriter.write (sXml);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * (non-Javadoc)
     * Check to see if need to update the event 140.
     *
     * @param pVariationResult the variation result
     * @return true, if successful
     */
    private boolean mCheckIfEventNeedsUpdate (final Element pVariationResult)
    {
        Element resultFlagElement = null;
        String elementText = null;
        boolean updateRequired = false;

        resultFlagElement = pVariationResult.getChild ("UpdateEvent140");

        if (resultFlagElement != null)
        {
            elementText = resultFlagElement.getText ();
            if (elementText != null && elementText.equals ("Y"))
            {
                updateRequired = true;
            }

        }
        return updateRequired;

    } // mCheckIfEventNeedsUpdate()

    /**
     * Returns a list of all case event 140s created for the judgment ordered so last one created is
     * first in the list.
     *
     * @param pJudgmentSequence Judgment sequence
     * @return The event id
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetLatestApplicationToVaryEvent (final String pJudgmentSequence)
        throws BusinessException, SystemException, JDOMException
    {
        Element getEventSeqElement = null;
        XMLOutputter xmlOutputter = null;
        String eventSeq = "";
        String sXmlParams = "";
        Element resultRootElement = null;

        // Run service to return 140 events
        getEventSeqElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (getEventSeqElement, "stdEventId", "140");
        XMLBuilder.addParam (getEventSeqElement, "judgSeq", pJudgmentSequence);

        xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        sXmlParams = xmlOutputter.outputString (getEventSeqElement);

        resultRootElement =
                localServiceProxy.getJDOM (CASE_EVENT_SERVICE, GET_EVENT_SEQ_LIST_METHOD, sXmlParams).getRootElement ();

        eventSeq = ((Element) XPath.selectSingleNode (resultRootElement, "/Events/Event/EventSeq")).getText ();

        return eventSeq;
    }

    /**
     * Updates the Case Event 140 so result is set to REFUSED.
     *
     * @param pEventSequence Event sequence to update
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private void mUpdateCaseEventResult (final String pEventSequence)
        throws BusinessException, SystemException, JDOMException
    {
        Element getEventSeqElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = "";

        // Run service to set 140 event
        getEventSeqElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (getEventSeqElement, "eventSeq", pEventSequence);
        XMLBuilder.addParam (getEventSeqElement, "result", "REFUSED");

        xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        sXmlParams = xmlOutputter.outputString (getEventSeqElement);

        localServiceProxy.getJDOM (CASE_EVENT_SERVICE, UPDATE_CASE_EVENT_RESULT_METHOD, sXmlParams);
    }

    /**
     * Handles the creation of MCOL_DATA notifications for the variation result
     * being set to REFUSED.
     *
     * @param pJudgmentElement Judgment element
     * @param pCaseNumber the case number
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private void mCCBCUpdates (final Element pJudgmentElement, final String pCaseNumber)
        throws BusinessException, SystemException, JDOMException
    {
        final CCBCHelper ccbcHelper = new CCBCHelper ();
        ccbcHelper.appToVaryResultRefusedMCOLProcessing (pJudgmentElement, pCaseNumber);
    }

} // class InsertCaseEventRow
