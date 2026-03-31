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
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
import uk.gov.dca.caseman.case_service.java.CaseDefs;
import uk.gov.dca.caseman.common.java.CourtHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Service: TransferCase
 * Method: startTransferCase
 * Class: StartTransferCaseCustomProcessor.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 05-Jul-2005
 *         Description:
 *         Creates a Case Event to record the transfer of the case, and generates the navigation
 *         block required by the client.
 *         Change History:
 *         06-Mar-2006 Phil Haferer: Added call to new method CancelTransferCaseUpdateWft() in response
 *         to TD 2263: UC003 Mark Case For Transfer - WFT status not changed.
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 *         15-Nov-2012 Chris Vincent - Change to mBuildNavigationListElement to include WelshTranslation node
 *         which included creating new method mGetCaseWelshTranslation. Also made changes to how the case event
 *         is created so that the transfer reason is stored against the transfer out event. Trac 4761.
 */
public class StartTransferCaseCustomProcessor extends AbstractCustomProcessor
{
    
    /** The Constant TRANSFER_CASE_SERVICE. */
    private static final String TRANSFER_CASE_SERVICE = "ejb/TransferCaseServiceLocal";
    
    /** The Constant START_TRANSFER_CASE_UPDATE_WFT_METHOD. */
    private static final String START_TRANSFER_CASE_UPDATE_WFT_METHOD = "startTransferCaseUpdateWftLocal";

    /** The Constant OBLIGATION_SERVICE. */
    private static final String OBLIGATION_SERVICE = "ejb/ObligationServiceLocal";
    
    /** The Constant GET_OBLIGATION_SEQUENCE. */
    private static final String GET_OBLIGATION_SEQUENCE = "getObligationCountLocal";

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public StartTransferCaseCustomProcessor ()
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
        String transferReasonCode = null;
        final Element transferReasonElement = null;
        final String judgmentType = null;
        String transferredOutEventId = null;
        Element transferredOutCaseEventElement = null;
        Element navigationElement = null;
        XMLOutputter xmlOutputter = null;
        String sXml = null;

        try
        {
            transferCaseElement = pDocParams.getRootElement ();

            // Retrieve the Id of the Event to be created.
            transferReasonCode = transferCaseElement.getChild ("TransferReason").getText ();
            transferredOutEventId = TransferReasonHelper.GetTransferReasonEventId (transferReasonCode,
                    TransferReasonHelper.TRANSFER_TYPE_OUT);

            // Create the Case Event.
            transferredOutCaseEventElement =
                    mInsertTransferredOutCaseEvent (transferCaseElement, transferredOutEventId, transferReasonCode);

            // Update the WINDOW_FOR_TRIAL rows.
            mStartTransferCaseUpdateWft (transferCaseElement);

            // Build the navigation structure for the client.
            navigationElement = mBuildNavigationListElement (transferCaseElement, transferredOutCaseEventElement);

            /* Output the resulting XML. */
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (navigationElement);
            pWriter.write (sXml);
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
     * Insert case event.
     *
     * @param pTransferCaseElement the transfer case element
     * @param pTransferredOutEventId the transferred out event id
     * @param pTransferReason the transfer reason
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private Element mInsertTransferredOutCaseEvent (final Element pTransferCaseElement,
                                                    final String pTransferredOutEventId, final String pTransferReason)
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
            eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
            receiptDate = pTransferCaseElement.getChild ("TransferReceiptDate").getText ();
            courtCode = pTransferCaseElement.getChild ("OwningCourtCode").getText ();
            userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseNumber */caseNumber,
                    /* String standardEventId */pTransferredOutEventId, /* String eventDate */eventDate,
                    /* String receiptDate */receiptDate, /* String courtCode */courtCode);

            // Set the case event user name
            caseEventXMLBuilder.setUserName (userName);

