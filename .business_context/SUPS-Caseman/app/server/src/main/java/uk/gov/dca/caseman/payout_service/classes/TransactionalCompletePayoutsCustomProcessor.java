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
package uk.gov.dca.caseman.payout_service.classes;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventDefs;
import uk.gov.dca.caseman.co_event_service.java.CoEventDefs;
import uk.gov.dca.caseman.co_event_service.java.CoEventXMLBuilder;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.SystemDateHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.system_data_service.java.SequenceNumberHelper;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Service: Payout
 * Method: transactionalCompletePayouts
 * Class: TransactionalCompletePayoutCustomProcessor.java
 * 
 * @author Anthony Bonnar, Phil Haferer & Paul Robinson
 *         Created: 17-Jan-2006
 * 
 *         Description:
 * 
 *         Change History:
 *         31-Mar-2006 Phil Haferer:
 *         01: Removed 'static' from class attributes totalOrdinary through to totalMiscellaneous, as these need to be
 *         re-initialised each time the 'Complete Payout' is performed.
 *         02: Renamed the constant GET_NEW_DIVIDENDS_METHOD as GET_DIVIDENDS_METHOD, the method "mGetNewDividends()"
 *         as "mGetDividends()".
 *         03: Renamed GET_PAYMENT_ORDER_NUMBER_1_FOR_UPDATE_METHOD to GET_PAYABLE_ORDER_NUMBER_1_FOR_UPDATE_METHOD,
 *         and "mGetPaymentOrderNumber1ForUpdate()" to "mGetPayableOrderNumber1ForUpdate()".
 *
 *         06-Apr-2006 Phil Haferer:
 *         01: Renamed mGetAllowedDebtsByCoNumber() to mGetLiveAndSchedule2AllowedDebtsForCo(), to better reflect what
 *         it does.
 *         Also removed adminCourtCode from the params as not required.
 *         02: mUpdateConsolidatedOrdersPaid(): Removed adminCourtCode from the params as not required.
 *         03: mGetTransferStatus(): Removed adminCourtCode from the params as it was incorrect, and would have actually
 *         failed to find the relevant row.
 *         Renamed the function and the service it calls with as mGetCoCaseEventTransferStatus().
 *         04: Renamed allowedDebtstrigeger() as mUpdateAllowedDebtsEvents().
 *         05: Removed the AdminCourtCode parameter from mGetDebtorName() as not required for selecting a Consolidated
 *         Order.
 *         06: mDeleteCoCaseEvent(): Removed the AdminCourtCode parameter as incorrect.
 *         07: Removed the AdminCourtCode parameter from mGetDebtDividends(), mGetDebtPassthroughs(),
 *         mGetDebtAllowedAmount()
 *         and mCmfAldDebtBalance().
 *         08: Renamed mCmfAldDebtBalance() as mCalculateAllowedDebtBalance().
 *         09: Changed how the CADUNumber is created, so that using the value incremented by the CADU report, rather
 *         than
 *         incrementing again here - as we did originally.
 *         10: Renamed mGetDebtDividends() to be mGetDebtDividendsTotal(), to reflect the service method it calls.
 *         11: mCalculateAllowedDebtBalance(): Changed the equation from "totalDue - (totalPassthroughs - totalPaid)"
 *         to "totalDue - (totalPassthroughs + totalPaid)".
 *
 *         10-Apr-2006 Phil Haferer: TD 2660: UC074 Complete Payout DCS totals incorrect
 *         01: Amended mAddAmountByRetentionType() for performance.
 *         mPayoutUpdate(): Change the call "mAddAmountByRetentionType(retentionType, amount)" to
 *         02: "mAddAmountByRetentionType(retentionType, amount - overpaymentAmount)" in an attempt to fix the
 *         double counting of overpayments.
 *
 *         18-Apr-2006 Phil Haferer: TD 2666: UC074 Complete Payout - CO and Debt status not updated
 *         01: mCalculateOutstandingBalance(): Noticed a mistake in the fee calculation which would have contributed to
 *         this defect. Replaced "feeElement += (liveDebts - passthroughs)/(totalDebts - passthroughs);" by
 *         "feeElement *= (liveDebts - passthroughs)/(totalDebts - passthroughs);".
 *         02: mPayoutUpdate(): Moved the call to mSetDividendCreated() from after the loop through all Dividends to
 *         before it.
 *         The SQL which retrieves the total Fees Paid on a CO selects those rows where CREATED = 'Y'. The latest
 *         DIVIDENDS
 *         rows need to be included in this selection, in order to calculate the correct balance. Therefore, this call
 *         needed
 *         to be made prior to the calculate been performed.
 *
 *         26-Apr-2006 Phil Haferer:
 *         Was trying to call UPDATE_CO_CASE_EVENT_METHOD in the PAYOUT_SERVICE rather than the CO_SERVICE.
 *
 *         27-Apr-2006 Phil Haferer:
 *         01: Noticed that mUpdateAllowedDebtsEvents() was being called from within a for loop over the
 *         list of Allowed Debts, and was iterating over this list itself. Therefore took the loop out of this method,
 *         and a loop around the call for the situation where the whole CO has been identified as paid.
 *         02: Noticed the change of 26-Apr-2006 was incorrect. UPDATE_CO_CASE_EVENT_METHOD was in PAYOUT_SERVICE,
 *         but it name should have been UPDATE_CO_CASE_EVENTS_METHOD (i.e. missing an 'S').
 *
 *         27-Apr-2006 Phil Haferer:
 *         mUpdateAllowedDebtsEvents(): Removed the append of the Debt Status from the generation of the 'Details'
 *         value, as the value may now be out of date, following the updates of
 *         mUpdateAllowedDebtsToPaidForLiveAndSchedule2().
 *         The status is now appended in the SQP UPDATE statement instead - where it will get an up-to-date value.
 *
 *         10-May-2006 Phil Haferer:
 *         TD 3343: Complete Payout Balance Calculation Performance
 *         01: Optimized mCalculateOutstandingBalance() so that all the amounts required to calculate the balance are
 *         retrieved
 *         in a single trip to the database. Removed a number of now obsolete methods as result.
 *         02: Optimized mUpdateCOCaseEvent() in order to avoid an extra trip to the database to get the Debtor Name.
 *         03: Optimized mCalculateAllowedDebtBalance() by removing to 3 database calls to get the amounts required for
 *         the
 *         calculation. These are now retrieved by mGetLiveAndSchedule2AllowedDebtsForCo(). As a result the following
 *         methods
 *         became obsolete and have been deleted, mGetDebtDividendsTotal(), mGetDebtPassthroughs() and
 *         mGetDebtAllowedAmount().
 * 
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 *         08-Aug-2006 Chris Hutt. totalJGMT1000 parameter supplied to insertDcsRecord mispelt. Defect 4168
 *         24-Aug-2006 Phil Haferer: (TD CASEMAN 4700: CO Event 975 Process Stage not set to AUTO).
 *         Changed call from insertCoEventAutoLocal to insertCoEventAutoExtLocal.
 *
 *         21-sep-2007 ChrisHutt. TD Defect: Caseman 6434
 *         It was discovered in live that when a record which has been completely paid receives another payment which
 *         represents
 *         100% overpayment, the DCS record created when the complete payout is generated is incorrect. The root of the
 *         problem
 *         lay in the fact that this custom processor assumes that if PayableOrderNumber1 on the Payment record is empty
 *         then the
 *         payment cannot be an overpayment - it failed to recognise that an overpayment need not be accompagnied by a
 *         regular
 *         payment (which is recorded in the PayableOrderNumber1 column on Payments).
 * 
 *         The problem has been addressed by comparing the payee name on Payable_orders and payments .... if these are
 *         not the same then
 *         the payment MUST be an overpayment.
 *
 *         16-May-2011 Chris Vincent Trac 3373
 *         Changed any variables with the type double to type float. Also ensure that any references to
 *         Double.parseDouble() changed to Float.parseFloat()
 */
public class TransactionalCompletePayoutsCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The Constant PAYOUT_SERVICE. */
    // Services.
    private static final String PAYOUT_SERVICE = "ejb/PayoutServiceLocal";

    /** The Constant UPDATE_NON_OVERPAYMENTS_METHOD. */
    private static final String UPDATE_NON_OVERPAYMENTS_METHOD = "updateNonOverpaymentsLocal";
    
    /** The Constant UPDATE_OVERPAYMENTS_METHOD. */
    private static final String UPDATE_OVERPAYMENTS_METHOD = "updateOverpaymentsLocal";
    
    /** The Constant UPDATE_CANDIDATE_PAYMENTS_METHOD. */
    private static final String UPDATE_CANDIDATE_PAYMENTS_METHOD = "updateCandidatePaymentsLocal";
    
    /** The Constant SET_DIVIDEND_CREATED_METHOD. */
    private static final String SET_DIVIDEND_CREATED_METHOD = "setDividendCreatedLocal";
    
    /** The Constant RESET_CO_ADHOC_DIVIDEND_METHOD. */
    private static final String RESET_CO_ADHOC_DIVIDEND_METHOD = "resetCoAdhocDividendLocal";
    
    /** The Constant SET_DCS_FINAL_METHOD. */
    private static final String SET_DCS_FINAL_METHOD = "setDcsFinalLocal";
    
    /** The Constant COMPLETE_PAYOUT_DELETION_METHOD. */
    private static final String COMPLETE_PAYOUT_DELETION_METHOD = "completePayoutDeletionLocal";
    
    /** The Constant UPDATE_DEBT_DIVIDENDS_METHOD. */
    private static final String UPDATE_DEBT_DIVIDENDS_METHOD = "updateDebtDividendsLocal";
    
    /** The Constant UPDATE_ALLOWED_DEBTS_FOR_LIVE_SCHEDULE2_METHOD. */
    private static final String UPDATE_ALLOWED_DEBTS_FOR_LIVE_SCHEDULE2_METHOD = "updateAllowedDebtsLiveSchedule2Local";
    
    /** The Constant UPDATE_ALLOWED_DEBTS_BY_DEBT_SEQUENCE_METHOD. */
    private static final String UPDATE_ALLOWED_DEBTS_BY_DEBT_SEQUENCE_METHOD = "updateAllowedDebtsByDebtSequenceLocal";
    
    /** The Constant UPDATE_ALLOWED_DEBTS_FOR_SCHEDULE2_METHOD. */
    private static final String UPDATE_ALLOWED_DEBTS_FOR_SCHEDULE2_METHOD = "updateAllowedDebtsSchedule2Local";
    
    /** The Constant GET_PAYABLE_ORDER_NUMBER_1_FOR_UPDATE_METHOD. */
    private static final String GET_PAYABLE_ORDER_NUMBER_1_FOR_UPDATE_METHOD = "getPayableOrderNumber1ForUpdateLocal";
    
    /** The Constant GET_PAYABLE_ITEMS_METHOD. */
    private static final String GET_PAYABLE_ITEMS_METHOD = "getPayableItemsLocal";
    
    /** The Constant GET_ALLOWED_DEBTS_METHOD. */
    private static final String GET_ALLOWED_DEBTS_METHOD = "getAllowedDebtsLocal";
    
    /** The Constant GET_DEBT_DIVIDENDS_TOTAL_FOR_UPDATE_METHOD. */
    private static final String GET_DEBT_DIVIDENDS_TOTAL_FOR_UPDATE_METHOD = "getDebtDividendsTotalForUpdateLocal";
    
    /** The Constant GET_PAYABLE_ORDER_REPORT_ID_METHOD. */
    private static final String GET_PAYABLE_ORDER_REPORT_ID_METHOD = "getPayableOrderReportIdLocal";
    
    /** The Constant CONFIRM_DIVIDEND_PAYMENT. */
    private static final String CONFIRM_DIVIDEND_PAYMENT = "confirmDividendPaymentLocal";
    
    /** The Constant INSERT_DCS_DATA_METHOD. */
    private static final String INSERT_DCS_DATA_METHOD = "insertDcsRecordLocal";
    
    /** The Constant GET_DIVIDENDS_METHOD. */
    private static final String GET_DIVIDENDS_METHOD = "getDividendsLocal";
    
    /** The Constant UPDATE_CONSOLIDATED_ORDERS_METHOD. */
    private static final String UPDATE_CONSOLIDATED_ORDERS_METHOD = "updateConsolidatedOrdersLocal";
    
    /** The Constant GET_ALLOWED_DEBT_CASEMAN_DEBT_STATUS_METHOD. */
    private static final String GET_ALLOWED_DEBT_CASEMAN_DEBT_STATUS_METHOD = "getAllowedDebtCasemanDebtStatusLocal";
    
    /** The Constant GET_CO_CASE_EVENT_TRANSFER_STATUS_METHOD. */
    private static final String GET_CO_CASE_EVENT_TRANSFER_STATUS_METHOD = "getCoCaseEventTransferStatusLocal";
    
    /** The Constant DELETE_CO_CASE_EVENT_METHOD. */
    private static final String DELETE_CO_CASE_EVENT_METHOD = "deleteCoCaseEventLocal";
    
    /** The Constant UPDATE_CO_CASE_EVENTS_METHOD. */
    private static final String UPDATE_CO_CASE_EVENTS_METHOD = "updateCoCaseEventsLocal";
    
    /** The Constant GET_CO_BALANCE_AMOUNTS_METHOD. */
    private static final String GET_CO_BALANCE_AMOUNTS_METHOD = "getCoBalanceAmountsLocal";

    /** The Constant INSERT_CO_EVENT_AUTO_EXT. */
    // CO Event Service Method.
    private static final String INSERT_CO_EVENT_AUTO_EXT = "insertCoEventAutoExtLocal";

    /** The Constant ORDINARY. */
    // Retention Types
    private static final String ORDINARY = "ORDINARY";
    
    /** The Constant JGMT1000. */
    private static final String JGMT1000 = "JGMT(1000+)";
    
    /** The Constant AOCAEO. */
    private static final String AOCAEO = "AO/CAEO";
    
    /** The Constant INSAT. */
    private static final String INSAT = "IN SATISFACTION";
    
    /** The Constant PTO. */
    private static final String PTO = "PURSUANT TO ORDER";
    
    /** The Constant MISCELLANEOUS. */
    private static final String MISCELLANEOUS = "MISCELLANEOUS";
    
    /** The Constant CHEQUE. */
    private static final String CHEQUE = "CHEQUE";

    /** The total ordinary. */
    private float totalOrdinary;
    
    /** The total cheque. */
    private float totalCheque;
    
    /** The total JGMT 1000. */
    private float totalJGMT1000;
    
    /** The total AOCAEO. */
    private float totalAOCAEO;
    
    /** The total insat. */
    private float totalInsat = 0;
    
    /** The total PTO. */
    private float totalPTO = 0;
    
    /** The total miscellaneous. */
    private float totalMiscellaneous;

    /** The Constant DOM_SERVICE. */
    private static final String DOM_SERVICE = "ejb/DomServiceLocal";

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param log the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log log) throws BusinessException, SystemException
    {
        String courtId = null;
        String userId = null;

        try
        {
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();
            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();

            // Complete the Payout.
            mPayoutUpdate (courtId, userId);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return params;
    } // process()

    /**
     * (non-Javadoc)
     * Completes payouts.
     *
     * @param pAdminCourtCode the admin court code
     * @param pUserId the user id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void mPayoutUpdate (final String pAdminCourtCode, final String pUserId)
        throws SystemException, BusinessException, JDOMException
    {
        final String CO_ADDRESS_UNKNOWN_REPORT_PREFIX = "CADU";

        String CADUNumber = null;
        String CADUReportId = null;
        String reportId = null;
        String todaysDate = null;
        Element payableItemsElement = null;
        String debtDividendSeq = null;
        List<Element> payableItemsList = null;
        Element payableItemElement = null;
        Element debtDividendsElement = null;
        Element debtDividendElement = null;
        List<Element> dividendItemsList = null;
        Element dividendItemsElement = null;
        String transactionNumber = null;
        Element paymentsElement = null;
        Element paymentElement = null;
        Element allowedDebtsElement = null;
        List<Element> allowedDebtsList = null;
        Element allowedDebtElement = null;
        String payableOrderNumber1 = null;
        String paymentFor = null;
        String retentionType = null;
        String coNumber = null;
        float dividendAmount = 0;
        float overpaymentAmount = 0;
        float amount = 0;
        float outstandingBalance = 0;
        String debtSequenceNo = null;
        float allowedDebtBalance = 0;
        String payableOrderPayeeName = null;
        String paymentPayeeName = null;

        // Running Totals
        final float totalOverpaymentAmount = 0;
        final float totalAmount = 0;
        int totalNumberofTransactions = 0;

        // The CADU Report Id is increment by the CADU Report itself,
        // so here we just need to get the current value.
        CADUNumber = SequenceNumberHelper.getCurrentValue (/* pAdminCourtCode */pAdminCourtCode,
                /* pItem */CO_ADDRESS_UNKNOWN_REPORT_PREFIX, /* pContext */this.m_context);
        CADUReportId = CO_ADDRESS_UNKNOWN_REPORT_PREFIX + CADUNumber;

        reportId = mGetPayableOrderReportId (pAdminCourtCode);
        todaysDate = SystemDateHelper.getSystemDate ();

        payableItemsElement = mGetPayableItems (pAdminCourtCode);

        payableItemsList = payableItemsElement.getChildren ();
        for (Iterator<Element> payableItemsIterator = payableItemsList.iterator (); payableItemsIterator.hasNext ();)
        {
            payableItemElement = (Element) payableItemsIterator.next ();
            debtDividendSeq = payableItemElement.getChild ("Dds").getText ();
            if ( !debtDividendSeq.equals (""))
            {
                debtDividendsElement = mGetDebtDividendsTotalForUpdate (debtDividendSeq);
                debtDividendElement = debtDividendsElement.getChild ("DebtDividend");
                mUpdateDebtDividends (/* pAdminCourtCode */pAdminCourtCode,
                        /* pPrint */payableItemElement.getChild ("Print").getText (),
                        /* pPoTotal */payableItemElement.getChild ("PoTotal").getText (),
                        /* pPoNumber */payableItemElement.getChild ("PoNumber").getText (),
                        /* pPayeeName */payableItemElement.getChild ("PayeeName").getText (),
                        /* pCaduReportId */CADUReportId,
                        /* pPayeeAddr1 */payableItemElement.getChild ("PayeeAddr1").getText (),
                        /* pPayeeAddr2 */payableItemElement.getChild ("PayeeAddr2").getText (),
                        /* pPayeeAddr3 */payableItemElement.getChild ("PayeeAddr3").getText (),
                        /* pPayeeAddr4 */payableItemElement.getChild ("PayeeAddr4").getText (),
                        /* pPayeeAddr5 */payableItemElement.getChild ("PayeeAddr5").getText (),
                        /* pPayeePostcode */payableItemElement.getChild ("PayeePostcode").getText (),
                        /* pPayeeReference */payableItemElement.getChild ("PayeeReference").getText (),
                        /* pPayeeDx */payableItemElement.getChild ("PayeeDx").getText (),
                        /* pDebtDividendSeq */debtDividendSeq);
            }
            else
            {
                transactionNumber = payableItemElement.getChild ("Tn").getText ();
                paymentsElement = mGetPayableOrderNumber1ForUpdate (transactionNumber, pAdminCourtCode);
                paymentElement = paymentsElement.getChild ("Payment");

                payableOrderNumber1 = paymentElement.getChild ("PayableOrderNumber1").getText ();
                paymentFor = paymentElement.getChild ("PaymentFor").getText ();

                payableOrderPayeeName = payableItemElement.getChild ("PayeeName").getText ();
                paymentPayeeName = paymentElement.getChild ("PayeeName").getText ();

                // need to store some of the columns from the PAYMENT record before it is updated, so we can
                // later do some comparisons with a view to emulating a legacy update trigger.
                overpaymentAmount =
                        Float.parseFloat (paymentElement.getChild ("OverpaymentAmount").getText ().equals ("") ? "0"
                                : paymentElement.getChild ("OverpaymentAmount").getText ());
                amount = Float.parseFloat (paymentElement.getChild ("Amount").getText ().equals ("") ? "0"
                        : paymentElement.getChild ("Amount").getText ());
                retentionType = paymentElement.getChild ("RetentionType").getText ();

                if (payableOrderNumber1.equals ("") // Not an overpayment.
                        && payableOrderPayeeName.equals (paymentPayeeName) // Confirming that not an overpayment (defect
                                                                           // 6434)
                        && !paymentFor.equals ("CO"))
                {
                    mUpdateNonOverpayments (/* pAdminCourtCode */pAdminCourtCode,
                            /* pPoNumber */payableItemElement.getChild ("PoNumber").getText (),
                            /* pTransactionNumber */transactionNumber,
                            /* pPrint */payableItemElement.getChild ("Print").getText (),
                            /* pPoTotal */payableItemElement.getChild ("PoTotal").getText (), /* pItemDate */todaysDate,
                            /* pReportId */reportId, /* pCaduReportId */CADUReportId);

                    // Add the amount to the running total.
                    mAddAmountByRetentionType (retentionType, amount - overpaymentAmount);
                }
                else
                {
                    mUpdateOverpayments ( // All Overpayments.
                            /* pAdminCourtCode */pAdminCourtCode,
                            /* pPoNumber */payableItemElement.getChild ("PoNumber").getText (),
                            /* pTransactionNumber */transactionNumber, /* pItemDate */todaysDate,
                            /* pReportId */reportId);

                    // Add the overpayment amount to the running total.
                    mAddAmountByRetentionType (retentionType, overpaymentAmount);
                }
                // Increment the total number of transactions.
                totalNumberofTransactions++;
            }
        } // payableItemsIterator

        // Get the amounts of each new dividend, and add it to the retentionType of 'AOCAEO'
        // which we will then update the DCS table with later on.
        dividendItemsElement = mGetDividends (pAdminCourtCode);
        dividendItemsList = dividendItemsElement.getChildren ();
        for (Iterator<Element> dividendItemsIterator = dividendItemsList.iterator (); dividendItemsIterator.hasNext ();)
        {
            dividendItemsElement = (Element) dividendItemsIterator.next ();
            dividendAmount = Float.parseFloat (dividendItemsElement.getChild ("Amount").getText ().equals ("") ? "0"
                    : dividendItemsElement.getChild ("Amount").getText ());
            totalAOCAEO += dividendAmount;
        }

        // emulate the trigger on the Payments table in Legacy - Insert a new DCS record.
        mPopulateDcsData (/* String pItemDate */todaysDate, /* String pReportId */reportId,
                /* int pTotalNumberOfTransactions */totalNumberofTransactions, /* float pTotalOrdinary */totalOrdinary,
                /* float pTotalCheque */totalCheque, /* float pTotalJGMT1000 */totalJGMT1000,
                /* float pTotalAOCAEO */totalAOCAEO, /* float pTotalInsat */totalInsat, /* float pTotalPTO */totalPTO,
                /* float pTotalMiscellaneous */totalMiscellaneous, /* String pUserID */pUserId,
                /* String pAdminCourtCode */pAdminCourtCode);

        mUpdateCandidatePayments (/* pAdminCourtCode */pAdminCourtCode, /* pItemDate */todaysDate,
                /* pReportId */reportId);

        mSetDividendCreated (/* pAdminCourtCode */pAdminCourtCode, /* pReportId */reportId);

        // Iterate through the list of Consolidated Order Dividend rows (there will be one per CO)...
        for (Iterator<Element> dividendItemsIterator = dividendItemsList.iterator (); dividendItemsIterator.hasNext ();)
        {
            dividendItemsElement = (Element) dividendItemsIterator.next ();
            coNumber = dividendItemsElement.getChild ("CoNumber").getText ();

            // Insert one CO Event 970 - "DIVIDEND DECLARED AUTOMATICALLY" for each Dividend that is paid.
            // Note that there will be one DIVIDENDS row per Consolidated Order.
            mInsertCoEventAuto (/* String pCoEventId */"970", /* String pCoNumber */coNumber,
                    /* String pEventDate */todaysDate, /* String pReceiptDate */todaysDate,
                    /* String pUserName */pUserId, /* String pErrorInd */"N", /* String pProcessStage */"");

            // If the Consolidated Order is now Paid...
            outstandingBalance = mCalculateOutstandingBalance (coNumber, "Y"); // set p_schedule2 = Y
            if (outstandingBalance <= 0)
            {
                // Update consolidatedOrders by coNumber, setting status to PAID.
                mUpdateConsolidatedOrdersPaid (coNumber);

                // Get the allowedDebts that have a debt_status in 'LIVE', 'SCHEDULE2' for the current CO.
                // These are required before the update, when updating the related events afterward.
                allowedDebtsElement = mGetLiveAndSchedule2AllowedDebtsForCo (coNumber);
                allowedDebtsList = allowedDebtsElement.getChildren ();

                // Set DEBT_STATUS to PAID for this CO's Allowed Debts,
                // where DEBT_STATUS is currently either 'LIVE' or 'SCHEDULE2'.
                mUpdateAllowedDebtsToPaidForLiveAndSchedule2 (coNumber);

                // Update the events relating to each of the Allowed Debt for the current Consolidated Order...
                for (Iterator<Element> allowedDebtsIterator = allowedDebtsList.iterator (); allowedDebtsIterator.hasNext ();)
                {
                    allowedDebtElement = (Element) allowedDebtsIterator.next ();
                    mUpdateAllowedDebtsEvents (pAdminCourtCode, allowedDebtElement, todaysDate);
                } // for (Iterator allowedDebtsIterator = ...

                // Insert CO Event 975 - "AMOUNT PAID IN FULL".
                mInsertCoEventAuto (/* String pCoEventId */"975", /* String pCoNumber */coNumber,
                        /* String pEventDate */todaysDate, /* String pReceiptDate */todaysDate,
                        /* String pUserName */pUserId, /* String pErrorInd */"N", /* String pProcessStage */"AUTO");
            }
            else
            {
                // Get the Allowed Debts that have a DEBT_STATUS of 'LIVE' or 'SCHEDULE2' for this CO.
                allowedDebtsElement = mGetLiveAndSchedule2AllowedDebtsForCo (coNumber);
                allowedDebtsList = allowedDebtsElement.getChildren ();

                // For each Allowed Debt we need to calculate the Allowed Debt Balance.
                for (Iterator<Element> allowedDebtsIterator = allowedDebtsList.iterator (); allowedDebtsIterator.hasNext ();)
                {
                    allowedDebtElement = (Element) allowedDebtsIterator.next ();

                    allowedDebtBalance = mCalculateAllowedDebtBalance (allowedDebtElement);
                    if (allowedDebtBalance == 0)
                    {
                        // Update the Allowed Debts for the current CO, setting DEBT_STATUS to 'PAID'.
                        debtSequenceNo = allowedDebtElement.getChild ("debtSequenceNumber").getText ();
                        mUpdateAllowedDebtsToPaidByDebtSequence (coNumber, debtSequenceNo);
                        mUpdateAllowedDebtsEvents (pAdminCourtCode, allowedDebtElement, todaysDate);
                    }
                } // for (Iterator allowedDebtsIterator = ...

                outstandingBalance = mCalculateOutstandingBalance (coNumber, "N"); // set p_schedule2 = N
                if (outstandingBalance <= 0)
                {
                    // Update Allowed Debts again (setting debt status to LIVE) for records
                    // that have a debt_status of 'SCHEDULE2'.
                    mUpdateAllowedDebtsToLiveForSchedule2 (coNumber);
                    // No need to update Allowed Debt Events here, as these only apply to setting
                    // the status to PAID'.
                }
            } // of else for, if (outstandingBalance <= 0)
        } // for (Iterator dividendItemsIterator ...

        mResetCOAdhocDividend (pAdminCourtCode);

        mSetDCSFinal (/* pAdminCourtCode */pAdminCourtCode, /* pReportId */reportId);

        mCompletePayoutDeletion (pAdminCourtCode);

    } // mPayoutUpdate()

    /**
     * (non-Javadoc)
     * This method emulates functionality from the Legacy ALLOWED_DEBTS Trigger.
     *
     * @param pAdminCourtCode the admin court code
     * @param pAllowedDebtElement the allowed debt element
     * @param pTodaysDate the todays date
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void mUpdateAllowedDebtsEvents (final String pAdminCourtCode, final Element pAllowedDebtElement,
                                            final String pTodaysDate)
        throws SystemException, BusinessException, JDOMException
    {
        // This method emulates functionality from the Legacy ALLOWED_DEBTS Trigger.

        final Element allowedDebtElement = null;
        String caseManDebt = null;
        String debtCaseNumber = null;
        String deftPartyRoleCode = null;
        String deftCasePartyNo = null;
        String debtSequenceNo = null;
        String transferStatus = null;

        // If the Allowed Debt relates to a Case belong to a SUPS Court (i.e. is in the SUPS Database
        // rather than in a legacy Court database), CASEMAN_DEBT is set to "Y".
        caseManDebt = pAllowedDebtElement.getChild ("caseManDebt").getText ();
        if (caseManDebt.equalsIgnoreCase ("Y"))
        {
            // Flag the most recent Case Event 705 (AE/CAEO IN FORCE) as deleted.
            debtCaseNumber = pAllowedDebtElement.getChild ("debtCaseNumber").getText ();
            deftPartyRoleCode = pAllowedDebtElement.getChild ("deftPartyRoleCode").getText ();
            deftCasePartyNo = pAllowedDebtElement.getChild ("deftCasePartyNo").getText ();
            mMarkLastCaseEventDeleted (/* String pCaseNumber */debtCaseNumber,
                    /* String pPartyRoleCode */deftPartyRoleCode, /* String pCasePartyNumber */deftCasePartyNo,
                    /* String pStdEventId */"705");
        }
        else
        {
            // Here, the Allowed Debt relates to a Case that is in a Legacy Court's database.
            // Events relating to these Cases are transferred to the Legacy Court via the
            // CO_CASE_EVENTS table.

            // If a Case Event for this Allowed Debt has already been triggered for transfer
            // to the Legacy Court, a CO_CASE_EVENTS row will already have been created.
            // This may be awaiting transfer, or the transfer may already have been completed.
            debtSequenceNo = pAllowedDebtElement.getChild ("debtSequenceNumber").getText ();
            transferStatus = mGetCoCaseEventTransferStatus (debtSequenceNo);

            // If the CO Case Event's Transfer Status was not found, the CO_CASE_EVENTS row
            // does not exist, so no action is required.
            if (null != transferStatus)
            {
                if (transferStatus.equals ("2"))
                {
                    // When the CO Case Event transfer has already been completed...
                    // Reuse the existing CO_CASE_EVENTS row to send an event
                    // 777 (CO UPDATE) to the Legacy Court, by changing the Transfer Status
                    // back to "1" - Ready To Transfer.
                    mUpdateCoCaseEvent (/* String pStdEventId */"777", /* String pCreatedDate */pTodaysDate,
                            /* String pTransferStatus */"1", /* String pDebtSequenceNo */debtSequenceNo);
                }
                else
                {
                    // When the CO Case Event is still waiting to be transferred...
                    mDeleteCoCaseEvent (debtSequenceNo);
                }
            } // if (null != transferStatus)
        }
    } // mUpdateAllowedDebtsEvents()

    /**
     * (non-Javadoc)
     * Updates non overpayments.
     *
     * @param pAdminCourtCode the admin court code
     * @param pPoNumber the po number
     * @param pTransactionNumber the transaction number
     * @param pPrint the print
     * @param pPoTotal the po total
     * @param pItemDate the item date
     * @param pReportId the report id
     * @param pCaduReportId the cadu report id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateNonOverpayments (final String pAdminCourtCode, final String pPoNumber,
                                         final String pTransactionNumber, final String pPrint, final String pPoTotal,
                                         final String pItemDate, final String pReportId, final String pCaduReportId)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);
        XMLBuilder.addParam (paramsElement, "poNumber", pPoNumber);
        XMLBuilder.addParam (paramsElement, "transactionNumber", pTransactionNumber);
        XMLBuilder.addParam (paramsElement, "print", pPrint);
        XMLBuilder.addParam (paramsElement, "poTotal", pPoTotal);
        XMLBuilder.addParam (paramsElement, "itemDate", pItemDate);
        XMLBuilder.addParam (paramsElement, "reportId", pReportId);
        XMLBuilder.addParam (paramsElement, "caduReportId", pCaduReportId);

        // Call the service.
        invokeLocalServiceProxy (PAYOUT_SERVICE, UPDATE_NON_OVERPAYMENTS_METHOD, inputDoc);

        return;
    } // mUpdateNonOverpayments()

    /**
     * (non-Javadoc)
     * Updates overpayments.
     *
     * @param pAdminCourtCode the admin court code
     * @param pPoNumber the po number
     * @param pTransactionNumber the transaction number
     * @param pItemDate the item date
     * @param pReportId the report id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateOverpayments (final String pAdminCourtCode, final String pPoNumber,
                                      final String pTransactionNumber, final String pItemDate, final String pReportId)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);
        XMLBuilder.addParam (paramsElement, "poNumber", pPoNumber);
        XMLBuilder.addParam (paramsElement, "transactionNumber", pTransactionNumber);
        XMLBuilder.addParam (paramsElement, "itemDate", pItemDate);
        XMLBuilder.addParam (paramsElement, "reportId", pReportId);

        // Call the service.
        invokeLocalServiceProxy (PAYOUT_SERVICE, UPDATE_OVERPAYMENTS_METHOD, inputDoc);

        return;
    } // mUpdateOverpayments()

    /**
     * (non-Javadoc)
     * Updates candidate payments.
     *
     * @param pAdminCourtCode the admin court code
     * @param pItemDate the item date
     * @param pReportId the report id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCandidatePayments (final String pAdminCourtCode, final String pItemDate, final String pReportId)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);
        XMLBuilder.addParam (paramsElement, "itemDate", pItemDate);
        XMLBuilder.addParam (paramsElement, "reportId", pReportId);

        // Call the service.
        invokeLocalServiceProxy (PAYOUT_SERVICE, UPDATE_CANDIDATE_PAYMENTS_METHOD, inputDoc);

        return;
    } // mUpdateCandidatePayments()

    /**
     * (non-Javadoc)
     * Sets dividend created.
     *
     * @param pAdminCourtCode the admin court code
     * @param pReportId the report id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mSetDividendCreated (final String pAdminCourtCode, final String pReportId)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);
        XMLBuilder.addParam (paramsElement, "reportId", pReportId);

        // Call the service.
        invokeLocalServiceProxy (PAYOUT_SERVICE, SET_DIVIDEND_CREATED_METHOD, inputDoc);

        return;
    } // mSetDividendCreated()

    /**
     * (non-Javadoc)
     * Resets CO adhoc dividend.
     *
     * @param pAdminCourtCode the admin court code
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mResetCOAdhocDividend (final String pAdminCourtCode) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);

        // Call the service.
        invokeLocalServiceProxy (PAYOUT_SERVICE, RESET_CO_ADHOC_DIVIDEND_METHOD, inputDoc);

        return;
    } // mResetCOAdhocDividend()

    /**
     * (non-Javadoc)
     * Sets DCS final.
     *
     * @param pAdminCourtCode the admin court code
     * @param pReportId the report id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mSetDCSFinal (final String pAdminCourtCode, final String pReportId)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);
        XMLBuilder.addParam (paramsElement, "reportId", pReportId);

        // Call the service.
        invokeLocalServiceProxy (PAYOUT_SERVICE, SET_DCS_FINAL_METHOD, inputDoc);

        return;
    } // mSetDCSFinal()

    /**
     * (non-Javadoc)
     * Completes payout deletion.
     *
     * @param pAdminCourtCode the admin court code
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mCompletePayoutDeletion (final String pAdminCourtCode) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);

        // Call the service.
        invokeLocalServiceProxy (PAYOUT_SERVICE, COMPLETE_PAYOUT_DELETION_METHOD, inputDoc);

        return;
    } // mCompletePayoutDeletion()

    /**
     * (non-Javadoc)
     * Updates debt dividends.
     *
     * @param pAdminCourtCode the admin court code
     * @param pPrint the print
     * @param pPoTotal the po total
     * @param pPoNumber the po number
     * @param pPayeeName the payee name
     * @param pCaduReportId the cadu report id
     * @param pPayeeAddr1 the payee addr 1
     * @param pPayeeAddr2 the payee addr 2
     * @param pPayeeAddr3 the payee addr 3
     * @param pPayeeAddr4 the payee addr 4
     * @param pPayeeAddr5 the payee addr 5
     * @param pPayeePostcode the payee postcode
     * @param pPayeeReference the payee reference
     * @param pPayeeDx the payee dx
     * @param pDebtDividendSeq the debt dividend seq
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateDebtDividends (final String pAdminCourtCode, final String pPrint, final String pPoTotal,
                                       final String pPoNumber, final String pPayeeName, final String pCaduReportId,
                                       final String pPayeeAddr1, final String pPayeeAddr2, final String pPayeeAddr3,
                                       final String pPayeeAddr4, final String pPayeeAddr5, final String pPayeePostcode,
                                       final String pPayeeReference, final String pPayeeDx,
                                       final String pDebtDividendSeq)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "print", pPrint);
        XMLBuilder.addParam (paramsElement, "po_total", pPoTotal);
        XMLBuilder.addParam (paramsElement, "po_number", pPoNumber);
        XMLBuilder.addParam (paramsElement, "payee_name", pPayeeName);
        XMLBuilder.addParam (paramsElement, "caduReportId", pCaduReportId);
        XMLBuilder.addParam (paramsElement, "payeeAddr1", pPayeeAddr1);
        XMLBuilder.addParam (paramsElement, "payeeAddr2", pPayeeAddr2);
        XMLBuilder.addParam (paramsElement, "payeeAddr3", pPayeeAddr3);
        XMLBuilder.addParam (paramsElement, "payeeAddr4", pPayeeAddr4);
        XMLBuilder.addParam (paramsElement, "payeeAddr5", pPayeeAddr5);
        XMLBuilder.addParam (paramsElement, "payeePostcode", pPayeePostcode);
        XMLBuilder.addParam (paramsElement, "payeeReference", pPayeeReference);
        XMLBuilder.addParam (paramsElement, "payeeDx", pPayeeDx);
        XMLBuilder.addParam (paramsElement, "debtDividendSeq", pDebtDividendSeq);

        // Call the service.
        invokeLocalServiceProxy (PAYOUT_SERVICE, UPDATE_DEBT_DIVIDENDS_METHOD, inputDoc);

        return;
    } // mUpdateDebtDividends()

    /**
     * (non-Javadoc)
     * Gets payable order number 1 for update.
     *
     * @param pTransactionNumber the transaction number
     * @param pAdminCourtCode the admin court code
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetPayableOrderNumber1ForUpdate (final String pTransactionNumber, final String pAdminCourtCode)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        Element paymentsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "transactionNumber", pTransactionNumber);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);

        // Call the service.
        outputDoc = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYABLE_ORDER_NUMBER_1_FOR_UPDATE_METHOD, inputDoc);

        paymentsElement = outputDoc.getRootElement ();

        return paymentsElement;
    } // mGetPayableOrderNumber1ForUpdate()

    /**
     * (non-Javadoc)
     * Gets CO case event transfer status.
     *
     * @param sequenceNumber the sequence number
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetCoCaseEventTransferStatus (final String sequenceNumber)
        throws SystemException, BusinessException, JDOMException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        String status = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "sequenceNumber", sequenceNumber);

        psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_CO_CASE_EVENT_TRANSFER_STATUS_METHOD, inputDoc)
                .getRootElement ();
        if (null != psElement)
        {
            status = XMLBuilder.getXPathValue (psElement, "/ds/coCaseEvents/transferStatus");
        }

        return status;
    } // mGetCoCaseEventTransferStatus()

    /**
     * (non-Javadoc)
     * Gets debt dividend total for update.
     *
     * @param pDebtDividendSeq the debt dividend seq
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetDebtDividendsTotalForUpdate (final String pDebtDividendSeq)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        Element debtDividendsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "debtDividendSeq", pDebtDividendSeq);

        // Call the service.
        outputDoc = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_DEBT_DIVIDENDS_TOTAL_FOR_UPDATE_METHOD, inputDoc);

        debtDividendsElement = outputDoc.getRootElement ();

        return debtDividendsElement;
    } // mGetDebtDividendsTotalForUpdate()

    /**
     * (non-Javadoc)
     * Retrieve NonCancelled Payment Orders and Dividends.
     *
     * @param pAdminCourtCode the admin court code
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetPayableItems (final String pAdminCourtCode) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        Element payableItemsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);

        // Call the service.
        outputDoc = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYABLE_ITEMS_METHOD, inputDoc);

        payableItemsElement = outputDoc.getRootElement ();

        return payableItemsElement;
    } // mGetPayableItems()

    /**
     * (non-Javadoc)
     * Currently unused.
     *
     * @param pAdminCourtCode the admin court code
     * @param pCoNumber the co number
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private String mGetAllowedDebtCaseManDebtStatus (final String pAdminCourtCode, final String pCoNumber)
        throws SystemException, BusinessException, JDOMException
    {
        Element psElement = null;
        Document inputDoc = null;
        final Document outputDoc = null;
        Element paramsElement = null;
        final Element dsElement = null;
        final Element debtStatusHeaderElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);
        XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);

        // Call the service.
        psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_ALLOWED_DEBT_CASEMAN_DEBT_STATUS_METHOD, inputDoc)
                .getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/allowedDebt/caseManDebt";
        String debtStatus = XMLBuilder.getXPathValue (psElement, returnValueXPath);

        if (debtStatus == null || debtStatus == "")
        {
            debtStatus = "N";
        }

        return debtStatus;
    } // mGetAllowedDebtCaseManDebtStatus()

    /**
     * (non-Javadoc)
     * Gets payable order report id.
     *
     * @param pAdminCourtCode the admin court code
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetPayableOrderReportId (final String pAdminCourtCode) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        Element dsElement = null;
        Element payableOrderHeaderElement = null;
        String reportId = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);

        // Call the service.
        outputDoc = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_PAYABLE_ORDER_REPORT_ID_METHOD, inputDoc);

        dsElement = outputDoc.getRootElement ();
        payableOrderHeaderElement = dsElement.getChild ("PayableOrderHeader");
        reportId = payableOrderHeaderElement.getChild ("ReportId").getText ();

        return reportId;
    } // mGetPayableOrderReportId()

    /**
     * (non-Javadoc)
     * Currently unused.
     *
     * @param transactionNumber the transaction number
     * @param adminCourtCode the admin court code
     * @return true, if successful
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private boolean mConfirmDividendPayment (final String transactionNumber, final String adminCourtCode)
        throws SystemException, BusinessException, JDOMException
    {

        Document inputDoc = null;
        Element paramsElement = null;
        Element psElement = null;
        boolean confirmDividendPayment = false;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "transactionNumber", transactionNumber);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", adminCourtCode);

        psElement = invokeLocalServiceProxy (PAYOUT_SERVICE, CONFIRM_DIVIDEND_PAYMENT, inputDoc).getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ds/dividendPayment/dividendPayment";
        String status = XMLBuilder.getXPathValue (psElement, returnValueXPath);
        if (status == null)
        {
            status = "0";
        }

        if (Integer.valueOf (status).intValue () > 0)
        {
            confirmDividendPayment = true;
        }

        return confirmDividendPayment;
    }

    /**
     * (non-Javadoc)
     * Inserts DCS data.
     *
     * @param pItemDate the item date
     * @param pReportId the report id
     * @param pTotalNumberOfTransactions the total number of transactions
     * @param pTotalOrdinary the total ordinary
     * @param pTotalCheque the total cheque
     * @param pTotalJGMT1000 the total JGMT 1000
     * @param pTotalAOCAEO the total AOCAEO
     * @param pTotalInsat the total insat
     * @param pTotalPTO the total PTO
     * @param pTotalMiscellaneous the total miscellaneous
     * @param pUserID the user ID
     * @param pAdminCourtCode the admin court code
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mPopulateDcsData (final String pItemDate, final String pReportId, final int pTotalNumberOfTransactions,
                                   final float pTotalOrdinary, final float pTotalCheque, final float pTotalJGMT1000,
                                   final float pTotalAOCAEO, final float pTotalInsat, final float pTotalPTO,
                                   final float pTotalMiscellaneous, final String pUserID, final String pAdminCourtCode)

        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "itemDate", pItemDate);
        XMLBuilder.addParam (paramsElement, "reportId", pReportId);
        XMLBuilder.addParam (paramsElement, "totalNumberOfTransactions", Integer.toString (pTotalNumberOfTransactions));
        XMLBuilder.addParam (paramsElement, "totalOrdinary", Double.toString (pTotalOrdinary));
        XMLBuilder.addParam (paramsElement, "totalCheque", Double.toString (pTotalCheque));
        XMLBuilder.addParam (paramsElement, "totalJGMT1000", Double.toString (pTotalJGMT1000));
        XMLBuilder.addParam (paramsElement, "totalAOCAEO", Double.toString (pTotalAOCAEO));
        XMLBuilder.addParam (paramsElement, "totalInsat", Double.toString (pTotalInsat));
        XMLBuilder.addParam (paramsElement, "totalPTO", Double.toString (pTotalPTO));
        XMLBuilder.addParam (paramsElement, "totalMiscellaneous", Double.toString (pTotalMiscellaneous));
        XMLBuilder.addParam (paramsElement, "userId", pUserID);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);

        // Call the service.
        invokeLocalServiceProxy (PAYOUT_SERVICE, INSERT_DCS_DATA_METHOD, inputDoc);

        return;
    } // mPopulateDcsData()

    /**
     * (non-Javadoc)
     * Gets dividends.
     *
     * @param pAdminCourtCode the admin court code
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetDividends (final String pAdminCourtCode) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        Element dividendItemsElement = null;

        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);

        // Call the service.
        outputDoc = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_DIVIDENDS_METHOD, inputDoc);

        dividendItemsElement = outputDoc.getRootElement ();

        return dividendItemsElement;
    } // mGetDividends()

    /**
     * Method to return the debt balance.
     * 
     * @param pAllowedDebtElement - XML Element representing an Allowed Debt, which includes amounts required
     *            to calculate the Allowed Debts balance.
     * @return debt balance
     */
    private float mCalculateAllowedDebtBalance (final Element pAllowedDebtElement)
    {
        float totalPaid = 0;
        float totalPassthroughs = 0;
        float totalDue = 0;

        totalPaid = mGetElementAsDouble (pAllowedDebtElement, "debtDividendsTotal");
        totalPassthroughs = mGetElementAsDouble (pAllowedDebtElement, "debtTotalPassthroughs");
        totalDue = mGetElementAsDouble (pAllowedDebtElement, "debtAllowedAmount");

        // Return the balance.
        return totalDue - (totalPassthroughs + totalPaid);
    } // mCalculateAllowedDebtBalance()

    /**
     * Method to calculate the outstanding balance.
     *
     * @param coNumber The co number
     * @param pSchedule2 Whether the debt is Schedule2 or not
     * @return amount outstanding
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private float mCalculateOutstandingBalance (final String coNumber, final String pSchedule2)
        throws SystemException, BusinessException
    {
        float balance = 0;

        final Element coBalanceAmountsElement = mGetCoBalanceAmounts (coNumber);

        // Get amount paid
        float creditorPaymentsMade = 0;
        if (pSchedule2.equalsIgnoreCase ("Y"))
        {
            creditorPaymentsMade = mGetElementAsDouble (coBalanceAmountsElement, "CreditorPaymentsMade");
        }
        else
        {
            creditorPaymentsMade = mGetElementAsDouble (coBalanceAmountsElement, "NonSched2CredPaymentsMade");
        }

        if (creditorPaymentsMade > 0)
        {
            // Get Fees paid to date
            final float feesPaid = mGetElementAsDouble (coBalanceAmountsElement, "FeesPaid");

            // Add the fees amount to the creditor payments to get the total paid out.
            creditorPaymentsMade = creditorPaymentsMade + feesPaid;
        }

        // Get passthroughs
        final float passthroughsPaid = mGetElementAsDouble (coBalanceAmountsElement, "PassthroughsPaid");

        float schedule2PassthroughsPaid = 0;
        if (pSchedule2.equalsIgnoreCase ("Y"))
        {
            // Get Schedule2 Passthroughs if required
            schedule2PassthroughsPaid = mGetElementAsDouble (coBalanceAmountsElement, "Sched2PassthroughsPaid");
        }

        float passthroughs = 0;
        float totalDebts = 0;

        float liveDebts = 0;
        if (pSchedule2.equalsIgnoreCase ("Y"))
        {
            liveDebts = mGetElementAsDouble (coBalanceAmountsElement, "LiveDebts");
        }
        else
        {
            liveDebts = mGetElementAsDouble (coBalanceAmountsElement, "IncludedDebts");
        }

        if (pSchedule2.equalsIgnoreCase ("Y"))
        {
            totalDebts = liveDebts;
            passthroughs = passthroughsPaid + schedule2PassthroughsPaid;
        }
        else
        {
            passthroughs = passthroughsPaid;
            // get total debts, Force pSchedule of 'Y' to ensure correct service.
            totalDebts = mGetElementAsDouble (coBalanceAmountsElement, "LiveDebts");
        }

        float feeElement = mGetElementAsDouble (coBalanceAmountsElement, "FeeElement");

        // Only calculate a proportion if there are valid debts
        if (totalDebts - passthroughs > 0)
        {
            feeElement *= (liveDebts - passthroughs) / (totalDebts - passthroughs);
        }

        balance = liveDebts + feeElement - (creditorPaymentsMade + passthroughs);

        return balance;
    } // mCalculateOutstandingBalance

    /**
     * Extract the text value of a child Element and convert it to a float.
     * 
     * @param pParentElement An Element object that contains a child Element
     *            which in turn contains a textual value which may be interpreted as a 'float'.
     * @param pValueElementName The name of a child element contain text representing a 'float' numerical value.
     * @return Returns the extracted value as type 'float'.
     */
    private float mGetElementAsDouble (final Element pParentElement, final String pValueElementName)
    {
        float dValue = 0;
        String sValue = null;

        sValue = pParentElement.getChildText (pValueElementName);
        if (sValue == null)
        {
            sValue = "0";
        }

        dValue = Float.parseFloat (sValue);

        return dValue;
    } // mGetElementAsDouble()

    /**
     * Method to update the Consolidated Orders to Paid.
     *
     * @param pCoNumber the co number
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateConsolidatedOrdersPaid (final String pCoNumber) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            // Create the 'input' to be used used by retrieve and update service methods.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);
            XMLBuilder.addParam (paramsElement, "status", "PAID");

            // Call the service.
            invokeLocalServiceProxy (PAYOUT_SERVICE, UPDATE_CONSOLIDATED_ORDERS_METHOD, inputDoc);

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        return;
    } // mUpdateConsolidatedOrdersPaid()

    /**
     * Method to update the Allowed Debts to have devt_status of Paid for debt_status that
     * currently have a value of either LIVE or SCHEDULE2.
     *
     * @param pCoNumber the co number
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateAllowedDebtsToPaidForLiveAndSchedule2 (final String pCoNumber)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            // Create the 'input' to be used used by retrieve and update service methods.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);
            XMLBuilder.addParam (paramsElement, "status", "PAID");

            // Call the service.
            invokeLocalServiceProxy (PAYOUT_SERVICE, UPDATE_ALLOWED_DEBTS_FOR_LIVE_SCHEDULE2_METHOD, inputDoc);

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        return;
    } // mUpdateAllowedDebtsToPaidForLiveAndSchedule2()

    /**
     * Method to update the Allowed Debts to have devt_status of LIVE for debt_status that
     * currently have a value SCHEDULE2.
     *
     * @param pCoNumber the co number
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateAllowedDebtsToLiveForSchedule2 (final String pCoNumber)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            // Create the 'input' to be used used by retrieve and update service methods.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement (inputDoc);
            XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);
            XMLBuilder.addParam (paramsElement, "status", "LIVE");

            // Call the service.
            invokeLocalServiceProxy (PAYOUT_SERVICE, UPDATE_ALLOWED_DEBTS_FOR_SCHEDULE2_METHOD, inputDoc);

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        return;
    } // mUpdateAllowedDebtsToLiveForSchedule2()

    /**
     * Method to update the Allowed Debts to have debt_status of Paid - match by debt_seq number.
     *
     * @param pCoNumber the co number
     * @param pDebtSequenceNumber the debt sequence number
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateAllowedDebtsToPaidByDebtSequence (final String pCoNumber, final String pDebtSequenceNumber)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            // Create the 'input' to be used used by retrieve and update service methods.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement (inputDoc);
            XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);
            XMLBuilder.addParam (paramsElement, "debtSequenceNumber", pDebtSequenceNumber);
            XMLBuilder.addParam (paramsElement, "status", "PAID");

            // Call the service.
            invokeLocalServiceProxy (PAYOUT_SERVICE, UPDATE_ALLOWED_DEBTS_BY_DEBT_SEQUENCE_METHOD, inputDoc);

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        return;
    } // mUpdateAllowedDebtsToPaidByDebtSequence()

    /**
     * Method to return the Retrieve the seq_number for allowed_debts
     * by co_number and debt_status in ('LIVE' or 'SCHEDULE2').
     *
     * @param pCoNumber the co number
     * @return The seq_number element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetLiveAndSchedule2AllowedDebtsForCo (final String pCoNumber)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        Element allowedDebtsElement = null;

        try
        {
            // Create the 'input' to be used used by retrieve and update service methods.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);

            // Call the service.
            outputDoc = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_ALLOWED_DEBTS_METHOD, inputDoc);

            allowedDebtsElement = outputDoc.getRootElement ();
        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        return allowedDebtsElement;
    } // mGetLiveAndSchedule2AllowedDebtsForCo()

    /**
     * (non-Javadoc)
     * Deletes a CO case event.
     *
     * @param debtSequenceNo the debt sequence no
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteCoCaseEvent (final String debtSequenceNo) throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "debtSequenceNo", debtSequenceNo);

            invokeLocalServiceProxy (PAYOUT_SERVICE, DELETE_CO_CASE_EVENT_METHOD, inputDoc);
        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }
    } // mDeleteCoCaseEvent()

    /**
     * (non-Javadoc)
     * Updates a CO case event.
     *
     * @param pStdEventId the std event id
     * @param pCreatedDate the created date
     * @param pTransferStatus the transfer status
     * @param pDebtSequenceNo the debt sequence no
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateCoCaseEvent (final String pStdEventId, final String pCreatedDate, final String pTransferStatus,
                                     final String pDebtSequenceNo)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            // Create the 'input' to be used used by retrieve and update service methods.
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement ();
            inputDoc.setRootElement (paramsElement);
            XMLBuilder.addParam (paramsElement, "stdEventId", pStdEventId);
            XMLBuilder.addParam (paramsElement, "createdDate", pCreatedDate);
            XMLBuilder.addParam (paramsElement, "transferStatus", pTransferStatus);
            XMLBuilder.addParam (paramsElement, "debtSequenceNo", pDebtSequenceNo);

            // Call the service.
            invokeLocalServiceProxy (PAYOUT_SERVICE, UPDATE_CO_CASE_EVENTS_METHOD, inputDoc);

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        return;
    } // mUpdateCoCaseEvent()

    /**
     * (non-Javadoc)
     * Updates class totals variables.
     *
     * @param pRetentionType the retention type
     * @param pAmount the amount
     */
    private void mAddAmountByRetentionType (final String pRetentionType, final float pAmount)
    {
        final String retentionType = pRetentionType.trim ().toUpperCase ();

        if (retentionType.equals (ORDINARY))
        {
            totalOrdinary += pAmount;
        }
        else if (retentionType.equals (CHEQUE))
        {
            totalCheque += pAmount;
        }
        else if (retentionType.equals (JGMT1000))
        {
            totalJGMT1000 += pAmount;
        }
        else if (retentionType.equals (AOCAEO))
        {
            totalAOCAEO += pAmount;
        }
        else if (retentionType.equals (INSAT))
        {
            totalInsat += pAmount;
        }
        else if (retentionType.equals (PTO))
        {
            totalPTO += pAmount;
        }
        else if (retentionType.equals (MISCELLANEOUS))
        {
            totalMiscellaneous += pAmount;
        }
    } // mAddAmountByRetentionType()

    /**
     * (non-Javadoc)
     * Inserts a CO event.
     *
     * @param pCoEventId the co event id
     * @param pCoNumber the co number
     * @param pEventDate the event date
     * @param pReceiptDate the receipt date
     * @param pUserName the user name
     * @param pErrorInd the error ind
     * @param pProcessStage the process stage
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mInsertCoEventAuto (final String pCoEventId, final String pCoNumber, final String pEventDate,
                                     final String pReceiptDate, final String pUserName, final String pErrorInd,
                                     final String pProcessStage)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;
        CoEventXMLBuilder coEventXMLBuilder = null;
        Element coEventElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement (inputDoc);

            coEventXMLBuilder =
                    new CoEventXMLBuilder (/* String CONumber */pCoNumber, /* String standardEventId */pCoEventId,
                            /* String eventDate */pEventDate, /* String receiptDate */pReceiptDate,
                            /* String userName */pUserName, /* String ErrorInd */pErrorInd);
            coEventXMLBuilder.setProcessStage (pProcessStage);

            coEventElement = coEventXMLBuilder.getXMLElement ("COEvent");
            XMLBuilder.addParam (paramsElement, "coEvent", coEventElement);

            // Call the service.
            invokeLocalServiceProxy (CoEventDefs.CO_EVENT_SERVICE, INSERT_CO_EVENT_AUTO_EXT, inputDoc);

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
            coEventXMLBuilder = null;
            coEventElement = null;
        }

        return;
    } // mInsertCoEventAuto()

    /**
     * (non-Javadoc)
     * Marks the last case event deleted.
     *
     * @param pCaseNumber the case number
     * @param pPartyRoleCode the party role code
     * @param pCasePartyNumber the case party number
     * @param pStdEventId the std event id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mMarkLastCaseEventDeleted (final String pCaseNumber, final String pPartyRoleCode,
                                            final String pCasePartyNumber, final String pStdEventId)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Element paramsElement = null;

        try
        {
            inputDoc = new Document ();
            paramsElement = XMLBuilder.getNewParamsElement (inputDoc);

            XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
            XMLBuilder.addParam (paramsElement, "partyRoleCode", pPartyRoleCode);
            XMLBuilder.addParam (paramsElement, "casePartyNumber", pCasePartyNumber);
            XMLBuilder.addParam (paramsElement, "stdEventId", pStdEventId);

            // Call the service.
            invokeLocalServiceProxy (CaseEventDefs.CASE_EVENT_SERVICE,
                    CaseEventDefs.MARK_LAST_CASE_EVENT_DELETED_METHOD, inputDoc);

        }
        finally
        {
            inputDoc = null;
            paramsElement = null;
        }

        return;
    } // mMarkLastCaseEventDeleted()

    /**
     * Retrieve an Element which holds all the values required to calculate the
     * outstanding balance on a Consolidated Order.
     *
     * @param pCoNumber the co number
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetCoBalanceAmounts (final String pCoNumber) throws SystemException, BusinessException
    {
        Element coBalanceAmountsElement = null;
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        Element dsElement = null;

        // Build the parameter document for the service call.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement (inputDoc);
        XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);

        // Call the service which retrieves the CO balance amounts.
        outputDoc = invokeLocalServiceProxy (PAYOUT_SERVICE, GET_CO_BALANCE_AMOUNTS_METHOD, inputDoc);

        // Retrieve the element that contains all 'amount' elements.
        dsElement = outputDoc.getRootElement ();
        coBalanceAmountsElement = dsElement.getChild ("CoBalanceAmounts");

        return coBalanceAmountsElement;
    } // mGetCoBalanceAmounts()

} // class TransactionalCompletePayoutsCustomProcessor
