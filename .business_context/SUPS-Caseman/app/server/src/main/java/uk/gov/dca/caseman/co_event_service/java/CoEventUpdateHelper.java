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

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.co_service.java.CoDefs;
import uk.gov.dca.caseman.common.java.CoFeeAmountHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Created on 26 july 2005
 *
 * Change History
 * v1.0 26/07/05 Chris Hutt
 * 
 * v1.1 28/04/06 Chris Hutt defect 3125
 * ordeer date on CO only updated if not already set
 * 27-May-2006 Phil Haferer (EDS): Added extra functionality to mUpdateCoOnInsert() when handling "Set Status
 * On Commit". Now calculates and updates the 'Fee Amount' on the Consolidated Order when setting
 * the status to Live. Also, moved the call to mUpdateDebtStatus() in PostInsertProcessing() so
 * that the Debts is updated before the Consolidated Order.
 * (TD 3435: Create Postal Payments on C: incorrect overpayment amount).
 * 05-Jun-2006 Steve Blair: Extracted algorithm for calculating CO fees and placed it in a public static function
 * so it could be reused by the passthrough services.
 * (TD 3499: UC059 Passthrough Fee_amount calcs inconsistent with Create Maintain COs).
 * 07-Jun-2006 Phil Haferer (EDS): Realised that the update of CO Fee Amounts applies to a wider range of
 * circumstances than just setting the status to Live. Therefore, refactor the Fee Amount calculation
 * into a separate helper.
 * (TD 3527: Deleting CO debts does not recalculate CO fee).
 * 
 * @author Chris Hutt
 */
public class CoEventUpdateHelper
{

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * System date service name.
     */
    public static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    /**
     * Get system date method name.
     */
    public static final String GET_SYSTEM_DATE = "getSystemDateLocal";
    /**
     * co service name.
     */
    public static final String CO_SERVICE = "ejb/CoServiceLocal";
    /**
     * Get co fee amount calc method.
     */
    public static final String GET_CO_FEE_AMOUNT_CALC_METHOD = "getCoFeeAmountCalcLocal";

    /**
     * Constructor.
     */
    public CoEventUpdateHelper ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * Post insert processing.
     *
     * @param pInsertCoEventElement The event element.
     * @param pContext The component context.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void PostInsertProcessing (final Element pInsertCoEventElement, final IComponentContext pContext)
        throws SystemException, JDOMException, BusinessException
    {
        ICoEventConfigDO coEventConfigDO = null;

        try
        {
            coEventConfigDO = mGetCoEventConfig (pInsertCoEventElement);

            if (coEventConfigDO.isSetDebtStatusFromPendingToLive ())
            {
                mUpdateDebtStatus (pInsertCoEventElement, "PENDING", "LIVE");
            }

            // Is an update to consolidated orders required?
            if (coEventConfigDO.isSetAON60DateOnCommit () || coEventConfigDO.isSetAON60DateToNullOnCommit () ||
                    coEventConfigDO.isSetAttachmentArrearsDateOnCommit () ||
                    coEventConfigDO.isSetAttachmentLapsedDateToNullOnCommit () ||
                    coEventConfigDO.isSetAttachmentLapsedDateOnCommit () ||
                    coEventConfigDO.isSetAttachmentLapsedDateToNullOnStatusNotServed () ||
                    coEventConfigDO.isSetOrderDateOnCommit () || coEventConfigDO.isServiceNotServedAction () ||
                    coEventConfigDO.isSetOrderDateToNullOnStatusNotServed () ||
                    coEventConfigDO.isSetRevokedDischargedDateOnCommit () || coEventConfigDO.isReSetStatusToLive () ||
                    !mIsEmpty (coEventConfigDO.getSetStatusOnCommit ()))
            {

                // perform the update
                mUpdateCoOnInsert (coEventConfigDO, pInsertCoEventElement, pContext);
            }

        }
        finally
        {
            coEventConfigDO = null;
        }
    } // PostInsertProcessing()

