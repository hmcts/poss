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
package uk.gov.dca.caseman.ccbc_service.java;

import java.util.Iterator;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventConfigManager;
import uk.gov.dca.caseman.case_event_service.java.ICaseEventConfigDO;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.warrant_service.java.WarrantDefs;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: CCBCHelper.java
 * 
 * @author Chris hutt
 *         Created: 6 Jan 2006
 *         Description: Helper class for ccbc updates
 * 
 *         Change History:
 *         v1.0 06/01/06 Chris Hutt
 * 
 *         v1.1 17/01/06 Chris Hutt: Test for CreditorCode 1999 to establish that an MCOL case
 * 
 *         v1.2 31/01/06 Chris Hutt: Tmp_rep inserts added depending on
 *         1.CCBCCreateVariationOrder
 *         2.CCBCCreateCertOfSatisfaction
 * 
 * 
 *         v1.3 6/4/06 Chris Hutt: Code review defects: 3059, 3062, 3068 , 3066, 3064 , 3063, 3060
 * 
 *         v1.4 11/5/6 Chrs Hutt: Code review defects 3061, 3065
 *         v1.5 09/01/07 Phil Haferer: Modified postInsertCaseEventProcessing() to handle new
 *         configuration item "MCOLWriteOLSDataCheckCreditorCode".
 *         Also, modified postUpdateCaseProcessing() to only attempt to process the
 *         'AddressUpdated' and 'DateOfServiceUpdated' elements when it is actually present.
 *         Also, modified mGetWarrantNumberParams(), to change the parameter name from 'WarrantID'
 *         'warrantID', so that it matches that in the service being called.
 *         Also, modified mGetTypeForEvent(), to provide types for the events 250, 251, 256, and 620.
 *         Note also, identified that the WARRANT_NUMBER column on the MCOL_DATA table is 1 character
 *         too short.
 *         (TD TEMP_CASEMAN 3907: Maintain Case Events - MCOL Update for AoS event 38).
 * 
 *         02/05/07 Chris Hutt : Defect UCT_Group2 1368
 *         1. Add facility to delete TMP_REP row. Will be invoked
 *         when a Certificate of Satisfaction Event is put into error as via PostDeleteFlagUpdateProcessing
 *         2. Only insert a TMP_REP row if Wordprocessing not being called.
 * 
 *         11/05/07 Cert Of Satisfaction requires the caseEventSeq appended to TMP_REP.VALUE
 * 
 *         25/06/07 Chris Hutt : defect UCTGroup2 1371
 *         CCBC/MCOL case: Solicitor Address details changed.
 *         Look in /ds/ManageCase/Parties/Solicitor/ContactDetails/MCOLUpdateAddress.
 *         In used to be in /ds/ManageCase/Parties/Solicitor/ContactDetails/Address but the manage case server side xsl
 *         removes this for coded parties.
 *         28/06/2007 Chris Vincent: Group2 Defect 5129.
 *         Changes to MCOL Date of Service Change code - nodes were not in camel case like the client side
 *         and call to mAmendDateOfService was passing casepartynumber instead of casenumber.
 *         02/07/2007 Chris Vincent, change to mCaseEventMCOL for events 340 and 350 - the return_info column should
 *         be set to the court name of the destination court code - Group2 Defect 5136. Also removed reference
 *         to event 980 for MCOL Code CT as event 980 is a CO Event and also 170 for MCOL Code JR.
 *         05/07/2007 Chris Vincent, change to mAmendAddress() so that only the first 30 characters of the address lines
 *         are
 *         writtem to MCOL_DATA table. Group2 Defect 5158.
 *         05/07/2007 Chris Vincent, for MCOL code FR, set the return code and return info columns to the warrant return
 *         code
 *         and warrant return additional information respectively. Group2 Defect 5142.
 *         23/08/2007 Chris Vincent, change to mAmendAddress to re-fix Group2 Defect 5158. Now checks if length > 30
 *         before attempting
 *         to take the first 30 characters as failed if string < 30 chars.
 *         28/08/2007 Chris Hutt TD : Group2 5316:
 *         1. Add CaseEventSeq to MCOL_DATA.RETURN_INFO unless event id = 340, 350, 610, 620
 *         2. Methods mCaseEventDeleteMCOL amd mDeleteMCOL added and called
 *         05/12/2007 Chris Hutt TD: Prog Testing 1283
 *         Writing to TMP_REP table should be determined by the CASE court code.
 *         31/12/2007 Chris Vincent: CaseMan Defect 6476
 *         Change to mCaseEventMCOL method to prevent FR MCOL_DATA row being written if the warrant return is 147
 *         05/10/2009 Chris Vincent: change to mCaseEventMCOL to prevent MCOL_DATA row being written for a final return
 *         and the warrant is a reissued warrant with 8 digits. TRAC 1642.
 *         18/10/2013 Chris Vincent, Trac 4997. Multiple changes throughout for CCBC SDT.
 *         29/09/2014 Chris Vincent, Trac 5433. Added new events for transfer to MCOL.
 *         04/02/2015 Chris Vincent, Trac 5473. Multiple changes to enable JUDGMENT_REFERENCE and MCOL_REFERENCE columns
 *         on MCOL_DATA
 *         table to be populated. BIF Item 27.
 *         04/02/2015 Chris Vincent, Trac 5573. Changes to enable PAID_DATE column on MCOL_DATA table to be populated
 *         for case events 78 and 79.
 */
public class CCBCHelper
{

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;
    /**
     * System data service name.
     */
    public static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    /**
     * Get system date local method name.
     */
    public static final String GET_SYSTEM_DATE = "getSystemDateLocal";
    /**
     * Warrant Returns service name.
     */
    public static final String WARRANT_RETURN_SERVICE = "ejb/WarrantReturnsServiceLocal";
    /**
     * Get Warrant Return Data service.
     */
    public static final String GET_WARRANT_RETURN_DATA = "getWarrantReturnForMcolLocal";
    /**
     * Get Warrant Return Data service.
     */
    public static final String GET_WARRANT_RETURN_BY_EVENT_DATA = "getWarrantReturnForEventMcolLocal";
    /**
     * Get Warrant Return Data service.
     */
    public static final String GET_WARRANT_RETURN_BY_CASE_DATA = "getWarrantReturnForCaseMcolLocal";
    /**
     * Case Event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    
    /** Get court for case (variation). */
    public static final String GET_CASE_COURT_CODE_FOR_VARIATION = "getCaseCourtCodeForVariationLocal";
    
    /** Get MCOL Data Exists for Event. */
    public static final String GET_MCOL_DATA_EXISTS_FOR_EVENT = "getMcolDataExistsForEventLocal";
    
    /** Get court for case. */
    public static final String GET_CASE_COURT_CODE = "getCaseCourtCodeLocal";
    
    /** Get warrant returns case party numbers. */
    public static final String GET_WARRANT_CASE_PARTY_NOS = "getWarrantCasePartyNumbersLocal";
    
    /** Get judgment variation data. */
    public static final String GET_JUDGMENT_VARIATION_DATA = "getJudgmentVariationDataLocal";
    /**
     * Judgment service name.
     */
    public static final String JUDGMENT_SERVICE = "ejb/JudgmentServiceLocal";
    
    /** Get Judgment for MCOL data. */
    public static final String GET_JUDGMENT_FOR_MCOL_DATA = "getJudgmentForMcolDataLocal";
    
    /** Get Case Event 79 subject. */
    public static final String GET_CASE_EVENT_79_SUBJECT = "getCaseEvent79SubjectLocal";
    
    /** Get Case Event 160 details. */
    public static final String GET_CASE_EVENT_160_DETAILS = "getCaseEvent160DetailsLocal";
    
    /** Get Case Event 160 details no sequence. */
    public static final String GET_CASE_EVENT_160_DETAILS_NO_SEQ = "getCaseEvent160DetailsNoSeqLocal";

