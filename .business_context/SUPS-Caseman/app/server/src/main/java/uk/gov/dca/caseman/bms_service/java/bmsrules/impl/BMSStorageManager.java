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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRulesStorageManager;
import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSStorageRetrivalManager;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 09-Mar-2005
 *
 * Change History:
 * 15-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 * 
 * @author Amjad Khan
 */
public class BMSStorageManager implements IBMSStorageRetrivalManager
{
    
    /** The Constant get. */
    private static final String get = "get";
    
    /** The obj hash rules. */
    private HashMap<String, BMSRuleList> objHashRules;
    
    /** The obj hash rules non events. */
    private HashMap<String, BMSRuleNonEventList> objHashRulesNonEvents;
    
    /** The obj hash rules non events action. */
    private HashMap<String, BMSActionType> objHashRulesNonEventsAction;
    
    /** The obj hash types. */
    private HashMap<String, BMSType> objHashTypes;

    /**
     * Constructor.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public BMSStorageManager () throws BusinessException, SystemException
    {
        objHashRules = new HashMap<String, BMSRuleList>();
        objHashTypes = new HashMap<String, BMSType> ();
        objHashRulesNonEvents = new HashMap<String, BMSRuleNonEventList>();
        objHashRulesNonEventsAction = new HashMap<String, BMSActionType>();
        populateCCRefCodes ();
        populateBMSRules ();
        populateBmsActionTypes ();
        populateBMSRulesNonEvents ();
        populateBmsActionTypes ();
    }

    /**
     * (non-Javadoc).
     *
     * @param doc the doc
     * @return the CCREF codes
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSStorageRetrivalManager#getCCREFCodes(org.jdom.Document)
     */
    public Map<String, BMSType> getCCREFCodes (final Document doc)
    {
        processObjRulesRootElements (doc.getRootElement ().getChildren ());
        return objHashTypes;
    }

    /**
     * {@inheritDoc}
     */
    public Map<String, BMSType> getCCREFCodes ()
    {
        return objHashTypes;
    }

    /**
     * (non-Javadoc).
     *
     * @param doc the doc
     * @return the BMS rules
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSStorageRetrivalManager#getBMSRules(org.jdom.Document)
     */
    public Map<String, BMSRuleList> getBMSRules (final Document doc)
    {
        processObjRulesRootElements (doc.getRootElement ().getChildren ());
        return objHashRules;
    }

    /**
     * {@inheritDoc}
     */
    public Map<String, BMSRuleList> getBMSRules ()
    {
        return objHashRules;
    }

    /**
     * (non-Javadoc).
     *
     * @param doc the doc
     * @return the BMS rules non events
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSStorageRetrivalManager#getBMSRulesNonEvents(org.jdom.Document)
     */
    public Map<String, BMSRuleNonEventList> getBMSRulesNonEvents (final Document doc) throws SystemException
    {
        processObjRulesNonEventsRootElements (doc.getRootElement ().getChildren ());
        return objHashRulesNonEvents;
    }

    /**
     * {@inheritDoc}
     */
    public Map<String, BMSRuleNonEventList> getBMSRulesNonEvents ()
    {
        return objHashRulesNonEvents;
    }

    /**
     * (non-Javadoc).
     *
     * @param doc the doc
     * @return the BMS rules non events action
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSStorageRetrivalManager#getBMSRulesNonEventsAction(org.jdom.Document)
     */
    public Map<String, BMSActionType> getBMSRulesNonEventsAction (final Document doc)
    {
        processActionTypesRootElements (doc.getRootElement ().getChildren ());
        return objHashRulesNonEventsAction;
    }

    /**
     * {@inheritDoc}
     */
    public Map<String, BMSActionType> getBMSRulesNonEventsAction ()
    {
        return objHashRulesNonEventsAction;
    }

