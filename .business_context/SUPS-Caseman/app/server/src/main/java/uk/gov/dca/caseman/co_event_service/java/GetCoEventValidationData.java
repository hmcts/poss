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
import java.io.Writer;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.co_service.java.CoDefs;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.hearing_service.java.HearingDefs;
import uk.gov.dca.caseman.warrant_service.java.WarrantDefs;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 12 july 2005
 *
 * Change History
 * --------------
 * 
 * 12/07/2005 v1.0 Chris Hutt
 * 14/11/3005 v1.1 Chris Hutt
 * defect 1657: failing to call Co.getDebt when PreConditionValidDebtStatusCheck set to true
 * 
 * 21/11/2005 v1.2 Chris Hutt
 * defect 1851: PreConditionValidDebtStatusCheck included with al other tests that look for debts
 *
 * 22/11/2005 v1.3 Chris Hutt
 * DEFECT 1745: Money in court - now requires a param of 'releaseInd'
 * 
 * 23/11/2005 v1.4 Chris Hutt
 * DEFECT 1657 : event 174, tick box list associated with 'EVT_174_CO DESCRIPTION' not
 * being returned. This was because of an incorrect IF..THEN..ELSE structure which meant
 * that the associated method was never called if other conditions were set to 'true'!
 * 
 * 2/12/2005 V1.5 Chris Hutt
 * defect UCT340 : event 105 and others need to check if EmployersNamedPerson is populated
 * 
 * 4/5/06 v1.6 Chris Hutt
 * RFC1473:eventsMustExistWarning added
 * 17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * 18/07/2006 Chris Hutt
 * TD3972: LOV Domain EVT_174_CO DESCRIPTION now returns a list of debts/parties (as per LOV EVT_111 DESCRIPTION)
 * 
 * 31/07/2006 Chris Hutt
 * TD3972: LOV for 174 not being returned when integration with client tested
 * 
 * 02/08/2006 Chris Hutt
 * Invocation of getCoEventIssueDetail added.
 * Needed as a consequence of implementing pagination.
 * 
 * 4 jan 2006 Chris Hutt
 * Defect temp_caseman 392: PreConditionEventMustExistDependsOnCoType added. This will result in
 * PreConditionEventMustExist being set to false if the CO type is not of the kind specified.
 * 
 * 31 jan 2007 Chris Hutt
 * Defect temp_caseman 392: implmentation of PreConditionEventMustExistDependsOnCoType meant other
 * event checks not working - problem was that config held a mixture of booleans (false) and values.
 * Code tidied up at same time.
 *
 * @author Chris Hutt
 */
public class GetCoEventValidationData implements ICustomProcessor
{
    
    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The out. */
    private final XMLOutputter out;

    /** The co number param path. */
    private final XPath coNumberParamPath;
    
    /** The event id param path. */
    private final XPath eventIdParamPath;

    /** The event edit details path. */
    private final XPath eventEditDetailsPath;

    /** The config path. */
    private final XPath configPath;
    
    /** The events must exist config path. */
    private final XPath eventsMustExistConfigPath;
    
    /** The hearing date check config path. */
    private final XPath hearingDateCheckConfigPath;
    
    /** The previous order served check config path. */
    private final XPath previousOrderServedCheckConfigPath;
    
    /** The payment details exist check config path. */
    private final XPath paymentDetailsExistCheckConfigPath;
    
    /** The employer details required config path. */
    private final XPath employerDetailsRequiredConfigPath;
    
    /** The employer named person required config path. */
    private final XPath employerNamedPersonRequiredConfigPath;
    
    /** The warrant exists config path. */
    private final XPath warrantExistsConfigPath;
    
    /** The discharge date check config path. */
    private final XPath dischargeDateCheckConfigPath;
    
    /** The dividends declared check config path. */
    private final XPath dividendsDeclaredCheckConfigPath;
    
    /** The valid co status check config path. */
    private final XPath validCoStatusCheckConfigPath;
    
    /** The existing debts config path. */
    private final XPath existingDebtsConfigPath;
    
    /** The valid debt status check config path. */
    private final XPath validDebtStatusCheckConfigPath;
    
    /** The per details required config path. */
    private final XPath perDetailsRequiredConfigPath;
    
    /** The money in court check config path. */
    private final XPath moneyInCourtCheckConfigPath;
    
    /** The Creditor field enabled config path. */
    private final XPath CreditorFieldEnabledConfigPath;
    
