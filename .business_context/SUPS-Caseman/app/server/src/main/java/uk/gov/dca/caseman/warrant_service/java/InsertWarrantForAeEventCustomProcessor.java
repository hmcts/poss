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

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.ae_event_service.java.AeEventDefs;
import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Created on 23 Oct 2005
 * 
 * Change History
 * --------------
 * 
 * 23/10/2005 V1.0 Chris Hutt
 * 
 * 11/11/2005 v1.1 ChrisHutt
 * Added WarrantID as part of the params returned to caller
 * 
 * 16/11/2005 v1.2 Chris Hutt
 * Added WarrantNumber as part of the params returned to caller
 * 
 * 18/12/2005 v1.3 Chris Hutt
 * UCT defect 274: - with event 876 'PartyFor' address details should be the
 * office address of the court. Also AmountOfFine supplied as a parameter.
 * 
 * 10/03/2006 v1.4 Chris Hutt
 * defect 2481: - executing court needs to be passed in for an 876
 * 
 * 17-May-2006 v1.5 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 
 * 05/06/2006 v1.6 Chris Hutt
 * defect 3445: event 856 should have a warrant amount of '0.00'
 * 
 * 06/06/2006 v1.7 Chris Hutt
 * defect 3445: warrant id posted to ae and case events
 *
 * 08/06/2006 v1.8 Chris Hutt
 * defect 3575: warrant issue date should be today (not the date the AE was issued)
 * 
 * 04/12/2006 Defect UCT864
 * Party For Address details to be added to warrant where that party is not represented.
 * 
 * 16/02/2007 Chris Hutt Defect Temp_caseman 359:
 * For Ae Event 876:
 * 1. Events should have ' COUNTY COURT' appended to the ClaimantRepresentative
 * 2. ClaimantRepresentative details should be those of the ISSUING rather than
 * the EXECUTING court
 * 20/02/2007 Chris Hutt: as part of testing Defect Temp_caseman 359 it was noted that the ExecutedBy court code was
 * being
 * set with the Issuing Court code for an 876 - which is wrong
 * 23/04/2007 Chris Vincent defect 6170 - update mBuildWarrantDO() so sets CCBCWarrant node for warrants issued by CCBC.
 * 20/05/2011 Chris Vincent, Trac 3077. Added service to retrieve the AE Event's username to be used for the Warrant
 * Created By.
 * 05/12/2013 Chris Vincent Single Court changes e.g. Northampton County Court now becomes The County Court at
 * Northampton, Trac 5014
 * Also added TCE changes to change Warrants of Execution to Warrants of Control. Trac 5025.
 * 
 * @author Chris Hutt
 * 
 */
public class InsertWarrantForAeEventCustomProcessor implements ICustomProcessor
{
    
    /** The Constant AE_SERVICE. */
    private static final String AE_SERVICE = "ejb/AeServiceLocal";
    
    /** The Constant WARRANT_SERVICE. */
    private static final String WARRANT_SERVICE = "ejb/WarrantServiceLocal";
    
    /** The Constant COURT_SERVICE. */
    private static final String COURT_SERVICE = "ejb/CourtServiceLocal";
    
    /** The Constant AEEVENT_SERVICE. */
    private static final String AEEVENT_SERVICE = "ejb/AeEventServiceLocal";

    /** The Constant GET_AE_FOR_WARRANT_INSERT. */
    private static final String GET_AE_FOR_WARRANT_INSERT = "getAeForWarrantInsertLocal";
    
    /** The Constant ADD_WARRANT. */
    private static final String ADD_WARRANT = "addWarrantLocal";
    
    /** The Constant GET_COURT. */
    private static final String GET_COURT = "getCourtLocal";

    /** The Constant SYSTEM_DATE_SERVICE. */
    private static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    
    /** The Constant GET_SYSTEM_DATE. */
    private static final String GET_SYSTEM_DATE = "getSystemDateLocal";
    
    /** The Constant GET_AE_EVENT_USERNAME. */
    private static final String GET_AE_EVENT_USERNAME = "getAeEventUsernameLocal";

    /** The ae number param path. */
    private final XPath aeNumberParamPath;
    
