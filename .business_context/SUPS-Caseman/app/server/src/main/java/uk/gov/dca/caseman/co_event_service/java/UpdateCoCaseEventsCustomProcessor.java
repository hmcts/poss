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

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventXMLBuilder;
import uk.gov.dca.caseman.co_service.java.CoCaseEventXMLBuilder;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: CoEvent
 * Method: updateCoDebtList()
 * Class: UpdateCoCaseEventsCustomProcessor.java
 * 
 * @author Chris Hutt
 *         Created: 29 September 2006
 *         Description:
 *         TD Caseman-5404:
 *         Create/Update CO_CASE_EVENTS and CASE_EVENTS rows as appropriate when a Co Event is added.
 *         NOTE: This does NOT cover the creation of events via the main CO screen which have thier own
 *         dedicated customer processor (co_service.UpdateCoCaseEventsCustomProcessor).
 *
 *         Change History:
 * 
 * 
 *         24 Oct 2006 TD:5704: Court Code writen to the Case/Co_Case event should be
 *         the admin_court_code of the case referred to by the debt
 *         and NOT the co's court.
 *
 *         13 Nov 2006 TD:5772: Event details written to CASE_EVENTS and CO_CASE_EVENTS should be '<CoNumber> :
 *         <DebtorName>'
 */
public class UpdateCoCaseEventsCustomProcessor extends AbstractCasemanCustomProcessor
{
    
    /** The Constant CASE_SERVICE. */
    private static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    
    /** The Constant GET_CASE_EXISTS_METHOD. */
    private static final String GET_CASE_EXISTS_METHOD = "getCaseExistsLocal";

    /** The Constant CO_SERVICE. */
    private static final String CO_SERVICE = "ejb/CoServiceLocal";
    
    /** The Constant UPDATE_CO_CASE_EVENT_METHOD. */
    private static final String UPDATE_CO_CASE_EVENT_METHOD = "updateCoCaseEventLocal";
    
    /** The Constant GET_CO_DEBT_DEBTOR_METHOD. */
    private static final String GET_CO_DEBT_DEBTOR_METHOD = "getDebtDebtorLocal";

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
        Element paramsElement = null;

        String caseNumber = null;
        String coNumber = null;
        Element coEventElement = null;
        String coStdEventId = null;
        Element debtsElement = null;
        List<Element> debtsElementList = null;
        Element debtElement = null;
        final String debtSeq = null;
        String caseStdEventId = null;

        try
        {
            paramsElement = pDocParams.getRootElement ();
            coEventElement = (Element) XPath.selectSingleNode (pDocParams, "//COEvent");

            if (null != coEventElement)
            {

                // Only certain events (currently 928) have an associated Case/Co_Case event created
                coStdEventId = coEventElement.getChild ("StandardEventId").getText ();
                if (coStdEventId.equals ("928"))
                {

                    caseStdEventId = "706";

                    // retrieve associated debts
                    coNumber = coEventElement.getChild ("CONumber").getText ();
                    debtsElement = mGetDebts (coNumber);

                    debtsElementList = debtsElement.getChildren ();

                    // Iterate through the list, create CaseEvents for each node.
                    for (Iterator<Element> i = debtsElementList.iterator (); i.hasNext ();)
                    {
                        debtElement = (Element) i.next ();
                        caseNumber = debtElement.getChild ("DebtCaseNumber").getText ();
                        if (mCaseExists (caseNumber))
                        {
                            mProcessCaseEvent (coEventElement, debtElement, caseStdEventId);
                        }
                        else
                        {
                            mProcessCoCaseEvent (coEventElement, debtElement, caseStdEventId);
                        }
                    } // for(Iterator i = ...

                } // if (coStdEventId.equals("928")

            } // if (null != coCaseEventsElement)
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return pDocParams;
    } // process()