    /**
     * CCBC court code.
     */
    public static final String CCBC_COURT_CODE = "335";
    /**
     * mcol creditor code.
     */
    public static final String MCOL_CREDITOR_CODE = "1999";
    /**
     * Vary order report id.
     */
    public static final String VAR_ORDER_RPT_ID = "BC_ACO_R4";
    /**
     * Vary order parameter.
     */
    public static final String VAR_ORDER_PARAM = "VARY_SEQ";
    /**
     * Certificate of satisfaction report id.
     */
    public static final String CERT_OF_SATIS_RPT_ID = "BCACO_R6";
    /**
     * Certificate of satisfaction parameter.
     */
    public static final String CERT_OF_SATIS_PARAM = "CASE_DEFT_ID";

    /**
     * Constructor.
     */
    public CCBCHelper ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * Processing asociated with insert of a case event.
     *
     * @param pCaseEventElement Case event element
     * @throws SystemException System exception
     * @throws JDOMException JDOM Exception
     * @throws BusinessException Business Exception
     */
    public void postInsertCaseEventProcessing (final Element pCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        ICaseEventConfigDO caseEventConfigDO = null;
        final String courtCode = pCaseEventElement.getChildText ("CourtCode");
        String stdEventId = null;
        String creditorCode = null;
        Element navigateToWpElement = null;

        if (courtCode.equals (CCBC_COURT_CODE))
        {
            stdEventId = pCaseEventElement.getChildText ("StandardEventId");
            caseEventConfigDO = mGetCaseEventConfig (stdEventId);

            if (caseEventConfigDO.isMCOLWriteOLSData ())
            {
                if ( !caseEventConfigDO.isMCOLWriteOLSDataCheckCreditorCode ())
                {
                    mCaseEventMCOL (pCaseEventElement, false);
                }
                else
                {
                    creditorCode = pCaseEventElement.getChildText ("CreditorCode");
                    if (creditorCode.equals (MCOL_CREDITOR_CODE))
                    {
                        mCaseEventMCOL (pCaseEventElement, false);
                    }
                }
            }

            if (caseEventConfigDO.isCCBCCreateCertOfSatisfaction ())
            {
                navigateToWpElement = pCaseEventElement.getChild ("NavigateToWP");
                if (navigateToWpElement == null || navigateToWpElement.getText ().equals ("false"))
                {
                    mCaseEventCreateCertOfSatisfaction (pCaseEventElement);
                }

            }

            if (caseEventConfigDO.isCCBCCreateVariationOrder ())
            {
                mCaseEventCreateVariationOrder (pCaseEventElement);
            }
        }
    } // postInsertCaseEventProcessing

