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

import org.jdom.Element;

/**
 * Class: CaseEventXMLBuilder.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 08-Mar-2005
 *         Description: This class is intended to provided assistance in creating the XML element
 *         structure that needs to be passed to the insertCaseEventRow() service method.
 *         The insertCaseEventRow() method requires the presence of a number of XML
 *         elements (tags), even if they are empty, otherwise it fall over.
 *         The getXMLElement() method will provide an XML Element structure with
 *         the set of Element required by the insertCaseEventRow() method.
 * 
 *         Change History:
 *         08-Dec-2005 Chris Hutt Defect 1916
 *         Need to avoid BMS for some events when added as autos. 'Source' tag added.
 *         20-Dec-2005 Chris Hutt Add CreatingCourt and CreatingSection (BMS enhancement).
 *         25-Jan-2006 Chris Hutt Add CreditorCode (for CCBC).
 *         27-Apr-2006 Phil Haferer TD 3057 "CaseEventXMLBuilder.java (701c) - naming standards".
 *         Change class attribute variables to have lower-case firest character.
 *         17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 *         27/11/2006 Phil Haferer Added the constants CASM_USER_PREFIX and SYSTEM_TRANSCTION_SECTION.
 *         (UCT_CASEMAN 758: BMS on SUPS to SUPS transfer).
 *         30/11/2006 Phil Haferer Changed the constant SYSTEM_TRANSCTION_SECTION to SYSTEM_TRANSFER_SECTION and
 *         change the text to "SYSTEM TRANSFER SECTION".
 *         (UCT_CASEMAN 758: BMS on SUPS to SUPS transfer).
 *         19/04/2007 Mark Groen Caseman defect 6037. Added new field - REGISTER_JUDGMENT and new method
 *         getXMLElementForEventToRegister()
 *         05/07/2007 Chris Vincent: Group2 Defect 6037. Added new field - warrantReturnId together with get and set
 *         methods.
 *         28/11/2012 Chris VIncent: Trac 4761 - added new transferReason field including initialisation, tag and
 *         get/set methods.
 *         28/01/2013 Chris VIncent: Trac 4763 - added new track field including initialisation, tag and get/set
 *         methods.
 *         04/02/2015 Chris VIncent: Trac 5473 - added new MCOL Reference field including initialisation, tag and
 *         get/set methods.
 */
public class CaseEventXMLBuilder
{
    /**
     * The case event sequence element name.
     */
    public static final String TAG_CASEEVENTSEQ = "CaseEventSeq";
    /**
     * The case number element name.
     */
    public static final String TAG_CASENUMBER = "CaseNumber";
    /**
     * The standard event id element name.
     */
    public static final String TAG_STANDARDEVENTID = "StandardEventId";
    /**
     * The subject case party number element name.
     */
    public static final String TAG_SUBJECTCASEPARTYNUMBER = "SubjectCasePartyNumber";
    /**
     * The subject party role code.
     */
    public static final String TAG_SUBJECTPARTYROLECODE = "SubjectPartyRoleCode";
    /**
     * The applicant element name.
     */
    public static final String TAG_APPLICANT = "Applicant";
    /**
     * The event details element name.
     */
    public static final String TAG_EVENTDETAILS = "EventDetails";
    /**
     * The event date element name.
     */
    public static final String TAG_EVENTDATE = "EventDate";
    /**
     * The result element name.
     */
    public static final String TAG_RESULT = "Result";
    /**
     * The warrant id element name.
     */
    public static final String TAG_WARRANTID = "WarrantId";
    /**
     * The judgement sequence element name.
     */
    public static final String TAG_JUDGMENTSEQ = "JudgmentSeq";
    /**
     * The vary sequence element name.
     */
    public static final String TAG_VARYSEQ = "VarySeq";
    /**
     * The hearing sequence element name.
     */
    public static final String TAG_HRGSEQ = "HrgSeq";
    /**
     * The deleted flag element name.
     */
    public static final String TAG_DELETEDFLAG = "DeletedFlag";
    /**
     * The user name element name.
     */
    public static final String TAG_USERNAME = "UserName";
    /**
     * The receipt date element name.
     */
    public static final String TAG_RECEIPTDATE = "ReceiptDate";
    /**
     * The bms task element name.
     */
    public static final String TAG_BMSTASK = "BMSTask";
    /**
     * The stats module element name.
     */
    public static final String TAG_STATSMODULE = "StatsModule";
    /**
     * The age category element name.
     */
    public static final String TAG_AGECATEGORY = "AgeCategory";
    /**
     * The court code element name.
     */
    public static final String TAG_COURTCODE = "CourtCode";
    /**
     * The result date element name.
     */
    public static final String TAG_RESULTDATE = "ResultDate";
    /**
     * The date to rerial element name.
     */
    public static final String TAG_DATETORTL = "DateToRtl";
    /**
     * The case flag element name.
     */
    public static final String TAG_CASEFLAG = "CaseFlag";
    /**
     * The bms task description element name.
     */
    public static final String TAG_BMSTASKDESCRIPTION = "BMSTaskDescription";
    /**
     * The stats mode description element name.
     */
    public static final String TAG_STATSMODDESCRIPTION = "StatsModDescription";
    /**
     * The source element name.
     */
    public static final String TAG_SOURCE = "Source";
    /**
     * The creating court element name.
     */
    public static final String TAG_CREATINGCOURT = "CreatingCourt";
    /**
     * The creating section element name.
     */
    public static final String TAG_CREATINGSECTION = "CreatingSection";
    /**
     * The creditor code element name.
     */
    public static final String TAG_CREDITORCODE = "CreditorCode";
    /**
     * The listing type element name.
     */
    public static final String TAG_LISTINGTYPE = "ListingType";
    /**
     * The listing type element name.
     */
    public static final String TAG_WARRANTRETURNID = "WarrantReturnId";
    /**
     * The transfer reason element name.
     */
    public static final String TAG_TRANSFER_REASON = "TransferReason";
    /**
     * The transfer reason element name.
     */
    public static final String TAG_TRACK = "Track";
    /**
     * The transfer reason element name.
     */
    public static final String TAG_MCOL_REF = "MCOLReference";
    /**
     * The CASM System User Prefix.
     */
    public static final String CASM_USER_PREFIX = "CASM_";
    /**
     * The System Transfer Section.
     */
    public static final String SYSTEM_TRANSFER_SECTION = "SYSTEM TRANSFER SECTION";

