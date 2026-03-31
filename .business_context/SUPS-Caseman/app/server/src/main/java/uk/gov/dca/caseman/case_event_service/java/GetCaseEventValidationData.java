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
package uk.gov.dca.caseman.case_event_service.java;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_service.java.CaseDefs;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.PartyKeyXMLTransformer;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Class: GetCaseEventValidationData.java
 * 
 * @author Chris Hutt
 *         Created: 03-Feb-2005
 *         Description:
 *         Return the rules associated with the specified event along with associated case-specific configuration data
 *         which is retrieved via service calls to the database.
 *
 *         Change History:
 *         1. Chris Hutt 7th June 2005 (Release 3 & 4 work)
 *         a. Pre-Requisite events retrieved from database via CaseEvent.getPreReqEventList call
 *         b. CaseEvent.getCaseEventCaseTypeDetailsList called to support events where a details list
 *         is dependant upon the associated CaseType
 * 
 *         2. Chris Hutt 6th July 2006 (defect 954)
 *         LOVDetailsMandatory should be set to true in circumstances where an associated
 *         CASE_TYPE_DETAILS is returned by the CaseEvent.getCaseEventCaseTypeDetailsList service
 * 
 *         3. Chris Hutt 29 Sept 2005
 *         Judgments for redetermination added
 * 
 *         4. Chris Hutt 15 Nov 2005
 *         CCBC extras added - CCBCPreConditionWarrantMustExistAgainstSubject
 *         - PreConditionJudgmentSuitableForAdmissionOrDefence
 * 
 *         5. Chris Hutt 19 jan 06
 *         Insolvency Cases added - PreConditionEventMustNotExist
 *         - PreConditionPartyMustExist
 *         - List of Instigators associated with a 659 event
 * 
 *         6. Chris Hutt 24/1/06
 *         AeExistenceCheck added - case event 10
 * 
 *         7. Chris Hutt 4.4.06
 *         defect uct defects 448 etc
 *         InstigatorCanBeSubject node added
 * 
 *         8. Chris Hutt 18.4.06
 *         defect uct 365. CCBC requirement. Instigator no necessarily the same as non-CCBC
 * 
 *         9. Chris Hutt 02.05.2006
 *         defect 3225: LOVdetails test wrong
 * 
 *         10. Chris Hutt 07.05.2006
 *         defect 3279: LOVdetails test not working for event 25 (3225 fix too stringent)
 * 
 *         11. Paul Roberts 25.07.2006
 *         change to use SUPSLogFactory rather than LogFactory.
 * 
 *         12. 16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 *         13. Chris Hutt 30.08.2006
 *         TD4812:For case types RENT POSSN SOC LLORD, CH RENT PSN SOC LLRD and QB RENT PSN SOC LLRD, LOV lookup
 *         returned for events 260 and 270.
 * 
 *         14. 19 Mar 2007 Chris Hutt
 *         defect temp_caseman 310 : PreConditionCaseStatusNotStayed changed to PreConditionNotCaseStatusCheck and
 *         associated CaseRelatedData added via a call to CaseEvents.getPreReqNotCaseStatusList
 * 
 *         15. 04/04/2007 Chris Hutt: TD6160 - CCBCSubjectType added and used to popluate SubjectType for CCBC cases
 * 
 *         16. 10/04/2007 Chris Hutt: TD6162 - CCBCWordProcessingCall value should overwrite ordProcessingCall.
 *         Will get around the problem of the 'produce output' checkbox being used
 *         when non-ccbc Caseman has word processing but ccbc does not
 * 
 *         17. 01/05/2007 Chris Hutt: TD1368 - CCBCCreateCertOfSatisfaction now referenced to determine whether
 *         service getJudgmentFor600 should be run and the output appended to the
 *         CaseRelatedData
 * 
 *         18. 05/07/2007 Chris Hutt TD UCTGroup2 1455:
 *         CCBC specific. If CCBCSetCaseStatusIfCaseOr1Def = true then return list of all
 *         parties on case with same event recorded against them.
 */
public class GetCaseEventValidationData extends AbstractCasemanCustomProcessor
{
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (GetCaseEventValidationData.class);

    /**
     * The judgement service name.
     */
    public static final String JUDGMENT_SERVICE = "ejb/JudgmentServiceLocal";

    /**
     * The get parties with active judgement method name.
     */
    public static final String GET_PARTIES_WITH_ACTIVE_JUDGMENT = "getPartiesWithActiveJudgmentLocal";
    /**
     * The get parties with judgement for redetermination method name.
     */
    public static final String GET_PARTIES_WITH_JUDGMENT_FOR_REDETERMINATION =
            "getPartiesWithJudgmentForRedeterminationLocal";
    /**
     * The get parties with judgement for admission or defence method name.
     */
    public static final String GET_PARTIES_WITH_JUDGMENT_FOR_ADMISSION_OR_DEFENCE =
            "getPartiesWithJudgmentForAdmissionOrDefenceLocal";

    /**
     * Get judgment and parties for the purposes of checking whether a 600 event can be recorded..
     */
    public static final String GET_JUDGMENT_FOR_600 = "getJudgmentFor600Local";

    /** The case number param path. */
    private final XPath caseNumberParamPath;
    
    /** The event id param path. */
    private final XPath eventIdParamPath;
    
