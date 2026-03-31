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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class Payment.
 *
 * @author Steve Blair
 * 
 *         Change History
 *         27/06/2007 - Chris Vincent: Added serviceCourtId variable along with get and set methods
 *         CaseMan Defect 6334.
 *         28/06/2007 - Chris Vincent: additional changes for 6334. Made the setServiceCourtId() public
 *         and updated updatePaymentRecord() to add the courtId parameter to the service call.
 *         02/07/2007 - Chris Hutt as part of defect 6334 resolution ServiceCourtId node added to Payment
 *         17-06-2009 - Mark Groen TRAC 707. - Incorporate changes defined by Chris Vincent re scalabilty
 *         for Navigate to Transfer Case and View Payments
 *         06/08/2010 - Chris Vincent, Trac 2207, change to recalculateOverpayment() in way that overpaymens
 *         on AEs and Warrants are handled.
 *         11/12/2013 - Chris Vincent, Trac 5025 - changes to isExecutionWarrant() to include CONTROL warrants
 *         which are replacing EXECUTION warrants in TCE.
 */
public class Payment
{

    /** The Constant SUPS_DATE_FORMAT. */
    private static final SimpleDateFormat SUPS_DATE_FORMAT = new SimpleDateFormat ("yyyy-MM-dd");

    /** The Constant EJB_PAYMENTS_SERVICE. */
    private static final String EJB_PAYMENTS_SERVICE =

            "ejb/PaymentsServiceLocal";

    /** The Constant TRANS_NO_NODE. */
    private static final String TRANS_NO_NODE = "TransactionNumber";
    
    /** The Constant ENFORCE_NO_NODE. */
    private static final String ENFORCE_NO_NODE = "EnforcementNumber";
    
    /** The Constant ENFORCE_TYPE_NODE. */
    private static final String ENFORCE_TYPE_NODE = "EnforcementType";
    
    /** The Constant ENFORCE_PARENT_NODE. */
    // TRAC 707 - added ENFORCE_PARENT_NODE
    private static final String ENFORCE_PARENT_NODE = "EnforcementParent";
    
    /** The Constant AMOUNT_NODE. */
    private static final String AMOUNT_NODE = "Amount";
    
    /** The Constant AMOUNT_CURRENCY_NODE. */
    private static final String AMOUNT_CURRENCY_NODE = "AmountCurrency";
    
    /** The Constant PAYMENT_TYPE_NODE. */
    private static final String PAYMENT_TYPE_NODE = "PaymentType";
    
    /** The Constant RETENTION_TYPE_NODE. */
    private static final String RETENTION_TYPE_NODE = "RetentionType";
    
    /** The Constant OVERPAYMENT_AMOUNT_NODE. */
    private static final String OVERPAYMENT_AMOUNT_NODE = "OverpaymentAmount";
    
    /** The Constant OVERPAYMENT_CURRENCY_NODE. */
    private static final String OVERPAYMENT_CURRENCY_NODE = "OverpaymentAmountCurrency";
    
    /** The Constant COUNTER_PAYMENT_NODE. */
    private static final String COUNTER_PAYMENT_NODE = "CounterPayment";
    
    /** The Constant PAYMENT_DATE_NODE. */
    private static final String PAYMENT_DATE_NODE = "PaymentDate";
    
    /** The Constant RELEASE_DATE_NODE. */
    private static final String RELEASE_DATE_NODE = "ReleaseDate";
    
    /** The Constant PAYOUT_DATE_NODE. */
    private static final String PAYOUT_DATE_NODE = "PayoutDate";
    
    /** The Constant RD_DATE_NODE. */
    private static final String RD_DATE_NODE = "RDDate";
    
    /** The Constant NOTES_NODE. */
    private static final String NOTES_NODE = "Notes";
    
    /** The Constant AMOUNT_DUE_NODE. */
    private static final String AMOUNT_DUE_NODE = "AmountNowDue";
    
    /** The Constant LODGMENT_NODE. */
    private static final String LODGMENT_NODE = "Lodgment";
    
    /** The Constant PARTY_NAME_NODE. */
    private static final String PARTY_NAME_NODE = "Name";
    
    /** The Constant PARTY_CASE_PARTY_NUMBER. */
    private static final String PARTY_CASE_PARTY_NUMBER = "CasePartyNumber";
    
    /** The Constant PARTY_ROLE_NODE. */
    private static final String PARTY_ROLE_NODE = "PartyRole";
    
    /** The Constant PARTY_ADDRESS_NODE. */
    private static final String PARTY_ADDRESS_NODE = "Address";
    
    /** The Constant ADDRESS_LINE_NODE. */
    private static final String ADDRESS_LINE_NODE = "Line";
    
    /** The Constant ADDRESS_POSTCODE_NODE. */
    private static final String ADDRESS_POSTCODE_NODE = "PostCode";
    
    /** The Constant ADDRESS_REFERENCE_NODE. */
    private static final String ADDRESS_REFERENCE_NODE = "Reference";
    
    /** The Constant PO_NUMBER_1_NODE. */
    private static final String PO_NUMBER_1_NODE = "PONumber1";
    
    /** The Constant PO_NUMBER_2_NODE. */
    private static final String PO_NUMBER_2_NODE = "PONumber2";
    
    /** The Constant PO_TOTAL_NODE. */
    private static final String PO_TOTAL_NODE = "POTotal";
    
    /** The Constant PO_CURRENCY_NODE. */
    private static final String PO_CURRENCY_NODE = "POTotalCurrency";
    
    /** The Constant RECEIPT_REQUIRED_NODE. */
    private static final String RECEIPT_REQUIRED_NODE = "ReceiptRequired";
    
    /** The Constant BAILIFF_KNOWLEDGE_NODE. */
    private static final String BAILIFF_KNOWLEDGE_NODE = "BailiffKnowledge";
    
    /** The Constant ENFORCEMENT_COURT_NODE. */
    private static final String ENFORCEMENT_COURT_NODE = "EnforcementCourt";
    
    /** The Constant ADMIN_COURT_NODE. */
    private static final String ADMIN_COURT_NODE = "AdminCourt";
    
    /** The Constant ISSUING_COURT_NODE. */
    private static final String ISSUING_COURT_NODE = "IssuingCourt";
    
    /** The Constant VER_REP_ID_NODE. */
    private static final String VER_REP_ID_NODE = "VerificationReportID";
    
    /** The Constant CREATED_BY_NODE. */
    private static final String CREATED_BY_NODE = "CreatedBy";
    
    /** The Constant PAYEE_NODE. */
    private static final String PAYEE_NODE = "Payee";
    
    /** The Constant PARTY_CODE_NODE. */
    private static final String PARTY_CODE_NODE = "Code";
    
    /** The Constant PARTY_ID_NODE. */
    private static final String PARTY_ID_NODE = "PartyID";
    
    /** The Constant PARTY_DX_NODE. */
    private static final String PARTY_DX_NODE = "DX";
    
    /** The Constant OVERPAYEE_NODE. */
    private static final String OVERPAYEE_NODE = "Overpayee";
    
    /** The Constant PASSTHROUGH_NODE. */
    private static final String PASSTHROUGH_NODE = "Passthrough";
    
    /** The Constant ERROR_NODE. */
    private static final String ERROR_NODE = "Error";
    
    /** The Constant RELATED_TRANS_NO_NODE. */
    private static final String RELATED_TRANS_NO_NODE = "RelatedTransactionNumber";
    
    /** The Constant RELATED_ADMIN_COURT_NODE. */
    private static final String RELATED_ADMIN_COURT_NODE = "RelatedAdminCourt";
    
    /** The Constant PAYOUT_REPORT_ID_NODE. */
    private static final String PAYOUT_REPORT_ID_NODE = "PayoutReportID";
    
    /** The Constant DEBT_SEQ_NODE. */
    private static final String DEBT_SEQ_NODE = "DebtSeq";
    
    /** The Constant REPORT_TYPE_NODE. */
    private static final String REPORT_TYPE_NODE = "ReportType";
    
    /** The Constant REPORT_NUMBER_NODE. */
    private static final String REPORT_NUMBER_NODE = "ReportNumber";
    
    /** The Constant REPORT_ID_NODE. */
    private static final String REPORT_ID_NODE = "ReportID";
    
    /** The Constant OLD_AMOUNT_NODE. */
    private static final String OLD_AMOUNT_NODE = "OldAmount";
    
    /** The Constant OLD_ERROR_NODE. */
    private static final String OLD_ERROR_NODE = "OldError";
    
    /** The Constant OLD_RETENTION_NODE. */
    private static final String OLD_RETENTION_NODE = "OldRetentionType";
    
