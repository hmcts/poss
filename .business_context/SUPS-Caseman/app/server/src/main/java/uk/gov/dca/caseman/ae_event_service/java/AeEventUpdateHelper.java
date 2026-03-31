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
package uk.gov.dca.caseman.ae_event_service.java;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 17 aug 2005
 *
 * Change History
 * --------------
 * 
 * v1.0 Chris Hutt 17/8/05
 * 
 * v1.1 Chris Hutt 14/11/05
 * BMS task determined by AeEvent - not associated CaseEvent. This is resolved by calling the
 * bespoke CaseEvent.insertCaseEventRowOnAeEventInsert which relies on the BMS task already having
 * been allocated. In fact by the time this custom processor is called , the BMS task assocaited
 * with the AeEvent will have already been ascertained via InsertCoEventBMSCustomProcessor having
 * already being called via the service pipeline.
 * 
 * v1.2 Chris Hutt 18/11/05
 * Will lookup navigation rules if OracleReportCall is true
 * 
 * v1.3 Chris Hutt 18/11/05
 * Navigation on auto insert of event added
 * 
 * v1.4 Chris Hutt 16/12/05
 * defect UCT244: Method 'InsertCaseEventonAeEventInsert' will get Ae Event Description if not populated - defensive
 * option
 * 
 * v1.5 Chris Hutt 20/12/05
 * defect UCT274: Ae event 876 generates a 461 case event
 * 
 * V1.6 20/12/05 Chris Hutt: add CreatingCourt and CreatingSection (BMS enhancement)
 * 
 * v1.7 Chris Hutt 02/03/06
 * defect 2358: Events for xfer to CAPS .... Processdate = Sysdate. (GetProcessDate added)
 * 
 * v1.8 Chris Hutt 29/04/06
 * defect UCT379: OracleReport Navigation needs to be checked if an event updated to status = NOT SERVED
 * 15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 * 01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 * 30-Oct-2006 Chris Hutt: wrong case event assigned to AE events 894 and 895. Opportunity taken to simplify the logic
 * in the interests
 * of clarity and therefore maintainability. AreaByArea testing issue.
 * 09 Nov 2006 chris hutt
 * buildzissue 173:Rule for deriving CaseEvent where Stage involved (a 642 or a 644) now
 * depends upon AeEventConfig.CreateHearing
 * 25/11/2015 Chris Vincent, added method to delete report_map rows linked to Oracle Report outputs. Trac 5725
 * 
 * @author gzyysf
 */
public class AeEventUpdateHelper
{

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * System date service name.
     */
    public static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    /**
     * Get system date method name.
     */
    public static final String GET_SYSTEM_DATE = "getSystemDateLocal";

    /** The Constant WP_OUTPUT_SERVICE. */
    private static final String WP_OUTPUT_SERVICE = "ejb/WpOutputServiceLocal";
    
    /** The Constant REPORTS_SERVICE. */
    private static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    
    /** The Constant DELETE_REPORT_MAP_ROW_METHOD. */
    private static final String DELETE_REPORT_MAP_ROW_METHOD = "deleteAeReportMapRowLocal";

    /** The case event seq X path. */
    private final XPath caseEventSeqXPath;
    
    /** The obligations navigation on error config path. */
    private final XPath obligationsNavigationOnErrorConfigPath;
    
    /** The oracle report navigation on error config path. */
    private final XPath oracleReportNavigationOnErrorConfigPath;
    
    /** The event description path. */
    private final XPath eventDescriptionPath;
    
    /** The hearing created config path. */
    private final XPath hearingCreatedConfigPath;

    /** The out. */
    private final XMLOutputter out;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public AeEventUpdateHelper () throws JDOMException
    {
        localServiceProxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getPrettyFormat ());

