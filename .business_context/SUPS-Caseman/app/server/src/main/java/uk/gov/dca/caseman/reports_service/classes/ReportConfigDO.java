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
package uk.gov.dca.caseman.reports_service.classes;

/**
 * The Class ReportConfigDO.
 *
 * @author Anoop Sehdev
 */
public class ReportConfigDO
{

    /** The report name. */
    private String reportName;
    
    /** The is reprint. */
    private boolean isReprint;
    
    /** The is update system data. */
    private boolean isUpdateSystemData;
    
    /** The is send report sequence. */
    private boolean isSendReportSequence;
    
    /** The is wait for completion. */
    private boolean isWaitForCompletion;
    
    /** The is bulk print. */
    private boolean isBulkPrint;

    /**
     * Checks if is wait for completion.
     *
     * @return true, if is wait for completion
     */
    public boolean isWaitForCompletion ()
    {
        return isWaitForCompletion;
    }

    /**
     * Sets the wait for completion.
     *
     * @param isWaitForCompletion the new wait for completion
     */
    public void setWaitForCompletion (final boolean isWaitForCompletion)
    {
        this.isWaitForCompletion = isWaitForCompletion;
    }

    /**
     * Checks if is update system data.
     *
     * @return true, if is update system data
     */
    public boolean isUpdateSystemData ()
    {
        return isUpdateSystemData;
    }

    /**
     * Sets the update system data.
     *
     * @param isUpdateSystemData the new update system data
     */
    public void setUpdateSystemData (final boolean isUpdateSystemData)
    {
        this.isUpdateSystemData = isUpdateSystemData;
    }

    /**
     * Constructor.
     */
    public ReportConfigDO ()
    {
    }

    /**
     * Checks if is reprint.
     *
     * @return true, if is reprint
     */
    public boolean isReprint ()
    {
        return isReprint;
    }

    /**
     * Sets the reprint.
     *
     * @param isReprint the new reprint
     */
    public void setReprint (final boolean isReprint)
    {
        this.isReprint = isReprint;
    }

    /**
     * Gets the report name.
     *
     * @return the report name
     */
    public String getReportName ()
    {
        return reportName;
    }

    /**
     * Sets the report name.
     *
     * @param reportName the new report name
     */
    public void setReportName (final String reportName)
    {
        this.reportName = reportName;
    }

    /**
     * Checks if is send report sequence.
     *
     * @return true, if is send report sequence
     */
    public boolean isSendReportSequence ()
    {
        return isSendReportSequence;
    }

    /**
     * Sets the send report sequence.
     *
     * @param isSendReportSequence the new send report sequence
     */
    public void setSendReportSequence (final boolean isSendReportSequence)
    {
        this.isSendReportSequence = isSendReportSequence;
    }

    /**
     * Checks if is bulk print.
     *
     * @return true, if is bulk print
     */
    public boolean isBulkPrint ()
    {
        return isBulkPrint;
    }

    /**
     * Sets the bulk print.
     *
     * @param isBulkPrint the new bulk print
     */
    public void setBulkPrint (final boolean isBulkPrint)
    {
        this.isBulkPrint = isBulkPrint;
    }
}
