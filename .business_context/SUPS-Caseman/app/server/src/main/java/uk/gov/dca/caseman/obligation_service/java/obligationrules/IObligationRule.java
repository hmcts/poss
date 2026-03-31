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
package uk.gov.dca.caseman.obligation_service.java.obligationrules;

import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 15-Feb-2005
 * Change History:
 * 28-Jan-2013 Chris Vincent: getEventId() now returns a String instead of an Integer. Trac 4767
 * 
 * @author Amjad Khan
 */
public interface IObligationRule
{

    /**
     * Gets the event id.
     *
     * @return the event id
     */
    public String getEventId ();

    /**
     * Gets the obligation type.
     *
     * @return the obligation type
     */
    public String getObligationType ();

    /**
     * Gets the maintenance mode.
     *
     * @return the maintenance mode
     */
    public String getMaintenanceMode ();

    /**
     * Gets the mechanism.
     *
     * @return the mechanism
     */
    public String getMechanism ();

    /**
     * Gets the action.
     *
     * @return the action
     */
    public String getAction ();

    /**
     * Gets the default days.
     *
     * @return the default days
     */
    public int getDefaultDays ();

    /**
     * Gets the default days str.
     *
     * @return the default days str
     */
    public String getDefaultDaysStr ();

    /**
     * Returns xml representation of this object.
     *
     * @return The xml string.
     * @throws SystemException the system exception
     */
    public String toXML () throws SystemException;
}
