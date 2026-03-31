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
import uk.gov.dca.caseman.warrant_returns_service.java.WarrantReturnsXMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;;

/**
 * Class: TransferWarrantCustomProcessor.java
 * Description: If the warrant being added is a home warrant but is executed at a
 * foreign SUPS court, a new foreign warrant is created for the foreign
 * court, and a final return is generated for the home warrant
 * Service: Warrant
 * Method: addWarrant
 * 
 * Created: 18-May-2005
 * 
 * @author Tim Connor
 *
 *         Change History:
 *         UCT 404 - if it is a CCBC Warrant, no final return is inserted - Paul Robinson 25/4/06
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         18-Apr-2007, Chris Vincent: Removed condition around creating a final return only for non-CCBC
 *         warrants so are created for all warrants. Part of UCT_Group2 Defect 1351.
 */
public class TransferNewWarrantCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Constructor.
     */
    public TransferNewWarrantCustomProcessor ()
    {
        super ();
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
            final Element warrantElement = (Element) XPath.selectSingleNode (params, "/ds/Warrant");
            final Element transferElement = warrantElement.getChild ("ToTransfer");

            final String courtCode = warrantElement.getChildText ("IssuedBy");
            final String executingCourt = warrantElement.getChildText ("ExecutingCourtCode");
            final String localNumber = warrantElement.getChildText ("LocalNumber");

            if (WarrantUtils.isEmpty (localNumber) && !executingCourt.equals (courtCode))
            {
                final String warrantID = warrantElement.getChildText ("WarrantID");
                final String receiptDate = warrantElement.getChildText ("DateRequestReceived");
                final String caseNumber = warrantElement.getChildText ("CaseNumber");
                final String createdBy = warrantElement.getChildText ("CreatedBy");
                final String isCCBC = warrantElement.getChildText ("CCBCWarrant");
                final String userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);
                final String defendant2Name =
                        ((Element) XPath.selectSingleNode (warrantElement, "Defendant2/Name")).getText ();

                final Document targetCourt = getCourt (executingCourt);
                final String targetCourtName =
                        ((Element) XPath.selectSingleNode (targetCourt, "/Courts/Court/CourtName")).getText ();

                // Insert a final return even for CCBC warrants
                if (WarrantUtils.isEmpty (defendant2Name))
                {
                    insertFinalReturn (warrantID, receiptDate, courtCode, caseNumber, targetCourtName, createdBy,
                            userName, false);
                }
                else
                {
                    insertFinalReturn (warrantID, receiptDate, courtCode, caseNumber, targetCourtName, createdBy,
                            userName, true);
                }

                // If the toTransfer flag is set to "1" or "2", the warrant needs to be transferred. If the target court
                // is a SUPS court, do the transfer electronically
                final String transferStatus = transferElement.getText ();
                if (transferStatus.equals ("2"))
                {
                    // Do the electronic transfer
                    final Element ds = (Element) XPath.selectSingleNode (params, "/ds");
                    createForeignWarrant ((Element) ds.clone ());
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
     * Creates a foreign warrant record based on a given home warrant.
     *
     * @param root The home warrant details
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void createForeignWarrant (final Element root) throws SystemException, BusinessException
    {
        final Element warrantElement = root.getChild ("Warrant");
        final String executingCourt = warrantElement.getChildText ("ExecutingCourtCode");
        final String issueDate = warrantElement.getChildText ("IssueDate");

        // Clear out the warrant ID because the call to addWarrant will generate a new one
        warrantElement.getChild ("WarrantID").setText ("");
        warrantElement.getChild ("OwnedBy").setText (executingCourt);
        warrantElement.getChild ("HomeCourtIssueDate").setText (issueDate);
        warrantElement.getChild ("ToTransfer").setText ("0");
        warrantElement.getChild ("TransferDate").setText ("");
        warrantElement.getChild ("BailiffAreaNo").setText ("");
        warrantElement.removeChild ("SequenceNo");

        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "warrantDetails", root);

        this.invokeLocalServiceProxy ("ejb/WarrantServiceLocal", "addWarrantLocal", paramsElement.getDocument ());
    }

    /**
     * Insert the final return 147 (WARRANT_FORWARDED) against the provided home warrant.
     *
     * @param warrantID the warrant ID
     * @param receiptDate the receipt date
     * @param courtCode the court code
     * @param caseNumber the case number
     * @param targetCourtName the target court name
     * @param createdBy the created by
     * @param userName the user name
     * @param secondDefendant the second defendant
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void insertFinalReturn (final String warrantID, final String receiptDate, final String courtCode,
                                    final String caseNumber, final String targetCourtName, final String createdBy,
                                    final String userName, final boolean secondDefendant)
        throws SystemException, BusinessException
    {
        final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

        final WarrantReturnsXMLBuilder builder = new WarrantReturnsXMLBuilder (warrantID, "147", todaysDate);
        builder.setCourtCode ("0"); // 147 is a National return code, so set to '0'
        builder.setAdditionalDetails (targetCourtName);
        builder.setReceiptDate (receiptDate);
        builder.setDefendantID ("1");
        builder.setExecutedBy (courtCode);
        builder.setCaseNumber (caseNumber);
        builder.setNoticeRequired ("Y");
        builder.setCreatedBy (userName);
        Element warrantReturnsElement = builder.getXMLElement ();

        // Wrap the 'WarrantReturns' XML in the 'params/param' structure.
        Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "NewReturn", warrantReturnsElement);

        // Call the service.
        this.invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal",
                paramsElement.getDocument ());

        if (secondDefendant)
        {
            // Create a return for the second defendant as well
            builder.setDefendantID ("2");
            warrantReturnsElement = builder.getXMLElement ();

            // Wrap the 'WarrantReturns' XML in the 'params/param' structure.
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "NewReturn", warrantReturnsElement);

            // Call the service.
            this.invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal",
                    paramsElement.getDocument ());
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

        return this.invokeLocalServiceProxy ("ejb/CourtServiceLocal", "getCourtLongLocal",
                paramsElement.getDocument ());
    }
}