    /** The case court code param path. */
    private final XPath caseCourtCodeParamPath;

    /** The crd service NAJ param path. */
    private final XPath crdServiceNAJParamPath;
    
    /** The crd service ADJ param path. */
    private final XPath crdServiceADJParamPath;
    
    /** The crd re determination judgment param path. */
    private final XPath crdReDeterminationJudgmentParamPath;
    
    /** The crd service events must exist param path. */
    private final XPath crdServiceEventsMustExistParamPath;
    
    /** The crd service events must exist on case param path. */
    private final XPath crdServiceEventsMustExistOnCaseParamPath;
    
    /** The crd service BJNS param path. */
    private final XPath crdServiceBJNSParamPath;
    
    /** The crd service DOSC param path. */
    private final XPath crdServiceDOSCParamPath;
    
    /** The crd service DCD param path. */
    private final XPath crdServiceDCDParamPath;
    
    /** The crd service case param path. */
    private final XPath crdServiceCaseParamPath;
    
    /** The crd service instigators path. */
    private final XPath crdServiceInstigatorsPath;
    
    /** The crd service ae existence check path. */
    private final XPath crdServiceAeExistenceCheckPath;
    
    /** The crd service get pre req not case status path. */
    private final XPath crdServiceGetPreReqNotCaseStatusPath;
    
    /** The crd service 600 param path. */
    private final XPath crdService600ParamPath;
    
    /** The crd jurisdiction param path. */
    private final XPath crdJurisdictionParamPath;

    /** The active judgment param path. */
    private final XPath activeJudgmentParamPath;
    
    /** The admit defence judgment param path. */
    private final XPath admitDefenceJudgmentParamPath;
    
    /** The re determination judgment param path. */
    private final XPath reDeterminationJudgmentParamPath;
    
    /** The events must exist param path. */
    private final XPath eventsMustExistParamPath;
    
    /** The bjns param path. */
    private final XPath bjnsParamPath;
    
    /** The dosc param path. */
    private final XPath doscParamPath;
    
    /** The dcd param path. */
    private final XPath dcdParamPath;
    
    /** The lov details param path. */
    private final XPath lovDetailsParamPath;
    
    /** The lov BMS task param path. */
    private final XPath lovBMSTaskParamPath;
    
    /** The lov stats mod param path. */
    private final XPath lovStatsModParamPath;
    
    /** The crd service lov details param path. */
    private final XPath crdServiceLovDetailsParamPath;
    
    /** The crd service lov details case type param path. */
    private final XPath crdServiceLovDetailsCaseTypeParamPath;
    
    /** The crd service lov BMS task param path. */
    private final XPath crdServiceLovBMSTaskParamPath;
    
    /** The crd service stats mod param path. */
    private final XPath crdServiceStatsModParamPath;
    
    /** The crd service case type path. */
    private final XPath crdServiceCaseTypePath;
    
    /** The crd service pre req event path. */
    private final XPath crdServicePreReqEventPath;
    
    /** The event must not exist param path. */
    private final XPath eventMustNotExistParamPath;
    
    /** The Instigator type param path. */
    private final XPath InstigatorTypeParamPath;
    
    /** The CCBC instigator type param path. */
    private final XPath CCBCInstigatorTypeParamPath;
    
    /** The Subject type param path. */
    private final XPath SubjectTypeParamPath;
    
    /** The CCBC subject type param path. */
    private final XPath CCBCSubjectTypeParamPath;
    
    /** The Ae existence check param path. */
    private final XPath AeExistenceCheckParamPath;
    
    /** The Pre req not case status param path. */
    private final XPath PreReqNotCaseStatusParamPath;
    
    /** The CCBC word processing call param path. */
    private final XPath CCBCWordProcessingCallParamPath;
    
    /** The Word processing call param path. */
    private final XPath WordProcessingCallParamPath;
    
    /** The CCBC create cert of satisfaction param path. */
    private final XPath CCBCCreateCertOfSatisfactionParamPath;
    
    /** The CCBC set case status if case or 1 def param path. */
    private final XPath CCBCSetCaseStatusIfCaseOr1DefParamPath;
    
    /** The warrant must exist param path. */
    private final XPath warrantMustExistParamPath;
    
    /** The crd service parties with warrants against path. */
    private final XPath crdServicePartiesWithWarrantsAgainstPath;
    
    /** The crd service event parties param path. */
    private final XPath crdServiceEventPartiesParamPath;
    
    /** The family enforcement only path. */
    private final XPath familyEnforcementOnlyPath;

    /** The Config LOV details domain xpath. */
    private final String ConfigLOVDetailsDomainXpath;
    
    /** The Config LOV details mandatory xpath. */
    private final String ConfigLOVDetailsMandatoryXpath;
    
    /** The Config stats mod LOV domain xpath. */
    private final String ConfigStatsModLOVDomainXpath;

    /** The clear LOV details domain. */
    private boolean clearLOVDetailsDomain;
    
    /** The updated to true LOV details mandatory. */
    private boolean updatedToTrueLOVDetailsMandatory;
    
