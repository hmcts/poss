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
package uk.gov.dca.caseman.warrant_service.java;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.system_data_service.java.SequenceNumberHelper;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: DataProcessor.java
 * 
 * Created: 29-Mar-2005
 * 
 * @author Tim Connor
 *
 *         Change History:
 *         14-Mar-2006 Phil Haferer: Introduced the method mGetNextWarrantSequenceNumber() in order to replace the
 *         usage of Oracle Sequence Number Generators in add_warrant.xml, as these will not guarentee
 *         sequential numbers in the live environment.
 *
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         20-Jun-2006 Phil Haferer (EDS): Modified process() with a call to
 *         SequenceNumberHelper.getNextValueCommitted(),
 *         so that the Warrants sequences with now be retrieved as part of a separate transaction.
 *         04-Dec-2006 Steve Blair: UCT Defect 824 - Need to set WARRANT.DATE_PRINTED
 *         for manually entered foreign warrants so need additional node in
 *         the map.
 *         22-Dec-2006 Steve Blair: UCT Defect 824 - Need to set WARRANT.DATE_REPRINTED
 *         for manually entered foreign warrants so need additional node in
 *         the map.
 *         04/07/2013 Chris Vincent (Trac 4908). As part of case numbering changes, the mechanism for generating home,
 *         foreign
 *         and reissued warrant numbers has changed. Checks are made to see if the new numbering system is active
 *         and then the number is generated based upon that check. New methods getNewNumberingActive and
 *         getNextWarrantNumber have been introduced.
 *         11/12/2013 Chris Vincent (Trac 5025). As part of TCE changes, CONTROL warrants are replacing EXECUTION
 *         warrants so
 *         need to include CONTROL warrants in the logic for transferring warrants.
 */
public class DataProcessor extends AbstractCasemanCustomProcessor
{

    /**  XPath to retrieve the warrant details from the input DOM. */
    private final XPath warrantPath;

