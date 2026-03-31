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
package uk.gov.dca.caseman.reports_service.classes;

import java.io.IOException;
import java.io.StringReader;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * A specific builder to create a dom as input to a database service.
 * <p>
 * A Builder is constructed and populated with source data, possibly over time.
 * <p>
 * 
 * @author Alex Peterson
 */
public class DbDomBuilder_AE
{
    
    /** The Constant PARAM_XPATH. */
    private static final String PARAM_XPATH = "/params/param";
    
    /** The Constant AE_EL_XPATH. */
    private static final String AE_EL_XPATH = "/params/param[@name='reportRequest']/Report/specificParameters/AE";
    
    /** The Constant DB_PATH. */
    private static final String DB_PATH = "/params/param[@name='reportDbUpdate']/update_ae_events/row";
    
    /** The Constant DB_PATH_HRG_SEQ. */
    private static final String DB_PATH_HRG_SEQ = "/params/param[@name='reportDbUpdate']/update_ae_events/row/HRG_SEQ";
    
    /** The Constant HEARING_PATH. */
    private static final String HEARING_PATH = "/insert_hearing/row/HRG_SEQ";
    
    /** The Constant WARRANT_ID_XPATH. */
    private static final String WARRANT_ID_XPATH = "/params/param[@name='WarrantID']";
    
    /** The Constant DB_WARRANT_ID_SEQ. */
    private static final String DB_WARRANT_ID_SEQ =
            "/params/param[@name='reportDbUpdate']/update_ae_events/row/WARRANT_ID";
    
    /** The Constant EVENT_DETAILS. */
    private static final String EVENT_DETAILS = "/params/param[@name='reportDbUpdate']/update_ae_events/row/DETAILS";
    
    /** The Constant WARRANT_RESPONSE_XPATH. */
    private static final String WARRANT_RESPONSE_XPATH = "/params/param[@name='WarrantNumber']";

    /** The Constant WARRANT_EL_XPATH. */
    private static final String WARRANT_EL_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/AE/WarrantCommonParameters";
    
    /** The Constant AE_NO_EL_XPATH. */
    private static final String AE_NO_EL_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/AE/WarrantCommonParameters/Column[@name='AE_NUMBER']";
    
    /** The Constant EVENT_NO_EL_XPATH. */
    private static final String EVENT_NO_EL_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/AE/WarrantCommonParameters/Column[@name='EVENT_NUMBER']";
    
    /** The Constant AEVENT_SEQ_EL_XPATH. */
    private static final String AEVENT_SEQ_EL_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/AE/WarrantCommonParameters/Column[@name='EVENT_SEQ']";
    
    /** The Constant AMOUNT_OF_FINE_XPATH. */
    private static final String AMOUNT_OF_FINE_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/AE/CommonParameters/Column[@name='REPORT_VALUE_1']";
    
    /** The Constant EXECUTING_COURT_XPATH. */
    private static final String EXECUTING_COURT_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/AE/CommonParameters/Column[@name='REPORT_VALUE_2']";

    /**
     * Warrant service name.
     */
    public static final String WARRANT_SERVICE = "ejb/WarrantServiceLocal";
    /**
     * Insert warrant for ae event method name.
     */
    public static final String INSERT_WARRANT_FOR_AE_EVENT = "insertWarrantForAeEventLocal";

    /**  The generated result dom. */
    // private Document dbDom;
    private Document dbDomTextItem;
    
    /**  Reference to the service input dom, which should be treated as immutable here. */
    private Document inputDom; // input data
    // /** A.N. Other source parameter */
    /** The out. */
    // private String anOther;
    private final XMLOutputter out;
    
    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (DbDomBuilder_AE.class);

    /**
     * Constructor.
     * 
     * @param inputDom The input document.
     */
    public DbDomBuilder_AE (final Document inputDom)
    {
        this.inputDom = inputDom;
        out = new XMLOutputter (Format.getPrettyFormat ());
        proxy = new SupsLocalServiceProxy ();
    }

