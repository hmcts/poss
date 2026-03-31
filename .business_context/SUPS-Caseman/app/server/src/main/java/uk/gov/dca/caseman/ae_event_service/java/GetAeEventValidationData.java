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

import uk.gov.dca.caseman.ae_service.java.AeDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.hearing_service.java.HearingDefs;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 21-June-2005
 * Author Chris Hutt
 * 
 * Retrieve configuration info required to support the input/correction of AE events
 * along with any data needed to support on-screen validation
 * 
 * Change History
 * v1.0 21/6/05 Chris Hutt
 * 
 * V1.1 7/11/05 Chris Hutt
 * 'PreConditionHearingDateCheck' - amended to call isFutureAeHearings
 * * 'PreConditionHearingTypeCheck' - amended to call isPastAeHearings
 * 
 * v1.2 23/1/06 Chris Hutt
 * Defect 2041 : no need to pass event id to previous order check
 * 
 * 15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 * 
 * 25-May-2006 Chris Hutt
 * TD defect UCT273: PreConditionAeHearingCheck added
 * 
 * 20july2006 chris hutt
 * defect 4030: PreConditionAEOutstandingBalanceCheck mispelling
 *
 * 02/08/2006 Chris Hutt Invocation of getCoEventIssueDetail added.
 * Needed as a consequence of implementing pagination.
 * 
 * 20 Dec 2006 chris hutt
 * temp_caseman defect 356: EmployerNamedPersonRequired added when established that
 * some events do not require a named person check as part of testing whether emplyer details
 * exist.
 *
 * @author Chris Hutt
 *
 */
public class GetAeEventValidationData implements ICustomProcessor
{

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The out. */
    private final XMLOutputter out;

    /** The ae number param path. */
    private final XPath aeNumberParamPath;
    
    /** The case number param path. */
    private final XPath caseNumberParamPath;
    
    /** The event id param path. */
    private final XPath eventIdParamPath;

    /** The config path. */
    private final XPath configPath;

    /** The events must exist param path. */
    private final XPath eventsMustExistParamPath;
    
    /** The crd service pre req event path. */
    private final XPath crdServicePreReqEventPath;
    
    /** The event edit details path. */
    private final XPath eventEditDetailsPath;

    /** The Employer details required param path. */
    private final XPath EmployerDetailsRequiredParamPath;
    
    /** The crd service employer details exist path. */
    private final XPath crdServiceEmployerDetailsExistPath;

    /** The Employer named person required param path. */
    private final XPath EmployerNamedPersonRequiredParamPath;
    
    /** The crd service employer and named person details exist path. */
    private final XPath crdServiceEmployerAndNamedPersonDetailsExistPath;

    // EmployerNamedPersonRequired

    /** The is past ae hearing param path. */
    private final XPath isPastAeHearingParamPath;
    
    /** The crd service past hearings exist path. */
    private final XPath crdServicePastHearingsExistPath;

    /** The is ae hearing param path. */
    private final XPath isAeHearingParamPath;
    
    /** The crd service hearings exist path. */
    private final XPath crdServiceHearingsExistPath;

    /** The ndr and per check param path. */
    private final XPath ndrAndPerCheckParamPath;
    
    /** The crd service ndr and per check path. */
    private final XPath crdServiceNdrAndPerCheckPath;

    /** The outstanding balance param path. */
    private final XPath outstandingBalanceParamPath;
    
    /** The crd serviceoutstanding balance path. */
    private final XPath crdServiceoutstandingBalancePath;

    /** The is future ae hearing param path. */
    private final XPath isFutureAeHearingParamPath;
    
    /** The crd service future hearings exist path. */
    private final XPath crdServiceFutureHearingsExistPath;

    /** The previous order param path. */
    private final XPath previousOrderParamPath;
    
    /** The crd service previous order path. */
    private final XPath crdServicePreviousOrderPath;

    /** The details LOV domain param path. */
    private final XPath detailsLOVDomainParamPath;
    
    /** The crd service details LOV domain path. */
    private final XPath crdServiceDetailsLOVDomainPath;