    /** The Constant CASE_NUMBER_NODE. */
    private static final String CASE_NUMBER_NODE = "CaseNumber";
    
    /** The Constant SYSTEM_DATE_NODE. */
    private static final String SYSTEM_DATE_NODE = "SystemDate";
    
    /** The Constant WARRANT_ID_NODE. */
    private static final String WARRANT_ID_NODE = "WarrantID";
    
    /** The Constant NUMBER_EVENTS_NODE. */
    private static final String NUMBER_EVENTS_NODE = "NumberEvents";
    
    /** The Constant NUMBER_DEFENDANTS_NODE. */
    private static final String NUMBER_DEFENDANTS_NODE = "NumberDefendants";
    
    /** The Constant AO_TRANS_NO_NODE. */
    private static final String AO_TRANS_NO_NODE = "AOPassthroughTransactionNumber";
    
    /** The Constant WARRANT_TYPE_NODE. */
    private static final String WARRANT_TYPE_NODE = "WarrantType";
    
    /** The Constant EXECUTING_COURT_NODE. */
    private static final String EXECUTING_COURT_NODE = "ExecutingCourt";
    
    /** The Constant CO_TYPE_NODE. */
    private static final String CO_TYPE_NODE = "COType";
    
    /** The Constant SERVICE_COURT_ID_NODE. */
    private static final String SERVICE_COURT_ID_NODE = "ServiceCourtId";

    /** The Constant ENFORCEMENT_TYPE_AE. */
    private static final String ENFORCEMENT_TYPE_AE = "AE";
    
    /** The Constant ENFORCEMENT_TYPE_CO. */
    private static final String ENFORCEMENT_TYPE_CO = "CO";
    
    /** The Constant ENFORCEMENT_TYPE_CASE. */
    private static final String ENFORCEMENT_TYPE_CASE = "CASE";
    
    /** The Constant ENFORCEMENT_TYPE_HOME_WARRANT. */
    private static final String ENFORCEMENT_TYPE_HOME_WARRANT = "HOME WARRANT";
    
    /** The Constant ENFORCEMENT_TYPE_FOREIGN_WARRANT. */
    private static final String ENFORCEMENT_TYPE_FOREIGN_WARRANT = "FOREIGN WARRANT";

    /** The Constant RETENTION_TYPE_AO_CAEO. */
    private static final String RETENTION_TYPE_AO_CAEO = "AO/CAEO";

    /** The Constant POSTAL_REPORT_TYPE. */
    private static final String POSTAL_REPORT_TYPE = "PREC";
    
    /** The Constant BAILIFF_REPORT_TYPE. */
    private static final String BAILIFF_REPORT_TYPE = "BVER";
    
    /** The Constant COUNTER_REPORT_TYPE. */
    private static final String COUNTER_REPORT_TYPE = "CVER";
    
    /** The Constant PASSTHROUGH_REPORT_TYPE. */
    private static final String PASSTHROUGH_REPORT_TYPE = "PVER";
    
    /** The Constant ADHOC_REPORT_TYPE. */
    private static final String ADHOC_REPORT_TYPE = "ADH";
    
    /** The Constant AMENDMENT_REPORT_TYPE. */
    private static final String AMENDMENT_REPORT_TYPE = "AMR";
    
    /** The Constant OVERPAYMENT_REPORT_TYPE. */
    private static final String OVERPAYMENT_REPORT_TYPE = "OVP";

    /** The Constant EXECUTION_WARRANT_TYPE. */
    private static final String EXECUTION_WARRANT_TYPE = "EXECUTION";
    
    /** The Constant CONTROL_WARRANT_TYPE. */
    private static final String CONTROL_WARRANT_TYPE = "CONTROL";

    /** The Constant TRUE_INDICATOR. */
    private static final String TRUE_INDICATOR = "Y";
    
    /** The Constant FALSE_INDICATOR. */
    private static final String FALSE_INDICATOR = "N";
    
    /** The Constant NULL_STRING. */
    private static final String NULL_STRING = "";

    /** The payment. */
    Element payment;
    
    /** The services. */
    private ServiceAdaptor services;
    
    /** The scn number present. */
    private boolean scnNumberPresent = false;
    
    /** The service court id. */
    private String serviceCourtId = null;

    /**
     * Construct a Payment object based upon a JDOM Element conforming to the
     * structure of map_payments.xml.
     * 
     * @param payment JDOM element representing the payment
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @throws IllegalArgumentException if the payment Element is not properly
     *             formatted
     */
    public Payment (final Element payment, final ServiceAdaptor services)
    {
        if (services == null)
        {
            throw new NullPointerException ();
        }

        if ( !payment.getName ().equals ("Payment"))
        {
            throw new IllegalArgumentException (
                    "Improperly formed Payment Element passed to Payment " + "constructor.");
        }

        this.payment = payment;
        this.services = services;

        if (payment.getChild ("SCN") != null || payment.getChild ("SurrogateSCN") != null)
        {
            scnNumberPresent = true;
        }
    }

    /**
     * Retrieves a payment record from the database and uses it to construct a
     * new Payment object.
     *
     * @param transactionNumber transaction number of the payment
     * @param courtCode admin court code of the payment
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @return new Payment object or NullPayment if no payment exists matching
     *         parameters
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public static Payment getPayment (final String transactionNumber, final String courtCode,
                                      final ServiceAdaptor services)
        throws BusinessException, SystemException
    {
        final Element paymentParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paymentParams, "transactionNumber", transactionNumber);
        XMLBuilder.addParam (paymentParams, "courtCode", courtCode);

        final Document result = services.callService (EJB_PAYMENTS_SERVICE, "getPaymentLocal2", paymentParams);

        if (result == null)
        {
            return new NullPayment ();
        }

        final Payment payment = new Payment (result.getRootElement (), services);
        payment.scnNumberPresent = true;
        return payment;
    }

    /**
     * Get all passthrough payments attached to an enforcement that don't have a
     * related transaction number.
     *
     * @param enfNumber Enforcement number of the enforcement the payments are
     *            attached to
     * @param enfCourt the enf court
     * @param enfType Enforcement type of the payments
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @return JDOM Document containing all passthrough payments attached to the
     *         enforcement specified
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static Document getPassthroughPayments (final String enfNumber, final String enfCourt, final String enfType,
                                                   final ServiceAdaptor services)
        throws SystemException, BusinessException
    {
        final Element paymentParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paymentParams, "enforcementType", enfType);
        XMLBuilder.addParam (paymentParams, "enforcementCourt", enfCourt);
        XMLBuilder.addParam (paymentParams, "enforcementNumber", enfNumber);

        return services.callService (EJB_PAYMENTS_SERVICE, "getPassthroughPaymentsLocal2", paymentParams);
    }

    /**
     * Construct a list of Payment objects based upon a JDOM Element of the
     * structure Payments/Payment.
     * 
     * @param payments JDOM element representing the payments
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @return List of Payment objects
     * @throws IllegalArgumentException if the payments Element is not properly
     *             formatted
     */
    public static List<Payment> parseElements (final Element payments, final ServiceAdaptor services)
    {
        if (services == null)
        {
            throw new NullPointerException ();
        }

        if ( !payments.getName ().equals ("Payments"))
        {
            throw new IllegalArgumentException ("Improperly formed Payments Element passed to " + "parseElements().");
        }

        final List<Element> paymentsElements = payments.getChildren ("Payment");
        final List<Payment> thePayments = new ArrayList<>(paymentsElements.size ());
        for (Iterator<Element> it = paymentsElements.iterator (); it.hasNext ();)
        {
            thePayments.add (new Payment ((Element) it.next (), services));
        }
        return thePayments;
    }