    /** The event id param path. */
    private final XPath eventIdParamPath;
    
    /** The ae application path. */
    private final XPath aeApplicationPath;
    
    /** The Warrant number path. */
    private final XPath WarrantNumberPath;
    
    /** The Warrant id path. */
    private final XPath WarrantIdPath;
    
    /** The Amount of fine path. */
    private final XPath AmountOfFinePath;
    
    /** The executing court id path. */
    private final XPath executingCourtIdPath;
    
    /** The court path. */
    private final XPath courtPath;
    
    /** The ae event seq param path. */
    private final XPath aeEventSeqParamPath;

    /** The out. */
    private final XMLOutputter out;
    
    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public InsertWarrantForAeEventCustomProcessor () throws JDOMException
    {
        eventIdParamPath = XPath.newInstance ("params/param[@name='eventId']");
        aeNumberParamPath = XPath.newInstance ("params/param[@name='aeNumber']");
        aeEventSeqParamPath = XPath.newInstance ("params/param[@name='eventSeq']");
        AmountOfFinePath = XPath.newInstance ("params/param[@name='AmountOfFine']");
        executingCourtIdPath = XPath.newInstance ("params/param[@name='executingCourtCode']");

        WarrantNumberPath = XPath.newInstance ("ds/Warrant/WarrantNumber");
        WarrantIdPath = XPath.newInstance ("ds/Warrant/WarrantID");
        courtPath = XPath.newInstance ("/Courts/Court");

        aeApplicationPath = XPath.newInstance ("/ds/AEApplication");

        out = new XMLOutputter (Format.getPrettyFormat ());
        proxy = new SupsLocalServiceProxy ();
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

        WarrantDO warrantDO = null;
        AddWarrantXMLBuilder addWarrantXMLBuilder = null;
        Element aeElement = null;
        String aeNumber = null;
        String eventId = null;
        Document warrantDoc = null;
        String warrantNo = null;
        String warrantId = null;
        Document warrantResultDoc = null;
        final Element warrantNumberElement = null;
        String amountOfFine = "0.00";
        String executingCourtId = null;
        String aeEventSeq = null;
        String createdBy = null;

        try
        {

            final Element paramsElement = pDocParams.getRootElement ();

            aeNumber = ((Element) aeNumberParamPath.selectSingleNode (pDocParams)).getText ();
            eventId = ((Element) eventIdParamPath.selectSingleNode (pDocParams)).getText ();
            aeEventSeq = ((Element) aeEventSeqParamPath.selectSingleNode (pDocParams)).getText ();

            if (eventId.equals ("876"))
            {
                amountOfFine = ((Element) AmountOfFinePath.selectSingleNode (pDocParams)).getText ();
                executingCourtId = ((Element) executingCourtIdPath.selectSingleNode (pDocParams)).getText ();
            }

            // Trac 3077 - retrieve AE Event username as the Warrant Created By value
            createdBy = mGetAeEventCreatedBy (aeEventSeq);

            // get the AE associated with the Event
            aeElement = mGetAe (aeNumber);

            // Populate the Warrant Data Object (eventId needed to apply relevant rules)
            warrantDO = mBuildWarrantDO (aeElement, eventId, amountOfFine, executingCourtId, createdBy);

            // Create the warrant
            addWarrantXMLBuilder = new AddWarrantXMLBuilder ();
            warrantDoc = addWarrantXMLBuilder.buildMap (warrantDO);
            warrantResultDoc = mInsertWarrant (warrantDoc);

            warrantNo = warrantResultDoc.getRootElement ().getChild ("Warrant").getChild ("WarrantNumber").getText ();
            warrantId = warrantResultDoc.getRootElement ().getChild ("Warrant").getChild ("WarrantID").getText ();

            // Update the AE Event and the Case Event associated with the AE Event (add the warrant id)
            mUpdateAssociatedEvents (aeEventSeq, warrantId);

            // add the Warrant ID and Number from the newly created warrant to the element to be returned to the client
            XMLBuilder.addParam (paramsElement, "WarrantNumber", warrantNo);
            XMLBuilder.addParam (paramsElement, "WarrantID", warrantId);

            // Output the original XML.
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String sXml = xmlOutputter.outputString (paramsElement);

            // String sXml = xmlOutputter.outputString(warrantDoc.getRootElement());
            pWriter.write (sXml);

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }

        return;
    }

