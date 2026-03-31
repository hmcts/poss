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
package uk.gov.dca.caseman.warrant_service.java;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Class: InsertWarrantCaseEventsCustomProcessor.java
 * Service: Warrant
 * Method: addWarrant
 *
 * Created: 04-May-2005
 * 
 * @author Tim Connor
 * 
 *         Change History:
 *         v1.1 14/3/2006 Chris Hutt
 *         defect UCT 274: event 380 should not be crested when a warrnat is created as a result of an AE event 876
 *
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 
 *         Chris Hutt TD : Group2 5316:
 *         As part of testing this defect it was noted that an MCOL_DATA row was not being created for event
 *         380 (MCOL_DATA.TYPE = 'WI') becuase the Creditor Code not being extrcated from the dom and added to the
 *         case event.
 * 
 *         Chris Hutt TD : UCT_Group2 1593 25 April 2008
 *         Phil Hardy advises that BMS EN3 should be counted when a SUPS court creates a Foreign Warrant on another
 *         SUPS court, with creating court and section belonging to the receiving court. This is in addition to the
 *         BMS allocation associated with the events 380,454,456,458 which are creating at the same time.
 *         The problem was orioginally diagnosed as being related to Foreign Warrants coming in through Polar Lake
 *         (ie from legacy courts), but Phil says the requirement extends to Foreign Warrnants being created in
 *         SUPS/SUPS situations.
 *
 *         Chris Vincent : TRAC 1909 02 February 2010
 *         Change to BMS Tasks created when Foreign Warrants created. Foreign Warrants created online via
 *         the Create Foreign Warrants screen should create BMS Task EN67 while other Foreign Warrants created
 *         online should create BMS Tas EN3.
 *
 *         Chris Vincent : Trac 5025 (TCE Changes), 11/12/2013
 *         CONTROL warrants are replacing EXECUTION warrants so included in logic to determine case event id
 */
public class InsertWarrantCaseEventsCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Constructor.
     */
    public InsertWarrantCaseEventsCustomProcessor ()
    {
        super ();
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log pLog) throws SystemException, BusinessException
    {
        try
        {
            final Element warrantElement = (Element) XPath.selectSingleNode (params, "/ds/Warrant");
            final Element def1Element = (Element) XPath.selectSingleNode (params, "/ds/Warrant/Defendant1");
            Element paramsElement = null;

            // Retrieve the details from the warrant record
            final String caseNumber = warrantElement.getChildText ("CaseNumber");
            final String warrantID = warrantElement.getChildText ("WarrantID");
            final String warrantNumber = warrantElement.getChildText ("WarrantNumber");
            final String warrantType = warrantElement.getChildText ("WarrantType");
            final String courtCode = warrantElement.getChildText ("OwnedBy");
            final String receiptDate = warrantElement.getChildText ("DateRequestReceived");
            final String localNumber = warrantElement.getChildText ("LocalNumber");
            final String originalNumber = warrantElement.getChildText ("OriginalWarrantNumber");
            final String userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);
            final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
            final String eventSeq = warrantElement.getChildText ("CaseEventSeq");
            final String creditorCode = warrantElement.getChildText ("CreditorCode");
            final String executingCourtCode = warrantElement.getChildText ("ExecutingCourtCode");
            final String defPartyRoleCode = def1Element.getChildText ("PartyType");
            final String defCasePartyNo = def1Element.getChildText ("Number");

            if (eventSeq != null && !eventSeq.equals (""))
            {
                // A case event already exists, so update the existing event rather than creating a new one

                // First retrieve the event so we have the SCN for the event record
                paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (paramsElement, "caseEventSeq", eventSeq);

                final Document doc = this.invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                        CaseEventDefs.GET_CASE_EVENT_METHOD, paramsElement.getDocument ());

                // Update the case event XML
                final Element caseEventsElement = new Element ("CaseEvents");
                final Element caseEvent = (Element) XPath.selectSingleNode (doc, "/CaseEvent");
                mSetElement (caseEvent, "Status", "DETAILS_CHANGED");
                mSetElement (caseEvent, "EventDetails", "WARRANT NUMBER : " + warrantNumber);
                caseEventsElement.addContent ((Element) caseEvent.clone ());

                // Call the update service
                paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (paramsElement, "caseEvents", caseEventsElement);

                this.invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                        CaseEventDefs.UPDATE_CASE_EVENT_DETAILS_METHOD, paramsElement.getDocument ());
            }
            else if (localNumber == null || localNumber.equals (""))
            {
                // A case event needs to be created for the new warrant.
                final Element claimantElement = warrantElement.getChild ("Claimant");
                final String claimantname = claimantElement.getChildText ("Name");
                final String caseCourtCode = mGetCaseCourtCode (caseNumber);

                // If claimantName = COURT MANAGER then this is a warrant of execution created as a result of AE event
                // 876. Another event should not be generated here
                if ( !claimantname.equals ("COURT MANAGER") && caseCourtCode != null)
                {

                    String eventID = null;
                    if (originalNumber != null && !originalNumber.equals (""))
                    {
                        // This is a re-issue, so fire event 630
                        eventID = "630";
                    }
                    else
                    {
                        if (warrantType.equals ("EXECUTION") || warrantType.equals ("CONTROL"))
                        {
                            eventID = "380";
                        }
                        else if (warrantType.equals ("POSSESSION"))
                        {
                            eventID = "454";
                        }
                        else if (warrantType.equals ("DELIVERY"))
                        {
                            eventID = "456";
                        }
                        else if (warrantType.equals ("COMMITTAL"))
                        {
                            eventID = "458";
                        }
                    }

                    final CaseEventXMLBuilder builder =
                            new CaseEventXMLBuilder (caseNumber, eventID, todaysDate, receiptDate, courtCode);
                    builder.setEventDetails ("WARRANT NUMBER : " + warrantNumber);
                    builder.setWarrantId (warrantID);
                    builder.setUserName (userName);

                    if (courtCode.equals ("335") && eventID.equals ("380"))
                    {
                        builder.setSubjectPartyRoleCode (defPartyRoleCode);
                        builder.setSubjectCasePartyNumber (defCasePartyNo);
                    }

                    // Creditor code required to determine if MCOL update required.
                    if (creditorCode != null && !creditorCode.equals (""))
                    {
                        builder.setCreditorCode (creditorCode);
                    }

                    // Generate a new XML 'document' from the 'CaseEvent' object.
                    // (This will contain all the element nodes required for 'InsertCaseEventRow()'.
                    final Element caseEventElement = builder.getXMLElement ("CaseEvent");

                    // Wrap the 'CaseEvent' XML in the 'params/param' structure.
                    paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                    XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

                    // Call the service.
                    this.invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                            CaseEventDefs.INSERT_CASE_EVENT_ROW_METHOD, paramsElement.getDocument ());
                }
            }
            else
            {
                // The warrant is a foreign warrant. Foreign warrants aren't associated with cases, so instead of
                // creating
                // a case event, a BMS task count is updated. Changes made here for Trac 1909.
                final Element datePrintedElement = warrantElement.getChild ("DatePrinted");
                final Element dateReprintedElement = warrantElement.getChild ("DateReprinted");
                if (datePrintedElement != null && !WarrantUtils.isEmpty (datePrintedElement.getText ()) &&
                        dateReprintedElement != null && !WarrantUtils.isEmpty (dateReprintedElement.getText ()))
                {
                    // This is a Warrant created on the Create Foreign Warrants screen (has Date Printed and Date
                    // Reprinted populated). Create BMS Task EN67.
                    paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                    XMLBuilder.addParam (paramsElement, "section", "WARRANT");
                    XMLBuilder.addParam (paramsElement, "receiptDate", receiptDate);
                    XMLBuilder.addParam (paramsElement, "typeOfWarrant", "M"); // M for Manually Entered
                    XMLBuilder.addParam (paramsElement, "courtCode", courtCode);
                    XMLBuilder.addParam (paramsElement, "taskType", "B"); // B for ???
                    XMLBuilder.addParam (paramsElement, "userId", userName);

                    // Call the service.
                    this.invokeLocalServiceProxy ("ejb/BmsServiceLocal", "addBmsRuleNonEventLocal",
                            paramsElement.getDocument ());
                }
                else
                {
                    // This is a Warrant automatically created when a Foreign Warrant is created by updating the
                    // executing court of a Warrant to that of another SUPS Court. Create BMS Task EN3.
                    paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                    XMLBuilder.addParam (paramsElement, "section", "WARRANT");
                    XMLBuilder.addParam (paramsElement, "receiptDate", receiptDate);
                    XMLBuilder.addParam (paramsElement, "typeOfWarrant", "A"); // A for Auto Entered
                    XMLBuilder.addParam (paramsElement, "courtCode", executingCourtCode);
                    XMLBuilder.addParam (paramsElement, "taskType", "B"); // B for ???
                    XMLBuilder.addParam (paramsElement, "userId", userName);
                    XMLBuilder.addParam (paramsElement, "creatingCourtCode", executingCourtCode);
                    XMLBuilder.addParam (paramsElement, "creatingSection", "SYSTEM TRANSFER SECTION");

                    // Call the service.
                    this.invokeLocalServiceProxy ("ejb/BmsServiceLocal", "addBmsRuleNonEventLocal",
                            paramsElement.getDocument ());
                }
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return params;
    }

    /**
     * (non-Javadoc)
     * Set elements text value.
     * If necessary create the element.
     *
     * @param pParentElement the parent element
     * @param pElementName the element name
     * @param pElementContent the element content
     */
    private void mSetElement (final Element pParentElement, final String pElementName, final String pElementContent)
    {
        Element element = null;

        element = pParentElement.getChild (pElementName);
        if (null == element)
        {
            element = new Element (pElementName);
            pParentElement.addContent (element);
        }
        element.setText (pElementContent);
    } // mSetElement()

    /**
     * (non-Javadoc)
     * Call a service to get court code.
     *
     * @param pCaseNumber the case number
     * @return the string
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private String mGetCaseCourtCode (final String pCaseNumber) throws SystemException, JDOMException, BusinessException
    {
        Element courtCodeElement = null;
        Element resultElement = null;
        String courtCode = null;
        Element paramsElement = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

        resultElement = invokeLocalServiceProxy ("ejb/CaseEventServiceLocal", "getCaseCourtCodeLocal",
                paramsElement.getDocument ()).getRootElement ();

        courtCodeElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Case/CourtCode");
        if (courtCodeElement != null)
        {
            courtCode = courtCodeElement.getText ();
        }

        return courtCode;
    } // mGetCaseCourtCode()
}