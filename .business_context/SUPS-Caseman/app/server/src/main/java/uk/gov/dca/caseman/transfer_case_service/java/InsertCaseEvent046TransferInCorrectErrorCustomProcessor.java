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
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
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
 * Method: cancelTransferCase
 * Class: InsertCaseEvent046TransferInCorrectErrorCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 27-Jul-2005
 *         Description:
 *         Inserts a CASE_EVENTS row to represent the cancellation of a Case Transfer.
 * 
 *         Change History:
 *         05-Oct-2005 Phil Haferer: Set the User Id for the Case Event.
 *         06-Mar-2006 Phil Haferer: Added call to new method CancelTransferCaseUpdateWft() in response
 *         to TD 2263: UC003 Mark Case For Transfer - WFT status not changed.
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 */
public class InsertCaseEvent046TransferInCorrectErrorCustomProcessor extends AbstractCustomProcessor
{
    
    /** The Constant TRANSFER_CASE_SERVICE. */
    private static final String TRANSFER_CASE_SERVICE = "ejb/TransferCaseServiceLocal";
    
    /** The Constant CANCEL_TRANSFER_CASE_UPDATE_WFT_METHOD. */
    private static final String CANCEL_TRANSFER_CASE_UPDATE_WFT_METHOD = "cancelTransferCaseUpdateWftLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public InsertCaseEvent046TransferInCorrectErrorCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param pDocParams the doc params
     * @param pWriter the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pDocParams, final Writer pWriter, final Log pLog)
        throws BusinessException, SystemException
    {
        Element transferCaseElement = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        String caseNumber = null;
        String eventDate = null;
        String owningCourt = null;
        Element caseEventElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            transferCaseElement = pDocParams.getRootElement ();

            mCancelTransferCaseUpdateWft (transferCaseElement);

            caseNumber = transferCaseElement.getChild ("CaseNumber").getText ();
            eventDate = SystemDateHelper.getSystemDate ();
            owningCourt = transferCaseElement.getChild ("OwningCourtCode").getText ();

            caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseNumber */caseNumber,
                    /* String standardEventId */"46", /* String eventDate */eventDate,
                    /* String receiptDate */eventDate, /* String courtCode */owningCourt);

            caseEventXMLBuilder.setUserName ((String) m_context.getSystemItem (IComponentContext.USER_ID_KEY));

            caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            localServiceProxy.getJDOM (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.INSERT_CASE_EVENT_ROW_METHOD,
                    sXmlParams);

            /* Output the original XML. */
            sXmlParams = xmlOutputter.outputString (transferCaseElement);
            pWriter.write (sXmlParams);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }

        return;
    } // process()

    /**
     * (non-Javadoc)
     * Method to update some of the fields of the WINDOW_FOR_TRAIL rows that relate the cancellation of a Case transfer.
     *
     * @param pTransferCaseElement the transfer case element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mCancelTransferCaseUpdateWft (final Element pTransferCaseElement)
        throws SystemException, BusinessException
    {
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", pTransferCaseElement.getChild ("CaseNumber").getText ());

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy.getJDOM (TRANSFER_CASE_SERVICE, CANCEL_TRANSFER_CASE_UPDATE_WFT_METHOD, sXmlParams);

        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return;
    } // mCancelTransferCaseUpdateWft()

} // class InsertCaseEvent046TransferInCorrectErrorCustomProcessor
