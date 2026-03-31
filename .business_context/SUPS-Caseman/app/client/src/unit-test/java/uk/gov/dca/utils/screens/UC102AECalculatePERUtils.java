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
import uk.gov.dca.utils.selenium.adaptors.TabbedAreaAdaptor;

/**
 * Created by Guy Grewal.
 * Screen utility class representing the Calculate PER pop up screen.
 *
 * Date: 10-Dec-2015
 */
public class UC102AECalculatePERUtils extends AbstractBaseScreenUtils
{
    
    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn";

    /** The Query case number. */
    // Case Number field in Query Form
    private String Query_CaseNumber = "Query_CaseNumber";

    /** The popup amount allowed. */
    // Amount Allowed Field
    private String POPUP_AMOUNT_ALLOWED = "StandardAllowances_Popup_Amount";

    /** The btn search ae. */
    // Search Button
    private String BTN_SEARCH_AE = "Query_SearchButton";

    /** The btn per calculator. */
    // PER Calculator Button
    private String BTN_PER_CALCULATOR = "NavBar_PERCalculatorButton";

    /** The btn add personal allowances. */
    // Add buttons in each of the four tabs
    private String BTN_ADD_PERSONAL_ALLOWANCES = "PersonalAllowances_AddBtn";
    
    /** The btn add premiums. */
    private String BTN_ADD_PREMIUMS = "Premiums_AddBtn";
    
    /** The btn add other liabilities. */
    private String BTN_ADD_OTHER_LIABILITIES = "OtherLiabilities_AddBtn";
    
    /** The btn add other resources. */
    private String BTN_ADD_OTHER_RESOURCES = "OtherResources_AddBtn";

    /** The btn lov. */
    // Buttons in PER Calculator pop up
    private String BTN_LOV = "StandardAllowances_Popup_LOVBtn";
    
    /** The btn ok. */
    private String BTN_OK = "StandardAllowances_Popup_OkBtn";
    
    /** The btn cancel. */
    private String BTN_CANCEL = "StandardAllowances_Popup_CancelBtn";

    /** The popup lov personal allowance. */
    // LOV grids
    public String POPUP_LOV_PERSONAL_ALLOWANCE = "PersonalAllowancesLOV";
    
    /** The popup lov premiums. */
    public String POPUP_LOV_PREMIUMS = "PremiumsLOV";

    /** The calculate per personal allowance grid. */
    // Calculate PER grids
    public String CALCULATE_PER_PERSONAL_ALLOWANCE_GRID = "PersonalAllowancesGrid";

    /** The tabbed area id. */
    // Tabbed area identifiers
    private String TABBED_AREA_ID = "myTabbedArea";

    /** The tab personal allowances page. */
    private String TAB_PERSONAL_ALLOWANCES_PAGE = "firstPage";
    
    /** The tab premiums page. */
    private String TAB_PREMIUMS_PAGE = "secondPage";
    
    /** The tab other liabilities page. */
    private String TAB_OTHER_LIABILITIES_PAGE = "thirdPage";
    
    /** The tab other resources page. */
    private String TAB_OTHER_RESOURCES_PAGE = "fourthPage";

    /** The Constant TABBED_PAGE_PERSONAL_ALLOWANCES. */
    // Tabbed Page constants
    public static final int TABBED_PAGE_PERSONAL_ALLOWANCES = 1;
    
    /** The Constant TABBED_PAGE_PREMIUMS. */
    public static final int TABBED_PAGE_PREMIUMS = 2;
    
    /** The Constant TABBED_PAGE_OTHER_LIABILITIES. */
    public static final int TABBED_PAGE_OTHER_LIABILITIES = 3;
    
    /** The Constant TABBED_PAGE_OTHER_RESOURCES. */
    public static final int TABBED_PAGE_OTHER_RESOURCES = 4;

