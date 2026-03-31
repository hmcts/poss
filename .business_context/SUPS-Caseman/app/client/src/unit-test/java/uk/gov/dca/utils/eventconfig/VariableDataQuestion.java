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
package uk.gov.dca.utils.eventconfig;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Utility class representing a variable data screen question.
 */
public class VariableDataQuestion extends AbstractBaseUtils
{
    
    /** The Constant VD_FIELD_TYPE_TEXT. */
    // Static constants representing different adaptor types of the questions
    public static final int VD_FIELD_TYPE_TEXT = 1;
    
    /** The Constant VD_FIELD_TYPE_SELECT. */
    public static final int VD_FIELD_TYPE_SELECT = 2;
    
    /** The Constant VD_FIELD_TYPE_AUTOCOMPLETE. */
    public static final int VD_FIELD_TYPE_AUTOCOMPLETE = 3;
    
    /** The Constant VD_FIELD_TYPE_CHECKBOX. */
    public static final int VD_FIELD_TYPE_CHECKBOX = 4;
    
    /** The Constant VD_FIELD_TYPE_DATEPICKER. */
    public static final int VD_FIELD_TYPE_DATEPICKER = 5;
    
    /** The Constant VD_FIELD_TYPE_ZOOM. */
    public static final int VD_FIELD_TYPE_ZOOM = 6;
    
    /** The Constant VD_FIELD_TYPE_TEXTAREA. */
    public static final int VD_FIELD_TYPE_TEXTAREA = 7;
    
    /** The Constant VD_FIELD_TYPE_GRID. */
    public static final int VD_FIELD_TYPE_GRID = 8;
    
    /** The Constant VD_FIELD_TYPE_BUTTON. */
    public static final int VD_FIELD_TYPE_BUTTON = 9;
    
    /** The Constant VD_FIELD_TYPE_LOV. */
    public static final int VD_FIELD_TYPE_LOV = 10;

    /** The field id. */
    // Private members representing the variable data screen question configurations
    private String fieldId; // Identifier of question field
    
    /** The field type. */
    private int fieldType; // Adaptor type of question
    
    /** The field value. */
    private String fieldValue; // Value to set the field
    
    /** The column index. */
    private int columnIndex; // Column index used for Grid questions
    
    /** The lov grid id. */
    private String lovGridId; // Value to set the field

    /**
     * Constructor.
     *
     * @param pFieldId Identifier of the question field
     * @param pFieldType Type of the question field, e.g. Text, Select
     * @param pFieldValue Value to set the question field (For checkbox, use 'Y' or 'N')
     * @param theCMTestBase Test base object to access the session
     */
    public VariableDataQuestion (final String pFieldId, final int pFieldType, final String pFieldValue,
            final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        fieldId = pFieldId;
        fieldType = pFieldType;
        fieldValue = pFieldValue;
        columnIndex = 1;
    }

    /**
     * Overloaded Constructor with no fieldValue specified.
     *
     * @param pFieldId Identifier of the question field
     * @param pFieldType Type of the question field, e.g. Text, Select
     * @param theCMTestBase Test base object to access the session
     */
    public VariableDataQuestion (final String pFieldId, final int pFieldType, final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        fieldId = pFieldId;
        fieldType = pFieldType;
        fieldValue = null;
        columnIndex = 1;
    }

    /**
     * Overloaded Constructor for Grid questions, includes a column index.
     *
     * @param pFieldId Identifier of the question field
     * @param pFieldType Type of the question field, e.g. Text, Select
     * @param pFieldValue Value to set the question field (For checkbox, use 'Y' or 'N')
     * @param pGridColumn Column index for a Grid question
     * @param theCMTestBase Test base object to access the session
     */
    public VariableDataQuestion (final String pFieldId, final int pFieldType, final String pFieldValue,
            final int pGridColumn, final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        fieldId = pFieldId;
        fieldType = pFieldType;
        fieldValue = pFieldValue;
        columnIndex = pGridColumn;
    }

    /**
     * Overloaded Constructor for LOV questions, includes a column index and LOV Grid Id.
     *
     * @param pFieldId Identifier of the question field
     * @param pFieldType Type of the question field, e.g. Text, Select
     * @param pFieldValue Value to set the question field (For checkbox, use 'Y' or 'N')
     * @param pGridColumn Column index for a Grid question
     * @param pLOVId the LOV id
     * @param theCMTestBase Test base object to access the session
     */
    public VariableDataQuestion (final String pFieldId, final int pFieldType, final String pFieldValue,
            final int pGridColumn, final String pLOVId, final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        fieldId = pFieldId;
        fieldType = pFieldType;
        fieldValue = pFieldValue;
        columnIndex = pGridColumn;
        lovGridId = pLOVId;
    }