    /**
     * The case event register judgment element name.
     */
    public static final String TAG_CASEREGJUDG = "RegisterJudgment"; // defect 6037

    /** The case event XML element. */
    private Element caseEventXMLElement = null;

    /** The case event seq. */
    private String caseEventSeq;
    
    /** The case number. */
    private String caseNumber;
    
    /** The standard event id. */
    private String standardEventId;
    
    /** The subject case party number. */
    private String subjectCasePartyNumber;
    
    /** The subject party role code. */
    private String subjectPartyRoleCode;
    
    /** The applicant. */
    private String applicant;
    
    /** The event details. */
    private String eventDetails;
    
    /** The event date. */
    private String eventDate;
    
    /** The result. */
    private String result;
    
    /** The warrant id. */
    private String warrantId;
    
    /** The judgment seq. */
    private String judgmentSeq;
    
    /** The vary seq. */
    private String varySeq;
    
    /** The hrg seq. */
    private String hrgSeq;
    
    /** The deleted flag. */
    private String deletedFlag;
    
    /** The user name. */
    private String userName;
    
    /** The receipt date. */
    private String receiptDate;
    
    /** The bms task. */
    private String bmsTask;
    
    /** The stats module. */
    private String statsModule;
    
    /** The age category. */
    private String ageCategory;
    
    /** The court code. */
    private String courtCode;
    
    /** The result date. */
    private String resultDate;
    
    /** The date to rtl. */
    private String dateToRtl;
    
    /** The case flag. */
    private String caseFlag;
    
    /** The bms task description. */
    private String bmsTaskDescription;
    
    /** The stats mod description. */
    private String statsModDescription;
    
    /** The source. */
    private String source;
    
    /** The creating court. */
    private String creatingCourt;
    
    /** The creating section. */
    private String creatingSection;
    
    /** The creditor code. */
    private String creditorCode;
    
    /** The listing type. */
    private String listingType;
    
    /** The warrant return id. */
    private String warrantReturnId;
    
    /** The register judgment. */
    private String registerJudgment; // defect 6037
    
    /** The transfer reason. */
    private String transferReason;
    
    /** The track. */
    private String track;
    
    /** The mcol reference. */
    private String mcolReference;