    /**
     * (non-Javadoc)
     * Populate the CO element based on various rules and then if an update is required call a service to update the
     * record.
     *
     * @param coEventConfigDO the co event config DO
     * @param pInsertCoEventElement the insert co event element
     * @param pContext the context
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCoOnInsert (final ICoEventConfigDO coEventConfigDO, final Element pInsertCoEventElement,
                                    final IComponentContext pContext)
        throws SystemException, JDOMException, BusinessException
    {
        String systemDate = null;
        String commitStatus = null;

        boolean updateRequired = false;

        Element coElement = null;

        try
        {

            // get current date
            systemDate = mGetSystemDate ();

            // retrieve the consolidated order (with an SCN!)
            coElement = GetCoForUpdate (pInsertCoEventElement);

            // Rules associated with Service set to status of 'NOT SERVED'
            if (coEventConfigDO.isServiceNotServedAction ())
            {
                final String status = pInsertCoEventElement.getChildText ("Service");
                if (status.equals ("NOT SERVED"))
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/AttachmentLapsedDate", systemDate);
                }
            }

            // Rules associated with AoN60date
            if (coEventConfigDO.isSetAON60DateOnCommit ())
            {
                XMLBuilder.setXPathValue (coElement, "/CoRecord/AoN60date", systemDate);
                updateRequired = true;
            }
            else if (coEventConfigDO.isSetAON60DateToNullOnCommit ())
            {
                XMLBuilder.setXPathValue (coElement, "/CoRecord/AoN60date", "");
                updateRequired = true;
            }

            // Rules associated with AttachmentArrearsDate
            if (coEventConfigDO.isSetAttachmentArrearsDateOnCommit ())
            {
                XMLBuilder.setXPathValue (coElement, "/CoRecord/AttachmentArrearsDate", systemDate);
                updateRequired = true;
            }

            // Rules associated with AttachmentLapsedDate
            if (coEventConfigDO.isSetAttachmentLapsedDateOnCommit ())
            {
                XMLBuilder.setXPathValue (coElement, "/CoRecord/AttachmentLapsedDate", systemDate);
                updateRequired = true;
            }
            else if (coEventConfigDO.isSetAttachmentLapsedDateToNullOnCommit ())
            {
                XMLBuilder.setXPathValue (coElement, "/CoRecord/AttachmentLapsedDate", "");
                updateRequired = true;
            }
            else if (coEventConfigDO.isSetAttachmentLapsedDateToNullOnStatusNotServed ())
            {
                if (XMLBuilder.getXPathValue (coElement, "/CoRecord/COStatus").equals ("NOT SERVED"))
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/AttachmentLapsedDate", "");
                    updateRequired = true;
                }
            }

            // Rules associated with OrderDate
            if (coEventConfigDO.isSetOrderDateOnCommit ())
            {
                if (mIsEmpty (XMLBuilder.getXPathValue (coElement, "/CoRecord/OrderDate")))
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/OrderDate", systemDate);
                    updateRequired = true;
                }
            }

            // Rules associated with RevokedDischargedDate
            if (coEventConfigDO.isSetRevokedDischargedDateOnCommit ())
            {
                XMLBuilder.setXPathValue (coElement, "/CoRecord/RevokedDischargedDate", systemDate);
                updateRequired = true;
            }

            // Rules associated with Status update
            if (coEventConfigDO.isReSetStatusToLive ())
            {
                if (mIsEmpty (XMLBuilder.getXPathValue (coElement, "/CoRecord/OrderDate")))
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/COStatus", "APPLN");
                    updateRequired = true;
                }
                else
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/COStatus", "LIVE");
                    mUpdateCoFeeAmount (coElement, pContext);
                    updateRequired = true;
                }
            }
            commitStatus = coEventConfigDO.getSetStatusOnCommit ();
            if ( !mIsEmpty (commitStatus))
            {
                XMLBuilder.setXPathValue (coElement, "/CoRecord/COStatus", commitStatus);
                if (commitStatus.equals ("LIVE"))
                {
                    mUpdateCoFeeAmount (coElement, pContext);
                }
                updateRequired = true;
            }

            // After interpreting all these rules is an update required?
            if (updateRequired)
            {
                mUpdateCo (coElement);
            }

        }
        finally
        {
            systemDate = null;
            coElement = null;
            commitStatus = null;
        }

    } // mUpdateCoOnInsert()

    /**
     * When setting the Consolidated Order's Status to Live, the Fee Amount
     * must also be calculated and updated on the CONSOLIDATED_ORDERS row.
     *
     * @param pCoElement The co element.
     * @param pContext The component context.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mUpdateCoFeeAmount (final Element pCoElement, final IComponentContext pContext)
        throws BusinessException, SystemException
    {
        try
        {
            final String coNumber = XMLBuilder.getXPathValue (pCoElement, "/CoRecord/CONumber");
            final double coFeeRate = mStringToDouble (XMLBuilder.getXPathValue (pCoElement, "/CoRecord/FeeRate"));

            final double coFeeAmount = CoFeeAmountHelper.calculateCoFeeAmount (coNumber, coFeeRate, pContext);

            XMLBuilder.setXPathValue (pCoElement, "/CoRecord/FeeAmount", Double.toString (coFeeAmount));
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    } // mUpdateCoFeeAmount()

    /**
     * M string to double.
     *
     * @param pStringValue the string value
     * @return the double
     */
    private double mStringToDouble (final String pStringValue)
    {
        double dValue = 0;

        if (pStringValue != null)
        {
            dValue = Double.parseDouble (pStringValue);
        }

        return dValue;
    } // mStringToDouble()

