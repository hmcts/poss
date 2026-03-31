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
package uk.gov.dca.caseman.co_event_service.java;

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
 * Class: CoEventConfigManager.java
 * 
 * @author Chris Hutt (EDS)
 *         Created: 12 July 2005
 *         Description:
 *         This class reads the Co Event configuration XML Document, caches it in memory,
 *         and then returns a Data Object to clients that request the configuration for
 *         a particular Co Event.
 * 
 *         Change History:
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 *         19-May-2006 Phil Haferer (EDS): TD 3074: "ICaseEventConfigDO.java (701c) - why?"
 *         Removal of "set" methods from the interface.
 *         4 jan 2006 Chris Hutt
 *         defect temp_caseman 392: PreConditionEventMustExistDependsOnCoType added
 */
public class CoEventConfigManager
{

    /** The construction system exception. */
    private SystemException constructionSystemException;
    
    /** The m co event config manager instance. */
    private static CoEventConfigManager mCoEventConfigManagerInstance = new CoEventConfigManager ();

    /** The Constant CO_EVENT_CONFIG_DOCUMENT. */
    private static final String CO_EVENT_CONFIG_DOCUMENT = "uk/gov/dca/caseman/co_event_service/xml/COEventConfig.xml";
    
    /** The m co event config DO list. */
    private HashMap<Integer, CoEventConfigDO> mCoEventConfigDOList = null;

    /**
     * Constructor.
     * PJR
     */
    protected CoEventConfigManager ()
    {
        try
        {
            mInitialise ();
        }
        catch (final SystemException e)
        {
            constructionSystemException = e;
        }
    } // CoEventConfigManager()

    /**
     * (non-Javadoc)
     * Throws construction exception.
     *
     * @throws SystemException the system exception
     */
    private void throwAnyConstructionException () throws SystemException
    {
        if (constructionSystemException != null)
        {
            throw constructionSystemException;
        }
    } // throwAnyConstructionException()

    /**
     * Gets the single instance of CoEventConfigManager.
     *
     * @return single instance of CoEventConfigManager
     * @throws SystemException the system exception
     */
    public static CoEventConfigManager getInstance () throws SystemException
    {
        mCoEventConfigManagerInstance.throwAnyConstructionException ();
        return mCoEventConfigManagerInstance;
    } // getInstance()

    /**
     * Returns a co event config data object.
     *
     * @param pStandardEventId The standard event id.
     * @return The co event config data object.
     * @throws SystemException the system exception
     */
    public ICoEventConfigDO getCoEventConfigDO (final int pStandardEventId) throws SystemException
    {
        final ICoEventConfigDO CoEventConfigDO =
                (ICoEventConfigDO) mCoEventConfigDOList.get (new Integer (pStandardEventId));
        if (null == CoEventConfigDO)
        {
            throw new SystemException (
                    "CoEventConfig: StandardEventId = [" + Integer.toString (pStandardEventId) + "] not found!");
        }

        return CoEventConfigDO;
    } // getCoEventConfigDO()