    /** The clear BMS task LOV domain. */
    private boolean clearBMSTaskLOVDomain;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public GetCaseEventValidationData () throws JDOMException
    {

        eventIdParamPath = XPath.newInstance ("params/param[@name='eventId']");
        caseNumberParamPath = XPath.newInstance ("params/param[@name='caseNumber']");
        caseCourtCodeParamPath = XPath.newInstance ("params/param[@name='caseCourtCode']");

        InstigatorTypeParamPath = XPath.newInstance ("/CaseEventConfiguration/InstigatorType");
        CCBCInstigatorTypeParamPath = XPath.newInstance ("/CaseEventConfiguration/CCBCInstigatorType");
        SubjectTypeParamPath = XPath.newInstance ("/CaseEventConfiguration/SubjectType");
        CCBCSubjectTypeParamPath = XPath.newInstance ("/CaseEventConfiguration/CCBCSubjectType");
        eventMustNotExistParamPath = XPath.newInstance ("/CaseEventConfiguration/PreConditionEventMustNotExist");
        reDeterminationJudgmentParamPath =
                XPath.newInstance ("/CaseEventConfiguration/PreConditionJudgmentForRedeterminationMustExist");
        activeJudgmentParamPath = XPath.newInstance ("/CaseEventConfiguration/PreConditionActiveJudgment");
        admitDefenceJudgmentParamPath =
                XPath.newInstance ("/CaseEventConfiguration/PreConditionJudgmentSuitableForAdmissionOrDefence");
        eventsMustExistParamPath = XPath.newInstance ("/CaseEventConfiguration/PreConditionEventMustExist");
        bjnsParamPath = XPath.newInstance ("/CaseEventConfiguration/PreConditionBarOnJudgmentNotSet");
        doscParamPath = XPath.newInstance ("/CaseEventConfiguration/PreConditionDateOfServiceCheck");
        dcdParamPath = XPath.newInstance ("/CaseEventConfiguration/DisplayClaimDetails");
        lovDetailsParamPath = XPath.newInstance ("/CaseEventConfiguration/LOVDetailsDomain");
        lovBMSTaskParamPath = XPath.newInstance ("/CaseEventConfiguration/BMSTaskLOVDomain");
        lovStatsModParamPath = XPath.newInstance ("/CaseEventConfiguration/StatsModLOVDomain");
        warrantMustExistParamPath =
                XPath.newInstance ("/CaseEventConfiguration/CCBCPreConditionWarrantMustExistAgainstSubject");
        AeExistenceCheckParamPath = XPath.newInstance ("/CaseEventConfiguration/AeExistenceCheck");
        PreReqNotCaseStatusParamPath = XPath.newInstance ("/CaseEventConfiguration/PreConditionNotCaseStatusCheck");
        WordProcessingCallParamPath = XPath.newInstance ("/CaseEventConfiguration/WordProcessingCall");
        CCBCWordProcessingCallParamPath = XPath.newInstance ("/CaseEventConfiguration/CCBCWordProcessingCall");
        CCBCCreateCertOfSatisfactionParamPath =
                XPath.newInstance ("/CaseEventConfiguration/CCBCCreateCertOfSatisfaction");
        CCBCSetCaseStatusIfCaseOr1DefParamPath =
                XPath.newInstance ("/CaseEventConfiguration/CCBCSetCaseStatusIfCaseOr1Def");
        familyEnforcementOnlyPath = XPath.newInstance ("/CaseEventConfiguration/PreConditionFamilyEnforcementOnly");

        crdServiceNAJParamPath = XPath.newInstance ("//Judgments");
        crdServiceADJParamPath = XPath.newInstance ("/Parties");
        crdReDeterminationJudgmentParamPath = XPath.newInstance ("//JudgmentsForRedetermination");
        crdServiceEventsMustExistParamPath = XPath.newInstance ("/Case/Parties");
        crdServiceEventsMustExistOnCaseParamPath = XPath.newInstance ("/ds/Case/HasEvents");
        crdServiceBJNSParamPath = XPath.newInstance ("/Case/Parties");
        crdServiceDOSCParamPath = XPath.newInstance ("/Case/Parties");
        crdServiceDCDParamPath = XPath.newInstance ("/Case/DetailsOfClaim");
        crdJurisdictionParamPath = XPath.newInstance ("/ds/Case/Jurisdiction");
        crdServiceCaseParamPath = XPath.newInstance ("/Case");
        crdServiceLovDetailsParamPath = XPath.newInstance ("/CaseEvent/Options");
        crdServiceLovDetailsCaseTypeParamPath = XPath.newInstance ("/Options");
        crdServiceLovBMSTaskParamPath = XPath.newInstance ("/CaseEvent/Options");
        crdServiceStatsModParamPath = XPath.newInstance ("/CaseEvent/Options");
        crdServicePartiesWithWarrantsAgainstPath = XPath.newInstance ("/Parties");
        crdServiceInstigatorsPath = XPath.newInstance ("/Parties");
        crdServiceCaseTypePath = XPath.newInstance ("/Case/CaseType");
        crdServicePreReqEventPath = XPath.newInstance ("/PreReqEvents/Event");
        crdServiceAeExistenceCheckPath = XPath.newInstance ("/ds/Case/AeExists");
        crdServiceGetPreReqNotCaseStatusPath = XPath.newInstance ("/PreRequisiteNotCaseStatuses");
        crdService600ParamPath = XPath.newInstance ("//Judgments");
        crdServiceEventPartiesParamPath = XPath.newInstance ("//PartiesWithSameEvent");

        ConfigLOVDetailsDomainXpath = "/CaseEventValidationData/CaseEventConfiguration/LOVDetailsDomain";
        ConfigLOVDetailsMandatoryXpath = "/CaseEventValidationData/CaseEventConfiguration/LOVDetailsMandatory";
        ConfigStatsModLOVDomainXpath = "/CaseEventValidationData/CaseEventConfiguration/StatsModLOVDomain";

        clearLOVDetailsDomain = false;
        updatedToTrueLOVDetailsMandatory = false;
        clearBMSTaskLOVDomain = false;
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param pLog the log
     * @return The processed document.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log pLog) throws SystemException, BusinessException
    {
        final Document finalDoc = new Document ();

        try
        {

            final Element rootElement = new Element ("CaseEventValidationData");
            Element input = null;
            final Element crdElement = new Element ("CaseRelatedData");
            Element crdResultElement = null;
            Element crdResultRootElement = null;
            final Element crdActiveJudgmentElement = new Element ("ActiveJudgments");
            final Element crdAdmissionDefenceJudgmentElement = new Element ("JudgmentsSuitableForAdmissionDefence");
            final Element crdBjnsElement = new Element ("BarOnJudgmentNotSet");
            final Element crdDoscElement = new Element ("DateOfServiceCheck");
            Element crdCaseElement = new Element ("Case");
            final Element crdLovDetailsElement = new Element ("LOVDetails");
            final Element crdLovBMSTaskElement = new Element ("BMSTaskLOV");
            final Element crdLovStatsModElement = new Element ("StatsModLOV");
            final Element warrantAgainstElement = new Element ("WarrantAgainst");
            final Element crd659InstigatorsElement = new Element ("Event659Instigators");
            Element InstigatorElement = null;
            Element SubjectElement = null;
            Element WordProcessingCallElement = null;
            final Element CCBCCertOfSatisElement = new Element ("CCBCProduceCertOfSatisfaction");

            String caseNumber = null;
            String eventIdStr = null;
            String caseCourtCode = null;
            String CCBCInstigatorType = null;
            String CCBCSubjectType = null;
            String CCBCWordProcessingCall = null;

            input = (Element) caseNumberParamPath.selectSingleNode (params);
            caseNumber = input.getText ();

            final Element crdParamsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (crdParamsElement, "caseNumber", caseNumber);
            final Document crdParams = crdParamsElement.getDocument ();

            // Get the eventId
            // ---------------

            input = (Element) eventIdParamPath.selectSingleNode (params);
            eventIdStr = input.getText ();
            input = (Element) caseCourtCodeParamPath.selectSingleNode (params);
            caseCourtCode = input.getText ();

            // Get the rules associated with the specified event
            // -------------------------------------------------

            final Document eventConfigDoc =
                    new CaseEventValidationXMLBuilder ().getCaseEventConfigurationDoc (eventIdStr);

            // If a CCBC case the default instigator, subject and word processing rules need to be overriden
            if (caseCourtCode.equals ("335"))
            {
                CCBCSubjectType =
                        ((Element) CCBCSubjectTypeParamPath.selectSingleNode (eventConfigDoc.getRootElement ()))
                                .getText ();
                SubjectElement = (Element) SubjectTypeParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
                SubjectElement.setText (CCBCSubjectType);

                CCBCInstigatorType =
                        ((Element) CCBCInstigatorTypeParamPath.selectSingleNode (eventConfigDoc.getRootElement ()))
                                .getText ();
                InstigatorElement =
                        (Element) InstigatorTypeParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
                InstigatorElement.setText (CCBCInstigatorType);

                CCBCWordProcessingCall =
                        ((Element) CCBCWordProcessingCallParamPath.selectSingleNode (eventConfigDoc.getRootElement ()))
                                .getText ();
                WordProcessingCallElement =
                        (Element) WordProcessingCallParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
                WordProcessingCallElement.setText (CCBCWordProcessingCall);
            }

            rootElement.addContent (((Element) eventConfigDoc.getRootElement ().clone ()).detach ());

            // Certificate of Satisfaction (a CCBC specific) ?
            // -----------------------------------------------

            final Element CCBCCreateCertOfSatisfactionElement =
                    (Element) CCBCCreateCertOfSatisfactionParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String createCertOfSatisfaction = CCBCCreateCertOfSatisfactionElement.getText ();
            if (null != createCertOfSatisfaction && createCertOfSatisfaction.equals ("true"))
            {
                crdResultRootElement =
                        invokeLocalServiceProxy (JUDGMENT_SERVICE, GET_JUDGMENT_FOR_600, crdParams).getRootElement ();
                crdResultElement = (Element) crdService600ParamPath.selectSingleNode (crdResultRootElement);
                CCBCCertOfSatisElement.addContent (((Element) crdResultElement.clone ()).detach ());
                crdElement.addContent (((Element) CCBCCertOfSatisElement.clone ()).detach ());
            }

            // Instigators needed
            // ------------------
            final Element instigatorElement =
                    (Element) InstigatorTypeParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String instigator = instigatorElement.getText ();
            if (instigator.equals ("CREX659INS_T7"))
            {
                final Element getInstigatorElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (getInstigatorElement, "caseNumber", caseNumber);
                XMLBuilder.addParam (getInstigatorElement, "eventId", eventIdStr);

                crdResultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                        CaseEventDefs.GET_CASE_EVENT_INSTIGATORS, getInstigatorElement.getDocument ())
                                .getRootElement ();

                crdResultElement = (Element) crdServiceInstigatorsPath.selectSingleNode (crdResultRootElement);
                crd659InstigatorsElement.addContent (((Element) crdResultElement.clone ()).detach ());
                crdElement.addContent (((Element) crd659InstigatorsElement.clone ()).detach ());

            }

            // CCBC - other parties with same event will be required for client validation
            // where CCBCSetCaseStatusIfCaseOr1Def is true
            // ------------------------------------------------------------------------------

            if (caseCourtCode.equals ("335"))
            {
                final Element setCaseStatusIfCaseOr1DefElement = (Element) CCBCSetCaseStatusIfCaseOr1DefParamPath
                        .selectSingleNode (eventConfigDoc.getRootElement ());
                final String setCaseStatusIfCaseOr1Def = setCaseStatusIfCaseOr1DefElement.getText ();
                if (null != setCaseStatusIfCaseOr1Def && setCaseStatusIfCaseOr1Def.equals ("true"))
                {
                    final Element getEventPartiesElement = XMLBuilder.getNewParamsElement (new Document ());
                    XMLBuilder.addParam (getEventPartiesElement, "caseNumber", caseNumber);
                    XMLBuilder.addParam (getEventPartiesElement, "eventId", eventIdStr);

                    crdResultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                            CaseEventDefs.GET_DISTINCT_PARTIES_WITH_STD_EVENT_LIST,
                            getEventPartiesElement.getDocument ()).getRootElement ();
                    crdResultElement =
                            (Element) crdServiceEventPartiesParamPath.selectSingleNode (crdResultRootElement);
                    crdElement.addContent (((Element) crdResultElement.clone ()).detach ());

                }
            }

