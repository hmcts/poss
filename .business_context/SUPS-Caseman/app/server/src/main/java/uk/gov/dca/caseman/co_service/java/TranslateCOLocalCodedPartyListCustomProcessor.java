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
package uk.gov.dca.caseman.co_service.java;

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
 * Service: CO
 * Method: updateCO
 * Class: TranslateCOLocalCodedPartyListCustomProcessor.java
 * 
 * @author Chris Vincent
 *         Created: 15-Feb-2011
 *         Description:
 *         Called as part of a request to transfer a Consolidated Order to another Court.
 *         Identifies Local Coded Parties on a given Consolidated Order record and first tries to map the Local
 *         Coded Party to an identical Local Coded Party at the new Court. If no identical match is found, then
 *         The Local Coded Party is converted to a non coded party. Created as part of Trac 4215.
 */
public class TranslateCOLocalCodedPartyListCustomProcessor extends AbstractCustomProcessor
{
    
    /** The Constant CO_SERVICE. */
    private static final String CO_SERVICE = "ejb/CoServiceLocal";
    
    /** The Constant CODED_PARTY_SERVICE. */
    private static final String CODED_PARTY_SERVICE = "ejb/CodedpartyServiceLocal";
    
    /** The Constant GET_CO_CRED_LOCAL_CODED_PARTY_LIST. */
    private static final String GET_CO_CRED_LOCAL_CODED_PARTY_LIST = "getCoCredLocalCodedPartyListLocal";
    
    /** The Constant UPDATE_CO_CRED_LOCAL_CODED_PARTY_LIST. */
    private static final String UPDATE_CO_CRED_LOCAL_CODED_PARTY_LIST = "updateCoCredLocalCodedPartyListLocal";
    
    /** The Constant GET_CO_PAYEE_LOCAL_CODED_PARTY_LIST. */
    private static final String GET_CO_PAYEE_LOCAL_CODED_PARTY_LIST = "getCoPayeeLocalCodedPartyListLocal";
    
    /** The Constant UPDATE_CO_PAYEE_LOCAL_CODED_PARTY_LIST. */
    private static final String UPDATE_CO_PAYEE_LOCAL_CODED_PARTY_LIST = "updateCoPayeeLocalCodedPartyListLocal";
    
    /** The Constant GET_MATCHING_CODED_PARTY_LIST. */
    private static final String GET_MATCHING_CODED_PARTY_LIST = "getMatchingCodedPartyListLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public TranslateCOLocalCodedPartyListCustomProcessor ()
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
        final Element dsElement;
        final Element maintainCoElement;
        final String transferCOFlag;
        final String coNumber;
        final String newCourtCode;
        final XMLOutputter xmlOutputter;
        final String sXml;

        try
        {
            dsElement = pDocParams.getRootElement ();
            maintainCoElement = dsElement.getChild ("MaintainCO");

            // Identify whether the Transfer CO Flag has been set
            transferCOFlag = maintainCoElement.getChild ("TransferCOFlag").getText ();
            if (transferCOFlag.equals ("true"))
            {
                // Retrieve the New Court Code for the Consolidated Order
                newCourtCode = maintainCoElement.getChild ("OwningCourtCode").getText ();

                // Retrieve the Coded Party row details for this CO.
                coNumber = maintainCoElement.getChild ("CONumber").getText ();

                // Process Creditors separately
                mProcessCreditors (coNumber, newCourtCode);

                // Process Payees separately
                mProcessPayees (coNumber, newCourtCode);
            }

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (dsElement);
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
    } // process()

