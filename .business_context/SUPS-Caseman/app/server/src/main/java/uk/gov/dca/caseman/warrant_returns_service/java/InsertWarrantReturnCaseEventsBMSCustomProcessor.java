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
package uk.gov.dca.caseman.warrant_returns_service.java;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
import uk.gov.dca.caseman.co_event_service.java.CoEventDefs;
import uk.gov.dca.caseman.co_event_service.java.CoEventXMLBuilder;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.warrant_service.java.WarrantUtils;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Class: InsertWarrantReturnCaseEventsBMSCustomProcessor.java
 * Description: On the Maintain Warrant Returns screen, for home warrants inserts a case
 * event for each interim and final return added to the warrant. For foreign
 * warrants inserts a BMS task for each interim and final return added to
 * the warrant
 * 
 * Change History
 * --------------
 * v1.0 10 May 2005 Tun Shwe
 * 
 * v1.1 19 Dec 2005 Chris Hutt
 * Defect 1941: Did not cope with CO based warrants. These have CO_EVENTS
 * instead of CASE_EVENTS.
 * 
 * 
 * v1.2 9 May 2006 Chris Hutt
 * Defect 2391 : warrant Id missing from associated case event
 * 
 *
 * 17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 16-Jan-2006 Phil Haferer (EDS) - Modified process() to transfer the CreditorCode into
 * the Case Event XML document, to enable the need for CCBC updates to be recognised.
 * (TD TEMP_CASEMAN 3907: Maintain Case Events - MCOL Update for AoS event 38).
 * 05-Jul-2007 Chris Vincent (EDS): for insert of case event, set the warrant return id in the CaseEventXMLBuilder.
 * Required for Group2 Defect 5142.
 * 
 * 07-Nov-2007 Chris Hutt (EDS): If no receipt date, then use today. This is to take into account the scenario where
 * a warrant is amended (executing court changed) and there is no warrnat receipt date.
 * Normal behaviour is that the warrant receipt date is used. However, if the warrant
 * came in thru CCBC batch or legacy there will be no warrant receipt date and
 * BMS ageing will crash!
 * 
 * 22 Feb 07 Chris Hutt: TDCaseman 6505, USD117047
 * non event related tasks not being allocated correctly for warrants because:
 * 1) For Home warrants the BMS non-event related task engine is not being called at all
 * 2) For Foreign warrants its being called but without the ReturnCode.
 * 3) manuallyCreated node not being set (to Y)
 * 4) warrantType needs top be specified (HOME or FOREIGN)
 *
 * 25-Mar-2008 Chris Vincent: TD CaseMan Defect 6505, added check for IgnoreBMSNonEvent node as warrant
 * returns forwarded to a CCBC owned home warrant from a SUPS executed foreign warrant should
 * NOT count a BMS Non Event Task.
 *
 * Service: WarrantAmounts
 * Method: insertWarrantReturns
 * 
 * Created: 10-May-2005
 * 
 * @author Tun Shwe
 */