    /** The valid ae types param path. */
    private final XPath validAeTypesParamPath;
    
    /** The crd service valid ae types path. */
    private final XPath crdServiceValidAeTypesPath;

    /** The Issue stage config path. */
    private final XPath IssueStageConfigPath;
    
    /** The log. */
    private final Log log = SUPSLogFactory.getLogger (GetAeEventValidationData.class);

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public GetAeEventValidationData () throws JDOMException
    {

        eventIdParamPath = XPath.newInstance ("params/param[@name='eventId']");
        aeNumberParamPath = XPath.newInstance ("params/param[@name='aeNumber']");
        caseNumberParamPath = XPath.newInstance ("params/param[@name='caseNumber']");

        eventEditDetailsPath = XPath.newInstance ("/ds/StandardEvent/EditDetails");

        configPath = XPath.newInstance ("/AeEventValidationData/AeEventConfiguration");

        isFutureAeHearingParamPath = XPath.newInstance ("/AeEventConfiguration/PreConditionFutureAeHearingCheck");
        crdServiceFutureHearingsExistPath = XPath.newInstance ("/ds/Case/HasFutureAeHearings");

        isAeHearingParamPath = XPath.newInstance ("/AeEventConfiguration/PreConditionAeHearingCheck");
        crdServiceHearingsExistPath = XPath.newInstance ("/ds/Case/HasAeHearings");

        eventsMustExistParamPath = XPath.newInstance ("/AeEventConfiguration/PreConditionEventMustExist");
        crdServicePreReqEventPath = XPath.newInstance ("/PreReqEvents/Event");

        EmployerDetailsRequiredParamPath = XPath.newInstance ("/AeEventConfiguration/EmployerDetailsRequired");
        crdServiceEmployerDetailsExistPath = XPath.newInstance ("/ds/Ae/EmployerDetailsExist");

        EmployerNamedPersonRequiredParamPath = XPath.newInstance ("/AeEventConfiguration/EmployerNamedPersonRequired");
        crdServiceEmployerAndNamedPersonDetailsExistPath = XPath.newInstance ("/ds/Ae/EmpAndNamedPersonDetailsExist");

        isPastAeHearingParamPath = XPath.newInstance ("/AeEventConfiguration/PreConditionPastAeHearingCheck");
        crdServicePastHearingsExistPath = XPath.newInstance ("/ds/Case/HasPastAeHearings");

        ndrAndPerCheckParamPath = XPath.newInstance ("/AeEventConfiguration/PERDetailsRequired");
        crdServiceNdrAndPerCheckPath = XPath.newInstance ("/ds/Ae/PerAndNdrPeriodsExist");

        outstandingBalanceParamPath = XPath.newInstance ("/AeEventConfiguration/PreConditionAEOutstandingBalanceCheck");
        crdServiceoutstandingBalancePath = XPath.newInstance ("/ds/Ae/OutstandingBalance");

        previousOrderParamPath = XPath.newInstance ("/AeEventConfiguration/PreConditionPreviousOrderCheck");
        crdServicePreviousOrderPath = XPath.newInstance ("/ds/Ae/PreviousOrderExists");

        detailsLOVDomainParamPath = XPath.newInstance ("/AeEventConfiguration/DetailsLOVDomain");
        // crdServiceDetailsLOVDomainPath = XPath.newInstance("/Options/Option");
        crdServiceDetailsLOVDomainPath = XPath.newInstance ("/Options");

        validAeTypesParamPath = XPath.newInstance ("/AeEventConfiguration/ValidAETypes");
        crdServiceValidAeTypesPath = XPath.newInstance ("/AeTypes");

        IssueStageConfigPath = XPath.newInstance ("/AeEventConfiguration/IssueStage");

        proxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getPrettyFormat ());
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

            final Element rootElement = new Element ("AeEventValidationData");
            Element input = null;
            final Element crdElement = new Element ("AeRelatedData");
            Element crdResultElement = null;
            Element crdResultRootElement = null;
            final Element crdLovDetailsElement = new Element ("LOVDetails");
            String aeNumber = null;
            String caseNumber = null;
            String eventIdStr = null;