    /**
     * (non-Javadoc)
     * Processes the Creditor Local Coded Parties on a Consolidated Order.
     *
     * @param pCONumber CO Number
     * @param pCourtCode Destination Court's code
     * @throws SystemException System Exception
     * @throws BusinessException Business Exception
     */
    private void mProcessCreditors (final String pCONumber, final String pCourtCode)
        throws SystemException, BusinessException
    {
        String newPartyId;
        final Element coLocalCodedPartyListElement;
        final List<Element> elementList;
        Element coLocalCodedPartyElement;
        Element partyElement;
        Element allowedDebtElement;
        Element addressElement;
        String sourceText;
        boolean codedPartiesExist = false;
        String cpName;
        String cpAddressLine1;
        String cpAddressLine2;
        String cpAddressLine3;
        String cpAddressLine4;
        String cpAddressLine5;
        String cpPostcode;

        // Retrieve the Local Coded Party Creditors on the CO
        coLocalCodedPartyListElement = mGetCOCredLocalCodedPartyList (pCONumber);

        // Loop through each Local Coded Party found
        elementList = coLocalCodedPartyListElement.getChildren ();
        for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
        {
            codedPartiesExist = true;
            coLocalCodedPartyElement = (Element) i.next ();

            // Get the main 3 elements.
            partyElement = coLocalCodedPartyElement.getChild ("Party");
            allowedDebtElement = coLocalCodedPartyElement.getChild ("AllowedDebt");
            addressElement = coLocalCodedPartyElement.getChild ("Address");

            // Check to see if there is an identical local coded party at the new Court
            cpName = partyElement.getChild ("PersonRequestedName").getText ();
            cpAddressLine1 = addressElement.getChild ("AddressLine1").getText ();
            cpAddressLine2 = addressElement.getChild ("AddressLine2").getText ();
            cpAddressLine3 = addressElement.getChild ("AddressLine3").getText ();
            if (cpAddressLine3.equals (""))
            {
                cpAddressLine3 = ".";
            }
            cpAddressLine4 = addressElement.getChild ("AddressLine4").getText ();
            if (cpAddressLine4.equals (""))
            {
                cpAddressLine4 = ".";
            }
            cpAddressLine5 = addressElement.getChild ("AddressLine5").getText ();
            if (cpAddressLine5.equals (""))
            {
                cpAddressLine5 = ".";
            }
            cpPostcode = addressElement.getChild ("Postcode").getText ();
            if (cpPostcode.equals (""))
            {
                cpPostcode = ".";
            }
            newPartyId = mMatchLocalCodedParties (cpName, cpAddressLine1, cpAddressLine2, cpAddressLine3,
                    cpAddressLine4, cpAddressLine5, cpPostcode, pCourtCode);

            if (newPartyId.equals (""))
            {
                // No matching Local Coded Party at new Court - create party as non coded party

                // Clear Party/PartyId in order to trigger creation of a new row.
                partyElement.getChild ("PartyId").setText ("");

                // Clear Address/AddressId in order to trigger creation of a new row.
                addressElement.getChild ("AddressId").setText ("");

                // Need to update the Creditor
                allowedDebtElement.getChild ("CPCreditorPartyId").setText ("");
                addressElement.getChild ("AddressTypeCode").setText ("CO CRED");

                // Clear Address/PartyId as this is not valid foreign key for the new address type.
                addressElement.getChild ("PartyId").setText ("");

                // Assign today's date to Address/ValidFrom.
                sourceText = SystemDateHelper.getSystemDate ();
                addressElement.getChild ("ValidFrom").setText (sourceText);

                // Clear Address/ValidTo.
                addressElement.getChild ("ValidTo").setText ("");

                // Set the ALD_SEQ column to link the address to the Consolidated Order
                addressElement.getChild ("AldSeq").setText (allowedDebtElement.getChild ("DebtSeq").getText ());
            }
            else
            {
                // A match for the Local Coded Party exists at the new Court, update the ALLOWED_DEBTS record
                allowedDebtElement.getChild ("CPCreditorPartyId").setText (newPartyId);
            }
        }

        if (codedPartiesExist)
        {
            mUpdateCOCredLocalCodedPartyList (coLocalCodedPartyListElement);
        }

    } // mProcessCreditors()

