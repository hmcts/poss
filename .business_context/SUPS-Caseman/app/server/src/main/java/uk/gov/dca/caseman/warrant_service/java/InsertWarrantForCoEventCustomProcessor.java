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
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.co_event_service.java.CoEventDefs;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Created on 13 FEB 2006
 * 
 * Adds a warrant record when invoked from the CoEvent service.
 * 
 * Change History
 * --------------
 * 
 * 13/02/2006 V1.0 Chris Hutt
 * 
 * 02/03/2006 v1.1 Chris Hutt Owning Court = Issuing Court = Co.admin_court_code
 * 23/03/2006 v1.2 Chris Hutt executingCourtCode param accepted as used to populate court details
 * 17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 31-May-2006 Paul Robinson Defect 2706 - mBuildWarrantDO method not picking up party against address - reviewd by
 * CHutt
 * 12/06/2006 Chris Hutt Defect 3466: warrant id posted to co events
 * court telephone number added to warrant
 * 12/09/2006 Paul Robinson Defect 5192: Co Event 876 not picking up Amount of Warrant
 * 13/09/2006 Chris Hutt Defect 5192: 876 balance of debt = amount of warrant (as per legacy)
 * 15/01/2007 Chris Hutt Defect Temp_caseman 393: Events should have ' COUNTY COURT' appended to the
 * ClaimantRepresentative
 * NOTE: this custom processor handles events 876 and 968. However, the 968 code is never used!
 * Word processing does it's own stuff.
 * 16/02/2007 Chris Hutt defect 5979: 1. PartyForSol should be the Issuing Court and NOT the Executing Court
 * 2. PartyAgainst1 should be the Employer rather Debtor.
 * 
 * 20/02/2007 Chris Hutt defect 5979 - not using employer's postcode for Party Against details
 * 23/04/2007 Chris Vincent defect 6170 - update mBuildWarrantDO() so sets CCBCWarrant node for warrants issued by CCBC.
 * 05/12/2013 Chris Vincent Single Court changes e.g. Northampton County Court now becomes The County Court at
 * Northampton, Trac 5014
 * Also added TCE changes to change Warrants of Execution to Warrants of Control. Trac 5025.
 * 
 * @author chris hutt
 */
public class InsertWarrantForCoEventCustomProcessor implements ICustomProcessor
{
    
    /** The Constant COURT_SERVICE. */
    private static final String COURT_SERVICE = "ejb/CourtServiceLocal";
    
    /** The Constant WARRANT_SERVICE. */
    private static final String WARRANT_SERVICE = "ejb/WarrantServiceLocal";
    
    /** The Constant CO_SERVICE. */
    private static final String CO_SERVICE = "ejb/CoServiceLocal";

    /** The Constant GET_CO. */
    private static final String GET_CO = "getCoLocal";
    
    /** The Constant ADD_WARRANT_FOR_CO. */
    private static final String ADD_WARRANT_FOR_CO = "addWarrantForCoLocal";
    
    /** The Constant GET_COURT_AND_ADDR_TYPE. */
    private static final String GET_COURT_AND_ADDR_TYPE = "getCourtAndAddrTypeLocal";

    /** The Constant SYSTEM_DATE_SERVICE. */
    private static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    
    /** The Constant GET_SYSTEM_DATE. */
    private static final String GET_SYSTEM_DATE = "getSystemDateLocal";

    /** The co number param path. */
    private final XPath coNumberParamPath;
    
    /** The event id param path. */
    private final XPath eventIdParamPath;
    
    /** The co path. */
    private final XPath coPath;
    
    /** The Warrant number path. */
    private final XPath WarrantNumberPath;
    
    /** The Warrant id path. */
    private final XPath WarrantIdPath;
    
    /** The Amount of warrant path. */
    private final XPath AmountOfWarrantPath;
    
    /** The Amount of warrant currency path. */
    private final XPath AmountOfWarrantCurrencyPath;
    
    /** The Amount of fine path. */
    private final XPath AmountOfFinePath;
    
    /** The Bailiff id path. */
    private final XPath BailiffIdPath;
    
    /** The court path. */
    private final XPath courtPath;
    
    /** The user id path. */
    private final XPath userIdPath;
    
    /** The court id path. */
    private final XPath courtIdPath;
    
    /** The executing court code path. */
    private final XPath executingCourtCodePath;
    
    /** The co event seq param path. */
    private final XPath coEventSeqParamPath;

