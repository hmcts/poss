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
import java.util.List;

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
 * A Builder may be populated with source data over time, prior to generating the output dom.
 * <p>
 * 
 * @author Alex Peterson
 */
public class DbDomBuilder_CO
{
    
    /** The Constant PARAM_XPATH. */
    private static final String PARAM_XPATH = "/params/param";
    
    /** The Constant CO_EL_XPATH. */
    private static final String CO_EL_XPATH = "/params/param[@name='reportRequest']/Report/specificParameters/CO";

    /** The Constant HEARING_PATH. */
    private static final String HEARING_PATH = "/ds/MaintainHearing/Hearings/Hearing/HearingID";
    
    /** The Constant ROW_PATH_SEQ. */
    private static final String ROW_PATH_SEQ = "/params/param[@name='reportDbUpdate']/update_co_events/row";

    /** The Constant DB_PATH_HRG_SEQ. */
    private static final String DB_PATH_HRG_SEQ = "/params/param[@name='reportDbUpdate']/update_co_events/row/HRG_SEQ";

    /** The Constant WARRANT_EL_XPATH. */
    private static final String WARRANT_EL_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/CO/WarrantCommonParameters";
    
    /** The Constant CO_NO_EL_XPATH. */
    private static final String CO_NO_EL_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/CO/WarrantCommonParameters/Column[@name='CO_NUMBER']";
    
    /** The Constant EVENT_NO_EL_XPATH. */
    private static final String EVENT_NO_EL_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/CO/WarrantCommonParameters/Column[@name='EVENT_NUMBER']";
    
    /** The Constant AEVENT_SEQ_EL_XPATH. */
    private static final String AEVENT_SEQ_EL_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/CO/WarrantCommonParameters/Column[@name='EVENT_SEQ']";
    
    /** The Constant AMOUNT_OF_FINE_XPATH. */
    private static final String AMOUNT_OF_FINE_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/CO/Parameter[@name='REPORT_VALUE_1']/Column[@name='CO_TEXT_VALUE']";
    
    /** The Constant EXECUTING_COURT_XPATH. */
    private static final String EXECUTING_COURT_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/CO/Parameter[@name='REPORT_VALUE_2']/Column[@name='CO_TEXT_VALUE']";
    
    /** The Constant USER_ID_XPATH. */
    private static final String USER_ID_XPATH = "/params/param[@name='userId']";
    
    /** The Constant COURT_ID_XPATH. */
    private static final String COURT_ID_XPATH = "/params/param[@name='courtId']";

    /** The Constant WARRANT_ID_XPATH. */
    private static final String WARRANT_ID_XPATH = "/params/param[@name='WarrantID']";
    
    /** The Constant DB_WARRANT_ID_SEQ. */
    private static final String DB_WARRANT_ID_SEQ =
            "/params/param[@name='reportDbUpdate']/update_co_events/row/WARRANT_ID";
    
    /** The Constant EVENT_DETAILS. */
    private static final String EVENT_DETAILS = "/params/param[@name='reportDbUpdate']/update_co_events/row/DETAILS";
    
    /** The Constant WARRANT_RESPONSE_XPATH. */
    private static final String WARRANT_RESPONSE_XPATH = "/params/param[@name='WarrantNumber']";

    /** The Constant WARRANT_SERVICE. */
    private static final String WARRANT_SERVICE = "ejb/WarrantServiceLocal";
    
    /** The Constant INSERT_WARRANT_FOR_CO_EVENT. */
    private static final String INSERT_WARRANT_FOR_CO_EVENT = "insertWarrantForCoEventLocal";

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (DbDomBuilder_CO.class);

    /** The out. */
    private final XMLOutputter out;
    
    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;

    /**  Reference to the service input dom, which should be tread as immutable here. */
    private Document inputDom; // input data

    /**
     * Constructor.
     * 
     * @param inputDom The input document.
     */
    public DbDomBuilder_CO (final Document inputDom)
    {
        this.inputDom = inputDom;
        out = new XMLOutputter (Format.getCompactFormat ());
        proxy = new SupsLocalServiceProxy ();
    }

