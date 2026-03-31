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

import java.util.Map;

import org.jdom.Document;

import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSActionType;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSRuleList;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSRuleNonEventList;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSType;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 09-Mar-20055.
 *
 * @author Amjad Khan
 */
public interface IBMSStorageRetrivalManager
{

    /**
     * Returns the CC ref codes document.
     *
     * @param doc The document
     * @return The CC ref codes
     * @throws SystemException the system exception
     */
    public Map<String, BMSType> getCCREFCodes (Document doc) throws SystemException;

    /**
     * Gets the CCREF codes.
     *
     * @return the CCREF codes
     */
    public Map<String, BMSType> getCCREFCodes ();

    /**
     * Returns the bms rules map.
     *
     * @param doc The document
     * @return The bms rules
     * @throws SystemException the system exception
     */
    public Map<String, BMSRuleList> getBMSRules (Document doc) throws SystemException;

    /**
     * Gets the BMS rules.
     *
     * @return the BMS rules
     */
    public Map<String, BMSRuleList> getBMSRules ();

    /**
     * Returns the bms rules none events map.
     *
     * @param doc The document
     * @return The bms rules none events
     * @throws SystemException the system exception
     */
    public Map<String, BMSRuleNonEventList> getBMSRulesNonEvents (Document doc) throws SystemException;

    /**
     * Gets the BMS rules non events.
     *
     * @return the BMS rules non events
     */
    public Map<String, BMSRuleNonEventList> getBMSRulesNonEvents ();

    /**
     * Returns the bms rules none events action map.
     *
     * @param doc The document
     * @return The bms rules none events action
     * @throws SystemException the system exception
     */
    public Map<String, BMSActionType> getBMSRulesNonEventsAction (Document doc) throws SystemException;

    /**
     * Gets the BMS rules non events action.
     *
     * @return the BMS rules non events action
     */
    public Map<String, BMSActionType> getBMSRulesNonEventsAction ();

}