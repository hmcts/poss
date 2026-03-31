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
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationRulesStorageManager;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationStorageRetrivalManager;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 15-Feb-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 28-Jan-2013 Chris Vincent: event id's are now Strings instead of integers. Trac 4767
 *
 * @author Amjad Khan
 */
public class ObligationStorageManager implements IObligationStorageRetrivalManager
{
    
    /** The Constant log. */
    private static final Log log = LogFactory.getLog (ObligationStorageManager.class);
    
    /** The obj hash rules. */
    private HashMap<String, ObligationRule> objHashRules;
    
    /** The obj hash automatic rules. */
    private HashMap<String, ObligationRule> objHashAutomaticRules;
    
    /** The obj hash types. */
    private HashMap<String, ObligationType> objHashTypes;
    
    /** The obj hash automatic rules AE. */
    private HashMap<String, ObligationRule> objHashAutomaticRulesAE;
    
    /** The obj hash rules AE. */
    private HashMap<String, ObligationRule> objHashRulesAE;

    /**
     * Constructor.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public ObligationStorageManager () throws BusinessException, SystemException
    {
        objHashRules = new HashMap<String, ObligationRule>();
        objHashAutomaticRules = new HashMap<String, ObligationRule>();
        objHashRulesAE = new HashMap<String, ObligationRule>  ();
        objHashAutomaticRulesAE = new HashMap<String, ObligationRule>();
        objHashTypes = new HashMap<String, ObligationType>();
        populateObligationTypes ();
        populateObligationRules ();
        populateObligationRulesAE ();
    }

    /**
     * (non-Javadoc).
     *
     * @param doc the doc
     * @return the obligation types
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationStorageRetrivalManager#getObligationTypes(org.jdom.Document)
     */
    public HashMap<String, ObligationType> getObligationTypes (final Document doc)
    {
        processObjRulesRootElements (doc.getRootElement ().getChildren ());
        return objHashTypes;
    }

    /**
     * {@inheritDoc}
     */
    public HashMap<String, ObligationType> getObligationTypes ()
    {
        return objHashTypes;
    }

    /**
     * (non-Javadoc).
     *
     * @param doc the doc
     * @return the obligation rules
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationStorageRetrivalManager#getObligationRules(org.jdom.Document)
     */
    public HashMap<String, ObligationRule> getObligationRules (final Document doc)
    {
        processObjRulesRootElements (doc.getRootElement ().getChildren ());
        return objHashRules;
    }

    /**
     * {@inheritDoc}
     */
    public HashMap<String, ObligationRule> getObligationRules ()
    {
        return objHashRules;
    }

    /**
     * Returns the ae obligation rules.
     * 
     * @param doc The rules document.
     * @return The processed obligation rules.
     */
    public HashMap<String, ObligationRule> getObligationRulesAE (final Document doc)
    {
        processObjRulesRootElements (doc.getRootElement ().getChildren ());
        return objHashRules;
    }

    /**
     * {@inheritDoc}
     */
    public HashMap<String, ObligationRule> getObligationRulesAE ()
    {
        return objHashRulesAE;
    }

    /**
     * {@inheritDoc}
     */
    public HashMap<String, ObligationRule> getObligationAutomaticRulesAE ()
    {
        return objHashAutomaticRulesAE;
    }

    /**
     * (non-Javadoc).
     *
     * @param doc the doc
     * @return the obligation automatic rules
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationStorageRetrivalManager#getObligationAutomaticRules(org.jdom.Document)
     */
    public HashMap<String, ObligationRule> getObligationAutomaticRules (final Document doc)
    {
        processObjRulesRootElements (doc.getRootElement ().getChildren ());
        return objHashAutomaticRules;
    }

    /**
     * {@inheritDoc}
     */
    public HashMap<String, ObligationRule> getObligationAutomaticRules ()
    {
        return objHashAutomaticRules;
    }