    /**
     * This version of the constructor allows the class to initialised by an existing
     * XML Element. Any additional elements will not be discarded.
     * 
     * @param pElement The parameters element.
     */
    public CaseEventXMLBuilder (final Element pElement)
    {
        // Take a copy of the input XML Element.
        // It may contain other elements that need to be passed on without manipulation.
        caseEventXMLElement = (Element) pElement.clone ();

        caseEventSeq = mGetElementValue (pElement, TAG_CASEEVENTSEQ);
        caseNumber = mGetElementValue (pElement, TAG_CASENUMBER);
        standardEventId = mGetElementValue (pElement, TAG_STANDARDEVENTID);
        subjectCasePartyNumber = mGetElementValue (pElement, TAG_SUBJECTCASEPARTYNUMBER);
        subjectPartyRoleCode = mGetElementValue (pElement, TAG_SUBJECTPARTYROLECODE);
        applicant = mGetElementValue (pElement, TAG_APPLICANT);
        eventDetails = mGetElementValue (pElement, TAG_EVENTDETAILS);
        eventDate = mGetElementValue (pElement, TAG_EVENTDATE);
        result = mGetElementValue (pElement, TAG_RESULT);
        warrantId = mGetElementValue (pElement, TAG_WARRANTID);
        judgmentSeq = mGetElementValue (pElement, TAG_JUDGMENTSEQ);
        varySeq = mGetElementValue (pElement, TAG_VARYSEQ);
        hrgSeq = mGetElementValue (pElement, TAG_HRGSEQ);
        deletedFlag = mGetElementValue (pElement, TAG_DELETEDFLAG);
        userName = mGetElementValue (pElement, TAG_USERNAME);
        receiptDate = mGetElementValue (pElement, TAG_RECEIPTDATE);
        bmsTask = mGetElementValue (pElement, TAG_BMSTASK);
        statsModule = mGetElementValue (pElement, TAG_STATSMODULE);
        ageCategory = mGetElementValue (pElement, TAG_AGECATEGORY);
        courtCode = mGetElementValue (pElement, TAG_COURTCODE);
        resultDate = mGetElementValue (pElement, TAG_RESULTDATE);
        dateToRtl = mGetElementValue (pElement, TAG_DATETORTL);
        caseFlag = mGetElementValue (pElement, TAG_CASEFLAG);
        bmsTaskDescription = mGetElementValue (pElement, TAG_BMSTASKDESCRIPTION);
        statsModDescription = mGetElementValue (pElement, TAG_STATSMODDESCRIPTION);
        source = mGetElementValue (pElement, TAG_SOURCE);
        creatingCourt = mGetElementValue (pElement, TAG_CREATINGCOURT);
        creatingSection = mGetElementValue (pElement, TAG_CREATINGSECTION);
        creditorCode = mGetElementValue (pElement, TAG_CREDITORCODE);
        listingType = mGetElementValue (pElement, TAG_LISTINGTYPE);
        warrantReturnId = mGetElementValue (pElement, TAG_WARRANTRETURNID);
        transferReason = mGetElementValue (pElement, TAG_TRANSFER_REASON);
        track = mGetElementValue (pElement, TAG_TRACK);
        mcolReference = mGetElementValue (pElement, TAG_MCOL_REF);

    } // CaseEventXMLBuilder()

    /**
     * Constructor which takes the minimal amount of data required to create an event.
     *
     * @param pCaseNumber The case number.
     * @param pStandardEventId The standard event id.
     * @param pEventDate The event date.
     * @param pReceiptDate The receipt date.
     * @param pCourtCode The court code.
     */
    public CaseEventXMLBuilder (final String pCaseNumber, final String pStandardEventId, final String pEventDate,
            final String pReceiptDate, final String pCourtCode)
    {
        setCaseNumber (pCaseNumber);
        setStandardEventId (pStandardEventId);
        setEventDate (pEventDate);
        setReceiptDate (pReceiptDate);
        setCourtCode (pCourtCode);
    }