    /**
     * Builds a database document.
     *
     * @param elementType The element type.
     * @return The database document.
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public Document buildDbDom (final String elementType) throws JDOMException, IOException
    {
        // create new output dom
        final SAXBuilder builder = new SAXBuilder ();
        final Document dbDom =
                builder.build (new StringReader ("<params><param name='reportDbUpdate'></param></params>"));

        // Get input AE element
        final Element aeEl = (Element) XPath.selectSingleNode (inputDom.getRootElement (), AE_EL_XPATH);

        // Convert to a List of rows
        final Element rowEl = BuilderUtils.commonRowFromGroup (aeEl, elementType);

        final Element insertEl = new Element (elementType);
        if (rowEl != null)
        {
            insertEl.addContent (rowEl);
        }

        // Set target output element
        final Element paramEl = (Element) XPath.selectSingleNode (dbDom.getRootElement (), PARAM_XPATH);
        paramEl.addContent (insertEl);

        return dbDom;
    }

    /**
     * Creates a warrant document if required.
     *
     * @return The warrant document.
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public Document createWarrantifRequired () throws JDOMException, SystemException, BusinessException
    {
        Document createWarrantDoc = null;
        String aeNumber = null;
        String eventNumber = null;
        String eventSeq = null;
        String amountOfFine = null;
        String executingCourtCode = null;

        final XPath aeNumberPath = XPath.newInstance (AE_NO_EL_XPATH);
        final XPath eventNumberPath = XPath.newInstance (EVENT_NO_EL_XPATH);
        final XPath eventSeqPath = XPath.newInstance (AEVENT_SEQ_EL_XPATH);
        final XPath amountOfFineXPath = XPath.newInstance (AMOUNT_OF_FINE_XPATH);
        final XPath executingCourtXPath = XPath.newInstance (EXECUTING_COURT_XPATH);

        final Element inputDomRootEl = inputDom.getRootElement ();
        final Element warrantEl = (Element) XPath.selectSingleNode (inputDomRootEl, WARRANT_EL_XPATH);
        if (warrantEl != null)
        {
            aeNumber = ((Element) aeNumberPath.selectSingleNode (inputDomRootEl)).getText ();
            eventNumber = ((Element) eventNumberPath.selectSingleNode (inputDomRootEl)).getText ();
            eventSeq = ((Element) eventSeqPath.selectSingleNode (inputDomRootEl)).getText ();
            amountOfFine = ((Element) amountOfFineXPath.selectSingleNode (inputDomRootEl)).getText ();
            executingCourtCode = ((Element) executingCourtXPath.selectSingleNode (inputDomRootEl)).getText ();

            log.debug ("Creating Warrant for AE Event : " + eventNumber + ", AE Number : " + aeNumber +
                    ", Event Seq : " + eventSeq + ", Amount of Fine : " + amountOfFine + ", Executing Court :" +
                    executingCourtXPath);

            Element createWarrantElement = null;
            String createWarrantParams = null;
            Element warrantCreateResultElement = null;

            createWarrantElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (createWarrantElement, "aeNumber", aeNumber);
            XMLBuilder.addParam (createWarrantElement, "eventId", eventNumber);
            XMLBuilder.addParam (createWarrantElement, "eventSeq", eventSeq);
            XMLBuilder.addParam (createWarrantElement, "AmountOfFine", amountOfFine);
            XMLBuilder.addParam (createWarrantElement, "executingCourtCode", executingCourtCode);

            createWarrantParams = getXMLString (createWarrantElement);
            log.debug ("Params XML for calling Insert Warrant Service : " + createWarrantParams);
            warrantCreateResultElement =
                    proxy.getJDOM (WARRANT_SERVICE, INSERT_WARRANT_FOR_AE_EVENT, createWarrantParams).getRootElement ();
            createWarrantDoc = new Document ();
            createWarrantDoc.addContent (((Element) warrantCreateResultElement.clone ()).detach ());
        }
        return createWarrantDoc;
    }

    /**
     * Updates the hearing sequence.
     *
     * @param p_dbDom The database document.
     * @param dbResultDom The results document.
     * @return The updated document.
     * @throws JDOMException the JDOM exception
     */
    public Document updateHearingSequence (final Document p_dbDom, final Document dbResultDom) throws JDOMException
    {
        final Element hearingEl = (Element) XPath.selectSingleNode (dbResultDom.getRootElement (), HEARING_PATH);
        final Element hrgSeqEl = (Element) XPath.selectSingleNode (p_dbDom.getRootElement (), DB_PATH_HRG_SEQ);
        String hrg_seq = "";
        if (hearingEl != null)
        {
            hrg_seq = hearingEl.getText ();
        }
        hrgSeqEl.setText (hrg_seq);

        return p_dbDom;
    }