    /** The events must exist warning config path. */
    private final XPath eventsMustExistWarningConfigPath;
    
    /** The Issue stage config path. */
    private final XPath IssueStageConfigPath;
    
    /** The pre condition event must exist depends on co type config path. */
    private final XPath preConditionEventMustExistDependsOnCoTypeConfigPath;

    /** The crd service previous orders served path. */
    private final XPath crdServicePreviousOrdersServedPath;
    
    /** The crd service co for event checks path. */
    private final XPath crdServiceCoForEventChecksPath;
    
    /** The crd service employer details exist path. */
    private final XPath crdServiceEmployerDetailsExistPath;
    
    /** The crd service employers named person exists path. */
    private final XPath crdServiceEmployersNamedPersonExistsPath;
    
    /** The crd service warrant exists path. */
    private final XPath crdServiceWarrantExistsPath;
    
    /** The crd service dividend declared path. */
    private final XPath crdServiceDividendDeclaredPath;
    
    /** The crd service debt path. */
    private final XPath crdServiceDebtPath;
    
    /** The crd service money in court path. */
    private final XPath crdServiceMoneyInCourtPath;
    
    /** The details LOV domain param path. */
    private final XPath detailsLOVDomainParamPath;
    
    /** The crd service valid debt status path. */
    private final XPath crdServiceValidDebtStatusPath;
    
    /** The crd service valid co status path. */
    private final XPath crdServiceValidCoStatusPath;
    
