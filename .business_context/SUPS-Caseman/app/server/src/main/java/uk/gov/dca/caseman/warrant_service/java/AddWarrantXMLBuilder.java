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

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;

/**
 * Created on 12 july 2005.
 *
 * @author gzyysf
 * 
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         20-May-2011 Chris Vincent: Trac 3077, add Warrant Created By to map
 */
public class AddWarrantXMLBuilder
{

    /** The out. */
    private final XMLOutputter out;

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;

    /**
     * Constructor.
     */
    public AddWarrantXMLBuilder ()
    {
        proxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Builds a warrant xml document from a warrant data object.
     * 
     * @param pWarrantDO The warrant data object.
     * @return The warrant document.
     */
    public Document buildMap (final WarrantDO pWarrantDO)
    {

        final Document warrantDoc = new Document ();
        final Element dsElement = new Element ("ds");
        final Element warrantElement = new Element ("Warrant");
        final Element cliamantElement = new Element ("Claimant");
        final Element cliamantRepresentativeElement = new Element ("Representative");
        final Element cliamantRepresentativeContactElement = new Element ("ContactDetails");
        final Element cliamantRepresentativeContactAddressElement = new Element ("Address");

        final Element def1Element = new Element ("Defendant1");
        final Element def1AddressElement = new Element ("Address");
        final Element def2Element = new Element ("Defendant2");
        final Element def2AddressElement = new Element ("Address");

        XMLBuilder.add (warrantElement, "WarrantID", pWarrantDO.getWarrantID ());
        XMLBuilder.add (warrantElement, "WarrantNumber", pWarrantDO.getWarrantNumber ());

        XMLBuilder.add (warrantElement, "LocalNumber", pWarrantDO.getLocalNumber ());

        XMLBuilder.add (warrantElement, "ToTransfer", pWarrantDO.getToTransfer ());
        XMLBuilder.add (warrantElement, "TransferDate", pWarrantDO.getTransferDate ());

        /* XMLBuilder.add(warrantElement,
         * "CaseEventSeq",
         * pWarrantDO.getCaseEventSeq()); */
        XMLBuilder.add (warrantElement, "OriginalWarrantNumber", pWarrantDO.getOriginalWarrantNumber ());

        XMLBuilder.add (warrantElement, "WarrantType", pWarrantDO.getWarrantType ());

        XMLBuilder.add (warrantElement, "CaseNumber", pWarrantDO.getCaseNumber ());

        XMLBuilder.add (warrantElement, "CONumber", pWarrantDO.getCONumber ());

        XMLBuilder.add (warrantElement, "DateRequestReceived", pWarrantDO.getDateRequestReceived ());

        XMLBuilder.add (warrantElement, "IssuedBy", pWarrantDO.getIssuedBy ());

        XMLBuilder.add (warrantElement, "CreatedBy", pWarrantDO.getCreatedBy ());

        XMLBuilder.add (warrantElement, "IssueDate", pWarrantDO.getIssueDate ());

        XMLBuilder.add (warrantElement, "OwnedBy", pWarrantDO.getOwnedBy ());

        XMLBuilder.add (warrantElement, "HomeCourtIssueDate", pWarrantDO.getHomeCourtIssueDate ());

        XMLBuilder.add (warrantElement, "ExecutingCourtCode", pWarrantDO.getExecutingCourtCode ());

        XMLBuilder.add (warrantElement, "BailiffAreaNo", pWarrantDO.getBailiffAreaNo ());
        XMLBuilder.add (warrantElement, "AdditionalNotes", pWarrantDO.getAdditionalNotes ());

        XMLBuilder.add (warrantElement, "BalanceOfDebt", pWarrantDO.getBalanceOfDebt ());
        XMLBuilder.add (warrantElement, "BalanceOfDebtCurrency", pWarrantDO.getBalanceAfterPaidCurrency ());

        XMLBuilder.add (warrantElement, "AmountOfWarrant", pWarrantDO.getAmountOfWarrant ());
        XMLBuilder.add (warrantElement, "AmountOfWarrantCurrency", pWarrantDO.getAmountOfWarrantCurrency ());

        XMLBuilder.add (warrantElement, "Fee", pWarrantDO.getFee ());
        XMLBuilder.add (warrantElement, "FeeCurrency", pWarrantDO.getFeeCurrency ());

        XMLBuilder.add (warrantElement, "SolicitorsCosts", pWarrantDO.getSolicitorsCosts ());
        XMLBuilder.add (warrantElement, "SolicitorsCostsCurrency", pWarrantDO.getSolicitorsCostsCurrency ());

        XMLBuilder.add (warrantElement, "LandRegistryFee", pWarrantDO.getLandRegistryFee ());
        XMLBuilder.add (warrantElement, "LandRegistryFeeCurrency", pWarrantDO.getLandRegistryFeeCurrency ());

        XMLBuilder.add (warrantElement, "BalanceAfterPaid", pWarrantDO.getBalanceAfterPaid ());

        XMLBuilder.add (warrantElement, "BalanceAfterPaidCurrency", pWarrantDO.getBalanceAfterPaidCurrency ());

        XMLBuilder.add (warrantElement, "CCBCWarrant", pWarrantDO.getCCBCWarrant ());

        XMLBuilder.add (cliamantElement, "Name", pWarrantDO.getClaimantName ());

        XMLBuilder.add (cliamantElement, "Code", pWarrantDO.getClaimantCode ());
        XMLBuilder.add (cliamantRepresentativeElement, "Number", pWarrantDO.getClaimantRepresentativeNumber ());

        XMLBuilder.add (cliamantRepresentativeElement, "PartyType", pWarrantDO.getClaimantRepresentativePartyType ());
        XMLBuilder.add (cliamantRepresentativeElement, "Name", pWarrantDO.getClaimantRepresentativeName ());

        XMLBuilder.add (cliamantRepresentativeElement, "Reference", pWarrantDO.getClaimantRepresentativeReference ());

        XMLBuilder.add (cliamantRepresentativeElement, "Code", pWarrantDO.getClaimantRepresentativeCode ());
        XMLBuilder.add (cliamantRepresentativeContactElement, "DX", pWarrantDO.getClaimantRepresentativeDX ());

        XMLBuilder.add (cliamantRepresentativeContactElement, "TelephoneNumber",
                pWarrantDO.getClaimantRepresentativeTelephoneNumber ());
        XMLBuilder.add (cliamantRepresentativeContactElement, "FaxNumber",
                pWarrantDO.getClaimantRepresentativeFaxNumber ());

        XMLBuilder.add (cliamantRepresentativeContactElement, "EmailAddress",
                pWarrantDO.getClaimantRepresentativeEmailAddress ());
        XMLBuilder.add (cliamantRepresentativeContactAddressElement, "Line",
                pWarrantDO.getClaimantRepresentativeAddressLine1 ());
        XMLBuilder.add (cliamantRepresentativeContactAddressElement, "Line",
                pWarrantDO.getClaimantRepresentativeAddressLine2 ());
        XMLBuilder.add (cliamantRepresentativeContactAddressElement, "Line",
                pWarrantDO.getClaimantRepresentativeAddressLine3 ());
        XMLBuilder.add (cliamantRepresentativeContactAddressElement, "Line",
                pWarrantDO.getClaimantRepresentativeAddressLine4 ());
        XMLBuilder.add (cliamantRepresentativeContactAddressElement, "Line",
                pWarrantDO.getClaimantRepresentativeAddressLine5 ());

        XMLBuilder.add (cliamantRepresentativeContactAddressElement, "PostCode",
                pWarrantDO.getClaimantRepresentativePostCode ());

        XMLBuilder.add (def1Element, "Name", pWarrantDO.getDefendant1Name ());
        XMLBuilder.add (def1Element, "Number", pWarrantDO.getDefendant1Number ());
        XMLBuilder.add (def1Element, "PartyType", pWarrantDO.getDefendant1PartyType ());
        XMLBuilder.add (def1Element, "JudgmentID", pWarrantDO.getDefendant1JudgmentID ());

        XMLBuilder.add (def1AddressElement, "Line", pWarrantDO.getDefendant1AddressLine1 ());
        XMLBuilder.add (def1AddressElement, "Line", pWarrantDO.getDefendant1AddressLine2 ());
        XMLBuilder.add (def1AddressElement, "Line", pWarrantDO.getDefendant1AddressLine3 ());
        XMLBuilder.add (def1AddressElement, "Line", pWarrantDO.getDefendant1AddressLine4 ());
        XMLBuilder.add (def1AddressElement, "Line", pWarrantDO.getDefendant1AddressLine5 ());

        XMLBuilder.add (def1AddressElement, "PostCode", pWarrantDO.getDefendant1PostCode ());

        XMLBuilder.add (def2Element, "Name", pWarrantDO.getDefendant2Name ());
        XMLBuilder.add (def2Element, "Number", pWarrantDO.getDefendant2Number ());
        XMLBuilder.add (def2Element, "PartyType", pWarrantDO.getDefendant2PartyType ());
        XMLBuilder.add (def2Element, "JudgmentID", pWarrantDO.getDefendant2JudgmentID ());

        XMLBuilder.add (def2AddressElement, "Line", pWarrantDO.getDefendant2AddressLine1 ());
        XMLBuilder.add (def2AddressElement, "Line", pWarrantDO.getDefendant2AddressLine2 ());
        XMLBuilder.add (def2AddressElement, "Line", pWarrantDO.getDefendant2AddressLine3 ());
        XMLBuilder.add (def2AddressElement, "Line", pWarrantDO.getDefendant2AddressLine4 ());
        XMLBuilder.add (def2AddressElement, "Line", pWarrantDO.getDefendant2AddressLine5 ());

        XMLBuilder.add (def2AddressElement, "PostCode", pWarrantDO.getDefendant2PostCode ());

        cliamantRepresentativeContactElement.addContent (cliamantRepresentativeContactAddressElement);
        cliamantRepresentativeElement.addContent (cliamantRepresentativeContactElement);
        cliamantElement.addContent (cliamantRepresentativeElement);
        def1Element.addContent (def1AddressElement);
        def2Element.addContent (def2AddressElement);
        warrantElement.addContent (cliamantElement);
        warrantElement.addContent (def1Element);
        warrantElement.addContent (def2Element);
        dsElement.addContent (warrantElement);

        warrantDoc.addContent (((Element) dsElement.clone ()).detach ());

        return warrantDoc;

    } // getCoEventConfigurationElement()

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

} // class AeValidationXMLBuilder