            // Get the AE Number
            // -----------------
            input = (Element) aeNumberParamPath.selectSingleNode (params);
            aeNumber = input.getText ();

            final Element crdParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (crdParamsElement, "aeNumber", aeNumber);
            // Get the case Number
            // -----------------
            input = (Element) caseNumberParamPath.selectSingleNode (params);
            caseNumber = input.getText ();

            // Get the eventId
            // ---------------
            input = (Element) eventIdParamPath.selectSingleNode (params);
            eventIdStr = input.getText ();
            final Document eventConfigDoc = new AeEventValidationXMLBuilder ().getAeEventConfigurationDoc (eventIdStr);

            rootElement.addContent (((Element) eventConfigDoc.getRootElement ().clone ()).detach ());

            // Get Case related data supporting the configuration for this event
            // -----------------------------------------------------------------

            // LOV list?
            //
            final Element detailsLOVDomainElement =
                    (Element) detailsLOVDomainParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String detailsLOVDomain = detailsLOVDomainElement.getText ();

            if ( !isEmpty (detailsLOVDomain))
            {

                final Element detailsLOVDomainParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (detailsLOVDomainParamsElement, "listType", detailsLOVDomain);
                final String detailsLOVDomainParams = getXMLString (detailsLOVDomainParamsElement);

                crdResultRootElement = proxy.getJDOM (AeEventDefs.AE_EVENT_SERVICE, AeEventDefs.GET_AE_EVENT_LOV_LIST,
                        detailsLOVDomainParams).getRootElement ();

                crdResultElement = (Element) crdServiceDetailsLOVDomainPath.selectSingleNode (crdResultRootElement);
                crdLovDetailsElement.addContent (((Element) crdResultElement.clone ()).detach ());
                crdElement.addContent (((Element) crdLovDetailsElement.clone ()).detach ());
            }

            // previous order?
            //
            final Element previousOrderElement =
                    (Element) previousOrderParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String previousOrder = previousOrderElement.getText ();

