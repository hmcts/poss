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
package uk.gov.dca.caseman.case_service.java;

/**
 * Created on 02-Mar-2005.
 *
 * @author gzyysf
 * 
 *         Change History
 *         Chris Hutt 3 April 07 - Added GET_CASE_FOR_BMS_METHOD to support BMS for CCBC and MCOL
 *         Struan Kerr-Liddell, July 16, 2008 - Added definitions for get_case_service &
 *         get_case_no_from_insolvency_no_service
 *         Chris Vincent, 15 Nov 2012 - Added GET_CASE_WELSH_TRANSLATION for Trac 4761
 *         Chris Vincent, 28 Jan 2013 - Added GET_CASE_TRACK for Trac 4763.
 */

public final class CaseDefs
{

    // Services
    /**
     * Case service name.
     */
    public static final String CASE_SERVICE = "ejb/CaseServiceLocal";

    /**
     * Check delete none coded party method name.
     */
    public static final String CHECK_DELETE_NON_CODED_PARTY_METHOD = "checkDeleteNonCodedPartyLocal";
    /**
     * Check delete none coded party address method name.
     */
    public static final String CHECK_DELETE_NON_CODED_PARTY_ADDRESS_METHOD = "checkDeleteNonCodedPartyAddressLocal";
    /**
     * Delete none coded party method name.
     */
    public static final String DELETE_NON_CODED_PARTY_METHOD = "deleteNonCodedPartyLocal";
    /**
     * Get case has coded party claimants method name.
     */
    public static final String GET_CASE_HAS_CODED_PARTY_CLAIMANTS_METHOD = "getCaseHasCodedPartyClaimantsLocal";
    /**
     * Get case summary method name.
     */
    public static final String GET_CASE_SUMMARY = "getCaseSummaryLocal";
    /**
     * Get case type method name.
     */
    public static final String GET_CASE_TYPE_METHOD = "getCaseTypeLocal";
    /**
     * get last case status method name.
     */
    public static final String GET_LAST_CASE_STATUS_METHOD = "getLastCaseStatusLocal";
    /**
     * Get case status setting for case event method name.
     */
    public static final String GET_CASE_STATUS_SETTING_FOR_CASE_EVENT_METHOD = "getCaseStatusSettingForCaseEventLocal";
    /**
     * Maintain case parties method name.
     */
    public static final String MAINTAIN_CASE_PARTIES_METHOD = "maintainCasePartiesLocal";
    /**
     * Get claim details method name.
     */
    public static final String GET_CLAIM_DETAILS = "getClaimDetailsLocal";
    /**
     * Get defs with no judgment bar method name.
     */
    public static final String GET_DEFS_WITH_NO_JUDGMENT_BAR = "getDefsWithNoJudgmentBarLocal";
    /**
     * Get case status method name.
     */
    public static final String GET_CASE_STATUS = "getCaseStatusLocal";
    /**
     * Get case parties with warrant method name.
     */
    public static final String GET_CASE_PARTIES_WITH_WARRANT = "getCasePartiesWithWarrantLocal";
    /**
     * Is ae for case method name.
     */
    public static final String IS_AE_FOR_CASE = "isAeForCaseLocal";
    /**
     * Get case for BMS method name.
     */
    public static final String GET_CASE_FOR_BMS_METHOD = "getCaseForBmsLocal";

    /** Get case method name. */
    public static final String GET_CASE = "getCaseLocal";

    /** Method to get the case number from the insolvency number and owning court. */
    public static final String GET_CASE_NO_FROM_INSOLVENCY_NO = "getCaseNoFromInsolvencyNoLocal";

    /** Method to indicate whether or not a case has any parties requesting translation to Welsh. */
    public static final String GET_CASE_WELSH_TRANSLATION = "getCaseWelshTranslationLocal";

    /** Method to return the value of the case's track field. */
    public static final String GET_CASE_TRACK = "getCaseTrackLocal";

    /** Method to return the value of the case's jurisdiction. */
    public static final String GET_CASE_JURISDICTION = "getCaseJurisdictionLocal";

    /**
     * Prevent object construction outside of this class.
     */
    private CaseDefs ()
    {
        // empty
    }

}
