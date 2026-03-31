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
package uk.gov.dca.caseman.case_event_service.java;

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

import uk.gov.dca.caseman.case_service.java.CaseDefs;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Service: Case
 * Method: addCase
 * Class: InsertCaseEvent001CaseRecordCreatedCustomProcessor.java
 * Created: Phil Haferer (EDS) 16-Feb-2005
 * Description:
 * Inserts a CASE_EVENTS row to represent the Creation of a Case.
 * 
 * Change History:
 * - Chris Hutt 15-Apr-2005: Defect 602. Events should include court code.
 * - Phil Haferer 03-May-2005: Defect 718. Receipt Date should be populated from the input XML.
 * - Phil Haferer 29-Jul-2005: Mags Order/AE amendments made for Release 5/6.
 * 16-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 12/07/2006 Chris Hutt TD3870: case event 01 to be created even if a MAGS ORDER
 * 17/08/2006 Chris Hutt - TD4231: ListingType added to support extra BMS criteria.
 * 22-Nov-2006 Phil Haferer (EDS): Include population of the Hearing Sequence in the Case Event.
 * (TD CASEMAN 5827: Issue 221 - CJR187 & 179 production).
 * 15-Nov-2012 Chris Vincent - Change to mBuildWordProcessingElement to include WelshTranslation node
 * which included creating new method mGetCaseWelshTranslation. Trac 4761.
 * 
 * @author Phil Haferer
 */
public class InsertCaseEvent001CaseRecordCreatedCustomProcessor extends AbstractCustomProcessor
{
    
    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;
    
    /** The mags order case type. */
    private final String MAGS_ORDER_CASE_TYPE;

    /**
     * Constructor.
     */
    public InsertCaseEvent001CaseRecordCreatedCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
        MAGS_ORDER_CASE_TYPE = "MAGS ORDER";
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
        Element dsElement = null;
        Element manageCaseElement = null;
        String caseType = null;
        Element insertCaseEventRowElement = null;
        Element wordProcessingElement = null;
        boolean navigateToAttachmentOfEarnings = false;
        Element navigationListElement = null;

        try
        {
            dsElement = pDocParams.getRootElement ();
            manageCaseElement = dsElement.getChild ("ManageCase");

            // Magistrates Order type Cases are treated differently from other types...
            caseType = manageCaseElement.getChild ("CaseType").getText ();

            final Element caseEventParamsElement = mBuildCaseEventCaseRecordCreated (manageCaseElement, caseType);
            insertCaseEventRowElement = mInsertCaseEventRow (caseEventParamsElement);

            if (caseType.equals (MAGS_ORDER_CASE_TYPE))
            {
                navigateToAttachmentOfEarnings = true;
            }
            else
            {
                wordProcessingElement = mBuildWordProcessingElement (manageCaseElement, insertCaseEventRowElement);
            }

            navigationListElement = mBuildNavigationListElement (manageCaseElement, navigateToAttachmentOfEarnings,
                    wordProcessingElement);

            /* Output the original XML. */
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String sXml = xmlOutputter.outputString (navigationListElement);
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
    }

    /**
     * (non-Javadoc)
     * Builds an xml element containing data for navigation.
     *
     * @param pManageCaseElement the manage case element
     * @param pNavigateToAttachmentOfEarnings the navigate to attachment of earnings
     * @param pWordProcessingElement the word processing element
     * @return the element
     */
    private Element mBuildNavigationListElement (final Element pManageCaseElement,
                                                 final boolean pNavigateToAttachmentOfEarnings,
                                                 final Element pWordProcessingElement)
    {
        Document document = null;
        String value = null;
        Element navigationListElement = null;
        Element navigateToElement = null;
        Element paramsElement = null;
        Element attachmentOfEarningsElement = null;
        String caseNumber = null;

        try
        {
            document = new Document ();

            // /NavigationList
            navigationListElement = new Element ("NavigationList");
            document.setRootElement (navigationListElement);

            // /NavigationList/NavigateTo
            navigateToElement = XMLBuilder.add (navigationListElement, "NavigateTo");

            // /NavigationList/NavigateTo/AttachmentOfEarnings
            if (pNavigateToAttachmentOfEarnings)
            {
                value = "true";
            }
            else
            {
                value = "false";
            }
            XMLBuilder.add (navigateToElement, "AttachmentOfEarnings", value);

            // /NavigationList/NavigateTo/WordProcessing
            if (pWordProcessingElement != null)
            {
                value = "true";
            }
            else
            {
                value = "false";
            }
            XMLBuilder.add (navigateToElement, "WordProcessing", value);

            // /NavigationList/Params
            paramsElement = XMLBuilder.add (navigationListElement, "Params");

            // /NavigationList/Params/WordProcessing
            if (pWordProcessingElement != null)
            {
                paramsElement.addContent (pWordProcessingElement);
            }
            else
            {
                XMLBuilder.add (paramsElement, "WordProcessing");
            }

            // /NavigationList/Params/AttachmentOfEarnings
            attachmentOfEarningsElement = XMLBuilder.add (paramsElement, "AttachmentOfEarnings");

            // /NavigationList/Params/AttachmentOfEarnings/CaseNumber
            if (pNavigateToAttachmentOfEarnings)
            {
                caseNumber = pManageCaseElement.getChild ("CaseNumber").getText ();
                XMLBuilder.add (attachmentOfEarningsElement, "CaseNumber", caseNumber);
            }
            else
            {
                XMLBuilder.add (attachmentOfEarningsElement, "CaseNumber");
            }

        }
        finally
        {
            document = null;
            value = null;
            navigateToElement = null;
            paramsElement = null;
            attachmentOfEarningsElement = null;
            caseNumber = null;
        }

        return navigationListElement;
    } // mBuildNavigationListElement()