    /**
     * Default Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public DataProcessor () throws JDOMException
    {
        super ();

        warrantPath = XPath.newInstance ("/params/param[@name='warrantDetails']/ds/Warrant");
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log pLog) throws SystemException, BusinessException
    {
        try
        {
            final Element warrantElement = (Element) warrantPath.selectSingleNode (params);

            // UCT Defect 824 - Additional nodes now in map so need to check
            // that other screens using the service have that node in the DOM or
            // else the service will fail.
            if (warrantElement.getChild ("DatePrinted") == null)
            {
                warrantElement.addContent (new Element ("DatePrinted"));
            }
            if (warrantElement.getChild ("DateReprinted") == null)
            {
                warrantElement.addContent (new Element ("DateReprinted"));
            }

            // Retrieve the issuing court of the warrant
            final String issuingCourt = warrantElement.getChildText ("IssuedBy");

            // Retrieve the ID of the warrant passed. The ID will only be populated if a warrant is being reissued
            final Element warrantIDElement = warrantElement.getChild ("WarrantID");
            String warrantID = null;
            if (warrantIDElement != null)
            {
                warrantID = warrantIDElement.getText ();
            }

            // Retrieve the warrant number passed in, and its element so that it can be updated
            final Element warrantNumberElement = warrantElement.getChild ("WarrantNumber");
            String warrantNumber = null;
            if (warrantNumberElement != null)
            {
                warrantNumber = warrantNumberElement.getText ();
            }

            final String executingCourt = warrantElement.getChildText ("ExecutingCourtCode");
            final String owningCourt = warrantElement.getChildText ("OwnedBy");

            // Retrieve the local number passed in, and its element so that it can be updated
            final Element localNumberElement = warrantElement.getChild ("LocalNumber");
            String localNumber = null;
            if (localNumberElement != null)
            {
                localNumber = localNumberElement.getText ();
            }

            // Set the transfer status to 0 (not transferred). This will then be updated if necessary
            final Element transferElement = warrantElement.getChild ("ToTransfer");
            transferElement.setText ("0");

            // Determine if the new numbering system is active
            final String newNumberingScheme = getNewNumberingActive ();

            if ( !WarrantUtils.isEmpty (warrantID))
            {
                // The warrant ID is not empty, so an existing warrant has been provided.
                // This is the normal case when RE-ISSUING A HOME WARRANT.

                // Clear out the warrant ID so that a new one is retrieved from warrants_sequence.
                // Otherwise the original warrant would be updated instead of the new one being created
                warrantIDElement.setText ("");

                String sequenceNo = null;
                if (newNumberingScheme.equals ("true"))
                {
                    // New numbering scheme, reissued warrant numbers are now global as opposed to local
                    sequenceNo = mGetNextWarrantSequenceNumber ("0", owningCourt, warrantID, warrantNumber);
                }
                else
                {
                    // Retrieve the next sequence number from the court specific SYSTEM_DATA table.
                    sequenceNo = mGetNextWarrantSequenceNumber (issuingCourt, owningCourt, warrantID, warrantNumber);
                }

                while (sequenceNo.length () < 5)
                {
                    sequenceNo = "0" + sequenceNo;
                }

                // set the warrant number
                final String year = new SimpleDateFormat ("yy").format (new Date ());
                warrantNumber = sequenceNo + "/" + year;
                warrantNumberElement.setText (warrantNumber);

                final String caseNumber = warrantElement.getChildText ("CaseNumber");

                // Mark the old record as re-issued
                final String defendant2Name =
                        ((Element) XPath.selectSingleNode (warrantElement, "Defendant2/Name")).getText ();
                final Element receiptDateElement = warrantElement.getChild ("DateRequestReceived");
                final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (paramsElement, "courtCode", issuingCourt);
                XMLBuilder.addParam (paramsElement, "warrantID", warrantID);
                XMLBuilder.addParam (paramsElement, "caseNumber", caseNumber);
                XMLBuilder.addParam (paramsElement, "newWarrantNumber", warrantNumber);
                XMLBuilder.addParam (paramsElement, "receiptDate", receiptDateElement.getText ());
                XMLBuilder.addParam (paramsElement, "defendant2", defendant2Name);

                this.invokeLocalServiceProxy ("ejb/WarrantServiceLocal", "reissueWarrantLocal",
                        paramsElement.getDocument ());
            }
            else if (WarrantUtils.isEmpty (warrantNumber))
            {
                // The warrant number has not been provided, so we need to generate one.
                // This is the normal case when CREATING A HOME WARRANT.

                if (newNumberingScheme.equals ("true"))
                {
                    // New numbering scheme, retrieve the next number from the database sequence/function
                    warrantNumberElement.setText (getNextWarrantNumber ());
                }
                else
                {
                    // Retrieve the next sequence number from the SYSTEM_DATA table.
                    String sequenceNo =
                            mGetNextWarrantSequenceNumber (issuingCourt, owningCourt, warrantID, warrantNumber);

                    // Generate a new warrant number and ID
                    final String prefix = getEnforcementLetter ();

                    while (sequenceNo.length () < 7)
                    {
                        sequenceNo = "0" + sequenceNo;
                    }

                    // Set the warrant number
                    warrantNumberElement.setText (prefix + sequenceNo);
                }

                // Check to see if the warrant needs to be transferred
                final String warrantType = warrantElement.getChildText ("WarrantType");
                if ((warrantType.equals ("EXECUTION") || warrantType.equals ("CONTROL")) &&
                        !issuingCourt.equals (executingCourt))
                {
                    // Check that the executing court is a sups court
                    final Document targetCourt = getCourt (executingCourt);
                    final String isSUPS =
                            ((Element) XPath.selectSingleNode (targetCourt, "/Courts/Court/SUPSCourt")).getText ();
                    if (isSUPS.equals ("Y"))
                    {
                        // set the flag to transferred because the automatic transfer will happen shortly
                        transferElement.setText ("2");
                        final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
                        warrantElement.getChild ("TransferDate").setText (todaysDate);
                    }
                    else
                    {
                        transferElement.setText ("1");
                    }
                }
            }
            else if (WarrantUtils.isEmpty (localNumber))
            {
                // The warrant number has been provided, but a local number has not,
                // so we need to generate one.
                // This is the normal case when CREATING A FOREIGN WARRANT.

                if (newNumberingScheme.equals ("true"))
                {
                    // New numbering scheme, set the local warrant number to be the warrant number
                    localNumberElement.setText (warrantNumber);
                }
                else
                {
                    // Retrieve the next sequence number from the SYSTEM_DATA table.
                    String sequenceNo =
                            mGetNextWarrantSequenceNumber (issuingCourt, owningCourt, warrantID, warrantNumber);

                    final String prefix = getEnforcementLetter ();

                    while (sequenceNo.length () < 5)
                    {
                        sequenceNo = "0" + sequenceNo;
                    }

                    // Set the local number
                    localNumberElement.setText ("FW" + prefix + sequenceNo);
                }
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return params;
    }

    /**
     * (non-Javadoc)
     * Get the next warrent sequence number.
     *
     * @param pIssuingCourt the issuing court
     * @param pOwningCourt the owning court
     * @param pWarrantID the warrant ID
     * @param pWarrantNumber the warrant number
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetNextWarrantSequenceNumber (final String pIssuingCourt, final String pOwningCourt,
                                                  final String pWarrantID, final String pWarrantNumber)
        throws SystemException, BusinessException
    {
        String sequenceNo = null;

        if (null == pWarrantID || pWarrantID.equals (""))
        {
            if (null == pWarrantNumber || pWarrantNumber.equals (""))
            {
                sequenceNo = SequenceNumberHelper.getNextValueCommitted (/* String pAdminCourtCode */pIssuingCourt,
                        /* String pItem */"HOME", /* IComponentContext pContext */this.m_context);
            }
            else
            {
                sequenceNo = SequenceNumberHelper.getNextValueCommitted (/* String pAdminCourtCode */pOwningCourt,
                        /* String pItem */"FOREIGN", /* IComponentContext pContext */this.m_context);
            }
        }
        else
        {
            sequenceNo = SequenceNumberHelper.getNextValueCommitted (/* String pAdminCourtCode */pIssuingCourt,
                    /* String pItem */"REISSUE", /* IComponentContext pContext */this.m_context);
        }

        return sequenceNo;
    } // mGetNextWarrantSequenceNumber()

    /**
     * Gets the enforcement letter.
     *
     * @return the enforcement letter
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getEnforcementLetter () throws SystemException, BusinessException
    {
        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());

            final Document result = invokeLocalServiceProxy ("ejb/WarrantServiceLocal", "getEnforcementLetterLocal",
                    paramsElement.getDocument ());
            final Element letterElement = (Element) XPath.selectSingleNode (result, "/ds/EnforcementLetter");

            return letterElement.getText ();
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to retrieve enforcement letter: " + e.getMessage (), e);
        }
    }

    /**
     * Gets the new numbering active.
     *
     * @return the new numbering active
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getNewNumberingActive () throws SystemException, BusinessException
    {
        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());

            final Document result = invokeLocalServiceProxy ("ejb/SystemDataServiceLocal", "isNewNumberingActiveLocal",
                    paramsElement.getDocument ());
            final Element resultElement =
                    (Element) XPath.selectSingleNode (result, "/CaseNumbering/NewNumbering/IsActive");

            return resultElement.getText ();
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to retrieve numbering indicator: " + e.getMessage (), e);
        }
    }

    /**
     * Gets the next warrant number.
     *
     * @return the next warrant number
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getNextWarrantNumber () throws SystemException, BusinessException
    {
        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());

            final Document result = invokeLocalServiceProxy ("ejb/WarrantServiceLocal", "getNextWarrantNumberLocal",
                    paramsElement.getDocument ());
            final Element WarrantElement = (Element) XPath.selectSingleNode (result, "/ds/Warrant/WarrantNumber");

            return WarrantElement.getText ();
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to retrieve Warrant Number: " + e.getMessage (), e);
        }
    }

    /**
     * Retrieve the details for a court.
     *
     * @param courtCode The code of the court to retrieve the details for.
     * @return The court document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document getCourt (final String courtCode) throws BusinessException, SystemException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "courtId", courtCode);

        return invokeLocalServiceProxy ("ejb/CourtServiceLocal", "getCourtLongLocal", paramsElement.getDocument ());
    }
}