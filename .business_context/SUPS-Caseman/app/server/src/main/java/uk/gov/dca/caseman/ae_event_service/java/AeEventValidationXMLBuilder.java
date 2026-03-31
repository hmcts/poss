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

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 21-June-2005
 *
 * Change History
 * 
 * v1.0 Chris Hutt 21/6/05
 * 
 * v1.1 Chris Hutt 18/11/05
 * OracleReportCall added
 * 
 * 15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 * 
 * 25-may-2006 Chris Hutt
 * TD defect UCT273: PreConditionAeHearingCheck added
 * 10 Nov 2006 chris hutt
 * buildzissue 173:HearingCreated added
 * 20 Dec 2006 chris hutt
 * temp_caseman defect 356: EmployerNamedPersonRequired added
 * 
 * @author gzyysf
 */
public class AeEventValidationXMLBuilder
{

    /**
     * Constructor.
     */
    public AeEventValidationXMLBuilder ()
    {
    }

    /**
     * Get ae event configuration document.
     *
     * @param pStandardEventId The standard event id
     * @return The configuration document
     * @throws SystemException the system exception
     */
    public Document getAeEventConfigurationDoc (final String pStandardEventId) throws SystemException
    {

        Document aecDoc = null;
        Element aecElement = null;

        aecDoc = new Document ();
        // Get the configuration for this standard event
        final IAeEventConfigDO configDO = mGetAeEventConfigDO (pStandardEventId);

        aecElement = new Element ("AeEventConfiguration");
        XMLBuilder.add (aecElement, "StandardEventId", pStandardEventId);
        XMLBuilder.add (aecElement, "ServiceType", configDO.getServiceType ());

        XMLBuilder.add (aecElement, "IssueStage", mConvertBoolean (configDO.isIssueStage ()));

        XMLBuilder.add (aecElement, "PERDetailsRequired", mConvertBoolean (configDO.isPERDetailsRequired ()));

        XMLBuilder.add (aecElement, "EmployerDetailsRequired", mConvertBoolean (configDO.isEmployerDetailsRequired ()));

        XMLBuilder.add (aecElement, "EmployerNamedPersonRequired",
                mConvertBoolean (configDO.isEmployerNamedPersonRequired ()));

        XMLBuilder.add (aecElement, "WordProcessingCall", mConvertBoolean (configDO.isWordProcessingCall ()));

        XMLBuilder.add (aecElement, "ObligationsCall", mConvertBoolean (configDO.isObligationsCall ()));

        XMLBuilder.add (aecElement, "OracleReportCall", mConvertBoolean (configDO.isOracleReportCall ()));

        XMLBuilder.add (aecElement, "ObligationsPrompt", mConvertBoolean (configDO.isObligationsPrompt ()));

        XMLBuilder.add (aecElement, "DetailsLOVDomain", configDO.getDetailsLOVDomain ());

        XMLBuilder.add (aecElement, "DetailsLOVMandatory", mConvertBoolean (configDO.isDetailsLOVMandatory ()));

        XMLBuilder.add (aecElement, "PreConditionEventMustExist",
                mConvertBoolean (configDO.isPreConditionEventMustExist ()));

        XMLBuilder.add (aecElement, "PreConditionPreviousOrderCheck",
                mConvertBoolean (configDO.isPreConditionPreviousOrderCheck ()));

        XMLBuilder.add (aecElement, "PreConditionFutureAeHearingCheck",
                mConvertBoolean (configDO.isPreConditionFutureAeHearingCheck ()));

        XMLBuilder.add (aecElement, "PreConditionPastAeHearingCheck",
                mConvertBoolean (configDO.isPreConditionPastAeHearingCheck ()));

        XMLBuilder.add (aecElement, "CreateWarrantType", configDO.getCreateWarrantType ());

        XMLBuilder.add (aecElement, "ValidAETypes", mConvertBoolean (configDO.isValidAETypes ()));

        XMLBuilder.add (aecElement, "PreConditionAEOutstandingBalanceCheck",
                mConvertBoolean (configDO.isPreConditionAEOutstandingBalanceCheck ()));

        XMLBuilder.add (aecElement, "MarkForCAPSTransfer", mConvertBoolean (configDO.isMarkForCAPSTransfer ()));

        XMLBuilder.add (aecElement, "CreateHearingType", configDO.getCreateHearingType ());

        XMLBuilder.add (aecElement, "PreConditionLaterResponseEventCheck",
                mConvertBoolean (configDO.isPreConditionLaterResponseEventCheck ()));

        XMLBuilder.add (aecElement, "PreConditionServiceDateCheck",
                mConvertBoolean (configDO.isPreConditionServiceDateCheck ()));

        XMLBuilder.add (aecElement, "ObligationsCallOnError", mConvertBoolean (configDO.isObligationsCallOnError ()));

        XMLBuilder.add (aecElement, "ObligationsPromptOnError",
                mConvertBoolean (configDO.isObligationsPromptOnError ()));

        XMLBuilder.add (aecElement, "PreConditionAeHearingCheck",
                mConvertBoolean (configDO.isPreConditionAeHearingCheck ()));

        XMLBuilder.add (aecElement, "HearingCreated", mConvertBoolean (configDO.isHearingCreated ()));

        aecDoc.addContent (((Element) aecElement.clone ()).detach ());

        return aecDoc;
    } // getAeEventConfigurationElement()

    /**
     * (non-Javadoc)
     * Returns event config object.
     *
     * @param pEventId the event id
     * @return the i ae event config DO
     * @throws SystemException the system exception
     */
    private IAeEventConfigDO mGetAeEventConfigDO (final String pEventId) throws SystemException
    {
        IAeEventConfigDO aeEventConfigDO = null;

        // Retrieve the configuration data object associated with the standard Event id.
        final AeEventConfigManager aeEventConfigManager = AeEventConfigManager.getInstance ();
        aeEventConfigDO = aeEventConfigManager.getAeEventConfigDO (Integer.parseInt (pEventId));

        return aeEventConfigDO;
    } // mGetAeEventConfigDO()

    /**
     * (non-Javadoc)
     * Utility function to convert boolean to a string.
     *
     * @param pBoolean the boolean
     * @return the string
     */
    private String mConvertBoolean (final boolean pBoolean)
    {
        return String.valueOf (pBoolean);

    }

} // class AeValidationXMLBuilder
