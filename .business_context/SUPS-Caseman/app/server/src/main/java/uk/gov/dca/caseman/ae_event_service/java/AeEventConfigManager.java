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
package uk.gov.dca.caseman.ae_event_service.java;

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
 * Class: AeEventConfigManager.java
 * 
 * @author Chris Hutt (EDS)
 *         Created: 21-June-2005
 *         Description:
 *         This class reads the Ae Event configuration XML Document, caches it in memory,
 *         and then returns a Data Object to clients that request the configuration for
 *         a particular Ae Event.
 * 
 *         Change History:
 *         15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 *         19-May-2006 Phil Haferer (EDS): TD 3074: "ICaseEventConfigDO.java (701c) - why?"
 *         Removal of "set" methods from the interface.
 *         25-may-2006 Chris Hutt
 *         TD defect UCT273: PreConditionAeHearingCheck added
 *         20july2006 chris hutt
 *         defect 4030: PreConditionAEOutstandingBalanceCheck mispelling
 *         09 Nov 2006 Chris Hutt
 *         buildz etc issue 173: HearingCreated added
 *         20 Dec 2006 chris hutt
 *         temp_caseman defect 356: EmployerNamedPersonRequired added
 */
public class AeEventConfigManager
{

    /** The m ae event config manager instance. */
    private static AeEventConfigManager mAeEventConfigManagerInstance = null;
    
    /** The Constant AE_EVENT_CONFIG_DOCUMENT. */
    private static final String AE_EVENT_CONFIG_DOCUMENT = "uk/gov/dca/caseman/ae_event_service/xml/AEEventConfig.xml";
    
    /** The m ae event config DO list. */
    private HashMap<Integer, IAeEventConfigDO> mAeEventConfigDOList = null;

    /**
     * Instantiates a new ae event config manager.
     *
     * @throws SystemException the system exception
     */
    protected AeEventConfigManager () throws SystemException
    {
        mInitialise ();
    } // AeEventConfigManager()

    /**
     * Gets the single instance of AeEventConfigManager.
     *
     * @return single instance of AeEventConfigManager
     * @throws SystemException the system exception
     */
    public static AeEventConfigManager getInstance () throws SystemException
    {
        if (null == mAeEventConfigManagerInstance)
        {
            mAeEventConfigManagerInstance = new AeEventConfigManager ();
        }

        return mAeEventConfigManagerInstance;
    } // getInstance()

    /**
     * Get ae event config data object.
     *
     * @param pStandardEventId The standard event id.
     * @return Config DO
     * @throws SystemException the system exception
     */
    public IAeEventConfigDO getAeEventConfigDO (final int pStandardEventId) throws SystemException
    {
        final IAeEventConfigDO AeEventConfigDO =
                (IAeEventConfigDO) mAeEventConfigDOList.get (new Integer (pStandardEventId));
        if (null == AeEventConfigDO)
        {
            throw new SystemException (
                    "AeEventConfig: StandardEventId = [" + Integer.toString (pStandardEventId) + "] not found!");
        }

        return AeEventConfigDO;
    } // getAeEventConfigDO()