    /**
     * If needed, gets next transaction number for specified court and assigns
     * it to payment.
     *
     * @return transaction number
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public int populateTransactionNumber () throws SystemException, BusinessException
    {
        if (getTransactionNumber ().length () > 0)
        {
            return Integer.parseInt (getTransactionNumber ());
        }

        final String transNumber = services.getNextSequenceNumber ("TRANSACTION NO", getAdminCourt ());
        setTransactionNumber (transNumber);
        return Integer.parseInt (transNumber);
    }

    /**
     * Refreshes outstanding balance, overpayment and status of any attached
     * warrants or warrant returns. Other payments may have been made between
     * loading the enforcement and committing the payment so this info' needs to
     * be up to date.
     *
     * @param pCourtId the court id
     * @return the current object after fields have been refresh
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public Payment refreshPayment (final String pCourtId) throws BusinessException, SystemException
    {
        setServiceCourtId (pCourtId);
        final Enforcement enforcement = Enforcement.getInstance (this, services);

        setAmountNowDue (calculateBalance (enforcement.getOutstandingBalance ()));
        setWarrantId (enforcement.getWarrantId ());
        setNumberEvents (enforcement.getNumberEvents ());
        setCaseNumber (enforcement.getCaseNumber ());
        setWarrantType (enforcement.getWarrantType ());
        setNumberDefendants (enforcement.getNumberDefendants ());
        setExecutingCourt (enforcement.getWarrantExecutingCourt ());
        setCoType (enforcement.getCoType ());
        setSystemDate (SUPS_DATE_FORMAT.format (new Date ()));

        if (isVerificationReport () || isAmendmentReport ())
        {
            setOverpaymentAmount (recalculateOverpayment (enforcement.getOutstandingBalance ()));
        }

        return this;
    }

    /**
     * Checks if is verification report.
     *
     * @return true, if is verification report
     */
    public boolean isVerificationReport ()
    {
        final boolean isPrec = getReportType ().equals (POSTAL_REPORT_TYPE);
        final boolean isBver = getReportType ().equals (BAILIFF_REPORT_TYPE);
        final boolean isCver = getReportType ().equals (COUNTER_REPORT_TYPE);
        final boolean isPver = getReportType ().equals (PASSTHROUGH_REPORT_TYPE);
        return isPrec || isBver || isCver || isPver;
    }

    /**
     * Checks if is amendment report.
     *
     * @return true, if is amendment report
     */
    public boolean isAmendmentReport ()
    {
        return getReportType ().equals (AMENDMENT_REPORT_TYPE);
    }

    /**
     * Checks if is adhoc report.
     *
     * @return true, if is adhoc report
     */
    public boolean isAdhocReport ()
    {
        return getReportType ().equals (ADHOC_REPORT_TYPE);
    }

    /**
     * Checks if is overpayment report.
     *
     * @return true, if is overpayment report
     */
    public boolean isOverpaymentReport ()
    {
        return getReportType ().equals (OVERPAYMENT_REPORT_TYPE);
    }

    /**
     * Recalculates the overpayment amount. This may have changed between the
     * user loading the enforcement and submitting the payment if other users
     * are entering payments against the same record.
     * 
     * @param balance current balance of the enforcement
     * @return overpayment amount or 0 if payment is a passthrough
     * @throws IllegalStateException If a passthrough payment on a home
     *             warrant would result in an overpayment
     */
    private double recalculateOverpayment (double balance)
    {
        if ( !areOverpaymentsRecorded ())
        {
            return 0;
        }

        // When maintaining a payment the old amount is included in balance so
        // need to compensate to get correct overpayment amount.
        balance += getOldAmount ();

        if (balance < 0)
        {
            balance = 0;
        }

        final double overpayment = getAmount () - balance;

        if (isCoPayment ())
        {
            if (overpayment <= 0)
            {
                return 0;
            }
        }
        else
        {
            /**
             * Trac 2207 - AE and Warrant overpayments that are <= £1.00 should automatically be included in the
             * amount to be paid to the payee and not flagged as overpayments.
             */
            if (overpayment <= 1)
            {
                return 0;
            }
        }

        if ( !isPassthrough ())
        {
            return overpayment;
        }

        // COs are dealt with differently for Passthroughs.
        if (isCoPayment ())
        {
            return 0;
        }

        // Fallthrough
        final double amount = getAmount ();
        final String errorMessage =
                "Passthrough payment of " + amount + " would result in an overpayment of " + overpayment;
        throw new IllegalStateException (errorMessage);
    }

    /**
     * Returns whether this payment needs to keep track of overpayments.
     * 
     * @return whether overpayments need to be recorded for the payment
     */
    private boolean areOverpaymentsRecorded ()
    {
        final boolean isAe = isAePayment ();
        final boolean isCo = isCoPayment ();
        final boolean isExecutionWarrant = isExecutionWarrant ();
        return isAe || isCo || isExecutionWarrant;
    }

    /**
     * Calculates outstanding balance of an enforcement. If updating payment
     * then old value of payment will be included in balance param so only need
     * to adjust by difference in old/new amounts.
     * 
     * @param balance current outstanding balance including all payments on
     *            database
     * @return outstanding balance of the enforcement
     */
    private double calculateBalance (double balance)
    {
        if (getRdDate () == null && !isError ())
        {
            balance -= getAmount ();
        }
        balance += getOldAmount ();
        return balance;
    }

    /**
     * Populates report type, number fields, as well as any report ID fields
     * relevant to the payment.
     *
     * @return whether a new report number was generated from SYSTEM_DATE
     *         sequence
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public boolean populateReportData () throws SystemException, BusinessException, JDOMException
    {
        // If report number is blank then report ID should be blank. Should
        // only happen for automatically created AO passthrough payments.
        if (getReportNumber ().length () == 0)
        {
            setReportType ("");
            setReportId ("");
            return false;
        }

        final boolean newReportNumberGenerated = populateReportNumber ();
        populateReportId ();
        return newReportNumberGenerated;
    }

    /**
     * Amalgamate report number and type to get report ID and update relevant
     * fields in payment DOM.
     */
    private void populateReportId ()
    {
        if (getReportType ().length () == 3)
        {
            setReportId (getReportType () + " " + getReportNumber ());
        }
        else
        {
            setReportId (getReportType () + getReportNumber ());
        }

        if (isVerificationReport () && getVerificationReportId ().length () == 0)
        {
            setVerificationReportId (getReportId ());
        }
        else if (isAdhocReport ())
        {
            setPayoutReportId (getReportId ());
        }
    }