    /**
     * (non-Javadoc)
     * Processes the Payee Local Coded Parties on a Consolidated Order.
     *
     * @param pCONumber CO Number
     * @param pCourtCode Destination Court's code
     * @throws SystemException System Exception
     * @throws BusinessException Business Exception
     */
    private void mProcessPayees (final String pCONumber, final String pCourtCode)
        throws SystemException, BusinessException
    {
        String newPartyId;
        final Element coLocalCodedPartyListElement;
        final List<Element> elementList;
        Element coLocalCodedPartyElement;
        Element partyElement;
        Element allowedDebtElement;
        Element addressElement;
        String sourceText;
        boolean codedPartiesExist = false;
        String cpName;
        String cpAddressLine1;
        String cpAddressLine2;
        String cpAddressLine3;
        String cpAddressLine4;
        String cpAddressLine5;
        String cpPostcode;

        // Retrieve a list of Local Coded Party Payees on the CO
        coLocalCodedPartyListElement = mGetCOPayeeLocalCodedPartyList (pCONumber);

        // Loop through each Local Coded Party found
        elementList = coLocalCodedPartyListElement.getChildren ();
        for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
        {
            codedPartiesExist = true;
            coLocalCodedPartyElement = (Element) i.next ();

            // Get the main 3 elements.
            partyElement = coLocalCodedPartyElement.getChild ("Party");
            allowedDebtElement = coLocalCodedPartyElement.getChild ("AllowedDebt");
            addressElement = coLocalCodedPartyElement.getChild ("Address");

            // Check to see if there is an identical local coded party at the new Court
            cpName = partyElement.getChild ("PersonRequestedName").getText ();
            cpAddressLine1 = addressElement.getChild ("AddressLine1").getText ();
            cpAddressLine2 = addressElement.getChild ("AddressLine2").getText ();
            cpAddressLine3 = addressElement.getChild ("AddressLine3").getText ();
            if (cpAddressLine3.equals (""))
            {
                cpAddressLine3 = ".";
            }
            cpAddressLine4 = addressElement.getChild ("AddressLine4").getText ();
            if (cpAddressLine4.equals (""))
            {
                cpAddressLine4 = ".";
            }
            cpAddressLine5 = addressElement.getChild ("AddressLine5").getText ();
            if (cpAddressLine5.equals (""))
            {
                cpAddressLine5 = ".";
            }
            cpPostcode = addressElement.getChild ("Postcode").getText ();
            if (cpPostcode.equals (""))
            {
                cpPostcode = ".";
            }
            newPartyId = mMatchLocalCodedParties (cpName, cpAddressLine1, cpAddressLine2, cpAddressLine3,
                    cpAddressLine4, cpAddressLine5, cpPostcode, pCourtCode);

            if (newPartyId.equals (""))
            {
                // No matching Local Coded Party at new Court - create party as non coded party

                // Clear Party/PartyId in order to trigger creation of a new row.
                partyElement.getChild ("PartyId").setText ("");

                // Clear Address/AddressId in order to trigger creation of a new row.
                addressElement.getChild ("AddressId").setText ("");

                // Need to update the Creditor
                allowedDebtElement.getChild ("CPPayeePartyId").setText ("");
                addressElement.getChild ("AddressTypeCode").setText ("CO PAYEE");

                // Clear Address/PartyId as this is not valid foreign key for the new address type.
                addressElement.getChild ("PartyId").setText ("");

                // Assign today's date to Address/ValidFrom.
                sourceText = SystemDateHelper.getSystemDate ();
                addressElement.getChild ("ValidFrom").setText (sourceText);

                // Clear Address/ValidTo.
                addressElement.getChild ("ValidTo").setText ("");

                // Set the ALD_SEQ column to link the address to the Consolidated Order
                addressElement.getChild ("AldSeq").setText (allowedDebtElement.getChild ("DebtSeq").getText ());
            }
            else
            {
                // A match for the Local Coded Party exists at the new Court, update the ALLOWED_DEBTS record
                allowedDebtElement.getChild ("CPPayeePartyId").setText (newPartyId);
            }
        }

        if (codedPartiesExist)
        {
            mUpdateCOPayeeLocalCodedPartyList (coLocalCodedPartyListElement);
        }

    } // mProcessPayees()

    /**
     * (non-Javadoc)
     * Get CO Creditor local coded party list.
     * 
     * @param pCONumber CO Number
     * @return List of Local Coded Parties acting as Creditors on the CO provided
     * @throws SystemException System Exception
     * @throws BusinessException Business Exception
     */
    private Element mGetCOCredLocalCodedPartyList (final String pCONumber) throws SystemException, BusinessException
    {
        final Element coLocalCodedPartyListElement;
        final Element paramsElement;
        final XMLOutputter xmlOutputter;
        final String sXmlParams;

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coNumber", pCONumber);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        coLocalCodedPartyListElement = localServiceProxy
                .getJDOM (CO_SERVICE, GET_CO_CRED_LOCAL_CODED_PARTY_LIST, sXmlParams).getRootElement ();

        return coLocalCodedPartyListElement;
    } // mGetCOCredLocalCodedPartyList()

    /**
     * (non-Javadoc)
     * Get CO Payee local coded party list.
     * 
     * @param pCONumber CO Number
     * @return List of Local Coded Parties acting as Payees on the CO provided
     * @throws SystemException System Exception
     * @throws BusinessException Business Exception
     */
    private Element mGetCOPayeeLocalCodedPartyList (final String pCONumber) throws SystemException, BusinessException
    {
        final Element coLocalCodedPartyListElement;
        final Element paramsElement;
        final XMLOutputter xmlOutputter;
        final String sXmlParams;

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coNumber", pCONumber);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        coLocalCodedPartyListElement = localServiceProxy
                .getJDOM (CO_SERVICE, GET_CO_PAYEE_LOCAL_CODED_PARTY_LIST, sXmlParams).getRootElement ();

        return coLocalCodedPartyListElement;
    } // mGetCOCredLocalCodedPartyList()

