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
import uk.gov.dca.caseman.warrant_returns_service.java.WarrantReturnsXMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * The Class InsertCaseEvent160JudgRecSetAsideCustomProcessor.
 *
 * @author szt44s
 *         Created on 08-Mar-2005
 * 
 *         Change History:
 *         16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 *         17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 *         21-Aug-2006 Phil Haferer (EDS): Modified mInsertWarrantReturnRow().
 *         The relationship between Judgments and Warrants was changed in response to earlier defect,
 *         and this has not been reflected here. Introduced call to new method "getOutstandingWarrantForJudgment",
 *         and also means of determining the Defendant Id.
 *         (TD CASEMAN 4323: UC004 Maintain Judgments - Set aside after warrant issued should cause warrant
 *         returns).
 *         25/01/2008 - Mark Groen, CASEMAN 6475 - Ensure the case events from judgments have the case court code and
 *         not the
 *         Judgment court code.
 */
public class InsertCaseEvent160JudgRecSetAsideCustomProcessor extends AbstractCustomProcessor
{
    /**
     * Case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * Insert case event row method name.
     */
    public static final String INSERT_CASE_EVENT_ROW_METHOD = "insertCaseEventRowLocal";
    /**
     * Judgment service name.
     */
    public static final String JUDGMENT_SERVICE = "ejb/JudgmentServiceLocal";
    /**
     * Get outstanding warrant for judgment method name.
     */
    public static final String GET_OUTSTANDING_WARRANT_FOR_JUDGMENT_METHOD = "getOutstandingWarrantForJudgmentLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public InsertCaseEvent160JudgRecSetAsideCustomProcessor ()
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
        Element JudgSetAsideElement = null;
        Element insertJudgRecSetAsideRowElement = null;
        List<Element> JudgmentElementList = null;
        Element Judgment = null;
        String caseNumber = null;
        String userName = null;
        String caseEventSequence = null;
        Element eventSequenceElement = null;

        try
        {
            JudgSetAsideElement = pDocParams.getRootElement ();

            caseNumber = ((Element) XPath.selectSingleNode (JudgSetAsideElement, "/ds/MaintainJudgment/CaseNumber"))
                    .getText ();

            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            JudgmentElementList = XPath.selectNodes (JudgSetAsideElement, "//Judgment");

            for (Iterator<Element> x = JudgmentElementList.iterator (); x.hasNext ();)
            {
                Judgment = (Element) x.next ();

                /* Check to see if the Event 160 is in the DOM, if not no action necessary */
                final Element eventElement = mCheckIfEventOccurred (Judgment);

                if (eventElement != null)
                {

                    final Element caseEventParamsElement = mBuildJudgRecSetAside (Judgment, caseNumber, userName);
                    insertJudgRecSetAsideRowElement = mInsertCaseEventRow (caseEventParamsElement);

                    caseEventSequence = ((Element) XPath.selectSingleNode (insertJudgRecSetAsideRowElement,
                            "/CaseEvent/CaseEventSeq")).getText ();

                    eventSequenceElement = eventElement.getChild ("EventSequence");

                    eventSequenceElement.setText (caseEventSequence);

                    // If the judgment has an associated execution warrant, the warrant needs an
                    // interim return generated against it.
                    final String owningCourt = ((Element) XPath.selectSingleNode (JudgSetAsideElement,
                            "/ds/MaintainJudgment/OwningCourtCode")).getText ();
                    mInsertWarrantReturnRow (Judgment, caseNumber, owningCourt, userName);
                }
            }
            /* Output the original XML. */
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            final String sXml = xmlOutputter.outputString (JudgSetAsideElement);
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
     * Build a params element for use i inserting a judgRecSetAside event.
     *
     * @param pJudgSetAsideElement the judg set aside element
     * @param pCaseNumber the case number
     * @param pUserName the user name
     * @return Params Element.
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildJudgRecSetAside (final Element pJudgSetAsideElement, final String pCaseNumber,
                                           final String pUserName)
        throws JDOMException
    {
        // database fields
        String eventDate = null;
        String receiptDate = null;
        String applicant = null;
        String result = null;
        String resultDate = null;
        String judgmentSequence = null;
        String courtCode = null;
        String partyRoleCode = null;
        String casePartyNumber = null;

        // temp variables
        Element caseEventElement = null;
        Element paramsElement = null;
        Element setAsideElement = null;
        List<Element> applicationList = null;
        Element application = null;
        Element applicationIdElement = null;
        Element applicationToInsert = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        String elementText = null;

        setAsideElement = pJudgSetAsideElement.getChild ("ApplicationsToSetAside");

        applicationList = setAsideElement.getChildren ();

        for (Iterator<Element> i = applicationList.iterator (); i.hasNext ();)
        {
            application = (Element) i.next ();

            applicationIdElement = application.getChild ("Id");
            elementText = applicationIdElement.getText ();

            // There should always be a blank Id as this method would not
            // be called unless a new 160 event (Application to set Aside) is present in the DOM

            if (elementText.equals (""))
            {
                // new ApplicationToSetAside found
                applicationToInsert = application;
                break;
            }
        }

        eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
        receiptDate = ((Element) XPath.selectSingleNode (applicationToInsert, "AppDate")).getText ();
        applicant = ((Element) XPath.selectSingleNode (applicationToInsert, "Applicant")).getText ();
        result = ((Element) XPath.selectSingleNode (applicationToInsert, "Result")).getText ();
        resultDate = ((Element) XPath.selectSingleNode (applicationToInsert, "DateResult")).getText ();
        judgmentSequence = ((Element) XPath.selectSingleNode (pJudgSetAsideElement, "JudgmentId")).getText ();
        /* amended re defect 6475
         * courtCode = ((Element)(XPath.selectSingleNode(
         * pJudgSetAsideElement,
         * "VenueCode"))).getText(); */
        courtCode = ((Element) XPath.selectSingleNode (pJudgSetAsideElement, "CourtCode")).getText ();
        partyRoleCode = ((Element) XPath.selectSingleNode (pJudgSetAsideElement, "PartyRoleCode")).getText ();
        casePartyNumber = ((Element) XPath.selectSingleNode (pJudgSetAsideElement, "CasePartyNumber")).getText ();
        caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseEventSeq */"", /* String caseNumber */pCaseNumber,
                /* String standardEventId */"160", /* String subjectCasePartyNumber */casePartyNumber,
                /* String subjectPartyRoleCode */partyRoleCode, /* String applicant */applicant,
                /* String eventDetails */"", /* String eventDate */eventDate, /* String result */result,
                /* String warrantId */"", /* String judgmentSeq */judgmentSequence, /* String varySeq */"",
                /* String hrgSeq */"", /* String deletedFlag */"", /* String userName */pUserName,
                /* String receiptDate */receiptDate, /* String task */"", /* String statsModule */"",
                /* String ageCategory */"", /* String courtCode */courtCode, /* String resultDate */resultDate,
                /* String dateToRtl */"", /* String caseFlag */"", /* String listingType **/"");

        caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, caseEventElement);

