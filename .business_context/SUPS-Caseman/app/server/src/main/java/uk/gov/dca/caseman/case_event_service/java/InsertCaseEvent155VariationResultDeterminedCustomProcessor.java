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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
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
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Created on 08-Mar-2005
 *
 * Change History:
 * 16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 * 27/04/2007 Mark Groen - UCT GROUP2 1361: When variation granted ot determined - set bar to N for the defendant.
 * 25/01/2008 - Mark Groen, CASEMAN 6475 - Ensure the case events from judgments have the case court code and not the
 * Judgment court code.
 * 
 * @author szt44s
 */
public class InsertCaseEvent155VariationResultDeterminedCustomProcessor extends AbstractCustomProcessor
{
    /**
     * The case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * The insert case event row method name.
     */
    public static final String INSERT_CASE_EVENT_ROW_METHOD = "insertCaseEventRowLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public InsertCaseEvent155VariationResultDeterminedCustomProcessor ()
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
        Element VariationResultDeterminedElement = null;
        Element insertVariationResultDeterminedRowElement = null;
        List<Element> JudgmentElementList = null;
        Element Judgment = null;
        String caseNumber = null;
        String userName = null;
        String caseEventSequence = null;
        Element eventSequenceElement = null;

        try
        {
            VariationResultDeterminedElement = pDocParams.getRootElement ();

            caseNumber = ((Element) XPath.selectSingleNode (VariationResultDeterminedElement,
                    "/ds/MaintainJudgment/CaseNumber")).getText ();

            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            JudgmentElementList = XPath.selectNodes (VariationResultDeterminedElement, "//Judgment");

            for (Iterator<Element> x = JudgmentElementList.iterator (); x.hasNext ();)
            {
                Judgment = (Element) x.next ();

                /* Check to see if the Event 155 is in the DOM, if not no action necessary */
                final Element eventElement = mCheckIfEventOccurred (Judgment);

                if (eventElement != null)
                {

                    final Element caseEventParamsElement =
                            mBuildVariationResultDetermined (Judgment, caseNumber, userName);
                    insertVariationResultDeterminedRowElement = mInsertCaseEventRow (caseEventParamsElement);

                    caseEventSequence = ((Element) XPath.selectSingleNode (insertVariationResultDeterminedRowElement,
                            "/CaseEvent/CaseEventSeq")).getText ();

                    eventSequenceElement = eventElement.getChild ("EventSequence");

                    eventSequenceElement.setText (caseEventSequence);
                }
            }
            /* Output the original XML. */
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            final String sXml = xmlOutputter.outputString (VariationResultDeterminedElement);
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

        return;
    }

    /**
     * (non-Javadoc)
     * Build a params element to be used when inserting a variation result determined case event.
     *
     * @param pVariationResultDetermined the variation result determined
     * @param pCaseNumber the case number
     * @param pUserName the user name
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildVariationResultDetermined (final Element pVariationResultDetermined, final String pCaseNumber,
                                                     final String pUserName)
        throws JDOMException
    {
        String eventDate = null;
        String receiptDate = null;
        String judgmentSequence = null;
        String variationSequence = null;
        String courtCode = null;
        String partyRoleCode = null;
        String casePartyNumber = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element caseEventElement = null;
        Element paramsElement = null;

        // UCT GROUP2 1361 - need to set the result
        String result = "";
        result = ((Element) XPath.selectSingleNode (pVariationResultDetermined,
                "./ApplicationsToVary/Variation[Result = 'DETERMINED' and PreviousResult != 'DETERMINED']/Result"))
                        .getText ();
        eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
        receiptDate = ((Element) XPath.selectSingleNode (pVariationResultDetermined,
                "./ApplicationsToVary/Variation[Result = 'DETERMINED' and PreviousResult != 'DETERMINED']/DateResult"))
                        .getText ();
        judgmentSequence = ((Element) XPath.selectSingleNode (pVariationResultDetermined, "JudgmentId")).getText ();
        variationSequence = ((Element) XPath.selectSingleNode (pVariationResultDetermined,
                "./ApplicationsToVary/Variation[Result = 'DETERMINED' and PreviousResult != 'DETERMINED']/Id"))
                        .getText ();
        /* amended re defect 6475
         * courtCode = ((Element)(XPath.selectSingleNode(
         * pVariationResultDetermined,
         * "VenueCode"))).getText(); */
        courtCode = ((Element) XPath.selectSingleNode (pVariationResultDetermined, "CourtCode")).getText ();
        partyRoleCode = ((Element) XPath.selectSingleNode (pVariationResultDetermined, "PartyRoleCode")).getText ();
        casePartyNumber =
                ((Element) XPath.selectSingleNode (pVariationResultDetermined, "CasePartyNumber")).getText ();
        caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseEventSeq */"", /* String caseNumber */pCaseNumber,
                /* String standardEventId */"155", /* String subjectCasePartyNumber */casePartyNumber,
                /* String subjectPartyRoleCode */partyRoleCode, /* String applicant */"", /* String eventDetails */"",
                /* String eventDate */eventDate, /* String result */result, // UCT GROUP2 1361, was ""
                /* String warrantId */"", /* String judgmentSeq */judgmentSequence,
                /* String varySeq */variationSequence, /* String hrgSeq */"", /* String deletedFlag */"",
                /* String userName */pUserName, /* String receiptDate */receiptDate, /* String task */"",
                /* String statsModule */"", /* String ageCategory */"", /* String courtCode */courtCode,
                /* String resultDate */"", /* String dateToRtl */"", /* String caseFlag */"",
                /* String listingType */"");

        caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, caseEventElement);

        return paramsElement;
    } // mBuildJudgRecSetAside()

    /**
     * (non-Javadoc)
     * Insert a variation result determined case event record.
     *
     * @param pCaseEventParamsElement the case event params element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCaseEventRow (final Element pCaseEventParamsElement)
        throws SystemException, BusinessException
    {
        Element insertVariationResultDeterminedRowElement = null;

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        final String sXmlParams = xmlOutputter.outputString (pCaseEventParamsElement);

        insertVariationResultDeterminedRowElement = localServiceProxy
                .getJDOM (CASE_EVENT_SERVICE, INSERT_CASE_EVENT_ROW_METHOD, sXmlParams).getRootElement ();

        return insertVariationResultDeterminedRowElement;
    } // mInsertCaseEventRow()

    /**
     * (non-Javadoc)
     * Check to see if a variation result determined event exists.
     *
     * @param pVariationResultDetermined the variation result determined
     * @return the element
     */
    private Element mCheckIfEventOccurred (final Element pVariationResultDetermined)
    {
        Element eventsElement = null;
        List<Element> eventsElementList = null;
        Element event = null;
        String elementText = null;
        Element eventIDElement = null;
        Element insertedEventElement = null;

        eventsElement = pVariationResultDetermined.getChild ("JudgmentEvents");

        if (eventsElement != null)
        {

            eventsElementList = eventsElement.getChildren ();

            for (Iterator<Element> i = eventsElementList.iterator (); i.hasNext ();)
            {
                event = (Element) i.next ();
                eventIDElement = event.getChild ("EventID");
                elementText = eventIDElement.getText ();

                if (elementText.equals ("155"))
                {
                    // exists = true; RETURN object
                    insertedEventElement = event;
                    break;
                }
            }
        }
        return insertedEventElement;

    } // mCheckIfEventOccurred()

} // class InsertCaseEventRow
