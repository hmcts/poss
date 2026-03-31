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
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.FilteredGridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Maintain Obligations screen.
 *
 * Date: 09-Jun-2009
 */
public class UC009MaintainObligationsUtils extends AbstractBaseScreenUtils
{
    
    /** The text obligation type. */
    // Private text field identifiers
    private String TEXT_OBLIGATION_TYPE = "Master_ObligationType";
    
    /** The text obligation desc. */
    private String TEXT_OBLIGATION_DESC = "Master_Description";
    
    /** The text add obl days. */
    private String TEXT_ADD_OBL_DAYS = "New_Obligation_Popup_Days";
    
    /** The date add obl expiry. */
    private String DATE_ADD_OBL_EXPIRY = "New_Obligation_Popup_ExpiryDate";
    
    /** The zoom add obl notes. */
    private String ZOOM_ADD_OBL_NOTES = "New_Obligation_Popup_Notes";
    
    /** The text obl description. */
    private String TEXT_OBL_DESCRIPTION = "Details_Description";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_CloseBtn";

    /** The m BT N AD D NE W OBL. */
    // Private button field identifiers
    private String mBTN_ADD_NEW_OBL = "New_Obligation_Popup_SaveBtn";
    
    /** The m BT N AD D NOTE S LOV. */
    private String mBTN_ADD_NOTES_LOV = "New_Obligation_Popup_NotesLOVBtn";
    
    /** The m BT N REMOV E OBL. */
    private String mBTN_REMOVE_OBL = "Master_RemoveObligationBtn";
    
    /** The m BT N SAVE. */
    private String mBTN_SAVE = "Status_SaveBtn";

    /** The popup new obligation. */
    // Private popup identifiers
    private String POPUP_NEW_OBLIGATION = "New_Obligation_Popup";
    
    /** The lov note types. */
    private String LOV_NOTE_TYPES = "NotesTypeLOVGrid";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC009MaintainObligationsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain Obligations";
    }

    /**
     * Gets the obligation type.
     *
     * @return the obligation type
     */
    public String getObligationType ()
    {
        return cMB.getTextInputAdaptor (TEXT_OBLIGATION_TYPE).getValue ();
    }

    /**
     * Gets the obligation type description.
     *
     * @return the obligation type description
     */
    public String getObligationTypeDescription ()
    {
        return cMB.getTextInputAdaptor (TEXT_OBLIGATION_DESC).getValue ();
    }

    /**
     * Gets the existing obligation description.
     *
     * @return the existing obligation description
     */
    public String getExistingObligationDescription ()
    {
        return cMB.getTextInputAdaptor (TEXT_OBL_DESCRIPTION).getValue ();
    }

    /**
     * Gets the new obligation days.
     *
     * @return the new obligation days
     */
    public String getNewObligationDays ()
    {
        return cMB.getTextInputAdaptor (TEXT_ADD_OBL_DAYS).getValue ();
    }

    /**
     * Gets the expiry date.
     *
     * @return the expiry date
     */
    public String getExpiryDate ()
    {
        return cMB.getDatePickerAdaptor (DATE_ADD_OBL_EXPIRY).getDate ();
    }

    /**
     * Sets the new obligation type.
     *
     * @param pObligationType the new new obligation type
     */
    public void setNewObligationType (final String pObligationType)
    {
        setTextFieldValue (TEXT_OBLIGATION_TYPE, pObligationType);
    }

    /**
     * Sets the new obligation expiry date.
     *
     * @param pDate the new new obligation expiry date
     */
    public void setNewObligationExpiryDate (final String pDate)
    {
        if (isNewObligationPopupVisible ())
        {
            // Popup is visible, set the value
            final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_ADD_OBL_EXPIRY);
            dA.setDate (pDate);
        }
    }

    /**
     * Clicks the Save button in the Add Obligation Popup.
     */
    public void clickAddObligationSaveButton ()
    {
        mClickButton (mBTN_ADD_NEW_OBL);
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the remove Obligation button.
     */
    public void clickRemoveObligationButton ()
    {
        mClickButton (mBTN_REMOVE_OBL);
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        cMB.clickButton (this.mBTN_CLOSE_SCREEN);
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Clicks the save button.
     */
    public void clickSave ()
    {
        mClickButton (this.mBTN_SAVE);
        cMB.waitForPageToLoad ();
    }

    /**
     * Function handles the creation of a new Obligation.
     *
     * TO DO - Adapt function to deal with the JavaScript confirmation popup which appears if the expiry
     * date is set to a non working day.
     * TO DO - Adapt function to deal with read only Notes fields and using the LOV to populate the field.
     *
     * @param days The number of days in the future the expiry date will be set to
     * @param notes Value to be set in the Notes field
     * @throws Exception Thrown if problem creating the obligation
     */
    public void handleAddObligationPopup (final String days, final String notes) throws Exception
    {
        // Set the Days field to the value passed in - will fail at this point if the expiry date falls
        // on a non working day
        cMB.type (TEXT_ADD_OBL_DAYS, days);
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }

        final ButtonAdaptor bA = cMB.getButtonAdaptor (mBTN_ADD_NOTES_LOV);
        if (bA.isEnabled ())
        {
            // Notes field LOV enabled, select a value from the LOV
            bA.click ();
            cMB.waitForPageToLoad ();
            final SubFormAdaptor notesLOVSubform = cMB.getSubFormAdaptor (LOV_NOTE_TYPES);
            final FilteredGridAdaptor subFormGrid =
                    (FilteredGridAdaptor) notesLOVSubform.getAdaptor (FRAMEWORK_LOV_SUBFORM_GRID);

            if ( !notes.equals (""))
            {
                subFormGrid.filterColumn ("Description", notes);
            }

            subFormGrid.doubleClickRow (1);
            cMB.waitForPageToLoad ();
        }
        else
        {
            // Enter a value in the Notes zoom field
            final ZoomFieldAdaptor newOblNotes = cMB.getZoomFieldAdaptor (ZOOM_ADD_OBL_NOTES);
            newOblNotes.setText (notes);
        }

        // Click the add button to insert into database and close the popup
        cMB.clickButton (mBTN_ADD_NEW_OBL);
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
    }

    /**
     * Checks if is new obligation popup visible.
     *
     * @return true, if is new obligation popup visible
     */
    public boolean isNewObligationPopupVisible ()
    {
        final PopupAdaptor popup = cMB.getPopupAdaptor (POPUP_NEW_OBLIGATION);
        return popup.isVisible ();
    }
}