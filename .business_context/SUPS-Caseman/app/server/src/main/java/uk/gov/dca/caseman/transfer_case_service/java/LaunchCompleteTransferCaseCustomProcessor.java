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

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
import uk.gov.dca.caseman.common.java.CourtHelper;
import uk.gov.dca.caseman.common.java.SystemDateHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Service: TransferCase
 * Method: completeTransferCase
 * Class: LaunchCompleteTransferCaseCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 27-Jul-2005
 *         Description:
 *         Launches the 'Complete Transfer Case' processing, provided the Transfer Court is a SUPS Court.
 * 
 *         Change History:
 *         09-Aug-2005 Phil Haferer:
 *         31-Aug-2005 Phil Haferer: Defect 1172 - Only generate the Transfer In Case Event if we transferring
 *         to different court.
 *         13-Sep-2005 Phil Haferer: Defect 1297 - The auto Transfer In Case Event needs to be against the
 *         destination court, rather the current owning current.
 *         10-Oct-2005 Phil Haferer: CASEMAN_UCT Defect 162 - Event Details was showing 'Court: NULL',
 *         as the Court Name was being selected using PREVIOUS_COURT_CODE, rather than ADMIN_CRT_CODE
 *         (which is just about to be assigned to the PREVIOUS_COURT_CODE).
 *         12-May-2006 Phil Haferer: Changes to accommodate the manual transfer of Cases with Outstanding AE's
 *         to legacy Courts.
 *         UCT TD 604: "Transfer process with AE".
 *         27/11/2006 Phil Haferer: Added code to specify the the User Name, Section and transfer Court Code
 *         for a Transfer In event.
 *         (UCT_CASEMAN 758: BMS on SUPS to SUPS transfer).
 *         30/11/2006 Phil Haferer Changed the constant SYSTEM_TRANSCTION_SECTION to SYSTEM_TRANSFER_SECTION.
 *         (UCT_CASEMAN 758: BMS on SUPS to SUPS transfer).
 *         11/06/2012 Chris Vincent, added mCompleteTransferCaseUpdateWft to update any WFT records created since the
 *         the start transfer service was called. Trac 4692.
 */
public class LaunchCompleteTransferCaseCustomProcessor extends AbstractCustomProcessor
{
    
    /** The Constant TRANSFER_CASE_SERVICE. */
    private static final String TRANSFER_CASE_SERVICE = "ejb/TransferCaseServiceLocal";
    
    /** The Constant EXECUTE_COMPLETE_TRANSFER_CASE. */
    private static final String EXECUTE_COMPLETE_TRANSFER_CASE = "executeCompleteTransferCaseLocal";
    
