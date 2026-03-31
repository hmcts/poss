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
package uk.gov.dca.caseman.bms_service.java.bmsrules;

import java.util.List;

import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 10-May-2005.
 *
 * @author Amjad Khan
 */
public interface IBMSRuleNonEvent
{

    /**
     * Gets the payout type.
     *
     * @return the payout type
     */
    public String getPayoutType ();

    /**
     * Gets the payment type.
     *
     * @return the payment type
     */
    public String getPaymentType ();

    // Warrant Return
    /**
     * Gets the return type.
     *
     * @return the return type
     */
    public String getReturnType ();

    /**
     * Gets the return code.
     *
     * @return the return code
     */
    public String getReturnCode ();

    /**
     * Gets the warrant type.
     *
     * @return the warrant type
     */
    public String getWarrantType ();

    /**
     * Gets the case type.
     *
     * @return the case type
     */
    public String getCaseType ();

    /**
     * Gets the action id.
     *
     * @return the action id
     */
    public String getActionId (); // Warrants

    /**
     * Gets the manually created return.
     *
     * @return the manually created return
     */
    public String getManuallyCreatedReturn ();

    /**
     * Gets the warrant id.
     *
     * @return the warrant id
     */
    public String getWarrantId ();

    /**
     * Gets the type of warrant.
     *
     * @return the type of warrant
     */
    public String getTypeOfWarrant ();

    // General
    /**
     * Gets the receipt date required.
     *
     * @return the receipt date required
     */
    public String getReceiptDateRequired ();

    /**
     * Gets the processing date required.
     *
     * @return the processing date required
     */
    public String getProcessingDateRequired ();

    /**
     * Gets the section.
     *
     * @return the section
     */
    public String getSection ();

    /**
     * Gets the count increment.
     *
     * @return the count increment
     */
    public String getCountIncrement ();

    /**
     * Gets the task.
     *
     * @return the task
     */
    public String getTask ();

    /**
     * Gets the bms type.
     *
     * @return the bms type
     */
    public String getBmsType ();

    /**
     * Gets the court code.
     *
     * @return the court code
     */
    public String getCourtCode ();

    /**
     * Returns xml representation of this object.
     *
     * @return The xml string
     * @throws SystemException the system exception
     */
    public String toXML () throws SystemException;

    /**
     * Gets the comparable values.
     *
     * @return the comparable values
     */
    public List<String> getComparableValues ();

    /**
     * Adds a required parameter to the list.
     * 
     * @param param The required parameter
     */
    public void addRequiredParamToList (String param);

    /**
     * Gets the required param values.
     *
     * @return the required param values
     */
    public List<String> getRequiredParamValues ();

    /**
     * Adds a method to the compare list.
     * 
     * @param methodName The method name
     */
    public void addMethodToCompare (String methodName);

}
