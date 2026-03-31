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
package uk.gov.dca.caseman.transfer_case_service.java;

import java.io.IOException;
import java.io.Writer;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.common.java.SystemDateHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * Service: TransferCase
 * Method: completeTransferCase
 * Class: TranslateCaseLocalCodedPartyListCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 26-Jul-2005
 *         Description:
 *         Translate the Local Coded Parties belong to a Case into 'standard' parties.
 * 
 *         Change History:
 *         14-Dec-2005 Phil Haferer: Switched update of Address/AddressTypeCode to Release 5/6 (and onwards) version.
 *         05-May-2006 Phil Haferer: TD 3223 "Transferred CCBC Cases don't display the National Coded Party Solicitor"
 *         The AddressTypeCode was always being set to SERVICE, for Solicitor's it need to be set to SOLICITOR.
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 */
public class TranslateCaseLocalCodedPartyListCustomProcessor extends AbstractCustomProcessor
{
    
    /** The Constant TRANSFER_CASE_SERVICE. */
    private static final String TRANSFER_CASE_SERVICE = "ejb/TransferCaseServiceLocal";
    
    /** The Constant GET_CASE_LOCAL_CODED_PARTY_LIST. */
    private static final String GET_CASE_LOCAL_CODED_PARTY_LIST = "getCaseLocalCodedPartyListLocal";
    
    /** The Constant UPDATE_CASE_LOCAL_CODED_PARTY_LIST. */
    private static final String UPDATE_CASE_LOCAL_CODED_PARTY_LIST = "updateCaseLocalCodedPartyListLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public TranslateCaseLocalCodedPartyListCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pWriter the writer
     * @param pLog the log
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pDocParams, final Writer pWriter, final Log pLog) throws SystemException
    {
        Element transferCaseElement = null;
        String caseNumber = null;
        Element caseLocalCodedPartyListElement = null;
        List<Element> elementList = null;
        Element caseLocalCodedPartyElement = null;
        Element partyElement = null;
        Element casePartyRoleElement = null;
        Element addressElement = null;
        String sourceText = null;
        String partyRoleCode = null;
        boolean codedPartiesExist = false;
        XMLOutputter xmlOutputter = null;
        String sXml = null;

        try
        {
            transferCaseElement = pDocParams.getRootElement ();

            // Retrieve the Coded Party row details for this Case.
            caseNumber = transferCaseElement.getChild ("CaseNumber").getText ();
            caseLocalCodedPartyListElement = mGetCaseLocalCodedPartyList (caseNumber);

            elementList = caseLocalCodedPartyListElement.getChildren ();
            for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
            {
                codedPartiesExist = true;
                caseLocalCodedPartyElement = (Element) i.next ();

                // Get the main 3 elements.
                partyElement = caseLocalCodedPartyElement.getChild ("Party");
                casePartyRoleElement = caseLocalCodedPartyElement.getChild ("CasePartyRole");
                addressElement = caseLocalCodedPartyElement.getChild ("Address");

                // Clear Party/PartyId in order to trigger creation of a new row.
                partyElement.getChild ("PartyId").setText ("");

                // Clear Address/AddressId in order to trigger creation of a new row.
                addressElement.getChild ("AddressId").setText ("");

                // Address/CaseNumber = CasePartyRole/CaseNumber
                addressElement.getChild ("CaseNumber").setText (caseNumber);

                // Address/PartyRoleCode = CasePartyRole/PartyRoleCode
                partyRoleCode = casePartyRoleElement.getChild ("PartyRoleCode").getText ();
                addressElement.getChild ("PartyRoleCode").setText (partyRoleCode);

                // Address/CasePartyNo = CasePartyRole/CasePartyNo
                sourceText = casePartyRoleElement.getChild ("CasePartyNo").getText ();
                addressElement.getChild ("CasePartyNo").setText (sourceText);

                if (partyRoleCode.equals ("SOLICITOR"))
                {
                    addressElement.getChild ("AddressTypeCode").setText (partyRoleCode);
                }
                else
                {
                    addressElement.getChild ("AddressTypeCode").setText ("SERVICE");
                }

                // Clear Address/PartyId as this is not valid foreign key for the new address type.
                addressElement.getChild ("PartyId").setText ("");

                // Assign today's date to Address/ValidFrom.
                sourceText = SystemDateHelper.getSystemDate ();
                addressElement.getChild ("ValidFrom").setText (sourceText);

                // Clear Address/ValidTo.
                addressElement.getChild ("ValidTo").setText ("");

                // Set CasePartyRole/PartyId to that of the newly created PARTIES rows.
                // NOTE: This has to be done in the 'update' service, as the PartyId
                // sequence number is not generated until then.
            }

            if (codedPartiesExist)
            {
                mUpdateCaseLocalCodedPartyList (caseLocalCodedPartyListElement);
            }

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (transferCaseElement);
            pWriter.write (sXml);
        }
        catch (final BusinessException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        return;
    } // process()

    /**
     * (non-Javadoc)
     * Get case local coded party list.
     *
     * @param pCaseNumber the case number
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetCaseLocalCodedPartyList (final String pCaseNumber) throws SystemException, BusinessException
    {
        Element caseLocalCodedPartyListElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            caseLocalCodedPartyListElement = localServiceProxy
                    .getJDOM (TRANSFER_CASE_SERVICE, GET_CASE_LOCAL_CODED_PARTY_LIST, sXmlParams).getRootElement ();
        }
        finally
        {
            xmlOutputter = null;
            sXmlParams = null;
        }

        return caseLocalCodedPartyListElement;
    } // mGetCaseLocalCodedPartyList()

    /**
     * (non-Javadoc)
     * Update case local coded party list.
     *
     * @param pCaseLocalCodedPartyListElement the case local coded party list element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCaseLocalCodedPartyList (final Element pCaseLocalCodedPartyListElement)
        throws SystemException, BusinessException
    {
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            pCaseLocalCodedPartyListElement.detach ();
            XMLBuilder.addParam (paramsElement, "partyList", pCaseLocalCodedPartyListElement);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy.getJDOM (TRANSFER_CASE_SERVICE, UPDATE_CASE_LOCAL_CODED_PARTY_LIST, sXmlParams);
        }
        finally
        {
            xmlOutputter = null;
            sXmlParams = null;
        }
    } // mUpdateCaseLocalCodedPartyList()

} // class TranslateCaseLocalCodedPartyListCustomProcessor
