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
 * Created on 09-Mar-2005.
 *
 * @author Amjad Khan
 */
public interface IBMSRule
{

    /**
     * Gets the event id.
     *
     * @return the event id
     */
    public int getEventId ();

    /**
     * Gets the case type.
     *
     * @return the case type
     */
    public String getCaseType ();

    /**
     * Gets the applicant type.
     *
     * @return the applicant type
     */
    public String getApplicantType ();

    /**
     * Gets the hearing type.
     *
     * @return the hearing type
     */
    public String getHearingType ();

    /**
     * Gets the hearing flag.
     *
     * @return the hearing flag
     */
    public String getHearingFlag ();

    /**
     * Gets the listing type.
     *
     * @return the listing type
     */
    public String getListingType ();

    /**
     * Gets the event type.
     *
     * @return the event type
     */
    public String getEventType ();

    /**
     * Gets the issue.
     *
     * @return the issue
     */
    public String getIssue ();

    /**
     * Gets the applicant response.
     *
     * @return the applicant response
     */
    public String getApplicantResponse ();

    /**
     * Gets the AE event id.
     *
     * @return the AE event id
     */
    public int getAEEventId ();

    /**
     * Gets the AE event ID.
     *
     * @return the AE event ID
     */
    public String getAEEventID ();

    /**
     * Gets the court type.
     *
     * @return the court type
     */
    public String getCourtType ();

    /**
     * Gets the task.
     *
     * @return the task
     */
    public String getTask ();

    /**
     * Gets the BMS type.
     *
     * @return the BMS type
     */
    public String getBMSType ();

    /**
     * Gets the coded party.
     *
     * @return the coded party
     */
    public String getCodedParty ();

    /**
     * Gets the event type flag.
     *
     * @return the event type flag
     */
    public String getEventTypeFlag ();

    /**
     * Gets the case type category.
     *
     * @return the case type category
     */
    public String getCaseTypeCategory ();

    /**
     * Returns xml string representation of this object.
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
}