    /**
     * (non-Javadoc)
     * Call a service to see if a case exists.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetDebts (final String pCoNumber) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        final boolean caseExists = false;
        Element paramsElement = null;
        Element dsElement = null;
        Element caseElement = null;
        Element debtsElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);

            // Call the service.
            dsElement = invokeLocalServiceProxy (CO_SERVICE, GET_CO_DEBT_DEBTOR_METHOD, inputDoc).getRootElement ();
            debtsElement = (Element) XPath.selectSingleNode (dsElement, "//Debts");

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);

        }
        finally
        {
            paramsElement = null;
            dsElement = null;
            caseElement = null;
        }

        return debtsElement;
    } // mGetDebts()

    /**
     * (non-Javadoc)
     * Call a service to see if a case exists.
     *
     * @param pCaseNumber the case number
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private boolean mCaseExists (final String pCaseNumber) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        boolean caseExists = false;
        Element paramsElement = null;
        Element dsElement = null;
        Element caseElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);

            // Call the service.
            dsElement = invokeLocalServiceProxy (CASE_SERVICE, GET_CASE_EXISTS_METHOD, inputDoc).getRootElement ();
            if (dsElement != null)
            {
                caseElement = dsElement.getChild ("Case");
                if (caseElement != null)
                {
                    caseExists = true;
                }
            }
        }
        finally
        {
            paramsElement = null;
            dsElement = null;
            caseElement = null;
        }

        return caseExists;
    } // mCaseExists()

    /**
     * (non-Javadoc)
     * Process a case event and insert it into the database.
     *
     * @param pCoEventElement the co event element
     * @param pDebtElement the debt element
     * @param pCaseStdEventId the case std event id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void mProcessCaseEvent (final Element pCoEventElement, final Element pDebtElement,
                                    final String pCaseStdEventId)
        throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        String deletedFlag = null;
        // Element debtElement = null;
        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element caseEventElement = null;
        Element paramsElement = null;
        String coStdEventId = null;

        // determine appropriate CASE event for this CO event
        coStdEventId = pCoEventElement.getChild ("StandardEventId").getText ();

        deletedFlag = pCoEventElement.getChild ("ErrorInd").getText ();
        if ( !deletedFlag.equals ("Y"))
        {
            // When the event is not being deleted, simply insert a new event.
            caseEventXMLBuilder =
                    new CaseEventXMLBuilder (/* String caseNumber */pDebtElement.getChild ("DebtCaseNumber").getText (),
                            /* String standardEventId */pCaseStdEventId,
                            /* String eventDate */pCoEventElement.getChild ("EventDate").getText (),
                            /* String receiptDate */pCoEventElement.getChild ("ReceiptDate").getText (),
                            /* String courtCode */pDebtElement.getChild ("DebtAdminCourtCode").getText ());

            caseEventXMLBuilder.setSubjectPartyRoleCode (pDebtElement.getChild ("PartyRoleCode").getText ());
            caseEventXMLBuilder.setSubjectCasePartyNumber (pDebtElement.getChild ("CasePartyNumber").getText ());
            caseEventXMLBuilder.setSource ("AUTO");
            caseEventXMLBuilder.setUserName (pCoEventElement.getChild ("UserName").getText ());

            // Prefix the Event Details by the CO Number.
            final String coNumber = pCoEventElement.getChild ("CONumber").getText ();

            final StringBuffer eventDetails = new StringBuffer ();
            eventDetails.append (coNumber);
            eventDetails.append (" : ");
            eventDetails.append (pCoEventElement.getChildText ("DebtorName"));
            caseEventXMLBuilder.setEventDetails (eventDetails.toString ());

            // Generate a new XML 'document' from the 'CaseEvent' object.
            caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

            // Wrap the 'CaseEvent' XML in the 'params/param' structure.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

            // Call the service.
            invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.INSERT_CASE_EVENT_ROW_METHOD,
                    inputDoc);

        }
        else
        { // of if (deletedFlag.equals("N"))
            // When an event is being deleted, mark the last instance of that event as deleted.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "caseNumber", pDebtElement.getChild ("DebtCaseNumber").getText ());
            XMLBuilder.addParam (paramsElement, "partyRoleCode", pDebtElement.getChild ("PartyRoleCode").getText ());
            XMLBuilder.addParam (paramsElement, "casePartyNumber",
                    pDebtElement.getChild ("CasePartyNumber").getText ());
            XMLBuilder.addParam (paramsElement, "stdEventId", pCaseStdEventId);

            // Call the service.
            invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.MARK_LAST_CASE_EVENT_DELETED_METHOD, inputDoc);
        }

    } // mProcessCaseEvent()

    /**
     * (non-Javadoc)
     * Process a co case event and update the database record.
     *
     * @param pCoEventElement the co event element
     * @param pDebtElement the debt element
     * @param pCaseStdEventId the case std event id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void mProcessCoCaseEvent (final Element pCoEventElement, final Element pDebtElement,
                                      final String pCaseStdEventId)
        throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        String coNumber = null;
        StringBuffer eventDetails = null;
        CoCaseEventXMLBuilder coCaseEventXMLBuilder = null;
        Element dsElement = null;
        Element coCaseEventElement = null;
        Element paramsElement = null;
        String coStdEventId = null;
        String deletedFlag = null;
        String caseNumber = null;

        try
        {

            caseNumber = pDebtElement.getChild ("DebtCaseNumber").getText ();
            deletedFlag = pCoEventElement.getChild ("ErrorInd").getText ();
            if ( !deletedFlag.equals ("Y") && !caseNumber.equals (""))
            {

                coNumber = pCoEventElement.getChild ("CONumber").getText ();

                // Prefix the Event Details by the CO Number.
                eventDetails = new StringBuffer ();
                eventDetails.append (coNumber);
                eventDetails.append (" : ");
                eventDetails.append (pCoEventElement.getChild ("DebtorName").getText ());

                coCaseEventXMLBuilder =
                        new CoCaseEventXMLBuilder (/* String aldDebtSeq */pDebtElement.getChild ("DebtSeq").getText (),
                                /* String adminCourtCode */pDebtElement.getChild ("DebtAdminCourtCode").getText (),
                                /* String coNumber */coNumber, /* String stdEventId */pCaseStdEventId,
                                /* String eventDate */pCoEventElement.getChild ("EventDate").getText (),
                                /* String eventDetails */eventDetails.toString (), /* String transferStatus */"1",
                                /* String transferDate */pCoEventElement.getChild ("EventDate").getText (),
                                /* String caseNumber */pDebtElement.getChild ("DebtCaseNumber").getText (),
                                /* String receiptDate */pCoEventElement.getChild ("ReceiptDate").getText ());

                // Generate a new XML 'document' from the 'CoCaseEvent' object.
                dsElement = new Element ("ds");
                coCaseEventElement = coCaseEventXMLBuilder.getXMLElement ("CoCaseEvent");
                dsElement.addContent (coCaseEventElement);

                // Wrap the 'CaseEvent' XML in the 'params/param' structure.
                inputDoc = new Document ();
                paramsElement = XMLBuilder.getNewParamsElement ();
                inputDoc.setRootElement (paramsElement);
                XMLBuilder.addParam (paramsElement, "coCaseEvent", dsElement);

                // Call the service.
                invokeLocalServiceProxy (CO_SERVICE, UPDATE_CO_CASE_EVENT_METHOD, inputDoc);
            } // !deletedFlag.equals("Y")

        }
        finally
        {
            inputDoc = null;
            coNumber = null;
            eventDetails = null;
            coCaseEventXMLBuilder = null;
            paramsElement = null;
            coStdEventId = null;
        }

    } // mProcessCoCaseEvent()

} // class UpdateCoCaseEventsCustomProcessor