    /**
     * If report number of payment is zero then gets next report id number from
     * relevant sequence. Not all payments require a report ID so report number
     * must be exactly zero for a new report number to be generated.
     *
     * @return whether a new report number was generated from SYSTEM_DATE
     *         sequence
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean populateReportNumber () throws SystemException, BusinessException, JDOMException
    {
        // Get report number for counter payments since this is persisted
        // between screen sessions.
        if (getReportType ().equals (COUNTER_REPORT_TYPE))
        {
            setReportNumber (Integer.toString (checkExistingReportNumber ()));
        }
        // Get next report number if necessary.
        final boolean isReportNumberZero = Integer.parseInt (getReportNumber ()) == 0;
        if (getReportNumber ().length () > 0 && isReportNumberZero)
        {
            setReportNumber (services.getNextSequenceNumber (getReportType (), getAdminCourt ()));
            return true;
        }
        return false;
    }

    /**
     * Get REPORT_NUMBER column of REPORT_DATA table.
     *
     * @return report number of REPORT_DATA record or zero if no record exists
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private int checkExistingReportNumber () throws SystemException, BusinessException, JDOMException
    {
        final Element paymentParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paymentParams, "reportDate", SUPS_DATE_FORMAT.format (new Date ()));
        XMLBuilder.addParam (paymentParams, "reportType", getReportType ());
        XMLBuilder.addParam (paymentParams, "userId", getCreatedBy ());
        XMLBuilder.addParam (paymentParams, "courtId", getAdminCourt ());

        final Document reportData = services.callService (EJB_PAYMENTS_SERVICE, "getReportDataLocal2", paymentParams);
        final Element reportNumber = (Element) XPath.selectSingleNode (reportData, "/Results/ReportData/ReportNumber");

        if (reportNumber == null)
        {
            return 0;
        }

        return Integer.parseInt (reportNumber.getText ());
    }

    /**
     * Saves the current payment details to the database.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public void save () throws SystemException, BusinessException
    {
        if (scnNumberPresent)
        {
            updatePaymentRecord ();
        }
        else
        {
            createPaymentRecord ();
        }
    }

    /**
     * Creates a record on the PAYMENTS table corresponding to this payment.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void createPaymentRecord () throws SystemException, BusinessException
    {
        final Element paymentParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paymentParams, "payment", toElement ());

        final Document results = services.callService (EJB_PAYMENTS_SERVICE, "createPaymentLocal2", paymentParams);
        payment = results.getRootElement ();
        scnNumberPresent = true;
    }

    /**
     * Updates a payment record on the database.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void updatePaymentRecord () throws BusinessException, SystemException
    {
        final Element paymentParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paymentParams, "payment", (Element) payment.clone ());
        XMLBuilder.addParam (paymentParams, "courtId", this.getServiceCourtId ());

        final Document results = services.callService (EJB_PAYMENTS_SERVICE, "updatePaymentLocal2", paymentParams);
        payment = results.getRootElement ();
    }

    /**
     * Creates a passthrough payment for the warrant associated with a CO.
     * Amount is equal to the amount of the original CO payment or the
     * outstanding balance, whichever is less.
     *
     * @return the payment
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Payment createAoPassthrough () throws SystemException, BusinessException
    {
        final Warrant warrant = Warrant.getInstance (getWarrantId (), services);
        return constructAoPaymentDom (warrant);
    }

    /**
     * Creates a passthrough payment for a warrant based on an existing payment.
     * 
     * @param warrant warrant DOM matching map_enforcement.xml structure
     * @return passthrough payment
     */
    private Payment constructAoPaymentDom (final Warrant warrant)
    {
        final Payment warrantPayment = new Payment (toElement (), services);
        warrantPayment.scnNumberPresent = false;

        final double amount = getAoPassthroughAmount (getAmount (), warrant.getOutstandingBalance ());

        warrantPayment.setAmount (amount);

        final String enforcementType = warrant.getEnforcementType ();
        if (enforcementType.equals (ENFORCEMENT_TYPE_HOME_WARRANT))
        {
            warrantPayment.setEnforcementCourt (warrant.getWarrantIssuingCourt ());
        }
        else if (enforcementType.equals (ENFORCEMENT_TYPE_FOREIGN_WARRANT))
        {
            warrantPayment.setEnforcementCourt (warrant.getCourtCode ());
        }

        if (getRdDate () != null)
        {
            warrantPayment.setError (true);
        }

        warrantPayment.setCounterPayment (false);
        warrantPayment.setBailiffKnowledge (false);
        warrantPayment.setEnforcementNumber (warrant.getEnforcementNumber ());
        warrantPayment.setEnforcementType (enforcementType);
        warrantPayment.setRetentionType (RETENTION_TYPE_AO_CAEO);
        warrantPayment.setPassthrough (true);
        warrantPayment.setRelatedTransactionNumber (getTransactionNumber ());
        warrantPayment.setRelatedAdminCourt (getAdminCourt ());
        warrantPayment.setTransactionNumber ("");
        warrantPayment.setVerificationReportId ("");
        warrantPayment.setPaymentType ("");
        warrantPayment.setReportNumber ("");
        warrantPayment.setReportType ("");
        warrantPayment.setReleaseDate (null);
        warrantPayment.setReceiptRequired (false);
        warrantPayment.setOverpaymentAmount (0);
        warrantPayment.setOverpaymentAmountCurrency ("");
        warrantPayment.setNotes ("");
        warrantPayment.setOldAmount (0);
        warrantPayment.setOldError (false);
        warrantPayment.setOldRetentionType ("");
        warrantPayment.setPayoutReportId ("");
        warrantPayment.setDebtSeq ("");
        warrantPayment.setPoNumber1 ("");
        warrantPayment.setPoNumber2 ("");
        warrantPayment.setPoTotal (0);
        warrantPayment.setPoTotalCurrency ("");
        warrantPayment.setPayoutDate (null);

        final Party payee = warrantPayment.getPayee ();
        payee.setName ("");
        payee.setCodedPartyCode ("");
        payee.setPartyId ("");
        payee.setAddressPostCode ("");
        payee.setAddressReference ("");
        payee.setDxNumber ("");
        for (int i = 0; i < payee.getNumberAllowedAddressLines (); ++i)
        {
            payee.setAddressLine (i, "");
        }
        warrantPayment.setPayee (payee);

        final Party lodgment = warrantPayment.getLodgmentParty ();
        lodgment.setName ("");
        lodgment.setPartyRoleCode ("");
        lodgment.setCasePartyNumber ("");
        lodgment.setAddressPostCode ("");
        lodgment.setAddressReference ("");
        for (int i = 0; i < lodgment.getNumberAllowedAddressLines (); ++i)
        {
            lodgment.setAddressLine (i, "");
        }
        warrantPayment.setLodgmentParty (lodgment);

        final Party overpayee = warrantPayment.getOverpayee ();
        overpayee.setName ("");
        overpayee.setAddressPostCode ("");
        for (int i = 0; i < overpayee.getNumberAllowedAddressLines (); ++i)
        {
            overpayee.setAddressLine (i, "");
        }
        warrantPayment.setOverpayee (overpayee);

        return warrantPayment;
    }

    /**
     * Calculates the amount for a AO passthrough payment. Balance on AO warrant
     * must never be negative, even if means creating a zero amount payment.
     * 
     * @param amount amount of the associated CO payment
     * @param balance outstanding balance of the AO warrant
     * @return amount the AO passthrough payment should be
     */
    private double getAoPassthroughAmount (final double amount, final double balance)
    {
        if (balance < amount)
        {
            return balance < 0 ? 0 : balance;
        }
        return amount;
    }

    /**
     * Gets or creates an AO passthrough payment associated with a CO payment
     * ready for saving to/deleting from the database.
     *
     * @param pCourtId the court id
     * @return AO passthrough payment for the attached warrant
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public Payment getAoPassthrough (final String pCourtId) throws BusinessException, SystemException
    {
        if (getAoPassthroughTransactionNumber ().length () > 0)
        {
            final Payment warrantPayment =
                    getPayment (getAoPassthroughTransactionNumber (), getAdminCourt (), services);

            if (getWarrantId ().length () > 0 && haveFinancialDetailsChanged ())
            {
                final Warrant warrant = Warrant.getInstance (getWarrantId (), services);
                updateAoPaymentDom (warrantPayment, warrant);
            }

            // Add service court id to the warrant payment (defect 6334)
            warrantPayment.serviceCourtId = pCourtId;

            return warrantPayment;
        }
        else if (getWarrantId ().length () > 0)
        {
            return createAoPassthrough ();
        }

        return new NullPayment ();
    }

    /**
     * Updates a payment for an AO payment to match a modified CO payment.
     * 
     * @param warrantPayment AO warrant payment to be updated
     * @param warrant warrant on which the payment is made
     */
    private void updateAoPaymentDom (final Payment warrantPayment, final Warrant warrant)
    {
        // Cache old values.
        warrantPayment.setOldError (warrantPayment.isError ());
        warrantPayment.setOldAmount (warrantPayment.getAmount ());
        warrantPayment.setOldRetentionType (warrantPayment.getRetentionType ());

        // Update fields.
        if (getRdDate () != null || isError ())
        {
            warrantPayment.setError (true);
        }
        else
        {
            final double amount = getAoPassthroughAmount (getAmount (), warrant.getOutstandingBalance ());
            warrantPayment.setAmount (amount);
        }

        // Populate additional payment parameters.
        warrantPayment.setReportNumber ("");
        warrantPayment.setReportType ("");
    }

    /**
     * Deletes the payment record on the database corresponding to this payment.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public void delete () throws BusinessException, SystemException
    {
        if ( !scnNumberPresent)
        {
            return;
        }

        final Element paymentParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paymentParams, "transactionNumber", getTransactionNumber ());
        XMLBuilder.addParam (paymentParams, "courtCode", getAdminCourt ());

        services.callService (EJB_PAYMENTS_SERVICE, "deletePaymentLocal2", paymentParams);

        scnNumberPresent = false;
    }

    /**
     * Checks whether either the retention type or the amount of the payment has
     * change, either directly or indirectly (i.e. by being errored off/referred
     * to drawer.)
     *
     * @return true, if successful
     */
    public boolean haveFinancialDetailsChanged ()
    {
        final boolean amountHasChanged =
                getAmount () != getOldAmount () || getRdDate () != null || isError () != wasOldError ();
        final boolean retTypeChanged = !getRetentionType ().equals (getOldRetentionType ());

        return amountHasChanged || retTypeChanged;
    }

    /**
     * Returns a copy of the underlying payment JDOM Element.
     * 
     * @return JDOM element representing the payment
     */
    public Element toElement ()
    {
        return (Element) payment.clone ();
    }

    /**
     * Gets the transaction number.
     *
     * @return the transaction number
     */
    public String getTransactionNumber ()
    {
        return payment.getChildTextTrim (TRANS_NO_NODE);
    }

    /**
     * Sets the transaction number.
     *
     * @param transactionNumber the new transaction number
     */
    private void setTransactionNumber (final String transactionNumber)
    {
        payment.getChild (TRANS_NO_NODE).setText (transactionNumber);
    }

    /**
     * Gets the enforcement number.
     *
     * @return the enforcement number
     */
    public String getEnforcementNumber ()
    {
        return payment.getChildTextTrim (ENFORCE_NO_NODE);
    }