    /**
     * Post update processing.
     *
     * @param pUpdateCoEventElement The event element.
     * @param pCoNumber The co number.
     * @param pStatusRulesRelevant Determines whether status rules are relevant.
     * @param pErrorRulesRelevant Determines whether error rules are relevant.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    public void PostUpdateProcessing (final Element pUpdateCoEventElement, final String pCoNumber,
                                      final boolean pStatusRulesRelevant, final boolean pErrorRulesRelevant)
        throws SystemException, JDOMException, BusinessException
    {
        ICoEventConfigDO coEventConfigDO = null;

        try
        {
            coEventConfigDO = mGetCoEventConfig (pUpdateCoEventElement);

            // Is an update to consolidated orders required?
            if (coEventConfigDO.isSetAON60DateOnError () && pErrorRulesRelevant ||
                    coEventConfigDO.isSetAON60DateToNullOnError () && pErrorRulesRelevant ||
                    coEventConfigDO.isSetAttachmentArrearsDateOnError () && pErrorRulesRelevant ||
                    coEventConfigDO.isSetAttachmentLapsedDateOnError () && pErrorRulesRelevant ||
                    coEventConfigDO.isSetAttachmentLapsedDateToNullOnError () && pErrorRulesRelevant ||
                    coEventConfigDO.isSetOrderDateToNullOnError () && pErrorRulesRelevant ||
                    coEventConfigDO.isSetOrderDateToNullOnStatusNotServed () && pStatusRulesRelevant)
            {

                // perform the update
                mUpdateCoOnEventUpdate (coEventConfigDO, pUpdateCoEventElement, pCoNumber, pStatusRulesRelevant,
                        pErrorRulesRelevant);
            }

        }
        finally
        {
            coEventConfigDO = null;
        }
    } // PostUpdateProcessing()

    /**
     * M update co on event update.
     *
     * @param coEventConfigDO the co event config DO
     * @param pUpdateCoEventElement the update co event element
     * @param pCoNumber the co number
     * @param pStatusRulesRelevant the status rules relevant
     * @param pErrorRulesRelevant the error rules relevant
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCoOnEventUpdate (final ICoEventConfigDO coEventConfigDO, final Element pUpdateCoEventElement,
                                         final String pCoNumber, final boolean pStatusRulesRelevant,
                                         final boolean pErrorRulesRelevant)
        throws SystemException, JDOMException, BusinessException
    {
        String systemDate = null;
        boolean updateRequired = false;

        Element coElement = null;

        try
        {

            // add CoNumber to the event
            XMLBuilder.add (pUpdateCoEventElement, "CONumber", pCoNumber);

            // get current date
            systemDate = mGetSystemDate ();

            // retrieve the consolidated order (with an SCN!)
            coElement = GetCoForUpdate (pUpdateCoEventElement);

            if (pErrorRulesRelevant)
            {
                // Rules associated with AoN60date
                if (coEventConfigDO.isSetAON60DateToNullOnError ())
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/AoN60date", "");
                    updateRequired = true;
                }

                // Rules associated with AttachmentArrearsDate
                if (coEventConfigDO.isSetAttachmentArrearsDateOnError ())
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/AttachmentArrearsDate", systemDate);
                    updateRequired = true;
                }

                // Rules associated with AttachmentLapsedDate
                if (coEventConfigDO.isSetAttachmentLapsedDateOnError ())
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/AttachmentLapsedDate", systemDate);
                    updateRequired = true;
                }
                else if (coEventConfigDO.isSetAttachmentLapsedDateToNullOnError ())
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/AttachmentLapsedDate", "");
                    updateRequired = true;
                }

                // Rules associated with OrderDate
                if (coEventConfigDO.isSetOrderDateToNullOnError ())
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/OrderDate", "");
                    updateRequired = true;
                }
            }

            if (pStatusRulesRelevant)
            {
                if (coEventConfigDO.isSetOrderDateToNullOnStatusNotServed ())
                {
                    // if (XMLBuilder.getXPathValue(coElement, "/CoRecord/COStatus").equals("NOT SERVED")){
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/OrderDate", "");
                    updateRequired = true;
                    // }
                }
                if (coEventConfigDO.isSetAttachmentArrearsDateOnCommit ())
                {
                    XMLBuilder.setXPathValue (coElement, "/CoRecord/AttachmentArrearsDate", systemDate);
                    updateRequired = true;
                }
            }

            // After interpreting all these rules is an update required?
            if (updateRequired)
            {
                mUpdateCo (coElement);
            }

        }
        finally
        {
            systemDate = null;
            coElement = null;
        }

    } // mUpdateCoEventUpdate()

    /**
     * (non-Javadoc)
     * Get event config data based on the event id.
     *
     * @param pCoEventElement the co event element
     * @return the i co event config DO
     * @throws SystemException the system exception
     */
    private ICoEventConfigDO mGetCoEventConfig (final Element pCoEventElement) throws SystemException
    {
        ICoEventConfigDO coEventConfigDO = null;
        String sStandardEventId = null;
        CoEventConfigManager coEventConfigManager = null;

        try
        {
            // Extract the Standard Event Id from XML Document.
            sStandardEventId = pCoEventElement.getChildText ("StandardEventId");
            // sStandardEventId = XMLBuilder.getXPathValue(
            // pCoEventElement, "/COEvent/StandardEventId");
            final int standardEventId = Integer.parseInt (sStandardEventId);

            // Retrieve the configuration data object associated with the standard Event id.
            coEventConfigManager = CoEventConfigManager.getInstance ();
            coEventConfigDO = coEventConfigManager.getCoEventConfigDO (standardEventId);
        }
        finally
        {
            sStandardEventId = null;
            coEventConfigManager = null;
        }

        return coEventConfigDO;
    } // mGetCoEventConfig()

