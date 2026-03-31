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

import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.warrant_returns_service.java.WarrantReturnsXMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Class: TransferUpdatedWarrantCustomProcessor.java
 * Description: If the warrant being updated is an execution warrant and its executing
 * court has been changed a case event, a final return, and a foreign
 * warrant should be created. There is some logic that determines what
 * gets created in different situations. Below is a description of the
 * logic :
 * If executing court has changed
 * Generate final return (and case event if it is a home warrant)
 * If EXECUTION home warrant
 * If not printed
 * Electronically transfer
 * If EXECUTION foreign warrant
 * If automatically created
 * If not printed
 * Electronically transfer
 * Service: Warrant
 * Method: updateWarrant
 *
 * Created: 24-May-2005
 * 
 * @author Tim Connor
 *
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         15-Oct-2007, Chris Vincent: Removed condition around creating a final return only for non-CCBC
 *         warrants so are created for all warrants. UCT_Group2 Defect 1600.
 *         06-Aug-2010, Troy Baines CM 6, TRAC2848. Check to see if re-issued warrant before transferring.
 *         11-Dec-2013, Chris Vincent: Added CONTROL warrants (whcih are replacing EXECUTION warrants) to the if
 *         statement. Trac 5025
 *
 */
public class TransferUpdatedWarrantCustomProcessor extends AbstractCustomProcessor
{
    
    /**  Local Service Proxy used to call other local services. */
    private final AbstractSupsServiceProxy localServiceProxy;
    
    /**  XPath used to retrieve the new warrant sequence number from the getNextID call. */
    private final XPath sequenceNumberPath;
    
    /**  XPath used to retrieve the new warrant ID number from the getNextID call. */
    private final XPath warrantIDPath;
    