public class InsertWarrantReturnCaseEventsBMSCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The Constant CASE_EVENT_SERVICE. */
    private static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    
    /** The Constant GET_CASE_COURT_CODE. */
    private static final String GET_CASE_COURT_CODE = "getCaseCourtCodeLocal";

    /**
     * Constructor.
     */
    public InsertWarrantReturnCaseEventsBMSCustomProcessor ()
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
        final String warrantParams = null;
        String warrantType = "HOME"; // default value

        try
        {
            final Element warrantElement =
                    (Element) XPath.selectSingleNode (params, "/ds/WarrantReturns/WarrantEvents/WarrantEvent");
            final String warrantID = warrantElement.getChildText ("WarrantID");
            String receiptDate = warrantElement.getChildText ("ReceiptDate");
            final String returnDate = warrantElement.getChildText ("ReturnDate");
            final String returnCode = warrantElement.getChildText ("Code");
            final String warrantReturnID = warrantElement.getChildText ("WarrantReturnsID");
            boolean checkBMSRuleNonEvent = false;

            // If Local Number is not present (i.e. for home warrants), a case event is
            // created (the event is determined according to return type).
            // Else warrant is a foreign warrant and a BMS task is created instead (the
            // BMS task is determined according to return type).
            // If the warrant return is 158 (RE-ISSUE WARRANT), don't create the case event because event 630 has
            // already been created.
            final String localNumber = warrantElement.getChildText ("LocalNumber");
            if (WarrantUtils.isEmpty (localNumber) && !"158".equals (returnCode))
            {
                warrantType = "HOME";
                // Retrieve the input parameters for a new Case/Co event
                final String caseNumber = warrantElement.getChildText ("CaseNumber");
                final String coNumber = warrantElement.getChildText ("CoNumber");
                final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
                final String executedBy = warrantElement.getChildText ("ExecutedBy");
                final String defendantId = warrantElement.getChildText ("Defendant");
                final String createdBy = warrantElement.getChildText ("CreatedBy");

                // Determine if the case event is 610 or 620 and set up its event detail
                String eventID = null;
                String eventDetail = null;
                // If return code is a number, it's a Final Return, else it's an Interim Return
                final Pattern regExp = Pattern.compile ("[0-9]*");
                final Matcher m = regExp.matcher (returnCode);
                if (m.matches ())
                {
                    eventID = "620";
                    eventDetail = "FINAL RETURN CODE - " + returnCode;
                }
                else
                {
                    eventID = "610";
                    eventDetail = "INTERIM RETURN CODE - " + returnCode;
                }

                final Document warrant = getWarrant (warrantID);
                Element partyElement = null;
                if (defendantId == null || defendantId.equals ("1"))
                {
                    partyElement = (Element) XPath.selectSingleNode (warrant, "/ds/Warrant/Defendant1");
                }
                else
                {
                    partyElement = (Element) XPath.selectSingleNode (warrant, "/ds/Warrant/Defendant2");
                }

                /* If no receipt date, then use today. This is to take into account the scenario where
                 * a warrant is amended (executing court changed) and there is no warrnat receipt date.
                 * Normal behaviour is that the warrant receipt date is used. However, if the warrant
                 * came in thru CCBC batch or legacy there will be no warrant receipt date and
                 * BMS ageing will crash! */

                if (receiptDate == null || receiptDate.equals (""))
                {
                    receiptDate = todaysDate;
                }

                if (caseNumber == null || caseNumber.equals (""))
                {
                    if (coNumber != null && !coNumber.equals (""))
                    {

                        // Add a CO event

                        final CoEventXMLBuilder builder =
                                new CoEventXMLBuilder (coNumber, eventID, todaysDate, receiptDate, createdBy, "N");
                        builder.setWarrantId (warrantID);

                        // Generate a new XML 'document' from the 'COEvent' object
                        // (This will contain all the element nodes required for 'InsertCoEventAuto()'
                        final Element coEventElement = builder.getXMLElement ("COEvent");

                        // Wrap the 'COEvent' XML in the 'params/param' structure
                        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                        XMLBuilder.addParam (paramsElement, "coEvent", coEventElement);

                        // Call the service
                        final Document result = this.invokeLocalServiceProxy (CoEventDefs.CO_EVENT_SERVICE,
                                CoEventDefs.INSERT_CO_EVENT_AUTO, paramsElement.getDocument ());

                        // Get the sequence number of the inserted Co event
                        final Element coEventSeqElement =
                                (Element) XPath.selectSingleNode (result, "/COEvent/COEventSeq");
                        final String coEventSeq = coEventSeqElement.getText ();

                        // Update the warrant return with the co event sequence number
                        warrantElement.addContent ((Element) coEventSeqElement.clone ());
                        XMLBuilder.add (warrantElement, "CaseEventSeq");

                        checkBMSRuleNonEvent = true;
                    }

                }
                else
                {

                    // Add a Case Event (only if case exists)
                    final String courtCode = mGetCaseCourtCode (caseNumber);
                    if (courtCode != null)
                    {
                        final CaseEventXMLBuilder builder =
                                new CaseEventXMLBuilder (caseNumber, eventID, todaysDate, receiptDate, executedBy);
                        builder.setEventDetails (eventDetail);
                        builder.setUserName (createdBy);
                        builder.setSubjectCasePartyNumber (partyElement.getChildText ("Number"));
                        builder.setSubjectPartyRoleCode (partyElement.getChildText ("PartyType"));
                        builder.setWarrantId (warrantID);
                        builder.setCreditorCode (mGetCaseCreditorCode (caseNumber));
                        builder.setWarrantReturnId (warrantReturnID);
                        builder.setCourtCode (courtCode);

                        // Generate a new XML 'document' from the 'CaseEvent' object
                        // (This will contain all the element nodes required for 'InsertCaseEventRow()'
                        final Element caseEventElement = builder.getXMLElement ("CaseEvent");

                        // Wrap the 'CaseEvent' XML in the 'params/param' structure
                        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                        XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

                        // Call the service
                        final Document result = this.invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                                CaseEventDefs.INSERT_CASE_EVENT_ROW_METHOD, paramsElement.getDocument ());

                        // Get the sequence number of the inserted case event
                        final Element eventSeqElement =
                                (Element) XPath.selectSingleNode (result, "/CaseEvent/CaseEventSeq");
                        final String eventSeq = eventSeqElement.getText ();

                        // Update the warrant return with the case event sequence number
                        warrantElement.addContent ((Element) eventSeqElement.clone ());
                        XMLBuilder.add (warrantElement, "COEventSeq");
                    }

                    checkBMSRuleNonEvent = true;
                }
            }
            else
            {
                checkBMSRuleNonEvent = true;
                warrantType = "FOREIGN";
            }

            // May need to check if this Return Code has an associated non-event related BMS task
            // and update TASK_COUNTS accordingly
            if (checkBMSRuleNonEvent)
            {

                // Check if warrant return should ignore BMS Non Event (e.g. has been forwarded
                // from foreign warrant issued by CCBC which shouldn't generate a BMS Non Event
                // task on the home warrant as well as the foreign warrant).
                final Element ignoreBMSNonEventElement = warrantElement.getChild ("IgnoreBMSNonEvent");
                String ignoreBMSNonEventFlag = "N";
                if (null != ignoreBMSNonEventElement)
                {
                    ignoreBMSNonEventFlag = ignoreBMSNonEventElement.getText ();
                }

                if (ignoreBMSNonEventFlag.equals ("N"))
                {
                    // Retrieve the input parameters for a new BMS task
                    final String error = warrantElement.getChildText ("Error");

                    final Element manuallyCreatedElement = warrantElement.getChild ("manuallyCreated");
                    String manuallyCreated = "N";
                    if (null != manuallyCreatedElement)
                    {
                        manuallyCreated = manuallyCreatedElement.getText ();
                    }

                    // Determine return type.
                    // If the return code is a number, it's a final return
                    // Else it's an interim return
                    String returnType = "";
                    final Pattern regExp = Pattern.compile ("[0-9]*");
                    final Matcher m = regExp.matcher (returnCode);
                    if (m.matches ())
                    {
                        returnType = "F";
                    }
                    else
                    {
                        returnType = "I";
                    }

                    // The BMS task count should be incremented for the users court,
                    // not the warrant or warrant returns court
                    final String userCourt = (String) m_context.getSystemItem (IComponentContext.COURT_ID_KEY);

                    // Create parameters for the BMS creation service

                    final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                    XMLBuilder.addParam (paramsElement, "section", "WARRANTRETURN");
                    XMLBuilder.addParam (paramsElement, "warrantId", warrantID);
                    XMLBuilder.addParam (paramsElement, "courtCode", userCourt);
                    XMLBuilder.addParam (paramsElement, "receiptDate", receiptDate);
                    XMLBuilder.addParam (paramsElement, "processingDate", returnDate);
                    XMLBuilder.addParam (paramsElement, "returnType", returnType);
                    XMLBuilder.addParam (paramsElement, "taskType", "B");
                    XMLBuilder.addParam (paramsElement, "error", error);
                    XMLBuilder.addParam (paramsElement, "userId", warrantElement.getChildText ("CreatedBy"));
                    XMLBuilder.addParam (paramsElement, "returnCode", returnCode); // defect 6505
                    XMLBuilder.addParam (paramsElement, "manuallyCreated", manuallyCreated); // defect 6505
                    XMLBuilder.addParam (paramsElement, "typeOfWarrant", warrantType); // defect 6505

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
     * Retrieves a warrant record by calling the getWarrant service.
     *
     * @param warrantID The ID of the warrant to get
     * @return Document The warrant record
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Document getWarrant (final String warrantID) throws SystemException, BusinessException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "warrantID", warrantID);

        return this.invokeLocalServiceProxy ("ejb/WarrantServiceLocal", "getWarrantLocal",
                paramsElement.getDocument ());
    }

    /**
     * Retrieves a warrant record by calling the getWarrant service.
     *
     * @param pCaseNumber The ID of the warrant to get
     * @return The Creditor Code.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetCaseCreditorCode (final String pCaseNumber)
        throws SystemException, BusinessException, JDOMException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

        final Element dsElement = invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "getCaseCreditorCodeLocal",
                paramsElement.getDocument ()).getRootElement ();

        final String creditorCode = XMLBuilder.getXPathValue (dsElement, "/ds/Case/CreditorCode");

        return creditorCode;
    } // mGetCaseCreditorCode()

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

        resultElement = invokeLocalServiceProxy (CASE_EVENT_SERVICE, GET_CASE_COURT_CODE, paramsElement.getDocument ())
                .getRootElement ();

        courtCodeElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Case/CourtCode");
        if (courtCodeElement != null)
        {
            courtCode = courtCodeElement.getText ();
        }

        return courtCode;
    } // mGetCaseCourtCode()
}