            // Get Case related data supporting the configuration for this event
            // -----------------------------------------------------------------
            // active judgment
            final Element activeJudgmentElement =
                    (Element) activeJudgmentParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String activeJudgmentRule = activeJudgmentElement.getText ();
            if (null != activeJudgmentRule && (activeJudgmentRule.equals ("NOT_REQUIRED") ||
                    activeJudgmentRule.equals ("REQUIRED") || activeJudgmentRule.equals ("CREATED")))
            {
                crdResultRootElement =
                        invokeLocalServiceProxy (JUDGMENT_SERVICE, GET_PARTIES_WITH_ACTIVE_JUDGMENT, crdParams)
                                .getRootElement ();
                crdResultElement = (Element) crdServiceNAJParamPath.selectSingleNode (crdResultRootElement);
                PartyKeyXMLTransformer.addPartyKey (crdResultElement, "PartyRoleCode", "CasePartyNumber",
                        "SubjectPartyKey");
                crdActiveJudgmentElement.addContent (((Element) crdResultElement.clone ()).detach ());

            }

            crdElement.addContent (((Element) crdActiveJudgmentElement.clone ()).detach ());

            // Judgment suitable for admission / defence to be filed
            final Element admissionDefenceJudgmentElement =
                    (Element) admitDefenceJudgmentParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String admissionDefenceRule = admissionDefenceJudgmentElement.getText ();
            if (null != admissionDefenceRule && admissionDefenceRule.equals ("true"))
            {
                crdResultRootElement = invokeLocalServiceProxy (JUDGMENT_SERVICE,
                        GET_PARTIES_WITH_JUDGMENT_FOR_ADMISSION_OR_DEFENCE, crdParams).getRootElement ();
                crdResultElement = (Element) crdServiceADJParamPath.selectSingleNode (crdResultRootElement);
                crdAdmissionDefenceJudgmentElement.addContent (((Element) crdResultElement.clone ()).detach ());

            }

