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

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 3-Mar-2005
 * 
 * Change History
 * -------------
 * v1.0 3/3/05 Phil Haferer
 * 
 * v1.1 14/11/05 Chris Hutt
 * CCBC configs added
 * 
 * v1.2 19/1/06 Chris Hutt
 * insolvency Case specific rules introduced
 * 
 * v1.3 24/1/06 Chris Hutt
 * AeExistenceCheck added (event 10)
 * 
 * v1.4 4/4/06 Chris Hutt 4.4.06
 * defect uct defects 448 etc
 * InstigatorCanBeSubject added
 * 
 * V1.5 18/4/06 Chris Hutt
 * defect uct 365.
 * CCBC requirement. Instigator not necessarily the same as non-CCBC
 *
 * 16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * 30 Nov 2005 Chris Hutt
 * defect UCT790: Part20PartiesRequired added
 * 
 * 4 jan 2006 Chris Hutt
 * defect temp_caseman 313 : NoWordProcessingOutputByDefault added
 * 
 * 19 Mar 2007 Chris Hutt
 * defect temp_caseman 310 : PreConditionCaseStatusNotStayed changed to PreConditionNotCaseStatusCheck
 * 
 * 04/04/2007 Chris Hutt: TD6160 - CCBCSubjectType added
 * 
 * 01/05/2007 Chris Hutt: TD1369 - CCBCSpecificEvent added (for events that only enterable in CCBC).
 * 
 * 24 Apr 2007 Chris Hutt
 * defect 6058 - UpdateDeterminationJudgment added
 * 
 * 02/05/2007 Chris Hutt: isCCBCWpOutputImmediate added
 * CCBCCreateCertOfSatisfaction added
 * 
 * 31/05/2007 Chris Hutt: TD6171, UCTGroup2 1290 - <CCBCSetCaseStatusIfCaseOr1Def> added
 * 28/01/2013 Chris Vincent: Trac 4763 (RFS 3719), added handler for setPreConditionTrackMustBeSet validation check.
 * 
 * @author gzyysf
 */
public class CaseEventValidationXMLBuilder
{

    /**
     * The case event service name.
     */
    public static final String CASEEVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * The get instigator label method name.
     */
    public static final String GET_INSTIGATOR_LABEL = "getInstigatorLabelLocal";

    /** The out. */
    private final XMLOutputter out;

    /** The instigator param path. */
    private final XPath instigatorParamPath;

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public CaseEventValidationXMLBuilder () throws JDOMException
    {
        proxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getCompactFormat ());

