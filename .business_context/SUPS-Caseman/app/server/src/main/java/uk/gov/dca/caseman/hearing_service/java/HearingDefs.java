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
package uk.gov.dca.caseman.hearing_service.java;

/**
 * Created on 23-06-2005
 * 
 * Change History
 * 25-May-2006 Chris Hutt
 * TD defect UCT273: PreConditionAeHearingCheck added.
 *
 * @author gzyysf
 */
public class HearingDefs
{
    /**
     * Hearing service name.
     */
    public static final String HEARING_SERVICE = "ejb/HearingServiceLocal";
    /**
     * Is hearing for case method name.
     */
    public static final String IS_HEARING_FOR_CASE = "isHearingForCaseLocal";
    /**
     * Get future co hearings method name.
     */
    public static final String GET_FUTURE_CO_HEARINGS = "getFutureCoHearingsLocal";
    /**
     * Is past ae hearings method name.
     */
    public static final String IS_PAST_AE_HEARINGS = "isPastAeHearingsLocal";
    /**
     * Is future ae hearings method name.
     */
    public static final String IS_FUTURE_AE_HEARINGS = "isFutureAeHearingsLocal";
    /**
     * Is ae hearings method name.
     */
    public static final String IS_AE_HEARINGS = "isAeHearingsLocal";
} // class HearingDefs