    /**
     * Builds a database document for insert co text items.
     *
     * @return The databse document.
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public Document buildDbDom () throws JDOMException, IOException
    {
        // create new output dom
        final SAXBuilder builder = new SAXBuilder ();
        final Document dbDom =
                builder.build (new StringReader ("<params><param name='reportDbUpdate'></param></params>"));

        // Get input CO element
        final Element coEl = (Element) XPath.selectSingleNode (inputDom.getRootElement (), CO_EL_XPATH);

        // Convert to a List of rows
        final List<Element> rowEls = BuilderUtils.parameterRowsFromGroup (coEl);

        final Element insertEl = new Element ("insert_co_text_items");
        insertEl.addContent (rowEls);

        // Set target output element
        final Element paramEl = (Element) XPath.selectSingleNode (dbDom.getRootElement (), PARAM_XPATH);
        paramEl.addContent (insertEl);

        return dbDom;
    }

    /**
     * Builds a database document for other elements.
     *
     * @param elementType The element type.
     * @return The database document.
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public Document buildDbDomOthers (final String elementType) throws JDOMException, IOException
    {
        // create new output dom
        final SAXBuilder builder = new SAXBuilder ();
        final Document dbDom =
                builder.build (new StringReader ("<params><param name='reportDbUpdate'></param></params>"));

        // Get input CO element
        final Element coEl = (Element) XPath.selectSingleNode (inputDom.getRootElement (), CO_EL_XPATH);

        // Convert to a List of rows
        final Element rowEl = BuilderUtils.commonRowFromGroup (coEl, elementType);

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
     * Builds a database document for deleted text items.
     *
     * @return The database document.
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public Document buildDbDeleteDom () throws JDOMException, IOException
    {
        // create new output dom
        final SAXBuilder builder = new SAXBuilder ();
        final Document dbDom =
                builder.build (new StringReader ("<params><param name='reportDbUpdate'></param></params>"));

        // Get input CJR element
        final Element cjrEl = (Element) XPath.selectSingleNode (inputDom.getRootElement (), CO_EL_XPATH);

        // Convert to a List of rows
        final List<Element> deleteRowEls = BuilderUtils.parameterRowsFromGroupForDelete (cjrEl);

        final Element deleteEl = new Element ("delete_text_items");
        deleteEl.addContent (deleteRowEls);

        // Set target output element
        final Element paramEl = (Element) XPath.selectSingleNode (dbDom.getRootElement (), PARAM_XPATH);
        paramEl.addContent (deleteEl);

        return dbDom;
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
        final Element hrgSeqEl = (Element) XPath.selectSingleNode (p_dbDom.getRootElement (), DB_PATH_HRG_SEQ); // Element
                                                                                                                  // hrgSeqEl
                                                                                                                  // =
                                                                                                                  // new
                                                                                                                  // Element("HRG_SEQ");//(Element)(XPath.selectSingleNode(p_dbDom.getRootElement(),
                                                                                                                  // DB_PATH_HRG_SEQ));
        String hrg_seq = "";
        if (hearingEl != null)
        {
            hrg_seq = hearingEl.getText ();
        }
        hrgSeqEl.setText (hrg_seq);
        return p_dbDom;
    }

    /**
     * Builds hearing db dom.
     *
     * @return The hearing db dom.
     * @throws JDOMException the JDOM exception
     */
    public Element buildHearingDbDom () throws JDOMException
    {

        Element hearingElementSource = null;

        String courtCode = null;
        String courtUser = null;
        String venue = null;
        String hrgType = null;
        String hrgDate = null;
        String hrgTime = null;
        String addressID = null;
        String coNumber = null;
        String dateOfReceipt = null;

        final Element inputDomRootEl = inputDom.getRootElement ();

        final XPath hearingElementXPath = XPath.newInstance (
                "/params/param[@name='reportRequest']/Report/specificParameters/CO/HearingCommonParameters");
        hearingElementSource = (Element) hearingElementXPath.selectSingleNode (inputDomRootEl);

        if (hearingElementSource != null)
        {
            final XPath courtCodeXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/CO/HearingCommonParameters/Column[@name='CRT_CODE']");
            final XPath courtUserXPath = XPath.newInstance ("/params/param[@name='reportRequest']/Report/CourtUser");
            final XPath venueXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/CO/HearingCommonParameters/Column[@name='HRG_VENE']");
            final XPath hrgTypeXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/CO/HearingCommonParameters/Column[@name='HRG_TYPE']");
            final XPath hrgDateXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/CO/HearingCommonParameters/Column[@name='HRG_DAT']");
            final XPath hrgTimeXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/CO/HearingCommonParameters/Column[@name='HRG_TIM']");
            final XPath addressIDXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/CO/HearingCommonParameters/Column[@name='ADDRESS_ID']");
            final XPath coNumberXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/CO/HearingCommonParameters/Column[@name='CO_NUMBER']");
            final XPath datOfReceiptXPath = XPath.newInstance (
                    "/params/param[@name='reportRequest']/Report/specificParameters/CO/HearingCommonParameters/Column[@name='DATE_OF_RECEIPT']");

            courtCode = ((Element) courtCodeXPath.selectSingleNode (inputDomRootEl)).getText ();
            courtUser = ((Element) courtUserXPath.selectSingleNode (inputDomRootEl)).getText ();
            venue = ((Element) venueXPath.selectSingleNode (inputDomRootEl)).getText ();
            hrgType = ((Element) hrgTypeXPath.selectSingleNode (inputDomRootEl)).getText ();
            hrgDate = ((Element) hrgDateXPath.selectSingleNode (inputDomRootEl)).getText ();
            hrgTime = ((Element) hrgTimeXPath.selectSingleNode (inputDomRootEl)).getText ();
            addressID = ((Element) addressIDXPath.selectSingleNode (inputDomRootEl)).getText ();
            coNumber = ((Element) coNumberXPath.selectSingleNode (inputDomRootEl)).getText ();
            dateOfReceipt = ((Element) datOfReceiptXPath.selectSingleNode (inputDomRootEl)).getText ();

            final HearingDO hearingDO = new HearingDO ();
            hearingDO.setCourtCode (courtCode);
            hearingDO.setCourtUser (courtUser);
            hearingDO.setVenue (venue);
            hearingDO.setHrgType (hrgType);
            hearingDO.setHrgDate (hrgDate);
            hearingDO.setHrgTime (hrgTime);
            hearingDO.setAddressID (addressID);
            hearingDO.setCoNumber (coNumber);
            hearingDO.setDateOfReceipt (dateOfReceipt);

            if (log.isDebugEnabled ())
            {
                log.debug ("Hearing will be created for following :");
                log.debug ("Court Code : " + courtCode);
                log.debug ("Court User : " + courtUser);
                log.debug ("Court Name : " + venue);
                log.debug ("Hearing Type : " + hrgType);
                log.debug ("Hearing Date : " + hrgDate);
                log.debug ("Hearing Time : " + hrgTime);
                log.debug ("Address ID : " + addressID);
                log.debug ("CO Number : " + coNumber);
                log.debug ("Date of Receipt : " + dateOfReceipt);
            }
            final Element hearingParams = getHearingParams (hearingDO);
            return hearingParams;

        }
        return null;
    }