    /**
     * (non-Javadoc)
     * Update CO Creditor Local Coded Party list.
     * 
     * @param pCoLocalCodedPartyListElement List of Local Coded Party updates
     * @throws SystemException System Exception
     * @throws BusinessException Business Exception
     */
    private void mUpdateCOCredLocalCodedPartyList (final Element pCoLocalCodedPartyListElement)
        throws SystemException, BusinessException
    {
        final Element paramsElement;
        final XMLOutputter xmlOutputter;
        final String sXmlParams;

        paramsElement = XMLBuilder.getNewParamsElement ();
        pCoLocalCodedPartyListElement.detach ();
        XMLBuilder.addParam (paramsElement, "partyList", pCoLocalCodedPartyListElement);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        localServiceProxy.getJDOM (CO_SERVICE, UPDATE_CO_CRED_LOCAL_CODED_PARTY_LIST, sXmlParams);
    } // mUpdateCOCredLocalCodedPartyList()

    /**
     * (non-Javadoc)
     * Update CO Payee Local Coded Party list.
     * 
     * @param pCoLocalCodedPartyListElement List of Local Coded Party updates
     * @throws SystemException System Exception
     * @throws BusinessException Business Exception
     */
    private void mUpdateCOPayeeLocalCodedPartyList (final Element pCoLocalCodedPartyListElement)
        throws SystemException, BusinessException
    {
        final Element paramsElement;
        final XMLOutputter xmlOutputter;
        final String sXmlParams;

        paramsElement = XMLBuilder.getNewParamsElement ();
        pCoLocalCodedPartyListElement.detach ();
        XMLBuilder.addParam (paramsElement, "partyList", pCoLocalCodedPartyListElement);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        localServiceProxy.getJDOM (CO_SERVICE, UPDATE_CO_PAYEE_LOCAL_CODED_PARTY_LIST, sXmlParams);
    } // mUpdateCOCredLocalCodedPartyList()

    /**
     * (non-Javadoc)
     * Retrieves a list of Local Coded Parties with details matching those passed in
     * at the Court specified. If multiple matches found, the code of the first match
     * is used.
     *
     * @param pName Name of Local Coded Party
     * @param pAddressLine1 Address Line One
     * @param pAddressLine2 Address Line Two
     * @param pAddressLine3 Address Line Three
     * @param pAddressLine4 Address Line Four
     * @param pAddressLine5 Address Line Five
     * @param pPostcode Postcode
     * @param pNewCourt Local Coded Party Court Code
     *
     * @return String representing the party id of the first Local Coded Party found or a blank string if no matches
     * @throws SystemException System Exception
     * @throws BusinessException Business Exception
     */
    private String mMatchLocalCodedParties (final String pName, final String pAddressLine1, final String pAddressLine2,
                                            final String pAddressLine3, final String pAddressLine4,
                                            final String pAddressLine5, final String pPostcode, final String pNewCourt)
        throws SystemException, BusinessException
    {
        Element matchingCodedPartyListElement;
        final Element paramsElement;
        final List<Element> elementList;
        final XMLOutputter xmlOutputter;
        final String sXmlParams;
        String partyId = "";

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "name", pName);
        XMLBuilder.addParam (paramsElement, "addressLine1", pAddressLine1);
        XMLBuilder.addParam (paramsElement, "addressLine2", pAddressLine2);
        XMLBuilder.addParam (paramsElement, "addressLine3", pAddressLine3);
        XMLBuilder.addParam (paramsElement, "addressLine4", pAddressLine4);
        XMLBuilder.addParam (paramsElement, "addressLine5", pAddressLine5);
        XMLBuilder.addParam (paramsElement, "postcode", pPostcode);
        XMLBuilder.addParam (paramsElement, "courtCode", pNewCourt);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        matchingCodedPartyListElement = localServiceProxy
                .getJDOM (CODED_PARTY_SERVICE, GET_MATCHING_CODED_PARTY_LIST, sXmlParams).getRootElement ();

        elementList = matchingCodedPartyListElement.getChildren ();
        if (elementList.size () > 0)
        {
            // Retrieve the first Party Id (might be many matches)
            matchingCodedPartyListElement = (Element) elementList.get (0);
            partyId = matchingCodedPartyListElement.getChild ("PartyId").getText ();
        }

        return partyId;
    } // mMatchLocalCodedParties()

} // class TranslateCOLocalCodedPartyListCustomProcessor