    /**
     * (non-Javadoc)
     * Get ae details.
     *
     * @param pAeNumber the ae number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetAe (final String pAeNumber) throws BusinessException, SystemException, JDOMException
    {

        Element aeElement = null;
        Element aeRootElement = null;
        Element getAeElement = null;
        String getAeParams = null;

        getAeElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getAeElement, "aeNumber", pAeNumber);
        getAeParams = getXMLString (getAeElement);

        aeRootElement = proxy.getJDOM (AE_SERVICE, GET_AE_FOR_WARRANT_INSERT, getAeParams).getRootElement ();

        aeElement = (Element) aeApplicationPath.selectSingleNode (aeRootElement);
        aeElement.detach ();

        return aeElement;
    }

    /**
     * (non-Javadoc)
     * Build warrent data object.
     *
     * @param pAeElement the ae element
     * @param pEventId the event id
     * @param pAmountOfFine the amount of fine
     * @param pExecutingCourtId the executing court id
     * @param pCreatedBy the created by
     * @return the warrant DO
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private WarrantDO mBuildWarrantDO (final Element pAeElement, final String pEventId, final String pAmountOfFine,
                                       final String pExecutingCourtId, final String pCreatedBy)
        throws BusinessException, SystemException, JDOMException
    {

        WarrantDO warrantDO = null;
        Element courtElement = null;
        Element courtAddressElement = null;
        Element partyForElement = null;
        Element partyForAddressElement = null;
        Element partyForRepElement = null;
        Element partyForRepAddressElement = null;
        Element partyAgainstElement = null;
        Element partyAgainstAddressElement = null;
        Element partyAgainstEmpElement = null;
        Element partyAgainstEmpAddressElement = null;
        String issuedByCourtId = null;
        // String executedByCourtId = null;
        final Element courtContactElement = null;
        final Element lineElement = null;
        final int lineCount = 0;

        warrantDO = new WarrantDO ();

        // get the default values for court details
        courtElement = pAeElement.getChild ("Court");
        issuedByCourtId = courtElement.getChildText ("CourtCode");

        // set values common to all events
        partyForElement = pAeElement.getChild ("PartyFor");
        partyForAddressElement = partyForElement.getChild ("Address");
        partyForRepElement = partyForElement.getChild ("Representative");
        if (null != partyForRepElement)
        {
            partyForRepAddressElement = partyForRepElement.getChild ("Address");
        }
        partyAgainstElement = pAeElement.getChild ("PartyAgainst");
        partyAgainstAddressElement = partyAgainstElement.getChild ("Address");
        partyAgainstEmpElement = partyAgainstElement.getChild ("Employer");
        partyAgainstEmpAddressElement = partyAgainstEmpElement.getChild ("Address");

        warrantDO.setCaseNumber (pAeElement.getChildText ("CaseNumber"));
        warrantDO.setCreatedBy (pCreatedBy);
        warrantDO.setIssuedBy (issuedByCourtId);
        warrantDO.setOwnedBy (issuedByCourtId);

        if (issuedByCourtId.equals ("335"))
        {
            warrantDO.setCCBCWarrant ("Y");
        }

        warrantDO.setBalanceOfDebt (pAeElement.getChildText ("AmountOfAE"));
        warrantDO.setBalanceOfDebtCurrency (pAeElement.getChildText ("AmountOfAECurrency"));
        warrantDO.setAmountOfWarrant (pAeElement.getChildText ("AmountOfAE")); // see event 856 below (this value will
                                                                               // be replaced by 0)
        warrantDO.setAmountOfWarrantCurrency (pAeElement.getChildText ("AmountOfAECurrency"));
        warrantDO.setBalanceAfterPaid (pAeElement.getChildText ("AmountOfAE"));
        warrantDO.setBalanceAfterPaidCurrency (pAeElement.getChildText ("AmountOfAECurrency"));
        warrantDO.setIssueDate (mGetSystemDate ());
        warrantDO.setDateRequestReceived (pAeElement.getChildText ("DateOfReceipt"));
        warrantDO.setAdditionalNotes ("GENERATED FROM AE APPLICATION " + pAeElement.getChildText ("AENumber"));

        if (pEventId.equals ("856"))
        {
            warrantDO.setAmountOfWarrant ("0.00");
            warrantDO.setExecutingCourtCode (issuedByCourtId);
            warrantDO.setWarrantType ("COMMITTAL");
            warrantDO.setClaimantName (partyForElement.getChildText ("Name"));
            warrantDO.setClaimantCode (partyForElement.getChildText ("Code"));
            if (null != partyForRepElement)
            {
                warrantDO.setClaimantRepresentativeCode (partyForRepElement.getChildText ("Code"));
                warrantDO.setClaimantRepresentativeName (partyForRepElement.getChildText ("Name"));
                warrantDO.setClaimantRepresentativePartyType (partyForRepElement.getChildText ("PartyType"));
                warrantDO.setClaimantRepresentativeNumber (partyForRepElement.getChildText ("Number"));
                warrantDO
                        .setClaimantRepresentativeTelephoneNumber (partyForRepElement.getChildText ("TelephoneNumber"));
                warrantDO.setClaimantRepresentativeFaxNumber (partyForRepElement.getChildText ("FaxNumber"));
                warrantDO.setClaimantRepresentativeDX (partyForRepElement.getChildText ("DXNumber"));
                warrantDO.setClaimantRepresentativeEmailAddress (partyForRepElement.getChildText ("Email"));
                warrantDO.setClaimantRepresentativeReference (partyForRepElement.getChildText ("Reference"));
                warrantDO.setClaimantRepresentativeAddressLine1 (partyForRepAddressElement.getChildText ("Line1"));
                warrantDO.setClaimantRepresentativeAddressLine2 (partyForRepAddressElement.getChildText ("Line2"));
                warrantDO.setClaimantRepresentativeAddressLine3 (partyForRepAddressElement.getChildText ("Line3"));
                warrantDO.setClaimantRepresentativeAddressLine4 (partyForRepAddressElement.getChildText ("Line4"));
                warrantDO.setClaimantRepresentativeAddressLine5 (partyForRepAddressElement.getChildText ("Line5"));
                warrantDO.setClaimantRepresentativePostCode (partyForRepAddressElement.getChildText ("PostCode"));
            }
            else
            {
                warrantDO.setClaimantRepresentativeName (partyForElement.getChildText ("Name"));
                warrantDO.setClaimantRepresentativeAddressLine1 (partyForAddressElement.getChildText ("Line1"));
                warrantDO.setClaimantRepresentativeAddressLine2 (partyForAddressElement.getChildText ("Line2"));
                warrantDO.setClaimantRepresentativeAddressLine3 (partyForAddressElement.getChildText ("Line3"));
                warrantDO.setClaimantRepresentativeAddressLine4 (partyForAddressElement.getChildText ("Line4"));
                warrantDO.setClaimantRepresentativeAddressLine5 (partyForAddressElement.getChildText ("Line5"));
                warrantDO.setClaimantRepresentativePostCode (partyForAddressElement.getChildText ("PostCode"));

            }
            warrantDO.setDefendant1Name (partyAgainstElement.getChildText ("Name"));
            warrantDO.setDefendant1Number (partyAgainstElement.getChildText ("Number"));
            warrantDO.setDefendant1PartyType (partyAgainstElement.getChildText ("PartyType"));
            warrantDO.setDefendant1AddressLine1 (partyAgainstAddressElement.getChildText ("Line1"));
            warrantDO.setDefendant1AddressLine2 (partyAgainstAddressElement.getChildText ("Line2"));
            warrantDO.setDefendant1AddressLine3 (partyAgainstAddressElement.getChildText ("Line3"));
            warrantDO.setDefendant1AddressLine4 (partyAgainstAddressElement.getChildText ("Line4"));
            warrantDO.setDefendant1AddressLine5 (partyAgainstAddressElement.getChildText ("Line5"));
            warrantDO.setDefendant1PostCode (partyAgainstAddressElement.getChildText ("PostCode"));

        }
        else if (pEventId.equals ("876"))
        {
            warrantDO.setWarrantType ("CONTROL");
            warrantDO.setClaimantName ("COURT MANAGER");

            courtAddressElement = courtElement.getChild ("Address");

            if (issuedByCourtId.equals ("335"))
            {
                warrantDO.setClaimantRepresentativeName ("THE COUNTY COURT BUSINESS CENTRE");
            }
            else if (issuedByCourtId.equals ("390") || issuedByCourtId.equals ("391"))
            {
                warrantDO.setClaimantRepresentativeName ("THE COUNTY COURT MONEY CLAIMS CENTRE");
            }
            else
            {
                warrantDO.setClaimantRepresentativeName ("THE COUNTY COURT AT " + courtElement.getChildText ("Name"));
            }

            warrantDO.setClaimantRepresentativeTelephoneNumber (courtElement.getChildText ("TelephoneNumber"));
            warrantDO.setClaimantRepresentativeFaxNumber (courtElement.getChildText ("FaxNumber"));
            warrantDO.setClaimantRepresentativeDX (courtElement.getChildText ("DXNumber"));

            warrantDO.setClaimantRepresentativeAddressLine1 (courtAddressElement.getChildText ("Line1"));
            warrantDO.setClaimantRepresentativeAddressLine2 (courtAddressElement.getChildText ("Line2"));
            warrantDO.setClaimantRepresentativeAddressLine3 (courtAddressElement.getChildText ("Line3"));
            warrantDO.setClaimantRepresentativeAddressLine4 (courtAddressElement.getChildText ("Line4"));
            warrantDO.setClaimantRepresentativeAddressLine5 (courtAddressElement.getChildText ("Line5"));
            warrantDO.setClaimantRepresentativePostCode (courtAddressElement.getChildText ("PostCode"));

            if (pExecutingCourtId == null)
            {
                warrantDO.setExecutingCourtCode (issuedByCourtId);
            }
            else
            {
                warrantDO.setExecutingCourtCode (pExecutingCourtId);
            }

            warrantDO.setDefendant1Name (partyAgainstEmpElement.getChildText ("Name"));
            warrantDO.setDefendant1AddressLine1 (partyAgainstEmpAddressElement.getChildText ("Line1"));
            warrantDO.setDefendant1AddressLine2 (partyAgainstEmpAddressElement.getChildText ("Line2"));
            warrantDO.setDefendant1AddressLine3 (partyAgainstEmpAddressElement.getChildText ("Line3"));
            warrantDO.setDefendant1AddressLine4 (partyAgainstEmpAddressElement.getChildText ("Line4"));
            warrantDO.setDefendant1AddressLine5 (partyAgainstEmpAddressElement.getChildText ("Line5"));
            warrantDO.setDefendant1PostCode (partyAgainstEmpAddressElement.getChildText ("PostCode"));

            warrantDO.setBalanceOfDebt (pAmountOfFine);
            warrantDO.setBalanceOfDebtCurrency (pAeElement.getChildText ("AmountOfAECurrency"));
            warrantDO.setAmountOfWarrant (pAmountOfFine);
            warrantDO.setAmountOfWarrantCurrency (pAeElement.getChildText ("AmountOfAECurrency"));
            warrantDO.setBalanceAfterPaid (pAmountOfFine);
            warrantDO.setBalanceAfterPaidCurrency (pAeElement.getChildText ("AmountOfAECurrency"));

        }

        return warrantDO;
    }

    /**
     * (non-Javadoc)
     * Insert warrent.
     *
     * @param warrantDoc the warrant doc
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document mInsertWarrant (final Document warrantDoc) throws BusinessException, SystemException
    {

        Element warrantElement = null;
        Element paramsElement = null;
        String sXmlParams = null;
        Document warrantResultDoc = null;

        final Element insertCoEventRowElement = null;
        final Element coEventElement = null;

        warrantElement = (Element) warrantDoc.getRootElement ().clone ();
        warrantElement.detach ();

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "warrantDetails", warrantElement);

        sXmlParams = out.outputString (paramsElement);
        warrantResultDoc = proxy.getJDOM (WARRANT_SERVICE, ADD_WARRANT, sXmlParams);
        return warrantResultDoc;
    }

    /**
     * (non-Javadoc)
     * Add the (newly created) Warrant Id to the AE and CASE events.
     *
     * @param pAeEventSeq the ae event seq
     * @param pWarrantId the warrant id
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mUpdateAssociatedEvents (final String pAeEventSeq, final String pWarrantId)
        throws BusinessException, SystemException
    {

        Element paramsElement = null;
        String sXmlParams = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "aeEventSeq", pAeEventSeq);
        XMLBuilder.addParam (paramsElement, "warrantId", pWarrantId);
        sXmlParams = out.outputString (paramsElement);

        // The AE event is updated
        proxy.getJDOM (AeEventDefs.AE_EVENT_SERVICE, AeEventDefs.UPDATE_AE_EVENT_WARRANT_ID, sXmlParams);

        // The Case event is updated
        proxy.getJDOM (CaseEventDefs.CASE_EVENT_SERVICE, CaseEventDefs.UPDATE_CASE_EVENT_WITH_WARRANT_ID_FOR_AE_EVENT,
                sXmlParams);
    }

    /**
     * (non-Javadoc)
     * Get court details from court id.
     *
     * @param pCourtId the court id
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetCourt (final String pCourtId) throws BusinessException, SystemException, JDOMException
    {

        Element courtElement = null;
        Element courtRootElement = null;
        Element getCourtElement = null;
        String getCourtParams = null;

        getCourtElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getCourtElement, "courtId", pCourtId);
        getCourtParams = getXMLString (getCourtElement);

        courtRootElement = proxy.getJDOM (COURT_SERVICE, GET_COURT, getCourtParams).getRootElement ();

        courtElement = (Element) courtPath.selectSingleNode (courtRootElement);
        courtElement.detach ();

        return courtElement;

    }

    /**
     * (non-Javadoc)
     * Get database server date.
     *
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetSystemDate () throws SystemException, BusinessException
    {
        Element getSystemDateElement = null;
        Element getDateParamsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        String systemDate = null;

        getDateParamsElement = mGetSystemDateParams ();
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (getDateParamsElement);

        getSystemDateElement = proxy.getJDOM (SYSTEM_DATE_SERVICE, GET_SYSTEM_DATE, sXmlParams).getRootElement ();

        systemDate = getSystemDateElement.getText ();

        return systemDate;
    } // mGetSystemDate()

    /**
     * (non-Javadoc)
     * Build the Parameter XML for passing to the getSystemDate service.
     *
     * @return the element
     */
    private Element mGetSystemDateParams ()
    {
        Element paramsElement = null;
        final String sValue = null;

        // Build the Parameter XML for passing to the getSystemDate service.
        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "date", "");

        return paramsElement;
    } // mGetSystemDateParams()

    /**
     * (non-Javadoc)
     * Retrieves the AE Event's user id for use as the Warrant Created By.
     *
     * @param aeEventSeq The AE Event Sequence
     * @return The AE Event's Username value
     * @throws SystemException System Exception
     * @throws BusinessException Business Exception
     * @throws JDOMException JDOM Exception
     */
    private String mGetAeEventCreatedBy (final String aeEventSeq)
        throws SystemException, BusinessException, JDOMException
    {
        final Element getAeEventCreatedByElement;
        final Element aeEventRootElement;
        final String getAeEventParams;
        final String userName;

        getAeEventCreatedByElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getAeEventCreatedByElement, "aeEventSeq", aeEventSeq);
        getAeEventParams = getXMLString (getAeEventCreatedByElement);

        aeEventRootElement = proxy.getJDOM (AEEVENT_SERVICE, GET_AE_EVENT_USERNAME, getAeEventParams).getRootElement ();

        userName = ((Element) XPath.selectSingleNode (aeEventRootElement, "/ds/AeEvent/UserName")).getText ();

        return userName;
    } // mGetAeEventCreatedBy()

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
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }
} // class InsertCoEventUpdatesCustomProcessor