            crdElement.addContent (((Element) crdAdmissionDefenceJudgmentElement.clone ()).detach ());

            // redetermination judgments
            final Element reDeterminationJudgmentElement =
                    (Element) reDeterminationJudgmentParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String reDeterminationJudgment = reDeterminationJudgmentElement.getText ();
            if (reDeterminationJudgment.equals ("true"))
            {
                crdResultRootElement = invokeLocalServiceProxy (JUDGMENT_SERVICE,
                        GET_PARTIES_WITH_JUDGMENT_FOR_REDETERMINATION, crdParams).getRootElement ();
                crdResultElement =
                        (Element) crdReDeterminationJudgmentParamPath.selectSingleNode (crdResultRootElement);
                PartyKeyXMLTransformer.addPartyKey (crdResultElement, "PartyRoleCode", "CasePartyNumber",
                        "SubjectPartyKey");
                // crdReDeterminationJudgmentElement.addContent(((Element)crdResultElement.clone()).detach());

                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // detail LOV
            final Element lovDetailsElement =
                    (Element) lovDetailsParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String lovDetailsRule = lovDetailsElement.getText ();

            if (lovDetailsRule != null && !lovDetailsRule.equals ("false") && !lovDetailsRule.equals (""))
            {

                if (lovDetailsRule.equals ("CASE_TYPE_DEPENDANT"))
                {

                    // Retrieve the caseType associated with the case.
                    final String caseType = mGetCaseType (caseNumber);

                    // Use the caseType to retrieve any associated LOV
                    final Element lovDetailsParamsElement = XMLBuilder.getNewParamsElement (new Document ());
                    XMLBuilder.addParam (lovDetailsParamsElement, "eventId", eventIdStr);
                    XMLBuilder.addParam (lovDetailsParamsElement, "caseType", caseType);

                    crdResultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                            CaseEventDefs.GET_CASE_EVENT_CASE_TYPE_DETAILS_LIST, lovDetailsParamsElement.getDocument ())
                                    .getRootElement ();

                    // If no LOV associated with the caseType then will need to clear the config setting
                    crdResultElement =
                            (Element) crdServiceLovDetailsCaseTypeParamPath.selectSingleNode (crdResultRootElement);
                    if (crdResultElement.getChild ("Option") == null)
                    {
                        clearLOVDetailsDomain = true;
                    }
                    else
                    {
                        crdLovDetailsElement.addContent (((Element) crdResultElement.clone ()).detach ());
                        updatedToTrueLOVDetailsMandatory = true;
                    }

                }
                else
                {
                    final Element lovDetailsParamsElement = XMLBuilder.getNewParamsElement (new Document ());
                    XMLBuilder.addParam (lovDetailsParamsElement, "rvDomain", lovDetailsRule);

                    crdResultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                            CaseEventDefs.GET_DETAIL_LOV, lovDetailsParamsElement.getDocument ()).getRootElement ();
                    crdResultElement = (Element) crdServiceLovDetailsParamPath.selectSingleNode (crdResultRootElement);
                    crdLovDetailsElement.addContent (((Element) crdResultElement.clone ()).detach ());
                }
            }

            crdElement.addContent (((Element) crdLovDetailsElement.clone ()).detach ());

            // BMS Task LOV
            final Element lovBMSTaskElement =
                    (Element) lovBMSTaskParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String lovBMSTaskRule = lovBMSTaskElement.getText ();
            if (null != lovBMSTaskRule && !lovBMSTaskRule.equals (""))
            {

                final Element lovBMSTaskParamsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (lovBMSTaskParamsElement, "rvDomain", lovBMSTaskRule);

                crdResultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                        CaseEventDefs.GET_BMSTASK_LOV, lovBMSTaskParamsElement.getDocument ()).getRootElement ();
                crdResultElement = (Element) crdServiceLovBMSTaskParamPath.selectSingleNode (crdResultRootElement);
                crdLovBMSTaskElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            crdElement.addContent (((Element) crdLovBMSTaskElement.clone ()).detach ());

            // StatsMod LOV
            final Element lovStatsModElement =
                    (Element) lovStatsModParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String lovStatsModRule = lovStatsModElement.getText ();
            if (null != lovStatsModRule && !lovStatsModRule.equals (""))
            {

                boolean lookupBMS = true;

                // This particular set of lookups are conditional upon the Case Type
                if (lovStatsModRule.equals ("EVT_260_70 DESCRIPTION"))
                {

                    // Retrieve the caseType associated with the case.
                    final String caseType = mGetCaseType (caseNumber);
                    if ( !caseType.equals ("RENT POSSN SOC LLORD") && !caseType.equals ("CH RENT PSN SOC LLRD") &&
                            !caseType.equals ("QB RENT PSN SOC LLRD"))
                    {

                        lookupBMS = false;
                        clearBMSTaskLOVDomain = true;
                    }
                }

                if (lookupBMS)
                {
                    final Element lovStatsModParamsElement = XMLBuilder.getNewParamsElement (new Document ());
                    XMLBuilder.addParam (lovStatsModParamsElement, "rvDomain", lovStatsModRule);

                    crdResultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                            CaseEventDefs.GET_BMSTASK_LOV, lovStatsModParamsElement.getDocument ()).getRootElement ();

                    crdResultElement = (Element) crdServiceStatsModParamPath.selectSingleNode (crdResultRootElement);
                    crdLovStatsModElement.addContent (((Element) crdResultElement.clone ()).detach ());

                    crdElement.addContent (((Element) crdLovStatsModElement.clone ()).detach ());
                }
            }

            // AeExists
            final Element aeExistsElement =
                    (Element) AeExistenceCheckParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String aeExistsRule = aeExistsElement.getText ();
            if (null != aeExistsRule && !aeExistsRule.equals ("false"))
            {

                final Element aeExistsParamsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (aeExistsParamsElement, "caseNumber", caseNumber);

                crdResultRootElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.IS_AE_FOR_CASE,
                        aeExistsParamsElement.getDocument ()).getRootElement ();

                crdResultElement = (Element) crdServiceAeExistenceCheckPath.selectSingleNode (crdResultRootElement);

                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // Check for pre-requisite events
            final Element eventsMustExistElement =
                    (Element) eventsMustExistParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String eventsMustExist = eventsMustExistElement.getText ();

            if ( !isEmpty (eventsMustExist))
            {
                if (eventsMustExist.equals ("true"))
                {

                    final Element preConditionEventsMustExistElement = new Element ("PreConditionEventsMustExist");

                    // Retrieve list of pre-requisite events
                    final Element preReqEventsListParamsElement = XMLBuilder.getNewParamsElement (new Document ());
                    XMLBuilder.addParam (preReqEventsListParamsElement, "eventId", eventIdStr);

                    crdResultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                            CaseEventDefs.GET_PRE_REQ_EVENT_LIST, preReqEventsListParamsElement.getDocument ())
                                    .getRootElement ();

                    final List<Element> preReqEventList = crdServicePreReqEventPath.selectNodes (crdResultRootElement);
                    /* loop thru the list of events returned, returning a list of associated
                     * parties in circumstances where the pre-requisite event is flagged as being
                     * party-dependant. NOTE: at the moment only defendant dependancies are supported
                     * in the database. */

                    Element preReqEventElement = null;
                    String preReqEventId;
                    String preReqEventDefDependant;

                    final Iterator<Element> it = preReqEventList.iterator ();
                    while (it.hasNext ())
                    {
                        preReqEventElement = (Element) it.next ();

                        preReqEventDefDependant = preReqEventElement.getChild ("DefendantDependant").getText ();

                        final String[] preReqEventNodes =
                                {"PreReqEventId1", "PreReqEventId2", "PreReqEventId3", "PreReqEventId4"};

                        for (int nx = 0; nx < preReqEventNodes.length; nx++)
                        {
                            preReqEventId = preReqEventElement.getChild (preReqEventNodes[nx]).getText ();
                            if ( !isEmpty (preReqEventId))
                            {
                                crdResultElement =
                                        getPreReqEventCaseData (caseNumber, preReqEventId, preReqEventDefDependant);
                                preConditionEventsMustExistElement.addContent ((Element) crdResultElement.clone ());
                            }
                        }

                    }

                    crdElement.addContent (((Element) preConditionEventsMustExistElement.clone ()).detach ());
                }
            }

            // Event Must NOT exist
            final Element eventMustNotExistElement =
                    (Element) eventMustNotExistParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String eventThatMustNotExist = eventMustNotExistElement.getText ();
            if ( !eventThatMustNotExist.equals (""))
            {
                final Element preConditionEventNotMustExistElement = new Element ("PreConditionEventsMustNotExist");
                crdResultElement =
                        getPreReqEventCaseData (caseNumber, eventThatMustNotExist, "N" /* Defendant dependant */ );

                preConditionEventNotMustExistElement.addContent ((Element) crdResultElement.clone ());
                crdElement.addContent (((Element) preConditionEventNotMustExistElement.clone ()).detach ());
            }

            // bar on judgment not set
            final Element bjnsElement = (Element) bjnsParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String bjnsRule = bjnsElement.getText ();
            if (null != bjnsRule && bjnsRule.equals ("true"))
            {
                crdResultRootElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE,
                        CaseDefs.GET_DEFS_WITH_NO_JUDGMENT_BAR, crdParams).getRootElement ();
                crdResultElement = (Element) crdServiceBJNSParamPath.selectSingleNode (crdResultRootElement);
                PartyKeyXMLTransformer.addPartyKey (crdResultElement, "PartyRoleCode", "CasePartyNumber",
                        "SubjectPartyKey");
                crdBjnsElement.addContent (((Element) crdResultElement.clone ()).detach ());

            }

            crdElement.addContent (((Element) crdBjnsElement.clone ()).detach ());

            // date of service check
            final Element doscElement = (Element) doscParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String doscRule = doscElement.getText ();
            if (null != doscRule && doscRule.equals ("true"))
            {
                crdResultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                        CaseEventDefs.GET_DEFS_DATE_OF_SERVICE, crdParams).getRootElement ();
                crdResultElement = (Element) crdServiceDOSCParamPath.selectSingleNode (crdResultRootElement);
                PartyKeyXMLTransformer.addPartyKey (crdResultElement, "PartyRoleCode", "CasePartyNumber",
                        "SubjectPartyKey");
                crdDoscElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            crdElement.addContent (((Element) crdDoscElement.clone ()).detach ());

            // case status check (shouldn't be a specified value)
            final Element statChkElement =
                    (Element) PreReqNotCaseStatusParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String statChk = statChkElement.getText ();
            if (null != statChk && statChk.equals ("true"))
            {

                final Element statChkParamsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (statChkParamsElement, "eventId", eventIdStr);

                crdResultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                        CaseEventDefs.GET_PRE_REQ_NOT_CASE_STATUS_LIST, statChkParamsElement.getDocument ())
                                .getRootElement ();

                crdResultElement =
                        (Element) crdServiceGetPreReqNotCaseStatusPath.selectSingleNode (crdResultRootElement);

                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // display claim details
            final Element dcdElement = (Element) dcdParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String dcdRule = dcdElement.getText ();
            if (null != dcdRule && dcdRule.equals ("true"))
            {
                crdResultRootElement =
                        invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CLAIM_DETAILS, crdParams)
                                .getRootElement ();
                crdResultElement = (Element) crdServiceDCDParamPath.selectSingleNode (crdResultRootElement);
                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // get the Case Status
            crdResultRootElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_STATUS, crdParams)
                    .getRootElement ();
            crdCaseElement = (Element) crdServiceCaseParamPath.selectSingleNode (crdResultRootElement);
            crdElement.addContent (((Element) crdCaseElement.clone ()).detach ());

            // List of Case Parties against whom a warrant exists
            final Element warrantMustExistElement =
                    (Element) warrantMustExistParamPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String warrantMustExistRule = warrantMustExistElement.getText ();
            if (null != warrantMustExistRule && warrantMustExistRule.equals ("true"))
            {
                crdResultRootElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE,
                        CaseDefs.GET_CASE_PARTIES_WITH_WARRANT, crdParams).getRootElement ();
                crdResultElement =
                        (Element) crdServicePartiesWithWarrantsAgainstPath.selectSingleNode (crdResultRootElement);
                warrantAgainstElement.addContent (((Element) crdResultElement.clone ()).detach ());
                crdElement.addContent (((Element) warrantAgainstElement.clone ()).detach ());
            }

            // Family Enforcement Only
            final Element feoElement =
                    (Element) familyEnforcementOnlyPath.selectSingleNode (eventConfigDoc.getRootElement ());
            final String feoRule = feoElement.getText ();
            if (null != feoRule && feoRule.equals ("true"))
            {
                crdResultRootElement =
                        invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_JURISDICTION, crdParams)
                                .getRootElement ();
                crdResultElement = (Element) crdJurisdictionParamPath.selectSingleNode (crdResultRootElement);
                crdElement.addContent (((Element) crdResultElement.clone ()).detach ());
            }

            // Add CaseRelatedData to the root element
            // ---------------------------------------

            rootElement.addContent (((Element) crdElement.clone ()).detach ());

            finalDoc.addContent (((Element) rootElement.clone ()).detach ());

            // Do any final adjustments to the configuration settings

            if (clearLOVDetailsDomain)
            {
                XMLBuilder.setXPathValue (finalDoc.getRootElement (), ConfigLOVDetailsDomainXpath, "");
            }

            if (clearBMSTaskLOVDomain)
            {
                XMLBuilder.setXPathValue (finalDoc.getRootElement (), ConfigStatsModLOVDomainXpath, "");
            }

            if (updatedToTrueLOVDetailsMandatory)
            {
                XMLBuilder.setXPathValue (finalDoc.getRootElement (), ConfigLOVDetailsMandatoryXpath, "true");
            }

            if (log.isDebugEnabled ())
            {
                final XMLOutputter out = new XMLOutputter (Format.getPrettyFormat ());
                log.debug ("GetCaseEventValidationData Response: " + out.outputString (finalDoc));
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return finalDoc;
    }

    /**
     * (non-Javadoc)
     * Calls method to retrieve the case type for the case.
     *
     * @param pCaseNumber the case number
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */

    private String mGetCaseType (final String pCaseNumber) throws BusinessException, SystemException
    {
        Element resultRootElement = null;
        Element resultElement = null;
        String caseType = null;
        Element caseTypeElement = null;

        try
        {
            caseTypeElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (caseTypeElement, "caseNumber", pCaseNumber);

            resultRootElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_TYPE_METHOD,
                    caseTypeElement.getDocument ()).getRootElement ();

            resultElement = (Element) crdServiceCaseTypePath.selectSingleNode (resultRootElement);
            caseType = resultElement.getText ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return caseType;
    }

    /**
     * (non-Javadoc)
     * Calls either a service to get defendants with the case or to check there is an event for the case.
     *
     * @param pCaseNumber the case number
     * @param pStandardEventId the standard event id
     * @param pDefDependant the def dependant
     * @return the pre req event case data
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element getPreReqEventCaseData (final String pCaseNumber, final String pStandardEventId,
                                            final String pDefDependant)
        throws BusinessException, SystemException
    {
        Element resultRootElement = null;
        Element resultElement = null;
        Element preReqResultElement = null;
        try
        {

            preReqResultElement = new Element ("Event");
            XMLBuilder.add (preReqResultElement, "EventId", pStandardEventId);

            String partyDependant = null;
            if (pDefDependant.equals ("Y"))
            {
                partyDependant = "DEFENDANT";
            }
            else
            {
                partyDependant = "NO";
            }
            XMLBuilder.add (preReqResultElement, "PartyDependant", partyDependant);

            final Element recordedAgainstElement = new Element ("RecordedAgainst");
            if (partyDependant.equals ("NO"))
            {
                final Element eventExistsParamsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (eventExistsParamsElement, "caseNumber", pCaseNumber);
                XMLBuilder.addParam (eventExistsParamsElement, "eventId", pStandardEventId);

                resultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                        CaseEventDefs.IS_EVENT_FOR_CASE, eventExistsParamsElement.getDocument ()).getRootElement ();

                resultElement = (Element) crdServiceEventsMustExistOnCaseParamPath.selectSingleNode (resultRootElement);

                XMLBuilder.add (recordedAgainstElement, "Case", resultElement.getText ());
            }
            else
            {
                XMLBuilder.add (recordedAgainstElement, "Case", "false");

                final Element eventExistsParamsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (eventExistsParamsElement, "caseNumber", pCaseNumber);
                XMLBuilder.addParam (eventExistsParamsElement, "eventId", pStandardEventId);

                resultRootElement = invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                        CaseEventDefs.GET_DEFS_WITH_EVENT, eventExistsParamsElement.getDocument ()).getRootElement ();

                resultElement = (Element) crdServiceEventsMustExistParamPath.selectSingleNode (resultRootElement);
                PartyKeyXMLTransformer.addPartyKey (resultElement, "PartyRoleCode", "CasePartyNumber",
                        "SubjectPartyKey");

                recordedAgainstElement.addContent (((Element) resultElement.clone ()).detach ());
            }
            preReqResultElement.addContent (((Element) recordedAgainstElement.clone ()).detach ());
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return preReqResultElement;
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
}