    /** The out. */
    private final XMLOutputter out;
    
    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public InsertWarrantForCoEventCustomProcessor () throws JDOMException
    {
        eventIdParamPath = XPath.newInstance ("params/param[@name='eventId']");
        coNumberParamPath = XPath.newInstance ("params/param[@name='coNumber']");
        AmountOfWarrantPath = XPath.newInstance ("params/param[@name='amountOfWarrant']");
        AmountOfWarrantCurrencyPath = XPath.newInstance ("params/param[@name='amountOfWarrantCurrency']");
        AmountOfFinePath = XPath.newInstance ("params/param[@name='AmountOfFine']");
        BailiffIdPath = XPath.newInstance ("params/param[@name='bailiffId']");
        userIdPath = XPath.newInstance ("params/param[@name='userId']");
        courtIdPath = XPath.newInstance ("params/param[@name='courtId']");
        executingCourtCodePath = XPath.newInstance ("params/param[@name='executingCourtCode']");
        coEventSeqParamPath = XPath.newInstance ("params/param[@name='eventSeq']");

        WarrantNumberPath = XPath.newInstance ("ds/Warrant/WarrantNumber");
        WarrantIdPath = XPath.newInstance ("ds/Warrant/WarrantID");

        coPath = XPath.newInstance ("/ds/MaintainCO");
        courtPath = XPath.newInstance ("/Courts/Court");

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
        Element coElement = null;
        String coNumber = null;
        String eventId = null;
        Document warrantDoc = null;
        String warrantNo = null;
        String warrantId = null;
        Document warrantResultDoc = null;
        final Element warrantNumberElement = null;
        String amountOfWarrant = "0.00";
        String amountOfWarrantCurrency = "GBP";
        String bailiffId = "";
        String userId = null;
        String courtId = null;
        String executingCourtCode = null;
        String coEventSeq = null;

        try
        {

            final Element paramsElement = pDocParams.getRootElement ();

            coNumber = ((Element) coNumberParamPath.selectSingleNode (pDocParams)).getText ();
            eventId = ((Element) eventIdParamPath.selectSingleNode (pDocParams)).getText ();
            userId = ((Element) userIdPath.selectSingleNode (pDocParams)).getText ();
            courtId = ((Element) courtIdPath.selectSingleNode (pDocParams)).getText ();
            executingCourtCode = ((Element) executingCourtCodePath.selectSingleNode (pDocParams)).getText ();
            coEventSeq = ((Element) coEventSeqParamPath.selectSingleNode (pDocParams)).getText ();

            if (eventId.equals ("968"))
            {
                amountOfWarrant = ((Element) AmountOfWarrantPath.selectSingleNode (pDocParams)).getText ();
                amountOfWarrantCurrency =
                        ((Element) AmountOfWarrantCurrencyPath.selectSingleNode (pDocParams)).getText ();
                bailiffId = ((Element) BailiffIdPath.selectSingleNode (pDocParams)).getText ();
            }

            if (eventId.equals ("876"))
            {
                amountOfWarrant = ((Element) AmountOfFinePath.selectSingleNode (pDocParams)).getText ();
                // amountOfWarrantCurrency = ((Element) AmountOfWarrantCurrencyPath.selectSingleNode(
                // pDocParams)).getText();
            }

            // get the AE associated with the Event
            coElement = mGetCo (coNumber);

            // Populate the Warrant Data Object (eventId needed to apply relevant rules)
            warrantDO = mBuildWarrantDO (coElement, eventId, amountOfWarrant, amountOfWarrantCurrency, bailiffId,
                    userId, courtId, executingCourtCode);

            // Create the warrant
            addWarrantXMLBuilder = new AddWarrantXMLBuilder ();
            warrantDoc = addWarrantXMLBuilder.buildMap (warrantDO);
            warrantResultDoc = mInsertWarrant (warrantDoc);

            warrantNo = warrantResultDoc.getRootElement ().getChild ("Warrant").getChild ("WarrantNumber").getText ();
            warrantId = warrantResultDoc.getRootElement ().getChild ("Warrant").getChild ("WarrantID").getText ();

            // Update the Co Event (add the warrant id)
            mUpdateAssociatedEvent (coEventSeq, warrantId);

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
     * Get co details.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mGetCo (final String pCoNumber) throws BusinessException, SystemException, JDOMException
    {

        Element coElement = null;
        Element coRootElement = null;
        Element getCoElement = null;
        String getCoParams = null;

        getCoElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getCoElement, "coNumber", pCoNumber);
        getCoParams = getXMLString (getCoElement);

        coRootElement = proxy.getJDOM (CO_SERVICE, GET_CO, getCoParams).getRootElement ();

        coElement = (Element) coPath.selectSingleNode (coRootElement);
        coElement.detach ();

        return coElement;
    }

    /**
     * (non-Javadoc)
     * Build warrent data object.
     *
     * @param pCoElement the co element
     * @param pEventId the event id
     * @param pAmountOfWarrant the amount of warrant
     * @param pAmountOfWarrantCurrency the amount of warrant currency
     * @param pBailiffId the bailiff id
     * @param pUserId the user id
     * @param pCourtId the court id
     * @param pExecutingCourtCode the executing court code
     * @return the warrant DO
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private WarrantDO mBuildWarrantDO (final Element pCoElement, final String pEventId, final String pAmountOfWarrant,
                                       final String pAmountOfWarrantCurrency, final String pBailiffId,
                                       final String pUserId, final String pCourtId, final String pExecutingCourtCode)
        throws BusinessException, SystemException, JDOMException
    {

        WarrantDO warrantDO = null;
        Element courtElement = null;
        Element courtAddressElement = null;
        Element courtContactElement = null;
        final Element partyForElement = null;
        final Element partyForRepElement = null;
        final Element partyForRepAddressElement = null;
        final Element partyAgainstElement = null;
        final Element partyAgainstAddressElement = null;
        final Element partyAgainstEmpElement = null;
        final Element partyAgainstEmpAddressElement = null;
        String owningCourtId = null;
        String addressLine = null;
        int nx = 0;
        Element debtorAddressElement = null;
        Element debtorElement = null;
        Element employerAddressElement = null;
        Element employerElement = null;
        List<Element> addressList = null;
        final float warrantAmountf;
        float balanceOfDebtf;
        String balanceOfDebt = null;

        warrantDO = new WarrantDO ();

        owningCourtId = pCoElement.getChildText ("OwningCourtCode");
        courtElement = mGetCourt (pCourtId);
        courtContactElement = courtElement.getChild ("ContactDetails");
        courtAddressElement = courtContactElement.getChild ("Addresses").getChild ("Address");
        debtorElement = pCoElement.getChild ("Debtor");
        debtorAddressElement = debtorElement.getChild ("Address");
        employerElement = pCoElement.getChild ("Employer");
        employerAddressElement = employerElement.getChild ("Address");
        balanceOfDebt = pCoElement.getChild ("DebtSummary").getChildText ("BalanceDueFromDebtor");
        if (balanceOfDebt.equals (""))
        {
            balanceOfDebt = "0";
        }
        if (pEventId.equals ("876"))
        {
            balanceOfDebt = pAmountOfWarrant;
        }

        if (owningCourtId.equals ("335"))
        {
            warrantDO.setCCBCWarrant ("Y");
        }

        warrantDO.setCONumber (pCoElement.getChildText ("CONumber"));
        // 1.1 warrantDO.setIssuedBy(pCourtId);
        warrantDO.setIssuedBy (owningCourtId);
        warrantDO.setExecutingCourtCode (pExecutingCourtCode);
        warrantDO.setOwnedBy (owningCourtId);
        warrantDO.setBailiffAreaNo (pBailiffId);

        // Defect 4921 raised for event 876 requiring CONTROL warrant. Not
        // sure if other event created warrants should also be CONTROL
        // (don't think AO is a valid type) but no specific defect so will
        // leave for now - S Blair
        if (pEventId.equals ("876"))
        {
            warrantDO.setWarrantType ("CONTROL");
        }
        else
        {
            warrantDO.setWarrantType ("AO");
        }

        warrantDO.setAdditionalNotes ("GENERATED FROM CO APPLICATION " + pCoElement.getChildText ("CONumber"));
        warrantDO.setIssueDate (mGetSystemDate ());

        // Party For
        warrantDO.setClaimantName ("COURT MANAGER");

        if (pCourtId.equals ("335"))
        {
            warrantDO.setClaimantRepresentativeName ("THE COUNTY COURT BUSINESS CENTRE");
        }
        else if (pCourtId.equals ("390") || pCourtId.equals ("391"))
        {
            warrantDO.setClaimantRepresentativeName ("THE COUNTY COURT MONEY CLAIMS CENTRE");
        }
        else
        {
            warrantDO.setClaimantRepresentativeName ("THE COUNTY COURT AT " + courtElement.getChildText ("Name"));
        }

        warrantDO.setClaimantRepresentativeTelephoneNumber (courtContactElement.getChildText ("TelephoneNumber"));
        warrantDO.setClaimantRepresentativeFaxNumber (courtContactElement.getChildText ("FaxNumber"));
        warrantDO.setClaimantRepresentativeDX (courtContactElement.getChildText ("DX"));

        addressList = courtAddressElement.getChildren ("Line");
        final Iterator<Element> eit = addressList.iterator ();
        while (eit.hasNext ())
        {
            nx++;
            addressLine = ((Element) eit.next ()).getText ();
            switch (nx)
            {
                case 1:
                    warrantDO.setClaimantRepresentativeAddressLine1 (addressLine);
                    break;
                case 2:
                    warrantDO.setClaimantRepresentativeAddressLine2 (addressLine);
                    break;
                case 3:
                    warrantDO.setClaimantRepresentativeAddressLine3 (addressLine);
                    break;
                case 4:
                    warrantDO.setClaimantRepresentativeAddressLine4 (addressLine);
                    break;
                case 5:
                    warrantDO.setClaimantRepresentativeAddressLine5 (addressLine);
                    break;
            }

        }
        warrantDO.setClaimantRepresentativePostCode (courtAddressElement.getChildText ("PostCode"));

        // Party Against
        nx = 0;
        warrantDO.setDefendant1Name (employerElement.getChildText ("Name"));
        warrantDO.setDefendant1Number ("1");
        // warrantDO.setDefendant1PartyType("?");
        addressList = employerAddressElement.getChildren ("Line");
        final Iterator<Element> it = addressList.iterator ();
        while (it.hasNext ())
        {
            nx++;
            addressLine = ((Element) it.next ()).getText ();
            switch (nx)
            {
                case 1:
                    warrantDO.setDefendant1AddressLine1 (addressLine);
                    break;
                case 2:
                    warrantDO.setDefendant1AddressLine2 (addressLine);
                    break;
                case 3:
                    warrantDO.setDefendant1AddressLine3 (addressLine);
                    break;
                case 4:
                    warrantDO.setDefendant1AddressLine4 (addressLine);
                    break;
                case 5:
                    warrantDO.setDefendant1AddressLine5 (addressLine);
                    break;
            }

        }
        warrantDO.setDefendant1PostCode (employerAddressElement.getChildText ("PostCode"));

        warrantDO.setAmountOfWarrant (pAmountOfWarrant);
        warrantDO.setAmountOfWarrantCurrency (pAmountOfWarrantCurrency);

        warrantDO.setFee ("0");
        warrantDO.setFeeCurrency (pAmountOfWarrantCurrency);

        warrantDO.setBalanceAfterPaidCurrency (pAmountOfWarrantCurrency);

        warrantDO.setBalanceOfDebt (balanceOfDebt);
        warrantDO.setBalanceOfDebtCurrency (pAmountOfWarrantCurrency);

        // Calculate balance after amount paid
        warrantAmountf = Float.parseFloat (pAmountOfWarrant);
        balanceOfDebtf = Float.parseFloat (balanceOfDebt);
        balanceOfDebtf = balanceOfDebtf - warrantAmountf;
        balanceOfDebtf = Math.round (balanceOfDebtf * 100) / 100f; // make sure only 2dp
        warrantDO.setBalanceAfterPaid (Float.toString (balanceOfDebtf));
        warrantDO.setBalanceAfterPaidCurrency (pAmountOfWarrantCurrency);

        warrantDO.setCreatedBy (pUserId);

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

        warrantElement = (Element) warrantDoc.getRootElement ().clone ();
        warrantElement.detach ();

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "warrantDetails", warrantElement);

        sXmlParams = out.outputString (paramsElement);
        warrantResultDoc = proxy.getJDOM (WARRANT_SERVICE, ADD_WARRANT_FOR_CO, sXmlParams);

        return warrantResultDoc;

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
        XMLBuilder.addParam (getCourtElement, "addressType", "OFFICE");
        getCourtParams = getXMLString (getCourtElement);

        courtRootElement = proxy.getJDOM (COURT_SERVICE, GET_COURT_AND_ADDR_TYPE, getCourtParams).getRootElement ();

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
     * Add the (newly created) Warrant Id to the CO event.
     *
     * @param pCoEventSeq the co event seq
     * @param pWarrantId the warrant id
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mUpdateAssociatedEvent (final String pCoEventSeq, final String pWarrantId)
        throws BusinessException, SystemException
    {

        Element paramsElement = null;
        String sXmlParams = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "coEventSeq", pCoEventSeq);
        XMLBuilder.addParam (paramsElement, "warrantId", pWarrantId);
        sXmlParams = out.outputString (paramsElement);

        // The Co event is updated
        proxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.UPDATE_CO_EVENT_WARRANT_ID, sXmlParams);

    }

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