        return paramsElement;
    } // mBuildJudgRecSetAside()

    /**
     * (non-Javadoc)
     * Insert a JudgRecSetAside case event record.
     *
     * @param pCaseEventParamsElement the case event params element
     * @return Inserted Case Event Element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCaseEventRow (final Element pCaseEventParamsElement)
        throws SystemException, BusinessException
    {
        Element insertJudgRecSetAsideRowElement = null;

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        final String sXmlParams = xmlOutputter.outputString (pCaseEventParamsElement);

        insertJudgRecSetAsideRowElement = localServiceProxy
                .getJDOM (CASE_EVENT_SERVICE, INSERT_CASE_EVENT_ROW_METHOD, sXmlParams).getRootElement ();

        return insertJudgRecSetAsideRowElement;
    } // mInsertCaseEventRow()

    /**
     * (non-Javadoc)
     * Check to see if a JudgRecSetAside event has occurred.
     *
     * @param pJudgSetAsideElement the judg set aside element
     * @return Element of event 160.
     */
    private Element mCheckIfEventOccurred (final Element pJudgSetAsideElement)
    {
        Element eventsElement = null;
        List<Element> eventsElementList = null;
        Element event = null;
        String elementText = null;
        Element eventIDElement = null;
        Element insertedEventElement = null;

        eventsElement = pJudgSetAsideElement.getChild ("JudgmentEvents");

        if (eventsElement != null)
        {

            eventsElementList = eventsElement.getChildren ();

            for (Iterator<Element> i = eventsElementList.iterator (); i.hasNext ();)
            {
                event = (Element) i.next ();
                eventIDElement = event.getChild ("EventID");
                elementText = eventIDElement.getText ();

                if (elementText.equals ("160"))
                {
                    // exists = true; RETURN object
                    insertedEventElement = event;
                    break;
                }
            }
        }
        return insertedEventElement;

    } // mCheckIfEventOccurred()

    /**
     * Checks for an execution warrant based on the judgment, and if one exists,
     * creates an interim warrant return (AD) against the warrant.
     *
     * @param judgmentElement The judgment to check
     * @param caseNumber The case number.
     * @param owningCourtCode The owning court code.
     * @param userName The user name.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mInsertWarrantReturnRow (final Element judgmentElement, final String caseNumber,
                                          final String owningCourtCode, final String userName)
        throws SystemException, BusinessException
    {
        // Extract the Party Against for this Judgment.
        final String JudgmentAgainstPartyRoleCode = judgmentElement.getChildText ("PartyRoleCode");
        final String JudgmentAgainstCasePartyNo = judgmentElement.getChildText ("CasePartyNumber");

        // Is there an Outstanding Warrant for this Judgment?
        final Element dsElement = mGetOutstandingWarrantsForJudgment (/* String pCaseNumber */caseNumber,
                /* String pAgainstPartyRoleCode */JudgmentAgainstPartyRoleCode,
                /* String pAgainstCasePartyNo */JudgmentAgainstCasePartyNo,
                /* String pJudgSeq */judgmentElement.getChildText ("JudgmentId"));
        Element warrantElement = null;
        if (dsElement != null)
        {
            for (Iterator<Element> i = dsElement.getChildren ().iterator (); i.hasNext ();)
            {
                warrantElement = (Element) i.next ();
            }
        }

        if (warrantElement != null)
        {
            // There is an associated warrant, so create return for it
            final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
            final WarrantReturnsXMLBuilder builder =
                    new WarrantReturnsXMLBuilder (warrantElement.getChildText ("WarrantId"), "AD", todaysDate);
            builder.setCourtCode ("0"); // AD is a National return code, so set to '0'
            builder.setExecutedBy (owningCourtCode);
            builder.setReceiptDate (todaysDate);
            builder.setDefendantID (mGetWarrantReturnDefendantId (JudgmentAgainstPartyRoleCode,
                    JudgmentAgainstCasePartyNo, warrantElement.getChildText ("Def1PartyRoleCode"),
                    warrantElement.getChildText ("Def1CasePartyNo"), warrantElement.getChildText ("Def2PartyRoleCode"),
                    warrantElement.getChildText ("Def2CasePartyNo")));
            builder.setCaseNumber (caseNumber);
            builder.setCreatedBy (userName);
            final Element warrantReturnsElement = builder.getXMLElement ();

            // Wrap the 'WarrantReturn' XML in the 'params/param' structure.
            final Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "NewReturn", warrantReturnsElement);

            // Translate to string.
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy.getJDOM ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal", sXmlParams);
        }
    }

    /**
     * Determine a value for the Defendant Id.
     * If the Judgment's Party Against matches the first Defendent on the Warrant the Defendant Id is "1".
     * If it matches the second Defendant on the warrant the Defendant Id is "2".
     * Otherwise the Defendant Id is "0".
     * 
     * @param pJudgmentAgainstPartyRoleCode The Role of the Judgment's Party Against.
     * @param pJudgmentAgainstCasePartyNo The Number of the Judgment's Party Against.
     * @param pWarrantDef1PartyRoleCode The Role of the first Defendant on the Warrant.
     * @param pWarrantDef1CasePartyNo The Number of the first Defendant on the Warrant.
     * @param pWarrantDef2PartyRoleCode The Role of the second Defendant on the Warrant.
     * @param pWarrantDef2CasePartyNo The Number of the second Defendant on the Warrant.
     * @return The Defendant Id.
     */
    private String
            mGetWarrantReturnDefendantId (final String pJudgmentAgainstPartyRoleCode,
                                          final String pJudgmentAgainstCasePartyNo,
                                          final String pWarrantDef1PartyRoleCode, final String pWarrantDef1CasePartyNo,
                                          final String pWarrantDef2PartyRoleCode, final String pWarrantDef2CasePartyNo)
    {
        String defendantId = null;

        if (pJudgmentAgainstPartyRoleCode.equals (pWarrantDef1PartyRoleCode) &&
                pJudgmentAgainstCasePartyNo.equals (pWarrantDef1CasePartyNo))
        {
            defendantId = "1";
        }
        else if (pJudgmentAgainstPartyRoleCode.equals (pWarrantDef2PartyRoleCode) &&
                pJudgmentAgainstCasePartyNo.equals (pWarrantDef2CasePartyNo))
        {
            defendantId = "2";
        }
        else
        {
            defendantId = "0";
        }

        return defendantId;
    } // mGetWarrantReturnDefendantId()

    /**
     * Get any Outstanding Warrants relating to the given Judgment - there should only be one live
     * Warrant at one time.
     *
     * @param pCaseNumber The Case Number that Judgment belongs to.
     * @param pAgainstPartyRoleCode The Role of the Judgment's Party Against.
     * @param pAgainstCasePartyNo The Number of the Judgment's Party Against.
     * @param pJudgSeq The Judgment Sequence Number.
     * @return The root Element of document that may contain the Outstanding Warrant.
     * @exception SystemException the system exception
     * @exception BusinessException the business exception
     */
    private Element mGetOutstandingWarrantsForJudgment (final String pCaseNumber, final String pAgainstPartyRoleCode,
                                                        final String pAgainstCasePartyNo, final String pJudgSeq)
        throws SystemException, BusinessException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
        XMLBuilder.addParam (paramsElement, "againstPartyRoleCode", pAgainstPartyRoleCode);
        XMLBuilder.addParam (paramsElement, "againstCasePartyNo", pAgainstCasePartyNo);
        XMLBuilder.addParam (paramsElement, "judgSeq", pJudgSeq);

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        final Element dsElement = localServiceProxy
                .getJDOM (JUDGMENT_SERVICE, GET_OUTSTANDING_WARRANT_FOR_JUDGMENT_METHOD, sXmlParams).getRootElement ();

        return dsElement;
    } // mGetOutstandingWarrantsForJudgment()

} // class InsertCaseEventRow