    /**
     * Returns a co element for updating.
     *
     * @param pCoEventElement the co event element
     * @return The co element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public Element GetCoForUpdate (final Element pCoEventElement) throws SystemException, BusinessException
    {
        Element getCoElement = null;
        Element getCoParamsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            getCoParamsElement = mBuildGetCoParams (pCoEventElement);
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (getCoParamsElement);

            getCoElement = localServiceProxy.getJDOM (CoDefs.CO_SERVICE, CoDefs.GET_CO_ON_EVENT_COMMIT, sXmlParams)
                    .getRootElement ();
        }
        finally
        {
            getCoParamsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return getCoElement;
    } // GetCoForUpdate()

    /**
     * (non-Javadoc)
     * Add coNumber to a params element.
     *
     * @param pCoEventElement the co event element
     * @return the element
     */
    private Element mBuildGetCoParams (final Element pCoEventElement)
    {
        Element paramsElement = null;
        String sValue = null;

        // Build the Parameter XML for passing to the getCoOnEventCommit service.
        sValue = pCoEventElement.getChildText ("CONumber");
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coNumber", sValue);

        return paramsElement;
    } // mBuildGetCoParams()

    /**
     * Updates the co element.
     *
     * @param pCoElement The co element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public void mUpdateCo (final Element pCoElement) throws SystemException, BusinessException
    {
        Element getCoParamsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            getCoParamsElement = mBuildUpdateCoParams (pCoElement);

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (getCoParamsElement);

            localServiceProxy.getJDOM (CoDefs.CO_SERVICE, CoDefs.UPDATE_CO_ON_EVENT_COMMIT, sXmlParams);

        }
        finally
        {
            getCoParamsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

    } // UpdateCo()

    /**
     * (non-Javadoc)
     * Add coElement to params element.
     *
     * @param pCoElement the co element
     * @return the element
     */
    private Element mBuildUpdateCoParams (final Element pCoElement)
    {

        Element paramsElement = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, (Element) pCoElement.detach ());