    /**
     * This version of the constructor allows the class to be constructed purely with
     * scalar values.
     *
     * @param pCaseEventSeq The case event sequence.
     * @param pCaseNumber The case number.
     * @param pStandardEventId The standard event id.
     * @param pSubjectCasePartyNumber The subject case party number.
     * @param pSubjectPartyRoleCode The subject party role code.
     * @param pApplicant The applicant.
     * @param pEventDetails The event details.
     * @param pEventDate The event date.
     * @param pResult The result.
     * @param pWarrantId The warrant id.
     * @param pJudgmentSeq The judgement sequence.
     * @param pVarySeq The vary sequence.
     * @param pHrgSeq The hearing sequence.
     * @param pDeletedFlag The deleted flag.
     * @param pUserName The user name.
     * @param pReceiptDate The receipt date.
     * @param pTask The task.
     * @param pStatsModule The stats module.
     * @param pAgeCategory The age category.
     * @param pCourtCode The court code.
     * @param pResultDate The result date.
     * @param pDateToRtl The date to retrial.
     * @param pCaseFlag The case flag.
     * @param pListingType the listing type
     */
    public CaseEventXMLBuilder (final String pCaseEventSeq, final String pCaseNumber, final String pStandardEventId,
            final String pSubjectCasePartyNumber, final String pSubjectPartyRoleCode, final String pApplicant,
            final String pEventDetails, final String pEventDate, final String pResult, final String pWarrantId,
            final String pJudgmentSeq, final String pVarySeq, final String pHrgSeq, final String pDeletedFlag,
            final String pUserName, final String pReceiptDate, final String pTask, final String pStatsModule,
            final String pAgeCategory, final String pCourtCode, final String pResultDate, final String pDateToRtl,
            final String pCaseFlag, final String pListingType)
    {
        super ();
        caseEventSeq = pCaseEventSeq;
        caseNumber = pCaseNumber;
        standardEventId = pStandardEventId;
        subjectCasePartyNumber = pSubjectCasePartyNumber;
        subjectPartyRoleCode = pSubjectPartyRoleCode;
        applicant = pApplicant;
        eventDetails = pEventDetails;
        eventDate = pEventDate;
        result = pResult;
        warrantId = pWarrantId;
        judgmentSeq = pJudgmentSeq;
        varySeq = pVarySeq;
        hrgSeq = pHrgSeq;
        deletedFlag = pDeletedFlag;
        userName = pUserName;
        receiptDate = pReceiptDate;
        bmsTask = pTask;
        statsModule = pStatsModule;
        ageCategory = pAgeCategory;
        courtCode = pCourtCode;
        resultDate = pResultDate;
        dateToRtl = pDateToRtl;
        caseFlag = pCaseFlag;
        listingType = pListingType;
        warrantReturnId = "";
        transferReason = "";
        track = "";
        mcolReference = "";
    }

    /**
     * Gets the register judgment.
     *
     * @return the register judgment
     */
    public String getRegisterJudgment ()
    {
        return registerJudgment;
    }

    /**
     * Sets the register judgment.
     *
     * @param pRegisterJudgment the new register judgment
     */
    public void setRegisterJudgment (final String pRegisterJudgment)
    {
        registerJudgment = pRegisterJudgment;
    }

    /**
     * Gets the age category.
     *
     * @return the age category
     */
    public String getAgeCategory ()
    {
        return ageCategory;
    }

    /**
     * Sets the age category.
     *
     * @param pAgeCategory the new age category
     */
    public void setAgeCategory (final String pAgeCategory)
    {
        ageCategory = pAgeCategory;
    }

    /**
     * Gets the applicant.
     *
     * @return the applicant
     */
    public String getApplicant ()
    {
        return applicant;
    }

    /**
     * Sets the applicant.
     *
     * @param pApplicant the new applicant
     */
    public void setApplicant (final String pApplicant)
    {
        applicant = pApplicant;
    }

    /**
     * Gets the BMS task.
     *
     * @return the BMS task
     */
    public String getBMSTask ()
    {
        return bmsTask;
    }

    /**
     * Sets the BMS task.
     *
     * @param pTask the new BMS task
     */
    public void setBMSTask (final String pTask)
    {
        bmsTask = pTask;
    }

    /**
     * Gets the case event seq.
     *
     * @return the case event seq
     */
    public String getCaseEventSeq ()
    {
        return caseEventSeq;
    }

    /**
     * Sets the case event seq.
     *
     * @param pCaseEventSeq the new case event seq
     */
    public void setCaseEventSeq (final String pCaseEventSeq)
    {
        caseEventSeq = pCaseEventSeq;
    }

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public String getCaseNumber ()
    {
        return caseNumber;
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        caseNumber = pCaseNumber;
    }

    /**
     * Gets the court code.
     *
     * @return the court code
     */
    public String getCourtCode ()
    {
        return courtCode;
    }

    /**
     * Sets the court code.
     *
     * @param pCourtCode the new court code
     */
    public void setCourtCode (final String pCourtCode)
    {
        courtCode = pCourtCode;
    }