        instigatorParamPath = XPath.newInstance ("/CaseEvent/Instigator/Label");
    }

    /**
     * Returns the case event config document.
     *
     * @param pStandardEventId The standard event id.
     * @return The config document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public Document getCaseEventConfigurationDoc (final String pStandardEventId)
        throws BusinessException, SystemException
    {
        Document cecDoc = null;
        Element cecElement = null;

        cecDoc = new Document ();
        // Get the configuration for this standard event
        final ICaseEventConfigDO configDO = mGetCaseEventConfigDO (pStandardEventId);

        cecElement = new Element ("CaseEventConfiguration");
        XMLBuilder.add (cecElement, "EventId", pStandardEventId);
        XMLBuilder.add (cecElement, "SubjectType", configDO.getSubjectType ());
        XMLBuilder.add (cecElement, "CCBCSubjectType", configDO.getCCBCSubjectType ());
        XMLBuilder.add (cecElement, "InstigatorType", configDO.getInstigatorType ());
        XMLBuilder.add (cecElement, "InstigatorMultiSelect", mConvertBoolean (configDO.isInstigatorMultiSelect ()));
        XMLBuilder.add (cecElement, "InstigatorLabel",
                getInstigatorLabel (pStandardEventId, configDO.getInstigatorType ()));
        XMLBuilder.add (cecElement, "PreConditionActiveJudgment", configDO.getPreConditionActiveJudgment ());
        XMLBuilder.add (cecElement, "PreConditionEventMustExist",
                String.valueOf (configDO.getPreConditionEventMustExist ()));
        XMLBuilder.add (cecElement, "PreConditionBarOnJudgmentNotSet",
                mConvertBoolean (configDO.isPreConditionBarOnJudgmentNotSet ()));
        XMLBuilder.add (cecElement, "PreConditionDateOfServiceCheck",
                mConvertBoolean (configDO.isPreConditionDateOfServiceCheck ()));
        XMLBuilder.add (cecElement, "DisplayClaimDetails", mConvertBoolean (configDO.isDisplayClaimDetails ()));
        XMLBuilder.add (cecElement, "LOVDetailsDomain", configDO.getDetailsLOVDomain ());
        XMLBuilder.add (cecElement, "LOVDetailsMandatory", mConvertBoolean (configDO.isDetailsLOVMandatory ()));
        XMLBuilder.add (cecElement, "BMSTaskLOVDomain", configDO.getBMSTaskLOVDomain ());
        XMLBuilder.add (cecElement, "StatsModLOVDomain", configDO.getStatsModLOVDomain ());

        XMLBuilder.add (cecElement, "PreConditionJudgmentForRedeterminationMustExist",
                mConvertBoolean (configDO.isPreConditionJudgmentForRedeterminationMustExist ()));

        XMLBuilder.add (cecElement, "PreConditionJudgmentSuitableForAdmissionOrDefence",
                mConvertBoolean (configDO.isPreConditionJudgmentSuitableForAdmissionOrDefence ()));
        XMLBuilder.add (cecElement, "MCOLWriteOLSData", mConvertBoolean (configDO.isMCOLWriteOLSData ()));
        XMLBuilder.add (cecElement, "PreconditionCaseStatusStayed",
                mConvertBoolean (configDO.isPreconditionCaseStatusStayed ()));
        XMLBuilder.add (cecElement, "SetJudgmentBarToNoWhenResult",
                mConvertBoolean (configDO.isSetJudgmentBarToNoWhenResult ()));
        XMLBuilder.add (cecElement, "CCBCTransferCaseCall", mConvertBoolean (configDO.isCCBCTransferCaseCall ()));
        XMLBuilder.add (cecElement, "CCBCCreateOrderLiftingStayIfStatusStayed",
                mConvertBoolean (configDO.isCCBCCreateOrderLiftingStayIfStatusStayed ()));
        XMLBuilder.add (cecElement, "CCBCPreConditionWarrantMustExistAgainstSubject",
                mConvertBoolean (configDO.isCCBCPreConditionWarrantMustExistAgainstSubject ()));
        XMLBuilder.add (cecElement, "PreConditionNotCaseStatusCheck",
                mConvertBoolean (configDO.isPreConditionNotCaseStatusCheck ()));
        XMLBuilder.add (cecElement, "SetFinalReturnCodeOnWarrants",
                mConvertBoolean (configDO.isSetFinalReturnCodeOnWarrants ()));
        XMLBuilder.add (cecElement, "SetJudgmentBarToYesWhenNoResult",
                mConvertBoolean (configDO.isSetJudgmentBarToYesWhenNoResult ()));
        XMLBuilder.add (cecElement, "PreConditionEventMustNotExist", configDO.getPreConditionEventMustNotExist ());
        XMLBuilder.add (cecElement, "PreConditionPartyMustExist", configDO.getPreConditionPartyMustExist ());
        XMLBuilder.add (cecElement, "AeExistenceCheck", mConvertBoolean (configDO.isAeExistenceCheck ()));
        XMLBuilder.add (cecElement, "InstigatorCanBeSubject", mConvertBoolean (configDO.isInstigatorCanBeSubject ()));
        XMLBuilder.add (cecElement, "WordProcessingCall", mConvertBoolean (configDO.isWordProcessingCall ()));
        XMLBuilder.add (cecElement, "CCBCWordProcessingCall", mConvertBoolean (configDO.isCCBCWordProcessingCall ()));
        XMLBuilder.add (cecElement, "CCBCInstigatorType", configDO.getCCBCInstigatorType ());

        XMLBuilder.add (cecElement, "Part20PartiesRequired", configDO.getPart20PartiesRequired ());

        XMLBuilder.add (cecElement, "NoWordProcessingOutputByDefault",
                mConvertBoolean (configDO.isNoWordProcessingOutputByDefault ()));

        XMLBuilder.add (cecElement, "CCBCSpecificEvent", mConvertBoolean (configDO.isCCBCSpecificEvent ()));

        XMLBuilder.add (cecElement, "UpdateDeterminationJudgment",
                mConvertBoolean (configDO.isUpdateDeterminationJudgment ()));

        XMLBuilder.add (cecElement, "CCBCWpOutputImmediate", mConvertBoolean (configDO.isCCBCWpOutputImmediate ()));

        XMLBuilder.add (cecElement, "CCBCCreateCertOfSatisfaction",
                mConvertBoolean (configDO.isCCBCCreateCertOfSatisfaction ()));

        XMLBuilder.add (cecElement, "CCBCSetCaseStatusIfCaseOr1Def",
                mConvertBoolean (configDO.isCCBCSetCaseStatusIfCaseOr1Def ()));

        XMLBuilder.add (cecElement, "PreConditionTrackMustBeSet",
                mConvertBoolean (configDO.isPreConditionTrackMustBeSet ()));

        XMLBuilder.add (cecElement, "PreConditionFamilyEnforcementOnly",
                mConvertBoolean (configDO.isPreConditionFamilyEnforcementOnly ()));

        cecDoc.addContent (((Element) cecElement.clone ()).detach ());

        return cecDoc;
    } // getCaseEventConfigurationElement()

    /**
     * (non-Javadoc)
     * Calls a service to get the instigator label for a specific event id.
     *
     * @param pEventId the event id
     * @param pInstigatorType the instigator type
     * @return the instigator label
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String getInstigatorLabel (final String pEventId, final String pInstigatorType)
        throws BusinessException, SystemException
    {
        Element resultElement = null;
        Element resultRootElement = null;
        Element paramsElement = null;

        String label = "";
        try
        {
            if ( !isEmpty (pInstigatorType))
            {
                paramsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (paramsElement, "eventId", pEventId);
                final String crdParams = getXMLString (paramsElement);
                resultRootElement =
                        proxy.getJDOM (CASEEVENT_SERVICE, GET_INSTIGATOR_LABEL, crdParams).getRootElement ();
                resultElement = (Element) instigatorParamPath.selectSingleNode (resultRootElement);
                if (null != resultElement)
                {
                    label = resultElement.getText ();
                }
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return label;
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
     * (non-Javadoc)
     * Returns an event config data object for a specific event id.
     *
     * @param pEventId the event id
     * @return the i case event config DO
     * @throws SystemException the system exception
     */
    private ICaseEventConfigDO mGetCaseEventConfigDO (final String pEventId) throws SystemException
    {
        ICaseEventConfigDO caseEventConfigDO = null;

        // Retrieve the configuration data object associated with the standard Event id.
        final CaseEventConfigManager caseEventConfigManager = CaseEventConfigManager.getInstance ();
        caseEventConfigDO = caseEventConfigManager.getCaseEventConfigDO (Integer.parseInt (pEventId));

        return caseEventConfigDO;
    } // mGetCaseEventConfigDO()

    /**
     * M convert boolean.
     *
     * @param pBoolean the boolean
     * @return the string
     */
    private String mConvertBoolean (final boolean pBoolean)
    {
        return String.valueOf (pBoolean);
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

} // class CaseEventValidationXMLBuilder
