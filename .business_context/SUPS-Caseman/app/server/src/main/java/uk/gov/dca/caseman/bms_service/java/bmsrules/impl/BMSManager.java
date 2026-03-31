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
package uk.gov.dca.caseman.bms_service.java.bmsrules.impl;

import java.util.Map;

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSManager;
import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSStorageRetrivalManager;
import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSTypes;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 09-Mar-2005
 *
 * Change History:
 * 15-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * @author Amjad Khan
 */
public final class BMSManager implements IBMSManager
{
    
    /** The Constant instance. */
    private static final BMSManager instance = new BMSManager ();
    
    /** The construction business exception. */
    private BusinessException constructionBusinessException;
    
    /** The construction system exception. */
    private SystemException constructionSystemException;
    
    /** The c CREF code config. */
    protected Map<String, BMSType> cCREFCodeConfig;
    
    /** The bms rules config. */
    protected Map<String, BMSRuleList> bmsRulesConfig;
    
    /** The bms rules non events config. */
    protected Map<String, BMSRuleNonEventList> bmsRulesNonEventsConfig;
    
    /** The bms rules non events action config. */
    protected Map<String, BMSActionType> bmsRulesNonEventsActionConfig;

    /**
     * Gets the Constant instance.
     *
     * @return the Constant instance
     * @throws BusinessException business exception.
     * @throws SystemException system exception.
     */
    public static BMSManager getInstance () throws BusinessException, SystemException
    {
        instance.throwAnyConstructionException ();
        return instance;
    }

    /**
     * Throws any construction exceptions.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public void throwAnyConstructionException () throws BusinessException, SystemException
    {
        if (constructionBusinessException != null)
        {
            throw constructionBusinessException;
        }
        if (constructionSystemException != null)
        {
            throw constructionSystemException;
        }
    } // throwAnyConstructionException()

    /**
     * Instantiates a new BMS manager.
     */
    private BMSManager ()
    {
        try
        {
            load ();
        }
        catch (final BusinessException e)
        {
            constructionBusinessException = e;
        }
        catch (final SystemException e)
        {
            constructionSystemException = e;
        }
    }

    /**
     * (non-Javadoc).
     *
     * @param EventId the event id
     * @return the BMS rules
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSManager#getBMSRules(int)
     */
    public BMSRuleList getBMSRules (final int EventId)
    {

        final String event = Integer.toString (EventId);
        if (bmsRulesConfig.containsKey (event))
        {
            return bmsRulesConfig.get (event);
        }
        return null;
    }

    /**
     * (non-Javadoc).
     *
     * @param caseType the case type
     * @return the CCREF codes
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSManager#getCCREFCodes(java.lang.String)
     */
    public IBMSTypes getCCREFCodes (final String caseType)
    {
        if (cCREFCodeConfig.containsKey (caseType))
        {
            return (IBMSTypes) cCREFCodeConfig.get (caseType);
        }
        return null;
    }

    /**
     * (non-Javadoc).
     *
     * @param section the section
     * @return the BMS rules non events
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSManager#getBMSRulesNonEvents(java.lang.String)
     */
    public BMSRuleNonEventList getBMSRulesNonEvents (final String section)
    {
        if (bmsRulesNonEventsConfig.containsKey (section))
        {
            return bmsRulesNonEventsConfig.get (section);
        }
        return null;
    }

    /**
     * (non-Javadoc).
     *
     * @param action the action
     * @return the BMS rules non events action
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSManager#getBMSRulesNonEventsAction(java.lang.String)
     */
    public BMSActionType getBMSRulesNonEventsAction (final String action)
    {
        if (bmsRulesNonEventsActionConfig.containsKey (action))
        {
            return bmsRulesNonEventsActionConfig.get (action);
        }
        return null;
    }

    /**
     * Load.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void load () throws BusinessException, SystemException
    {
        final IBMSStorageRetrivalManager isrm = BMSFactory.getStorageManager ();
        bmsRulesConfig = isrm.getBMSRules ();
        cCREFCodeConfig = isrm.getCCREFCodes ();
        bmsRulesNonEventsConfig = isrm.getBMSRulesNonEvents ();
        bmsRulesNonEventsActionConfig = isrm.getBMSRulesNonEventsAction ();
    }

}