    /**
     * Gets the result date.
     *
     * @return the result date
     */
    public String getResultDate ()
    {
        return resultDate;
    }

    /**
     * Sets the result date.
     *
     * @param pResultDate the new result date
     */
    public void setResultDate (final String pResultDate)
    {
        resultDate = pResultDate;
    }

    /**
     * Gets the date to rtl.
     *
     * @return the date to rtl
     */
    public String getDateToRtl ()
    {
        return dateToRtl;
    }

    /**
     * Sets the date to rtl.
     *
     * @param pDateToRtl the new date to rtl
     */
    public void setDateToRtl (final String pDateToRtl)
    {
        dateToRtl = pDateToRtl;
    }

    /**
     * Gets the case flag.
     *
     * @return the case flag
     */
    public String getCaseFlag ()
    {
        return caseFlag;
    }

    /**
     * Sets the case flag.
     *
     * @param pCaseFlag the new case flag
     */
    public void setCaseFlag (final String pCaseFlag)
    {
        caseFlag = pCaseFlag;
    }

    /**
     * Gets the deleted flag.
     *
     * @return the deleted flag
     */
    public String getDeletedFlag ()
    {
        return deletedFlag;
    }

    /**
     * Sets the deleted flag.
     *
     * @param pDeletedFlag the new deleted flag
     */
    public void setDeletedFlag (final String pDeletedFlag)
    {
        deletedFlag = pDeletedFlag;
    }

    /**
     * Gets the event date.
     *
     * @return the event date
     */
    public String getEventDate ()
    {
        return eventDate;
    }

    /**
     * Sets the event date.
     *
     * @param pEventDate the new event date
     */
    public void setEventDate (final String pEventDate)
    {
        eventDate = pEventDate;
    }

    /**
     * Gets the event details.
     *
     * @return the event details
     */
    public String getEventDetails ()
    {
        return eventDetails;
    }

    /**
     * Sets the event details.
     *
     * @param pEventDetails the new event details
     */
    public void setEventDetails (final String pEventDetails)
    {
        eventDetails = pEventDetails;
    }

    /**
     * Gets the hrg seq.
     *
     * @return the hrg seq
     */
    public String getHrgSeq ()
    {
        return hrgSeq;
    }

    /**
     * Sets the hrg seq.
     *
     * @param pHrgSeq the new hrg seq
     */
    public void setHrgSeq (final String pHrgSeq)
    {
        hrgSeq = pHrgSeq;
    }

    /**
     * Gets the judgment seq.
     *
     * @return the judgment seq
     */
    public String getJudgmentSeq ()
    {
        return judgmentSeq;
    }

    /**
     * Sets the judgment seq.
     *
     * @param pJudgmentSeq the new judgment seq
     */
    public void setJudgmentSeq (final String pJudgmentSeq)
    {
        judgmentSeq = pJudgmentSeq;
    }

    /**
     * Gets the receipt date.
     *
     * @return the receipt date
     */
    public String getReceiptDate ()
    {
        return receiptDate;
    }

    /**
     * Sets the receipt date.
     *
     * @param pReceiptDate the new receipt date
     */
    public void setReceiptDate (final String pReceiptDate)
    {
        receiptDate = pReceiptDate;
    }

    /**
     * Gets the result.
     *
     * @return the result
     */
    public String getResult ()
    {
        return result;
    }

    /**
     * Sets the result.
     *
     * @param pResult the new result
     */
    public void setResult (final String pResult)
    {
        result = pResult;
    }

    /**
     * Gets the standard event id.
     *
     * @return the standard event id
     */
    public String getStandardEventId ()
    {
        return standardEventId;
    }

    /**
     * Sets the standard event id.
     *
     * @param pStandardEventId the new standard event id
     */
    public void setStandardEventId (final String pStandardEventId)
    {
        standardEventId = pStandardEventId;
    }

    /**
     * Gets the stats module.
     *
     * @return the stats module
     */
    public String getStatsModule ()
    {
        return statsModule;
    }

    /**
     * Sets the stats module.
     *
     * @param pStatsModule the new stats module
     */
    public void setStatsModule (final String pStatsModule)
    {
        statsModule = pStatsModule;
    }

    /**
     * Gets the subject case party number.
     *
     * @return the subject case party number
     */
    public String getSubjectCasePartyNumber ()
    {
        return subjectCasePartyNumber;
    }