    /** The Constant COMPLETE_TRANSFER_CASE_UPDATE_WFT_METHOD. */
    private static final String COMPLETE_TRANSFER_CASE_UPDATE_WFT_METHOD = "completeTransferCaseUpdateWftLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public LaunchCompleteTransferCaseCustomProcessor ()
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
     * @throws BusinessException the business exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pDocParams, final Writer pWriter, final Log pLog)
        throws SystemException, BusinessException
    {
        Element transferCaseElement = null;
        String transferCourtCode = null;
        String owningCourtCode = null;
        String supsCentralisedFlag = null;
        String outstandingAE = null;
        String transferReasonCode = null;
        String transferredInEventId = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            transferCaseElement = pDocParams.getRootElement ();

            // Before performing the transfer operations, check that the court
            // that is being transferred to is a SUPS Court.
            transferCourtCode = transferCaseElement.getChild ("TransferCourtCode").getText ();
            supsCentralisedFlag = CourtHelper.GetCourtSupsCentralisedFlag (transferCourtCode);
            if (supsCentralisedFlag.equals ("Y"))
            {
                // Determine which Event needs to be generated.
                transferReasonCode = transferCaseElement.getChild ("TransferReason").getText ();
                transferredInEventId = TransferReasonHelper.GetTransferReasonEventId (transferReasonCode,
                        TransferReasonHelper.TRANSFER_TYPE_IN);

                // Generate the Event, provided this is not just a Jurisdication change with the current Court.
                owningCourtCode = transferCaseElement.getChild ("OwningCourtCode").getText ();
                if ( !owningCourtCode.equals (transferCourtCode))
                {
                    mInsertTransferredInCaseEvent (transferCaseElement, transferredInEventId);
                }

                // Update any WINDOW_FOR_TRIAL rows created since transfer was started (Trac 4692).
                mCompleteTransferCaseUpdateWft (transferCaseElement);

                mSetTransferCaseColumnsForCompletion (transferCaseElement);
                mExecuteCompleteTransferCase (transferCaseElement);
            }
            else
            {
                // If the Case is being transferred to a Legacy Court, but that Case has
                // an Attachment of Earnings Application associated with it, which refer to parties
                // that have a Role that is not defined in the legacy system, the Case must be transferred
                // manually.
                // These Cases will the OutstandingAE element set to Y.
                outstandingAE = transferCaseElement.getChildText ("OutstandingAE");
                if (outstandingAE.equals ("Y"))
                {
                    // These Cases must have their columns updated so that the overnight transfer
                    // does not pick them up.
                    mSetTransferCaseColumnsForLegacyOutstandingAECase (transferCaseElement);
                    mExecuteCompleteTransferCase (transferCaseElement);
                }
            }

            /* Output the resulting XML. */
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (transferCaseElement);
            pWriter.write (sXmlParams);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return;
    } // process()

    /**
     * (non-Javadoc)
     * Insert the transferred in case.
     *
     * @param pTransferCaseElement the transfer case element
     * @param pTransferredInEventId the transferred in event id
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private Element mInsertTransferredInCaseEvent (final Element pTransferCaseElement,
                                                   final String pTransferredInEventId)
        throws SystemException, BusinessException, JDOMException
    {
        Element caseEventElement = null;
        Element insertCaseEventRowElement = null;
        String caseNumber = null;
        String eventDate = null;
        String receiptDate = null;
        String courtCode = null;
        String userName = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        String eventDetails = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            caseNumber = pTransferCaseElement.getChild ("CaseNumber").getText ();
            eventDate = SystemDateHelper.getSystemDate ();
            receiptDate = pTransferCaseElement.getChild ("TransferReceiptDate").getText ();
            courtCode = pTransferCaseElement.getChild ("TransferCourtCode").getText ();
            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseNumber */caseNumber,
                    /* String standardEventId */pTransferredInEventId, /* String eventDate */eventDate,
                    /* String receiptDate */receiptDate, /* String courtCode */courtCode);

            // Set the case event user name
            caseEventXMLBuilder.setUserName (userName);

            // 'From: <Previous-Court-Name>
            eventDetails = mGetEventDetails (pTransferCaseElement);
            caseEventXMLBuilder.setEventDetails (eventDetails);

            // As this event represents an activity in another court (from the initiator)
            // override the standard setting for User, Court and Section so that BMS
            // is counted against the transferred to court.
            caseEventXMLBuilder.setUserName (CaseEventXMLBuilder.CASM_USER_PREFIX + courtCode);
            caseEventXMLBuilder.setCreatingCourt (courtCode);
            caseEventXMLBuilder.setCreatingSection (CaseEventXMLBuilder.SYSTEM_TRANSFER_SECTION);

            // Generate a new XML 'document' from the CaseEvent object.
            caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

            // Wrap the 'CaseEvent' XML in the 'params/param' structure.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            insertCaseEventRowElement = localServiceProxy
                    .getJDOM (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.INSERT_CASE_EVENT_ROW_METHOD, sXmlParams)
                    .getRootElement ();

        }
        finally
        {
            caseEventElement = null;
            caseNumber = null;
            eventDate = null;
            caseEventXMLBuilder = null;
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return insertCaseEventRowElement;
    } // mInsertTransferredInCaseEvent()

    /**
     * (non-Javadoc)
     * Construct a string of the form :-
     * 'From: <Previous-Court-Name>'.
     *
     * @param pTransferCaseElement the transfer case element
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetEventDetails (final Element pTransferCaseElement)
        throws SystemException, BusinessException, JDOMException
    {
        final StringBuffer eventDetails = new StringBuffer ();
        String previousCourtCode = null;
        String courtName = null;

        try
        {
            eventDetails.append ("From: ");
            previousCourtCode = pTransferCaseElement.getChild ("OwningCourtCode").getText ();
            courtName = CourtHelper.GetCourtName (previousCourtCode);
            eventDetails.append (courtName);
        }
        finally
        {
            previousCourtCode = null;
            courtName = null;
        }

        return eventDetails.toString ();
    } // mGetEventDetails()

    /**
     * (non-Javadoc)
     * Set transfer case columns for completion.
     *
     * @param pTransferCaseElement the transfer case element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mSetTransferCaseColumnsForCompletion (final Element pTransferCaseElement)
        throws SystemException, BusinessException
    {
        String currentCourtCode = null;
        String transferCourtCode = null;
        String newCaseType = null;
        String todaysDate = null;

        // Copy the current Court Code (ADMIN_CRT_CODE => PREVIOUS_COURT).
        currentCourtCode = pTransferCaseElement.getChild ("OwningCourtCode").getText ();
        pTransferCaseElement.getChild ("PreviousCourtCode").setText (currentCourtCode);

        // Change the Owning Court Code to the Transfer Court Code (TRANS_CRT_CODE => ADMIN_CRT_CODE).
        transferCourtCode = pTransferCaseElement.getChild ("TransferCourtCode").getText ();
        pTransferCaseElement.getChild ("OwningCourtCode").setText (transferCourtCode);

        // Discard the Transfer Court Code.
        pTransferCaseElement.getChild ("TransferCourtCode").setText ("");

        // Change the Case Type to the Transfer Case Type.
        newCaseType = pTransferCaseElement.getChild ("NewCaseType").getText ();
        pTransferCaseElement.getChild ("CaseType").setText (newCaseType);

        // Discard the Transfer Case Type.
        pTransferCaseElement.getChild ("NewCaseType").setText ("");

        // Reset the Case's Status.
        pTransferCaseElement.getChild ("CaseStatus").setText ("");

        // Discard the Transfer Reason.
        pTransferCaseElement.getChild ("TransferReason").setText ("");

        // Record the date this transfer occurred (DATE_TRANSFERRED_IN).
        todaysDate = SystemDateHelper.getSystemDate ();
        pTransferCaseElement.getChild ("DateTransferredIn").setText (todaysDate);

        // Discard the Transfer Status.
        pTransferCaseElement.getChild ("TransferStatus").setText ("");

        // Discard the Receipt Date (XFER_RECEIPT_DATE).
        pTransferCaseElement.getChild ("TransferReceiptDate").setText ("");

        // Discard insolvency number
        pTransferCaseElement.getChild ("InsolvencyNumber").setText ("");

    } // mSetTransferCaseColumnsForCompletion()

    /**
     * Performs changes to the columns of a Case that is to be menually transferred
     * to a legacy court. Equivalent of mSetTransferCaseColumnsForCompletion() for Cases
     * which have "outstanding AE's".
     *
     * @param pTransferCaseElement the transfer case element
     */
    private void mSetTransferCaseColumnsForLegacyOutstandingAECase (final Element pTransferCaseElement)
    {
        // Don't copy the current Court Code to the Previous Court (ADMIN_CRT_CODE => PREVIOUS_COURT),
        // as the Case isn't actually moving within this database.

        // Don't change the Owning Court Code to the Transfer Court Code (TRANS_CRT_CODE => ADMIN_CRT_CODE),
        // again because the Case isn't actually moving with this database.

        // Don't discard the Transfer Court Code - this can still tell us where the Case was manually
        // transferred to.

        // Don't change the Case Type to the Transfer Case Type - as we haven't actually moved to
        // the transfer court, this new case type may be appropriate to the new court.

        // Don't discard the Transfer Case Type - it may still be of interest.

        // Don't reset the Case's Status - we still want to see that it has been transferred.

        // Don't discard the Transfer Reason - again this may still be of interest.

        // Don't record the date this transfer occurred (DATE_TRANSFERRED_IN),
        // as it wasn't actually transferred in, in this situation.

        // Still discard the Transfer Status, as we don't want the Case to be picked up by the overnight
        // transfer process.
        pTransferCaseElement.getChild ("TransferStatus").setText ("");

        // Don't discard the Receipt Date (XFER_RECEIPT_DATE),
        // as this is the date the request to transfer the case manually was received.

    } // mSetTransferCaseColumnsForLegacyOutstandingAECase()

    /**
     * (non-Javadoc)
     * Complete case transfer.
     *
     * @param pTransferCaseElement the transfer case element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mExecuteCompleteTransferCase (final Element pTransferCaseElement)
        throws SystemException, BusinessException
    {
        Element paramsElement = null;
        Element transferCaseElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            transferCaseElement = (Element) pTransferCaseElement.clone ();
            transferCaseElement = (Element) transferCaseElement.detach ();
            XMLBuilder.addParam (paramsElement, "transferCase", transferCaseElement);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy.getJDOM (TRANSFER_CASE_SERVICE, EXECUTE_COMPLETE_TRANSFER_CASE, sXmlParams);
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }
    } // mExecuteCompleteTransferCase()

    /**
     * (non-Javadoc)
     * Updates any Window for Trial records created since the transfer was started (in case failed after starting and
     * left for a period of time)
     * Trac 4692.
     *
     * @param pTransferCaseElement the transfer case element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mCompleteTransferCaseUpdateWft (final Element pTransferCaseElement)
        throws SystemException, BusinessException
    {
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", pTransferCaseElement.getChild ("CaseNumber").getText ());
            XMLBuilder.addParam (paramsElement, "adminCourtCode",
                    pTransferCaseElement.getChild ("TransferCourtCode").getText ());

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy.getJDOM (TRANSFER_CASE_SERVICE, COMPLETE_TRANSFER_CASE_UPDATE_WFT_METHOD, sXmlParams);

        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return;
    } // mCompleteTransferCaseUpdateWft()

} // class LaunchCompleteTransferCaseCustomProcessor