    /**
     * Updates the warrant id.
     *
     * @param p_dbDom The database document.
     * @param dbResultDom The results document.
     * @return The updated document.
     * @throws JDOMException the JDOM exception
     */
    public Document updateWarrantID (final Document p_dbDom, final Document dbResultDom) throws JDOMException
    {
        final Element warrantEl = (Element) XPath.selectSingleNode (dbResultDom.getRootElement (), WARRANT_ID_XPATH);
        // Element warrantIdEl = new Element("WARRANT_ID");
        final Element warrantIdEl = (Element) XPath.selectSingleNode (p_dbDom.getRootElement (), DB_WARRANT_ID_SEQ);
        final Element eventDetailsElement =
                (Element) XPath.selectSingleNode (p_dbDom.getRootElement (), EVENT_DETAILS);
        String warrantId = "";
        if (warrantEl != null)
        {
            warrantId = warrantEl.getText ();
            log.debug ("Warrant Id applied is : " + warrantId);
        }
        else
        {
            log.debug ("No Warrant Created");
        }
        warrantIdEl.setText (warrantId);
        final Element warrantNumberElement = (Element) XPath.selectSingleNode (dbResultDom, WARRANT_RESPONSE_XPATH);
        eventDetailsElement.setText ("WARRANT NUMBER : " + warrantNumberElement.getText ());
        // Element row = (Element)(XPath.selectSingleNode(p_dbDom.getRootElement(), DB_PATH));
        // row.addContent(warrantIdEl);
        return p_dbDom;
    }

    /**
     * Gets the XML string.
     *
     * @param e the e
     * @return the XML string
     */
    private String getXMLString (final Element e)
    {
        return out.outputString (e);
    }

    /**
     * Builds the hearing dom.
     *
     * @return The hearing db dom
     * @throws JDOMException the JDOM exception
     */
    public Document buildHearingDbDom () throws JDOMException
    {

        Element hearingElementSource = null;

        String courtCode = null;
        String courtUser = null;
        String venue = null;
        String hrgType = null;
        String hrgDate = null;
        String hrgTime = null;
        String addressID = null;
        String caseNumber = null;
        String dateOfReceipt = null;

        final Element inputDomRootEl = inputDom.getRootElement ();

        final XPath hearingElementXPath = XPath.newInstance (
                "/params/param[@name='reportRequest']/Report/specificParameters/AE/HearingCommonParameters");
        hearingElementSource = (Element) hearingElementXPath.selectSingleNode (inputDomRootEl);

        if (hearingElementSource != null)
        {
            final XPath courtCodeXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/AE/HearingCommonParameters/Column[@name='CRT_CODE']");
            final XPath courtUserXPath = XPath.newInstance ("/params/param[@name='reportRequest']/Report/CourtUser");
            final XPath venueXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/AE/HearingCommonParameters/Column[@name='VENUE']");
            final XPath hrgTypeXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/AE/HearingCommonParameters/Column[@name='HRG_TYPE']");
            final XPath hrgDateXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/AE/HearingCommonParameters/Column[@name='HRG_DATE']");
            final XPath hrgTimeXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/AE/HearingCommonParameters/Column[@name='HRG_TIME']");
            final XPath addressIDXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/AE/HearingCommonParameters/Column[@name='ADDRESS_ID']");
            final XPath caseNumberXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/AE/HearingCommonParameters/Column[@name='CASE_NUMBER']");
            final XPath datOfReceiptXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/AE/HearingCommonParameters/Column[@name='DATE_OF_RECEIPT']");

            courtCode = ((Element) courtCodeXPath.selectSingleNode (inputDomRootEl)).getText ();
            courtUser = ((Element) courtUserXPath.selectSingleNode (inputDomRootEl)).getText ();
            venue = ((Element) venueXPath.selectSingleNode (inputDomRootEl)).getText ();
            hrgType = ((Element) hrgTypeXPath.selectSingleNode (inputDomRootEl)).getText ();
            hrgDate = ((Element) hrgDateXPath.selectSingleNode (inputDomRootEl)).getText ();
            hrgTime = ((Element) hrgTimeXPath.selectSingleNode (inputDomRootEl)).getText ();
            addressID = ((Element) addressIDXPath.selectSingleNode (inputDomRootEl)).getText ();
            caseNumber = ((Element) caseNumberXPath.selectSingleNode (inputDomRootEl)).getText ();
            dateOfReceipt = ((Element) datOfReceiptXPath.selectSingleNode (inputDomRootEl)).getText ();

            final HearingDO hearingDO = new HearingDO ();
            hearingDO.setCourtCode (courtCode);
            hearingDO.setCourtUser (courtUser);
            hearingDO.setVenue (venue);
            hearingDO.setHrgType (hrgType);
            hearingDO.setHrgDate (hrgDate);
            hearingDO.setHrgTime (hrgTime);
            hearingDO.setAddressID (addressID);
            hearingDO.setCaseNumber (caseNumber);
            hearingDO.setCaseNumber (caseNumber);
            hearingDO.setDateOfReceipt (dateOfReceipt);

            if (log.isDebugEnabled ())
            {
                log.debug ("Creating Hearing for following :");
                log.debug ("Court Code : " + courtCode);
                log.debug ("Court User : " + courtUser);
                log.debug ("Court Name : " + venue);
                log.debug ("Hearing Type : " + hrgType);
                log.debug ("Hearing Date : " + hrgDate);
                log.debug ("Hearing Time : " + hrgTime);
                log.debug ("Address ID : " + addressID);
                log.debug ("Case Number : " + caseNumber);
                log.debug ("Date of Receipt : " + dateOfReceipt);
            }
            final Document hearingDoc = getHearingDocument (hearingDO);
            return hearingDoc;

        }
        return null;
    }