    /**
     * Sets the subject case party number.
     *
     * @param pSubjectCasePartyNumber the new subject case party number
     */
    public void setSubjectCasePartyNumber (final String pSubjectCasePartyNumber)
    {
        subjectCasePartyNumber = pSubjectCasePartyNumber;
    }

    /**
     * Gets the subject party role code.
     *
     * @return the subject party role code
     */
    public String getSubjectPartyRoleCode ()
    {
        return subjectPartyRoleCode;
    }

    /**
     * Sets the subject party role code.
     *
     * @param pSubjectPartyRoleCode the new subject party role code
     */
    public void setSubjectPartyRoleCode (final String pSubjectPartyRoleCode)
    {
        subjectPartyRoleCode = pSubjectPartyRoleCode;
    }

    /**
     * Gets the user name.
     *
     * @return the user name
     */
    public String getUserName ()
    {
        return userName;
    }

    /**
     * Sets the user name.
     *
     * @param pUserName the new user name
     */
    public void setUserName (final String pUserName)
    {
        userName = pUserName;
    }

    /**
     * Gets the vary seq.
     *
     * @return the vary seq
     */
    public String getVarySeq ()
    {
        return varySeq;
    }

    /**
     * Sets the vary seq.
     *
     * @param pVarySeq the new vary seq
     */
    public void setVarySeq (final String pVarySeq)
    {
        varySeq = pVarySeq;
    }

    /**
     * Gets the warrant id.
     *
     * @return the warrant id
     */
    public String getWarrantId ()
    {
        return warrantId;
    }

    /**
     * Sets the warrant id.
     *
     * @param pWarrantId the new warrant id
     */
    public void setWarrantId (final String pWarrantId)
    {
        warrantId = pWarrantId;
    }

    /**
     * Gets the warrant return id.
     *
     * @return the warrant return id
     */
    public String getWarrantReturnId ()
    {
        return warrantReturnId;
    }

    /**
     * Sets the warrant return id.
     *
     * @param pWarrantReturnId the new warrant return id
     */
    public void setWarrantReturnId (final String pWarrantReturnId)
    {
        warrantReturnId = pWarrantReturnId;
    }

    /**
     * Gets the BMS task description.
     *
     * @return the BMS task description
     */
    public String getBMSTaskDescription ()
    {
        return bmsTaskDescription;
    }

    /**
     * Sets the BMS task description.
     *
     * @param pBmsTaskDescription the new BMS task description
     */
    public void setBMSTaskDescription (final String pBmsTaskDescription)
    {
        bmsTaskDescription = pBmsTaskDescription;
    }

    /**
     * Gets the stats mod description.
     *
     * @return the stats mod description
     */
    public String getStatsModDescription ()
    {
        return statsModDescription;
    }

    /**
     * Sets the stats mod description.
     *
     * @param pStatsModDescription the new stats mod description
     */
    public void setStatsModDescription (final String pStatsModDescription)
    {
        statsModDescription = pStatsModDescription;
    }

    /**
     * Gets the creating court.
     *
     * @return the creating court
     */
    public String getCreatingCourt ()
    {
        return creatingCourt;
    }

    /**
     * Sets the creating court.
     *
     * @param pCreatingCourt the new creating court
     */
    public void setCreatingCourt (final String pCreatingCourt)
    {
        creatingCourt = pCreatingCourt;
    }

    /**
     * Gets the creating section.
     *
     * @return the creating section
     */
    public String getCreatingSection ()
    {
        return creatingSection;
    }

    /**
     * Sets the creating section.
     *
     * @param pCreatingSection the new creating section
     */
    public void setCreatingSection (final String pCreatingSection)
    {
        creatingSection = pCreatingSection;
    }

    /**
     * Gets the creditor code.
     *
     * @return the creditor code
     */
    public String getCreditorCode ()
    {
        return creditorCode;
    }

    /**
     * Sets the creditor code.
     *
     * @param pCreditorCode the new creditor code
     */
    public void setCreditorCode (final String pCreditorCode)
    {
        creditorCode = pCreditorCode;
    }

    /**
     * Gets the source.
     *
     * @return the source
     */
    public String getSource ()
    {
        return source;
    }

    /**
     * Sets the source.
     *
     * @param pSource the new source
     */
    public void setSource (final String pSource)
    {
        source = pSource;
    }

    /**
     * Gets the listing type.
     *
     * @return the listing type
     */
    public String getListingType ()
    {
        return listingType;
    }