        return paramsElement;
    } // mBuildUpdateCoParams()

    /**
     * Updates the debt status.
     *
     * @param pCoEventElement The event element.
     * @param pOldStatus The old status.
     * @param pNewStatus The new status to set.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public void mUpdateDebtStatus (final Element pCoEventElement, final String pOldStatus, final String pNewStatus)
        throws SystemException, BusinessException
    {
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        String coNumber = null;

        try
        {
            coNumber = pCoEventElement.getChildText ("CONumber");
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "coNumber", coNumber);
            XMLBuilder.addParam (paramsElement, "oldStatus", pOldStatus);
            XMLBuilder.addParam (paramsElement, "newStatus", pNewStatus);

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            localServiceProxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.UPDATE_CO_DEBT_STATUS, sXmlParams);

        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
            coNumber = null;
        }

    } // UpdateCo()

    /**
     * (non-Javadoc)
     * Call a service to get the database server date/time.
     *
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetSystemDate () throws SystemException, BusinessException
    {
        Element getSystemDateElement = null;
        Element getDateParamsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        String systemDate = null;

        try
        {
            getDateParamsElement = mGetSystemDateParams ();
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (getDateParamsElement);

            getSystemDateElement =
                    localServiceProxy.getJDOM (SYSTEM_DATE_SERVICE, GET_SYSTEM_DATE, sXmlParams).getRootElement ();

            systemDate = getSystemDateElement.getText ();

        }
        finally
        {
            getSystemDateElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return systemDate;
    } // mGetSystemDate()

    /**
     * (non-Javadoc)
     * Create a params element for passing to a service to get the system date.
     *
     * @return the element
     */
    private Element mGetSystemDateParams ()
    {
        Element paramsElement = null;
        // Build the Parameter XML for passing to the getSystemDate service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "date", "");

        return paramsElement;
    } // mGetSystemDateParams()

    /**
     * M is empty.
     *
     * @param s the s
     * @return true, if successful
     */
    private boolean mIsEmpty (final String s)
    {
        return s == null || "".equals (s);
    } // mIsEmpty()

} // class CoEventUpdateHelper