    /**
     * Sets the enforcement number.
     *
     * @param enforcementNumber the new enforcement number
     */
    private void setEnforcementNumber (final String enforcementNumber)
    {
        if (enforcementNumber.length () != 8)
        {
            throw new IllegalArgumentException (enforcementNumber + " not a valid Enforcement Number.");
        }
        payment.getChild (ENFORCE_NO_NODE).setText (enforcementNumber);
    }

    /**
     * Gets the enforcement type.
     *
     * @return the enforcement type
     */
    public String getEnforcementType ()
    {
        return payment.getChildTextTrim (ENFORCE_TYPE_NODE);
    }

    /**
     * Sets the enforcement type.
     *
     * @param enforcementType the new enforcement type
     */
    private void setEnforcementType (final String enforcementType)
    {
        payment.getChild (ENFORCE_TYPE_NODE).setText (enforcementType);
    }

    /**
     * Gets the enforcement parent.
     *
     * @return the enforcement parent
     */
    // TRAC 707 add getEnforcementParent... and setEnforcementParent...
    public String getEnforcementParent ()
    {
        return payment.getChildTextTrim (ENFORCE_PARENT_NODE);
    }

    /**
     * Sets the enforcement parent.
     *
     * @param enforcementParent the new enforcement parent
     */
    private void setEnforcementParent (final String enforcementParent)
    {
        payment.getChild (ENFORCE_PARENT_NODE).setText (enforcementParent);
    }