    /**
     * Sets the listing type.
     *
     * @param listingType the new listing type
     */
    public void setListingType (final String listingType)
    {
        this.listingType = listingType;
    }

    /**
     * Gets the transfer reason.
     *
     * @return the transfer reason
     */
    public String getTransferReason ()
    {
        return transferReason;
    }

    /**
     * Sets the transfer reason.
     *
     * @param transferReason the new transfer reason
     */
    public void setTransferReason (final String transferReason)
    {
        this.transferReason = transferReason;
    }

    /**
     * Gets the track.
     *
     * @return the track
     */
    public String getTrack ()
    {
        return track;
    }

    /**
     * Sets the track.
     *
     * @param track the new track
     */
    public void setTrack (final String track)
    {
        this.track = track;
    }

    /**
     * Gets the MCOL refernce.
     *
     * @return the MCOL refernce
     */
    public String getMCOLRefernce ()
    {
        return mcolReference;
    }

    /**
     * Sets the MCOL refernce.
     *
     * @param mcolReference the new MCOL refernce
     */
    public void setMCOLRefernce (final String mcolReference)
    {
        this.mcolReference = mcolReference;
    }

    /**
     * (non-Javadoc)
     * Return an elements text, or null.
     *
     * @param pElement the element
     * @param pChildTagName the child tag name
     * @return the string
     */
    private String mGetElementValue (final Element pElement, final String pChildTagName)
    {
        String sValue = null;
        Element childElement = null;

        try
        {
            childElement = pElement.getChild (pChildTagName);
            if (null != childElement)
            {
                sValue = childElement.getText ();
            }
        }
        finally
        {
            childElement = null;
        }

        return sValue;
    } // mGetElementValue()

    /**
     * (non-Javadoc)
     * Sets an elements value, or adds the element if it does not exist.
     *
     * @param pParentElement the parent element
     * @param pElementName the element name
     * @param pElementContent the element content
     */
    private void mSetElement (final Element pParentElement, final String pElementName, final String pElementContent)
    {
        Element element = null;

        try
        {
            element = pParentElement.getChild (pElementName);
            if (null == element)
            {
                element = new Element (pElementName);
                pParentElement.addContent (element);
            }
            element.setText (pElementContent);
        }
        finally
        {
            element = null;
        }
    } // mSetElement()

    /**
     * Translate the content of this class into an XML Element with the given tag name.
     * Sets the specified tag elements to the values held in the class attributes,
     * and copies any additional elements which may have been passed in via the constructor.
     * 
     * @param pElementName The element name.
     * @return The xml element.
     */
    public Element getXMLElement (final String pElementName)
    {

        Element element = null;

        if (null == caseEventXMLElement)
        {
            element = new Element (pElementName);
        }
        else
        {
            element = (Element) caseEventXMLElement.clone ();
            element = (Element) element.detach ();
            element.setName (pElementName);
        }

        mSetElement (element, TAG_CASEEVENTSEQ, caseEventSeq);
        mSetElement (element, TAG_CASENUMBER, caseNumber);
        mSetElement (element, TAG_STANDARDEVENTID, standardEventId);
        mSetElement (element, TAG_SUBJECTCASEPARTYNUMBER, subjectCasePartyNumber);
        mSetElement (element, TAG_SUBJECTPARTYROLECODE, subjectPartyRoleCode);
        mSetElement (element, TAG_APPLICANT, applicant);
        mSetElement (element, TAG_EVENTDETAILS, eventDetails);
        mSetElement (element, TAG_EVENTDATE, eventDate);
        mSetElement (element, TAG_RESULT, result);
        mSetElement (element, TAG_WARRANTID, warrantId);
        mSetElement (element, TAG_JUDGMENTSEQ, judgmentSeq);
        mSetElement (element, TAG_VARYSEQ, varySeq);
        mSetElement (element, TAG_HRGSEQ, hrgSeq);
        mSetElement (element, TAG_DELETEDFLAG, deletedFlag);
        mSetElement (element, TAG_USERNAME, userName);
        mSetElement (element, TAG_RECEIPTDATE, receiptDate);
        mSetElement (element, TAG_BMSTASK, bmsTask);
        mSetElement (element, TAG_STATSMODULE, statsModule);
        mSetElement (element, TAG_AGECATEGORY, ageCategory);
        mSetElement (element, TAG_COURTCODE, courtCode);
        mSetElement (element, TAG_RESULTDATE, resultDate);
        mSetElement (element, TAG_DATETORTL, dateToRtl);
        mSetElement (element, TAG_CASEFLAG, caseFlag);
        mSetElement (element, TAG_BMSTASKDESCRIPTION, bmsTaskDescription);
        mSetElement (element, TAG_STATSMODDESCRIPTION, statsModDescription);
        mSetElement (element, TAG_SOURCE, source);
        mSetElement (element, TAG_CREATINGCOURT, creatingCourt);
        mSetElement (element, TAG_CREATINGSECTION, creatingSection);
        mSetElement (element, TAG_CREDITORCODE, creditorCode);
        mSetElement (element, TAG_LISTINGTYPE, listingType);
        mSetElement (element, TAG_WARRANTRETURNID, warrantReturnId);
        mSetElement (element, TAG_TRANSFER_REASON, transferReason);
        mSetElement (element, TAG_TRACK, track);
        mSetElement (element, TAG_MCOL_REF, mcolReference);

        return element;
    } // getXMLElement()