    /**
     * Instantiates a new UC 102 AE calculate PER utils.
     *
     * @param theCMTestBase the the CM test base
     */
    public UC102AECalculatePERUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Enter/Query AE Events";
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        mClickButton (mBTN_CLOSE_SCREEN);
    }

    /**
     * Enters the case number specified and tabs off the field (assumes that focus is already
     * set on the Case Number field) to load the desired case.
     *
     * @param caseNumber The identifier of the Case to be loaded
     */
    public void loadCaseByCaseNumber (final String caseNumber)
    {
        setTextFieldValue (Query_CaseNumber, caseNumber);
        mClickButton (BTN_SEARCH_AE);

        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Gets the m BT N CLOS E SCREEN.
     *
     * @return the m BT N CLOS E SCREEN
     */
    public String getMBTN_CLOSE_SCREEN ()
    {
        return mBTN_CLOSE_SCREEN;
    }

    /**
     * Sets the m BT N CLOS E SCREEN.
     *
     * @param mbtn_close_screen the new m BT N CLOS E SCREEN
     */
    public void setMBTN_CLOSE_SCREEN (final String mbtn_close_screen)
    {
        mBTN_CLOSE_SCREEN = mbtn_close_screen;
    }

    /**
     * Gets the query case number.
     *
     * @return the query case number
     */
    public String getQuery_CaseNumber ()
    {
        return Query_CaseNumber;
    }

    /**
     * Sets the query case number.
     *
     * @param query_CaseNumber the new query case number
     */
    public void setQuery_CaseNumber (final String query_CaseNumber)
    {
        Query_CaseNumber = query_CaseNumber;
    }

    /**
     * Gets the btn search ae.
     *
     * @return the btn search ae
     */
    public String getBTN_SEARCH_AE ()
    {
        return BTN_SEARCH_AE;
    }

    /**
     * Sets the btn search ae.
     *
     * @param btn_search_ae the new btn search ae
     */
    public void setBTN_SEARCH_AE (final String btn_search_ae)
    {
        BTN_SEARCH_AE = btn_search_ae;
    }

    /**
     * Gets the btn per calculator.
     *
     * @return the btn per calculator
     */
    public String getBTN_PER_CALCULATOR ()
    {
        return BTN_PER_CALCULATOR;
    }

    /**
     * Gets the btn add personal allowances.
     *
     * @return the btn add personal allowances
     */
    public String getBTN_ADD_PERSONAL_ALLOWANCES ()
    {
        return BTN_ADD_PERSONAL_ALLOWANCES;
    }

    /**
     * Sets the btn add personal allowances.
     *
     * @param btn_add_personal_allowances the new btn add personal allowances
     */
    public void setBTN_ADD_PERSONAL_ALLOWANCES (final String btn_add_personal_allowances)
    {
        BTN_ADD_PERSONAL_ALLOWANCES = btn_add_personal_allowances;
    }

    /**
     * Gets the btn add premiums.
     *
     * @return the btn add premiums
     */
    public String getBTN_ADD_PREMIUMS ()
    {
        return BTN_ADD_PREMIUMS;
    }

    /**
     * Sets the btn add premiums.
     *
     * @param btn_add_premiums the new btn add premiums
     */
    public void setBTN_ADD_PREMIUMS (final String btn_add_premiums)
    {
        BTN_ADD_PREMIUMS = btn_add_premiums;
    }

    /**
     * Gets the btn add other liabilities.
     *
     * @return the btn add other liabilities
     */
    public String getBTN_ADD_OTHER_LIABILITIES ()
    {
        return BTN_ADD_OTHER_LIABILITIES;
    }

    /**
     * Sets the btn add other liabilities.
     *
     * @param btn_add_other_liabilities the new btn add other liabilities
     */
    public void setBTN_ADD_OTHER_LIABILITIES (final String btn_add_other_liabilities)
    {
        BTN_ADD_OTHER_LIABILITIES = btn_add_other_liabilities;
    }

    /**
     * Gets the btn add other resources.
     *
     * @return the btn add other resources
     */
    public String getBTN_ADD_OTHER_RESOURCES ()
    {
        return BTN_ADD_OTHER_RESOURCES;
    }

    /**
     * Sets the btn add other resources.
     *
     * @param btn_add_other_resources the new btn add other resources
     */
    public void setBTN_ADD_OTHER_RESOURCES (final String btn_add_other_resources)
    {
        BTN_ADD_OTHER_RESOURCES = btn_add_other_resources;
    }

    /**
     * Sets the btn per calculator.
     *
     * @param btn_per_calculator the new btn per calculator
     */
    public void setBTN_PER_CALCULATOR (final String btn_per_calculator)
    {
        BTN_PER_CALCULATOR = btn_per_calculator;
    }

    /**
     * Gets the btn lov.
     *
     * @return the btn lov
     */
    public String getBTN_LOV ()
    {
        return BTN_LOV;
    }

    /**
     * Sets the btn lov.
     *
     * @param btn_lov the new btn lov
     */
    public void setBTN_LOV (final String btn_lov)
    {
        BTN_LOV = btn_lov;
    }

    /**
     * Gets the btn ok.
     *
     * @return the btn ok
     */
    public String getBTN_OK ()
    {
        return BTN_OK;
    }

    /**
     * Sets the btn ok.
     *
     * @param btn_ok the new btn ok
     */
    public void setBTN_OK (final String btn_ok)
    {
        BTN_OK = btn_ok;
    }

    /**
     * Gets the btn cancel.
     *
     * @return the btn cancel
     */
    public String getBTN_CANCEL ()
    {
        return BTN_CANCEL;
    }

    /**
     * Sets the btn cancel.
     *
     * @param btn_cancel the new btn cancel
     */
    public void setBTN_CANCEL (final String btn_cancel)
    {
        BTN_CANCEL = btn_cancel;
    }

    /**
     * Gets the tab personal allowances page.
     *
     * @return the tab personal allowances page
     */
    public String getTAB_PERSONAL_ALLOWANCES_PAGE ()
    {
        return TAB_PERSONAL_ALLOWANCES_PAGE;
    }

    /**
     * Sets the tab personal allowances page.
     *
     * @param tab_personal_allowances_page the new tab personal allowances page
     */
    public void setTAB_PERSONAL_ALLOWANCES_PAGE (final String tab_personal_allowances_page)
    {
        TAB_PERSONAL_ALLOWANCES_PAGE = tab_personal_allowances_page;
    }

    /**
     * Gets the tab premiums page.
     *
     * @return the tab premiums page
     */
    public String getTAB_PREMIUMS_PAGE ()
    {
        return TAB_PREMIUMS_PAGE;
    }

    /**
     * Sets the tab premiums page.
     *
     * @param tab_premiums_page the new tab premiums page
     */
    public void setTAB_PREMIUMS_PAGE (final String tab_premiums_page)
    {
        TAB_PREMIUMS_PAGE = tab_premiums_page;
    }

    /**
     * Gets the tab other liabilities page.
     *
     * @return the tab other liabilities page
     */
    public String getTAB_OTHER_LIABILITIES_PAGE ()
    {
        return TAB_OTHER_LIABILITIES_PAGE;
    }

    /**
     * Sets the tab other liabilities page.
     *
     * @param tab_other_liabilities_page the new tab other liabilities page
     */
    public void setTAB_OTHER_LIABILITIES_PAGE (final String tab_other_liabilities_page)
    {
        TAB_OTHER_LIABILITIES_PAGE = tab_other_liabilities_page;
    }

    /**
     * Gets the tab other resources page.
     *
     * @return the tab other resources page
     */
    public String getTAB_OTHER_RESOURCES_PAGE ()
    {
        return TAB_OTHER_RESOURCES_PAGE;
    }

    /**
     * Sets the tab other resources page.
     *
     * @param tab_other_resources_page the new tab other resources page
     */
    public void setTAB_OTHER_RESOURCES_PAGE (final String tab_other_resources_page)
    {
        TAB_OTHER_RESOURCES_PAGE = tab_other_resources_page;
    }

    /**
     * Gets the popup lov personal allowance.
     *
     * @return the popup lov personal allowance
     */
    public String getPOPUP_LOV_PERSONAL_ALLOWANCE ()
    {
        return POPUP_LOV_PERSONAL_ALLOWANCE;
    }

    /**
     * Sets the popup lov personal allowance.
     *
     * @param popup_lov_personal_allowance the new popup lov personal allowance
     */
    public void setPOPUP_LOV_PERSONAL_ALLOWANCE (final String popup_lov_personal_allowance)
    {
        POPUP_LOV_PERSONAL_ALLOWANCE = popup_lov_personal_allowance;
    }

    /**
     * Gets the popup lov premiums.
     *
     * @return the popup lov premiums
     */
    public String getPOPUP_LOV_PREMIUMS ()
    {
        return POPUP_LOV_PREMIUMS;
    }

    /**
     * Sets the popup lov premiums.
     *
     * @param popup_lov_premiums the new popup lov premiums
     */
    public void setPOPUP_LOV_PREMIUMS (final String popup_lov_premiums)
    {
        POPUP_LOV_PREMIUMS = popup_lov_premiums;
    }

    /**
     * Gets the calculate per personal allowance grid.
     *
     * @return the calculate per personal allowance grid
     */
    public String getCALCULATE_PER_PERSONAL_ALLOWANCE_GRID ()
    {
        return CALCULATE_PER_PERSONAL_ALLOWANCE_GRID;
    }

    /**
     * Sets the calculate per personal allowance grid.
     *
     * @param calculate_per_personal_allowance_grid the new calculate per personal allowance grid
     */
    public void setCALCULATE_PER_PERSONAL_ALLOWANCE_GRID (final String calculate_per_personal_allowance_grid)
    {
        CALCULATE_PER_PERSONAL_ALLOWANCE_GRID = calculate_per_personal_allowance_grid;
    }

    /**
     * Launches the New PER Calculator Form.
     */
    public void selectPERCalculator ()
    {
        mClickButton (BTN_PER_CALCULATOR);
    }

    /**
     * Selects a specified tabbed page on the AE Calculate Protected Earnings Rate screen.
     *
     * @param page The tabbed page to display
     * @throws FrameworkException Exception thrown if problem showing page
     */
    public void selectTabbedPage (final int page) throws FrameworkException
    {
        final TabbedAreaAdaptor tAA = cMB.getTabbedAreaAdaptor (TABBED_AREA_ID);
        switch (page)
        {
            case TABBED_PAGE_PREMIUMS:
                tAA.showPage (TAB_PREMIUMS_PAGE);
                break;
            case TABBED_PAGE_OTHER_LIABILITIES:
                tAA.showPage (TAB_OTHER_LIABILITIES_PAGE);
                break;
            case TABBED_PAGE_OTHER_RESOURCES:
                tAA.showPage (TAB_OTHER_RESOURCES_PAGE);
                break;

            default:
                tAA.showPage (TAB_PERSONAL_ALLOWANCES_PAGE);
                break;
        }
    }

    /**
     * Click on a button specified by the parameter.
     *
     * @param buttonName the button name
     */
    public void pressButton (final String buttonName)
    {
        mClickButton (buttonName);
    }

    /**
     * Selects the owning court via the LOV subform.
     *
     * @param code the code
     * @param grid the grid
     */
    public void selectCodeFromLOV (final String code, final String grid)
    {
        clickLOVSelect (getBTN_LOV (), grid, "Code", code);
    }

    /**
     * Checks if is amount allowed read only.
     *
     * @return true, if is amount allowed read only
     * @throws FrameworkException the framework exception
     */
    public boolean isAmountAllowedReadOnly () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (POPUP_AMOUNT_ALLOWED).isReadOnly ();
    }

    /**
     * Open pop up from grid.
     *
     * @param grid the grid
     * @param code the code
     */
    public void openPopUpFromGrid (final String grid, final String code)
    {
        doubleClickValueFromGrid (grid, code);
    }
}