    /**
     * Returns the hearing document.
     * 
     * @param hearingDO The empty hearing document.
     * @return The hearing document.
     */
    private Document getHearingDocument (final HearingDO hearingDO)
    {

        final Document hearingDoc = new Document ();

        Element dsElement = null;
        Element outMaintainHearingElement = null;
        Element outCaseNumberElement = null;
        Element outHearingsElement = null;
        Element outHearingElement = null;
        final Element outHearingIDElement = null;
        Element outSurrogateIdElement = null;
        final Element outVenueCodeElement = null;
        final Element outVenueNameElement = null;
        final Element outTypeOfHearingCodeElement = null;
        final Element outDateElement = null;
        final Element outTimeElement = null;
        final Element outCreatedByElement = null;
        final Element outAddressElement = null;
        Element outAddressIdElement = null;

        dsElement = new Element ("ds");
        outMaintainHearingElement = new Element ("MaintainHearing");
        outCaseNumberElement = new Element ("CaseNumber");
        outHearingsElement = new Element ("Hearings");
        outHearingElement = new Element ("Hearing");
        outSurrogateIdElement = new Element ("SurrogateId");
        outAddressIdElement = new Element ("AddressId");

        outAddressIdElement.setText (hearingDO.getAddressID ());
        // outAddressElement.addContent(outAddressIdElement);

        XMLBuilder.add (outHearingElement, "HearingID", "");
        XMLBuilder.add (outHearingElement, "SurrogateId", "");
        XMLBuilder.add (outHearingElement, "VenueCode", hearingDO.getCourtCode ());
        XMLBuilder.add (outHearingElement, "VenueName", hearingDO.getVenue ());
        XMLBuilder.add (outHearingElement, "TypeOfHearingCode", hearingDO.getHrgType ());
        XMLBuilder.add (outHearingElement, "Date", hearingDO.getHrgDate ());
        XMLBuilder.add (outHearingElement, "Time", hearingDO.getHrgTime ());
        XMLBuilder.add (outHearingElement, "DateOfRequestToList", hearingDO.getDateOfReceipt ());
        XMLBuilder.add (outHearingElement, "CreatedBy", hearingDO.getCourtUser ());

        XMLBuilder.add (outHearingElement, "Address", outAddressIdElement);

        XMLBuilder.add (outMaintainHearingElement, "CaseNumber", hearingDO.getCaseNumber ());
        XMLBuilder.add (outMaintainHearingElement, "Hearings", outHearingElement);

        dsElement.addContent (outMaintainHearingElement);
        hearingDoc.addContent (((Element) dsElement.clone ()).detach ());

        return hearingDoc;
    }
}