    /**
     * Processing asociated with updating a case event.
     *
     * @param pCaseEventElement the case event element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void postUpdateCaseEventProcessing (final Element pCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        ICaseEventConfigDO caseEventConfigDO = null;
        final String courtCode = pCaseEventElement.getChildText ("CourtCode");
        String caseCourtCode = pCaseEventElement.getChildText ("CaseCourtCode");
        if (caseCourtCode == null)
        {
            caseCourtCode = courtCode;
        }

        final String stdEventId = pCaseEventElement.getChildText ("StandardEventId");

        if (courtCode.equals (CCBC_COURT_CODE))
        {
            caseEventConfigDO = mGetCaseEventConfig (stdEventId);
            // Handle certificate of satisfaction
            if (caseEventConfigDO.isCCBCCreateCertOfSatisfaction ())
            {
                mCaseEventDeleteCertOfSatisfaction (pCaseEventElement);
            }
        }

        if (caseCourtCode.equals (CCBC_COURT_CODE))
        {
            if (caseEventConfigDO == null)
            {
                caseEventConfigDO = mGetCaseEventConfig (stdEventId);
            }

            // Handle MCOL updates
            if (caseEventConfigDO.isMCOLWriteOLSData () && pCaseEventElement.getChildText ("DeletedFlag") != null &&
                    pCaseEventElement.getChildText ("DeletedFlag").equals ("Y"))
            {

                // Event being marked in error. Certain events will require an mcol_data delete
                if ( !stdEventId.equals ("340") && !stdEventId.equals ("350"))
                {
                    mCaseEventDeleteMCOL (pCaseEventElement);
                }
            }

        }
    } // postUpdateCaseEventProcessing

    /**
     * Processing asociated with updating a warrant return.
     *
     * @param pWarrantEventElement Warrant Event element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void postUpdateWarrantEventProcessing (final Element pWarrantEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        String courtCode = null;
        final String warrantReturnCode = pWarrantEventElement.getChildText ("Code");
        String warrantNumber = null;
        final String warrantId = pWarrantEventElement.getChildText ("WarrantID");
        final String errorFlag = pWarrantEventElement.getChildText ("Error");
        final String caseNumber = pWarrantEventElement.getChildText ("CaseNumber");
        final String additionalInfo = pWarrantEventElement.getChildText ("AdditionalDetails");
        final String returnType = pWarrantEventElement.getChildText ("ReturnType");
        final String eventDate = mGetSystemDate ();
        final String defendantId = pWarrantEventElement.getChildText ("Defendant");
        String subjectCasePartyNumber = null;

        if (returnType.equals ("F") && errorFlag.equals ("Y") && !warrantReturnCode.equals ("147") &&
                !warrantReturnCode.equals ("156"))
        {
            // Final return (not 147 or 156) has been errored
            courtCode = mGetCaseCourtCode (caseNumber);
            if (courtCode != null && courtCode.equals (CCBC_COURT_CODE))
            {
                // Case is owned by CCBC, provided not a reissued warrant, write a new MCOL_DATA row
                warrantNumber = mGetWarrantNumber (warrantId);
                if (warrantNumber.length () > 7 && warrantNumber.indexOf ("/") != -1)
                {
                    // Do not attempt to add an MCOL_DATA row on a Reissued Warrant
                    return;
                }

                subjectCasePartyNumber = mGetWarrantReturnSubjectNumber (warrantNumber, defendantId);

                final McolDataXMLBuilder builder = new McolDataXMLBuilder (caseNumber, /* ClaimNumber */
                        subjectCasePartyNumber, /* PartyNumber */
                        "F0", /* Type */
                        eventDate, /* EventDate */
                        "", /* rejectCode */
                        warrantNumber, /* WarrantNumber */
                        warrantReturnCode, /* ReturnCode */
                        additionalInfo, /* ReturnInfo */
                        "", /* Addr1 */
                        "", /* Addr2 */
                        "", /* Addr3 */
                        "", /* Addr4 */
                        "", /* Addr5 */
                        "", /* PostCode */
                        "", /* DateSent */
                        "", /* PreviousCreditor */
                        "", /* NewCreditor */
                        "", /* JudgmentType */
                        "", /* JointJudgment */
                        "", /* Total */
                        "", /* InstalmentAmount */
                        "", /* Frequency */
                        "", /* FirstPaymentDate */
                        "", /* McolReference */
                        "", /* JudgmentReference */
                        "" /* PaidDate */ );

                mInsertMCOL (builder); // Insert row into table used by batch processing
            }
        }

    } // postUpdateWarrantEventProcessing

    /**
     * Handles the creation of Judgment Entered (JE) MCOL notifications.
     *
     * @param pCaseEventElement The Case Event element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void judgmentEventEnteredMCOLProcessing (final Element pCaseEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        final String courtCode = pCaseEventElement.getChildText ("OwningCourt");
        final String caseNumber = pCaseEventElement.getChildText ("CaseNumber");
        final String subjectCasePartyNumber = pCaseEventElement.getChildText ("CasePartyNumber");
        final String eventId = pCaseEventElement.getChildText ("StdEventId");
        final String eventSeq = pCaseEventElement.getChildText ("CaseEventSeq");
        Element judgmentDataElement = null;
        String judgmentType = "";
        String jointJudgment = "";
        String total = "";
        String instalmentAmount = "";
        String frequency = "";
        String firstPaymentDate = "";
        String judgmentDate = "";
        final String mcolReference = "CJ" + pCaseEventElement.getChildText ("JudgmentSeq");

        if (courtCode.equals (CCBC_COURT_CODE) &&
                (eventId.equals ("230") || eventId.equals ("240") || eventId.equals ("250") || eventId.equals ("251")))
        {
            // Judgment entered from an event 230, 240, 250 or 251 on a CCBC owned case
            // Retrieve additional judgment data
            judgmentDataElement = mGetJudgmentData (pCaseEventElement.getChildText ("JudgmentSeq"));
            judgmentType = judgmentDataElement.getChildText ("Type");
            jointJudgment = judgmentDataElement.getChildText ("JointJudgment");
            total = judgmentDataElement.getChildText ("Total");
            instalmentAmount = judgmentDataElement.getChildText ("InstalmentAmount");
            frequency = judgmentDataElement.getChildText ("Frequency");
            firstPaymentDate = judgmentDataElement.getChildText ("FirstPaymentDate");
            judgmentDate = judgmentDataElement.getChildText ("JudgmentDate");

            // Create MCOL Data row
            final McolDataXMLBuilder builder = new McolDataXMLBuilder (caseNumber, /* ClaimNumber */
                    subjectCasePartyNumber, /* PartyNumber */
                    "JE", /* Type */
                    judgmentDate, /* EventDate */
                    "", /* rejectCode */
                    "", /* WarrantNumber */
                    "", /* ReturnCode */
                    eventSeq, /* ReturnInfo */
                    "", /* Addr1 */
                    "", /* Addr2 */
                    "", /* Addr3 */
                    "", /* Addr4 */
                    "", /* Addr5 */
                    "", /* PostCode */
                    "", /* DateSent */
                    "", /* PreviousCreditor */
                    "", /* NewCreditor */
                    judgmentType, /* JudgmentType */
                    jointJudgment, /* JointJudgment */
                    total, /* Total */
                    instalmentAmount, /* InstalmentAmount */
                    frequency, /* Frequency */
                    firstPaymentDate, /* FirstPaymentDate */
                    mcolReference, /* McolReference */
                    mcolReference, /* JudgmentReference */
                    "" /* PaidDate */ );

            mInsertMCOL (builder); // Insert row into table used by batch processing
        }

    } // judgmentEventEnteredMCOLProcessing

    /**
     * Handles the writing of an MCOL_DATA row for CCBC cases where the application to vary has been
     * set to REFUSED.
     *
     * @param pJudgmentElement Judgment Element
     * @param pCaseNumber the case number
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void appToVaryResultRefusedMCOLProcessing (final Element pJudgmentElement, final String pCaseNumber)
        throws SystemException, JDOMException, BusinessException
    {
        final String subjectCasePartyNumber = pJudgmentElement.getChildText ("CasePartyNumber");
        final String subjectCasePartyRole = pJudgmentElement.getChildText ("PartyRoleCode");
        String eventDate = "";

        if (subjectCasePartyRole.equals ("DEFENDANT"))
        {
            // Ignore Judgments against Claimants, only interested in Judgments against Defendants
            final String courtCode = mGetCaseCourtCode (pCaseNumber);
            if (courtCode != null && courtCode.equals (CCBC_COURT_CODE))
            {
                // CCBC owned case, create MCOL row
                eventDate = mGetSystemDate ();
                final McolDataXMLBuilder builder = new McolDataXMLBuilder (pCaseNumber, /* ClaimNumber */
                        subjectCasePartyNumber, /* PartyNumber */
                        "V0", /* Type */
                        eventDate, /* EventDate */
                        "", /* rejectCode */
                        "", /* WarrantNumber */
                        "", /* ReturnCode */
                        "", /* ReturnInfo */
                        "", /* Addr1 */
                        "", /* Addr2 */
                        "", /* Addr3 */
                        "", /* Addr4 */
                        "", /* Addr5 */
                        "", /* PostCode */
                        "", /* DateSent */
                        "", /* PreviousCreditor */
                        "", /* NewCreditor */
                        "", /* JudgmentType */
                        "", /* JointJudgment */
                        "", /* Total */
                        "", /* InstalmentAmount */
                        "", /* Frequency */
                        "", /* FirstPaymentDate */
                        "", /* McolReference */
                        "", /* JudgmentReference */
                        "" /* PaidDate */ );

                mInsertMCOL (builder); // Insert row into table used by batch processing
            }
        }

    } // appToVaryResultRefusedMCOLProcessing

    /**
     * Handles the writing of an MCOL_DATA row for CCBC cases where the application to set aside has been
     * set to REFUSED.
     *
     * @param pJudgmentElement Judgment Element
     * @param pCaseNumber the case number
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void appToSetAsideResultRefusedMCOLProcessing (final Element pJudgmentElement, final String pCaseNumber)
        throws SystemException, JDOMException, BusinessException
    {

        final String subjectCasePartyNumber = pJudgmentElement.getChildText ("CasePartyNumber");
        final String subjectCasePartyRole = pJudgmentElement.getChildText ("PartyRoleCode");
        String judgmentReference = pJudgmentElement.getChildText ("MCOLReference");
        if (judgmentReference.equals (""))
        {
            judgmentReference = "CJ" + pJudgmentElement.getChildText ("JudgmentId");
        }
        String eventDate = "";

        final Element appSetAsideElement = (Element) XPath.selectSingleNode (pJudgmentElement,
                "//ApplicationsToSetAside/Application[ASAUpdated = 'Y']");
        String mcolReference = appSetAsideElement.getChildText ("MCOLReference");
        if (mcolReference.equals (""))
        {
            if (appSetAsideElement.getChildText ("Id").equals (""))
            {
                // No Id present, try and source the information about event 160 the hard way
                final Element event160Details = mGetEvent160DetailsNoSeq (appSetAsideElement,
                        pJudgmentElement.getChildText ("JudgmentId"), pCaseNumber);
                mcolReference = event160Details.getChildText ("MCOLReference");
            }
            else
            {
                // Id is present, use it to generate the MCOL Reference
                mcolReference = "CE" + appSetAsideElement.getChildText ("Id");
            }
        }

        if (subjectCasePartyRole.equals ("DEFENDANT"))
        {
            // Ignore Judgments against Claimants, only interested in Judgments against Defendants
            final String courtCode = mGetCaseCourtCode (pCaseNumber);
            if (courtCode != null && courtCode.equals (CCBC_COURT_CODE))
            {
                // CCBC owned case, create MCOL row
                eventDate = mGetSystemDate ();
                final McolDataXMLBuilder builder = new McolDataXMLBuilder (pCaseNumber, /* ClaimNumber */
                        subjectCasePartyNumber, /* PartyNumber */
                        "X0", /* Type */
                        eventDate, /* EventDate */
                        "", /* rejectCode */
                        "", /* WarrantNumber */
                        "", /* ReturnCode */
                        "", /* ReturnInfo */
                        "", /* Addr1 */
                        "", /* Addr2 */
                        "", /* Addr3 */
                        "", /* Addr4 */
                        "", /* Addr5 */
                        "", /* PostCode */
                        "", /* DateSent */
                        "", /* PreviousCreditor */
                        "", /* NewCreditor */
                        "", /* JudgmentType */
                        "", /* JointJudgment */
                        "", /* Total */
                        "", /* InstalmentAmount */
                        "", /* Frequency */
                        "", /* FirstPaymentDate */
                        mcolReference, /* McolReference */
                        judgmentReference, /* JudgmentReference */
                        "" /* PaidDate */ );

                mInsertMCOL (builder); // Insert row into table used by batch processing
            }
        }
    } // judgmentEventEnteredMCOLProcessing

    /**
     * (non-Javadoc)
     * Create a variation order associated with case events.
     *
     * @param pCaseEventElement the case event element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void mCaseEventCreateVariationOrder (final Element pCaseEventElement)
        throws SystemException, BusinessException, JDOMException
    {
        final String userName = pCaseEventElement.getChildText ("UserName");
        final String varySeq = pCaseEventElement.getChildText ("VarySeq");
        final String courtCode = mGetCaseCourtCodeForVariation (varySeq);

        if (courtCode.equals (CCBC_COURT_CODE))
        {

            final TmpRepXMLBuilder builder = new TmpRepXMLBuilder (VAR_ORDER_RPT_ID, /* parameter */
                    userName, /* user */
                    VAR_ORDER_PARAM, /* Parameter */
                    varySeq, /* Value */
                    "", /* JobNumber */
                    "" /* TimeStamp */ );
            mInsertTmpRep (builder); // Insert row into table used by batch processing
        }
    }

    /**
     * (non-Javadoc)
     * create a Certificate of Satisfaction associated with Case Event.
     *
     * @param pCaseEventElement the case event element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void mCaseEventCreateCertOfSatisfaction (final Element pCaseEventElement)
        throws SystemException, BusinessException, JDOMException
    {
        final String caseNumber = pCaseEventElement.getChildText ("CaseNumber");
        final String courtCode = mGetCaseCourtCode (caseNumber);

        if (courtCode != null && courtCode.equals (CCBC_COURT_CODE))
        {

            final String userName = pCaseEventElement.getChildText ("UserName");

            final String subjectCasePartyNumber = pCaseEventElement.getChildText ("SubjectCasePartyNumber");
            final String caseEventSeq = pCaseEventElement.getChildText ("CaseEventSeq");

            final String value = caseNumber + " " + subjectCasePartyNumber + " " + caseEventSeq;

            final TmpRepXMLBuilder builder = new TmpRepXMLBuilder (CERT_OF_SATIS_RPT_ID, /* reportId */
                    userName, /* user */
                    CERT_OF_SATIS_PARAM, /* Parameter */
                    value, /* Value */
                    "", /* JobNumber */
                    "" /* TimeStamp */ );

            mInsertTmpRep (builder); // Insert row into table used by batch processing
        }

    } // mCaseEventCreateCertOfSatisfaction

    /**
     * (non-Javadoc)
     * delete a MCOL_DATA associated with Case Event.
     *
     * @param pCaseEventElement the case event element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void mCaseEventDeleteMCOL (final Element pCaseEventElement)
        throws SystemException, BusinessException, JDOMException
    {
        final String stdEventId = pCaseEventElement.getChildText ("StandardEventId");
        final String caseEventSeq = pCaseEventElement.getChildText ("CaseEventSeq");
        final String mcolDataExists = mMcolMessageExists (caseEventSeq);

        if (mcolDataExists.equals ("true"))
        {
            // Record still in MCOL_DATA table, physically remove it
            mDeleteMCOL (caseEventSeq);
        }
        else
        {
            if (stdEventId.equals ("38") || stdEventId.equals ("50") || stdEventId.equals ("52") ||
                    stdEventId.equals ("60") || stdEventId.equals ("103") || stdEventId.equals ("140") ||
                    stdEventId.equals ("150") || stdEventId.equals ("155") || stdEventId.equals ("160") ||
                    stdEventId.equals ("170") || stdEventId.equals ("196") || stdEventId.equals ("197") ||
                    stdEventId.equals ("333") || stdEventId.equals ("620"))
            {
                // Add a new MCOL_DATA row indicating the event has been errored
                mCaseEventMCOL (pCaseEventElement, true);
            }
        }
    } // mCaseEventDeleteMCOL

    /**
     * (non-Javadoc)
     * delete a Certificate of Satisfaction associated with Case Event.
     *
     * @param pCaseEventElement the case event element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mCaseEventDeleteCertOfSatisfaction (final Element pCaseEventElement)
        throws SystemException, BusinessException
    {
        final String caseNumber = pCaseEventElement.getChildText ("CaseNumber");
        final String subjectCasePartyNumber = pCaseEventElement.getChildText ("SubjectCasePartyNumber");

        final String value = caseNumber + " " + subjectCasePartyNumber;

        mDeleteTmpRep (CERT_OF_SATIS_RPT_ID, value); // delete a row from the table used by batch processing

    } // mCaseEventDeleteCertOfSatisfaction

    /**
     * (non-Javadoc)
     * Insert MCOL_DATA where appropriate on insert of a case event.
     *
     * @param pCaseEventElement the case event element
     * @param pErroredEvent true if creating MCOL_DATA for an event erroring, else false
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mCaseEventMCOL (final Element pCaseEventElement, final boolean pErroredEvent)
        throws SystemException, JDOMException, BusinessException
    {

        String warrantId = "";
        String warrantNumber = "";
        final String stdEventId = pCaseEventElement.getChildText ("StandardEventId");
        final String caseNumber = pCaseEventElement.getChildText ("CaseNumber");
        String eventDate = pCaseEventElement.getChildText ("EventDate");
        String subjectCasePartyNumber = pCaseEventElement.getChildText ("SubjectCasePartyNumber");
        String subjectPartyRoleCode = pCaseEventElement.getChildText ("SubjectPartyRoleCode");
        final String caseEventSeq = pCaseEventElement.getChildText ("CaseEventSeq");
        final String type = pErroredEvent ? mGetTypeForEventError (stdEventId) : mGetTypeForEvent (stdEventId);
        String returnInfo = "";
        String returnCode = "";
        Element warrantReturnData = null;
        String instalmentAmount = "";
        String frequency = "";
        String firstPaymentDate = "";
        String paidDate = "";
        Element variationData = null;
        Element event79SubjectData = null;
        Element event160Details = null;
        final String creditorCode = pCaseEventElement.getChildText ("CreditorCode");
        String mcolReference = "";
        String judgmentReference = "";
        Element judgmentDataElement = null;

        // Check Judgment events
        if (type.equals ("V1") || type.equals ("V0") || type.equals ("VG") || type.equals ("VR") ||
                type.equals ("X1") || type.equals ("X0") || type.equals ("XG") || type.equals ("XR"))
        {
            if ( !subjectPartyRoleCode.equals ("DEFENDANT"))
            {
                // Judgments that are not against Defendants should not write to MCOL
                return;
            }
        }

        // Populate MCOL_REFERENCE and JUDGMENT_REFERENCE
        if (type.equals ("X1") || type.equals ("X0") || type.equals ("XG") || type.equals ("XR"))
        {
            judgmentDataElement = mGetJudgmentData (pCaseEventElement.getChildText ("JudgmentSeq"));
            judgmentReference = judgmentDataElement.getChildText ("JudgmentReference");

            if (type.equals ("X1"))
            {
                // CaseMan created case event 160, generate a CaseMan MCOL reference
                mcolReference = "CE" + caseEventSeq;
            }
            else if (type.equals ("X0"))
            {
                mcolReference = pCaseEventElement.getChildText ("MCOLReference");
                if (mcolReference.equals (""))
                {
                    mcolReference = "CE" + caseEventSeq;
                }
            }
            else if (type.equals ("XG") || type.equals ("XR"))
            {
                // Case event 170, lookup the MCOL reference of the associated event 160
                event160Details = mGetEvent160Details (caseEventSeq);
                mcolReference = event160Details.getChildText ("MCOLReference");
            }
        }

        if (pErroredEvent)
        {
            // For errored events, use the system date as the MCOL_DATA event date
            eventDate = mGetSystemDate ();
        }

        if (type.equals ("FR") || type.equals ("WI") || type.equals ("F0"))
        {
            // MCOL Codes FR and WI should write the warrant number
            warrantId = pCaseEventElement.getChildText ("WarrantId");
            warrantNumber = mGetWarrantNumber (warrantId);
        }

        if (type.equals ("FR") || type.equals ("F0"))
        {
            // MCOL Code FR needs to set the return info and return code based on the warrant return
            // Additional Information and Return Code values.
            if (type.equals ("FR"))
            {
                // When adding, will know the warrant return id
                warrantReturnData = mGetWarrantReturnData (pCaseEventElement.getChildText ("WarrantReturnId"));
            }
            else
            {
                // When updating, need to look up warrant return data using event sequence
                warrantReturnData = mGetWarrantReturnDataByEventSeq (pCaseEventElement.getChildText ("CaseEventSeq"));
                if (warrantReturnData == null)
                {
                    // Unable to find warrant return using event sequence so search using other parameters
                    warrantReturnData = mGetWarrantReturnDataByCase (pCaseEventElement.getChildText ("EventDate"),
                            caseNumber, warrantNumber);
                }
            }

            if (warrantReturnData == null)
            {
                // Unable to retrieve the warrant return data so exit, i.e. no MCOL_DATA will be written
                return;
            }

            returnInfo = warrantReturnData.getChildText ("AdditionalInformation");
            returnCode = warrantReturnData.getChildText ("ReturnCode");
            if (returnCode.equals ("147") || returnCode.equals ("156"))
            {
                // MCOL not interested in warrant returns 147 or 156
                return;
            }

            if (warrantNumber.length () > 7 && warrantNumber.indexOf ("/") != -1)
            {
                // TRAC 1642 - do not attempt to add an MCOL_DATA row on a Reissued Warrant
                return;
            }
        }

        if (type.equals ("CT"))
        {
            // For events 340 and 350 (transfer out), need to set the MCOL_DATA.RETURN_INFO to the new
            // court name. This can be found in the event details which has the form:
            // 'To [COURT NAME] Jurisdiction change, old case type ...'
            // The Jurisdiction change part is only present if the case type has changed via the transfer screen.
            final String eventDetails = pCaseEventElement.getChildText ("EventDetails");
            final int endIndex = eventDetails.indexOf (" Jurisdiction");
            if (endIndex == -1)
            {
                // No jurisdiction change, take court name to end of String
                returnInfo = eventDetails.substring (3);
            }
            else
            {
                // Jurisdiction change, need court name from middle of string
                returnInfo = eventDetails.substring (3, endIndex);
            }
        }

        if (type.equals ("VG"))
        {
            // For Application to Vary events, need to populate additional judgment data for MCOL
            variationData = mGetJudgmentVariationData (pCaseEventElement.getChildText ("CaseEventSeq"));
            if (variationData != null)
            {
                instalmentAmount = variationData.getChildText ("InstalmentAmount");
                frequency = variationData.getChildText ("Frequency");
                firstPaymentDate = variationData.getChildText ("FirstPaymentDate");
            }
        }

        if (stdEventId.equals ("78"))
        {
            // For event 78 (Paid Before Judgment), use the event date as the paid in full date
            paidDate = eventDate;
        }

        if (stdEventId.equals ("79"))
        {
            // Need to have a case party number for event 79. If it's blank, it means that subject is CASE
            if (subjectCasePartyNumber.equals (""))
            {
                event79SubjectData = mGetEvent79Subject (pCaseEventElement.getChildText ("CaseEventSeq"));
                subjectCasePartyNumber = event79SubjectData.getChildText ("CasePartyNo");
                subjectPartyRoleCode = event79SubjectData.getChildText ("PartyRoleCode");
            }

            if ( !subjectPartyRoleCode.equals ("DEFENDANT"))
            {
                // Do not record MCOL notification if the Judgment is not against a Defendant
                return;
            }

            // For event 79 (Paid After Judgment), get the judgment paid in full date
            judgmentDataElement = mGetJudgmentData (pCaseEventElement.getChildText ("JudgmentSeq"));
            paidDate = judgmentDataElement.getChildText ("PaidInFullDate");
        }

        if (stdEventId.equals ("197"))
        {
            // Case Event 197 can be created against the claimant so for anything other than the defendant,
            // do not send a case party number.
            if ( !subjectPartyRoleCode.equals ("DEFENDANT"))
            {
                subjectCasePartyNumber = "";
            }
        }

        // If Event not an errored event, is not a transfer event and not a final return event, then populate
        // return_info with case event sequence no.
        if ( !pErroredEvent && !type.equals ("CT") && !type.equals ("FR") && !type.equals ("F0") &&
                returnInfo.equals (""))
        {
            returnInfo = caseEventSeq;
        }

        final McolDataXMLBuilder builder = new McolDataXMLBuilder (caseNumber, /* ClaimNumber */
                subjectCasePartyNumber, /* PartyNumber */
                type, /* Type */
                eventDate, /* EventDate */
                "", /* rejectCode */
                warrantNumber, /* WarrantNumber */
                returnCode, /* ReturnCode */
                returnInfo, /* ReturnInfo */
                "", /* Addr1 */
                "", /* Addr2 */
                "", /* Addr3 */
                "", /* Addr4 */
                "", /* Addr5 */
                "", /* PostCode */
                "", /* DateSent */
                "", /* PreviousCreditor */
                creditorCode, /* NewCreditor */
                "", /* JudgmentType */
                "", /* JointJudgment */
                "", /* Total */
                instalmentAmount, /* InstalmentAmount */
                frequency, /* Frequency */
                firstPaymentDate, /* FirstPaymentDate */
                mcolReference, /* McolReference */
                judgmentReference, /* JudgmentReference */
                paidDate /* PaidDate */ );

        mInsertMCOL (builder); // Insert row into table used by batch processing
    }

    /**
     * Processing asociated with case update
     * The amendment of the following party details will require an MCOL update (if an MCOL case)
     * 1.Claimant/Def address - ONLY DEF ADDRESS IN SDT
     * 2.Def date of service
     * 3.Claimant Solicitor Address - REDUNDANT IN SDT
     *
     * @param pManageCaseDoc the manage case doc
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void postUpdateCaseProcessing (final Document pManageCaseDoc)
        throws SystemException, JDOMException, BusinessException
    {
        Element addressElement = null;
        String type = null;
        String caseNumber = null;
        Element dateOfServiceUpdatedElement = null;
        String dateOfServiceUpdated = null;
        Element addressUpdatedElement = null;
        String addressUpdated = null;
        String typeCode = null;
        Element litPartyElement = null;
        String casePartyNumber = null;
        String dateOfService = null;

        final String courtCode =
                ((Element) XPath.selectSingleNode (pManageCaseDoc, "/ds/ManageCase/OwningCourtCode")).getText ();
        if (courtCode.equals (CCBC_COURT_CODE))
        {
            // Found a CCBC Case
            caseNumber = ((Element) XPath.selectSingleNode (pManageCaseDoc, "/ds/ManageCase/CaseNumber")).getText ();

            // Litiguous Party Addresses and Defendants Date Of Service
            final List<Element> litPartyList = XPath.selectNodes (pManageCaseDoc, "/ds/ManageCase/Parties/LitigiousParty");
            final Iterator<Element> it = litPartyList.iterator ();
            while (it.hasNext ())
            {
                // Now we have a Litiguous Party
                litPartyElement = (Element) it.next ();
                typeCode = litPartyElement.getChildText ("TypeCode");
                casePartyNumber = litPartyElement.getChildText ("Number");

                // Address Updates
                addressUpdatedElement = litPartyElement.getChild ("AddressUpdated");
                if (addressUpdatedElement != null)
                {
                    addressUpdated = addressUpdatedElement.getText ();
                    if (addressUpdated.equals ("Y"))
                    {
                        addressElement = litPartyElement.getChild ("ContactDetails").getChild ("Address");

                        if (typeCode.equals ("DEFENDANT"))
                        {
                            type = "DA";
                            mAmendAddress (addressElement, caseNumber, casePartyNumber, type);
                        }
                    }
                } // if (addressUpdatedElement != null)
                // Date of service Updates (for a defendant)
                dateOfServiceUpdatedElement = litPartyElement.getChild ("DateOfServiceUpdated");
                if (dateOfServiceUpdatedElement != null)
                {
                    dateOfServiceUpdated = dateOfServiceUpdatedElement.getText ();
                    if (typeCode.equals ("DEFENDANT") && dateOfServiceUpdated.equals ("Y"))
                    {
                        dateOfService = litPartyElement.getChildText ("DateOfService");
                        type = "DS";
                        mAmendDateOfService (caseNumber, casePartyNumber, type, dateOfService);
                    }
                }
            } // end of litiguous party loop

        } // if (courtCode.equals(CCBC_COURT_CODE))
    }

    /**
     * (non-Javadoc)
     * case details update: date of service.
     *
     * @param pCaseNumber the case number
     * @param pCasePartyNumber the case party number
     * @param pType the type
     * @param pDateOfService the date of service
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mAmendDateOfService (final String pCaseNumber, final String pCasePartyNumber, final String pType,
                                      final String pDateOfService)
        throws SystemException, BusinessException
    {

        final McolDataXMLBuilder builder = new McolDataXMLBuilder (pCaseNumber, /* ClaimNumber */
                pCasePartyNumber, /* PartyNumber */
                pType, /* Type */
                pDateOfService, /* EventDate */
                "", /* rejectCode */
                "", /* WarrantNumber */
                "", /* ReturnCode */
                "", /* ReturnInfo */
                "", /* Addr1 */
                "", /* Addr2 */
                "", /* Addr3 */
                "", /* Addr4 */
                "", /* Addr5 */
                "", /* PostCode */
                "", /* DateSent */
                "", /* PreviousCreditor */
                "", /* NewCreditor */
                "", /* JudgmentType */
                "", /* JointJudgment */
                "", /* Total */
                "", /* InstalmentAmount */
                "", /* Frequency */
                "", /* FirstPaymentDate */
                "", /* McolReference */
                "", /* JudgmentReference */
                "" /* PaidDate */ );

        mInsertMCOL (builder); // Insert row into table used by batch processing
    }

    /**
     * (non-Javadoc)
     * case details update: address.
     *
     * @param pAddressElement the address element
     * @param pCaseNumber the case number
     * @param pCasePartyNumber the case party number
     * @param pType the type
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mAmendAddress (final Element pAddressElement, final String pCaseNumber, final String pCasePartyNumber,
                                final String pType)
        throws SystemException, BusinessException
    {

        String addr1 = null;
        String addr2 = null;
        String addr3 = null;
        String addr4 = null;
        String addr5 = null;
        String postCode = null;
        String eventDate = null;
        Element lineElement = null;
        int lineCount = 0;

        // Extract each 'Line' of address - only the first 30 characters (Group2 Defect 5158)
        final List<Element> addrLineList = pAddressElement.getChildren ("Line");
        final Iterator<Element> it = addrLineList.iterator ();
        while (it.hasNext ())
        {
            // Now we have an address line.
            lineElement = (Element) it.next ();
            final String addressString = lineElement.getText ().length () > 30
                    ? lineElement.getText ().substring (0, 30) : lineElement.getText ();
            lineCount++;
            switch (lineCount)
            {
                case 1:
                    addr1 = addressString;
                    break;
                case 2:
                    addr2 = addressString;
                    break;
                case 3:
                    addr3 = addressString;
                    break;
                case 4:
                    addr4 = addressString;
                    break;
                case 5:
                    addr5 = addressString;
                    break;
            }
        }
        postCode = pAddressElement.getChildText ("PostCode");

        eventDate = mGetSystemDate ();

        final McolDataXMLBuilder builder = new McolDataXMLBuilder (pCaseNumber, /* ClaimNumber */
                pCasePartyNumber, /* PartyNumber */
                pType, /* Type */
                eventDate, /* EventDate */
                "", /* rejectCode */
                "", /* WarrantNumber */
                "", /* ReturnCode */
                "", /* ReturnInfo */
                addr1, /* Addr1 */
                addr2, /* Addr2 */
                addr3, /* Addr3 */
                addr4, /* Addr4 */
                addr5, /* Addr5 */
                postCode, /* PostCode */
                "", /* DateSent */
                "", /* PreviousCreditor */
                "", /* NewCreditor */
                "", /* JudgmentType */
                "", /* JointJudgment */
                "", /* Total */
                "", /* InstalmentAmount */
                "", /* Frequency */
                "", /* FirstPaymentDate */
                "", /* McolReference */
                "", /* JudgmentReference */
                "" /* PaidDate */ );

        mInsertMCOL (builder); // Insert row into table used by batch processing

    }

    /**
     * (non-Javadoc)
     * Add a row to the TMP_REP table in anticipation of transfer via batch processing.
     *
     * @param builder the builder
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mInsertTmpRep (final TmpRepXMLBuilder builder) throws SystemException, BusinessException
    {

        Element tmpRepParamsElement = null;
        Element tmpRepElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        tmpRepElement = builder.getXMLElement ("TmpRep");

        tmpRepParamsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (tmpRepParamsElement, "TmpRep", tmpRepElement);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (tmpRepParamsElement);

        localServiceProxy.getJDOM (CcbcDefs.CCBC_SERVICE, CcbcDefs.INSERT_TMP_REP, sXmlParams);

    } // mInsertTmpRep()

    /**
     * (non-Javadoc)
     * Remove a row to the TMP_REP table prior to transfer via batch processing.
     *
     * @param pReportId the report id
     * @param pValue the value
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteTmpRep (final String pReportId, final String pValue) throws SystemException, BusinessException
    {

        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "ReportId", pReportId);
        XMLBuilder.addParam (paramsElement, "Value", pValue);

        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        localServiceProxy.getJDOM (CcbcDefs.CCBC_SERVICE, CcbcDefs.DELETE_TMP_REP, sXmlParams);

    } // mDeleteTmpRep()

    /**
     * M delete MCOL.
     *
     * @param pCaseEventSeq the case event seq
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteMCOL (final String pCaseEventSeq) throws SystemException, BusinessException
    {

        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseEventSeq", pCaseEventSeq);

        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        localServiceProxy.getJDOM (CcbcDefs.CCBC_SERVICE, CcbcDefs.DELETE_MCOL_DATA, sXmlParams);

    } // mDeleteTmpRep()

    /**
     * (non-Javadoc)
     * Add a row to the MCOL_DATA table in anticipation of transfer via batch processing.
     *
     * @param builder the builder
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mInsertMCOL (final McolDataXMLBuilder builder) throws SystemException, BusinessException
    {
        Element mcolParamsElement = null;
        Element mcolElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        mcolElement = builder.getXMLElement ("MCOL");

        mcolParamsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (mcolParamsElement, "MCOL", mcolElement);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (mcolParamsElement);

        localServiceProxy.getJDOM (CcbcDefs.CCBC_SERVICE, CcbcDefs.INSERT_MCOL_DATA, sXmlParams);

    } // mInsertMCOL()

    /**
     * (non-Javadoc)
     * Retrieve config associated with a case event.
     *
     * @param pStdEventId the std event id
     * @return the i case event config DO
     * @throws SystemException the system exception
     */
    private ICaseEventConfigDO mGetCaseEventConfig (final String pStdEventId) throws SystemException
    {
        ICaseEventConfigDO caseEventConfigDO = null;
        CaseEventConfigManager caseEventConfigManager = null;

        final int standardEventId = Integer.parseInt (pStdEventId);

        // Retrieve the configuration data object associated with the standard Event id.
        caseEventConfigManager = CaseEventConfigManager.getInstance ();
        caseEventConfigDO = caseEventConfigManager.getCaseEventConfigDO (standardEventId);

        return caseEventConfigDO;

    } // mGetCaseEventConfig()

    /**
     * (non-Javadoc)
     * Get list of 'Types' associated with a case event for purposes of an MCOL update.
     *
     * @param pEventId the event id
     * @return the string
     */
    private String mGetTypeForEvent (final String pEventId)
    {

        final int standardEventId = Integer.parseInt (pEventId);
        String type = "";

        switch (standardEventId)
        {

            case 38:
                type = "AS";
                break;

            case 340:
            case 350:
                type = "CT";
                break;

            case 52:
                type = "DC";
                break;

            case 50:
                type = "DE";
                break;

            case 230:
            case 240:
            case 250:
            case 251:
                type = "JE";
                break;

            case 60:
                type = "PA";
                break;

            case 380:
                type = "WI";
                break;

            case 620:
                type = "FR";
                break;

            case 57:
                type = "DK";
                break;

            case 72:
                type = "K1";
                break;

            case 73:
            case 76:
                type = "WD";
                break;

            case 74:
                type = "DI";
                break;

            case 78:
            case 79:
                type = "MP";
                break;

            case 103:
                type = "LC";
                break;

            case 140:
                type = "V1";
                break;

            case 150:
            case 155:
                type = "VG";
                break;

            case 160:
                type = "X1";
                break;

            case 170:
                type = "XG";
                break;

            case 196:
                type = "LD";
                break;

            case 197:
                type = "LE";
                break;

            case 333:
                type = "LF";
                break;

        }
        return type;
    } // mGetTypeForEvent

    /**
     * (non-Javadoc)
     * Get list of 'Types' associated with a case event errors for purposes of an MCOL update.
     *
     * @param pEventId The event id
     * @return two character string representing the MCOL code
     */
    private String mGetTypeForEventError (final String pEventId)
    {

        final int standardEventId = Integer.parseInt (pEventId);
        String type = "";

        switch (standardEventId)
        {

            case 38:
                type = "A0";
                break;

            case 52:
                type = "D0";
                break;

            case 50:
                type = "E0";
                break;

            case 60:
                type = "P0";
                break;

            case 103:
                type = "L3";
                break;

            case 620:
                type = "F0";
                break;

            case 140:
                type = "V0";
                break;

            case 150:
            case 155:
                type = "VR";
                break;

            case 160:
                type = "X0";
                break;

            case 170:
                type = "XR";
                break;

            case 196:
                type = "L4";
                break;

            case 197:
                type = "L5";
                break;

            case 333:
                type = "L6";
                break;
        }
        return type;
    } // mGetTypeForEventError

    /**
     * (non-Javadoc)
     * Gets the system date from the database server.
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
     * Creates a params element used when getting the system date via a service call.
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
     * Call a service to get warrent data from a warrent id.
     *
     * @param pWarrantId the warrant id
     * @return the string
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private String mGetWarrantNumber (final String pWarrantId) throws SystemException, JDOMException, BusinessException
    {
        Element warrantNumberElement = null;
        Element resultElement = null;
        Element getWarrantParamsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        String warrantNumber = null;

        getWarrantParamsElement = mGetWarrantNumberParams (pWarrantId);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (getWarrantParamsElement);

        resultElement = localServiceProxy
                .getJDOM (WarrantDefs.WARRANT_SERVICE, WarrantDefs.GET_WARRANT_SUMMARY, sXmlParams).getRootElement ();

        warrantNumberElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Warrant/WarrantNumber");
        warrantNumber = warrantNumberElement.getText ();

        return warrantNumber;
    } // mGetWarrantNumber()

    /**
     * (non-Javadoc)
     * Create a parameters element used when calling a service to get warrent data.
     *
     * @param pWarrantId the warrant id
     * @return the element
     */
    private Element mGetWarrantNumberParams (final String pWarrantId)
    {
        Element paramsElement = null;
        // Build the Parameter XML for passing to the getSystemDate service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "warrantID", pWarrantId);

        return paramsElement;
    } // mGetWarrantNumberParams()

    /**
     * (non-Javadoc)
     * Call a service to get court code for variation.
     *
     * @param pVarySeq the vary seq
     * @return the string
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private String mGetCaseCourtCodeForVariation (final String pVarySeq)
        throws SystemException, JDOMException, BusinessException
    {
        Element getCaseCourtParamsElement = null;
        Element courtCodeElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        Element resultElement = null;
        String courtCode = null;

        getCaseCourtParamsElement = mGetCaseCourtCodeForVariationParams (pVarySeq);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (getCaseCourtParamsElement);

        resultElement = localServiceProxy.getJDOM (CASE_EVENT_SERVICE, GET_CASE_COURT_CODE_FOR_VARIATION, sXmlParams)
                .getRootElement ();

        courtCodeElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Case/CourtCode");
        courtCode = courtCodeElement.getText ();

        return courtCode;
    } // mGetCaseCourtCodeForVariation()

    /**
     * (non-Javadoc)
     * Create a parameters element used when calling a service to get case's court code
     * when only variation detail available.
     *
     * @param pVarySeq the vary seq
     * @return the element
     */
    private Element mGetCaseCourtCodeForVariationParams (final String pVarySeq)
    {
        Element paramsElement = null;
        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "varySeq", pVarySeq);

        return paramsElement;
    } // mGetCaseCourtCodeForVariationParams()

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
        Element getCaseCourtParamsElement = null;
        Element courtCodeElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        Element resultElement = null;
        String courtCode = null;

        getCaseCourtParamsElement = mGetCaseCourtCodeParams (pCaseNumber);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (getCaseCourtParamsElement);

        resultElement =
                localServiceProxy.getJDOM (CASE_EVENT_SERVICE, GET_CASE_COURT_CODE, sXmlParams).getRootElement ();

        courtCodeElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Case/CourtCode");
        if (courtCodeElement != null)
        {
            courtCode = courtCodeElement.getText ();
        }

        return courtCode;
    } // mGetCaseCourtCode()

    /**
     * (non-Javadoc)
     * Create a parameters element used when calling a service to get case's court code.
     *
     * @param pCaseNumber the case number
     * @return the element
     */
    private Element mGetCaseCourtCodeParams (final String pCaseNumber)
    {
        Element paramsElement = null;
        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

        return paramsElement;
    } // mGetCaseCourtCodeParams()

    /**
     * (non-Javadoc)
     * Call a service to get warrant return data.
     *
     * @param pWarrantReturnId identifier of the warrant return
     * @return warrant return element.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mGetWarrantReturnData (final String pWarrantReturnId)
        throws SystemException, JDOMException, BusinessException
    {
        Element warrantReturnElement = null;
        Element resultElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "warrantReturnId", pWarrantReturnId);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement = localServiceProxy.getJDOM (WARRANT_RETURN_SERVICE, GET_WARRANT_RETURN_DATA, sXmlParams)
                .getRootElement ();

        warrantReturnElement = (Element) XPath.selectSingleNode (resultElement, "/ds/WarrantReturn");
        return warrantReturnElement;
    } // mGetWarrantReturnData()

    /**
     * (non-Javadoc)
     * Call a service to get warrant return data using case event sequence.
     *
     * @param pCaseEventSeq identifier of the case event
     * @return warrant return element.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mGetWarrantReturnDataByEventSeq (final String pCaseEventSeq)
        throws SystemException, JDOMException, BusinessException
    {
        Element warrantReturnElement = null;
        Element resultElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "eventSeq", pCaseEventSeq);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement = localServiceProxy.getJDOM (WARRANT_RETURN_SERVICE, GET_WARRANT_RETURN_BY_EVENT_DATA, sXmlParams)
                .getRootElement ();

        warrantReturnElement = (Element) XPath.selectSingleNode (resultElement, "/ds/WarrantReturn");
        return warrantReturnElement;
    } // mGetWarrantReturnDataByEventSeq()

    /**
     * (non-Javadoc)
     * Call a service to get warrant return data using case data.
     *
     * @param pCaseEventDate date of the case event
     * @param pCaseNumber case number
     * @param pWarrantNumber warrant number
     * @return warrant return element.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mGetWarrantReturnDataByCase (final String pCaseEventDate, final String pCaseNumber,
                                                 final String pWarrantNumber)
        throws SystemException, JDOMException, BusinessException
    {
        Element warrantReturnElement = null;
        Element resultElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "eventDate", pCaseEventDate);
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
        XMLBuilder.addParam (paramsElement, "warrantNumber", pWarrantNumber);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement = localServiceProxy.getJDOM (WARRANT_RETURN_SERVICE, GET_WARRANT_RETURN_BY_CASE_DATA, sXmlParams)
                .getRootElement ();

        warrantReturnElement = (Element) XPath.selectSingleNode (resultElement, "/ds/WarrantReturn");
        return warrantReturnElement;
    } // mGetWarrantReturnDataByCase()

    /**
     * (non-Javadoc)
     * Call a service to determine if an MCOL_DATA record exists for the event sequence provided.
     *
     * @param pEventSeq the event seq
     * @return the string
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private String mMcolMessageExists (final String pEventSeq) throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element dataElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        Element resultElement = null;
        String mcolDataExists = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "eventSeq", pEventSeq);

        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement = localServiceProxy.getJDOM (CASE_EVENT_SERVICE, GET_MCOL_DATA_EXISTS_FOR_EVENT, sXmlParams)
                .getRootElement ();

        dataElement = (Element) XPath.selectSingleNode (resultElement, "/ds/CaseEvent/MCOLDataExists");
        mcolDataExists = dataElement.getText ();

        return mcolDataExists;
    } // mGetCaseCourtCodeForVariation()

    /**
     * (non-Javadoc)
     * Call a service to retrieve the case event subject number for an event.
     *
     * @param pWarrantNumber the warrant number
     * @param pDefendantId the defendant id
     * @return the string
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     * @paran pDefendantId
     */
    private String mGetWarrantReturnSubjectNumber (final String pWarrantNumber, final String pDefendantId)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element DefPartyNoOneElement = null;
        Element DefPartyNoTwoElement = null;
        String DefPartyNoOne = null;
        String DefPartyNoTwo = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        Element resultElement = null;
        String subjectNo = "1";

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "warrantNumber", pWarrantNumber);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement = localServiceProxy.getJDOM (WARRANT_RETURN_SERVICE, GET_WARRANT_CASE_PARTY_NOS, sXmlParams)
                .getRootElement ();

        DefPartyNoOneElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Warrant/Def1PartyNo");
        DefPartyNoTwoElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Warrant/Def2PartyNo");
        DefPartyNoOne = DefPartyNoOneElement.getText ();
        DefPartyNoTwo = DefPartyNoTwoElement.getText ();

        // Determine the correct subject party
        if (pDefendantId.equals ("1") && !DefPartyNoOne.equals (""))
        {
            subjectNo = DefPartyNoOne;
        }
        else if (pDefendantId.equals ("2") && !DefPartyNoTwo.equals (""))
        {
            subjectNo = DefPartyNoTwo;
        }

        return subjectNo;
    } // mGetWarrantReturnSubjectNumber()

    /**
     * (non-Javadoc)
     * Call a service to retrieve judgment variation data.
     *
     * @param pEventSeq identifier of the case event linked to the variation
     * @return judgment variation element.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mGetJudgmentVariationData (final String pEventSeq)
        throws SystemException, JDOMException, BusinessException
    {
        Element variationElement = null;
        Element resultElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "eventSeq", pEventSeq);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement = localServiceProxy.getJDOM (CASE_EVENT_SERVICE, GET_JUDGMENT_VARIATION_DATA, sXmlParams)
                .getRootElement ();

        variationElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Variation");
        return variationElement;
    } // mGetJudgmentVariationData()

    /**
     * (non-Javadoc)
     * Call a service to retrieve judgment data.
     *
     * @param pJudgmentSeq identifier of the judgment
     * @return judgment data element.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mGetJudgmentData (final String pJudgmentSeq)
        throws SystemException, JDOMException, BusinessException
    {
        Element judgmentElement = null;
        Element resultElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "judgSeq", pJudgmentSeq);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement =
                localServiceProxy.getJDOM (JUDGMENT_SERVICE, GET_JUDGMENT_FOR_MCOL_DATA, sXmlParams).getRootElement ();

        judgmentElement = (Element) XPath.selectSingleNode (resultElement, "/ds/Judgment");
        return judgmentElement;
    } // mGetJudgmentVariationData()

    /**
     * Retrieves the subject details for a case event 79.
     *
     * @param pEventSeq Event sequence
     * @return The case event subject Element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mGetEvent79Subject (final String pEventSeq) throws SystemException, JDOMException, BusinessException
    {
        Element caseEventElement = null;
        Element resultElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "eventSeq", pEventSeq);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement =
                localServiceProxy.getJDOM (CASE_EVENT_SERVICE, GET_CASE_EVENT_79_SUBJECT, sXmlParams).getRootElement ();

        caseEventElement = (Element) XPath.selectSingleNode (resultElement, "/ds/CaseEvent");
        return caseEventElement;
    } // mGetEvent79Subject()

    /**
     * Retrieves the event details for a case event 160.
     *
     * @param pEventSeq Event sequence
     * @return The case event subject Element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mGetEvent160Details (final String pEventSeq)
        throws SystemException, JDOMException, BusinessException
    {
        Element caseEventElement = null;
        Element resultElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "eventSeq", pEventSeq);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement = localServiceProxy.getJDOM (CASE_EVENT_SERVICE, GET_CASE_EVENT_160_DETAILS, sXmlParams)
                .getRootElement ();

        caseEventElement = (Element) XPath.selectSingleNode (resultElement, "/ds/CaseEvent");
        return caseEventElement;
    } // mGetEvent160Details()

    /**
     * Retrieves the event details for a case event 160 without an event sequence.
     *
     * @param pAppSetAsideElement Element for the application to Set Aside
     * @param pJudgSeq Judgement Sequence
     * @param pCaseNumber Case Number
     * @return The case event subject Element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mGetEvent160DetailsNoSeq (final Element pAppSetAsideElement, final String pJudgSeq,
                                              final String pCaseNumber)
        throws SystemException, JDOMException, BusinessException
    {
        Element caseEventElement = null;
        Element resultElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        // Build the Parameter XML for passing to the service.
        paramsElement = XMLBuilder.getNewParamsElement ();

        XMLBuilder.addParam (paramsElement, "receiptDate", pAppSetAsideElement.getChildText ("AppDate"));
        XMLBuilder.addParam (paramsElement, "requester", pAppSetAsideElement.getChildText ("Applicant"));
        XMLBuilder.addParam (paramsElement, "result", pAppSetAsideElement.getChildText ("Result"));
        XMLBuilder.addParam (paramsElement, "resultDate", pAppSetAsideElement.getChildText ("DateResult"));
        XMLBuilder.addParam (paramsElement, "judgSeq", pJudgSeq);
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        resultElement = localServiceProxy.getJDOM (CASE_EVENT_SERVICE, GET_CASE_EVENT_160_DETAILS_NO_SEQ, sXmlParams)
                .getRootElement ();

        caseEventElement = (Element) XPath.selectSingleNode (resultElement, "/ds/CaseEvent");
        return caseEventElement;
    } // mGetEvent160DetailsNoSeq()

} // class CCBCHelper
