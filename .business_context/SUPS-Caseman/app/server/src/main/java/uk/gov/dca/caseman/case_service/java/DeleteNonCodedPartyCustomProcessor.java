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
package uk.gov.dca.caseman.case_service.java;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Case
 * Method: updateCase
 * Class: DeleteNonCodedPartyCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 19-Apr-2005
 *         Description:
 *         This class implements a step in the pipeline for the updateCase method.
 *         It allows rows in the PARTIES and GIVEN_ADDRESSES tables that relate to non-Coded Parties to be deleted.
 *         A party within a Case may be changed from being a non-coded party to a Coded Party.
 *         A Coded Party is defined outside of a Case by rows in the tables PARTIES, GIVEN_ADDRESSES and CODED_PARTIES.
 *         A non-Coded Party only exists within a Case and is defined by rows in the tables PARTIES, GIVEN_ADDRESSES
 *         and CASE_PARTY_ROLES.
 *         When a Coded Party replaces a non-Coded Party within a Case the rows in PARTIES and GIVEN_ADDRESSES used
 *         by the non-Coded Party are no longer required and may be deleted.
 *         (Solicitors require the GIVEN_ADDRESSES row to be deleted, LitigiousParty's simply add the row to
 *         their list of Historical Addresses).
 *         Scenarios may exist on the client, where the client incorrectly suggests that PARTIES and GIVEN_ADDRESSES
 *         rows should be deleted, when in actual fact these rows belong to Coded Parties and as such should not be
 *         deleted.
 *         Therefore, this CustomProcessor checks the rows to be deleted, before actually performing the deletion.
 *
 *         Change History:
 *         16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * @author Phil Haferer
 */
public class DeleteNonCodedPartyCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document pDocParams, final Log pLog) throws BusinessException, SystemException
    {
        List<Element> deleteNonCodedPartyElementList = null;
        Element deleteNonCodedPartyElement = null;
        Element caseNumberElement = null;
        String caseNumber = null;
        Element partyIdElement = null;
        String partyId = null;
        Element addressIdElement = null;
        String addressId = null;
        boolean performDelete = false;

        try
        {
            // Retrieve a list of all <DeleteNonCodedParty> nodes.
            deleteNonCodedPartyElementList = XPath.selectNodes (pDocParams, "//DeleteNonCodedParty");

            if (null != deleteNonCodedPartyElementList)
            {
                caseNumberElement = (Element) XPath.selectSingleNode (pDocParams, "/ds/ManageCase/CaseNumber");
                caseNumber = caseNumberElement.getText ();

                for (Iterator<Element> i = deleteNonCodedPartyElementList.iterator (); i.hasNext ();)
                {
                    deleteNonCodedPartyElement = (Element) i.next ();

                    partyIdElement = deleteNonCodedPartyElement.getChild ("PartyId");
                    partyId = partyIdElement.getText ();

                    if (mCheckDeleteNonCodedParty (partyId, caseNumber))
                    {
                        performDelete = true;

                        // For Solicitors we need to check the Address as well...
                        addressIdElement = deleteNonCodedPartyElement.getChild ("AddressId");
                        if (null != addressIdElement)
                        {
                            addressId = addressIdElement.getText ();
                            if ( !mCheckDeleteNonCodedPartyAddress (addressId, caseNumber))
                            {
                                performDelete = false;
                            }
                        }

                        if (performDelete)
                        {
                            mDeleteNonCodedParty (deleteNonCodedPartyElement);
                        }
                    }
                } // for
            } // if (null != deleteNonCodedPartyElementList)
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    } // process()

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
     * Check to see if the party is a coded party and do not delete if it is.
     *
     * @param pPartyId the party id
     * @param pCaseNumber the case number
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mCheckDeleteNonCodedParty (final String pPartyId, final String pCaseNumber)
        throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        boolean deleteParty = false;
        Element paramsElement = null;
        Element dsElement = null;
        Element isCodedPartyElement = null;
        boolean isCodedParty = false;
        Element isCasePartyRolesElement = null;
        boolean isCasePartyRoles = false;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "partyId", pPartyId);
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            dsElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.CHECK_DELETE_NON_CODED_PARTY_METHOD,
                    inputDoc).getRootElement ();

            // Assume we will delete the party unless we find a reason not to.
            deleteParty = true;

            // Is the Party actually a Coded Party?
            isCodedPartyElement = (Element) XPath.selectSingleNode (dsElement, "/ds/isCodedParty");
            isCodedParty = mGetBoolean (isCodedPartyElement.getText ());

            if (isCodedParty)
            {
                // Don't delete Coded Parties!
                deleteParty = false;
            }
            else
            {
                // Is the Party still referred to in a CASE_PARTY_ROLES row? (It should have been replaced).
                isCasePartyRolesElement = (Element) XPath.selectSingleNode (dsElement, "/ds/isCasePartyRoles");
                isCasePartyRoles = mGetBoolean (isCasePartyRolesElement.getText ());

                if (isCasePartyRoles)
                {
                    // Don't delete Parties that are still referred to.
                    deleteParty = false;
                }
            }
        }
        finally
        {
            paramsElement = null;
            dsElement = null;
            isCodedPartyElement = null;
            isCasePartyRolesElement = null;
        }

        return deleteParty;
    } // mCheckDeleteNonCodedParty()

    /**
     * (non-Javadoc)
     * Check to see if the party is a coded party and delete the address if not.
     *
     * @param pAddressId the address id
     * @param pCaseNumber the case number
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mCheckDeleteNonCodedPartyAddress (final String pAddressId, final String pCaseNumber)
        throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        boolean deleteAddress = false;
        Element paramsElement = null;
        Element dsElement = null;
        Element isNonCodedPartyAddressElement = null;
        boolean isNonCodedPartyAddress = false;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "addressId", pAddressId);
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            dsElement = invokeLocalServiceProxy (CaseDefs.CASE_SERVICE,
                    CaseDefs.CHECK_DELETE_NON_CODED_PARTY_ADDRESS_METHOD, inputDoc).getRootElement ();

            // Assume we will delete the Address unless we find a reason not to.
            deleteAddress = true;

            // Does the Address belong to a non-Coded Party?
            isNonCodedPartyAddressElement = (Element) XPath.selectSingleNode (dsElement, "/ds/isNonCodedPartyAddress");
            isNonCodedPartyAddress = mGetBoolean (isNonCodedPartyAddressElement.getText ());

            if ( !isNonCodedPartyAddress)
            {
                // Don't delete Coded Parties!
                deleteAddress = false;
            }
        }
        finally
        {
            paramsElement = null;
            dsElement = null;
            isNonCodedPartyAddressElement = null;
        }

        return deleteAddress;
    } // mCheckDeleteNonCodedPartyAddress()

    /**
     * (non-Javadoc)
     * Delete a non coded party.
     *
     * @param pDeleteNonCodedPartyElement the delete non coded party element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteNonCodedParty (final Element pDeleteNonCodedPartyElement)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element dsElement = null;
        Element deleteNonCodedPartyElement = null;
        Element paramsElement = null;

        try
        {
            // Take a copy of the Element to passed into the service.
            deleteNonCodedPartyElement = (Element) pDeleteNonCodedPartyElement.clone ();
            deleteNonCodedPartyElement = (Element) deleteNonCodedPartyElement.detach ();

            dsElement = new Element ("ds");
            dsElement.addContent (deleteNonCodedPartyElement);

            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "nonCodedParty", dsElement);

            invokeLocalServiceProxy (CaseDefs.CASE_SERVICE, CaseDefs.DELETE_NON_CODED_PARTY_METHOD, inputDoc);
        }
        finally
        {
            dsElement = null;
            deleteNonCodedPartyElement = null;
            paramsElement = null;
        }
    } // mDeleteNonCodedParty()

} // class DeleteNonCodedPartyCustomProcessor