    /**
     * (non-Javadoc)
     * Initialises and then processes AE config list.
     *
     * @throws SystemException the system exception
     */
    private void mInitialise () throws SystemException
    {
        SAXBuilder builder = null;
        Document document = null;

        try
        {
            mAeEventConfigDOList = new HashMap<Integer, IAeEventConfigDO>();

            builder = new SAXBuilder ();
            document = builder.build (Util.getInputSource (AE_EVENT_CONFIG_DOCUMENT, this));
            mProcessAeEventConfigList (document.getRootElement ());
        }
        catch (final IOException e)
        {
            throw new SystemException (
                    "Exception occurred loading AE Event Configuration Data: " + AE_EVENT_CONFIG_DOCUMENT, e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (
                    "Exception occurred loading AE Event Configuration Data: " + AE_EVENT_CONFIG_DOCUMENT, e);
        }

    } // mInitialise()

    /**
     * (non-Javadoc)
     * Iterates through the AE event config list, processing each item.
     *
     * @param pAeEventConfigListElement the ae event config list element
     * @throws SystemException the system exception
     */
    private void mProcessAeEventConfigList (final Element pAeEventConfigListElement) throws SystemException
    {
        List<Element> elementList = null;
        Element AeEventConfigElement = null;
        String elementName = null;

        elementList = pAeEventConfigListElement.getChildren ();

        for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
        {
            AeEventConfigElement = (Element) i.next ();
            elementName = AeEventConfigElement.getName ();

            if (elementName.equals ("AEEventConfig"))
            {
                processAeEventConfigDO (AeEventConfigElement);
            }
        }

    } // mProcessAeEventConfigElement()

    /**
     * (non-Javadoc)
     * Compares a String to 'true' and returns boolean true if it's equal.
     *
     * @param pValue the value
     * @return true, if successful
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
    } // mGetBoolean()

    /**
     * (non-Javadoc)
     * Sets specified AE event config element to true or false.
     *
     * @param pAeEventConfigElement the ae event config element
     * @throws SystemException the system exception
     */
    private void processAeEventConfigDO (final Element pAeEventConfigElement) throws SystemException
    {
        IAeEventConfigDO aeEventConfigDO = null;
        List<Element> elementList = null;
        Element currentElement = null;
        String elementName = null;
        String elementText = null;

        try
        {
            aeEventConfigDO = new AeEventConfigDO ();
            elementList = pAeEventConfigElement.getChildren ();

            for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
            {
                currentElement = (Element) i.next ();
                elementName = currentElement.getName ();
                elementText = currentElement.getText ().trim ();

                if (elementName.equals ("ServiceType"))
                {
                    aeEventConfigDO.setServiceType (elementText);
                }
                else if (elementName.equals ("PreConditionEventMustExist"))
                {
                    aeEventConfigDO.setPreConditionEventMustExist (mGetBoolean (elementText));
                }
                else if (elementName.equals ("IssueStage"))
                {
                    aeEventConfigDO.setIssueStage (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PERDetailsRequired"))
                {
                    aeEventConfigDO.setPERDetailsRequired (mGetBoolean (elementText));
                }
                else if (elementName.equals ("EmployerDetailsRequired"))
                {
                    aeEventConfigDO.setEmployerDetailsRequired (mGetBoolean (elementText));
                }
                else if (elementName.equals ("EmployerNamedPersonRequired"))
                {
                    aeEventConfigDO.setEmployerNamedPersonRequired (mGetBoolean (elementText));
                }
                else if (elementName.equals ("WordProcessingCall"))
                {
                    aeEventConfigDO.setWordProcessingCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("OracleReportCall"))
                {
                    aeEventConfigDO.setOracleReportCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ObligationsCall"))
                {
                    aeEventConfigDO.setObligationsCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ObligationsPrompt"))
                {
                    aeEventConfigDO.setObligationsPrompt (mGetBoolean (elementText));
                }
                else if (elementName.equals ("DetailsLOVDomain"))
                {
                    aeEventConfigDO.setDetailsLOVDomain (elementText);
                }
                else if (elementName.equals ("DetailsLOVMandatory"))
                {
                    aeEventConfigDO.setDetailsLOVMandatory (mGetBoolean (elementText));
                }
                else if (elementName.equals ("DeleteReportMapRowsOnError"))
                {
                    aeEventConfigDO.setDeleteReportMapOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionPreviousOrderCheck"))
                {
                    aeEventConfigDO.setPreConditionPreviousOrderCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionFutureAeHearingCheck"))
                {
                    aeEventConfigDO.setPreConditionFutureAeHearingCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionPastAeHearingCheck"))
                {
                    aeEventConfigDO.setPreConditionPastAeHearingCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CreateWarrantType"))
                {
                    aeEventConfigDO.setCreateWarrantType (elementText);
                }
                else if (elementName.equals ("ValidAETypes"))
                {
                    aeEventConfigDO.setValidAETypes (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionAEOutstandingBalanceCheck"))
                {
                    aeEventConfigDO.setPreConditionAEOutstandingBalanceCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("MarkForCAPSTransfer"))
                {
                    aeEventConfigDO.setMarkForCAPSTransfer (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CreateHearingType"))
                {
                    aeEventConfigDO.setCreateHearingType (elementText);
                }
                else if (elementName.equals ("PreConditionLaterResponseEventCheck"))
                {
                    aeEventConfigDO.setPreConditionLaterResponseEventCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionServiceDateCheck"))
                {
                    aeEventConfigDO.setPreConditionServiceDateCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("StandardEventId"))
                {
                    aeEventConfigDO.setStandardEventId (Integer.parseInt (elementText));
                }
                else if (elementName.equals ("ObligationsCallOnError"))
                {
                    aeEventConfigDO.setObligationsCallOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ObligationsPromptOnError"))
                {
                    aeEventConfigDO.setObligationsPromptOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionAeHearingCheck"))
                {
                    aeEventConfigDO.setPreConditionAeHearingCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("HearingCreated"))
                {
                    aeEventConfigDO.setHearingCreated (mGetBoolean (elementText));
                }

            }

            mAeEventConfigDOList.put (new Integer (aeEventConfigDO.getStandardEventId ()), aeEventConfigDO);
        }
        catch (final Exception e)
        {
            throw new SystemException (
                    "processAeEventConfigDO(): Name = [" + elementName + "], Content = [" + elementText + "]", e);
        }

    } // processAeEventConfigDO()

} // class AeEventConfigManager