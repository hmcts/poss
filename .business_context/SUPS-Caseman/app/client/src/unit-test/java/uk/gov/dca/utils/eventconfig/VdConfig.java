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

/**
 * Utility class representing a variable data question configuration.
 */
public class VdConfig
{
    
    /** The field id. */
    private String fieldId;
    
    /** The field type. */
    private String fieldType;
    
    /** The default answer. */
    private String defaultAnswer;
    
    /** The grid column. */
    private int gridColumn;
    
    /** The date increment. */
    private int dateIncrement;
    
    /** The lov id. */
    private String lovId;

    /**
     * Constructor.
     */
    public VdConfig ()
    {
    }

    /**
     * Gets the field id.
     *
     * @return the field id
     */
    public String getFieldId ()
    {
        return fieldId;
    }

    /**
     * Sets the field id.
     *
     * @param pFieldId the new field id
     */
    public void setFieldId (final String pFieldId)
    {
        fieldId = pFieldId;
    }

    /**
     * Gets the field type.
     *
     * @return the field type
     */
    public String getFieldType ()
    {
        return fieldType;
    }

    /**
     * Sets the field type.
     *
     * @param pFieldType the new field type
     */
    public void setFieldType (final String pFieldType)
    {
        fieldType = pFieldType;
    }

    /**
     * Gets the default answer.
     *
     * @return the default answer
     */
    public String getDefaultAnswer ()
    {
        return defaultAnswer;
    }

    /**
     * Sets the default answer.
     *
     * @param pAnswer the new default answer
     */
    public void setDefaultAnswer (final String pAnswer)
    {
        defaultAnswer = pAnswer;
    }

    /**
     * Gets the grid column.
     *
     * @return the grid column
     */
    public int getGridColumn ()
    {
        return gridColumn;
    }

    /**
     * Sets the grid column.
     *
     * @param pColumn the new grid column
     */
    public void setGridColumn (final int pColumn)
    {
        gridColumn = pColumn;
    }

    /**
     * Gets the date increment.
     *
     * @return the date increment
     */
    public int getDateIncrement ()
    {
        return dateIncrement;
    }

    /**
     * Sets the date increment.
     *
     * @param pIncrement the new date increment
     */
    public void setDateIncrement (final int pIncrement)
    {
        dateIncrement = pIncrement;
    }

    /**
     * Gets the lov id.
     *
     * @return the lov id
     */
    public String getLovId ()
    {
        return lovId;
    }

    /**
     * Sets the lov id.
     *
     * @param pLovId the new lov id
     */
    public void setLovId (final String pLovId)
    {
        lovId = pLovId;
    }

}