    /**
     * Gets the hearing params.
     *
     * @param hearingDO the hearing DO
     * @return The hearing params.
     */
    private Element getHearingParams (final HearingDO hearingDO)
    {

        final Document hearingDoc = new Document ();

        Element dsElement = null;
        Element outMaintainHearingElement = null;
        Element outCONumberElement = null;
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
        outCONumberElement = new Element ("CONumber");
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

        XMLBuilder.add (outMaintainHearingElement, "CONumber", hearingDO.getCoNumber ());
        XMLBuilder.add (outMaintainHearingElement, "Hearings", outHearingElement);

        dsElement.addContent (outMaintainHearingElement);
        hearingDoc.addContent (((Element) dsElement.clone ()).detach ());

        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "HearingID",
                (Element) ((Element) hearingDoc.getRootElement ().clone ()).detach ());
        return paramsElement;
    }

    /**
     * Creates a warrant if requried.
     *
     * @return The warrant document.
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public Document createWarrantifRequired () throws JDOMException, SystemException, BusinessException
    {
        Document createWarrantDoc = null;
        String coNumber = null;
        String eventNumber = null;
        String eventSeq = null;
        String amountOfFine = null;
        String executingCourtCode = null;
        String userId = null;
        String courtId = null;

        final XPath aeNumberPath = XPath.newInstance (CO_NO_EL_XPATH);
        final XPath eventNumberPath = XPath.newInstance (EVENT_NO_EL_XPATH);
        final XPath eventSeqPath = XPath.newInstance (AEVENT_SEQ_EL_XPATH);
        final XPath amountOfFineXPath = XPath.newInstance (AMOUNT_OF_FINE_XPATH);
        final XPath executingCourtXPath = XPath.newInstance (EXECUTING_COURT_XPATH);
        final XPath userIdXPath = XPath.newInstance (USER_ID_XPATH);
        final XPath courtIdXPath = XPath.newInstance (COURT_ID_XPATH);

        final Element inputDomRootEl = inputDom.getRootElement ();
        final Element warrantEl = (Element) XPath.selectSingleNode (inputDomRootEl, WARRANT_EL_XPATH);
        if (warrantEl != null)
        {
            coNumber = ((Element) aeNumberPath.selectSingleNode (inputDomRootEl)).getText ();
            eventNumber = ((Element) eventNumberPath.selectSingleNode (inputDomRootEl)).getText ();
            eventSeq = ((Element) eventSeqPath.selectSingleNode (inputDomRootEl)).getText ();
            amountOfFine = ((Element) amountOfFineXPath.selectSingleNode (inputDomRootEl)).getText ();
            executingCourtCode = ((Element) executingCourtXPath.selectSingleNode (inputDomRootEl)).getText ();

            userId = ((Element) userIdXPath.selectSingleNode (inputDomRootEl)).getText ();
            courtId = ((Element) courtIdXPath.selectSingleNode (inputDomRootEl)).getText ();

            log.debug ("Creating Warrant for CO Event : " + eventNumber + ", CO Number : " + coNumber +
                    ", Event Seq : " + eventSeq + ", Amount of Fine : " + amountOfFine + ", Executing Court :" +
                    executingCourtCode);

            Element createWarrantElement = null;
            String createWarrantParams = null;
            Element warrantCreateResultElement = null;

            createWarrantElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (createWarrantElement, "coNumber", coNumber);
            XMLBuilder.addParam (createWarrantElement, "eventId", eventNumber);
            XMLBuilder.addParam (createWarrantElement, "eventSeq", eventSeq);
            XMLBuilder.addParam (createWarrantElement, "AmountOfFine", amountOfFine);
            XMLBuilder.addParam (createWarrantElement, "executingCourtCode", executingCourtCode);
            XMLBuilder.addParam (createWarrantElement, "userId", userId);
            XMLBuilder.addParam (createWarrantElement, "courtId", courtId);

            createWarrantParams = getXMLString (createWarrantElement);
            if (log.isDebugEnabled ())
            {
                log.debug ("Params XML for calling Insert Warrant Service : " + createWarrantParams);
            }
            warrantCreateResultElement =
                    proxy.getJDOM (WARRANT_SERVICE, INSERT_WARRANT_FOR_CO_EVENT, createWarrantParams).getRootElement ();
            createWarrantDoc = new Document ();
            createWarrantDoc.addContent (((Element) warrantCreateResultElement.clone ()).detach ());
        }
        return createWarrantDoc;
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
        final Element warrantIdElement =
                (Element) XPath.selectSingleNode (p_dbDom.getRootElement (), DB_WARRANT_ID_SEQ);
        final Element eventDetailsElement =
                (Element) XPath.selectSingleNode (p_dbDom.getRootElement (), EVENT_DETAILS);
        String warrantId = "";
        if (warrantEl != null)
        {
            warrantId = warrantEl.getText ();
            log.debug ("Warrant Id applied is : " + warrantId);
            final Element warrantNumberElement =
                    (Element) XPath.selectSingleNode (dbResultDom, WARRANT_RESPONSE_XPATH);
            eventDetailsElement.setText ("WARRANT NUMBER : " + warrantNumberElement.getText ());
        }
        else
        {
            log.debug ("No Warrant Created");
        }
        warrantIdElement.setText (warrantId);
        final Element row = (Element) XPath.selectSingleNode (p_dbDom.getRootElement (), ROW_PATH_SEQ);
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
}