    /**
     * Defect 6037 - added extra method so not to effect other areas.
     * Translate the content of this class into an XML Element with the given tag name.
     * Sets the specified tag elements to the values held in the class attributes,
     * and copies any additional elements which may have been passed in via the constructor.
     * 
     * @param pElementName The element name.
     * @return The xml element.
     */
    public Element getXMLElementForEventToRegister (final String pElementName)
    {

        Element element = null;

        if (null == caseEventXMLElement)
        {
            element = new Element (pElementName);
        }
        else
        {
            element = (Element) caseEventXMLElement.clone ();
            element = (Element) element.detach ();
            element.setName (pElementName);
        }

        mSetElement (element, TAG_CASEEVENTSEQ, caseEventSeq);
        mSetElement (element, TAG_CASENUMBER, caseNumber);
        mSetElement (element, TAG_STANDARDEVENTID, standardEventId);
        mSetElement (element, TAG_SUBJECTCASEPARTYNUMBER, subjectCasePartyNumber);
        mSetElement (element, TAG_SUBJECTPARTYROLECODE, subjectPartyRoleCode);
        mSetElement (element, TAG_APPLICANT, applicant);
        mSetElement (element, TAG_EVENTDETAILS, eventDetails);
        mSetElement (element, TAG_EVENTDATE, eventDate);
        mSetElement (element, TAG_RESULT, result);
        mSetElement (element, TAG_WARRANTID, warrantId);
        mSetElement (element, TAG_JUDGMENTSEQ, judgmentSeq);
        mSetElement (element, TAG_VARYSEQ, varySeq);
        mSetElement (element, TAG_HRGSEQ, hrgSeq);
        mSetElement (element, TAG_DELETEDFLAG, deletedFlag);
        mSetElement (element, TAG_USERNAME, userName);
        mSetElement (element, TAG_RECEIPTDATE, receiptDate);
        mSetElement (element, TAG_BMSTASK, bmsTask);
        mSetElement (element, TAG_STATSMODULE, statsModule);
        mSetElement (element, TAG_AGECATEGORY, ageCategory);
        mSetElement (element, TAG_COURTCODE, courtCode);
        mSetElement (element, TAG_RESULTDATE, resultDate);
        mSetElement (element, TAG_DATETORTL, dateToRtl);
        mSetElement (element, TAG_CASEFLAG, caseFlag);
        mSetElement (element, TAG_BMSTASKDESCRIPTION, bmsTaskDescription);
        mSetElement (element, TAG_STATSMODDESCRIPTION, statsModDescription);
        mSetElement (element, TAG_SOURCE, source);
        mSetElement (element, TAG_CREATINGCOURT, creatingCourt);
        mSetElement (element, TAG_CREATINGSECTION, creatingSection);
        mSetElement (element, TAG_CREDITORCODE, creditorCode);
        mSetElement (element, TAG_LISTINGTYPE, listingType);
        mSetElement (element, TAG_WARRANTRETURNID, warrantReturnId);
        mSetElement (element, TAG_CASEREGJUDG, registerJudgment);
        mSetElement (element, TAG_TRANSFER_REASON, transferReason);
        mSetElement (element, TAG_TRACK, track);
        mSetElement (element, TAG_MCOL_REF, mcolReference);

        return element;
    } // getXMLElement()
} // class CaseEventXMLBuilder