    /**
     * Populate CC ref codes.
     *
     * @throws SystemException the system exception
     */
    private void populateCCRefCodes () throws SystemException
    {
        final IBMSRulesStorageManager stM = BMSFactory.getBMSRulesStorageXMLManager ();
        processObjTypesRootElements (stM.getCCREFCodes ().getRootElement ().getChildren ());
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

            if (name.equals ("CaseType"))
            {
                createBMSTypes (current.getChildren ());
            }
        }
    }

    /**
     * Creates the BMS types.
     *
     * @param elements the elements
     */
    private void createBMSTypes (final List<Element> elements)
    {
        final BMSType objType = new BMSType ();

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("Type"))
            {
                objType.setCaseType (current.getText ());
                // createBMSRules(current.getChildren(), eventID);
            }
            else if (name.equals ("CourtType"))
            {
                objType.setCourtType (current.getText ());
            }
        }

        if (validCCREFCodes (objType))
        {
            objHashTypes.put (objType.getCaseType (), objType);
        }
    }

    /**
     * Valid CCREF codes.
     *
     * @param objType the obj type
     * @return true, if successful
     */
    private boolean validCCREFCodes (final BMSType objType)
    {
        return objType.getCaseType () != null;
    }

    /**
     * Populate bms action types.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void populateBmsActionTypes () throws BusinessException, SystemException
    {
        final IBMSRulesStorageManager stM = BMSFactory.getBMSRulesStorageXMLManager ();
        processActionTypesRootElements (stM.getBMSRulesNonEventsAction ().getRootElement ().getChildren ());
    }

    /**
     * Process action types root elements.
     *
     * @param elements the elements
     */
    private void processActionTypesRootElements (final List<Element> elements)
    {

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("ActionTypes"))
            {
                createBMSActionTypes (current.getChildren ());
            }
        }
    }

    /**
     * Creates the BMS action types.
     *
     * @param elements the elements
     */
    private void createBMSActionTypes (final List<Element> elements)
    {
        final BMSActionType objType = new BMSActionType ();

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("ActionType"))
            {
                objType.setActionType (current.getText ());
                // createBMSRules(current.getChildren(), eventID);
            }
            else if (name.equals ("BmsType"))
            {
                objType.setBmsType (current.getText ());
            }
        }

        if (validBMSActionCodes (objType))
        {
            objHashRulesNonEventsAction.put (objType.getActionType (), objType);
        }
    }

    /**
     * Valid BMS action codes.
     *
     * @param objType the obj type
     * @return true, if successful
     */
    private boolean validBMSActionCodes (final BMSActionType objType)
    {
        return objType.getActionType () != null;
    }

    /**
     * Populate BMS rules.
     *
     * @throws SystemException the system exception
     */
    private void populateBMSRules () throws SystemException
    {
        final IBMSRulesStorageManager stM = BMSFactory.getBMSRulesStorageXMLManager ();
        processObjRulesRootElements (stM.getBMSRules ().getRootElement ().getChildren ());

    }

    /**
     * Populate BMS rules non events.
     *
     * @throws SystemException the system exception
     */
    private void populateBMSRulesNonEvents () throws SystemException
    {
        final IBMSRulesStorageManager stM = BMSFactory.getBMSRulesStorageXMLManager ();
        processObjRulesNonEventsRootElements (stM.getBMSRulesNonEvents ().getRootElement ().getChildren ());

    }

    /**
     * Process obj rules root elements.
     *
     * @param elements the elements
     */
    private void processObjRulesRootElements (final List<Element> elements)
    {
        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("BMSRule"))
            {
                createBMSRules (current.getChildren (), null);
            }
        }
    }

    /**
     * Creates the BMS rules.
     *
     * @param elements the elements
     * @param eventId the event id
     */
    private void createBMSRules (final List<Element> elements, final StringBuffer eventId)
    {
        final StringBuffer eventID = new StringBuffer ();
        final BMSRuleList bmsRL = new BMSRuleList ();

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();
            if (name.equals ("EventID"))
            {
                eventID.append (current.getText ());
                // createBMSRules(current.getChildren(), eventID);
            }
            else if (name.equals ("BmsSeq"))
            {
                final BMSRule objRule = createBMSRule (current.getChildren (), eventID.toString ());
                if (validBMSRule (objRule))
                {
                    bmsRL.add (objRule);
                }
            }
        }
        // If Not Empty add to hashMap
        if ( !bmsRL.isEmpty ())
        {
            objHashRules.put (eventID.toString (), bmsRL);
        }
    }

    /**
     * Creates the BMS rule.
     *
     * @param elements the elements
     * @param eventID the event ID
     * @return the BMS rule
     */
    private BMSRule createBMSRule (final List<Element> elements, final String eventID)
    {
        final BMSRule objRule = new BMSRule ();
        objRule.setEventId (Integer.parseInt (eventID));

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("CaseType"))
            {
                objRule.setCaseType (current.getText ());
            }
            else if (name.equals ("ApplicantType"))
            {
                objRule.setApplicantType (current.getText ());
            }
            else if (name.equals ("HearingType"))
            {
                objRule.setHearingType (current.getText ());
            }
            else if (name.equals ("HearingFlag"))
            {
                objRule.setHearingFlag (current.getText ());
            }
            else if (name.equals ("Issue"))
            {
                objRule.setIssue (current.getText ());
            }
            else if (name.equals ("ListingType"))
            {
                objRule.setListingType (current.getText ());
            }
            else if (name.equals ("EventType"))
            {
                objRule.setEventType (current.getText ());
            }
            else if (name.equals ("ApplicantResponse"))
            {
                objRule.setApplicantResponse (current.getText ());
            }
            else if (name.equals ("AEEventId"))
            {
                objRule.setAEEventID (determineIntVal (current.getText ()));
            }
            else if (name.equals ("CourtType"))
            {
                objRule.setCourtType (current.getText ());
            }
            else if (name.equals ("CodedParty"))
            {
                objRule.setCodedParty (current.getText ());
            }
            else if (name.equals ("EventTypeFlag"))
            {
                objRule.setEventTypeFlag (current.getText ());
            }
            else if (name.equals ("CaseTypeCategory"))
            {
                objRule.setCaseTypeCategory (current.getText ());
            }
            else if (name.equals ("Task"))
            {
                objRule.setTask (current.getText ());
            }
            else if (name.equals ("BmsType"))
            {
                objRule.setBMSType (current.getText ());
            }
        }
        return objRule;
    }

    /**
     * Valid BMS rule.
     *
     * @param objRule the obj rule
     * @return true, if successful
     */
    private boolean validBMSRule (final BMSRule objRule)
    {
        return objRule != null && objRule.getEventId () != 0 && objRule.getCaseType () != null;
    }

    /**
     * Process obj rules non events root elements.
     *
     * @param elements the elements
     * @throws SystemException the system exception
     */
    private void processObjRulesNonEventsRootElements (final List<Element> elements) throws SystemException
    {

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("BMSRule"))
            {
                createBMSRulesNonEvents (current.getChildren (), null);
            }
        }
    }

    /**
     * Creates the BMS rules non events.
     *
     * @param elements the elements
     * @param eventId the event id
     * @throws SystemException the system exception
     */
    private void createBMSRulesNonEvents (final List<Element> elements, final StringBuffer eventId) throws SystemException
    {
        String section = "";
        final BMSRuleNonEventList bmsRL = new BMSRuleNonEventList ();

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();
            if (name.equals ("BmsSection"))
            {

                for (Iterator<Element> j = current.getChildren ().iterator (); j.hasNext ();)
                {
                    final Element currentSection = (Element) j.next ();
                    final String nameSection = currentSection.getName ();
                    if (nameSection.equals ("Payment") || nameSection.equals ("Payout") ||
                            nameSection.equals ("WarrantReturn") || nameSection.equals ("Warrant") ||
                            nameSection.equals ("DividendDeclaration"))
                    {
                        final BMSRuleNonEvent bmsRLNE = new BMSRuleNonEvent ();
                        bmsRLNE.setSection (nameSection);
                        processBMSRulesNonEventsParamSections (currentSection.getChildren (), bmsRLNE);

                        section = bmsRLNE.getSection ().toUpperCase ();
                        if (validBMSRuleNonEvent (bmsRLNE))
                        {
                            bmsRL.add (bmsRLNE);
                        }
                    }
                }
            }
        }
        // If Not Empty add to hashMap
        if ( !bmsRL.isEmpty ())
        {
            objHashRulesNonEvents.put (section, bmsRL);
        }
    }

    /**
     * Process BMS rules non events param sections.
     *
     * @param elements the elements
     * @param bmsRL the bms RL
     * @return the BMS rule non event
     * @throws SystemException the system exception
     */
    private BMSRuleNonEvent processBMSRulesNonEventsParamSections (final List<Element> elements, final BMSRuleNonEvent bmsRL)
        throws SystemException
    {
        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();
            if (name.equals ("MatchData") || name.equals ("NonMatchingData") || name.equals ("Required"))
            {

                createBMSRuleNonEvent (current.getChildren (), bmsRL, name);
            }
        }
        return bmsRL;
    }

    /**
     * Creates the BMS rule non event.
     *
     * @param elements the elements
     * @param bmsRNE the bms RNE
     * @param type the type
     * @return the BMS rule non event
     * @throws SystemException the system exception
     */
    private BMSRuleNonEvent createBMSRuleNonEvent (final List<Element> elements, final BMSRuleNonEvent bmsRNE, final String type)
        throws SystemException
    {
        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("PaymentType"))
            {
                bmsRNE.setPaymentType (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("PayoutType"))
            {
                bmsRNE.setPayoutType (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("ReturnType"))
            {
                bmsRNE.setReturnType (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("ReturnCode"))
            {
                bmsRNE.setReturnCode (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("WarrantType"))
            {
                bmsRNE.setWarrantType (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("CaseType"))
            {
                bmsRNE.setCaseType (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("ActionId"))
            {
                bmsRNE.setActionId (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("Section"))
            {
                bmsRNE.setSection (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("CountIncrement"))
            {
                bmsRNE.setCountIncrement (determineIntVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("ManuallyCreatedReturn"))
            {
                bmsRNE.setManuallyCreatedReturn (determineBoolean (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("WarrantId"))
            {
                bmsRNE.setWarrantId (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("TypeOfWarrant"))
            {
                bmsRNE.setTypeOfWarrant (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("ReceiptDateRequired"))
            {
                bmsRNE.setReceiptDateRequired (determineDateVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("ProcessingDateRequired"))
            {
                bmsRNE.setProcessingDateRequired (determineDateVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("Task"))
            {
                bmsRNE.setTask (current.getText ());
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("BmsType"))
            {
                bmsRNE.setBmsType (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
            else if (name.equals ("CourtCode"))
            {
                bmsRNE.setCourtCode (determineStringVal (current.getText ()));
                determineAddToList (name, type, bmsRNE);
            }
        }
        setBmsTaskNonEvents (bmsRNE); // New Addition to retrive task from database instead of xml
        return bmsRNE;
    }

    /**
     * Sets the bms task non events.
     *
     * @param bmsRNE the new bms task non events
     */
    private void setBmsTaskNonEvents (final BMSRuleNonEvent bmsRNE)
    {
        if (objHashRulesNonEventsAction.get (bmsRNE.getActionId ()) != null)
        {
            bmsRNE.setTask (((BMSActionType) objHashRulesNonEventsAction.get (bmsRNE.getActionId ())).getBmsType ());
        }
    }

    /**
     * Determine add to list.
     *
     * @param paramName the param name
     * @param type the type
     * @param bmsRNE the bms RNE
     */
    private void determineAddToList (final String paramName, final String type, final BMSRuleNonEvent bmsRNE)
    {
        final StringBuffer strBuf = new StringBuffer (get + paramName);
        if (type.equals ("MatchData"))
        {
            bmsRNE.addMethodToCompare (strBuf.toString ());
        }
        else if (type.equals ("Required"))
        {
            bmsRNE.addRequiredParamToList (strBuf.toString ());
        }
    }

    /**
     * Valid BMS rule non event.
     *
     * @param objRule the obj rule
     * @return true, if successful
     */
    private boolean validBMSRuleNonEvent (final BMSRuleNonEvent objRule)
    {
        return objRule != null && !isEmpty (objRule.getSection ()) && !isEmpty (objRule.getBmsType ()) &&
                !isEmpty (objRule.getTask ());
    }

    /**
     * Determine int val.
     *
     * @param s the s
     * @return the int
     */
    private int determineIntVal (final String s)
    {
        return s == null || "".equals (s) || "Y".equalsIgnoreCase (s) ? 0 : Integer.parseInt (s);
    }

    /**
     * Determine string val.
     *
     * @param s the s
     * @return the string
     */
    private String determineStringVal (final String s)
    {
        return s == null || "".equals (s) || "Y".equalsIgnoreCase (s) ? "" : s.toUpperCase ();
    }

    /**
     * Determine date val.
     *
     * @param s the s
     * @return the date
     * @throws SystemException the system exception
     */
    private Date determineDateVal (final String s) throws SystemException
    {
        return s == null || "".equals (s) || "Y".equalsIgnoreCase (s) ? null : formatDate (s);
    }

    /**
     * Checks if is empty.
     *
     * @param s the s
     * @return true, if is empty
     */
    private boolean isEmpty (final String s)
    {
        return s == null || "".equals (s);
    }

    /**
     * Determine boolean.
     *
     * @param s the s
     * @return true, if successful
     */
    private boolean determineBoolean (final String s)
    {
        return s == null || "".equals (s) || !"Y".equalsIgnoreCase (s) ? false : true;
    }

    /**
     * Format date.
     *
     * @param pDate the date
     * @return the date
     * @throws SystemException the system exception
     */
    private Date formatDate (final String pDate) throws SystemException
    {
        SimpleDateFormat dateFormat = null;
        dateFormat = new SimpleDateFormat ("yyyy-MM-dd");
        dateFormat.applyPattern ("yyyy-MM-dd");
        Date parseDate = null;
        try
        {
            parseDate = dateFormat.parse (pDate);
        }
        catch (final ParseException e)
        {
            throw new SystemException (e);
        }
        return parseDate;
    }
}
