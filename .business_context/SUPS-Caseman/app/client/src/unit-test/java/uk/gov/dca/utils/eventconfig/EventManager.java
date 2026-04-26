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
package uk.gov.dca.utils.eventconfig;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * Event Manager class to manage the configuration of case events.
 */
public class EventManager
{
    
    /** The construction system exception. */
    private SystemException constructionSystemException;
    
    /** The m event config manager instance. */
    private static EventManager mEventConfigManagerInstance = new EventManager ();

    /** The Constant STANDARD_EVENT_CONFIG_DOCUMENT. */
    private static final String STANDARD_EVENT_CONFIG_DOCUMENT = "uk/gov/dca/utils/eventconfig/eventconfig.xml";
    
    /** The m event config list. */
    private HashMap<String, EventConfig> mEventConfigList = null;

    /**
     * Constructor.
     */
    public EventManager ()
    {
        try
        {
            mInitialise ();
        }
        catch (final SystemException e)
        {
            constructionSystemException = e;
        }
    } // CaseEventConfigManager()

    /**
     * Throws any error raised in initialisation.
     *
     * @throws SystemException any error raised in initialisation.
     */
    private void throwAnyConstructionException () throws SystemException
    {
        if (constructionSystemException != null)
        {
            throw constructionSystemException;
        }
    }

    /**
     * Gets the single instance of EventManager.
     *
     * @return single instance of EventManager
     * @throws SystemException the system exception
     */
    public static EventManager getInstance () throws SystemException
    {
        mEventConfigManagerInstance.throwAnyConstructionException ();
        return mEventConfigManagerInstance;
    }

    /**
     * Returns case event config data object.
     *
     * @param pStandardEventId String representing the event id to return
     * @return The config data object
     * @throws SystemException Thrown if event id not found in config file
     */
    public EventConfig getEventConfig (final String pStandardEventId) throws SystemException
    {
        final EventConfig eventConfig = (EventConfig) mEventConfigList.get (pStandardEventId);
        if (null == eventConfig)
        {
            throw new SystemException ("EventConfig: StandardEventId = [" + pStandardEventId + "] not found!");
        }

        return eventConfig;
    }