    /**
     * (non-Javadoc)
     * Loads case event config data.
     *
     * @throws SystemException the system exception
     */
    private void mInitialise () throws SystemException
    {
        SAXBuilder builder = null;
        Document document = null;

        try
        {
            mCoEventConfigDOList = new HashMap<Integer, CoEventConfigDO>();

            builder = new SAXBuilder ();
            document = builder.build (Util.getInputSource (CO_EVENT_CONFIG_DOCUMENT, this));
            mProcessCoEventConfigList (document.getRootElement ());
        }
        catch (final IOException e)
        {
            throw new SystemException (
                    "Exception occurred loading Case Event Configuration Data. " + CO_EVENT_CONFIG_DOCUMENT, e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (
                    "Exception occurred loading Case Event Configuration Data. " + CO_EVENT_CONFIG_DOCUMENT, e);
        }

    } // mInitialise()

    /**
     * (non-Javadoc)
     * Processes any COEventConfig nodes.
     *
     * @param pCoEventConfigListElement the co event config list element
     * @throws SystemException the system exception
     */
    private void mProcessCoEventConfigList (final Element pCoEventConfigListElement) throws SystemException
    {
        List<Element> elementList = null;
        Element CoEventConfigElement = null;
        String elementName = null;

        elementList = pCoEventConfigListElement.getChildren ();

        for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
        {
            CoEventConfigElement = (Element) i.next ();
            elementName = CoEventConfigElement.getName ();

            if (elementName.equals ("COEventConfig"))
            {
                processCoEventConfigDO (CoEventConfigElement);
            }
        }

    } // mProcessCoEventConfigElement()

    /**
     * M get boolean.
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
     * Iterates through config elements and configures data object appropriately.
     *
     * @param pCoEventConfigElement the co event config element
     * @throws SystemException the system exception
     */
    private void processCoEventConfigDO (final Element pCoEventConfigElement) throws SystemException
    {
        CoEventConfigDO coEventConfigDO = null;
        List<Element> elementList = null;
        Element currentElement = null;
        String elementName = null;
        String elementText = null;

        try
        {
            coEventConfigDO = new CoEventConfigDO ();
            elementList = pCoEventConfigElement.getChildren ();

            for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
            {
                currentElement = (Element) i.next ();
                elementName = currentElement.getName ();
                elementText = currentElement.getText ().trim ();

                if (elementName.equals ("BMSTaskRequired"))
                {
                    coEventConfigDO.setBMSTaskRequired (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ServiceType"))
                {
                    coEventConfigDO.setServiceType (elementText);
                }
                else if (elementName.equals ("PreConditionEventMustExist"))
                {
                    coEventConfigDO.setPreConditionEventMustExist (mGetBoolean (elementText));
                }
                else if (elementName.equals ("IssueStage"))
                {
                    coEventConfigDO.setIssueStage (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PERDetailsRequired"))
                {
                    coEventConfigDO.setPERDetailsRequired (mGetBoolean (elementText));
                }
                else if (elementName.equals ("EmployerDetailsRequired"))
                {
                    coEventConfigDO.setEmployerDetailsRequired (mGetBoolean (elementText));
                }
                else if (elementName.equals ("EmployersNamedPersonRequired"))
                {
                    coEventConfigDO.setEmployersNamedPersonRequired (mGetBoolean (elementText));
                }
                else if (elementName.equals ("WordProcessingCall"))
                {
                    coEventConfigDO.setWordProcessingCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("OracleReportCall"))
                {
                    coEventConfigDO.setOracleReportCall (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetOrderDateOnCommit"))
                {
                    coEventConfigDO.setSetOrderDateOnCommit (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAON60DateOnCommit"))
                {
                    coEventConfigDO.setSetAON60DateOnCommit (mGetBoolean (elementText));
                }
                else if (elementName.equals ("DetailsLOVDomain"))
                {
                    coEventConfigDO.setDetailsLOVDomain (elementText);
                }
                else if (elementName.equals ("DetailsLOVMandatory"))
                {
                    coEventConfigDO.setDetailsLOVMandatory (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionPreviousOrderServedCheck"))
                {
                    coEventConfigDO.setPreConditionPreviousOrderServedCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionHearingDateCheck"))
                {
                    coEventConfigDO.setPreConditionHearingDateCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CreditorFieldEnabled"))
                {
                    coEventConfigDO.setCreditorFieldEnabled (mGetBoolean (elementText));
                }
                else if (elementName.equals ("WarrantCreated"))
                {
                    coEventConfigDO.setWarrantCreated (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ServiceNotServedAction"))
                {
                    coEventConfigDO.setServiceNotServedAction (mGetBoolean (elementText));
                }
                else if (elementName.equals ("CreateHearing"))
                {
                    coEventConfigDO.setCreateHearing (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionResponseFiledCheck"))
                {
                    coEventConfigDO.setPreConditionResponseFiledCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionPreviousOrderResponseTimeCheck"))
                {
                    coEventConfigDO.setPreConditionPreviousOrderResponseTimeCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionWarrantExistsCheck"))
                {
                    coEventConfigDO.setPreConditionWarrantExistsCheck (elementText);
                }
                else if (elementName.equals ("PreConditionPaymentDetailsExistCheck"))
                {
                    coEventConfigDO.setPreConditionPaymentDetailsExistCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionMoneyInCourtCheck"))
                {
                    coEventConfigDO.setPreConditionMoneyInCourtCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionDischargedDateSetCheck"))
                {
                    coEventConfigDO.setPreConditionDischargedDateSetCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionDividendsDeclaredCheck"))
                {
                    coEventConfigDO.setPreConditionDividendsDeclaredCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ActionOnUpdateEventError"))
                {
                    coEventConfigDO.setActionOnUpdateEventError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionReleasableMoneyCheck"))
                {
                    coEventConfigDO.setPreConditionReleasableMoneyCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionDebtsMustExistCheck"))
                {
                    coEventConfigDO.setPreConditionDebtsMustExistCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionValidCOStatusCheck"))
                {
                    coEventConfigDO.setPreConditionValidCOStatusCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionValidDebtStatusCheck"))
                {
                    coEventConfigDO.setPreConditionValidDebtStatusCheck (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetStatusOnCommit"))
                {
                    coEventConfigDO.setSetStatusOnCommit (elementText);
                }
                else if (elementName.equals ("SetAttachmentLapsedDateOnCommit"))
                {
                    coEventConfigDO.setSetAttachmentLapsedDateOnCommit (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAttachmentArrearsDateOnCommit"))
                {
                    coEventConfigDO.setSetAttachmentArrearsDateOnCommit (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetRevokedDischargedDateOnCommit"))
                {
                    coEventConfigDO.setSetRevokedDischargedDateOnCommit (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAttachmentLapsedDateToNullOnCommit"))
                {
                    coEventConfigDO.setSetAttachmentLapsedDateToNullOnCommit (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAttachmentLapsedDateToNullOnError"))
                {
                    coEventConfigDO.setSetAttachmentLapsedDateToNullOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAttachmentLapsedDateOnError"))
                {
                    coEventConfigDO.setSetAttachmentLapsedDateOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAttachmentLapsedDateToNullOnStatusNotServed"))
                {
                    coEventConfigDO.setSetAttachmentLapsedDateToNullOnStatusNotServed (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAON60DateToNullOnCommit"))
                {
                    coEventConfigDO.setSetAON60DateToNullOnCommit (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAON60DateToNullOnError"))
                {
                    coEventConfigDO.setSetAON60DateToNullOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAON60DateOnError"))
                {
                    coEventConfigDO.setSetAON60DateOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetOrderDateToNullOnError"))
                {
                    coEventConfigDO.setSetOrderDateToNullOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetOrderDateToNullOnStatusNotServed"))
                {
                    coEventConfigDO.setSetOrderDateToNullOnStatusNotServed (mGetBoolean (elementText));
                }
                else if (elementName.equals ("ReSetStatusToLive"))
                {
                    coEventConfigDO.setReSetStatusToLive (mGetBoolean (elementText));
                }
                else if (elementName.equals ("SetAttachmentArrearsDateOnError"))
                {
                    coEventConfigDO.setSetAttachmentArrearsDateOnError (mGetBoolean (elementText));
                }
                else if (elementName.equals ("StatusLOV"))
                {
                    coEventConfigDO.setStatusLOV (elementText);
                }
                else if (elementName.equals ("StandardEventId"))
                {
                    coEventConfigDO.setStandardEventId (Integer.parseInt (elementText));
                }
                else if (elementName.equals ("SetDebtStatusFromPendingToLive"))
                {
                    coEventConfigDO.setSetDebtStatusFromPendingToLive (mGetBoolean (elementText));
                }
                else if (elementName.equals ("RegisterJudgment"))
                {
                    coEventConfigDO.setRegisterJudgment (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionEventMustExistWarning"))
                {
                    coEventConfigDO.setPreConditionEventMustExistWarning (mGetBoolean (elementText));
                }
                else if (elementName.equals ("PreConditionEventMustExistDependsOnCoType"))
                {
                    coEventConfigDO.setPreConditionEventMustExistDependsOnCoType (elementText);
                }
            }

            mCoEventConfigDOList.put (new Integer (coEventConfigDO.getStandardEventId ()), coEventConfigDO);
        }
        catch (final Exception e)
        {
            throw new SystemException (
                    "processCoEventConfigDO(): Name = [" + elementName + "], Content = [" + elementText + "]", e);
        }
    } // processCoEventConfigDO()

} // class CoEventConfigManager