    /**
     * Populate obligation types.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void populateObligationTypes () throws BusinessException, SystemException
    {
        final IObligationRulesStorageManager stM = ObligationFactory.getObligationRulesStorageDBManager ();
        processObjTypesRootElements (stM.getObligationTypes ().getRootElement ().getChildren ());
    }

    /**
     * Process obj types root elements.
     *
     * @param elements the elements
     */
    private void processObjTypesRootElements (final List<Element> elements)
    {
        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("ObligationTypes"))
            {
                createObligationTypes (current.getChildren ());
            }
        }
    }

    /**
     * Creates the obligation types.
     *
     * @param elements the elements
     */
    private void createObligationTypes (final List<Element> elements)
    {
        final ObligationType objType = new ObligationType ();
        boolean multiUse = false;

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("ObligationType"))
            {
                objType.setObligationType (current.getText ());
            }
            else if (name.equals ("ObligationDescription"))
            {
                objType.setObligationDescription (current.getText ());
            }
            else if (name.equals ("Multiuse"))
            {
                // objType.setMultiUse(current.getText() == null ? false :
                // Boolean.valueOf(current.getText()).booleanValue());
                objType.setMultiUse (convertToBooelan (current.getText ()));
                multiUse = true;
            }

            if (validObligationType (objType, multiUse))
            {
                objHashTypes.put (objType.getObligationType (), objType);
            }
        }
    }

    /**
     * Convert to booelan.
     *
     * @param bool the bool
     * @return true, if successful
     */
    private boolean convertToBooelan (final String bool)
    {
        if (bool != null && bool.equals ("Y"))
        {
            return true;
        }
        return false;
    }

    /**
     * Valid obligation type.
     *
     * @param objType the obj type
     * @param multiUse the multi use
     * @return true, if successful
     */
    private boolean validObligationType (final ObligationType objType, final boolean multiUse)
    {
        return objType.getObligationType () != null && objType.getObligationDescription () != null && multiUse;
    }

    /**
     * Populate obligation rules AE.
     *
     * @throws SystemException the system exception
     */
    private void populateObligationRulesAE () throws SystemException
    {
        final IObligationRulesStorageManager stM = ObligationFactory.getObligationRulesStorageXMLManager ();
        addAEObligationRules (stM.getObligationRulesAE ().getRootElement ().getChildren ());
    }

    /**
     * Adds the AE obligation rules.
     *
     * @param elements the elements
     */
    private void addAEObligationRules (final List<Element> elements)
    {
        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("EventID"))
            {
                final ObligationRule objRuleAuto = (ObligationRule) objHashAutomaticRules.get (current.getText ());
                if (objRuleAuto != null)
                {
                    objHashAutomaticRulesAE.put (objRuleAuto.getEventId (), objRuleAuto);
                }

                final ObligationRule objRule = (ObligationRule) objHashRules.get (current.getText ());
                if (objRule != null)
                {
                    objHashRulesAE.put (objRule.getEventId (), objRule);
                }
            }
        }
    }

    /**
     * Populate obligation rules.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void populateObligationRules () throws BusinessException, SystemException
    {
        final IObligationRulesStorageManager stM = ObligationFactory.getObligationRulesStorageDBManager ();
        processObjRulesRootElements (stM.getObligationRules ().getRootElement ().getChildren ());
        // Hack as I could not get the database to retrive all the events using SQL in one go. I could if I used PL SQL!
        processObjRulesRootElements (stM.getObligationRulesEvents ().getRootElement ().getChildren ());
    }

    /**
     * Process obj rules root elements.
     *
     * @param elements the elements
     */
    private void processObjRulesRootElements (final List<Element> elements)
    {
        final String eventID;

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("ObligationRule"))
            {
                createObligationRules (current.getChildren (), null);
            }
        }
    }

    /**
     * Creates the obligation rules.
     *
     * @param elements the elements
     * @param eventId the event id
     */
    private void createObligationRules (final List<Element> elements, final StringBuffer eventId)
    {
        final StringBuffer eventID = new StringBuffer ();
        ;

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("EventID"))
            {
                eventID.append (current.getText ());
                createObligationRules (current.getChildren (), eventID);
            }
            else if (name.equals ("ObligationSeq"))
            {
                createObligationRule (current.getChildren (), eventID.toString ());
            }
        }
    }

    /**
     * Creates the obligation rule.
     *
     * @param elements the elements
     * @param eventID the event ID
     */
    private void createObligationRule (final List<Element> elements, final String eventID)
    {
        final ObligationRule objRule = new ObligationRule ();
        objRule.setEventId (eventID);
        boolean defDays = false;

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("Action"))
            {
                objRule.setAction (current.getText ());
            }
            else if (name.equals ("Mechanism"))
            {
                objRule.setMechanism (current.getText ());
            }
            else if (name.equals ("ObligationType"))
            {
                objRule.setObligationType (current.getText ());
            }
            else if (name.equals ("MaintenanceMode"))
            {
                objRule.setMaintenanceMode (current.getText ());
            }
            else if (name.equals ("DefaultDays"))
            {
                if (current.getText () == null || current.getText ().equals (""))
                {
                    objRule.setDefaultDays (0);
                }
                else
                {
                    objRule.setDefaultDays (Integer.parseInt (current.getText ()));
                }

                defDays = true;
            }

            if (validAutomaticObligationRule (objRule, defDays))
            {
                objHashAutomaticRules.put (objRule.getEventId (), objRule);
            }
            else if (validObligationRule (objRule, defDays))
            {
                objHashRules.put (objRule.getEventId (), objRule);
            }
        }
    }

    /**
     * Valid automatic obligation rule.
     *
     * @param objRule the obj rule
     * @param defDays the def days
     * @return true, if successful
     */
    private boolean validAutomaticObligationRule (final ObligationRule objRule, final boolean defDays)
    {
        return objRule.getAction () != null && objRule.getMechanism ().equals ("A") && defDays &&
                objRule.getMaintenanceMode () != null && objRule.getMechanism () != null &&
                objRule.getObligationType () != null;
    }

    /**
     * Valid obligation rule.
     *
     * @param objRule the obj rule
     * @param defDays the def days
     * @return true, if successful
     */
    private boolean validObligationRule (final ObligationRule objRule, final boolean defDays)
    {
        return objRule.getAction () != null && !objRule.getMechanism ().equals ("A") && defDays &&
                objRule.getMaintenanceMode () != null && objRule.getMechanism () != null &&
                objRule.getObligationType () != null;
    }

}