            if (previousOrder.equals ("true"))
            {

                final Element previousOrderParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (previousOrderParamsElement, "aeNumber", aeNumber);
                // XMLBuilder.addParam(previousOrderParamsElement, "eventId", eventIdStr);
                final String previousOrderRequiredParams = getXMLString (previousOrderParamsElement);

                crdResultRootElement = proxy.getJDOM (AeEventDefs.AE_EVENT_SERVICE, AeEventDefs.IS_PREVIOUS_ORDER,
                        previousOrderRequiredParams).getRootElement ();

                crdResultElement = (Element) crdServicePreviousOrderPath.selectSingleNode (crdResultRootElement);

                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // Employer details required?
            //
            final Element employerDetailsRequiredElement =
                    (Element) EmployerDetailsRequiredParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String employerDetailsRequired = employerDetailsRequiredElement.getText ();
            final Element employerNamedRequiredElement =
                    (Element) EmployerNamedPersonRequiredParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String employerNamedRequired = employerNamedRequiredElement.getText ();

            if (employerDetailsRequired.equals ("true"))
            {

                if (employerNamedRequired.equals ("false"))
                {
                    // Although employer details are required, the named person isn't
                    final Element employerDetailsRequiredParamsElement = XMLBuilder.getNewParamsElement ();
                    XMLBuilder.addParam (employerDetailsRequiredParamsElement, "aeNumber", aeNumber);
                    final String employerDetailsRequiredParams = getXMLString (employerDetailsRequiredParamsElement);

                    crdResultRootElement =
                            proxy.getJDOM (AeDefs.AE_SERVICE, AeDefs.IS_EMPLOYER_DETAIL, employerDetailsRequiredParams)
                                    .getRootElement ();

                    crdResultElement =
                            (Element) crdServiceEmployerDetailsExistPath.selectSingleNode (crdResultRootElement);

                    crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
                }
                else
                {
                    // Employer details (including the named person) are required
                    // Although employer details are required, the named person isn't
                    final Element employerAndNamedPersonDetailsRequiredParamsElement =
                            XMLBuilder.getNewParamsElement ();
                    XMLBuilder.addParam (employerAndNamedPersonDetailsRequiredParamsElement, "aeNumber", aeNumber);
                    final String employerAndNamedPersonDetailsRequiredParams =
                            getXMLString (employerAndNamedPersonDetailsRequiredParamsElement);

                    crdResultRootElement = proxy.getJDOM (AeDefs.AE_SERVICE, AeDefs.IS_EMPLOYER_AND_NAMED_PERSON_DETAIL,
                            employerAndNamedPersonDetailsRequiredParams).getRootElement ();

                    crdResultElement = (Element) crdServiceEmployerAndNamedPersonDetailsExistPath
                            .selectSingleNode (crdResultRootElement);

                    crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
                }

            }

            // DO hearings in the past exist which are of an AE type?
            //
            final Element aePastHearingRequiredElement =
                    (Element) isPastAeHearingParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String aePastHearingRequired = aePastHearingRequiredElement.getText ();

            if (aePastHearingRequired.equals ("true"))
            {

                final Element pastHearingCheckParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (pastHearingCheckParamsElement, "caseNumber", caseNumber);
                final String pastHearingCheckRequiredParams = getXMLString (pastHearingCheckParamsElement);

                crdResultRootElement = proxy.getJDOM (HearingDefs.HEARING_SERVICE, HearingDefs.IS_PAST_AE_HEARINGS,
                        pastHearingCheckRequiredParams).getRootElement ();

                crdResultElement = (Element) crdServicePastHearingsExistPath.selectSingleNode (crdResultRootElement);
                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // DO hearings in the future exist which are of an AE type?
            //
            final Element aeFutureHearingRequiredElement =
                    (Element) isFutureAeHearingParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String aeFutureHearingRequired = aeFutureHearingRequiredElement.getText ();

            if (aeFutureHearingRequired.equals ("true"))
            {

                final Element futureHearingCheckParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (futureHearingCheckParamsElement, "caseNumber", caseNumber);
                final String futureHearingCheckRequiredParams = getXMLString (futureHearingCheckParamsElement);

                crdResultRootElement = proxy.getJDOM (HearingDefs.HEARING_SERVICE, HearingDefs.IS_FUTURE_AE_HEARINGS,
                        futureHearingCheckRequiredParams).getRootElement ();

                crdResultElement = (Element) crdServiceFutureHearingsExistPath.selectSingleNode (crdResultRootElement);
                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // DO ANY hearings exist which are of an AE type?
            //
            final Element aeHearingRequiredElement =
                    (Element) isAeHearingParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String aeHearingRequired = aeHearingRequiredElement.getText ();

            if (aeHearingRequired.equals ("true"))
            {

                final Element hearingCheckParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (hearingCheckParamsElement, "caseNumber", caseNumber);
                final String hearingCheckRequiredParams = getXMLString (hearingCheckParamsElement);

                crdResultRootElement = proxy
                        .getJDOM (HearingDefs.HEARING_SERVICE, HearingDefs.IS_AE_HEARINGS, hearingCheckRequiredParams)
                        .getRootElement ();

                crdResultElement = (Element) crdServiceHearingsExistPath.selectSingleNode (crdResultRootElement);
                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // NDR and PER periods defined?
            //
            final Element ndrAndPerCheckElement =
                    (Element) ndrAndPerCheckParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String ndrAndPerCheck = ndrAndPerCheckElement.getText ();

            if (ndrAndPerCheck.equals ("true"))
            {

                final Element ndrAndPerCheckParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (ndrAndPerCheckParamsElement, "aeNumber", aeNumber);
                final String ndrAndPerCheckParams = getXMLString (ndrAndPerCheckParamsElement);

                crdResultRootElement = proxy.getJDOM (AeDefs.AE_SERVICE, AeDefs.IS_PER_AND_NDR, ndrAndPerCheckParams)
                        .getRootElement ();

                crdResultElement = (Element) crdServiceNdrAndPerCheckPath.selectSingleNode (crdResultRootElement);

                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // outstanding balance
            //

            final Element outstandingBalanceElement =
                    (Element) outstandingBalanceParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String outstandingBalance = outstandingBalanceElement.getText ();

            if (outstandingBalance.equals ("true"))
            {

                final Element outstandingBalanceParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (outstandingBalanceParamsElement, "aeNumber", aeNumber);
                final String ndrAndPerCheckParams = getXMLString (outstandingBalanceParamsElement);

                crdResultRootElement = proxy.getJDOM (AeDefs.AE_SERVICE, AeDefs.GET_AE_BALANCE, ndrAndPerCheckParams)
                        .getRootElement ();

                crdResultElement = (Element) crdServiceoutstandingBalancePath.selectSingleNode (crdResultRootElement);

                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // Is an AE Hearing required?
            //
            /* Test now included with Future Hearing check
             * Element aeHearingRequiredElement = (Element)
             * isPastAeHearingParamPath.selectSingleNode(eventConfigDoc.getRootElement());
             * String aeHearingRequired = aeHearingRequiredElement.getText();
             * if (aeHearingRequired.equals("true")){
             * 
             * 
             * Element aeHearingRequiredParamsElement = XMLBuilder.getNewParamsElement();
             * XMLBuilder.addParam(aeHearingRequiredParamsElement, "caseNumber", caseNumber);
             * String aeHearingRequiredParamsParams = getXMLString(aeHearingRequiredParamsElement);
             * 
             * crdResultRootElement = proxy.getJDOM(HearingDefs.HEARING_SERVICE,
             * HearingDefs.IS_HEARING_FOR_CASE,
             * aeHearingRequiredParamsParams ).getRootElement();
             * 
             * crdResultElement = (Element) crdServiceAEHearingTypeExistPath.selectSingleNode(crdResultRootElement);
             * 
             * crdElement.addContent(((Element)crdResultElement.clone()).detach());
             * } */

            // List of associated valid AE Types?
            //
            final Element validAeTypesElement =
                    (Element) validAeTypesParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String validAeTypes = validAeTypesElement.getText ();
            if (validAeTypes.equals ("true"))
            {

                final Element validAeTypesParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (validAeTypesParamsElement, "eventId", eventIdStr);
                final String validAeTypesParams = getXMLString (validAeTypesParamsElement);

                crdResultRootElement = proxy.getJDOM (AeEventDefs.AE_EVENT_SERVICE,
                        AeEventDefs.GET_AE_EVENT_AE_TYPE_LIST, validAeTypesParams).getRootElement ();

                crdResultElement = (Element) crdServiceValidAeTypesPath.selectSingleNode (crdResultRootElement);

                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // Issue details required??
            final Element issueDetailsElement =
                    (Element) IssueStageConfigPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String issueDetails = issueDetailsElement.getText ();
            if (issueDetails.equals ("true"))
            {
                crdElement.addContent (((Element) mGetIssueDetails (aeNumber, eventIdStr).clone ()).detach ());
            }

            // Check for pre-requisite events
            //
            final Element eventsMustExistElement =
                    (Element) eventsMustExistParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String eventsMustExist = eventsMustExistElement.getText ();

            if (eventsMustExist.equals ("true"))
            {

                final Element preConditionEventsMustExistElement = new Element ("PreConditionEventsMustExist");

                // Retrieve list of pre-requisite events
                final Element preReqEventsListParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (preReqEventsListParamsElement, "eventId", eventIdStr);

                crdResultRootElement =
                        proxy.getJDOM (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.GET_PRE_REQ_EVENT_LIST,
                                getXMLString (preReqEventsListParamsElement)).getRootElement ();

                final List<Element> preReqEventList = crdServicePreReqEventPath.selectNodes (crdResultRootElement);
                /* loop thru the list of events returned, returning a list of associated
                 * parties in circumstances where the pre-requisite event is flagged as being
                 * party-dependant. NOTE: at the moment only defendant dependancies are supported
                 * in the database. */

                Element preReqEventElement = null;
                String preReqEventId;
                final XPath crdServiceEventsMustExistOnAeParamPath = XPath.newInstance ("/PreRequisiteEvents/Event");
                final Iterator<Element> it = preReqEventList.iterator ();
                while (it.hasNext ())
                {
                    preReqEventElement = (Element) it.next ();

                    final String[] preReqEventNodes =
                            {"PreReqEventId1", "PreReqEventId2", "PreReqEventId3", "PreReqEventId4"};
                    for (int nx = 0; nx < preReqEventNodes.length; nx++)
                    {
                        preReqEventId = preReqEventElement.getChild (preReqEventNodes[nx]).getText ();
                        if ( !isEmpty (preReqEventId))
                        {

                            final Element eventExistsParamsElement = XMLBuilder.getNewParamsElement ();
                            XMLBuilder.addParam (eventExistsParamsElement, "aeNumber", aeNumber);
                            XMLBuilder.addParam (eventExistsParamsElement, "eventId", preReqEventId);

                            crdResultRootElement =
                                    proxy.getJDOM (AeEventDefs.AE_EVENT_SERVICE, AeEventDefs.GET_PRE_REQ_AE_EVENT,
                                            getXMLString (eventExistsParamsElement)).getRootElement ();

                            final List<Element> eventList =
                                    crdServiceEventsMustExistOnAeParamPath.selectNodes (crdResultRootElement);

                            /* now loop thru the list of events returned adding them to the Event node returned
                             * by the service */

                            Element eventElement = null;

                            final Iterator<Element> eit = eventList.iterator ();
                            boolean eventFound = false;
                            while (eit.hasNext ())
                            {
                                eventFound = true;
                                eventElement = (Element) eit.next ();
                                preConditionEventsMustExistElement
                                        .addContent (((Element) eventElement.clone ()).detach ());
                            }

                            if ( !eventFound)
                            {
                                final Element notFoundEventElement = new Element ("Event");
                                XMLBuilder.add (notFoundEventElement, "EventId", preReqEventId);
                                XMLBuilder.add (notFoundEventElement, "RecordedAgainstAe", "false");
                                preConditionEventsMustExistElement
                                        .addContent ((Element) notFoundEventElement.clone ());
                            }

                        }
                    }

                }
                crdElement.addContent (((Element) preConditionEventsMustExistElement.clone ()).detach ());
            }

            // Add CaseRelatedData to the root element
            // ---------------------------------------

            rootElement.addContent (((Element) crdElement.clone ()).detach ());

            // Get the EditDetails associated with the Standard Event and attach to the AeEventConfiguration
            // ---------------------------------------------------------------------------------------------

            final String editDetail = getEditDetails (eventIdStr);

            final Document finalDoc = new Document ();
            finalDoc.addContent (((Element) rootElement.clone ()).detach ());

            final Element configElement = (Element) configPath.selectSingleNode (finalDoc.getRootElement ());
            XMLBuilder.add (configElement, "EditDetails", editDetail);

            final String s = getXMLString (finalDoc.getRootElement ());
            log.debug ("GetAeEventValidationData Response: " + s);
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
        XMLBuilder.addParam (paramsElement, "aeNumber", pCoNumber);
        XMLBuilder.addParam (paramsElement, "eventId", pEventId);

        crdResultRootElement = proxy.getJDOM (AeEventDefs.AE_EVENT_SERVICE, AeEventDefs.GET_AE_EVENT_ISSUE_DETAIL,
                getXMLString (paramsElement)).getRootElement ();

        final Element detailsElement = new Element ("IssueDetail");

        detailsElement.addContent (((Element) crdResultRootElement.clone ()).detach ());

        return detailsElement;
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * (non-Javadoc)
     * Utility function to check for null string.
     *
     * @param s the s
     * @return true, if is empty
     */
    private boolean isEmpty (final String s)
    {
        return s == null || "".equals (s);
    }

    /**
     * (non-Javadoc)
     * Utility function to convert XML to string.
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
     * Call service to get event details.
     *
     * @param pStandardEventId the standard event id
     * @return the edits the details
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String getEditDetails (final String pStandardEventId) throws BusinessException, SystemException
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