    /**
     * Gets the amount.
     *
     * @return the amount
     */
    public double getAmount ()
    {
        final String amount = payment.getChildTextTrim (AMOUNT_NODE);
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Sets the amount.
     *
     * @param amount the new amount
     */
    private void setAmount (double amount)
    {
        if (amount > 0)
        {
            amount = (int) ((amount + 0.005) * 100) / 100D;
            payment.getChild (AMOUNT_NODE).setText (Double.toString (amount));
        }
        else if (amount == 0)
        {
            payment.getChild (AMOUNT_NODE).setText (NULL_STRING);
        }
        else
        {
            throw new IllegalArgumentException ("Negative amounts not allowed, amount = " + amount);
        }
    }

    /**
     * Gets the amount currency.
     *
     * @return the amount currency
     */
    public String getAmountCurrency ()
    {
        return payment.getChildTextTrim (AMOUNT_CURRENCY_NODE);
    }

    /**
     * Gets the payment type.
     *
     * @return the payment type
     */
    public String getPaymentType ()
    {
        return payment.getChildTextTrim (PAYMENT_TYPE_NODE);
    }

    /**
     * Sets the payment type.
     *
     * @param paymentType the new payment type
     */
    private void setPaymentType (final String paymentType)
    {
        payment.getChild (PAYMENT_TYPE_NODE).setText (paymentType);
    }

    /**
     * Gets the retention type.
     *
     * @return the retention type
     */
    public String getRetentionType ()
    {
        return payment.getChildTextTrim (RETENTION_TYPE_NODE);
    }

    /**
     * Sets the retention type.
     *
     * @param retentionType the new retention type
     */
    private void setRetentionType (final String retentionType)
    {
        payment.getChild (RETENTION_TYPE_NODE).setText (retentionType);
    }

    /**
     * Gets the overpayment amount.
     *
     * @return the overpayment amount
     */
    public double getOverpaymentAmount ()
    {
        final String amount = payment.getChildTextTrim (OVERPAYMENT_AMOUNT_NODE);
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Sets the overpayment amount.
     *
     * @param amount the new overpayment amount
     */
    private void setOverpaymentAmount (double amount)
    {
        if (amount > 0)
        {
            amount = (int) ((amount + 0.005) * 100) / 100D;
            payment.getChild (OVERPAYMENT_AMOUNT_NODE).setText (Double.toString (amount));
        }
        else if (amount == 0)
        {
            payment.getChild (OVERPAYMENT_AMOUNT_NODE).setText (NULL_STRING);
        }
        else
        {
            throw new IllegalArgumentException ("Negative amounts not allowed, amount = " + amount);
        }
    }

    /**
     * Gets the overpayment amount currency.
     *
     * @return the overpayment amount currency
     */
    public String getOverpaymentAmountCurrency ()
    {
        return payment.getChildTextTrim (OVERPAYMENT_CURRENCY_NODE);
    }

    /**
     * Sets the overpayment amount currency.
     *
     * @param currency the new overpayment amount currency
     */
    private void setOverpaymentAmountCurrency (final String currency)
    {
        payment.getChild (OVERPAYMENT_CURRENCY_NODE).setText (currency);
    }

    /**
     * Gets the amount now due.
     *
     * @return the amount now due
     */
    public double getAmountNowDue ()
    {
        final String amount = payment.getChildTextTrim (AMOUNT_DUE_NODE);
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Sets the amount now due.
     *
     * @param amount the new amount now due
     */
    private void setAmountNowDue (double amount)
    {
        if (amount < 0)
        {
            amount = (int) ((amount - 0.005) * 100) / 100D;
        }
        else
        {
            amount = (int) ((amount + 0.005) * 100) / 100D;
        }
        payment.getChild (AMOUNT_DUE_NODE).setText (Double.toString (amount));
    }

    /**
     * Checks if is counter payment.
     *
     * @return true, if is counter payment
     */
    public boolean isCounterPayment ()
    {
        return payment.getChildTextTrim (COUNTER_PAYMENT_NODE).equals (TRUE_INDICATOR);
    }

    /**
     * Sets the counter payment.
     *
     * @param isCounterPayment the new counter payment
     */
    private void setCounterPayment (final boolean isCounterPayment)
    {
        if (isCounterPayment)
        {
            payment.getChild (COUNTER_PAYMENT_NODE).setText (TRUE_INDICATOR);
        }
        else
        {
            payment.getChild (COUNTER_PAYMENT_NODE).setText (FALSE_INDICATOR);
        }
    }

    /**
     * Gets the payment date.
     *
     * @return the payment date
     */
    public Date getPaymentDate ()
    {
        try
        {
            return SUPS_DATE_FORMAT.parse (payment.getChildTextTrim (PAYMENT_DATE_NODE));
        }
        catch (final ParseException e)
        {
            throw new IllegalStateException ("Corrupt payment DOM. PaymentDate is not a date.");
        }
    }

    /**
     * Gets the release date.
     *
     * @return the release date
     */
    public Date getReleaseDate ()
    {
        try
        {
            final String date = payment.getChildTextTrim (RELEASE_DATE_NODE);

            if (date.length () <= 0)
            {
                return null;
            }

            return SUPS_DATE_FORMAT.parse (date);
        }
        catch (final ParseException e)
        {
            throw new IllegalStateException ("Corrupt payment DOM. ReleaseDate is not a date.");
        }
    }

    /**
     * Sets the release date.
     *
     * @param date the new release date
     */
    private void setReleaseDate (final Date date)
    {
        if (date == null)
        {
            payment.getChild (RELEASE_DATE_NODE).setText ("");
        }
        else
        {
            payment.getChild (RELEASE_DATE_NODE).setText (SUPS_DATE_FORMAT.format (date));
        }
    }

    /**
     * Gets the payout date.
     *
     * @return the payout date
     */
    public Date getPayoutDate ()
    {
        try
        {
            final String date = payment.getChildTextTrim (PAYOUT_DATE_NODE);

            if (date.length () <= 0)
            {
                return null;
            }

            return SUPS_DATE_FORMAT.parse (date);
        }
        catch (final ParseException e)
        {
            throw new IllegalStateException ("Corrupt payment DOM. PayoutDate is not a date.");
        }
    }

    /**
     * Sets the payout date.
     *
     * @param date the new payout date
     */
    private void setPayoutDate (final Date date)
    {
        if (date == null)
        {
            payment.getChild (PAYOUT_DATE_NODE).setText ("");
        }
        else
        {
            payment.getChild (PAYOUT_DATE_NODE).setText (SUPS_DATE_FORMAT.format (date));
        }
    }

    /**
     * Gets the rd date.
     *
     * @return the rd date
     */
    public Date getRdDate ()
    {
        try
        {
            final String date = payment.getChildTextTrim (RD_DATE_NODE);

            if (date.length () <= 0)
            {
                return null;
            }

            return SUPS_DATE_FORMAT.parse (date);
        }
        catch (final ParseException e)
        {
            throw new IllegalStateException ("Corrupt payment DOM. RDDate is not a date.");
        }
    }

    /**
     * Gets the notes.
     *
     * @return the notes
     */
    public String getNotes ()
    {
        return payment.getChildTextTrim (NOTES_NODE);
    }

    /**
     * Sets the notes.
     *
     * @param notes the new notes
     */
    private void setNotes (final String notes)
    {
        payment.getChild (NOTES_NODE).setText (notes);
    }

    /**
     * Gets the lodgment party.
     *
     * @return the lodgment party
     */
    public Party getLodgmentParty ()
    {
        final Element lodgment = payment.getChild (LODGMENT_NODE);
        final Party party = new Party (lodgment.getChildTextTrim (PARTY_NAME_NODE));
        party.setCasePartyNumber (lodgment.getChildTextTrim (PARTY_CASE_PARTY_NUMBER));
        party.setPartyRoleCode (lodgment.getChildTextTrim (PARTY_ROLE_NODE));

        final Element address = lodgment.getChild (PARTY_ADDRESS_NODE);
        party.setAddressPostCode (address.getChildTextTrim (ADDRESS_POSTCODE_NODE));
        party.setAddressReference (address.getChildTextTrim (ADDRESS_REFERENCE_NODE));

        final List<Element> addressLines = address.getChildren (ADDRESS_LINE_NODE);
        final Iterator<Element> it = addressLines.iterator ();
        for (int i = 0; it.hasNext (); ++i)
        {
            final Element line = (Element) it.next ();
            party.setAddressLine (i, line.getText ());
        }

        return party;
    }

    /**
     * Sets the lodgment party.
     *
     * @param party the new lodgment party
     */
    private void setLodgmentParty (final Party party)
    {
        final Element lodgment = payment.getChild (LODGMENT_NODE);
        lodgment.getChild (PARTY_NAME_NODE).setText (party.getName ());
        lodgment.getChild (PARTY_CASE_PARTY_NUMBER).setText (party.getCasePartyNumber ());
        lodgment.getChild (PARTY_ROLE_NODE).setText (party.getPartyRoleCode ());

        final Element address = lodgment.getChild (PARTY_ADDRESS_NODE);
        address.getChild (ADDRESS_POSTCODE_NODE).setText (party.getAddressPostCode ());
        address.getChild (ADDRESS_REFERENCE_NODE).setText (party.getAddressReference ());

        final List<Element> addressLines = address.getChildren (ADDRESS_LINE_NODE);
        final Iterator<Element> it = addressLines.iterator ();
        for (int i = 0; it.hasNext (); ++i)
        {
            final Element line = (Element) it.next ();
            line.setText (party.getAddressLine (i));
        }
    }

    /**
     * Gets the po number 1.
     *
     * @return the po number 1
     */
    public String getPoNumber1 ()
    {
        return payment.getChildTextTrim (PO_NUMBER_1_NODE);
    }

    /**
     * Sets the po number 1.
     *
     * @param poNumber the new po number 1
     */
    private void setPoNumber1 (final String poNumber)
    {
        payment.getChild (PO_NUMBER_1_NODE).setText (poNumber);
    }

    /**
     * Gets the po number 2.
     *
     * @return the po number 2
     */
    public String getPoNumber2 ()
    {
        return payment.getChildTextTrim (PO_NUMBER_2_NODE);
    }

    /**
     * Sets the po number 2.
     *
     * @param poNumber the new po number 2
     */
    private void setPoNumber2 (final String poNumber)
    {
        payment.getChild (PO_NUMBER_2_NODE).setText (poNumber);
    }

    /**
     * Gets the po total.
     *
     * @return the po total
     */
    public double getPoTotal ()
    {
        final String amount = payment.getChildTextTrim (PO_TOTAL_NODE);
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Sets the po total.
     *
     * @param amount the new po total
     */
    private void setPoTotal (double amount)
    {
        if (amount > 0)
        {
            amount = (int) ((amount + 0.005) * 100) / 100D;
            payment.getChild (PO_TOTAL_NODE).setText (Double.toString (amount));
        }
        else if (amount == 0)
        {
            payment.getChild (PO_TOTAL_NODE).setText (NULL_STRING);
        }
        else
        {
            throw new IllegalArgumentException ("Negative PO amounts not allowed, amount = " + amount);
        }
    }

    /**
     * Gets the po total currency.
     *
     * @return the po total currency
     */
    public String getPoTotalCurrency ()
    {
        return payment.getChildTextTrim (PO_CURRENCY_NODE);
    }

    /**
     * Sets the po total currency.
     *
     * @param currency the new po total currency
     */
    private void setPoTotalCurrency (final String currency)
    {
        payment.getChild (PO_CURRENCY_NODE).setText (currency);
    }

    /**
     * Checks if is receipt required.
     *
     * @return true, if is receipt required
     */
    public boolean isReceiptRequired ()
    {
        return payment.getChildTextTrim (RECEIPT_REQUIRED_NODE).equals (TRUE_INDICATOR);
    }

    /**
     * Sets the receipt required.
     *
     * @param isReceiptRequired the new receipt required
     */
    private void setReceiptRequired (final boolean isReceiptRequired)
    {
        if (isReceiptRequired)
        {
            payment.getChild (RECEIPT_REQUIRED_NODE).setText (TRUE_INDICATOR);
        }
        else
        {
            payment.getChild (RECEIPT_REQUIRED_NODE).setText (FALSE_INDICATOR);
        }
    }

    /**
     * Checks for bailiff knowledge.
     *
     * @return true, if successful
     */
    public boolean hasBailiffKnowledge ()
    {
        return payment.getChildTextTrim (BAILIFF_KNOWLEDGE_NODE).equals (TRUE_INDICATOR);
    }

    /**
     * Sets the bailiff knowledge.
     *
     * @param bailiffKnowledgeRequired the new bailiff knowledge
     */
    private void setBailiffKnowledge (final boolean bailiffKnowledgeRequired)
    {
        if (bailiffKnowledgeRequired)
        {
            payment.getChild (BAILIFF_KNOWLEDGE_NODE).setText (TRUE_INDICATOR);
        }
        else
        {
            payment.getChild (BAILIFF_KNOWLEDGE_NODE).setText (FALSE_INDICATOR);
        }
    }

    /**
     * Gets the enforcement court.
     *
     * @return the enforcement court
     */
    public String getEnforcementCourt ()
    {
        return payment.getChildTextTrim (ENFORCEMENT_COURT_NODE);
    }

    /**
     * Sets the enforcement court.
     *
     * @param courtCode the new enforcement court
     */
    private void setEnforcementCourt (final String courtCode)
    {
        if (courtCode.length () != 3)
        {
            throw new IllegalArgumentException (courtCode + " not a valid court code.");
        }
        payment.getChild (ENFORCEMENT_COURT_NODE).setText (courtCode);
    }

    /**
     * Gets the admin court.
     *
     * @return the admin court
     */
    public String getAdminCourt ()
    {
        return payment.getChildTextTrim (ADMIN_COURT_NODE);
    }

    /**
     * Gets the issuing court.
     *
     * @return the issuing court
     */
    public String getIssuingCourt ()
    {
        return payment.getChildTextTrim (ISSUING_COURT_NODE);
    }

    /**
     * Gets the issuing court name.
     *
     * @return the issuing court name
     */
    public String getIssuingCourtName ()
    {
        return payment.getChildTextTrim ("IssuingCourtName");
    }

    /**
     * Gets the verification report id.
     *
     * @return the verification report id
     */
    public String getVerificationReportId ()
    {
        return payment.getChildTextTrim (VER_REP_ID_NODE);
    }

    /**
     * Sets the verification report id.
     *
     * @param id the new verification report id
     */
    private void setVerificationReportId (final String id)
    {
        payment.getChild (VER_REP_ID_NODE).setText (id);
    }

    /**
     * Gets the created by.
     *
     * @return the created by
     */
    public String getCreatedBy ()
    {
        return payment.getChildTextTrim (CREATED_BY_NODE);
    }

    /**
     * Gets the payee.
     *
     * @return the payee
     */
    public Party getPayee ()
    {
        final Element payee = payment.getChild (PAYEE_NODE);
        final Party party = new Party (payee.getChildTextTrim (PARTY_NAME_NODE));

        party.setCodedPartyCode (payee.getChildTextTrim (PARTY_CODE_NODE));
        party.setPartyId (payee.getChildTextTrim (PARTY_ID_NODE));
        party.setDxNumber (payee.getChildTextTrim (PARTY_DX_NODE));

        final Element address = payee.getChild (PARTY_ADDRESS_NODE);
        party.setAddressPostCode (address.getChildTextTrim (ADDRESS_POSTCODE_NODE));
        party.setAddressReference (address.getChildTextTrim (ADDRESS_REFERENCE_NODE));

        final List<Element> addressLines = address.getChildren (ADDRESS_LINE_NODE);
        final Iterator<Element> it = addressLines.iterator ();
        for (int i = 0; it.hasNext (); ++i)
        {
            final Element line = (Element) it.next ();
            party.setAddressLine (i, line.getText ());
        }

        return party;
    }

    /**
     * Sets the payee.
     *
     * @param party the new payee
     */
    private void setPayee (final Party party)
    {
        final Element payee = payment.getChild (PAYEE_NODE);
        payee.getChild (PARTY_NAME_NODE).setText (party.getName ());
        payee.getChild (PARTY_CODE_NODE).setText (party.getCodedPartyCode ());
        payee.getChild (PARTY_ID_NODE).setText (party.getPartyId ());
        payee.getChild (PARTY_DX_NODE).setText (party.getDxNumber ());

        final Element address = payee.getChild (PARTY_ADDRESS_NODE);
        address.getChild (ADDRESS_POSTCODE_NODE).setText (party.getAddressPostCode ());
        address.getChild (ADDRESS_REFERENCE_NODE).setText (party.getAddressReference ());

        final List<Element> addressLines = address.getChildren (ADDRESS_LINE_NODE);
        final Iterator<Element> it = addressLines.iterator ();
        for (int i = 0; it.hasNext (); ++i)
        {
            final Element line = (Element) it.next ();
            line.setText (party.getAddressLine (i));
        }
    }

    /**
     * Gets the overpayee.
     *
     * @return the overpayee
     */
    public Party getOverpayee ()
    {
        final Element overpayee = payment.getChild (OVERPAYEE_NODE);
        final Party party = new Party (overpayee.getChildTextTrim (PARTY_NAME_NODE));

        final Element address = overpayee.getChild (PARTY_ADDRESS_NODE);
        party.setAddressPostCode (address.getChildTextTrim (ADDRESS_POSTCODE_NODE));

        final List<Element> addressLines = address.getChildren (ADDRESS_LINE_NODE);
        final Iterator<Element> it = addressLines.iterator ();
        for (int i = 0; it.hasNext (); ++i)
        {
            final Element line = (Element) it.next ();
            party.setAddressLine (i, line.getText ());
        }

        return party;
    }

    /**
     * Sets the overpayee.
     *
     * @param party the new overpayee
     */
    private void setOverpayee (final Party party)
    {
        final Element overpayee = payment.getChild (OVERPAYEE_NODE);
        overpayee.getChild (PARTY_NAME_NODE).setText (party.getName ());

        final Element address = overpayee.getChild (PARTY_ADDRESS_NODE);
        address.getChild (ADDRESS_POSTCODE_NODE).setText (party.getAddressPostCode ());

        final List<Element> addressLines = address.getChildren (ADDRESS_LINE_NODE);
        final Iterator<Element> it = addressLines.iterator ();
        for (int i = 0; it.hasNext (); ++i)
        {
            final Element line = (Element) it.next ();
            line.setText (party.getAddressLine (i));
        }
    }

    /**
     * Checks if is passthrough.
     *
     * @return true, if is passthrough
     */
    public boolean isPassthrough ()
    {
        return payment.getChildTextTrim (PASSTHROUGH_NODE).equals (TRUE_INDICATOR);
    }

    /**
     * Sets the passthrough.
     *
     * @param isPassthrough the new passthrough
     */
    private void setPassthrough (final boolean isPassthrough)
    {
        if (isPassthrough)
        {
            payment.getChild (PASSTHROUGH_NODE).setText (TRUE_INDICATOR);
        }
        else
        {
            payment.getChild (PASSTHROUGH_NODE).setText (FALSE_INDICATOR);
        }
    }

    /**
     * Checks if is error.
     *
     * @return true, if is error
     */
    public boolean isError ()
    {
        return payment.getChildTextTrim (ERROR_NODE).equals (TRUE_INDICATOR);
    }

    /**
     * Sets the error.
     *
     * @param isErrored the new error
     */
    private void setError (final boolean isErrored)
    {
        if (isErrored)
        {
            payment.getChild (ERROR_NODE).setText (TRUE_INDICATOR);
        }
        else
        {
            payment.getChild (ERROR_NODE).setText (FALSE_INDICATOR);
        }
    }

    /**
     * Gets the related transaction number.
     *
     * @return the related transaction number
     */
    public String getRelatedTransactionNumber ()
    {
        return payment.getChildTextTrim (RELATED_TRANS_NO_NODE);
    }

    /**
     * Sets the related transaction number.
     *
     * @param transactionNumber the new related transaction number
     */
    private void setRelatedTransactionNumber (final String transactionNumber)
    {
        payment.getChild (RELATED_TRANS_NO_NODE).setText (transactionNumber);
    }

    /**
     * Gets the related admin court.
     *
     * @return the related admin court
     */
    public String getRelatedAdminCourt ()
    {
        return payment.getChildTextTrim (RELATED_ADMIN_COURT_NODE);
    }

    /**
     * Sets the related admin court.
     *
     * @param courtCode the new related admin court
     */
    private void setRelatedAdminCourt (final String courtCode)
    {
        if (courtCode.length () != 3)
        {
            throw new IllegalArgumentException (courtCode + " not a valid court code.");
        }
        payment.getChild (RELATED_ADMIN_COURT_NODE).setText (courtCode);
    }

    /**
     * Gets the ao passthrough transaction number.
     *
     * @return the ao passthrough transaction number
     */
    public String getAoPassthroughTransactionNumber ()
    {
        if (payment.getChild (AO_TRANS_NO_NODE) == null)
        {
            return "";
        }

        return payment.getChildTextTrim (AO_TRANS_NO_NODE);
    }

    /**
     * Gets the payout report id.
     *
     * @return the payout report id
     */
    public String getPayoutReportId ()
    {
        return payment.getChildTextTrim (PAYOUT_REPORT_ID_NODE);
    }

    /**
     * Sets the payout report id.
     *
     * @param id the new payout report id
     */
    private void setPayoutReportId (final String id)
    {
        payment.getChild (PAYOUT_REPORT_ID_NODE).setText (id);
    }

    /**
     * Gets the debt seq.
     *
     * @return the debt seq
     */
    public String getDebtSeq ()
    {
        return payment.getChildTextTrim (DEBT_SEQ_NODE);
    }

    /**
     * Sets the debt seq.
     *
     * @param debtSeq the new debt seq
     */
    private void setDebtSeq (final String debtSeq)
    {
        payment.getChild (DEBT_SEQ_NODE).setText (debtSeq);
    }

    /**
     * Gets the old amount.
     *
     * @return the old amount
     */
    public double getOldAmount ()
    {
        final String amount = payment.getChildTextTrim (OLD_AMOUNT_NODE);
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Sets the old amount.
     *
     * @param amount the new old amount
     */
    private void setOldAmount (double amount)
    {
        if (amount > 0)
        {
            amount = (int) ((amount + 0.005) * 100) / 100D;
            payment.getChild (OLD_AMOUNT_NODE).setText (Double.toString (amount));
        }
        else if (amount == 0)
        {
            payment.getChild (OLD_AMOUNT_NODE).setText (NULL_STRING);
        }
        else
        {
            throw new IllegalArgumentException ("Negative amounts not allowed, amount = " + amount);
        }
    }

    /**
     * Was old error.
     *
     * @return true, if successful
     */
    public boolean wasOldError ()
    {
        return payment.getChildTextTrim (OLD_ERROR_NODE).equals (TRUE_INDICATOR);
    }

    /**
     * Sets the old error.
     *
     * @param wasOldError the new old error
     */
    private void setOldError (final boolean wasOldError)
    {
        if (wasOldError)
        {
            payment.getChild (OLD_ERROR_NODE).setText (TRUE_INDICATOR);
        }
        else
        {
            payment.getChild (OLD_ERROR_NODE).setText (FALSE_INDICATOR);
        }
    }

    /**
     * Gets the old retention type.
     *
     * @return the old retention type
     */
    public String getOldRetentionType ()
    {
        return payment.getChildTextTrim (OLD_RETENTION_NODE);
    }

    /**
     * Sets the old retention type.
     *
     * @param retentionType the new old retention type
     */
    private void setOldRetentionType (final String retentionType)
    {
        payment.getChild (OLD_RETENTION_NODE).setText (retentionType);
    }

    /**
     * Gets the report number.
     *
     * @return the report number
     */
    public String getReportNumber ()
    {
        return payment.getChildTextTrim (REPORT_NUMBER_NODE);
    }

    /**
     * Sets the report number.
     *
     * @param reportNumber the new report number
     */
    public void setReportNumber (final String reportNumber)
    {
        payment.getChild (REPORT_NUMBER_NODE).setText (reportNumber);
    }

    /**
     * Gets the report type.
     *
     * @return the report type
     */
    public String getReportType ()
    {
        return payment.getChildTextTrim (REPORT_TYPE_NODE);
    }

    /**
     * Sets the report type.
     *
     * @param reportType the new report type
     */
    private void setReportType (final String reportType)
    {
        payment.getChild (REPORT_TYPE_NODE).setText (reportType);
    }

    /**
     * Gets the report id.
     *
     * @return the report id
     */
    public String getReportId ()
    {
        return payment.getChildTextTrim (REPORT_ID_NODE);
    }

    /**
     * Sets the report id.
     *
     * @param reportId the new report id
     */
    private void setReportId (final String reportId)
    {
        if (this.payment.getChild (REPORT_ID_NODE) == null)
        {
            this.payment.addContent (new Element (REPORT_ID_NODE));
        }
        payment.getChild (REPORT_ID_NODE).setText (reportId);
    }

    /**
     * Gets the number defendants.
     *
     * @return the number defendants
     */
    public int getNumberDefendants ()
    {
        final String numberDefendants = payment.getChildTextTrim (NUMBER_DEFENDANTS_NODE);
        return numberDefendants.length () > 0 ? Integer.parseInt (numberDefendants) : 0;
    }

    /**
     * Sets the number defendants.
     *
     * @param numberDefendants the new number defendants
     */
    private void setNumberDefendants (final int numberDefendants)
    {
        if (this.payment.getChild (NUMBER_DEFENDANTS_NODE) == null)
        {
            this.payment.addContent (new Element (NUMBER_DEFENDANTS_NODE));
        }
        if (numberDefendants > 0)
        {
            payment.getChild (NUMBER_DEFENDANTS_NODE).setText (Integer.toString (numberDefendants));
        }
        else if (numberDefendants == 0)
        {
            payment.getChild (NUMBER_DEFENDANTS_NODE).setText (NULL_STRING);
        }
        else
        {
            throw new IllegalArgumentException (
                    "Negative number of defendants not allowed, number = " + numberDefendants);
        }
    }

    /**
     * Gets the executing court.
     *
     * @return the executing court
     */
    public String getExecutingCourt ()
    {
        return payment.getChildTextTrim (EXECUTING_COURT_NODE);
    }

    /**
     * Sets the executing court.
     *
     * @param court the new executing court
     */
    private void setExecutingCourt (final String court)
    {
        if (this.payment.getChild (EXECUTING_COURT_NODE) == null)
        {
            this.payment.addContent (new Element (EXECUTING_COURT_NODE));
        }
        payment.getChild (EXECUTING_COURT_NODE).setText (court);
    }

    /**
     * Gets the warrant id.
     *
     * @return the warrant id
     */
    public String getWarrantId ()
    {
        return payment.getChildTextTrim (WARRANT_ID_NODE);
    }

    /**
     * Sets the warrant id.
     *
     * @param warrantId the new warrant id
     */
    private void setWarrantId (final String warrantId)
    {
        if (this.payment.getChild (WARRANT_ID_NODE) == null)
        {
            this.payment.addContent (new Element (WARRANT_ID_NODE));
        }
        payment.getChild (WARRANT_ID_NODE).setText (warrantId);
    }

    /**
     * Checks if is execution warrant.
     *
     * @return true, if is execution warrant
     */
    public boolean isExecutionWarrant ()
    {
        boolean isExecutionWarrant = false;
        if (payment.getChildTextTrim (WARRANT_TYPE_NODE).equals (EXECUTION_WARRANT_TYPE) ||
                payment.getChildTextTrim (WARRANT_TYPE_NODE).equals (CONTROL_WARRANT_TYPE))
        {
            isExecutionWarrant = true;
        }
        return isExecutionWarrant;
    }

    /**
     * Sets the warrant type.
     *
     * @param warrantType the new warrant type
     */
    private void setWarrantType (final String warrantType)
    {
        if (this.payment.getChild (WARRANT_TYPE_NODE) == null)
        {
            this.payment.addContent (new Element (WARRANT_TYPE_NODE));
        }
        payment.getChild (WARRANT_TYPE_NODE).setText (warrantType);
    }

    /**
     * Gets the co type.
     *
     * @return the co type
     */
    public String getCoType ()
    {
        return payment.getChildTextTrim (CO_TYPE_NODE);
    }

    /**
     * Sets the co type.
     *
     * @param coType the new co type
     */
    private void setCoType (final String coType)
    {
        if (this.payment.getChild (CO_TYPE_NODE) == null)
        {
            this.payment.addContent (new Element (CO_TYPE_NODE));
        }
        payment.getChild (CO_TYPE_NODE).setText (coType);
    }

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public String getCaseNumber ()
    {
        return payment.getChildTextTrim (CASE_NUMBER_NODE);
    }

    /**
     * Sets the case number.
     *
     * @param caseNumber the new case number
     */
    private void setCaseNumber (final String caseNumber)
    {
        if (this.payment.getChild (CASE_NUMBER_NODE) == null)
        {
            this.payment.addContent (new Element (CASE_NUMBER_NODE));
        }
        payment.getChild (CASE_NUMBER_NODE).setText (caseNumber);
    }

    /**
     * Gets the number events.
     *
     * @return the number events
     */
    public int getNumberEvents ()
    {
        final String numberEvents = payment.getChildTextTrim (NUMBER_EVENTS_NODE);
        return numberEvents.length () > 0 ? Integer.parseInt (numberEvents) : 0;
    }

    /**
     * Sets the number events.
     *
     * @param numberEvents the new number events
     */
    private void setNumberEvents (final int numberEvents)
    {
        if (this.payment.getChild (NUMBER_EVENTS_NODE) == null)
        {
            this.payment.addContent (new Element (NUMBER_EVENTS_NODE));
        }
        payment.getChild (NUMBER_EVENTS_NODE).setText (Integer.toString (numberEvents));
    }

    /**
     * Checks if is warrant payment.
     *
     * @return true, if is warrant payment
     */
    public boolean isWarrantPayment ()
    {
        final boolean isHomeWarrant = getEnforcementType ().equals (ENFORCEMENT_TYPE_HOME_WARRANT);
        final boolean isForeignWarrant = getEnforcementType ().equals (ENFORCEMENT_TYPE_FOREIGN_WARRANT);
        return isHomeWarrant || isForeignWarrant;
    }

    /**
     * Checks if is co payment.
     *
     * @return true, if is co payment
     */
    public boolean isCoPayment ()
    {
        return getEnforcementType ().equals (ENFORCEMENT_TYPE_CO);
    }

    /**
     * Checks if is ae payment.
     *
     * @return true, if is ae payment
     */
    public boolean isAePayment ()
    {
        return getEnforcementType ().equals (ENFORCEMENT_TYPE_AE);
    }

    /**
     * Checks if is case payment.
     *
     * @return true, if is case payment
     */
    public boolean isCasePayment ()
    {
        return getEnforcementType ().equals (ENFORCEMENT_TYPE_CASE);
    }

    /**
     * Sets the system date.
     *
     * @param date the new system date
     */
    private void setSystemDate (final String date)
    {
        if (this.payment.getChild (SYSTEM_DATE_NODE) == null)
        {
            this.payment.addContent (new Element (SYSTEM_DATE_NODE));
        }
        payment.getChild (SYSTEM_DATE_NODE).setText (date);
    }

    /**
     * Exists.
     *
     * @return true, if successful
     */
    public boolean exists ()
    {
        return scnNumberPresent;
    }

    /**
     * Gets the sups date format.
     *
     * @return the sups date format
     */
    public static SimpleDateFormat getSupsDateFormat ()
    {
        return (SimpleDateFormat) SUPS_DATE_FORMAT.clone ();
    }

    /**
     * Adds the service court id element.
     *
     * @param pCourtId the court id
     */
    public void addServiceCourtIdElement (final String pCourtId)
    {

        if (this.payment.getChild (SERVICE_COURT_ID_NODE) == null)
        {
            this.payment.addContent (new Element (SERVICE_COURT_ID_NODE));
        }
        payment.getChild (SERVICE_COURT_ID_NODE).setText (pCourtId);

    }

    /**
     * Sets the service court id.
     *
     * @param pCourtId the new service court id
     */
    public void setServiceCourtId (final String pCourtId)
    {
        this.serviceCourtId = pCourtId;
    }

    /**
     * Gets the service court id.
     *
     * @return the service court id
     */
    public String getServiceCourtId ()
    {
        return this.serviceCourtId;
    }

}