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

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 12 july 2005
 *
 * Change History:
 * 17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * 4 jan 2006 chris hutt
 * defect temp_caseman 392: PreConditionEventMustExistDependsOnCoType added
 * 
 * @author gzyysf
 */
public class CoEventValidationXMLBuilder
{

    /**
     * Constructor.
     */
    public CoEventValidationXMLBuilder ()
    {

    }

    /**
     * Returns a co event config document.
     *
     * @param pStandardEventId The standard event id.
     * @return The co event config document.
     * @throws SystemException the system exception
     */
    public Document getCoEventConfigurationDoc (final String pStandardEventId) throws SystemException
    {
        Document cocDoc = null;
        Element cocElement = null;

        cocDoc = new Document ();
        // Get the configuration for this standard event
        final ICoEventConfigDO configDO = mGetCoEventConfigDO (pStandardEventId);

        cocElement = new Element ("CoEventConfiguration");
        XMLBuilder.add (cocElement, "StandardEventId", pStandardEventId);
        XMLBuilder.add (cocElement, "ServiceType", configDO.getServiceType ());

        XMLBuilder.add (cocElement, "IssueStage", mConvertBoolean (configDO.isIssueStage ()));

        XMLBuilder.add (cocElement, "PERDetailsRequired", mConvertBoolean (configDO.isPERDetailsRequired ()));

        XMLBuilder.add (cocElement, "EmployersNamedPersonRequired",
                mConvertBoolean (configDO.isEmployersNamedPersonRequired ()));

        XMLBuilder.add (cocElement, "EmployerDetailsRequired", mConvertBoolean (configDO.isEmployerDetailsRequired ()));

        XMLBuilder.add (cocElement, "WordProcessingCall", mConvertBoolean (configDO.isWordProcessingCall ()));

        XMLBuilder.add (cocElement, "SetOrderDateOnCommit", mConvertBoolean (configDO.isSetOrderDateOnCommit ()));

        XMLBuilder.add (cocElement, "DetailsLOVDomain", configDO.getDetailsLOVDomain ());

        XMLBuilder.add (cocElement, "DetailsLOVMandatory", mConvertBoolean (configDO.isDetailsLOVMandatory ()));

        XMLBuilder.add (cocElement, "PreConditionEventMustExist",
                mConvertBoolean (configDO.isPreConditionEventMustExist ()));

        XMLBuilder.add (cocElement, "PreConditionPreviousOrderServedCheck",
                mConvertBoolean (configDO.isPreConditionPreviousOrderServedCheck ()));

        XMLBuilder.add (cocElement, "PreConditionHearingDateCheck",
                mConvertBoolean (configDO.isPreConditionHearingDateCheck ()));

        XMLBuilder.add (cocElement, "CreditorFieldEnabled", mConvertBoolean (configDO.isCreditorFieldEnabled ()));

        XMLBuilder.add (cocElement, "ServiceNotServedAction", mConvertBoolean (configDO.isServiceNotServedAction ()));

        /* XMLBuilder.add(cocElement,
         * "CreateHearing",
         * mConvertBoolean(configDO.isCreateHearing())); */
        XMLBuilder.add (cocElement, "PreConditionResponseFiledCheck",
                mConvertBoolean (configDO.isPreConditionResponseFiledCheck ()));

        XMLBuilder.add (cocElement, "PreConditionPreviousOrderResponseTimeCheck",
                mConvertBoolean (configDO.isPreConditionPreviousOrderResponseTimeCheck ()));

        XMLBuilder.add (cocElement, "PreConditionWarrantExistsCheck", configDO.getPreConditionWarrantExistsCheck ());

        XMLBuilder.add (cocElement, "PreConditionPaymentDetailsExistCheck",
                mConvertBoolean (configDO.isPreConditionPaymentDetailsExistCheck ()));

        XMLBuilder.add (cocElement, "PreConditionMoneyInCourtCheck",
                mConvertBoolean (configDO.isPreConditionMoneyInCourtCheck ()));

        XMLBuilder.add (cocElement, "PreConditionDischargedDateSetCheck",
                mConvertBoolean (configDO.isPreConditionDischargedDateSetCheck ()));

        XMLBuilder.add (cocElement, "PreConditionDividendsDeclaredCheck",
                mConvertBoolean (configDO.isPreConditionDividendsDeclaredCheck ()));

        XMLBuilder.add (cocElement, "ActionOnUpdateEventError",
                mConvertBoolean (configDO.isActionOnUpdateEventError ()));

        XMLBuilder.add (cocElement, "PreConditionReleasableMoneyCheck",
                mConvertBoolean (configDO.isPreConditionReleasableMoneyCheck ()));

        XMLBuilder.add (cocElement, "PreConditionDebtsMustExistCheck",
                mConvertBoolean (configDO.isPreConditionDebtsMustExistCheck ()));

        XMLBuilder.add (cocElement, "PreConditionValidCOStatusCheck",
                mConvertBoolean (configDO.isPreConditionValidCOStatusCheck ()));

        XMLBuilder.add (cocElement, "PreConditionValidDebtStatusCheck",
                mConvertBoolean (configDO.isPreConditionValidDebtStatusCheck ()));

        XMLBuilder.add (cocElement, "PreConditionEventMustExistWarning",
                mConvertBoolean (configDO.isPreConditionEventMustExistWarning ()));

        XMLBuilder.add (cocElement, "PreConditionEventMustExistDependsOnCoType",
                configDO.getPreConditionEventMustExistDependsOnCoType ());

        cocDoc.addContent (((Element) cocElement.clone ()).detach ());

        return cocDoc;
    } // getCoEventConfigurationElement()

    /**
     * (non-Javadoc)
     * Retrieve the configuration data object associated with the standard Event id.
     *
     * @param pEventId the event id
     * @return the i co event config DO
     * @throws SystemException the system exception
     */
    private ICoEventConfigDO mGetCoEventConfigDO (final String pEventId) throws SystemException
    {
        ICoEventConfigDO aeEventConfigDO = null;

        // Retrieve the configuration data object associated with the standard Event id.
        final CoEventConfigManager aeEventConfigManager = CoEventConfigManager.getInstance ();
        aeEventConfigDO = aeEventConfigManager.getCoEventConfigDO (Integer.parseInt (pEventId));

        return aeEventConfigDO;
    } // mGetCoEventConfigDO()

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
} // class AeValidationXMLBuilder
