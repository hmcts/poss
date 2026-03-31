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
package uk.gov.dca.caseman.payments_service.java.util;

import org.jdom.Element;

/**
 * The Class NullPayment.
 */
public class NullPayment extends Payment
{

    /**
     * Instantiates a new null payment.
     */
    NullPayment ()
    {
        super (new Element ("Payment"), new ServiceCaller (null));

        payment.addContent (new Element ("TransactionNumber"));
        payment.addContent (new Element ("EnforcementNumber"));
        payment.addContent (new Element ("EnforcementType"));
        payment.addContent (new Element ("Amount"));
        payment.addContent (new Element ("AmountCurrency"));
        payment.addContent (new Element ("PaymentType"));
        payment.addContent (new Element ("RetentionType"));
        payment.addContent (new Element ("OverpaymentAmount"));
        payment.addContent (new Element ("OverpaymentAmountCurrency"));
        payment.addContent (new Element ("AmountNowDue"));
        payment.addContent (new Element ("CounterPayment"));
        payment.addContent (new Element ("PaymentDate").setText ("1970-01-01"));
        payment.addContent (new Element ("ReleaseDate").setText ("2999-01-01"));
        payment.addContent (new Element ("PayoutDate"));
        payment.addContent (new Element ("RDDate"));
        payment.addContent (new Element ("Notes"));

        payment.addContent (new Element ("Lodgment"));
        final Element lodgment = payment.getChild ("Lodgment");
        lodgment.addContent (new Element ("Name"));
        lodgment.addContent (new Element ("PartyRole"));
        lodgment.addContent (new Element ("CasePartyNumber"));
        lodgment.addContent (new Element ("Address"));
        final Element lodgmentAddress = lodgment.getChild ("Address");
        lodgmentAddress.addContent (new Element ("Line"));
        lodgmentAddress.addContent (new Element ("Line"));
        lodgmentAddress.addContent (new Element ("Line"));
        lodgmentAddress.addContent (new Element ("Line"));
        lodgmentAddress.addContent (new Element ("Line"));
        lodgmentAddress.addContent (new Element ("PostCode"));
        lodgmentAddress.addContent (new Element ("Reference"));

        payment.addContent (new Element ("PONumber1"));
        payment.addContent (new Element ("PONumber2"));
        payment.addContent (new Element ("POTotal"));
        payment.addContent (new Element ("POTotalCurrency"));
        payment.addContent (new Element ("ReceiptRequired"));
        payment.addContent (new Element ("BailiffKnowledge"));
        payment.addContent (new Element ("EnforcementCourt"));
        payment.addContent (new Element ("AdminCourt"));
        payment.addContent (new Element ("IssuingCourt"));
        payment.addContent (new Element ("IssuingCourtName"));
        payment.addContent (new Element ("VerificationReportID"));
        payment.addContent (new Element ("CreatedBy"));

        payment.addContent (new Element ("Payee"));
        final Element payee = payment.getChild ("Payee");
        payee.addContent (new Element ("Name"));
        payee.addContent (new Element ("Code"));
        payee.addContent (new Element ("PartyID"));
        payee.addContent (new Element ("Address"));
        payee.addContent (new Element ("DX"));
        final Element payeeAddress = payee.getChild ("Address");
        payeeAddress.addContent (new Element ("Line"));
        payeeAddress.addContent (new Element ("Line"));
        payeeAddress.addContent (new Element ("Line"));
        payeeAddress.addContent (new Element ("Line"));
        payeeAddress.addContent (new Element ("Line"));
        payeeAddress.addContent (new Element ("PostCode"));
        payeeAddress.addContent (new Element ("Reference"));

        payment.addContent (new Element ("Overpayee"));
        final Element overpayee = payment.getChild ("Overpayee");
        overpayee.addContent (new Element ("Name"));
        overpayee.addContent (new Element ("Address"));
        final Element overpayeeAddress = overpayee.getChild ("Address");
        overpayeeAddress.addContent (new Element ("Line"));
        overpayeeAddress.addContent (new Element ("Line"));
        overpayeeAddress.addContent (new Element ("Line"));
        overpayeeAddress.addContent (new Element ("Line"));
        overpayeeAddress.addContent (new Element ("Line"));
        overpayeeAddress.addContent (new Element ("PostCode"));

        payment.addContent (new Element ("Passthrough"));
        payment.addContent (new Element ("Error"));
        payment.addContent (new Element ("RelatedTransactionNumber"));
        payment.addContent (new Element ("RelatedAdminCourt"));
        payment.addContent (new Element ("AOPassthroughTransactionNumber"));
        payment.addContent (new Element ("PayoutReportID"));
        payment.addContent (new Element ("DebtSeq"));
        payment.addContent (new Element ("OldRetentionType"));
        payment.addContent (new Element ("OldAmount"));
        payment.addContent (new Element ("OldError"));
        payment.addContent (new Element ("ReportNumber"));
        payment.addContent (new Element ("ReportType"));
        payment.addContent (new Element ("CaseNumber"));
        payment.addContent (new Element ("COType"));
        payment.addContent (new Element ("ExecutingCourt"));
        payment.addContent (new Element ("NumberDefendants"));
        payment.addContent (new Element ("NumberEvents"));
        payment.addContent (new Element ("ReportID"));
        payment.addContent (new Element ("WarrantID"));
        payment.addContent (new Element ("WarrantType"));
    }

    /**
     * {@inheritDoc}
     */
    public void save ()
    {
        // No op.
    }

    /**
     * {@inheritDoc}
     */
    public void delete ()
    {
        // No op.
    }

    /**
     * Gets the ao passthrough.
     *
     * @return the ao passthrough
     */
    public Payment getAoPassthrough ()
    {
        return this;
    }

    /**
     * {@inheritDoc}
     */
    public boolean populateReportData ()
    {
        return false;
    }

    /**
     * {@inheritDoc}
     */
    public int populateTransactionNumber ()
    {
        return 0;
    }

    /**
     * Refresh payment.
     *
     * @return the payment
     */
    public Payment refreshPayment ()
    {
        return this;
    }

    /**
     * {@inheritDoc}
     */
    public void setReportNumber (final String reportNumber)
    {
        // No op.
    }

}