    /**
     * (non-Javadoc)
     * Create an XML params element via a CaseEventXMLBuilder.
     *
     * @param pManageCaseElement the manage case element
     * @param pCaseType the case type
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mBuildCaseEventCaseRecordCreated (final Element pManageCaseElement, final String pCaseType)
        throws JDOMException
    {
        String caseNumber = null;
        String eventDate = null;
        String receiptDate = null;
        String owningCourt = null;
        String userName = null;

        CaseEventXMLBuilder caseEventXMLBuilder = null;
        Element caseEventElement = null;
        Element paramsElement = null;

        caseNumber = ((Element) XPath.selectSingleNode (pManageCaseElement, "/ds/ManageCase/CaseNumber")).getText ();
        eventDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

        // with a MAGS ORDER there is no receipt date captured - event date used as a default.
        if (pCaseType.equals (MAGS_ORDER_CASE_TYPE))
        {
            receiptDate = eventDate;

        }
        else
        {
            receiptDate = ((Element) XPath.selectSingleNode (pManageCaseElement,
                    "/ds/ManageCase/DetailsOfClaim/DateRequestReceived")).getText ();
        }

        owningCourt =
                ((Element) XPath.selectSingleNode (pManageCaseElement, "/ds/ManageCase/OwningCourtCode")).getText ();

        userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

        // Get the Hearing Sequence (if any) from the Manage Case XML.
        String hrgSeq = "";
        final Element hearingDetailsElement = pManageCaseElement.getChild ("HearingDetails");
        if (hearingDetailsElement != null)
        {
            final Element idElement = hearingDetailsElement.getChild ("Id");
            if (idElement != null)
            {
                hrgSeq = idElement.getText ();
            }
        }

        caseEventXMLBuilder = new CaseEventXMLBuilder (/* String caseEventSeq */"", /* String caseNumber */caseNumber,
                /* String standardEventId */"1", /* String subjectCasePartyNumber */"",
                /* String subjectPartyRoleCode */"", /* String applicant */"", /* String eventDetails */"",
                /* String eventDate */eventDate, /* String result */"", /* String warrantId */"",
                /* String judgmentSeq */"", /* String varySeq */"", /* String hrgSeq */hrgSeq,
                /* String deletedFlag */"", /* String userName */userName, /* String receiptDate */receiptDate,
                /* String task */"", /* String statsModule */"", /* String ageCategory */"",
                /* String courtCode */owningCourt, /* String resultDate */"", /* String dateToRtl */"",
                /* String caseFlag */"", /* String listingType */"");

        caseEventElement = caseEventXMLBuilder.getXMLElement ("CaseEvent");

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseEvent", caseEventElement);

        return paramsElement;
    } // mBuildCaseEventCaseRecordCreated()

    /**
     * (non-Javadoc)
     * Call a service to insert a case event row.
     *
     * @param pCaseEventParamsElement the case event params element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCaseEventRow (final Element pCaseEventParamsElement)
        throws SystemException, BusinessException
    {
        Element insertCaseEventRowElement = null;

        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (pCaseEventParamsElement);

        insertCaseEventRowElement = localServiceProxy
                .getJDOM (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.INSERT_CASE_EVENT_ROW_METHOD, sXmlParams)
                .getRootElement ();

        return insertCaseEventRowElement;
    } // mInsertCaseEventRow()

    /**
     * (non-Javadoc)
     * Create a wordprocessing element with case and event info.
     *
     * @param pManageCaseElement the manage case element
     * @param pInsertCaseEventRowElement the insert case event row element
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mBuildWordProcessingElement (final Element pManageCaseElement,
                                                 final Element pInsertCaseEventRowElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element wordProcessingElement = null;
        Element caseElement = null;
        Element eventElement = null;
        String caseNumber = null;
        String welshTranslation = null;
        String sValue = null;

        // <WordProcessing> Node.
        wordProcessingElement = new Element ("WordProcessing");

        // <Case> Node.
        caseElement = new Element ("Case");
        wordProcessingElement.addContent (caseElement);

        caseNumber = XMLBuilder.getXPathValue (pManageCaseElement, "/ds/ManageCase/CaseNumber");
        XMLBuilder.add (caseElement, "CaseNumber", caseNumber);

        welshTranslation = mGetCaseWelshTranslation (caseNumber);
        XMLBuilder.add (caseElement, "WelshTranslation", welshTranslation);

        sValue = XMLBuilder.getXPathValue (pManageCaseElement, "/ds/ManageCase/CaseType");
        XMLBuilder.add (caseElement, "CaseType", sValue);

        // <Event> Node.
        eventElement = new Element ("Event");
        wordProcessingElement.addContent (eventElement);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/CaseEventSeq");
        XMLBuilder.add (eventElement, "CaseEventSeq", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCaseEventRowElement, "/CaseEvent/StandardEventId");
        XMLBuilder.add (eventElement, "StandardEventId", sValue);

        return wordProcessingElement;
    } // mBuildWordProcessingElement()

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

} // class InsertCaseEventRow