    /** The crd service details LOV domain path. */
    private final XPath crdServiceDetailsLOVDomainPath;

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (GetCoEventValidationData.class);

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public GetCoEventValidationData () throws JDOMException
    {

        eventIdParamPath = XPath.newInstance ("params/param[@name='eventId']");
        coNumberParamPath = XPath.newInstance ("params/param[@name='coNumber']");

        eventsMustExistConfigPath = XPath.newInstance ("/CoEventConfiguration/PreConditionEventMustExist");
        hearingDateCheckConfigPath = XPath.newInstance ("/CoEventConfiguration/PreConditionHearingDateCheck");
        previousOrderServedCheckConfigPath =
                XPath.newInstance ("/CoEventConfiguration/PreConditionPreviousOrderServedCheck");
        paymentDetailsExistCheckConfigPath =
                XPath.newInstance ("/CoEventConfiguration/PreConditionPaymentDetailsExistCheck");
        employerDetailsRequiredConfigPath = XPath.newInstance ("/CoEventConfiguration/EmployerDetailsRequired");
        employerNamedPersonRequiredConfigPath =
                XPath.newInstance ("/CoEventConfiguration/EmployersNamedPersonRequired");
        warrantExistsConfigPath = XPath.newInstance ("/CoEventConfiguration/PreConditionWarrantExistsCheck");
        dischargeDateCheckConfigPath = XPath.newInstance ("/CoEventConfiguration/PreConditionDischargedDateSetCheck");
        dividendsDeclaredCheckConfigPath =
                XPath.newInstance ("/CoEventConfiguration/PreConditionDividendsDeclaredCheck");
        validCoStatusCheckConfigPath = XPath.newInstance ("/CoEventConfiguration/PreConditionValidCOStatusCheck");
        existingDebtsConfigPath = XPath.newInstance ("/CoEventConfiguration/PreConditionDebtsMustExistCheck");
        validDebtStatusCheckConfigPath = XPath.newInstance ("/CoEventConfiguration/PreConditionValidDebtStatusCheck");
        perDetailsRequiredConfigPath = XPath.newInstance ("/CoEventConfiguration/PERDetailsRequired");
        moneyInCourtCheckConfigPath = XPath.newInstance ("/CoEventConfiguration/PreConditionMoneyInCourtCheck");
        detailsLOVDomainParamPath = XPath.newInstance ("/CoEventConfiguration/DetailsLOVDomain");
        CreditorFieldEnabledConfigPath = XPath.newInstance ("/CoEventConfiguration/CreditorFieldEnabled");
        eventsMustExistWarningConfigPath =
                XPath.newInstance ("/CoEventConfiguration/PreConditionEventMustExistWarning");
        IssueStageConfigPath = XPath.newInstance ("/CoEventConfiguration/IssueStage");
        preConditionEventMustExistDependsOnCoTypeConfigPath =
                XPath.newInstance ("/CoEventConfiguration/PreConditionEventMustExistDependsOnCoType");

        configPath = XPath.newInstance ("/CoEventValidationData/CoEventConfiguration");

        crdServicePreviousOrdersServedPath = XPath.newInstance ("/ds/CO/HasPreviousOrdersServed");
        crdServiceCoForEventChecksPath = XPath.newInstance ("/ds/CO");
        crdServiceEmployerDetailsExistPath = XPath.newInstance ("/ds/CO/EmployerDetailsExist");
        crdServiceEmployersNamedPersonExistsPath = XPath.newInstance ("/ds/CO/EmployersNamedPersonExists");

        crdServiceWarrantExistsPath = XPath.newInstance ("/ds/WarrantData");
        crdServiceDividendDeclaredPath = XPath.newInstance ("/ds/CO/DividendDeclared");
        crdServiceDebtPath = XPath.newInstance ("/Debts");
        crdServiceMoneyInCourtPath = XPath.newInstance ("/ds/MoneyInCourt");
        crdServiceDetailsLOVDomainPath = XPath.newInstance ("/Options");

        crdServiceValidCoStatusPath = XPath.newInstance ("/ValidCOStatuses");
        crdServiceValidDebtStatusPath = XPath.newInstance ("/ValidDebtStatuses");

        eventEditDetailsPath = XPath.newInstance ("/ds/StandardEvent/EditDetails");

        proxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log pLog)
        throws BusinessException, SystemException
    {
        try
        {

            final Element rootElement = new Element ("CoEventValidationData");
            Element input = null;
            final Element crdElement = new Element ("CoRelatedData");
            String coNumber = null;
            String eventIdStr = null;
            String warrantType = null;
            String preConditionCoType = null;
            String coType = null;
            final Element coTypeElement = null;
            boolean cancelEventsMustExistCheck = false;

            // Get the CO Number
            // -----------------
            input = (Element) coNumberParamPath.selectSingleNode (params);
            coNumber = input.getText ();

            final Element crdParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (crdParamsElement, "coNumber", coNumber);
            // Get the eventId
            // ---------------
            input = (Element) eventIdParamPath.selectSingleNode (params);
            eventIdStr = input.getText ();
            final Document eventConfigDoc = new CoEventValidationXMLBuilder ().getCoEventConfigurationDoc (eventIdStr);

            rootElement.addContent (((Element) eventConfigDoc.getRootElement ().clone ()).detach ());

            // Get CO related data supporting the configuration for this event
            // ---------------------------------------------------------------

            preConditionCoType = mGetConfigValue (eventConfigDoc, preConditionEventMustExistDependsOnCoTypeConfigPath);

            // Are any of the configuration rules specific to the CONSOLIDATED_ORDERS row?
            if (mGetConfigValue (eventConfigDoc, paymentDetailsExistCheckConfigPath).equals ("true") ||
                    mGetConfigValue (eventConfigDoc, dischargeDateCheckConfigPath).equals ("true") ||
                    mGetConfigValue (eventConfigDoc, validCoStatusCheckConfigPath).equals ("true") ||
                    mGetConfigValue (eventConfigDoc, perDetailsRequiredConfigPath).equals ("true") ||
                    !preConditionCoType.equals (""))
            {

                crdElement.addContent (((Element) mGetCoForEventChecks (coNumber).clone ()).detach ());
            }

            // Pre-requisite events (error)
            if (mGetConfigValue (eventConfigDoc, eventsMustExistConfigPath).equals ("true"))
            {

                // If the pre-req event check is dependent upon the CoType then config may need adjusting
                if ( !preConditionCoType.equals (""))
                {
                    coType = crdElement.getChild ("ConsolidatedOrderDetails").getChild ("CO").getChildText ("COType");
                    if ( !preConditionCoType.equals (coType))
                    {
                        cancelEventsMustExistCheck = true;
                    }
                }

                // If event pre-req test still there, go and get event details for return to client.
                if ( !cancelEventsMustExistCheck)
                {
                    crdElement.addContent (
                            ((Element) mGetPreReqEvents (eventIdStr, coNumber, "PreConditionEventsMustExist").clone ())
                                    .detach ());
                }

            }

            // Pre-requisite events (warning)
            if (mGetConfigValue (eventConfigDoc, eventsMustExistWarningConfigPath).equals ("true"))
            {
                crdElement.addContent (
                        ((Element) mGetPreReqEvents (eventIdStr, coNumber, "PreConditionEventsMustExistWarning")
                                .clone ()).detach ());
            }

            // Future hearings
            if (mGetConfigValue (eventConfigDoc, hearingDateCheckConfigPath).equals ("true"))
            {
                crdElement.addContent (((Element) mGetFutureHearings (coNumber).clone ()).detach ());
            }

            // Previous orders served
            if (mGetConfigValue (eventConfigDoc, previousOrderServedCheckConfigPath).equals ("true"))
            {
                crdElement.addContent (((Element) mCheckPreviousOrdersServed (coNumber).clone ()).detach ());
            }

            // Employer details required?
            if (mGetConfigValue (eventConfigDoc, employerDetailsRequiredConfigPath).equals ("true"))
            {
                crdElement.addContent (((Element) mEmployerDetailsCheck (coNumber).clone ()).detach ());
            }

            // Employer Named Person required?
            if (mGetConfigValue (eventConfigDoc, employerNamedPersonRequiredConfigPath).equals ("true"))
            {
                crdElement.addContent (((Element) mEmployerNamedPersonCheck (coNumber).clone ()).detach ());
            }

            // warrant exists?
            warrantType = mGetConfigValue (eventConfigDoc, warrantExistsConfigPath);
            if ( !isEmpty (warrantType))
            {
                crdElement.addContent (((Element) mWarrantExistsCheck (coNumber, warrantType).clone ()).detach ());
            }

            // dividends declared?
            if (mGetConfigValue (eventConfigDoc, dividendsDeclaredCheckConfigPath).equals ("true"))
            {
                crdElement.addContent (((Element) mDividendsDeclaredCheck (coNumber).clone ()).detach ());
            }

            // money in court?
            if (mGetConfigValue (eventConfigDoc, moneyInCourtCheckConfigPath).equals ("true"))
            {
                crdElement.addContent (((Element) mGetMoneyInCourt (coNumber).clone ()).detach ());

            }

            // Issue details required??
            if (mGetConfigValue (eventConfigDoc, IssueStageConfigPath).equals ("true"))
            {
                crdElement.addContent (((Element) mGetIssueDetails (coNumber, eventIdStr).clone ()).detach ());

            }

            // List of valid debt statuses and existing debts
            /* if (mGetConfigValue( eventConfigDoc, validDebtStatusCheckConfigPath ).equals("true")){
             * crdElement.addContent(((Element)mGetValidDebtStatusList( eventIdStr ).clone()).detach());
             * crdElement.addContent(((Element)mGetDebt(coNumber ).clone()).detach());
             * } */

            // List of valid co statuses
            if (mGetConfigValue (eventConfigDoc, validCoStatusCheckConfigPath).equals ("true"))
            {
                crdElement.addContent (((Element) mGetValidCoStatusList (eventIdStr).clone ()).detach ());
            }

            // LOV list and Debt/Co Parties and Statuses
            final String detailsLOVDomain = mGetConfigValue (eventConfigDoc, detailsLOVDomainParamPath);

            if (mGetConfigValue (eventConfigDoc, existingDebtsConfigPath).equals ("true") ||
                    mGetConfigValue (eventConfigDoc, CreditorFieldEnabledConfigPath).equals ("true") ||
                    mGetConfigValue (eventConfigDoc, validDebtStatusCheckConfigPath).equals ("true") ||
                    detailsLOVDomain.equals ("EVT_111 DESCRIPTION") ||
                    detailsLOVDomain.equals ("EVT_174_CO DESCRIPTION"))
            {

                crdElement.addContent (((Element) mGetDebt (coNumber).clone ()).detach ());
                crdElement.addContent (((Element) mGetParties (coNumber).clone ()).detach ());
                crdElement.addContent (((Element) mGetValidDebtStatusList (eventIdStr).clone ()).detach ());
            }

            if ( !isEmpty (detailsLOVDomain) && !detailsLOVDomain.equals ("EVT_111 DESCRIPTION"))
            {
                crdElement.addContent (((Element) mGetRefDataLov (detailsLOVDomain).clone ()).detach ());
            }

            // Add CaseRelatedData to the root element
            // ---------------------------------------

            rootElement.addContent (((Element) crdElement.clone ()).detach ());

            final Document finalDoc = new Document ();
            finalDoc.addContent (((Element) rootElement.clone ()).detach ());

            // Do any final adjustments to the configuration settings
            // ---------------------------------------------------------

            final Element configElement = (Element) configPath.selectSingleNode (finalDoc.getRootElement ());

            // 1) Get the EditDetails associated with the Standard Event and attach to the CoEventConfiguration
            final String editDetail = mGetEditDetails (eventIdStr);
            XMLBuilder.add (configElement, "EditDetails", editDetail);

            // 2) PreConditionEventMustExist may need to be cancelled
            if (cancelEventsMustExistCheck)
            {
                XMLBuilder.setXPathValue (finalDoc.getRootElement (),
                        "/CoEventValidationData/CoEventConfiguration/PreConditionEventMustExist", "false");
            }

            final String s = getXMLString (finalDoc.getRootElement ());
            log.debug ("GetCoEventValidationData Response: " + s);
            writer.write (s);

        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return;
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
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
     * Gets the XML string.
     *
     * @param e the e
     * @return the XML string
     */
    private String getXMLString (final Element e)
    {
        return out.outputString (e);
    }

    /**
     * (non-Javadoc)
     * Get associated debts.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetDebt (final String pCoNumber) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element coDebtStatusElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (coDebtStatusElement, "coNumber", pCoNumber);

            crdResultRootElement = proxy
                    .getJDOM (CoDefs.CO_SERVICE, CoDefs.GET_DEBT, getXMLString (coDebtStatusElement)).getRootElement ();

            crdResultElement = (Element) crdServiceDebtPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * Check whether dividends have been declared.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mDividendsDeclaredCheck (final String pCoNumber) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element dividendsDeclaredParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (dividendsDeclaredParamsElement, "coNumber", pCoNumber);

            crdResultRootElement = proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.IS_DIVIDEND_DECLARED,
                    getXMLString (dividendsDeclaredParamsElement)).getRootElement ();

            crdResultElement = (Element) crdServiceDividendDeclaredPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * Check whether a warrant exists exist.
     *
     * @param pCoNumber the co number
     * @param pWarrantType the warrant type
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mWarrantExistsCheck (final String pCoNumber, final String pWarrantType)
        throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element warrantExistsParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (warrantExistsParamsElement, "coNumber", pCoNumber);
            XMLBuilder.addParam (warrantExistsParamsElement, "warrantType", pWarrantType);

            crdResultRootElement = proxy.getJDOM (WarrantDefs.WARRANT_SERVICE, WarrantDefs.IS_WARRANT_FOR_CO,
                    getXMLString (warrantExistsParamsElement)).getRootElement ();

            crdResultElement = (Element) crdServiceWarrantExistsPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * Check whether employer details exist.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mEmployerDetailsCheck (final String pCoNumber) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element employerDetailsParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (employerDetailsParamsElement, "coNumber", pCoNumber);

            crdResultRootElement = proxy
                    .getJDOM (CoDefs.CO_SERVICE, CoDefs.IS_EMPLOYER_DETAIL, getXMLString (employerDetailsParamsElement))
                    .getRootElement ();

            crdResultElement = (Element) crdServiceEmployerDetailsExistPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * Check whether employers name person exists.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mEmployerNamedPersonCheck (final String pCoNumber) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element employerNamedPersonParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (employerNamedPersonParamsElement, "coNumber", pCoNumber);

            crdResultRootElement = proxy.getJDOM (CoDefs.CO_SERVICE, CoDefs.IS_EMPLOYER_NAMED_PERSON,
                    getXMLString (employerNamedPersonParamsElement)).getRootElement ();

            crdResultElement =
                    (Element) crdServiceEmployersNamedPersonExistsPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * get LOV info from Reference Data.
     *
     * @param pListType the list type
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetRefDataLov (final String pListType) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element lovParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (lovParamsElement, "listType", pListType);

            crdResultRootElement = proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.GET_CO_EVENT_LOV_LIST,
                    getXMLString (lovParamsElement)).getRootElement ();

            crdResultElement = (Element) crdServiceDetailsLOVDomainPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * get list of valid CO Statuses for this event from Reference Data.
     *
     * @param pEventId the event id
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetValidCoStatusList (final String pEventId) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element statusParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (statusParamsElement, "eventId", pEventId);

            crdResultRootElement = proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.GET_VALID_CO_STATUS_LIST,
                    getXMLString (statusParamsElement)).getRootElement ();

            crdResultElement = (Element) crdServiceValidCoStatusPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * get list of valid debt Statuses for this event from Reference Data.
     *
     * @param pEventId the event id
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetValidDebtStatusList (final String pEventId) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element statusParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (statusParamsElement, "eventId", pEventId);

            crdResultRootElement = proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.GET_VALID_DEBT_STATUS_LIST,
                    getXMLString (statusParamsElement)).getRootElement ();

            crdResultElement = (Element) crdServiceValidDebtStatusPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * Check whether any monies are in court.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetMoneyInCourt (final String pCoNumber) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element moneyInCourtParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (moneyInCourtParamsElement, "coNumber", pCoNumber);
            XMLBuilder.addParam (moneyInCourtParamsElement, "releaseInd", "Y");

            crdResultRootElement = proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.GET_MONEY_IN_COURT,
                    getXMLString (moneyInCourtParamsElement)).getRootElement ();

            crdResultElement = (Element) crdServiceMoneyInCourtPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * Check whether any previous orders which have been served.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mCheckPreviousOrdersServed (final String pCoNumber) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;

        try
        {

            final Element previousOrderCheckParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (previousOrderCheckParamsElement, "coNumber", pCoNumber);

            crdResultRootElement = proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.IS_PREVIOUS_ORDER_SERVED,
                    getXMLString (previousOrderCheckParamsElement)).getRootElement ();

            crdResultElement = (Element) crdServicePreviousOrdersServedPath.selectSingleNode (crdResultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdResultElement;
    }

    /**
     * (non-Javadoc)
     * Return sufficient info from the CONSOLIDATED_ORDERS to support checks specific to this table.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetCoForEventChecks (final String pCoNumber) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        Element crdResultElement = null;
        final Element crdCoDetailsElement = new Element ("ConsolidatedOrderDetails");

        try
        {

            final Element coForEventChecksParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (coForEventChecksParamsElement, "coNumber", pCoNumber);

            crdResultRootElement = proxy.getJDOM (CoDefs.CO_SERVICE, CoDefs.GET_CO_FOR_EVENT_CHECKS,
                    getXMLString (coForEventChecksParamsElement)).getRootElement ();

            crdResultElement = (Element) crdServiceCoForEventChecksPath.selectSingleNode (crdResultRootElement);
            crdCoDetailsElement.addContent ((Element) crdResultElement.clone ());
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return crdCoDetailsElement;
    }

    /**
     * (non-Javadoc)
     * Return a list of future hearings associated with this CO.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetFutureHearings (final String pCoNumber) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        final Element futureHearingsParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (futureHearingsParamsElement, "coNumber", pCoNumber);

        crdResultRootElement = proxy.getJDOM (HearingDefs.HEARING_SERVICE, HearingDefs.GET_FUTURE_CO_HEARINGS,
                getXMLString (futureHearingsParamsElement)).getRootElement ();

        return crdResultRootElement;
    }

    /**
     * (non-Javadoc)
     * Return a list of parties associated with this CO.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetParties (final String pCoNumber) throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        final Element partiesParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (partiesParamsElement, "coNumber", pCoNumber);

        crdResultRootElement =
                proxy.getJDOM (CoDefs.CO_SERVICE, CoDefs.GET_CO_PARTY_LIST, getXMLString (partiesParamsElement))
                        .getRootElement ();

        return crdResultRootElement;
    }

    // Return issue details for specified standard event on the CO
    // -----------------------------------------------------------

    /**
     * M get issue details.
     *
     * @param pCoNumber the co number
     * @param pEventId the event id
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetIssueDetails (final String pCoNumber, final String pEventId)
        throws BusinessException, SystemException
    {

        Element crdResultRootElement = null;
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);
        XMLBuilder.addParam (paramsElement, "eventId", pEventId);

        crdResultRootElement = proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.GET_CO_EVENT_ISSUE_DETAIL,
                getXMLString (paramsElement)).getRootElement ();

        final Element detailsElement = new Element ("IssueDetail");

        detailsElement.addContent (((Element) crdResultRootElement.clone ()).detach ());

        return detailsElement;
    }

    /**
     * (non-Javadoc)
     * Return a list of preRequisite Events associated with the CO.
     *
     * @param pStdEventId the std event id
     * @param pCoNumber the co number
     * @param pElementName the element name
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetPreReqEvents (final String pStdEventId, final String pCoNumber, final String pElementName)
        throws BusinessException, SystemException
    {

        final Element preConditionEventsMustExistElement = new Element (pElementName);
        Element crdResultRootElement = null;
        try
        {
            final XPath crdServicePreReqEventPath = XPath.newInstance ("/PreReqEvents/Event");
            final XPath crdServiceEventsMustExistOnCoParamPath = XPath.newInstance ("/PreRequisiteEvents/Event");

            // Retrieve list of pre-requisite events
            final Element preReqEventsListParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (preReqEventsListParamsElement, "eventId", pStdEventId);

            crdResultRootElement = proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.GET_PRE_REQ_EVENT_LIST,
                    getXMLString (preReqEventsListParamsElement)).getRootElement ();

            final List<Element> preReqEventList = crdServicePreReqEventPath.selectNodes (crdResultRootElement);

            /* now loop thru the list of events returned, searching for any like events
             * recorded against the consolidated order */

            Element preReqEventElement = null;
            String preReqEventId;

            final Iterator<Element> it = preReqEventList.iterator ();
            while (it.hasNext ())
            {
                preReqEventElement = (Element) it.next ();

                final String[] preReqEventNodes = {"PreReqEventId1", "PreReqEventId2", "PreReqEventId3"};
                for (int nx = 0; nx < preReqEventNodes.length; nx++)
                {
                    preReqEventId = preReqEventElement.getChild (preReqEventNodes[nx]).getText ();
                    if ( !isEmpty (preReqEventId))
                    {

                        // Element preConditionEventElement = new Element("Event");
                        // XMLBuilder.add(preConditionEventElement, "EventId", preReqEventId);

                        final Element eventExistsParamsElement = XMLBuilder.getNewParamsElement ();
                        XMLBuilder.addParam (eventExistsParamsElement, "coNumber", pCoNumber);
                        XMLBuilder.addParam (eventExistsParamsElement, "eventId", preReqEventId);

                        crdResultRootElement =
                                proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.GET_PRE_REQ_CO_EVENT,
                                        getXMLString (eventExistsParamsElement)).getRootElement ();

                        final List<Element> eventList =
                                crdServiceEventsMustExistOnCoParamPath.selectNodes (crdResultRootElement);

                        /* now loop thru the list of events returned adding them to the Event node returned
                         * by the service */

                        Element eventElement = null;

                        final Iterator<Element> eit = eventList.iterator ();
                        boolean eventFound = false;
                        while (eit.hasNext ())
                        {
                            eventFound = true;
                            eventElement = (Element) eit.next ();
                            preConditionEventsMustExistElement.addContent (((Element) eventElement.clone ()).detach ());
                        }
                        if ( !eventFound)
                        {
                            final Element notFoundEventElement = new Element ("Event");
                            XMLBuilder.add (notFoundEventElement, "EventId", preReqEventId);
                            XMLBuilder.add (notFoundEventElement, "RecordedAgainstCo", "false");
                            preConditionEventsMustExistElement.addContent ((Element) notFoundEventElement.clone ());
                        }

                    }
                }

            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return preConditionEventsMustExistElement;
    }

    /**
     * (non-Javadoc)
     * Return a configuration value using the path supplied in the XPath expression.
     *
     * @param pConfigDoc the config doc
     * @param pXPath the x path
     * @return the string
     * @throws SystemException the system exception
     */
    private String mGetConfigValue (final Document pConfigDoc, final XPath pXPath) throws SystemException
    {

        String paramValue = null;
        Element paramElement = null;

        try
        {
            paramElement = (Element) pXPath.selectSingleNode (pConfigDoc.getRootElement ());
            paramValue = paramElement.getText ();
            if (paramValue == null)
            {
                paramValue = "";
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        return paramValue;
    }

    /**
     * (non-Javadoc)
     * Calls a service to retrieve standard event details.
     *
     * @param pStandardEventId the standard event id
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String mGetEditDetails (final String pStandardEventId) throws BusinessException, SystemException
    {
        Element resultRootElement = null;
        Element resultElement = null;

        try
        {

            final Element editDetailsParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (editDetailsParamsElement, "eventId", pStandardEventId);

            resultRootElement = proxy.getJDOM (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.GET_STANDARD_EVENT,
                    getXMLString (editDetailsParamsElement)).getRootElement ();

            resultElement = (Element) eventEditDetailsPath.selectSingleNode (resultRootElement);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return resultElement.getText ();
    }
}