    /**
     * Retrieves the default configuration of a variable data screen question.
     *
     * @param pFieldId the field id
     * @param theCMTestBase the the CM test base
     * @return the default VD question
     * @throws Exception the exception
     */
    public static VariableDataQuestion getDefaultVDQuestion (final String pFieldId, final AbstractCmTestBase theCMTestBase)
        throws Exception
    {
        VariableDataQuestion vd = null;

        final VdManager vdConfigManager = VdManager.getInstance ();
        final VdConfig vdConfig = vdConfigManager.getVdConfig (pFieldId);

        if (vdConfig.getFieldType ().equals ("TEXT"))
        {
            // Text field
            vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_TEXT,
                    vdConfig.getDefaultAnswer (), theCMTestBase);
        }
        else if (vdConfig.getFieldType ().equals ("SELECT"))
        {
            // Select field
            vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_SELECT,
                    vdConfig.getDefaultAnswer (), theCMTestBase);
        }
        else if (vdConfig.getFieldType ().equals ("TEXTAREA"))
        {
            // Textarea field
            vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_TEXTAREA,
                    vdConfig.getDefaultAnswer (), theCMTestBase);
        }
        else if (vdConfig.getFieldType ().equals ("ZOOM"))
        {
            // Zoom field
            vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_ZOOM,
                    vdConfig.getDefaultAnswer (), theCMTestBase);
        }
        else if (vdConfig.getFieldType ().equals ("AUTO"))
        {
            // Autocomplete field
            vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_AUTOCOMPLETE,
                    vdConfig.getDefaultAnswer (), theCMTestBase);
        }
        else if (vdConfig.getFieldType ().equals ("CHECKBOX"))
        {
            // Checkbox field
            vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_CHECKBOX,
                    vdConfig.getDefaultAnswer (), theCMTestBase);
        }
        else if (vdConfig.getFieldType ().equals ("DATE"))
        {
            // Datepicker field
            if (vdConfig.getDateIncrement () == 0)
            {
                // Use current system date
                vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
                        AbstractBaseUtils.now (), theCMTestBase);
            }
            else
            {
                // Use a date in the past or future
                vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
                        AbstractBaseUtils.getFutureDate (vdConfig.getDateIncrement (), AbstractBaseUtils.DATE_FORMAT_NOW, false),
                        theCMTestBase);
            }
        }
        else if (vdConfig.getFieldType ().equals ("GRID"))
        {
            // Grid field
            vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_GRID,
                    vdConfig.getDefaultAnswer (), vdConfig.getGridColumn (), theCMTestBase);
        }
        else if (vdConfig.getFieldType ().equals ("LOV"))
        {
            // LOV field
            vd = new VariableDataQuestion (vdConfig.getFieldId (), VariableDataQuestion.VD_FIELD_TYPE_LOV,
                    vdConfig.getDefaultAnswer (), vdConfig.getGridColumn (), vdConfig.getLovId (), theCMTestBase);
        }

        return vd;
    }

    /**
     * Sets the value of the question object based upon field type.
     */
    public void setQuestionValue ()
    {
        switch (fieldType)
        {
            case VD_FIELD_TYPE_TEXT:
                final TextInputAdaptor tA = cMB.getTextInputAdaptor (fieldId);
                tA.type (fieldValue);
                break;
            case VD_FIELD_TYPE_SELECT:
                final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (fieldId);
                sA.clickLabel (fieldValue);
                if (cMB.isAlertPresent ())
                {
                    cMB.getAlert ();
                }
                break;
            case VD_FIELD_TYPE_AUTOCOMPLETE:
                final AutoCompleteAdaptor aA = cMB.getAutoCompleteAdaptor (fieldId);
                aA.setText (fieldValue);
                break;
            case VD_FIELD_TYPE_CHECKBOX:
                final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (fieldId);
                if (fieldValue.equals ("Y") && !cA.isChecked ())
                {
                    // Checkbox needs to be checked and currently is not checked
                    cA.click ();
                }
                else if (fieldValue.equals ("N") && cA.isChecked ())
                {
                    // Checkbox needs to be unchecked and is currently checked
                    cA.click ();
                }
                break;
            case VD_FIELD_TYPE_DATEPICKER:
                final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (fieldId);
                dA.setDate (fieldValue);
                break;
            case VD_FIELD_TYPE_ZOOM:
                final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (fieldId);
                zA.setText (fieldValue);
                break;
            case VD_FIELD_TYPE_TEXTAREA:
                cMB.type (fieldId, fieldValue);
                break;
            case VD_FIELD_TYPE_GRID:
                // For grids select the appropriate column value in the grid
                selectValueFromGrid (fieldId, fieldValue, columnIndex);
                break;
            case VD_FIELD_TYPE_BUTTON:
                // For buttons, click button
                final ButtonAdaptor bA = cMB.getButtonAdaptor (fieldId);
                bA.click ();
                break;
            case VD_FIELD_TYPE_LOV:
                // For LOV fields, click button, raise popup and select value from grid and click Ok
                final ButtonAdaptor lovBtn = cMB.getButtonAdaptor (fieldId);
                lovBtn.click ();
                cMB.waitForPageToLoad ();
                selectValueFromGrid (lovGridId + "_grid", fieldValue, columnIndex);
                final ButtonAdaptor okBtn = cMB.getButtonAdaptor (lovGridId + "_okButton");
                okBtn.click ();
                cMB.waitForPageToLoad ();
                break;
        }
    }

    /**
     * Gets the question value.
     *
     * @return the question value
     */
    public String getQuestionValue ()
    {
        String returnValue = null;

        switch (fieldType)
        {
            case VD_FIELD_TYPE_TEXT:
                final TextInputAdaptor tA = cMB.getTextInputAdaptor (fieldId);
                returnValue = tA.getValue ();
                break;
            case VD_FIELD_TYPE_SELECT:
                final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (fieldId);
                returnValue = sA.getSelectedValue ();
                break;
            case VD_FIELD_TYPE_AUTOCOMPLETE:
                final AutoCompleteAdaptor aA = cMB.getAutoCompleteAdaptor (fieldId);
                returnValue = aA.getText ();
                break;
            case VD_FIELD_TYPE_CHECKBOX:
                final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (fieldId);
                returnValue = cA.isChecked () ? "Y" : "N";
                break;
            case VD_FIELD_TYPE_DATEPICKER:
                final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (fieldId);
                returnValue = dA.getDate ();
                break;
            case VD_FIELD_TYPE_ZOOM:
                final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (fieldId);
                returnValue = zA.getText ();
                break;
            case VD_FIELD_TYPE_TEXTAREA:
                returnValue = cMB.getTextInputAdaptor (fieldId).getValue ();
                break;
            case VD_FIELD_TYPE_GRID:
                final int index = getHighlightedGridRowIndex (fieldId);
                returnValue = getValueFromGrid (fieldId, index, columnIndex);
                break;
            case VD_FIELD_TYPE_BUTTON:
                // For buttons, return button label
                final ButtonAdaptor bA = cMB.getButtonAdaptor (fieldId);
                returnValue = bA.getText ();
                break;
        }

        return returnValue;
    }

    /**
     * Checks if is question enabled.
     *
     * @return true, if is question enabled
     */
    public boolean isQuestionEnabled ()
    {
        boolean returnValue = false;

        try
        {
            switch (fieldType)
            {
                case VD_FIELD_TYPE_TEXT:
                    final TextInputAdaptor tA = cMB.getTextInputAdaptor (fieldId);
                    returnValue = tA.isEnabled ();
                    break;
                case VD_FIELD_TYPE_SELECT:
                    final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (fieldId);
                    returnValue = sA.isEnabled ();
                    break;
                case VD_FIELD_TYPE_AUTOCOMPLETE:
                    final AutoCompleteAdaptor aA = cMB.getAutoCompleteAdaptor (fieldId);
                    returnValue = aA.isEnabled ();
                    break;
                case VD_FIELD_TYPE_CHECKBOX:
                    final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (fieldId);
                    returnValue = cA.isEnabled ();
                    break;
                case VD_FIELD_TYPE_DATEPICKER:
                    final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (fieldId);
                    returnValue = dA.isEnabled ();
                    break;
                case VD_FIELD_TYPE_ZOOM:
                    final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (fieldId);
                    returnValue = zA.isEnabled ();
                    break;
                case VD_FIELD_TYPE_TEXTAREA:
                    final TextInputAdaptor taA = cMB.getTextInputAdaptor (fieldId);
                    returnValue = taA.isEnabled ();
                    break;
                case VD_FIELD_TYPE_GRID:
                    final GridAdaptor gA = cMB.getGridAdaptor (fieldId);
                    returnValue = gA.isEnabled ();
                    break;
                case VD_FIELD_TYPE_BUTTON:
                    // For buttons, return button enabled
                    final ButtonAdaptor bA = cMB.getButtonAdaptor (fieldId);
                    returnValue = bA.isEnabled ();
                    break;
                case VD_FIELD_TYPE_LOV:
                    // For LOV buttons, return button enabled
                    final ButtonAdaptor lovBtn = cMB.getButtonAdaptor (fieldId);
                    returnValue = lovBtn.isEnabled ();
                    break;
            }
        }
        catch (final Exception e)
        {
            returnValue = false;
        }

        return returnValue;
    }

    /**
     * Clicks the Save button on the Variable Data screen.
     */
    public void clickVariableDataSaveButton ()
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (VARIABLE_DATA_SAVE_BUTTON);
        bA.click ();
    }

    /**
     * Clicks the Ok button on the FCK Editor screen.
     */
    public void clickFCKEditorOkButton ()
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (FCK_EDITOR_OK_BUTTON);
        bA.click ();
    }

    /**
     * Clicks the FCK Editor's final checkbox to mark the output as final.
     */
    public void clickFCKEditorFinalCheckbox ()
    {
        final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (FCK_EDITOR_OUTPUT_FINAL);
        cA.click ();
    }
}