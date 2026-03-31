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
package uk.gov.dca.caseman.obligation_service.java.obligationrules.impl;

import java.util.HashMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationManager;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationRule;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationStorageRetrivalManager;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationTypes;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 15-Feb-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 28-Jan-2013 Chris Vincent: event id's now passed in as Strings instead of integers. Trac 4767
 * 
 * @author Amjad Khan
 */
public final class ObligationManager implements IObligationManager
{
    
    /** The Constant log. */
    private static final Log log = LogFactory.getLog (ObligationManager.class);
    
    /** The Constant instance. */
    private static final ObligationManager instance = new ObligationManager ();

    /** The obligation rules config. */
    protected HashMap<String, ObligationRule> obligationRulesConfig;
    
    /** The obligation rules automatic config. */
    protected HashMap<String, ObligationRule> obligationRulesAutomaticConfig;
    
    /** The obligation rules config AE. */
    protected HashMap<String, ObligationRule> obligationRulesConfigAE;
    
    /** The obligation rules automatic config AE. */
    protected HashMap<String, ObligationRule> obligationRulesAutomaticConfigAE;
    
    /** The obligation types config. */
    protected HashMap<String, ObligationType> obligationTypesConfig;

    /**
     * Gets the Constant instance.
     *
     * @return the Constant instance
     */
    public static ObligationManager getInstance ()
    {
        return instance;
    }

    /**
     * Instantiates a new obligation manager.
     */
    private ObligationManager ()
    {
        load ();
    }

    /**
     * (non-Javadoc).
     *
     * @param EventId the event id
     * @return the obligation automatic rules
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationManager#getObligationAutomaticRules(String)
     */
    public IObligationRule getObligationAutomaticRules (final String EventId)
    {

        if (obligationRulesAutomaticConfig.containsKey (EventId))
        {
            return (IObligationRule) obligationRulesAutomaticConfig.get (EventId);
        }
        return null;
    }

    /**
     * (non-Javadoc).
     *
     * @param EventId the event id
     * @return the obligation rules
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationManager#getObligationRules(String)
     */
    public IObligationRule getObligationRules (final String EventId)
    {

        if (obligationRulesConfig.containsKey (EventId))
        {
            return (IObligationRule) obligationRulesConfig.get (EventId);
        }
        return null;
    }

    /**
     * (non-Javadoc).
     *
     * @param EventId the event id
     * @return the obligation automatic rules AE
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationManager#getObligationAutomaticRulesAE(String)
     */
    public IObligationRule getObligationAutomaticRulesAE (final String EventId)
    {

        if (obligationRulesAutomaticConfigAE.containsKey (EventId))
        {
            return (IObligationRule) obligationRulesAutomaticConfigAE.get (EventId);
        }
        return null;
    }

    /**
     * (non-Javadoc).
     *
     * @param EventId the event id
     * @return the obligation rules AE
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationManager#getObligationRulesAE(String)
     */
    public IObligationRule getObligationRulesAE (final String EventId)
    {

        if (obligationRulesConfigAE.containsKey (EventId))
        {
            return (IObligationRule) obligationRulesConfigAE.get (EventId);
        }
        return null;
    }

    /**
     * (non-Javadoc).
     *
     * @param obligationType the obligation type
     * @return the obligation types
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationManager#getObligationTypes(java.lang.String)
     */
    public IObligationTypes getObligationTypes (final String obligationType)
    {
        if (obligationTypesConfig.containsKey (obligationType))
        {
            return (IObligationTypes) obligationTypesConfig.get (obligationType);
        }
        return null;
    }

    /**
     * Load.
     */
    private void load ()
    {
        try
        {
            final IObligationStorageRetrivalManager isrm = ObligationFactory.getStorageManager ();
            obligationRulesConfig = isrm.getObligationRules ();
            obligationRulesConfigAE = isrm.getObligationRulesAE ();
            obligationRulesAutomaticConfig = isrm.getObligationAutomaticRules ();
            obligationRulesAutomaticConfigAE = isrm.getObligationAutomaticRulesAE ();
            obligationTypesConfig = isrm.getObligationTypes ();
        }
        catch (final SystemException se)
        {
            log.error ("Unable to Load Data for Obligation RULES", se);
        }
        catch (final BusinessException e)
        {
            log.error ("Unable to Load Data for Obligation RULES", e);
        }
    }
}