        caseEventSeqXPath = XPath.newInstance ("/CaseEvent/CaseEventSeq");
        obligationsNavigationOnErrorConfigPath = XPath.newInstance ("/AeEventConfiguration/ObligationsCallOnError");
        oracleReportNavigationOnErrorConfigPath = XPath.newInstance ("/AeEventConfiguration/OracleReportCall");
        hearingCreatedConfigPath = XPath.newInstance ("/AeEventConfiguration/HearingCreated");
        eventDescriptionPath = XPath.newInstance ("/ds/StandardEvent/EventDescription");
        // OracleReportCall

    }

    /**
     * Insert a case event.
     *
     * @param pAeEventElement the corresponding Ae Event
     * @return Sequence number assigned to the case event
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public String InsertCaseEventonAeEventInsert (final Element pAeEventElement)
        throws BusinessException, SystemException
    {
        XMLOutputter xmlOutputter = null;
        Document insertCaseEventResultDoc = null;
        String caseEventSeq = null;
        Element caseEventSeqElement = null;
        String details = null;
        String receiptDate = null;
        String eventDate = null;
        String stage = null;
        String userName = null;
        String aeEventId = null;
        String caseNumber = null;
        String courtCode = null;
        String partyRoleCode = null;
        String casePartyNumber = null;
        String stdEventID = null;
        CaseEventXMLBuilder builder = null;
        Element caseEventElement = null;
        Element paramsElement = null;
        String sXmlParams = null;
        String bmsTaskNumber = null;
        String statsModule = null;
        String ageCategory = null;
        String creatingCourt = null;
        String creatingSection = null;
        Document eventConfigDoc = null;
        Element hearingCreatedElement = null;
        String hearingCreated = null;

        try
        {

            details = pAeEventElement.getChildText ("StandardEventDescription");
            receiptDate = pAeEventElement.getChildText ("ReceiptDate");
            eventDate = pAeEventElement.getChildText ("EventDate");
            stage = pAeEventElement.getChildText ("Stage");
            userName = pAeEventElement.getChildText ("UserName");
            aeEventId = pAeEventElement.getChildText ("StandardEventId");
            caseNumber = pAeEventElement.getChildText ("CaseNumber");
            courtCode = pAeEventElement.getChildText ("OwningCourtCode");
            partyRoleCode = pAeEventElement.getChildText ("JudgmentDebtorPartyRoleCode");
            casePartyNumber = pAeEventElement.getChildText ("JudgmentDebtorCasePartyNumber");
            bmsTaskNumber = pAeEventElement.getChildText ("BMSTask");
            statsModule = pAeEventElement.getChildText ("StatsModule");
            ageCategory = pAeEventElement.getChildText ("AgeCategory");
            creatingCourt = pAeEventElement.getChildText ("CreatingCourt");
            creatingSection = pAeEventElement.getChildText ("CreatingSection");

            // work out the correct case event - general rules
            if (mIsEmpty (stage) || stage.equals ("ISS"))
            {
                stdEventID = "640";
            }
            else
            {

                // Case Event dependent upon whether a hearing is created with this event
                eventConfigDoc = new AeEventValidationXMLBuilder ().getAeEventConfigurationDoc (aeEventId);

                hearingCreatedElement =
                        (Element) hearingCreatedConfigPath.selectSingleNode (eventConfigDoc.getRootElement ());
                hearingCreated = hearingCreatedElement.getText ();

                if (hearingCreated.equals ("true"))
                {
                    stdEventID = "644";
                }
                else
                {
                    stdEventID = "642";
                }
            }

            // Event specifics which may override the above principles
            if (aeEventId.equals ("876"))
            {
                stdEventID = "461";
            }

            builder = new CaseEventXMLBuilder (caseNumber, stdEventID, eventDate, receiptDate, courtCode);

            // get ae description if not there
            if (mIsEmpty (details))
            {
                details = mGetEventDescription (aeEventId);
            }

            builder.setEventDetails (details);
            builder.setUserName (userName);
            builder.setSubjectPartyRoleCode (partyRoleCode);
            builder.setSubjectCasePartyNumber (casePartyNumber);
            builder.setBMSTask (bmsTaskNumber);
            builder.setStatsModule (statsModule);
            builder.setAgeCategory (ageCategory);
            builder.setCreatingCourt (creatingCourt);
            builder.setCreatingSection (creatingSection);

            // Generate a new XML 'document' from the 'CaseEvent' object.
            // (This will contain all the element nodes required for 'InsertCaseEventRow()'.
            caseEventElement = builder.getXMLElement ("CaseEvent");

            // Wrap the 'CaseEvent' XML in the 'params/param' structure.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            insertCaseEventResultDoc = localServiceProxy.getJDOM (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.INSERT_CASE_EVENT_ROW_ON_AE_EVENT_INSERT, sXmlParams);
            //

            // Extract the sequence number assigned to the case event
            caseEventSeqElement = (Element) caseEventSeqXPath.selectSingleNode (insertCaseEventResultDoc);
            caseEventSeq = caseEventSeqElement.getText ();
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return caseEventSeq;
    }

    /**
     * Get update navigation element.
     *
     * @param pAeEventElement The ae event element
     * @return Navigation xml element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public Element getUpdateNavigation (final Element pAeEventElement) throws BusinessException, SystemException
    {

        AeEventNavigationHelper aeEventNavigationHelper = null;
        Element aeEventNavigationListElement = null;
        String aeEventId = null;
        Document eventConfigDoc = null;
        Element obligationCallElement = null;
        String obligationCall = null;
        Element oracleReportCallElement = null;
        String oracleReportCall = null;
        Document aeEventDoc = null;

        try
        {
            aeEventId = pAeEventElement.getChildText ("StandardEventId");

            // Get the rules associated with the specified event
            // -------------------------------------------------
            eventConfigDoc = new AeEventValidationXMLBuilder ().getAeEventConfigurationDoc (aeEventId);

            obligationCallElement = (Element) obligationsNavigationOnErrorConfigPath
                    .selectSingleNode (eventConfigDoc.getRootElement ());
            obligationCall = obligationCallElement.getText ();

            oracleReportCallElement = (Element) oracleReportNavigationOnErrorConfigPath
                    .selectSingleNode (eventConfigDoc.getRootElement ());
            oracleReportCall = oracleReportCallElement.getText ();

            if (obligationCall.equals ("true") || oracleReportCall.equals ("true"))
            {

                aeEventDoc = new Document ();
                aeEventDoc.addContent (((Element) pAeEventElement.clone ()).detach ());
                // Build a Navigation XML Document for the Client.
                aeEventNavigationHelper = new AeEventNavigationHelper ();
                aeEventNavigationListElement =
                        aeEventNavigationHelper.mBuildNavigationXMLElement (aeEventDoc.getRootElement ());
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return aeEventNavigationListElement;
    }

    /**
     * Get auto event navigation element.
     *
     * @param pAeEventElement The ae event element
     * @return Auto event navigation element.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public Element getAutoEventNavigation (final Element pAeEventElement) throws BusinessException, SystemException
    {
        AeEventNavigationHelper aeEventNavigationHelper = null;
        Element aeEventNavigationListElement = null;
        String aeEventId = null;
        Document eventConfigDoc = null;
        Element obligationCallElement = null;
        String obligationCall = null;
        Document aeEventDoc = null;
        Element oracleReportCallElement = null;
        String oracleReportCall = null;

        try
        {
            aeEventId = pAeEventElement.getChildText ("StandardEventId");

            // Get the rules associated with the specified event
            // -------------------------------------------------

            eventConfigDoc = new AeEventValidationXMLBuilder ().getAeEventConfigurationDoc (aeEventId);
            obligationCallElement = (Element) obligationsNavigationOnErrorConfigPath
                    .selectSingleNode (eventConfigDoc.getRootElement ());
            obligationCall = obligationCallElement.getText ();

            oracleReportCallElement = (Element) oracleReportNavigationOnErrorConfigPath
                    .selectSingleNode (eventConfigDoc.getRootElement ());
            oracleReportCall = oracleReportCallElement.getText ();

            if (obligationCall.equals ("true") || oracleReportCall.equals ("true"))
            {

                aeEventDoc = new Document ();
                aeEventDoc.addContent (((Element) pAeEventElement.clone ()).detach ());
                // Build a Navigation XML Document for the Client.
                aeEventNavigationHelper = new AeEventNavigationHelper ();
                aeEventNavigationListElement =
                        aeEventNavigationHelper.mBuildNavigationXMLElement (aeEventDoc.getRootElement ());
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return aeEventNavigationListElement;
    }

    /**
     * Insert case event on ae event update.
     *
     * @param pAeEventElement The ae event element
     * @param pCaseNumber The case number
     * @param pCourtCode The court code
     * @param pCartyRoleCode The carty role code
     * @param pCasePartyNumber The case party number
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public void InsertCaseEventOnAeEventUpdate (final Element pAeEventElement, final String pCaseNumber,
                                                final String pCourtCode, final String pCartyRoleCode,
                                                final String pCasePartyNumber)
        throws BusinessException, SystemException
    {
        XMLOutputter xmlOutputter = null;
        String stdEventID = null;

        String details = pAeEventElement.getChildText ("StandardEventDescription");
        String receiptDate = pAeEventElement.getChildText ("ReceiptDate");
        String eventDate = pAeEventElement.getChildText ("EventDate");
        String userName = pAeEventElement.getChildText ("UserName");
        final String aeEventId = pAeEventElement.getChildText ("StandardEventId");
        final String systemDate = mGetSystemDate ();

        // assign the correct case event
        if (aeEventId.equals ("876"))
        {

            stdEventID = "461";

        }
        else
        {

            stdEventID = "645";
            receiptDate = systemDate;
            eventDate = systemDate;
            userName = pAeEventElement.getChildText ("UpdatingUser");
        }

        final CaseEventXMLBuilder builder =
                new CaseEventXMLBuilder (pCaseNumber, stdEventID, eventDate, receiptDate, pCourtCode);

        // get ae description if not there
        if (mIsEmpty (details))
        {
            details = mGetEventDescription (aeEventId);
        }

        builder.setEventDetails (details);
        builder.setUserName (userName);
        builder.setSubjectPartyRoleCode (pCartyRoleCode);
        builder.setSubjectCasePartyNumber (pCasePartyNumber);

        // Generate a new XML 'document' from the 'CaseEvent' object.
        // (This will contain all the element nodes required for 'InsertCaseEventRow()'.
        final Element caseEventElement = builder.getXMLElement ("CaseEvent");

        // Wrap the 'CaseEvent' XML in the 'params/param' structure.
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        localServiceProxy.getJDOM (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.INSERT_CASE_EVENT_ROW_METHOD,
                sXmlParams);
    }

    /**
     * Update case event.
     *
     * @param pAeEventElement The ae event element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public void UpdateCaseEvent (final Element pAeEventElement) throws BusinessException, SystemException
    {
        XMLOutputter xmlOutputter = null;
        String details = null;
        Element caseEventElement = null;
        Element paramsElement = null;
        CaseEventXMLBuilder builder = null;

        final String caseEventSeq = pAeEventElement.getChildText ("CaseEventSeq");

        if ( !mIsEmpty (caseEventSeq))
        {
            details = pAeEventElement.getChildText ("StandardEventDescription");
            builder = new CaseEventXMLBuilder ("", "", "", "", "");

            builder.setCaseEventSeq (caseEventSeq);
            builder.setDeletedFlag ("Y");
            builder.setEventDetails (details);

            // Generate a new XML 'document' from the 'CaseEvent' object.
            // (This will contain all the element nodes required for 'UpdateCaseEventRow()'.
            caseEventElement = builder.getXMLElement ("CaseEvent");

            // Wrap the 'CaseEvent' XML in the 'params/param' structure.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy.getJDOM (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.UPDATE_CASE_EVENT_ROW_NO_LOCK_METHOD, sXmlParams);
        }
    }

    /**
     * Update ae event.
     *
     * @param pAeEventElement The ae event element.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public void UpdateAeEvent (final Element pAeEventElement) throws BusinessException, SystemException
    {
        XMLOutputter xmlOutputter = null;
        Element paramsElement = null;
        Element aeEventElement = null;
        String sXmlParams = null;

        // Wrap the 'CaseEvent' XML in the 'params/param' structure.
        paramsElement = XMLBuilder.getNewParamsElement ();
        aeEventElement = (Element) pAeEventElement.clone ();
        aeEventElement.detach ();
        XMLBuilder.addParam (paramsElement, "aeEvent", aeEventElement);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        localServiceProxy.getJDOM (AeEventDefs.AE_EVENT_SERVICE, AeEventDefs.UPD_AE_EVENT_ROW, sXmlParams);
    }

    /**
     * Get process date.
     *
     * @param pEventId The event id
     * @return The process date string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public String GetProcessDate (final String pEventId) throws SystemException, BusinessException
    {
        IAeEventConfigDO aeEventConfigDO = null;
        String processDate = "";

        aeEventConfigDO = mGetAeEventConfig (pEventId);
        if (aeEventConfigDO.isMarkForCAPSTransfer ())
        {
            processDate = mGetSystemDate ();
        }

        return processDate;
    }

    /**
     * (non-Javadoc)
     * Gets and returns event config DO.
     *
     * @param pEventId the event id
     * @return the i ae event config DO
     * @throws SystemException the system exception
     */
    private IAeEventConfigDO mGetAeEventConfig (final String pEventId) throws SystemException
    {
        IAeEventConfigDO aeEventConfigDO = null;
        AeEventConfigManager aeEventConfigManager = null;

        final int standardEventId = Integer.parseInt (pEventId);

        // Retrieve the configuration data object associated with the standard Event id.
        aeEventConfigManager = AeEventConfigManager.getInstance ();
        aeEventConfigDO = aeEventConfigManager.getAeEventConfigDO (standardEventId);

        return aeEventConfigDO;
    } // mGetCoEventConfig()

    /**
     * (non-Javadoc)
     * Calls service to get system date.
     *
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetSystemDate () throws SystemException, BusinessException
    {
        Element getSystemDateElement = null;
        Element getDateParamsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        String systemDate = null;

        getDateParamsElement = mGetSystemDateParams ();
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (getDateParamsElement);

        getSystemDateElement =
                localServiceProxy.getJDOM (SYSTEM_DATE_SERVICE, GET_SYSTEM_DATE, sXmlParams).getRootElement ();

        systemDate = getSystemDateElement.getText ();

        return systemDate;
    } // mGetSystemDate()

    /**
     * (non-Javadoc)
     * Returns params element required by system date service.
     *
     * @return the element
     */
    private Element mGetSystemDateParams ()
    {
        Element paramsElement = null;
        // Build the Parameter XML for passing to the getSystemDate service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "date", "");

        return paramsElement;
    } // mGetSystemDateParams()

    /**
     * (non-Javadoc)
     * Calls service to get the event description.
     *
     * @param pStandardEventId the standard event id
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String mGetEventDescription (final String pStandardEventId) throws BusinessException, SystemException
    {
        Element resultRootElement = null;
        Element resultElement = null;

        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "eventId", pStandardEventId);

            resultRootElement = localServiceProxy.getJDOM (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.GET_STANDARD_EVENT, getXMLString (paramsElement)).getRootElement ();

            resultElement = (Element) eventDescriptionPath.selectSingleNode (resultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return resultElement.getText ();
    }

    /**
     * Deletes any REPORT_MAP (bulk printing) rows associated with the AE event.
     *
     * @param pAEEventElement The case event element parameters.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void mDeleteReportMapRows (final Element pAEEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        final String sValue = pAEEventElement.getChildText ("AEEventSeq");
        final String sErrorFlag = pAEEventElement.getChildText ("ErrorInd");

        if (sErrorFlag.equals ("Y"))
        {
            // Build the Parameter XML for passing to the Delete Report Map service.
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "aeEventSeq", sValue);

            // Delete the WP output instances
            localServiceProxy.getJDOM (WP_OUTPUT_SERVICE, DELETE_REPORT_MAP_ROW_METHOD, getXMLString (paramsElement))
                    .getRootElement ();

            // Delete the Oracle Report output instances
            localServiceProxy.getJDOM (REPORTS_SERVICE, DELETE_REPORT_MAP_ROW_METHOD, getXMLString (paramsElement))
                    .getRootElement ();
        }
    } // mDeleteReportMapRows()

    /**
     * (non-Javadoc)
     * Utility function to convert XML to string.
     *
     * @param e the e
     * @return the XML string
     */
    private String getXMLString (final Element e)
    {
        return out.outputString (e);
    }

    /**
     * (non-Javadoc)
     * Utility function to determine if a string is empty.
     *
     * @param s the s
     * @return true, if successful
     */
    private boolean mIsEmpty (final String s)
    {
        return s == null || "".equals (s);
    } // mIsEmpty()

} // class AeEventUpdateHelper