    /**  XPath used to retrieve the current enforcement number from the getNextID call. */
    private final XPath enforcementLetterPath;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public TransferUpdatedWarrantCustomProcessor () throws JDOMException
    {
        localServiceProxy = new SupsLocalServiceProxy ();
        sequenceNumberPath = XPath.newInstance ("/ds/Warrant/SequenceNumber");
        warrantIDPath = XPath.newInstance ("/ds/Warrant/WarrantID");
        enforcementLetterPath = XPath.newInstance ("/ds/Warrant/EnforcementLetter");
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param log the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log log)
        throws BusinessException, SystemException
    {
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        String sXml = null;

        try
        {
            final Element warrantElement =
                    (Element) XPath.selectSingleNode (params, "/params/param[@name='warrantDetails']/ds/Warrant");

            final String warrantID = warrantElement.getChildText ("WarrantID");
            final String warrantNumber = warrantElement.getChildText ("WarrantNumber");
            final String receiptDate = warrantElement.getChildText ("DateRequestReceived");
            final String warrantType = warrantElement.getChildText ("WarrantType");
            final String executingCourt = warrantElement.getChildText ("ExecutingCourtCode");
            final String originalExecutingCourt = warrantElement.getChildText ("OriginalExecutingCourt");
            final String localNumber = warrantElement.getChildText ("LocalNumber");
            final String printStatus = warrantElement.getChildText ("PrintStatus");
            final String transferDate = warrantElement.getChildText ("TransferDate");
            final String courtCode = warrantElement.getChildText ("IssuedBy");
            final String caseNumber = warrantElement.getChildText ("CaseNumber");
            final String bailiffAreaNo = warrantElement.getChildText ("BailiffAreaNo");
            final String userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            if ( !executingCourt.equals (originalExecutingCourt))
            {
                // The executing court has changed for an execution warrant.
                // Get the details of the target court
                final Document targetCourt = getCourt (executingCourt);
                final String isSUPS =
                        ((Element) XPath.selectSingleNode (targetCourt, "/Courts/Court/SUPSCourt")).getText ();
                final String targetCourtName =
                        ((Element) XPath.selectSingleNode (targetCourt, "/Courts/Court/CourtName")).getText ();

                // Create a final return for the warrant. the return code is 147 (WARRANT FORWARDED)
                final String defendant2Name =
                        ((Element) XPath.selectSingleNode (warrantElement, "Defendant2/Name")).getText ();
                final String createdBy = warrantElement.getChildText ("CreatedBy");
                // Insert a final return even for CCBC warrants
                if (WarrantUtils.isEmpty (defendant2Name))
                {
                    insertFinalReturn (warrantID, receiptDate, courtCode, caseNumber, targetCourtName, createdBy,
                            localNumber, userName, false);
                }
                else
                {
                    insertFinalReturn (warrantID, receiptDate, courtCode, caseNumber, targetCourtName, createdBy,
                            localNumber, userName, true);
                }

                // If the warrant has not yet been printed, and it is either a home warrant, or an automatically
                // generated foreign warrant, it can be automatically transferred to the executing court.
                if ((warrantType.equals ("EXECUTION") || warrantType.equals ("CONTROL")) &&
                        printStatus.equals ("TO PRINT") && warrantNumber.indexOf ("/") == -1)
                {
                    if (WarrantUtils.isEmpty (localNumber) ||
                            !WarrantUtils.isEmpty (localNumber) && bailiffAreaNo.equals ("99"))
                    {
                        // Check that the executing court is a sups court
                        final Element transferElement = warrantElement.getChild ("ToTransfer");
                        if (isSUPS.equals ("Y"))
                        {
                            // The executing court is a SUPS court and warrant is an execution type, so create a foreign
                            // warrant
                            final Element ds = (Element) XPath.selectSingleNode (params,
                                    "/params/param[@name='warrantDetails']/ds");
                            createForeignWarrant ((Element) ds.clone ());
                            // Mark the warrant as being "TRANSFERRED"
                            final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
                            warrantElement.getChild ("TransferDate").setText (todaysDate);
                            transferElement.setText ("2");
                        }
                        else
                        {
                            // The executing court is not a SUPS court, so set the to_transfer flag
                            // Mark the warrant as "TO TRANSFER"
                            transferElement.setText ("1");
                        }
                    }
                }
            }

            /* Output the original XML. */
            sXml = xmlOutputter.outputString (params.getRootElement ());
            writer.write (sXml);

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
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
        final String executingCourt = warrantElement.getChild ("ExecutingCourtCode").getText ();
        final String issueDate = warrantElement.getChild ("IssueDate").getText ();

        // Clear out the warrant ID because the call to addWarrant will generate a new one
        warrantElement.getChild ("WarrantID").setText ("");
        warrantElement.getChild ("LocalNumber").setText ("");
        warrantElement.getChild ("OwnedBy").setText (executingCourt);
        warrantElement.getChild ("HomeCourtIssueDate").setText (issueDate);
        warrantElement.getChild ("ToTransfer").setText ("0");
        warrantElement.getChild ("TransferDate").setText ("");
        warrantElement.getChild ("BailiffAreaNo").setText ("");
        warrantElement.removeChild ("SequenceNo");

        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "warrantDetails", root);
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String xml = xmlOutputter.outputString (paramsElement);
        localServiceProxy.getJDOM ("ejb/WarrantServiceLocal", "addWarrantLocal", xml);
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
     * @param localNumber the local number
     * @param userName the user name
     * @param secondDefendant the second defendant
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void insertFinalReturn (final String warrantID, final String receiptDate, final String courtCode,
                                    final String caseNumber, final String targetCourtName, final String createdBy,
                                    final String localNumber, final String userName, final boolean secondDefendant)
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
        builder.setLocalNumber (localNumber);
        builder.setNoticeRequired ("Y");
        builder.setCreatedBy (userName);
        Element warrantReturnsElement = builder.getXMLElement ();

        // Wrap the 'WarrantReturns' XML in the 'params/param' structure.
        Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "NewReturn", warrantReturnsElement);

        // Translate to string.
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        String sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        localServiceProxy.getJDOM ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal", sXmlParams);

        if (secondDefendant)
        {
            // Create a return for the second defendant as well
            builder.setDefendantID ("2");
            warrantReturnsElement = builder.getXMLElement ();

            // Wrap the 'WarrantReturns' XML in the 'params/param' structure.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "NewReturn", warrantReturnsElement);

            // Translate to string.
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy.getJDOM ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal", sXmlParams);
        }
    }

    /**
     * Retrieve the details for a court.
     *
     * @param courtCode The code of the court to retrieve the details for
     * @return The court document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document getCourt (final String courtCode) throws BusinessException, SystemException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "courtId", courtCode);
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);
        return localServiceProxy.getJDOM ("ejb/CourtServiceLocal", "getCourtLongLocal", sXmlParams);
    }
}