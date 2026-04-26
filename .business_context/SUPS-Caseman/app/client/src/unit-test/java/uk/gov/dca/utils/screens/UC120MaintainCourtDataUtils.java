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

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Maintain Court Data screen.
 *
 * Date: 15-Feb-2010
 */
public class UC120MaintainCourtDataUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ADDR_TYPE_OFFICE. */
    // Static constants representing the address types
    public static final String ADDR_TYPE_OFFICE = "Court Offices";
    
    /** The Constant ADDR_TYPE_WELSH_OFFICE. */
    public static final String ADDR_TYPE_WELSH_OFFICE = "Welsh Office";
    
    /** The Constant ADDR_TYPE_COURTHOUSE. */
    public static final String ADDR_TYPE_COURTHOUSE = "Court House";

    /** The Constant ACCOUNT_TYPE_COUNTY. */
    // Static constants representing the account types
    public static final String ACCOUNT_TYPE_COUNTY = "COUNTY";
    
    /** The Constant ACCOUNT_WELSH_COMBINED. */
    public static final String ACCOUNT_WELSH_COMBINED = "COMBINED";

    /** The text court code. */
    // Private field identifiers
    private String TEXT_COURT_CODE = "Query_Court_Code";
    
    /** The auto court name. */
    private String AUTO_COURT_NAME = "Query_Court_Name";
    
    /** The text court id. */
    private String TEXT_COURT_ID = "Query_CourtId";
    
    /** The chk district registry. */
    private String CHK_DISTRICT_REGISTRY = "Query_DistrictRegistry";
    
    /** The chk sups court. */
    private String CHK_SUPS_COURT = "Query_SUPSCourt";
    
    /** The text welsh hc name. */
    private String TEXT_WELSH_HC_NAME = "CourtData_Welsh_HighCourt_Name";
    
    /** The text welsh cc name. */
    private String TEXT_WELSH_CC_NAME = "CourtData_Welsh_CountyCourt_Name";
    
    /** The chk in service. */
    private String CHK_IN_SERVICE = "CourtData_InService";
    
    /** The text grouping court code. */
    private String TEXT_GROUPING_COURT_CODE = "CourtData_GroupingCourtCode";
    
    /** The auto grouping court name. */
    private String AUTO_GROUPING_COURT_NAME = "CourtData_GroupingCourtName";
    
    /** The text dm court code. */
    private String TEXT_DM_COURT_CODE = "CourtData_DMCourtCode";
    
    /** The text dm court name. */
    private String TEXT_DM_COURT_NAME = "CourtData_DMCourtName";
    
    /** The text dm email address. */
    private String TEXT_DM_EMAIL_ADDRESS = "CourtData_DiaryManager_EmailAddress";
    
    /** The text dx number. */
    private String TEXT_DX_NUMBER = "CourtData_DXNumber";
    
    /** The text telephone number. */
    private String TEXT_TELEPHONE_NUMBER = "CourtData_TelephoneNumber";
    
    /** The text dr telephone number. */
    private String TEXT_DR_TELEPHONE_NUMBER = "CourtData_DR_TelephoneNumber";
    
    /** The text fax number. */
    private String TEXT_FAX_NUMBER = "CourtData_FaxNumber";
    
    /** The text open from. */
    private String TEXT_OPEN_FROM = "CourtData_OpenFrom";
    
    /** The sel address type. */
    private String SEL_ADDRESS_TYPE = "Master_CourtAddressType";
    
    /** The auto default printer. */
    private String AUTO_DEFAULT_PRINTER = "CourtData_DefaultPrinter";
    
    /** The text dr open from. */
    private String TEXT_DR_OPEN_FROM = "CourtData_DR_OpenFrom";
    
    /** The text dr closed at. */
    private String TEXT_DR_CLOSED_AT = "CourtData_DR_OpenTo";
    
    /** The chk by appointment. */
    private String CHK_BY_APPOINTMENT = "CourtData_ByAppointment";

    /** The text add address line 1. */
    // Add Address Subform Fields
    private String TEXT_ADD_ADDRESS_LINE_1 = "AddAddress_ContactDetails_Address_Line1";
    
    /** The text add address line 2. */
    private String TEXT_ADD_ADDRESS_LINE_2 = "AddAddress_ContactDetails_Address_Line2";
    
    /** The text add address line 3. */
    private String TEXT_ADD_ADDRESS_LINE_3 = "AddAddress_ContactDetails_Address_Line3";
    
    /** The text add address line 4. */
    private String TEXT_ADD_ADDRESS_LINE_4 = "AddAddress_ContactDetails_Address_Line4";
    
    /** The text add address line 5. */
    private String TEXT_ADD_ADDRESS_LINE_5 = "AddAddress_ContactDetails_Address_Line5";
    
    /** The text add address postcode. */
    private String TEXT_ADD_ADDRESS_POSTCODE = "AddAddress_ContactDetails_Address_Postcode";
    
    /** The btn add address ok. */
    private String BTN_ADD_ADDRESS_OK = "AddAddress_OkButton";

    /** The text addcourt court code. */
    // Add Court Subform Fields
    private String TEXT_ADDCOURT_COURT_CODE = "AddNewCourt_CourtCode";
    
    /** The text addcourt court name. */
    private String TEXT_ADDCOURT_COURT_NAME = "AddNewCourt_CourtName";
    
    /** The text addcourt court id. */
    private String TEXT_ADDCOURT_COURT_ID = "AddNewCourt_CourtId";
    
    /** The chk addcourt district registry. */
    private String CHK_ADDCOURT_DISTRICT_REGISTRY = "AddNewCourt_DistrictRegistry";
    
    /** The text addcourt welsh hc name. */
    private String TEXT_ADDCOURT_WELSH_HC_NAME = "AddNewCourt_Welsh_HighCourt_Name";
    
    /** The text addcourt welsh cc name. */
    private String TEXT_ADDCOURT_WELSH_CC_NAME = "AddNewCourt_Welsh_CountyCourt_Name";
    
    /** The chk addcourt in service. */
    private String CHK_ADDCOURT_IN_SERVICE = "AddNewCourt_InService";
    
    /** The text addcourt grouping court code. */
    private String TEXT_ADDCOURT_GROUPING_COURT_CODE = "AddNewCourt_GroupingCourtCode";
    
    /** The auto addcourt grouping court name. */
    private String AUTO_ADDCOURT_GROUPING_COURT_NAME = "AddNewCourt_GroupingCourtName";
    
    /** The text addcourt dm email address. */
    private String TEXT_ADDCOURT_DM_EMAIL_ADDRESS = "AddNewCourt_DiaryManager_EmailAddress";
    
    /** The text addcourt dx number. */
    private String TEXT_ADDCOURT_DX_NUMBER = "AddNewCourt_DX";
    
    /** The text addcourt telephone number. */
    private String TEXT_ADDCOURT_TELEPHONE_NUMBER = "AddNewCourt_TelephoneNumber";
    
    /** The text addcourt dr telephone number. */
    private String TEXT_ADDCOURT_DR_TELEPHONE_NUMBER = "AddNewCourt_DR_TelephoneNumber";
    
    /** The text addcourt fax number. */
    private String TEXT_ADDCOURT_FAX_NUMBER = "AddNewCourt_FaxNumber";
    
    /** The text addcourt open from. */
    private String TEXT_ADDCOURT_OPEN_FROM = "AddNewCourt_Court_OpenFrom";
    
    /** The sel addcourt account type. */
    private String SEL_ADDCOURT_ACCOUNT_TYPE = "AddNewCourt_Court_AccountType";
    
    /** The text addcourtaccount code. */
    private String TEXT_ADDCOURTACCOUNT_CODE = "AddNewCourt_Court_AccountingCode";
    
    /** The text addcourt dr open from. */
    private String TEXT_ADDCOURT_DR_OPEN_FROM = "AddNewCourt_CourtDR_OpenFrom";
    
    /** The text addcourt dr closed at. */
    private String TEXT_ADDCOURT_DR_CLOSED_AT = "AddNewCourt_CourtDR_OpenTo";
    
    /** The chk addcourt by appointment. */
    private String CHK_ADDCOURT_BY_APPOINTMENT = "AddNewCourt_ByAppointment";
    
    /** The btn addcourt grouping court lov. */
    private String BTN_ADDCOURT_GROUPING_COURT_LOV = "AddNewCourt_GroupingCourtLOVButton";
    
    /** The btn addcourt ok. */
    private String BTN_ADDCOURT_OK = "AddNewCourt_OkButton";

    /** The text changename name. */
    // Change Court Name Subform Fields
    private String TEXT_CHANGENAME_NAME = "ChangeCourtName_NewName";
    
    /** The btn changename ok. */
    private String BTN_CHANGENAME_OK = "ChangeCourtName_OkButton";

    /** The btn search court. */
    // Private button identifiers
    private String BTN_SEARCH_COURT = "Query_SearchButton";
    
    /** The btn add court. */
    private String BTN_ADD_COURT = "Header_AddCourtButton";
    
    /** The btn grouping court lov. */
    private String BTN_GROUPING_COURT_LOV = "CourtData_GroupingCourtLOVButton";
    
    /** The btn add address. */
    private String BTN_ADD_ADDRESS = "Master_AddAddressButton";
    
    /** The btn remove address. */
    private String BTN_REMOVE_ADDRESS = "Master_RemoveAddressButton";
    
    /** The btn save details. */
    private String BTN_SAVE_DETAILS = "Status_SaveButton";
    
    /** The btn clear details. */
    private String BTN_CLEAR_DETAILS = "Status_ClearButton";
    
    /** The btn change name. */
    private String BTN_CHANGE_NAME = "NavBar_ChangeCourtNameButton";
    
    /** The btn printer lov. */
    private String BTN_PRINTER_LOV = "CourtData_DefaultPrinterLOVButton";

    /** The sub add address. */
    // Private subform identifiers
    private String SUB_ADD_ADDRESS = "addNewAddress_subform";
    
    /** The sub add court. */
    private String SUB_ADD_COURT = "addNewCourt_subform";
    
    /** The sub change name. */
    private String SUB_CHANGE_NAME = "changeCourtName_subform";
    
    /** The lov sub printer. */
    private String LOV_SUB_PRINTER = "CourtData_PrintersLOVGrid";

    /** The grid court addresses. */
    // Private grid identifiers
    private String GRID_COURT_ADDRESSES = "Master_CourtAddressGrid";

    /** The new address subform. */
    // Private subform objects
    private SubFormAdaptor newAddressSubform = null;
    
    /** The new court subform. */
    private SubFormAdaptor newCourtSubform = null;
    
    /** The change name subform. */
    private SubFormAdaptor changeNameSubform = null;

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC120MaintainCourtDataUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain Court Data";
    }

    /**
     * Sets the court code.
     *
     * @param pCourtCode the new court code
     */
    public void setCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_COURT_CODE, pCourtCode);
    }

    /**
     * Sets the court name.
     *
     * @param pCourtName the new court name
     */
    public void setCourtName (final String pCourtName)
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (AUTO_COURT_NAME);
        subjectField.typeText (pCourtName);
    }

    /**
     * Gets the court name.
     *
     * @return the court name
     */
    public String getCourtName ()
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (AUTO_COURT_NAME);
        return subjectField.getText ();
    }

    /**
     * Sets the court id.
     *
     * @param pCourtId the new court id
     */
    public void setCourtId (final String pCourtId)
    {
        setTextFieldValue (TEXT_COURT_ID, pCourtId);
    }

    /**
     * Sets the court district registry.
     *
     * @param pDistrictRegistry the new court district registry
     */
    public void setCourtDistrictRegistry (final boolean pDistrictRegistry)
    {
        setCheckboxFieldValue (CHK_DISTRICT_REGISTRY, pDistrictRegistry);
    }

    /**
     * Sets the court SUPS flag.
     *
     * @param pSUPSCourt the new court SUPS flag
     */
    public void setCourtSUPSFlag (final boolean pSUPSCourt)
    {
        setCheckboxFieldValue (CHK_SUPS_COURT, pSUPSCourt);
    }

    /**
     * Sets focus in the SUPS Court field.
     */
    public void setFocusOnSUPSFlag ()
    {
        final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (CHK_SUPS_COURT);
        cA.focus ();
    }

    /**
     * Clicks the Search Button.
     */
    public void clickSearchButton ()
    {
        // Click the Search button to load Court details
        mClickButton (BTN_SEARCH_COURT);
    }

    /**
     * Clicks the Add Court Button.
     */
    public void clickAddCourtButton ()
    {
        // Click the Add button and initialise the subform
        mClickButton (BTN_ADD_COURT);
        if (null == newCourtSubform)
        {
            newCourtSubform = cMB.getSubFormAdaptor (SUB_ADD_COURT);
        }
    }

    /**
     * Sets the welsh high court name.
     *
     * @param pName the new welsh high court name
     */
    public void setWelshHighCourtName (final String pName)
    {
        setTextFieldValue (TEXT_WELSH_HC_NAME, pName);
    }

    /**
     * Gets the welsh high court name.
     *
     * @return the welsh high court name
     */
    public String getWelshHighCourtName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_WELSH_HC_NAME);
        return tA.getValue ();
    }

    /**
     * Function returns the status of the Welsh High Court Name field depending upon
     * the mode passed in.
     *
     * @param mode The mode to check for, e.g. Read Only, Mandatory, Enablement or Valid
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException the framework exception
     */
    public boolean checkWelshHighCourtNameStatus (final int mode) throws FrameworkException
    {
        return checkTextFieldStatus (TEXT_WELSH_HC_NAME, mode);
    }

    /**
     * Gets the welsh high court name id.
     *
     * @return the welsh high court name id
     */
    public String getWelshHighCourtNameId ()
    {
        return TEXT_WELSH_HC_NAME;
    }

    /**
     * Sets the welsh county court name.
     *
     * @param pName the new welsh county court name
     */
    public void setWelshCountyCourtName (final String pName)
    {
        setTextFieldValue (TEXT_WELSH_CC_NAME, pName);
    }

    /**
     * Gets the welsh county court name.
     *
     * @return the welsh county court name
     */
    public String getWelshCountyCourtName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_WELSH_CC_NAME);
        return tA.getValue ();
    }

    /**
     * Function returns the status of the Welsh County Court Name field depending upon
     * the mode passed in.
     *
     * @param mode The mode to check for, e.g. Read Only, Mandatory, Enablement or Valid
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException the framework exception
     */
    public boolean checkWelshCountyCourtNameStatus (final int mode) throws FrameworkException
    {
        return checkTextFieldStatus (TEXT_WELSH_CC_NAME, mode);
    }

    /**
     * Gets the welsh county court name id.
     *
     * @return the welsh county court name id
     */
    public String getWelshCountyCourtNameId ()
    {
        return TEXT_WELSH_CC_NAME;
    }

    /**
     * Sets the court in service flag.
     *
     * @param pInService the new court in service flag
     */
    public void setCourtInServiceFlag (final boolean pInService)
    {
        setCheckboxFieldValue (CHK_IN_SERVICE, pInService);
    }

    /**
     * Gets the in service id.
     *
     * @return the in service id
     */
    public String getInServiceId ()
    {
        return CHK_IN_SERVICE;
    }

    /**
     * Sets the grouping court code.
     *
     * @param pCourtCode the new grouping court code
     */
    public void setGroupingCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_GROUPING_COURT_CODE, pCourtCode);
    }

    /**
     * Gets the grouping court code id.
     *
     * @return the grouping court code id
     */
    public String getGroupingCourtCodeId ()
    {
        return TEXT_GROUPING_COURT_CODE;
    }

    /**
     * Sets the grouping court name.
     *
     * @param pCourtName the new grouping court name
     */
    public void setGroupingCourtName (final String pCourtName)
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (AUTO_GROUPING_COURT_NAME);
        subjectField.typeText (pCourtName);
    }

    /**
     * Gets the grouping court name.
     *
     * @return the grouping court name
     */
    public String getGroupingCourtName ()
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (AUTO_GROUPING_COURT_NAME);
        return subjectField.getText ();
    }

    /**
     * Gets the grouping court name id.
     *
     * @return the grouping court name id
     */
    public String getGroupingCourtNameId ()
    {
        return AUTO_GROUPING_COURT_NAME;
    }

    /**
     * Clicks the Grouping Court LOV Button.
     */
    public void clickGroupingCourtLOV ()
    {
        mClickButton (BTN_GROUPING_COURT_LOV);
    }

    /**
     * Gets the grouping court LOV id.
     *
     * @return the grouping court LOV id
     */
    public String getGroupingCourtLOVId ()
    {
        return BTN_GROUPING_COURT_LOV;
    }

    /**
     * Sets the DM court code.
     *
     * @param pCode the new DM court code
     */
    public void setDMCourtCode (final String pCode)
    {
        setTextFieldValue (TEXT_DM_COURT_CODE, pCode);
    }

    /**
     * Gets the DM court code.
     *
     * @return the DM court code
     */
    public String getDMCourtCode ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DM_COURT_CODE);
        return tA.getValue ();
    }

    /**
     * Function returns the status of the Diary manager Court Code field depending upon
     * the mode passed in.
     *
     * @param mode The mode to check for, e.g. Read Only, Mandatory, Enablement or Valid
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException the framework exception
     */
    public boolean checkDMCourtCodeStatus (final int mode) throws FrameworkException
    {
        return checkTextFieldStatus (TEXT_DM_COURT_CODE, mode);
    }

    /**
     * Function returns the status of the Diary manager Court Name field depending upon
     * the mode passed in.
     *
     * @param mode The mode to check for, e.g. Read Only, Mandatory, Enablement or Valid
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException the framework exception
     */
    public boolean checkDMCourtNameStatus (final int mode) throws FrameworkException
    {
        return checkAutoCompleteFieldStatus (TEXT_DM_COURT_NAME, mode);
    }

    /**
     * Sets the DM email address.
     *
     * @param pEmail the new DM email address
     */
    public void setDMEmailAddress (final String pEmail)
    {
        setTextFieldValue (TEXT_DM_EMAIL_ADDRESS, pEmail);
    }

    /**
     * Gets the DM email address id.
     *
     * @return the DM email address id
     */
    public String getDMEmailAddressId ()
    {
        return TEXT_DM_EMAIL_ADDRESS;
    }

    /**
     * Sets the court DX.
     *
     * @param pDX the new court DX
     */
    public void setCourtDX (final String pDX)
    {
        setTextFieldValue (TEXT_DX_NUMBER, pDX);
    }

    /**
     * Gets the DX number id.
     *
     * @return the DX number id
     */
    public String getDXNumberId ()
    {
        return TEXT_DX_NUMBER;
    }

    /**
     * Sets the telephone number.
     *
     * @param pTelNumber the new telephone number
     */
    public void setTelephoneNumber (final String pTelNumber)
    {
        setTextFieldValue (TEXT_TELEPHONE_NUMBER, pTelNumber);
    }

    /**
     * Gets the telephone number id.
     *
     * @return the telephone number id
     */
    public String getTelephoneNumberId ()
    {
        return TEXT_TELEPHONE_NUMBER;
    }

    /**
     * Sets the DR telephone number.
     *
     * @param pTelNumber the new DR telephone number
     */
    public void setDRTelephoneNumber (final String pTelNumber)
    {
        setTextFieldValue (TEXT_DR_TELEPHONE_NUMBER, pTelNumber);
    }

    /**
     * Gets the DR telephone number.
     *
     * @return the DR telephone number
     */
    public String getDRTelephoneNumber ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DR_TELEPHONE_NUMBER);
        return tA.getValue ();
    }

    /**
     * Checks if is DR telephone number enabled.
     *
     * @return true, if is DR telephone number enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isDRTelephoneNumberEnabled () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DR_TELEPHONE_NUMBER);
        return tA.isEnabled ();
    }

    /**
     * Sets the fax number.
     *
     * @param pFaxNumber the new fax number
     */
    public void setFaxNumber (final String pFaxNumber)
    {
        setTextFieldValue (TEXT_FAX_NUMBER, pFaxNumber);
    }

    /**
     * Gets the fax number id.
     *
     * @return the fax number id
     */
    public String getFaxNumberId ()
    {
        return TEXT_FAX_NUMBER;
    }

    /**
     * Sets the open from.
     *
     * @param pOpenFrom the new open from
     */
    public void setOpenFrom (final String pOpenFrom)
    {
        setTextFieldValue (TEXT_OPEN_FROM, pOpenFrom);
    }

    /**
     * Gets the open from id.
     *
     * @return the open from id
     */
    public String getOpenFromId ()
    {
        return TEXT_OPEN_FROM;
    }

    /**
     * Sets the DR open from.
     *
     * @param pOpenFrom the new DR open from
     */
    public void setDROpenFrom (final String pOpenFrom)
    {
        setTextFieldValue (TEXT_DR_OPEN_FROM, pOpenFrom);
    }

    /**
     * Gets the DR open from.
     *
     * @return the DR open from
     */
    public String getDROpenFrom ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DR_OPEN_FROM);
        return tA.getValue ();
    }

    /**
     * Checks if is DR open from enabled.
     *
     * @return true, if is DR open from enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isDROpenFromEnabled () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DR_OPEN_FROM);
        return tA.isEnabled ();
    }

    /**
     * Checks if is DR open from valid.
     *
     * @return true, if is DR open from valid
     * @throws FrameworkException the framework exception
     */
    public boolean isDROpenFromValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DR_OPEN_FROM);
        return tA.isValid ();
    }

    /**
     * Sets the DR closed at.
     *
     * @param pOpenFrom the new DR closed at
     */
    public void setDRClosedAt (final String pOpenFrom)
    {
        setTextFieldValue (TEXT_DR_CLOSED_AT, pOpenFrom);
    }

    /**
     * Gets the DR closed at.
     *
     * @return the DR closed at
     */
    public String getDRClosedAt ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DR_CLOSED_AT);
        return tA.getValue ();
    }

    /**
     * Checks if is DR closed at enabled.
     *
     * @return true, if is DR closed at enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isDRClosedAtEnabled () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DR_CLOSED_AT);
        return tA.isEnabled ();
    }

    /**
     * Checks if is DR closed at valid.
     *
     * @return true, if is DR closed at valid
     * @throws FrameworkException the framework exception
     */
    public boolean isDRClosedAtValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DR_CLOSED_AT);
        return tA.isValid ();
    }

    /**
     * Sets the court by appointment.
     *
     * @param pByAppointment the new court by appointment
     */
    public void setCourtByAppointment (final boolean pByAppointment)
    {
        setCheckboxFieldValue (CHK_BY_APPOINTMENT, pByAppointment);
    }

    /**
     * Gets the court by appointment.
     *
     * @return the court by appointment
     */
    public boolean getCourtByAppointment ()
    {
        final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (CHK_BY_APPOINTMENT);
        return cA.isChecked ();
    }

    /**
     * Checks if is court by appointment enabled.
     *
     * @return true, if is court by appointment enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isCourtByAppointmentEnabled () throws FrameworkException
    {
        final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (CHK_BY_APPOINTMENT);
        return cA.isEnabled ();
    }

    /**
     * Sets the default printer.
     *
     * @param pPrinterName the new default printer
     */
    public void setDefaultPrinter (final String pPrinterName)
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (AUTO_DEFAULT_PRINTER);
        subjectField.setText (pPrinterName);
    }

    /**
     * Gets the default printer.
     *
     * @return the default printer
     */
    public String getDefaultPrinter ()
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (AUTO_DEFAULT_PRINTER);
        return subjectField.getText ();
    }

    /**
     * Checks if is default printer enabled.
     *
     * @return true, if is default printer enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isDefaultPrinterEnabled () throws FrameworkException
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (AUTO_DEFAULT_PRINTER);
        return subjectField.isEnabled ();
    }

    /**
     * Checks if is default printer valid.
     *
     * @return true, if is default printer valid
     * @throws FrameworkException the framework exception
     */
    public boolean isDefaultPrinterValid () throws FrameworkException
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (AUTO_DEFAULT_PRINTER);
        return subjectField.isValid ();
    }

    /**
     * Checks if is default printer LOV enabled.
     *
     * @return true, if is default printer LOV enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isDefaultPrinterLOVEnabled () throws FrameworkException
    {
        final ButtonAdaptor buttonField = cMB.getButtonAdaptor (BTN_PRINTER_LOV);
        return buttonField.isEnabled ();
    }

    /**
     * Sets the default printer using LOV.
     *
     * @param pPrinterName the new default printer using LOV
     */
    public void setDefaultPrinterUsingLOV (final String pPrinterName)
    {
        clickLOVSelect (BTN_PRINTER_LOV // Identifier of LOV Button
                , LOV_SUB_PRINTER // Identifier of LOV Subform
                , "Print Share Name" // Name of the LOV column
                , pPrinterName); // Value to enter in the LOV
    }

    /**
     * Function handles the adding of a new Court Address.
     *
     * @param type Address Type to add
     * @param line1 Address Line 1
     * @param line2 Address Line 2
     * @param line3 Address Line 3
     * @param line4 Address Line 4
     * @param line5 Address Line 5
     * @param postcode Postcode
     * @throws FrameworkException the framework exception
     */
    public void addCourtAddress (final String type, final String line1, final String line2, final String line3,
                                 final String line4, final String line5, final String postcode)
        throws FrameworkException
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_ADDRESS_TYPE);
        sA.clickLabel (type);
        mClickButton (BTN_ADD_ADDRESS);
        cMB.waitForPageToLoad ();

        if (null == newAddressSubform)
        {
            newAddressSubform = cMB.getSubFormAdaptor (SUB_ADD_ADDRESS);
        }

        if (newAddressSubform.isVisible ())
        {
            final TextInputAdaptor tA1 = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_ADD_ADDRESS_LINE_1);
            tA1.type (line1);
            final TextInputAdaptor tA2 = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_ADD_ADDRESS_LINE_2);
            tA2.type (line2);
            final TextInputAdaptor tA3 = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_ADD_ADDRESS_LINE_3);
            tA3.type (line3);
            final TextInputAdaptor tA4 = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_ADD_ADDRESS_LINE_4);
            tA4.type (line4);
            final TextInputAdaptor tA5 = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_ADD_ADDRESS_LINE_5);
            tA5.type (line5);
            final TextInputAdaptor tA6 = (TextInputAdaptor) newAddressSubform.getAdaptor (TEXT_ADD_ADDRESS_POSTCODE);
            tA6.type (postcode);
            ((ButtonAdaptor) newAddressSubform.getAdaptor (BTN_ADD_ADDRESS_OK)).click ();
        }
        cMB.waitForPageToLoad ();
    }

    /**
     * Selects the row in the address grid that matches the Address Type specified.
     *
     * @param pAddressType The Address Type to search for
     */
    public void selectAddressByAddressType (final String pAddressType)
    {
        selectValueFromGrid (GRID_COURT_ADDRESSES, pAddressType, 1);
    }

    /**
     * Clicks the Remove Address button which deletes the currently selected
     * address in the grid.
     */
    public void clickRemoveAddressButton ()
    {
        cMB.getButtonAdaptor (BTN_REMOVE_ADDRESS).click ();
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the Grouping Court LOV Button.
     */
    public void clickSaveButton ()
    {
        mClickButton (BTN_SAVE_DETAILS);
    }

    /**
     * Clicks the Grouping Court LOV Button.
     */
    public void clickClearButton ()
    {
        mClickButton (BTN_CLEAR_DETAILS);
    }

    /**
     * Sets the new court code.
     *
     * @param pCode the new new court code
     * @throws FrameworkException the framework exception
     */
    public void setNewCourtCode (final String pCode) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_COURT_CODE);
            tA.type (pCode);
        }
    }

    /**
     * Sets the new court name.
     *
     * @param pName the new new court name
     * @throws FrameworkException the framework exception
     */
    public void setNewCourtName (final String pName) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_COURT_NAME);
            tA.type (pName);
        }
    }

    /**
     * Sets focus in the New Court Name field on the Add Court Subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void setFocusOnNewCourtName () throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_COURT_NAME);
            tA.focus ();
        }
    }

    /**
     * Sets the new welsh high court name.
     *
     * @param pName the new new welsh high court name
     * @throws FrameworkException the framework exception
     */
    public void setNewWelshHighCourtName (final String pName) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_WELSH_HC_NAME);
            tA.type (pName);
        }
    }

    /**
     * Function returns the status of the Welsh High Court Name field depending upon
     * the mode passed in.
     *
     * @param mode The mode to check for, e.g. Read Only, Mandatory, Enablement or Valid
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException the framework exception
     */
    public boolean checkNewWelshHighCourtNameStatus (final int mode) throws FrameworkException
    {
        final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_WELSH_HC_NAME);
        return checkTextFieldStatus (tA, mode);
    }

    /**
     * Gets the new welsh high court name id.
     *
     * @return the new welsh high court name id
     */
    public String getNewWelshHighCourtNameId ()
    {
        return TEXT_ADDCOURT_WELSH_HC_NAME;
    }

    /**
     * Sets the new welsh county court name.
     *
     * @param pName the new new welsh county court name
     * @throws FrameworkException the framework exception
     */
    public void setNewWelshCountyCourtName (final String pName) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_WELSH_CC_NAME);
            tA.type (pName);
        }
    }

    /**
     * Function returns the status of the Welsh High Court Name field depending upon
     * the mode passed in.
     *
     * @param mode The mode to check for, e.g. Read Only, Mandatory, Enablement or Valid
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException the framework exception
     */
    public boolean checkNewWelshCountyCourtNameStatus (final int mode) throws FrameworkException
    {
        final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_WELSH_CC_NAME);
        return checkTextFieldStatus (tA, mode);
    }

    /**
     * Gets the new welsh county court name id.
     *
     * @return the new welsh county court name id
     */
    public String getNewWelshCountyCourtNameId ()
    {
        return TEXT_ADDCOURT_WELSH_CC_NAME;
    }

    /**
     * Sets the new court id.
     *
     * @param pId the new new court id
     * @throws FrameworkException the framework exception
     */
    public void setNewCourtId (final String pId) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_COURT_ID);
            tA.type (pId);
        }
    }

    /**
     * Gets the new court id id.
     *
     * @return the new court id id
     */
    public String getNewCourtIdId ()
    {
        return TEXT_ADDCOURT_COURT_ID;
    }

    /**
     * Sets the new court district registry.
     *
     * @param pDistrictRegistry the new new court district registry
     * @throws FrameworkException the framework exception
     */
    public void setNewCourtDistrictRegistry (final boolean pDistrictRegistry) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final CheckboxInputAdaptor cA =
                    (CheckboxInputAdaptor) newCourtSubform.getAdaptor (CHK_ADDCOURT_DISTRICT_REGISTRY);
            if (pDistrictRegistry && !cA.isChecked ())
            {
                // Checkbox needs to be checked and currently is not checked
                cA.click ();
            }
            else if ( !pDistrictRegistry && cA.isChecked ())
            {
                // Checkbox needs to be unchecked and is currently checked
                cA.click ();
            }
        }
    }

    /**
     * Gets the new district registry id.
     *
     * @return the new district registry id
     */
    public String getNewDistrictRegistryId ()
    {
        return CHK_ADDCOURT_DISTRICT_REGISTRY;
    }

    /**
     * Sets the new court in service.
     *
     * @param pInService the new new court in service
     * @throws FrameworkException the framework exception
     */
    public void setNewCourtInService (final boolean pInService) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final CheckboxInputAdaptor cA = (CheckboxInputAdaptor) newCourtSubform.getAdaptor (CHK_ADDCOURT_IN_SERVICE);
            if (pInService && !cA.isChecked ())
            {
                // Checkbox needs to be checked and currently is not checked
                cA.click ();
            }
            else if ( !pInService && cA.isChecked ())
            {
                // Checkbox needs to be unchecked and is currently checked
                cA.click ();
            }
        }
    }

    /**
     * Gets the new in service id.
     *
     * @return the new in service id
     */
    public String getNewInServiceId ()
    {
        return CHK_ADDCOURT_IN_SERVICE;
    }

    /**
     * Sets the new grouping court code.
     *
     * @param pCode the new new grouping court code
     * @throws FrameworkException the framework exception
     */
    public void setNewGroupingCourtCode (final String pCode) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA =
                    (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_GROUPING_COURT_CODE);
            tA.type (pCode);
        }
    }

    /**
     * Gets the new grouping court code id.
     *
     * @return the new grouping court code id
     */
    public String getNewGroupingCourtCodeId ()
    {
        return TEXT_ADDCOURT_GROUPING_COURT_CODE;
    }

    /**
     * Sets the new grouping court name.
     *
     * @param pName the new new grouping court name
     * @throws FrameworkException the framework exception
     */
    public void setNewGroupingCourtName (final String pName) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final AutoCompleteAdaptor acA =
                    (AutoCompleteAdaptor) newCourtSubform.getAdaptor (AUTO_ADDCOURT_GROUPING_COURT_NAME);
            acA.typeText (pName);
        }
    }

    /**
     * Gets the new grouping court name id.
     *
     * @return the new grouping court name id
     */
    public String getNewGroupingCourtNameId ()
    {
        return AUTO_ADDCOURT_GROUPING_COURT_NAME;
    }

    /**
     * Gets the new grouping court LOV id.
     *
     * @return the new grouping court LOV id
     */
    public String getNewGroupingCourtLOVId ()
    {
        return BTN_ADDCOURT_GROUPING_COURT_LOV;
    }

    /**
     * Sets the new DM email address.
     *
     * @param pEmail the new new DM email address
     * @throws FrameworkException the framework exception
     */
    public void setNewDMEmailAddress (final String pEmail) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_DM_EMAIL_ADDRESS);
            tA.type (pEmail);
        }
    }

    /**
     * Gets the new DM email address id.
     *
     * @return the new DM email address id
     */
    public String getNewDMEmailAddressId ()
    {
        return TEXT_ADDCOURT_DM_EMAIL_ADDRESS;
    }

    /**
     * Sets the new court DX.
     *
     * @param pDX the new new court DX
     * @throws FrameworkException the framework exception
     */
    public void setNewCourtDX (final String pDX) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_DX_NUMBER);
            tA.type (pDX);
        }
    }

    /**
     * Gets the new court DX id.
     *
     * @return the new court DX id
     */
    public String getNewCourtDXId ()
    {
        return TEXT_ADDCOURT_DX_NUMBER;
    }

    /**
     * Sets the new telephone number.
     *
     * @param pTelNumber the new new telephone number
     * @throws FrameworkException the framework exception
     */
    public void setNewTelephoneNumber (final String pTelNumber) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_TELEPHONE_NUMBER);
            tA.type (pTelNumber);
        }
    }

    /**
     * Gets the new court telephone id.
     *
     * @return the new court telephone id
     */
    public String getNewCourtTelephoneId ()
    {
        return TEXT_ADDCOURT_TELEPHONE_NUMBER;
    }

    /**
     * Sets the new fax number.
     *
     * @param pFaxNumber the new new fax number
     * @throws FrameworkException the framework exception
     */
    public void setNewFaxNumber (final String pFaxNumber) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_FAX_NUMBER);
            tA.type (pFaxNumber);
        }
    }

    /**
     * Gets the new court fax id.
     *
     * @return the new court fax id
     */
    public String getNewCourtFaxId ()
    {
        return TEXT_ADDCOURT_FAX_NUMBER;
    }

    /**
     * Sets the new open from.
     *
     * @param pOpenFrom the new new open from
     * @throws FrameworkException the framework exception
     */
    public void setNewOpenFrom (final String pOpenFrom) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_OPEN_FROM);
            tA.type (pOpenFrom);
        }
    }

    /**
     * Gets the new open from id.
     *
     * @return the new open from id
     */
    public String getNewOpenFromId ()
    {
        return TEXT_ADDCOURT_OPEN_FROM;
    }

    /**
     * Sets the new court account type.
     *
     * @param pAccountType the new new court account type
     * @throws FrameworkException the framework exception
     */
    public void setNewCourtAccountType (final String pAccountType) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final SelectElementAdaptor sA =
                    (SelectElementAdaptor) newCourtSubform.getAdaptor (SEL_ADDCOURT_ACCOUNT_TYPE);
            sA.clickValue (pAccountType);
        }
    }

    /**
     * Sets the new court account code.
     *
     * @param pAccountCode the new new court account code
     * @throws FrameworkException the framework exception
     */
    public void setNewCourtAccountCode (final String pAccountCode) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURTACCOUNT_CODE);
            tA.type (pAccountCode);
        }
    }

    /**
     * Sets the new DR telephone.
     *
     * @param pTel the new new DR telephone
     * @throws FrameworkException the framework exception
     */
    public void setNewDRTelephone (final String pTel) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA =
                    (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_DR_TELEPHONE_NUMBER);
            tA.type (pTel);
        }
    }

    /**
     * Sets the new DR open from.
     *
     * @param pOpenFrom the new new DR open from
     * @throws FrameworkException the framework exception
     */
    public void setNewDROpenFrom (final String pOpenFrom) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_DR_OPEN_FROM);
            tA.type (pOpenFrom);
        }
    }

    /**
     * Checks if is new DR open from valid.
     *
     * @return true, if is new DR open from valid
     * @throws FrameworkException the framework exception
     */
    public boolean isNewDROpenFromValid () throws FrameworkException
    {
        boolean blnValid = false;
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_DR_OPEN_FROM);
            blnValid = tA.isValid ();
        }
        return blnValid;
    }

    /**
     * Sets the new DR closed at.
     *
     * @param pClosedAt the new new DR closed at
     * @throws FrameworkException the framework exception
     */
    public void setNewDRClosedAt (final String pClosedAt) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_DR_CLOSED_AT);
            tA.type (pClosedAt);
        }
    }

    /**
     * Checks if is new DR closed at valid.
     *
     * @return true, if is new DR closed at valid
     * @throws FrameworkException the framework exception
     */
    public boolean isNewDRClosedAtValid () throws FrameworkException
    {
        boolean blnValid = false;
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newCourtSubform.getAdaptor (TEXT_ADDCOURT_DR_CLOSED_AT);
            blnValid = tA.isValid ();
        }
        return blnValid;
    }

    /**
     * Sets the new by appointment.
     *
     * @param toChecked the new new by appointment
     * @throws FrameworkException the framework exception
     */
    public void setNewByAppointment (final boolean toChecked) throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            final CheckboxInputAdaptor cA =
                    (CheckboxInputAdaptor) newCourtSubform.getAdaptor (CHK_ADDCOURT_BY_APPOINTMENT);
            if (toChecked && !cA.isChecked ())
            {
                // Checkbox needs to be checked and currently is not checked
                cA.click ();
            }
            else if ( !toChecked && cA.isChecked ())
            {
                // Checkbox needs to be unchecked and is currently checked
                cA.click ();
            }
        }
    }

    /**
     * Click the Ok button in the New Court popup subform to add the Court.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void newCourtClickOk () throws FrameworkException
    {
        if (null != newCourtSubform && newCourtSubform.isVisible ())
        {
            ((ButtonAdaptor) newCourtSubform.getAdaptor (BTN_ADDCOURT_OK)).click ();
        }
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the Change Court Name Button.
     */
    public void clickChangeCourtNameButton ()
    {
        // Click the Change Court Name button and initialise the subform
        mClickButton (BTN_CHANGE_NAME);
        if (null == changeNameSubform)
        {
            changeNameSubform = cMB.getSubFormAdaptor (SUB_CHANGE_NAME);
        }
    }

    /**
     * Checks if is change court name popup visible.
     *
     * @return true, if is change court name popup visible
     */
    public boolean isChangeCourtNamePopupVisible ()
    {
        boolean blnVisible = false;
        if (null != changeNameSubform)
        {
            blnVisible = changeNameSubform.isVisible ();
        }
        return blnVisible;
    }

    /**
     * Checks if is change name court name button enabled.
     *
     * @return true, if is change name court name button enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isChangeNameCourtNameButtonEnabled () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_CHANGE_NAME);
        return bA.isEnabled ();
    }

    /**
     * Sets the change name court name.
     *
     * @param pName the new change name court name
     * @throws FrameworkException the framework exception
     */
    public void setChangeNameCourtName (final String pName) throws FrameworkException
    {
        if (null != changeNameSubform && changeNameSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) changeNameSubform.getAdaptor (TEXT_CHANGENAME_NAME);
            tA.type (pName);
        }
    }

    /**
     * Sets focus in the New Court Name field on the Change Court Name subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void setFocusOnChangeNameCourtName () throws FrameworkException
    {
        if (null != changeNameSubform && changeNameSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) changeNameSubform.getAdaptor (TEXT_CHANGENAME_NAME);
            tA.focus ();
        }
    }

    /**
     * Checks if is change name court name valid.
     *
     * @return true, if is change name court name valid
     * @throws FrameworkException the framework exception
     */
    public boolean isChangeNameCourtNameValid () throws FrameworkException
    {
        boolean blnValid = false;
        if (null != changeNameSubform && changeNameSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) changeNameSubform.getAdaptor (TEXT_CHANGENAME_NAME);
            blnValid = tA.isValid ();
        }
        return blnValid;
    }

    /**
     * Checks if is change name court name mandatory.
     *
     * @return true, if is change name court name mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isChangeNameCourtNameMandatory () throws FrameworkException
    {
        boolean blnValid = false;
        if (null != changeNameSubform && changeNameSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) changeNameSubform.getAdaptor (TEXT_CHANGENAME_NAME);
            blnValid = tA.isMandatory ();
        }
        return blnValid;
    }

    /**
     * Click the Ok button in the Change Court Name subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void changeNameSubformClickOk () throws FrameworkException
    {
        if (null != changeNameSubform && changeNameSubform.isVisible ())
        {
            ((ButtonAdaptor) changeNameSubform.getAdaptor (BTN_CHANGENAME_OK)).click ();
        }
    }

    /**
     * Gets the change court name status bar text.
     *
     * @return the change court name status bar text
     */
    public String getChangeCourtNameStatusBarText ()
    {
        String statusBarText = "";
        if (null != changeNameSubform && changeNameSubform.isVisible ())
        {
            // Retrieve the status bar text from the subform
            statusBarText = cMB.getSubFormAdaptor (SUB_CHANGE_NAME).getStatusBarText ();
        }
        return statusBarText;
    }

}