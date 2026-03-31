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
package uk.gov.dca.caseman.co_service.java;

/**
 * Created on 19 July 2005.
 *
 * @author gzyysf
 */
public class CoDefs
{

    /**
     * co service name.
     */
    public static final String CO_SERVICE = "ejb/CoServiceLocal";

    /**
     * Get co for event checks method name.
     */
    public static final String GET_CO_FOR_EVENT_CHECKS = "getCoForEventChecksLocal";
    /**
     * Is employer detail method name.
     */
    public static final String IS_EMPLOYER_DETAIL = "isEmployerDetailLocal";
    /**
     * Is employer named person method name.
     */
    public static final String IS_EMPLOYER_NAMED_PERSON = "isEmployerNamedPersonLocal";
    /**
     * Is existing debts method name.
     */
    public static final String IS_EXISTING_DEBTS = "isExistingDebtsLocal";
    /**
     * Get debt status method name.
     */
    public static final String GET_DEBT_STATUS = "getDebtStatusLocal";
    /**
     * Get debt method name.
     */
    public static final String GET_DEBT = "getDebtLocal";
    /**
     * Update co on event commit method name.
     */
    public static final String UPDATE_CO_ON_EVENT_COMMIT = "updateCoOnEventCommitLocal";
    /**
     * Get co on event commit method name.
     */
    public static final String GET_CO_ON_EVENT_COMMIT = "getCoOnEventCommitLocal";
    /**
     * Get co party list method name.
     */
    public static final String GET_CO_PARTY_LIST = "getCoPartyListLocal";

} // class CoEventDefs