    /**
     * Initialise. Load case event config data.
     *
     * @throws SystemException Thrown if problems loading the configuration data
     */
    private void mInitialise () throws SystemException
    {
        final SAXBuilder builder;
        final Document document;

        try
        {
            mEventConfigList = new HashMap<String, EventConfig>();

            builder = new SAXBuilder ();
            document = builder.build (Util.getInputSource (STANDARD_EVENT_CONFIG_DOCUMENT, this));
            mProcessEventConfigList (document.getRootElement ());
        }
        catch (final IOException e)
        {
            throw new SystemException (
                    "Exception occurred loading Event Configuration Data. " + STANDARD_EVENT_CONFIG_DOCUMENT, e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (
                    "Exception occurred loading Event Configuration Data. " + STANDARD_EVENT_CONFIG_DOCUMENT, e);
        }
    }

    /**
     * Iterates through config list processing each item.
     *
     * @param pEventConfigListElement config list element
     * @throws SystemException Thrown if problems processing the events
     */
    private void mProcessEventConfigList (final Element pEventConfigListElement) throws SystemException
    {
        final List<Element> elementList;
        Element eventConfigElement;
        String elementName;

        elementList = pEventConfigListElement.getChildren ();

        for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
        {
            eventConfigElement = (Element) i.next ();
            elementName = eventConfigElement.getName ();

            if (elementName.equals ("StandardEventConfig"))
            {
                processEventConfig (eventConfigElement);
            }
        }
    }

    /**
     * Converts string to boolean. 'true' = true, otherwise false.
     *
     * @param pValue Returns a string literal 'true' or 'false' into a boolean
     * @return boolean representation of the string literal
     */
    private boolean mGetBoolean (final String pValue)
    {
        boolean bResult = false;

        if (null != pValue)
        {
            if (pValue.equalsIgnoreCase ("true"))
            {
                bResult = true;
            }
        }
        return bResult;
    }

    /**
     * Set data in case event config DO based upon the case event config element passed in.
     * 
     * @param pEventConfigElement Case Event config element
     * @throws SystemException Thrown if problems processing the case event config element
     */
    private void processEventConfig (final Element pEventConfigElement) throws SystemException
    {
        final EventConfig eventConfig;
        final List<Element> elementList;
        Element currentElement;
        String elementName = null;
        String elementText = null;

        try
        {
            eventConfig = new EventConfig ();
            elementList = pEventConfigElement.getChildren ();

            for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
            {
                currentElement = (Element) i.next ();
                elementName = currentElement.getName ();
                elementText = currentElement.getText ().trim ();

                if (elementName.equals ("StandardEventId"))
                {
                    eventConfig.setEventId (elementText);
                }
                else if (elementName.equals ("UsesSubject"))
                {
                    eventConfig.setHasSubject (mGetBoolean (elementText));
                }
                else if (elementName.equals ("UsesInstigator"))
                {
                    eventConfig.setHasInstigator (mGetBoolean (elementText));
                }
                else if (elementName.equals ("IssueStageEnabled"))
                {
                    eventConfig.setHasIssueStage (mGetBoolean (elementText));
                }
                else if (elementName.equals ("DetailsMandatory"))
                {
                    eventConfig.setDetailsMandatory (mGetBoolean (elementText));
                }
                else if (elementName.equals ("UsesCreditor"))
                {
                    eventConfig.setHasCreditor (mGetBoolean (elementText));
                }
                else if (elementName.equals ("UsesNoticeCheckbox"))
                {
                    eventConfig.setHasNotice (mGetBoolean (elementText));
                }
                else if (elementName.equals ("UsesAppointmentFields"))
                {
                    eventConfig.setHasAppointment (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ProduceOutputCheckboxEnabled"))
                {
                    eventConfig.setProduceOutputEnabled (mGetBoolean (elementText));
                }
                else if (elementName.equals ("LOVOnSave"))
                {
                    eventConfig.setLovOnSave (mGetBoolean (elementText));
                }
                else if (elementName.equals ("NavigationWFT"))
                {
                    eventConfig.setNavWFT (mGetBoolean (elementText));
                }
                else if (elementName.equals("NavigationHearing"))
                {
                    eventConfig.setNavHearings(mGetBoolean (elementText));
                }
                else if (elementName.equals ("Obligations"))
                {
                    eventConfig.setObligationsOption (elementText);
                }
                else if (elementName.equals ("ProduceOutput"))
                {
                    eventConfig.setOutputProduced (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ProduceOROutput"))
                {
                    eventConfig.setOROutputProduced (mGetBoolean (elementText));
                }
                else if (elementName.equals ("VariableDataScreen"))
                {
                    eventConfig.setVariableDataScreen (mGetBoolean (elementText));
                }
                else if (elementName.equals ("VariableDataScreenTitle"))
                {
                    eventConfig.setVariableDataScreenTitle (elementText);
                }
                else if (elementName.equals ("FCKEditor"))
                {
                    eventConfig.setFckEditor (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCTransferOnCreate"))
                {
                    eventConfig.setCCBCTransfer (mGetBoolean (elementText));
                }
                else if (elementName.equals ("DetailsOfClaimPopup"))
                {
                    eventConfig.setDetailsOfClaim (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CCBCNoFCKEditor"))
                {
                    eventConfig.setCCBCNoFckEditor (mGetBoolean (elementText));
                }

            }
            mEventConfigList.put (eventConfig.getEventId (), eventConfig);
        }
        catch (final Exception e)
        {
            throw new SystemException (
                    "processEventConfig(): Name = [" + elementName + "], Content = [" + elementText + "]", e);
        }
    }
}