            // 'To <New-Court-Name> Jurisdiction change, old case type <Old-Case-Type>'
            eventDetails = mGetEventDetails (pTransferCaseElement);
            caseEventXMLBuilder.setEventDetails (eventDetails);
            caseEventXMLBuilder.setTransferReason (pTransferReason);

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
    } // mInsertTransferredOutCaseEvent()

    /**
     * (non-Javadoc)
     * Construct a string of the form :-
     * 'To <New-Court-Name> Jurisdiction change, old case type <Old-Case-Type>'.
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
        String newCourtCode = null;
        String courtName = null;
        String oldCaseType = null;
        String newCaseType = null;

        try
        {
            eventDetails.append ("To ");

            newCourtCode = pTransferCaseElement.getChild ("TransferCourtCode").getText ();
            courtName = CourtHelper.GetCourtName (newCourtCode);
            eventDetails.append (courtName);

            oldCaseType = pTransferCaseElement.getChild ("CaseType").getText ();
            newCaseType = pTransferCaseElement.getChild ("NewCaseType").getText ();
            if ( !newCaseType.equals (oldCaseType))
            {
                eventDetails.append (" Jurisdiction change, old case type ");
                eventDetails.append (oldCaseType);
            }
        }
        finally
        {
            newCourtCode = null;
            courtName = null;
            oldCaseType = null;
            newCaseType = null;
        }

        return eventDetails.toString ();
    } // mGetEventDetails()

    /**
     * (non-Javadoc)
     * Build navigation element.
     *
     * @param pTransferCaseElement the transfer case element
     * @param pCaseEventElement the case event element
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildNavigationListElement (final Element pTransferCaseElement, final Element pCaseEventElement)
        throws BusinessException, SystemException, JDOMException
    {
        String caseNumber = null;
        String welshTranslation = null;
        Document document = null;
        Element navigationListElement = null;
        Element navigateToElement = null;
        Element obligationsElement = null;
        Element paramsElement = null;
        Element wordProcessingElement = null;
        Element caseElement = null;
        Element eventElement = null;

        try
        {
            caseNumber = XMLBuilder.getXPathValue (pTransferCaseElement, "/TransferCase/CaseNumber");

            document = new Document ();

            // /NavigationList
            navigationListElement = new Element ("NavigationList");
            document.setRootElement (navigationListElement);

            // /NavigationList/NavigateTo
            navigateToElement = XMLBuilder.add (navigationListElement, "NavigateTo");

            // /NavigationList/NavigateTo/Obligations
            obligationsElement = XMLBuilder.add (navigateToElement, "Obligations");
            if (mCaseHasObligations (caseNumber))
            {
                obligationsElement.setText ("true");
            }
            else
            {
                obligationsElement.setText ("false");
            }

            // /NavigationList/NavigateTo/WordProcessing
            XMLBuilder.add (navigateToElement, "WordProcessing", "true");

            // /NavigationList/Params
            paramsElement = XMLBuilder.add (navigationListElement, "Params");

            // /NavigationList/Params/WordProcessing
            wordProcessingElement = XMLBuilder.add (paramsElement, "WordProcessing");

            // /NavigationList/Params/WordProcessing/Case
            caseElement = XMLBuilder.add (wordProcessingElement, "Case");

            // /NavigationList/Params/WordProcessing/Case/CaseNumber
            XMLBuilder.add (caseElement, "CaseNumber", caseNumber);

            // /NavigationList/Params/WordProcessing/Case/WelshTranslation
            welshTranslation = mGetCaseWelshTranslation (caseNumber);
            XMLBuilder.add (caseElement, "WelshTranslation", welshTranslation);

            // /NavigationList/Params/WordProcessing/Case/CaseType
            XMLBuilder.add (caseElement, "CaseType",
                    XMLBuilder.getXPathValue (pTransferCaseElement, "/TransferCase/CaseType"));

            // /NavigationList/Params/WordProcessing/Case/TransferReason
            XMLBuilder.add (caseElement, "TransferReason",
                    XMLBuilder.getXPathValue (pTransferCaseElement, "/TransferCase/TransferReason"));

            // /NavigationList/Params/WordProcessing/Event
            eventElement = XMLBuilder.add (wordProcessingElement, "Event");

            // /NavigationList/Params/WordProcessing/Event/CaseEventSeq
            XMLBuilder.add (eventElement, "CaseEventSeq",
                    XMLBuilder.getXPathValue (pCaseEventElement, "/CaseEvent/CaseEventSeq"));

            // /NavigationList/Params/WordProcessing/Event/StandardEventId
            XMLBuilder.add (eventElement, "StandardEventId",
                    XMLBuilder.getXPathValue (pCaseEventElement, "/CaseEvent/StandardEventId"));

        }
        finally
        {
            navigateToElement = null;
            obligationsElement = null;
            paramsElement = null;
            wordProcessingElement = null;
            caseElement = null;
            eventElement = null;
        }

        return navigationListElement;
    } // mBuildNavigationListElement()

    /**
     * (non-Javadoc)
     * Call a service to determine whether a case has any parties who wish for outputs translated to Welsh.
     *
     * @param pCaseNumber The case number to be checked
     * @return String indicator of whether any parties on the case want Welsh translation.
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private String mGetCaseWelshTranslation (final String pCaseNumber)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element welshTranslationElement = null;
        String welshTranslation = null;
        String sXmlParams = null;
        XMLOutputter xmlOutputter = null;

        try
        {
            // Build the Parameter XML for passing to the service.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            welshTranslationElement = localServiceProxy
                    .getJDOM (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_WELSH_TRANSLATION, sXmlParams).getRootElement ();

            if (null != welshTranslationElement)
            {
                welshTranslation = XMLBuilder.getXPathValue (welshTranslationElement, "/ds/Case/WelshTranslation");
            }
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
            welshTranslationElement = null;
        }

        return welshTranslation;
    } // mGetCaseWelshTranslation()

    /**
     * (non-Javadoc)
     * Determine if case has obligations.
     *
     * @param pCaseNumber the case number
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private boolean mCaseHasObligations (final String pCaseNumber) throws SystemException, BusinessException
    {
        boolean bCaseHasObligations = false;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        Element obligationsElement = null;
        int obligationsCount = 0;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
            XMLBuilder.addParam (paramsElement, "deleteFlag", "N");

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            obligationsElement = localServiceProxy.getJDOM (OBLIGATION_SERVICE, GET_OBLIGATION_SEQUENCE, sXmlParams)
                    .getRootElement ();

            // Interpret the result.
            if (null != obligationsElement)
            {
                obligationsCount = Integer.parseInt (obligationsElement.getChild ("Count").getText ());
                if (obligationsCount > 0)
                {
                    bCaseHasObligations = true;
                }
            }
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
            obligationsElement = null;
        }

        return bCaseHasObligations;
    } // mCaseHasObligations()

    /**
     * (non-Javadoc)
     * Start case transfer.
     *
     * @param pTransferCaseElement the transfer case element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mStartTransferCaseUpdateWft (final Element pTransferCaseElement)
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
            localServiceProxy.getJDOM (TRANSFER_CASE_SERVICE, START_TRANSFER_CASE_UPDATE_WFT_METHOD, sXmlParams);

        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return;
    } // mStartTransferCaseUpdateWft()

} // class StartTransferCaseCustomProcessor
