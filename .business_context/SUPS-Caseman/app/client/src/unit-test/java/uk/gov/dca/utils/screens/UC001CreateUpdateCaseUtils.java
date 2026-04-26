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
package uk.gov.dca.utils.screens;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TabbedAreaAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Create & Update Case Details screen.
 *
 * Date: 03-Jul-2009
 */
public class UC001CreateUpdateCaseUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant CASE_TYPE_CLAIM_SPEC_ONLY. */
    // Static constants representing different case types
    public static final String CASE_TYPE_CLAIM_SPEC_ONLY = "CLAIM - SPEC ONLY";
    
    /** The Constant CASE_TYPE_CLAIM_UNSPEC_ONLY. */
    public static final String CASE_TYPE_CLAIM_UNSPEC_ONLY = "CLAIM - UNSPEC ONLY";
    
    /** The Constant CASE_TYPE_CH_ACC_POSSN. */
    public static final String CASE_TYPE_CH_ACC_POSSN = "CH ACC POSSN";
    
    /** The Constant CASE_TYPE_CRED_PETITION. */
    public static final String CASE_TYPE_CRED_PETITION = "CREDITORS PETITION";
    
    /** The Constant CASE_TYPE_DEBT_PETITION. */
    public static final String CASE_TYPE_DEBT_PETITION = "DEBTORS PETITION";
    
    /** The Constant CASE_TYPE_APP_ON_DEBT_PETITION. */
    public static final String CASE_TYPE_APP_ON_DEBT_PETITION = "APP ON DEBT PETITION";
    
    /** The Constant CASE_TYPE_WINDING_PETITION. */
    public static final String CASE_TYPE_WINDING_PETITION = "WINDING UP PETITION";
    
    /** The Constant CASE_TYPE_APP_STAT_DEMD. */
    public static final String CASE_TYPE_APP_STAT_DEMD = "APP TO SET STAT DEMD";
    
    /** The Constant CASE_TYPE_APP_INT_ORD. */
    public static final String CASE_TYPE_APP_INT_ORD = "APP INT ORD (INSOLV)";
    
    /** The Constant CASE_TYPE_COMPANY_ADMIN_ORDER. */
    public static final String CASE_TYPE_COMPANY_ADMIN_ORDER = "COMPANY ADMIN ORDER";
    
    /** The Constant CASE_TYPE_TCC_SPEC_ONLY. */
    public static final String CASE_TYPE_TCC_SPEC_ONLY = "TCC - SPEC ONLY";
    
    /** The Constant CASE_TYPE_TCC_MULTI_OTHER. */
    public static final String CASE_TYPE_TCC_MULTI_OTHER = "TCC - MULTI/OTHER";
    
    /** The Constant CASE_TYPE_TCC_UNSPEC. */
    public static final String CASE_TYPE_TCC_UNSPEC = "TCC - UNSPEC";
    
    /** The Constant CASE_TYPE_TCC_ARBITRATION. */
    public static final String CASE_TYPE_TCC_ARBITRATION = "TCC - ARBITRATION";
    
    /** The Constant CASE_TYPE_TCC_PRE_ACTION. */
    public static final String CASE_TYPE_TCC_PRE_ACTION = "TCC - PRE ACTION";
    
    /** The Constant CASE_TYPE_TCC_ADJUDICATION. */
    public static final String CASE_TYPE_TCC_ADJUDICATION = "TCC - ADJUDICATION";
    
    /** The Constant CASE_TYPE_MERC_SPEC_ONLY. */
    public static final String CASE_TYPE_MERC_SPEC_ONLY = "MERC - SPEC ONLY";
    
    /** The Constant CASE_TYPE_MERC_MULTI_OTHER. */
    public static final String CASE_TYPE_MERC_MULTI_OTHER = "MERC - MULTI/OTHER";
    
    /** The Constant CASE_TYPE_MERC_UNSPEC. */
    public static final String CASE_TYPE_MERC_UNSPEC = "MERC - UNSPEC";
    
    /** The Constant CASE_TYPE_MERC_ARBITRATION. */
    public static final String CASE_TYPE_MERC_ARBITRATION = "MERC - ARBITRATION";
    
    /** The Constant CASE_TYPE_MERC_PRE_ACTION. */
    public static final String CASE_TYPE_MERC_PRE_ACTION = "MERC - PRE ACTION";
    
    /** The Constant CASE_TYPE_CLAIM_TCC_SPEC_ONLY. */
    public static final String CASE_TYPE_CLAIM_TCC_SPEC_ONLY = "CLAIM - TCC SPEC ONLY";
    
    /** The Constant CASE_TYPE_CLAIM_TCC_MULTI_OTHER. */
    public static final String CASE_TYPE_CLAIM_TCC_MULTI_OTHER = "CLAIM - TCC MULTI/OTHER";
    
    /** The Constant CASE_TYPE_CLAIM_TCC_UNSPEC. */
    public static final String CASE_TYPE_CLAIM_TCC_UNSPEC = "CLAIM - TCC UNSPEC";
    
    /** The Constant CASE_TYPE_CLAIM_TCC_ARBITRATION. */
    public static final String CASE_TYPE_CLAIM_TCC_ARBITRATION = "CLAIM - TCC ARBITRATION";
    
    /** The Constant CASE_TYPE_CLAIM_TCC_PRE_ACTION. */
    public static final String CASE_TYPE_CLAIM_TCC_PRE_ACTION = "CLAIM - TCC PRE ACTION";
    
    /** The Constant CASE_TYPE_CLAIM_TCC_ADJUDICATION. */
    public static final String CASE_TYPE_CLAIM_TCC_ADJUDICATION = "CLAIM - TCC ADJUDICATION";
    
    /** The Constant CASE_TYPE_CH_CLAIM_PROBATE. */
    public static final String CASE_TYPE_CH_CLAIM_PROBATE = "CH CLAIM PROBATE";
    
    /** The Constant CASE_TYPE_PART_8_CLAIM. */
    public static final String CASE_TYPE_PART_8_CLAIM = "PART 8 CLAIM";
    
    /** The Constant CASE_TYPE_CH_ORIG_APPLN. */
    public static final String CASE_TYPE_CH_ORIG_APPLN = "CH ORIG APPLN";
    
    /** The Constant CASE_TYPE_MORT_POSSN. */
    public static final String CASE_TYPE_MORT_POSSN = "MORT POSSN";
    
    /** The Constant CASE_TYPE_DEMOTION_CLAIM. */
    public static final String CASE_TYPE_DEMOTION_CLAIM = "DEMOTION CLAIM";
    
    /** The Constant CASE_TYPE_FAMENF_FAMILY. */
    public static final String CASE_TYPE_FAMENF_FAMILY = "FAMILY ENF - FAMILY COURT";
    
    /** The Constant CASE_TYPE_FAMENF_REMO. */
    public static final String CASE_TYPE_FAMENF_REMO = "FAMILY ENF - REMO";

    /** The Constant PARTY_TYPE_CLAIMANT. */
    // Static constants representing different party types
    public static final String PARTY_TYPE_CLAIMANT = "CLAIMANT";
    
    /** The Constant PARTY_TYPE_DEFENDANT. */
    public static final String PARTY_TYPE_DEFENDANT = "DEFENDANT";
    
    /** The Constant PARTY_TYPE_PT20_CLAIMANT. */
    public static final String PARTY_TYPE_PT20_CLAIMANT = "PT 20 CLMT";
    
    /** The Constant PARTY_TYPE_PT20_DEFENDANT. */
    public static final String PARTY_TYPE_PT20_DEFENDANT = "PT 20 DEF";
    
    /** The Constant PARTY_TYPE_APPLICANT. */
    public static final String PARTY_TYPE_APPLICANT = "APPLICANT";
    
    /** The Constant PARTY_TYPE_COMPANY. */
    public static final String PARTY_TYPE_COMPANY = "COMPANY";
    
    /** The Constant PARTY_TYPE_CREDITOR. */
    public static final String PARTY_TYPE_CREDITOR = "CREDITOR";
    
    /** The Constant PARTY_TYPE_DEBTOR. */
    public static final String PARTY_TYPE_DEBTOR = "DEBTOR";
    
    /** The Constant PARTY_TYPE_INSOLV_PRACT. */
    public static final String PARTY_TYPE_INSOLV_PRACT = "INS PRAC";
    
    /** The Constant PARTY_TYPE_OFF_REC. */
    public static final String PARTY_TYPE_OFF_REC = "OFF REC";
    
    /** The Constant PARTY_TYPE_PETITIONER. */
    public static final String PARTY_TYPE_PETITIONER = "PETITIONER";
    
    /** The Constant PARTY_TYPE_TRUSTEE. */
    public static final String PARTY_TYPE_TRUSTEE = "TRUSTEE";

    /** The Constant TABBED_PAGE_SOLICITOR. */
    // Tabbed Page constants
    public static final int TABBED_PAGE_SOLICITOR = 2;
    
    /** The Constant TABBED_PAGE_CLAIMANT. */
    public static final int TABBED_PAGE_CLAIMANT = 1;
    
    /** The Constant TABBED_PAGE_MEDIATION. */
    public static final int TABBED_PAGE_MEDIATION = 3;

    /** The Constant ERR_INVALID_NEWCASE1. */
    // Public Error Messages
    public static final String ERR_INVALID_NEWCASE1 = "New cases should be in the format NLLNNNNN or LLNNNNNN.";
    
    /** The Constant ERR_INVALID_NEWCASE2. */
    public static final String ERR_INVALID_NEWCASE2 =
            "New cases should be in the format LNNLLNNN (first character cannot be I or O) or NNNLLNNN.";
    
    /** The Constant ERR_INVALID_EXISTINGCASE. */
    public static final String ERR_INVALID_EXISTINGCASE =
            "The case number entered does not match a valid 8 character format.";

    /** The text case number. */
    // Private field identifiers
    private String TEXT_CASE_NUMBER = "Header_CaseNumber";
    
    /** The auto case type. */
    private String AUTO_CASE_TYPE = "Header_CaseType";
    
    /** The text case status. */
    private String TEXT_CASE_STATUS = "Header_CaseStatus";
    
    /** The text insolv number. */
    private String TEXT_INSOLV_NUMBER = "Header_InsolvNo";
    
    /** The text insolv year. */
    private String TEXT_INSOLV_YEAR = "Header_InsolvYear";
    
    /** The text owningcourt code. */
    private String TEXT_OWNINGCOURT_CODE = "Header_OwningCourtCode";
    
    /** The text preferredcourt code. */
    private String TEXT_PREFERREDCOURT_CODE = "Header_PreferredCourtCode";
    
    /** The auto preferredcourt name. */
    private String AUTO_PREFERREDCOURT_NAME = "Header_PreferredCourtName";
    
    /** The sel track. */
    private String SEL_TRACK = "Header_CaseAllocatedTo";
    
    /** The sel party type. */
    private String SEL_PARTY_TYPE = "Master_PartyType";
    
    /** The text nonsol party code. */
    private String TEXT_NONSOL_PARTY_CODE = "LitigiousParty_Code";
    
    /** The text nonsol party name. */
    private String TEXT_NONSOL_PARTY_NAME = "LitigiousParty_Name";
    
    /** The text nonsol party addr1. */
    private String TEXT_NONSOL_PARTY_ADDR1 = "LitigiousParty_ContactDetails_Address_Line1";
    
    /** The text nonsol party addr2. */
    private String TEXT_NONSOL_PARTY_ADDR2 = "LitigiousParty_ContactDetails_Address_Line2";
    
    /** The text nonsol party addr3. */
    private String TEXT_NONSOL_PARTY_ADDR3 = "LitigiousParty_ContactDetails_Address_Line3";
    
    /** The text nonsol party addr4. */
    private String TEXT_NONSOL_PARTY_ADDR4 = "LitigiousParty_ContactDetails_Address_Line4";
    
    /** The text nonsol party addr5. */
    private String TEXT_NONSOL_PARTY_ADDR5 = "LitigiousParty_ContactDetails_Address_Line5";
    
    /** The text nonsol party postcode. */
    private String TEXT_NONSOL_PARTY_POSTCODE = "LitigiousParty_ContactDetails_Address_Postcode";
    
    /** The text nonsol party dateofservice. */
    private String TEXT_NONSOL_PARTY_DATEOFSERVICE = "LitigiousParty_DateOfService";
    
    /** The text nonsol party dateofbirth. */
    private String TEXT_NONSOL_PARTY_DATEOFBIRTH = "LitigiousParty_DateOfBirth";
    
    /** The chk nonsol party confidential. */
    private String CHK_NONSOL_PARTY_CONFIDENTIAL = "LitigiousParty_Confidential";
    
    private String SEL_SELECT_SOLICITOR = "LitigiousParty_SelectSolicitor";
    
    /** The text sol party addr1. */
    private String TEXT_SOL_PARTY_ADDR1 = "SolicitorParty_ContactDetails_Address_Line1";
    
    /** The text sol party addr2. */
    private String TEXT_SOL_PARTY_ADDR2 = "SolicitorParty_ContactDetails_Address_Line2";
    
    /** The text sol party addr3. */
    private String TEXT_SOL_PARTY_ADDR3 = "SolicitorParty_ContactDetails_Address_Line3";
    
    /** The text sol party addr4. */
    private String TEXT_SOL_PARTY_ADDR4 = "SolicitorParty_ContactDetails_Address_Line4";
    
    /** The text sol party addr5. */
    private String TEXT_SOL_PARTY_ADDR5 = "SolicitorParty_ContactDetails_Address_Line5";
    
    /** The text sol party postcode. */
    private String TEXT_SOL_PARTY_POSTCODE = "SolicitorParty_ContactDetails_Address_Postcode";
    
    /** The text mediation name. */
    private String TEXT_MEDIATION_NAME = "Mediation_ContactName";
    
    /** The text mediation tel. */
    private String TEXT_MEDIATION_TEL = "Mediation_TelephoneNumber";
    
    /** The text mediation email. */
    private String TEXT_MEDIATION_EMAIL = "Mediation_EmailAddress";
    
    /** The zoom mediation availability. */
    private String ZOOM_MEDIATION_AVAILABILITY = "Mediation_Availability";
    
    /** The zoom mediation notes. */
    private String ZOOM_MEDIATION_NOTES = "Mediation_Notes";
    
    /** The chk nonsol party welsh. */
    private String CHK_NONSOL_PARTY_WELSH = "LitigiousParty_ContactDetails_TranslationToWelsh";
    
    /** The text sol party code. */
    private String TEXT_SOL_PARTY_CODE = "SolicitorParty_Code";
    
    /** The text sol party name. */
    private String TEXT_SOL_PARTY_NAME = "SolicitorParty_Name";
    
    /** The date date req received. */
    private String DATE_DATE_REQ_RECEIVED = "DetailsOfClaim_DateRequestReceived";
    
    /** The text amount claimed. */
    private String TEXT_AMOUNT_CLAIMED = "DetailsOfClaim_AmountClaimed";
    
    /** The text court fee. */
    private String TEXT_COURT_FEE = "DetailsOfClaim_CourtFee";
    
    /** The text solicitors costs. */
    private String TEXT_SOLICITORS_COSTS = "DetailsOfClaim_SolicitorsCosts";
    
    /** The date date of issue. */
    private String DATE_DATE_OF_ISSUE = "DetailsOfClaim_DateOfIssue";
    
    /** The text newsol party code. */
    private String TEXT_NEWSOL_PARTY_CODE = "New_Solicitor_Popup_Code";
    
    /** The text newsol party name. */
    private String TEXT_NEWSOL_PARTY_NAME = "New_Solicitor_Popup_Name";
    
    /** The text newsol party addr1. */
    private String TEXT_NEWSOL_PARTY_ADDR1 = "New_Solicitor_Popup_ContactDetails_Address_Line1";
    
    /** The text newsol party addr2. */
    private String TEXT_NEWSOL_PARTY_ADDR2 = "New_Solicitor_Popup_ContactDetails_Address_Line2";
    
    /** The text newsol party addr3. */
    private String TEXT_NEWSOL_PARTY_ADDR3 = "New_Solicitor_Popup_ContactDetails_Address_Line3";
    
    /** The text newsol party addr4. */
    private String TEXT_NEWSOL_PARTY_ADDR4 = "New_Solicitor_Popup_ContactDetails_Address_Line4";
    
    /** The text newsol party addr5. */
    private String TEXT_NEWSOL_PARTY_ADDR5 = "New_Solicitor_Popup_ContactDetails_Address_Line5";
    
    /** The text newsol party postcode. */
    private String TEXT_NEWSOL_PARTY_POSTCODE = "New_Solicitor_Popup_ContactDetails_Address_Postcode";
    
    /** The text cpsearch party name. */
    private String TEXT_CPSEARCH_PARTY_NAME = "CodedPartySearch_Name";
    
    /** The text new nonsol party addr1. */
    private String TEXT_NEW_NONSOL_PARTY_ADDR1 = "AddAddress_ContactDetails_Address_Line1";
    
    /** The text new nonsol party addr2. */
    private String TEXT_NEW_NONSOL_PARTY_ADDR2 = "AddAddress_ContactDetails_Address_Line2";
    
    /** The text new nonsol party addr3. */
    private String TEXT_NEW_NONSOL_PARTY_ADDR3 = "AddAddress_ContactDetails_Address_Line3";
    
    /** The text new nonsol party addr4. */
    private String TEXT_NEW_NONSOL_PARTY_ADDR4 = "AddAddress_ContactDetails_Address_Line4";
    
    /** The text new nonsol party addr5. */
    private String TEXT_NEW_NONSOL_PARTY_ADDR5 = "AddAddress_ContactDetails_Address_Line5";
    
    /** The text new nonsol party postcode. */
    private String TEXT_NEW_NONSOL_PARTY_POSTCODE = "AddAddress_ContactDetails_Address_Postcode";
    
    /** The date hearing date. */
    private String DATE_HEARING_DATE = "HearingDetails_Date";
    
    /** The auto hearing type. */
    private String AUTO_HEARING_TYPE = "HearingDetails_HearingType";
    
    /** The text hearing time. */
    private String TEXT_HEARING_TIME = "HearingDetails_Time";

    /** The grid parties. */
    // Private grid identifiers
    private String GRID_PARTIES = "masterGrid";
    
    /** The grid cpsearch results. */
    private String GRID_CPSEARCH_RESULTS = "CodedPartySearch_ResultsGrid";

    /** The tabbed area id. */
    // Tabbed area identifiers
    private String TABBED_AREA_ID = "myTabbedArea";
    
    /** The tab claimant page. */
    private String TAB_CLAIMANT_PAGE = "firstPage";
    
    /** The tab solicitor page. */
    private String TAB_SOLICITOR_PAGE = "secondPage";
    
    /** The tab mediation page. */
    private String TAB_MEDIATION_PAGE = "thirdPage";

    /** The btn save screen. */
    // Private button identifiers (Close Button defined in parent class)
    private String BTN_SAVE_SCREEN = "Status_SaveButton";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearButton";
    
    /** The btn add party. */
    private String BTN_ADD_PARTY = "Master_AddPartyButton";
    
    /** The btn remove party. */
    private String BTN_REMOVE_PARTY = "Master_RemovePartyButton";
    
    /** The btn add solicitor. */
    private String BTN_ADD_SOLICITOR = "LitigiousParty_AddSolicitorButton";
    
    /** The btn nonsol add address. */
    private String BTN_NONSOL_ADD_ADDRESS = "LitigiousParty_AddAddressButton";
    
    /** The btn details of claim. */
    private String BTN_DETAILS_OF_CLAIM = "Footer_DetailsOfClaimButton";
    
    /** The btn hearing details. */
    private String BTN_HEARING_DETAILS = "Footer_HearingDetailsButton";
    
    /** The btn possession address. */
    private String BTN_POSSESSION_ADDRESS = "Footer_OtherPossessionAddressButton";
    
    /** The btn detsofclaim ok. */
    private String BTN_DETSOFCLAIM_OK = "DetailsOfClaim_OkButton";
    
    /** The btn newsol ok. */
    private String BTN_NEWSOL_OK = "New_Solicitor_Popup_OkButton";
    
    /** The btn newsol cancel. */
    private String BTN_NEWSOL_CANCEL = "New_Solicitor_Popup_CancelButton";
    
    /** The btn sol lov. */
    private String BTN_SOL_LOV = "SolicitorParty_CodeLOVButton";
    
    /** The btn nonsol lov. */
    private String BTN_NONSOL_LOV = "LitigiousParty_CodeLOVButton";
    
    /** The btn cpsearch search. */
    private String BTN_CPSEARCH_SEARCH = "CodedPartySearch_SearchButton";
    
    /** The btn cpsearch ok. */
    private String BTN_CPSEARCH_OK = "CodedPartySearch_OkButton";
    
    /** The btn cpsearch cancel. */
    private String BTN_CPSEARCH_CANCEL = "CodedPartySearch_CancelButton";
    
    /** The btn notif close. */
    private String BTN_NOTIF_CLOSE = "Notification_CloseButton";
    
    /** The btn duplicate notice. */
    private String BTN_DUPLICATE_NOTICE = "NavBar_DuplicateNoticeButton";
    
    /** The btn owningcourt lov. */
    private String BTN_OWNINGCOURT_LOV = "Header_OwningCourtLOVButton";
    
    /** The btn preferredcourt lov. */
    private String BTN_PREFERREDCOURT_LOV = "Header_PreferredCourtLOVButton";
    
    /** The btn nav caseevents. */
    private String BTN_NAV_CASEEVENTS = "NavBar_EventsButton";
    
    /** The btn newaddress ok. */
    private String BTN_NEWADDRESS_OK = "AddAddress_OkButton";
    
    /** The btn newaddress cancel. */
    private String BTN_NEWADDRESS_CANCEL = "AddAddress_CancelButton";
    
    /** The btn addhearing ok. */
    private String BTN_ADDHEARING_OK = "HearingDetails_OkButton";

    /** The pop details of claim. */
    // Private Popup identifiers
    private String POP_DETAILS_OF_CLAIM = "Details_Of_Claim_Popup";
    
    /** The pop progress bar. */
    private String POP_PROGRESS_BAR = "ProgressBar_SubForm";
    
    /** The pop new solicitor. */
    private String POP_NEW_SOLICITOR = "addNewSolicitor_subform";
    
    /** The pop new address. */
    private String POP_NEW_ADDRESS = "addNewAddress_subform";
    
    /** The pop hearing details. */
    private String POP_HEARING_DETAILS = "hearingDetails_subform";
    
    /** The pop other possn address. */
    private String POP_OTHER_POSSN_ADDRESS = "otherPossnAddress_subform";
    
    /** The pop coded party search. */
    private String POP_CODED_PARTY_SEARCH = "codedPartySearch_subform";
    
    /** The pop notification. */
    private String POP_NOTIFICATION = "Notification_Date_Popup";
    
    /** The popup lov courts. */
    private String POPUP_LOV_COURTS = "CourtsLOVGrid";

    /** The new solicitor subform. */
    // Private subform objects
    private SubFormAdaptor newSolicitorSubform = null;
    
    /** The new address subform. */
    private SubFormAdaptor newAddressSubform = null;
    
    /** The hearing details subform. */
    private SubFormAdaptor hearingDetailsSubform = null;
    
    /** The other possn address subform. */
    private SubFormAdaptor otherPossnAddressSubform = null;
    
    /** The coded party search subform. */
    private SubFormAdaptor codedPartySearchSubform = null;

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC001CreateUpdateCaseUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Create and Update Case Details";
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        cMB.type (TEXT_CASE_NUMBER, pCaseNumber);
        cMB.waitForPageToLoad ();

        // Handle alerts associated with loading a case
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public String getCaseNumber ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CASE_NUMBER);
        return tA.getValue ();
    }

    /**
     * Gets the case status.
     *
     * @return the case status
     */
    public String getCaseStatus ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CASE_STATUS);
        return tA.getValue ();
    }

    /**
     * Checks if is case number valid.
     *
     * @return true, if is case number valid
     * @throws FrameworkException the framework exception
     */
    public boolean isCaseNumberValid () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_CASE_NUMBER).isValid ();
    }

    /**
     * Sets the cursor focus in the Case Number field.
     */
    public void setCaseNumberFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_CASE_NUMBER).focus ();
    }

    /**
     * Sets the insolvency number.
     *
     * @param pInsolvNumber the new insolvency number
     */
    public void setInsolvencyNumber (final String pInsolvNumber)
    {
        setTextFieldValue (TEXT_INSOLV_NUMBER, pInsolvNumber);
    }

    /**
     * Sets the insolvency year.
     *
     * @param pInsolvYear the new insolvency year
     */
    public void setInsolvencyYear (final String pInsolvYear)
    {
        setTextFieldValue (TEXT_INSOLV_YEAR, pInsolvYear);
    }

    /**
     * Gets the owning court code.
     *
     * @return the owning court code
     */
    public String getOwningCourtCode ()
    {
        return cMB.getTextInputAdaptor (TEXT_OWNINGCOURT_CODE).getValue ();
    }

    /**
     * Sets the owning court code.
     *
     * @param pCode the new owning court code
     */
    public void setOwningCourtCode (final String pCode)
    {
        setTextFieldValue (TEXT_OWNINGCOURT_CODE, pCode);
    }

    /**
     * Checks if is owning court code valid.
     *
     * @return true, if is owning court code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isOwningCourtCodeValid () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_OWNINGCOURT_CODE).isValid ();
    }

    /**
     * Gets the preferred court code.
     *
     * @return the preferred court code
     */
    public String getPreferredCourtCode ()
    {
        return cMB.getTextInputAdaptor (TEXT_PREFERREDCOURT_CODE).getValue ();
    }

    /**
     * Sets the preferred court code.
     *
     * @param pCode the new preferred court code
     */
    public void setPreferredCourtCode (final String pCode)
    {
        setTextFieldValue (TEXT_PREFERREDCOURT_CODE, pCode);
    }

    /**
     * Checks if is preferred court code valid.
     *
     * @return true, if is preferred court code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isPreferredCourtCodeValid () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_PREFERREDCOURT_CODE).isValid ();
    }

    /**
     * Checks if is preferred court code enabled.
     *
     * @return true, if is preferred court code enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isPreferredCourtCodeEnabled () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_PREFERREDCOURT_CODE).isEnabled ();
    }

    /**
     * Gets the preferred court name.
     *
     * @return the preferred court name
     */
    public String getPreferredCourtName ()
    {
        return cMB.getAutoCompleteAdaptor (AUTO_PREFERREDCOURT_NAME).getText ();
    }

    /**
     * Sets the preferred court name.
     *
     * @param pName the new preferred court name
     */
    public void setPreferredCourtName (final String pName)
    {
        cMB.getAutoCompleteAdaptor (AUTO_PREFERREDCOURT_NAME).setText (pName);
    }

    /**
     * Checks if is preferred court name enabled.
     *
     * @return true, if is preferred court name enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isPreferredCourtNameEnabled () throws FrameworkException
    {
        return cMB.getAutoCompleteAdaptor (AUTO_PREFERREDCOURT_NAME).isEnabled ();
    }

    /**
     * Checks if is preferred court LOV enabled.
     *
     * @return true, if is preferred court LOV enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isPreferredCourtLOVEnabled () throws FrameworkException
    {
        return cMB.getButtonAdaptor (BTN_PREFERREDCOURT_LOV).isEnabled ();
    }

    /**
     * Gets the track.
     *
     * @return the track
     */
    public String getTrack ()
    {
        return cMB.getSelectElementAdaptor (SEL_TRACK).getSelectedLabel ();
    }

    /**
     * Sets the track.
     *
     * @param pTrack the new track
     */
    public void setTrack (final String pTrack)
    {
        setSelectFieldValue (SEL_TRACK, pTrack);
    }

    /**
     * Checks if is track enabled.
     *
     * @return true, if is track enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isTrackEnabled () throws FrameworkException
    {
        return cMB.getSelectElementAdaptor (SEL_TRACK).isEnabled ();
    }

    /**
     * Checks if is track mandatory.
     *
     * @return true, if is track mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isTrackMandatory () throws FrameworkException
    {
        return cMB.getSelectElementAdaptor (SEL_TRACK).isMandatory ();
    }

    /**
     * Sets the case type.
     *
     * @param pCaseType the new case type
     * @throws FrameworkException the framework exception
     */
    public void setCaseType (final String pCaseType) throws FrameworkException
    {
        final AutoCompleteAdaptor caseTypeField = cMB.getAutoCompleteAdaptor (AUTO_CASE_TYPE);
        if ( !caseTypeField.isReadOnly ())
        {
            caseTypeField.setText (pCaseType);
            cMB.tab ();
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Gets the case type.
     *
     * @return the case type
     */
    public String getCaseType ()
    {
        final AutoCompleteAdaptor caseTypeField = cMB.getAutoCompleteAdaptor (AUTO_CASE_TYPE);
        return caseTypeField.getText ();
    }

    /**
     * Checks if is case type field valid.
     *
     * @return true, if is case type field valid
     * @throws FrameworkException the framework exception
     */
    public boolean isCaseTypeFieldValid () throws FrameworkException
    {
        final AutoCompleteAdaptor caseTypeField = cMB.getAutoCompleteAdaptor (AUTO_CASE_TYPE);
        return caseTypeField.isValid ();
    }

    /**
     * Sets the cursor focus in the Case Type field.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setCaseTypeFocus () throws FrameworkException
    {
        final AutoCompleteAdaptor caseTypeField = cMB.getAutoCompleteAdaptor (AUTO_CASE_TYPE);
        caseTypeField.focus ();
    }

    /**
     * Selects the owning court via the LOV subform.
     *
     * @param courtName Court name to filter on
     */
    public void selectOwningCourtFromLOV (final String courtName)
    {
        clickLOVSelect (BTN_OWNINGCOURT_LOV, POPUP_LOV_COURTS, "Court", courtName);
    }

    /**
     * Selects the preferred court via the LOV subform.
     *
     * @param courtName Court name to filter on
     */
    public void selectPreferredCourtFromLOV (final String courtName)
    {
        clickLOVSelect (BTN_PREFERREDCOURT_LOV, POPUP_LOV_COURTS, "Court", courtName);
    }

    /**
     * Sets the new party type.
     *
     * @param pPartyType the new new party type
     */
    public void setNewPartyType (final String pPartyType)
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_PARTY_TYPE);
        sA.clickValue (pPartyType);
    }

    /**
     * Checks if is new party type valid.
     *
     * @return true, if is new party type valid
     * @throws FrameworkException the framework exception
     */
    public boolean isNewPartyTypeValid () throws FrameworkException
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_PARTY_TYPE);
        return sA.isValid ();
    }

    /**
     * Function sets the party type and clicks the Add Party button.
     *
     * @param pPartyType The party type to create
     */
    public void addNewParty (final String pPartyType)
    {
        setNewPartyType (pPartyType);
        mClickButton (BTN_ADD_PARTY);
    }

    /**
     * Clicks the Remove Party button which removes the currently selected party in the grid
     * but only if they have not been committed to the database yet.
     *
     * @throws FrameworkException Thrown if problem checking enablement of remove button
     */
    public void removeSelectedParty () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_REMOVE_PARTY);
        if (bA.isEnabled ())
        {
            // Button is enabled which means the currently selected party can be removed
            bA.click ();
            if (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }
        }
    }

    /**
     * Sets the non sol party code.
     *
     * @param pCode the new non sol party code
     */
    public void setNonSolPartyCode (final String pCode)
    {
        setTextFieldValue (TEXT_NONSOL_PARTY_CODE, pCode);
    }

    /**
     * Checks if is non sol party code field enabled.
     *
     * @return true, if is non sol party code field enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isNonSolPartyCodeFieldEnabled () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_NONSOL_PARTY_CODE);
        return tA.isEnabled ();
    }

    /**
     * Checks if is non sol party code field valid.
     *
     * @return true, if is non sol party code field valid
     * @throws FrameworkException the framework exception
     */
    public boolean isNonSolPartyCodeFieldValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_NONSOL_PARTY_CODE);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the Non Solicitor Party Code field.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setNonSolPartyCodeFocus () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_NONSOL_PARTY_CODE);
        tA.focus ();
    }

    /**
     * Click non sol LOV button.
     */
    public void clickNonSolLOVButton ()
    {
        mClickButton (BTN_NONSOL_LOV);

        if (null == codedPartySearchSubform)
        {
            codedPartySearchSubform = cMB.getSubFormAdaptor (POP_CODED_PARTY_SEARCH);
        }
    }

    /**
     * Sets the non sol party name.
     *
     * @param pPartyName the new non sol party name
     */
    public void setNonSolPartyName (final String pPartyName)
    {
        setTextFieldValue (TEXT_NONSOL_PARTY_NAME, pPartyName);
    }

    /**
     * Gets the non sol party name.
     *
     * @return the non sol party name
     */
    public String getNonSolPartyName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_NONSOL_PARTY_NAME);
        return tA.getValue ();
    }

    /**
     * Checks if is non sol party name field read only.
     *
     * @return true, if is non sol party name field read only
     * @throws FrameworkException the framework exception
     */
    public boolean isNonSolPartyNameFieldReadOnly () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_NONSOL_PARTY_NAME);
        return tA.isReadOnly ();
    }

    /**
     * Sets the non sol addr line 1.
     *
     * @param pAddrLine the new non sol addr line 1
     */
    public void setNonSolAddrLine1 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_NONSOL_PARTY_ADDR1, pAddrLine);
    }

    /**
     * Sets the non sol addr line 2.
     *
     * @param pAddrLine the new non sol addr line 2
     */
    public void setNonSolAddrLine2 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_NONSOL_PARTY_ADDR2, pAddrLine);
    }

    /**
     * Sets the non sol addr line 3.
     *
     * @param pAddrLine the new non sol addr line 3
     */
    public void setNonSolAddrLine3 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_NONSOL_PARTY_ADDR3, pAddrLine);
    }

    /**
     * Sets the non sol addr line 4.
     *
     * @param pAddrLine the new non sol addr line 4
     */
    public void setNonSolAddrLine4 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_NONSOL_PARTY_ADDR4, pAddrLine);
    }

    /**
     * Sets the non sol addr line 5.
     *
     * @param pAddrLine the new non sol addr line 5
     */
    public void setNonSolAddrLine5 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_NONSOL_PARTY_ADDR5, pAddrLine);
    }

    /**
     * Sets the non sol postcode.
     *
     * @param pPostcode the new non sol postcode
     */
    public void setNonSolPostcode (final String pPostcode)
    {
        setTextFieldValue (TEXT_NONSOL_PARTY_POSTCODE, pPostcode);
    }

    /**
     * Sets the non sol welsh translation.
     *
     * @param pChecked the new non sol welsh translation
     */
    public void setNonSolWelshTranslation (final boolean pChecked)
    {
        setCheckboxFieldValue (CHK_NONSOL_PARTY_WELSH, pChecked);
    }

    /**
     * Sets the date of service.
     *
     * @param pDate the new date of service
     */
    public void setDateOfService (final String pDate)
    {
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (TEXT_NONSOL_PARTY_DATEOFSERVICE);
        dA.setDate (pDate);
    }

    /**
     * Checks if is non sol party do B field enabled.
     *
     * @return true, if is non sol party do B field enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isNonSolPartyDoBFieldEnabled () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_NONSOL_PARTY_DATEOFBIRTH);
        return tA.isEnabled ();
    }

    /**
     * Sets the non sol confidential.
     *
     * @param pChecked the new non sol confidential
     */
    public void setNonSolConfidential (final boolean pChecked)
    {
        setCheckboxFieldValue (CHK_NONSOL_PARTY_CONFIDENTIAL, pChecked);
    }
    /**
     * Directly sets the select solicitor field with the value supplied
     * @param pSolicitor The solicitor to select
     */
    public void setSelectSolicitor(final String pSolicitor)
    {
    	final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_SELECT_SOLICITOR);
        sA.clickLabel(pSolicitor);
    }
    
    /**
     * Checks if is non sol confidential field enabled.
     *
     * @return true, if is non sol confidential field enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isNonSolConfidentialFieldEnabled () throws FrameworkException
    {
        final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (CHK_NONSOL_PARTY_CONFIDENTIAL);
        return cA.isEnabled ();
    }

    /**
     * Adds the new non sol address.
     */
    public void addNewNonSolAddress ()
    {
        mClickButton (BTN_NONSOL_ADD_ADDRESS);

        if (null == newAddressSubform)
        {
            newAddressSubform = cMB.getSubFormAdaptor (POP_NEW_ADDRESS);
        }
    }

    /**
     * Sets the new non sol addr line 1.
     *
     * @param pAddr the new new non sol addr line 1
     * @throws FrameworkException the framework exception
     */
    public void setNewNonSolAddrLine1 (final String pAddr) throws FrameworkException
    {
        if (null != newAddressSubform && newAddressSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_NEW_NONSOL_PARTY_ADDR1);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new non sol addr line 2.
     *
     * @param pAddr the new new non sol addr line 2
     * @throws FrameworkException the framework exception
     */
    public void setNewNonSolAddrLine2 (final String pAddr) throws FrameworkException
    {
        if (null != newAddressSubform && newAddressSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_NEW_NONSOL_PARTY_ADDR2);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new non sol addr line 3.
     *
     * @param pAddr the new new non sol addr line 3
     * @throws FrameworkException the framework exception
     */
    public void setNewNonSolAddrLine3 (final String pAddr) throws FrameworkException
    {
        if (null != newAddressSubform && newAddressSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_NEW_NONSOL_PARTY_ADDR3);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new non sol addr line 4.
     *
     * @param pAddr the new new non sol addr line 4
     * @throws FrameworkException the framework exception
     */
    public void setNewNonSolAddrLine4 (final String pAddr) throws FrameworkException
    {
        if (null != newAddressSubform && newAddressSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_NEW_NONSOL_PARTY_ADDR4);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new non sol addr line 5.
     *
     * @param pAddr the new new non sol addr line 5
     * @throws FrameworkException the framework exception
     */
    public void setNewNonSolAddrLine5 (final String pAddr) throws FrameworkException
    {
        if (null != newAddressSubform && newAddressSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_NEW_NONSOL_PARTY_ADDR5);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new non sol addr postcode.
     *
     * @param pAddr the new new non sol addr postcode
     * @throws FrameworkException the framework exception
     */
    public void setNewNonSolAddrPostcode (final String pAddr) throws FrameworkException
    {
        if (null != newAddressSubform && newAddressSubform.isVisible ())
        {
            final TextInputAdaptor tA =
                    (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_NEW_NONSOL_PARTY_POSTCODE);
            tA.type (pAddr);
        }
    }

    /**
     * Click the Ok button in the New Address popup subform to add the Address.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void newNonSolAddressClickOk () throws FrameworkException
    {
        if (null != newAddressSubform && newAddressSubform.isVisible ())
        {
            ((ButtonAdaptor) newAddressSubform.getAdaptor (BTN_NEWADDRESS_OK)).click ();
        }
    }

    /**
     * Clicks the Cancel button in the New Address popup subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void newNonSolAddressClickCancel () throws FrameworkException
    {
        if (null != newAddressSubform && newAddressSubform.isVisible ())
        {
            ((ButtonAdaptor) newAddressSubform.getAdaptor (BTN_NEWADDRESS_CANCEL)).click ();
        }
    }

    /**
     * Sets the solicitor code.
     *
     * @param pCode the new solicitor code
     */
    public void setSolicitorCode (final String pCode)
    {
        setTextFieldValue (TEXT_SOL_PARTY_CODE, pCode);
    }

    /**
     * Checks if is solicitor code field valid.
     *
     * @return true, if is solicitor code field valid
     * @throws FrameworkException the framework exception
     */
    public boolean isSolicitorCodeFieldValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_SOL_PARTY_CODE);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the Solicitor Code field.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setSolicitorCodeFocus () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_SOL_PARTY_CODE);
        tA.focus ();
    }

    /**
     * Click solicitor LOV button.
     */
    public void clickSolicitorLOVButton ()
    {
        mClickButton (BTN_SOL_LOV);

        if (null == codedPartySearchSubform)
        {
            codedPartySearchSubform = cMB.getSubFormAdaptor (POP_CODED_PARTY_SEARCH);
        }
    }

    /**
     * Sets the solicitor name.
     *
     * @param pName the new solicitor name
     */
    public void setSolicitorName (final String pName)
    {
        setTextFieldValue (TEXT_SOL_PARTY_NAME, pName);
    }

    /**
     * Gets the solicitor name.
     *
     * @return the solicitor name
     */
    public String getSolicitorName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_SOL_PARTY_NAME);
        return tA.getValue ();
    }

    /**
     * Checks if is solicitor name field read only.
     *
     * @return true, if is solicitor name field read only
     * @throws FrameworkException the framework exception
     */
    public boolean isSolicitorNameFieldReadOnly () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_SOL_PARTY_NAME);
        return tA.isReadOnly ();
    }

    /**
     * Sets the sol addr line 1.
     *
     * @param pAddrLine the new sol addr line 1
     */
    public void setSolAddrLine1 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_SOL_PARTY_ADDR1, pAddrLine);
    }

    /**
     * Sets the sol addr line 2.
     *
     * @param pAddrLine the new sol addr line 2
     */
    public void setSolAddrLine2 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_SOL_PARTY_ADDR2, pAddrLine);
    }

    /**
     * Sets the sol addr line 3.
     *
     * @param pAddrLine the new sol addr line 3
     */
    public void setSolAddrLine3 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_SOL_PARTY_ADDR3, pAddrLine);
    }

    /**
     * Sets the sol addr line 4.
     *
     * @param pAddrLine the new sol addr line 4
     */
    public void setSolAddrLine4 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_SOL_PARTY_ADDR4, pAddrLine);
    }

    /**
     * Sets the sol addr line 5.
     *
     * @param pAddrLine the new sol addr line 5
     */
    public void setSolAddrLine5 (final String pAddrLine)
    {
        setTextFieldValue (TEXT_SOL_PARTY_ADDR5, pAddrLine);
    }

    /**
     * Sets the sol postcode.
     *
     * @param pPostcode the new sol postcode
     */
    public void setSolPostcode (final String pPostcode)
    {
        setTextFieldValue (TEXT_SOL_PARTY_POSTCODE, pPostcode);
    }

    /**
     * Sets the mediation contact name.
     *
     * @param pContactName the new mediation contact name
     */
    public void setMediationContactName (final String pContactName)
    {
        setTextFieldValue (TEXT_MEDIATION_NAME, pContactName);
    }

    /**
     * Gets the mediation contact name.
     *
     * @return the mediation contact name
     */
    public String getMediationContactName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_MEDIATION_NAME);
        return tA.getValue ();
    }

    /**
     * Sets the mediation tel no.
     *
     * @param pTel the new mediation tel no
     */
    public void setMediationTelNo (final String pTel)
    {
        setTextFieldValue (TEXT_MEDIATION_TEL, pTel);
    }

    /**
     * Gets the mediation tel no.
     *
     * @return the mediation tel no
     */
    public String getMediationTelNo ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_MEDIATION_TEL);
        return tA.getValue ();
    }

    /**
     * Sets the mediation email.
     *
     * @param pEmail the new mediation email
     */
    public void setMediationEmail (final String pEmail)
    {
        setTextFieldValue (TEXT_MEDIATION_EMAIL, pEmail);
    }

    /**
     * Gets the mediation email.
     *
     * @return the mediation email
     */
    public String getMediationEmail ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_MEDIATION_EMAIL);
        return tA.getValue ();
    }

    /**
     * Checks if is mediation email field valid.
     *
     * @return true, if is mediation email field valid
     * @throws FrameworkException the framework exception
     */
    public boolean isMediationEmailFieldValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_MEDIATION_EMAIL);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the Mediation Email field.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setMediationEmailFocus () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_MEDIATION_EMAIL);
        tA.focus ();
    }

    /**
     * Sets the mediation notes.
     *
     * @param pNotes the new mediation notes
     */
    public void setMediationNotes (final String pNotes)
    {
        final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (ZOOM_MEDIATION_NOTES);
        zA.setText (pNotes);
    }

    /**
     * Gets the mediation notes.
     *
     * @return the mediation notes
     */
    public String getMediationNotes ()
    {
        final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (ZOOM_MEDIATION_NOTES);
        return zA.getText ();
    }

    /**
     * Sets the mediation availability.
     *
     * @param pAvailability the new mediation availability
     */
    public void setMediationAvailability (final String pAvailability)
    {
        final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (ZOOM_MEDIATION_AVAILABILITY);
        zA.setText (pAvailability);
    }

    /**
     * Gets the mediation availability.
     *
     * @return the mediation availability
     */
    public String getMediationAvailability ()
    {
        final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (ZOOM_MEDIATION_AVAILABILITY);
        return zA.getText ();
    }

    /**
     * Launches the New Solicitor popup subform.
     */
    public void addNewSolicitor ()
    {
        mClickButton (BTN_ADD_SOLICITOR);

        if (null == newSolicitorSubform)
        {
            newSolicitorSubform = cMB.getSubFormAdaptor (POP_NEW_SOLICITOR);
        }
    }

    /**
     * Sets the new solicitor code.
     *
     * @param pCode the new new solicitor code
     * @throws FrameworkException the framework exception
     */
    public void setNewSolicitorCode (final String pCode) throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_CODE);
            tA.type (pCode);
        }
    }

    /**
     * Checks if is new solicitor code field valid.
     *
     * @return true, if is new solicitor code field valid
     * @throws FrameworkException the framework exception
     */
    public boolean isNewSolicitorCodeFieldValid () throws FrameworkException
    {
        boolean blnValid = false;
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_CODE);
            blnValid = tA.isValid ();
        }
        return blnValid;
    }

    /**
     * Sets the cursor focus in the Solicitor Code field in the New Solicitor popup subform.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setNewSolicitorCodeFocus () throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_CODE);
            tA.focus ();
        }
    }

    /**
     * Sets the new solicitor name.
     *
     * @param pName the new new solicitor name
     * @throws FrameworkException the framework exception
     */
    public void setNewSolicitorName (final String pName) throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_NAME);
            tA.type (pName);
        }
    }

    /**
     * Gets the new solicitor name.
     *
     * @return the new solicitor name
     * @throws FrameworkException the framework exception
     */
    public String getNewSolicitorName () throws FrameworkException
    {
        String retValue = "";
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_NAME);
            retValue = tA.getValue ();
        }
        return retValue;
    }

    /**
     * Checks if is new solicitor name field read only.
     *
     * @return true, if is new solicitor name field read only
     * @throws FrameworkException the framework exception
     */
    public boolean isNewSolicitorNameFieldReadOnly () throws FrameworkException
    {
        boolean blnReadOnly = false;
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_NAME);
            blnReadOnly = tA.isReadOnly ();
        }
        return blnReadOnly;
    }

    /**
     * Sets the new solicitor addr line 1.
     *
     * @param pAddr the new new solicitor addr line 1
     * @throws FrameworkException the framework exception
     */
    public void setNewSolicitorAddrLine1 (final String pAddr) throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_ADDR1);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new solicitor addr line 2.
     *
     * @param pAddr the new new solicitor addr line 2
     * @throws FrameworkException the framework exception
     */
    public void setNewSolicitorAddrLine2 (final String pAddr) throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_ADDR2);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new solicitor addr line 3.
     *
     * @param pAddr the new new solicitor addr line 3
     * @throws FrameworkException the framework exception
     */
    public void setNewSolicitorAddrLine3 (final String pAddr) throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_ADDR3);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new solicitor addr line 4.
     *
     * @param pAddr the new new solicitor addr line 4
     * @throws FrameworkException the framework exception
     */
    public void setNewSolicitorAddrLine4 (final String pAddr) throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_ADDR4);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new solicitor addr line 5.
     *
     * @param pAddr the new new solicitor addr line 5
     * @throws FrameworkException the framework exception
     */
    public void setNewSolicitorAddrLine5 (final String pAddr) throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_ADDR5);
            tA.type (pAddr);
        }
    }

    /**
     * Sets the new solicitor postcode.
     *
     * @param pPostcode the new new solicitor postcode
     * @throws FrameworkException the framework exception
     */
    public void setNewSolicitorPostcode (final String pPostcode) throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newSolicitorSubform.getAdaptor (TEXT_NEWSOL_PARTY_POSTCODE);
            tA.type (pPostcode);
        }
    }

    /**
     * Click the Ok button in the New Solicitor popup subform to add the Solicitor.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void newSolicitorClickOk () throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            ((ButtonAdaptor) newSolicitorSubform.getAdaptor (BTN_NEWSOL_OK)).click ();
        }
    }

    /**
     * Clicks the Cancel button in the New Solicitor popup subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void newSolicitorClickCancel () throws FrameworkException
    {
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            ((ButtonAdaptor) newSolicitorSubform.getAdaptor (BTN_NEWSOL_CANCEL)).click ();
        }
    }

    /**
     * Gets the new solicitor status bar text.
     *
     * @return the new solicitor status bar text
     */
    public String getNewSolicitorStatusBarText ()
    {
        String statusBarText = "";
        if (null != newSolicitorSubform && newSolicitorSubform.isVisible ())
        {
            // Retrieve the status bar text from the subform
            statusBarText = cMB.getSubFormAdaptor (POP_NEW_SOLICITOR).getStatusBarText ();
        }
        return statusBarText;
    }

    /**
     * Raises the Details of Claim Popup via clicking the Details of Claim button.
     */
    public void raiseDetailsOfClaimPopup ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_DETAILS_OF_CLAIM);
        if ( !pA.isVisible ())
        {
            // Popup not already visible, click button to raise
            mClickButton (BTN_DETAILS_OF_CLAIM);
        }
    }

    /**
     * Sets the date request received.
     *
     * @param pDate the new date request received
     */
    public void setDateRequestReceived (final String pDate)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_DETAILS_OF_CLAIM);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_DATE_REQ_RECEIVED);
            dA.setDate (pDate);
        }
    }

    /**
     * Sets the amount claimed.
     *
     * @param pAmount the new amount claimed
     */
    public void setAmountClaimed (final String pAmount)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_DETAILS_OF_CLAIM);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setTextFieldValue (TEXT_AMOUNT_CLAIMED, pAmount);
        }
    }

    /**
     * Sets the court fee.
     *
     * @param pAmount the new court fee
     */
    public void setCourtFee (final String pAmount)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_DETAILS_OF_CLAIM);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setTextFieldValue (TEXT_COURT_FEE, pAmount);
        }
    }

    /**
     * Sets the solicitors costs.
     *
     * @param pAmount the new solicitors costs
     */
    public void setSolicitorsCosts (final String pAmount)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_DETAILS_OF_CLAIM);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setTextFieldValue (TEXT_SOLICITORS_COSTS, pAmount);
        }
    }

    /**
     * Sets the date of issue.
     *
     * @param pDate the new date of issue
     */
    public void setDateOfIssue (final String pDate)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_DETAILS_OF_CLAIM);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_DATE_OF_ISSUE);
            dA.setDate (pDate);
        }
    }

    /**
     * Clicks the Ok button on the Details of Claim popup.
     */
    public void clickDetailsOfClaimOk ()
    {
        mClickButton (BTN_DETSOFCLAIM_OK);
    }

    /**
     * Raises the Hearing Details popup subform by clicking the Hearing Details
     * button, but only if the button is enabled.
     *
     * @throws FrameworkException Thrown if problem with checking button enablement
     */
    public void raiseHearingDetailsPopup () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_HEARING_DETAILS);
        if (bA.isEnabled ())
        {
            bA.click ();
            cMB.waitForPageToLoad ();
            // Initialise the hearingDetailsSubform variable
            if (null == hearingDetailsSubform)
            {
                hearingDetailsSubform = cMB.getSubFormAdaptor (POP_HEARING_DETAILS);
            }
        }
    }

    /**
     * Sets the hearing date.
     *
     * @param pDate the new hearing date
     * @throws FrameworkException the framework exception
     */
    public void setHearingDate (final String pDate) throws FrameworkException
    {
        if (null != hearingDetailsSubform && hearingDetailsSubform.isVisible ())
        {
            final DatePickerAdaptor dA = (DatePickerAdaptor) hearingDetailsSubform.getAdaptor (DATE_HEARING_DATE);
            dA.setDate (pDate);
        }
    }

    /**
     * Sets the hearing type.
     *
     * @param pType the new hearing type
     * @throws FrameworkException the framework exception
     */
    public void setHearingType (final String pType) throws FrameworkException
    {
        if (null != hearingDetailsSubform && hearingDetailsSubform.isVisible ())
        {
            final AutoCompleteAdaptor aA = (AutoCompleteAdaptor) hearingDetailsSubform.getAdaptor (AUTO_HEARING_TYPE);
            aA.setText (pType);
        }
    }

    /**
     * Sets the hearing time.
     *
     * @param pAddr the new hearing time
     * @throws FrameworkException the framework exception
     */
    public void setHearingTime (final String pAddr) throws FrameworkException
    {
        if (null != hearingDetailsSubform && hearingDetailsSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) hearingDetailsSubform.getAdaptor (TEXT_HEARING_TIME);
            tA.type (pAddr);
        }
    }

    /**
     * Click the Ok button in the Add Hearing popup subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void addHearingClickOk () throws FrameworkException
    {
        if (null != hearingDetailsSubform && hearingDetailsSubform.isVisible ())
        {
            ((ButtonAdaptor) hearingDetailsSubform.getAdaptor (BTN_ADDHEARING_OK)).click ();
        }
    }

    /**
     * Checks if is other possn address button enabled.
     *
     * @return true, if is other possn address button enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isOtherPossnAddressButtonEnabled () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_POSSESSION_ADDRESS);
        return bA.isEnabled ();
    }

    /**
     * Raises the Other Possession Address popup subform by clicking the appropriate
     * button, but only if the button is enabled.
     *
     * @throws FrameworkException Thrown if problem with checking button enablement
     */
    public void raiseOtherPossnAddressPopup () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_POSSESSION_ADDRESS);
        if (bA.isEnabled ())
        {
            bA.click ();
            cMB.waitForPageToLoad ();
            // Initialise the otherPossnAddressSubform variable
            if (null == otherPossnAddressSubform)
            {
                otherPossnAddressSubform = cMB.getSubFormAdaptor (POP_OTHER_POSSN_ADDRESS);
            }
        }
    }

    /**
     * Clicks the Save Button in the status bar.
     */
    public void saveCase ()
    {
        mClickButton (BTN_SAVE_SCREEN);

        // Handle alerts
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Clicks the Save Button in the status bar and handles any Word Processing
     * typically associated with Creating a Case.
     *
     * @param expectOutput true if user expecting a word processing output after save, else false
     */
    public void saveCase (final boolean expectOutput)
    {
        cMB.getButtonAdaptor (BTN_SAVE_SCREEN).click ();

        // If expecting output to be generated, handle WP progress bar popup
        if (expectOutput)
        {
            // Loop until the WP popup appears
            final SubFormAdaptor progressPopup = cMB.getSubFormAdaptor (POP_PROGRESS_BAR);
            while ( !progressPopup.isVisible ())
            {
                if (cMB.isConfirmationPresent ())
                {
                    cMB.getConfirmation ();
                }
                if (cMB.isAlertPresent ())
                {
                    cMB.getAlert ();
                }
                cMB.waitForPageToLoad ();
            }

            // Loop until the reports popup disappears (handle JavaScript confirms)
            while (progressPopup.isVisible ())
            {
                if (cMB.isConfirmationPresent ())
                {
                    cMB.getConfirmation ();
                }
                if (cMB.isAlertPresent ())
                {
                    cMB.getAlert ();
                }
                cMB.waitForPageToLoad ();
            }
        }
    }

    /**
     * Clicks the clear button to clear the details on the screen.
     */
    public void clickClearButton ()
    {
        cMB.getButtonAdaptor (BTN_CLEAR_SCREEN).click ();
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        cMB.waitForPageToLoad ();
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
    }

    /**
     * Navigates to the Case Events screen.
     */
    public void navigateCaseEvents ()
    {
        mClickButton (BTN_NAV_CASEEVENTS);
    }

    /**
     * Automatically generates a default case which has a case type of
     * CLAIM - SPEC ONLY, One Claimant with a name and 2 address lines, a Solicitor
     * for the Claimant with a name and 2 address lines and a Defendant with a name
     * and two address lines.
     *
     * @param pCaseNumber The Case Number of the Case to create
     */
    public void createDefaultCase (final String pCaseNumber)
    {
        try
        {
            // Enter Case Number which does not already exist
            setCaseNumber (pCaseNumber);

            // Set Case Type
            setCaseType (CASE_TYPE_CLAIM_SPEC_ONLY);

            // Add Claimant
            addNewParty (PARTY_TYPE_CLAIMANT);
            setNonSolPartyName ("CLAIMANT ONE NAME");
            setNonSolAddrLine1 ("C1 ADLINE1");
            setNonSolAddrLine2 ("C1 ADLINE2");

            // Add Solicitor to Claimant
            addNewSolicitor ();
            setNewSolicitorName ("CLAIMANT1 SOLICITOR NAME");
            setNewSolicitorAddrLine1 ("CSOL ADLINE1");
            setNewSolicitorAddrLine2 ("CSOL ADLINE2");
            newSolicitorClickOk ();

            // Add Defendant
            addNewParty (PARTY_TYPE_DEFENDANT);
            setNonSolPartyName ("DEFENDANT ONE NAME");
            setNonSolAddrLine1 ("D1 ADLINE1");
            setNonSolAddrLine2 ("D1 ADLINE2");

            // Raise Details of Claim Popup
            raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
            mClickButton (BTN_DETSOFCLAIM_OK);

            // Click Save and handle WP processing
            saveCase (true);
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
        }
    }

    /**
     * Automatically generates a case which has One Claimant with a name and 2 address lines,
     * a Solicitor for the Claimant with a name and 2 address lines and a Defendant with a name
     * and two address lines. Welsh translation and case type are configurable.
     *
     * @param pCaseNumber The Case Number of the Case to create
     * @param pCaseType The Case Type for the new case
     * @param pWelshInd Indicates whether or not the parties want translation to Welsh
     */
    public void createDefaultCase (final String pCaseNumber, final String pCaseType, final boolean pWelshInd)
    {
        try
        {
            // Enter Case Number which does not already exist
            setCaseNumber (pCaseNumber);

            // Set Case Type
            setCaseType (pCaseType);

            // Add Claimant
            addNewParty (PARTY_TYPE_CLAIMANT);
            setNonSolPartyName ("CLAIMANT ONE NAME");
            setNonSolAddrLine1 ("C1 ADLINE1");
            setNonSolAddrLine2 ("C1 ADLINE2");
            setNonSolWelshTranslation (pWelshInd);

            // Add Solicitor to Claimant
            addNewSolicitor ();
            setNewSolicitorName ("CLAIMANT1 SOLICITOR NAME");
            setNewSolicitorAddrLine1 ("CSOL ADLINE1");
            setNewSolicitorAddrLine2 ("CSOL ADLINE2");
            newSolicitorClickOk ();

            // Add Defendant
            addNewParty (PARTY_TYPE_DEFENDANT);
            setNonSolPartyName ("DEFENDANT ONE NAME");
            setNonSolAddrLine1 ("D1 ADLINE1");
            setNonSolAddrLine2 ("D1 ADLINE2");
            setNonSolWelshTranslation (pWelshInd);

            // Raise Details of Claim Popup
            raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
            mClickButton (BTN_DETSOFCLAIM_OK);

            // Click Save and handle WP processing
            saveCase (true);
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
        }
    }
    
    /**
     * Automatically generates a case which has One Claimant with a name and 2 address lines,
     * a Solicitor for the Claimant with a name and 2 address lines and a Defendant with a name
     * and two address lines. Welsh translation and case type are configurable.
     *
     * @param pCaseNumber   The Case Number of the Case to create
     * @param pCaseType     The Case Type for the new case
     * @param pWelshInd     Indicates whether or not the parties want translation to Welsh
     */
    public void createDefaultCase2(final String pCaseNumber, final String pCaseType, final boolean pWelshInd)
    {
        try
        {
            // Enter Case Number which does not already exist
            setCaseNumber(pCaseNumber);

            // Set Case Type
            setCaseType(pCaseType);

            // Add Claimant
            addNewParty(PARTY_TYPE_CLAIMANT);
            setNonSolPartyName("CLAIMANT ONE NAME");
            setNonSolAddrLine1("C1 ADLINE1");
            setNonSolAddrLine2("C1 ADLINE2");
            setNonSolWelshTranslation(pWelshInd);

            // Add Defendant
            addNewParty(PARTY_TYPE_DEFENDANT);
            setNonSolPartyName("DEFENDANT ONE NAME");
            setNonSolAddrLine1("D1 ADLINE1");
            setNonSolAddrLine2("D1 ADLINE2");
            setNonSolWelshTranslation(pWelshInd);

            // Raise Details of Claim Popup
            raiseDetailsOfClaimPopup();

            // Close Details of Claim Popup
            mClickButton(BTN_DETSOFCLAIM_OK);

            // Click Save and handle WP processing
            saveCase();
        }
        catch ( final FrameworkException e )
        {
            e.printStackTrace ();
        }
    }
    
    /**
     * Automatically generates a case which has One Claimant with a name and 2 address lines,
     * a Solicitor for the Claimant with a name and 2 address lines and a Defendant with a name
     * and two address lines. Welsh translation and case type are configurable. Case will also include a
     * hearing
     *
     * @param pCaseNumber The Case Number of the Case to create
     * @param pCaseType The Case Type for the new case
     * @param pWelshInd Indicates whether or not the parties want translation to Welsh
     */
    public void createDefaultCaseWithHearing (final String pCaseNumber, final String pCaseType, final boolean pWelshInd)
    {
        try
        {
            // Enter Case Number which does not already exist
            setCaseNumber (pCaseNumber);

            // Set Case Type
            setCaseType (pCaseType);

            // Add Claimant
            addNewParty (PARTY_TYPE_CLAIMANT);
            setNonSolPartyName ("CLAIMANT NAME");
            setNonSolAddrLine1 ("CLAIMANT ADLINE1");
            setNonSolAddrLine2 ("CLAIMANT ADLINE2");
            setNonSolWelshTranslation (pWelshInd);

            // Add Solicitor to Claimant
            addNewSolicitor ();
            setNewSolicitorName ("CLAIMANT SOLICITOR NAME");
            setNewSolicitorAddrLine1 ("CSOL ADLINE1");
            setNewSolicitorAddrLine2 ("CSOL ADLINE2");
            newSolicitorClickOk ();

            // Add Defendant
            addNewParty (PARTY_TYPE_DEFENDANT);
            setNonSolPartyName ("DEFENDANT NAME");
            setNonSolAddrLine1 ("DEFENDANT ADLINE1");
            setNonSolAddrLine2 ("DEFENDANT ADLINE2");
            setNonSolWelshTranslation (pWelshInd);

            // Raise Details of Claim Popup
            raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
            mClickButton (BTN_DETSOFCLAIM_OK);

            // Enter Hearing Details
            raiseHearingDetailsPopup ();
            setHearingDate (AbstractBaseUtils.now ());
            setHearingType ("APPEAL");
            setHearingTime ("12:00");
            addHearingClickOk ();

            // Click Save and handle WP processing
            saveCase (true);
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
        }
    }

    /**
     * Automatically generates a case which has One Claimant with a name and 2 address lines,
     * a Solicitor for the Claimant with a name and 2 address lines and a Defendant with a name
     * and two address lines. Welsh translation and case type are configurable. This variant assumes
     * that the output will cause navigation to the variable data screen.
     *
     * @param pCaseNumber The Case Number of the Case to create
     * @param pCaseType The Case Type for the new case
     * @param pWelshInd Indicates whether or not the parties want translation to Welsh
     */
    public void createDefaultCaseVD (final String pCaseNumber, final String pCaseType, final boolean pWelshInd)
    {
        try
        {
            // Enter Case Number which does not already exist
            setCaseNumber (pCaseNumber);

            // Set Case Type
            setCaseType (pCaseType);

            // Add Claimant
            addNewParty (PARTY_TYPE_CLAIMANT);
            setNonSolPartyName ("CLAIMANT ONE NAME");
            setNonSolAddrLine1 ("C1 ADLINE1");
            setNonSolAddrLine2 ("C1 ADLINE2");
            setNonSolWelshTranslation (pWelshInd);

            // Add Solicitor to Claimant
            addNewSolicitor ();
            setNewSolicitorName ("CLAIMANT1 SOLICITOR NAME");
            setNewSolicitorAddrLine1 ("CSOL ADLINE1");
            setNewSolicitorAddrLine2 ("CSOL ADLINE2");
            newSolicitorClickOk ();

            // Add Defendant
            addNewParty (PARTY_TYPE_DEFENDANT);
            setNonSolPartyName ("DEFENDANT ONE NAME");
            setNonSolAddrLine1 ("D1 ADLINE1");
            setNonSolAddrLine2 ("D1 ADLINE2");
            setNonSolWelshTranslation (pWelshInd);

            // Raise Details of Claim Popup
            raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
            mClickButton (BTN_DETSOFCLAIM_OK);

            // Click Save and handle WP processing
            saveCase ();
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
        }
    }

    /**
     * Automatically generates a MAGS ORDER case which has One Claimant with a name and 2 address lines
     * and a Defendant with a name and two address lines.
     *
     * @param pCaseNumber The Case Number of the Case to create (LL/NNNNN)
     */
    public void createMAGSCase (final String pCaseNumber)
    {
        final UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;

        try
        {
            // Enter Case Number which does not already exist
            setCaseNumber (pCaseNumber);

            // Check the right MAGS ORDER format has been used, if so, Case Type will automatically
            // be populated with MAGS ORDER
            final AutoCompleteAdaptor caseTypeField = cMB.getAutoCompleteAdaptor (AUTO_CASE_TYPE);
            if (caseTypeField.getText ().equals ("MAGS ORDER"))
            {
                // Add Claimant
                addNewParty (PARTY_TYPE_CLAIMANT);
                setNonSolPartyName ("CLAIMANT ONE NAME");
                setNonSolAddrLine1 ("C1 ADLINE1");
                setNonSolAddrLine2 ("C1 ADLINE2");

                // Add Defendant
                addNewParty (PARTY_TYPE_DEFENDANT);
                setNonSolPartyName ("DEFENDANT ONE NAME");
                setNonSolAddrLine1 ("D1 ADLINE1");
                setNonSolAddrLine2 ("D1 ADLINE2");

                // Click Save and navigate to Create AE screen
                mClickButton (BTN_SAVE_SCREEN);

                // Initialise the Obligations screen object
                myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (cMB);

                // Loop until are in AE screen
                String pageTitle = cMB.getPageTitle ();
                while ( !pageTitle.equals (myUC091CreateUpdateAEUtils.getScreenTitle ()))
                {
                    cMB.waitForPageToLoad ();
                    if (cMB.isConfirmationPresent ())
                    {
                        cMB.getConfirmation ();
                    }
                    pageTitle = cMB.getPageTitle ();
                }

                // Click save to create AE
                myUC091CreateUpdateAEUtils.saveScreen ();

                // Loop until are back in Create Cases screen
                pageTitle = cMB.getPageTitle ();
                while ( !pageTitle.equals (mScreenTitle))
                {
                    cMB.waitForPageToLoad ();
                    if (cMB.isConfirmationPresent ())
                    {
                        cMB.getConfirmation ();
                    }
                    pageTitle = cMB.getPageTitle ();
                }
            }
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
        }
    }

    /**
     * Selects a party in the grid based upon the party name.
     *
     * @param pPartyName The name of the party to search for
     */
    public void selectPartyByName (final String pPartyName)
    {
        selectValueFromGrid (GRID_PARTIES, pPartyName);
    }

    /**
     * Enters search criteria into the Coded Party Search subform and clicks Search button to retrieve matches.
     *
     * @param pPartyName Search criteria to search on
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void enterCPSearchCriteria (final String pPartyName) throws FrameworkException
    {
        if (null != codedPartySearchSubform && codedPartySearchSubform.isVisible ())
        {
            // Enter search criteria and click Search button
            final TextInputAdaptor tA =
                    (TextInputAdaptor) codedPartySearchSubform.getAdaptor (TEXT_CPSEARCH_PARTY_NAME);
            tA.type (pPartyName);
            ((ButtonAdaptor) codedPartySearchSubform.getAdaptor (BTN_CPSEARCH_SEARCH)).click ();
            cMB.waitForPageToLoad ();
            while (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
                cMB.waitForPageToLoad ();
            }
        }
    }

    /**
     * Click the Ok button in the Coded Party Search subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void cpSearchSubformClickOk () throws FrameworkException
    {
        if (null != codedPartySearchSubform && codedPartySearchSubform.isVisible ())
        {
            ((ButtonAdaptor) codedPartySearchSubform.getAdaptor (BTN_CPSEARCH_OK)).click ();
        }
    }

    /**
     * Clicks the Cancel button in the Coded Party Search subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void cpSearchSubformClickCancel () throws FrameworkException
    {
        if (null != codedPartySearchSubform && codedPartySearchSubform.isVisible ())
        {
            ((ButtonAdaptor) codedPartySearchSubform.getAdaptor (BTN_CPSEARCH_CANCEL)).click ();
        }
    }

    /**
     * Selects the row in the results grid that matches the Coded Party Code specified.
     *
     * @param pCode The Coded Party Code to search for
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void selectCPSearchRecordByCode (final String pCode) throws FrameworkException
    {
        if (null != codedPartySearchSubform && codedPartySearchSubform.isVisible ())
        {
            selectValueFromSubformGrid (codedPartySearchSubform, GRID_CPSEARCH_RESULTS, pCode, 1);
        }
    }

    /**
     * Selects the row in the results grid that matches the Coded Party Name specified.
     *
     * @param pPartyName The Party Name to search for
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void selectCPSearchRecordByPartyName (final String pPartyName) throws FrameworkException
    {
        if (null != codedPartySearchSubform && codedPartySearchSubform.isVisible ())
        {
            selectValueFromSubformGrid (codedPartySearchSubform, GRID_CPSEARCH_RESULTS, pPartyName, 2);
        }
    }

    /**
     * Selects a row in the results grid by row number specified.
     *
     * @param rowNumber The row number to select (starts from 1)
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void selectCPSearchRecordByRowNumber (final int rowNumber) throws FrameworkException
    {
        ((GridAdaptor) codedPartySearchSubform.getAdaptor (GRID_CPSEARCH_RESULTS)).clickRow (rowNumber);
    }

    /**
     * Indicates whether or not a specified value exists in a specified column
     * in the Coded Party Search grid.
     *
     * @param pValue The String to search for in the grid
     * @param pCol The column number to search
     * @return True if the value is in the grid column, else false
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public boolean isValueInCPSearchResultsGrid (final String pValue, final int pCol) throws FrameworkException
    {
        boolean blnFound = false;
        if (null != codedPartySearchSubform && codedPartySearchSubform.isVisible ())
        {
            blnFound = isValueInSubformGridColumn (codedPartySearchSubform, GRID_CPSEARCH_RESULTS, pValue, pCol);
        }
        return blnFound;
    }

    /**
     * Clicks the Close button to close the Notification popup.
     */
    public void clickNotificationPopupClose ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_NOTIFICATION);
        if (pA.isVisible ())
        {
            mClickButton (BTN_NOTIF_CLOSE);
        }
    }

    /**
     * Clicks the Duplicate Notice button.
     */
    public void produceDuplicateNotice ()
    {
        mClickButton (BTN_DUPLICATE_NOTICE);
        cMB.waitForPageToLoad ();
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
    }

    /**
     * Selects a specified tabbed page on the Maintain CAse screen.
     *
     * @param page The tabbed page to display
     * @throws FrameworkException Exception thrown if problem showing page
     */
    public void selectTabbedPage (final int page) throws FrameworkException
    {
        final TabbedAreaAdaptor tAA = cMB.getTabbedAreaAdaptor (TABBED_AREA_ID);
        switch (page)
        {
            case TABBED_PAGE_CLAIMANT:
                tAA.showPage (TAB_CLAIMANT_PAGE);
                break;
            case TABBED_PAGE_SOLICITOR:
                tAA.showPage (TAB_SOLICITOR_PAGE);
                break;
            case TABBED_PAGE_MEDIATION:
                tAA.showPage (TAB_MEDIATION_PAGE);
                break;

            default:
                tAA.showPage (TAB_SOLICITOR_PAGE);
                break;
        }
    }

    /**
     * Indicates whether or not a tabbed page is enabled.
     *
     * @param page The tabbed page to display
     * @return True if the page is enabled, else false
     * @throws FrameworkException Exception thrown if problem selecting page
     */
    public boolean isTabbedPageEnabled (final int page) throws FrameworkException
    {
        final TabbedAreaAdaptor tAA = cMB.getTabbedAreaAdaptor (TABBED_AREA_ID);
        String pageId = null;
        switch (page)
        {
            case TABBED_PAGE_SOLICITOR:
                pageId = TAB_CLAIMANT_PAGE;
                break;
            case TABBED_PAGE_CLAIMANT:
                pageId = TAB_SOLICITOR_PAGE;
                break;
            case TABBED_PAGE_MEDIATION:
                pageId = TAB_MEDIATION_PAGE;
                break;
            default:
                pageId = TAB_SOLICITOR_PAGE;
                break;
        }
        return tAA.isPageEnabled (pageId);
    }

}