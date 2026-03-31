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

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.CoFeeAmountHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.payments_service.java.util.events.AbstractEvent;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class ConsolidatedOrder.
 *
 * @author Steve Blair
 */
public class ConsolidatedOrder
{

    /** The Constant STATUS_NODE. */
    private static final String STATUS_NODE = "Status";
    
    /** The Constant FEE_AMOUNT_NODE. */
    private static final String FEE_AMOUNT_NODE = "FeeAmount";
    
    /** The Constant CO_LIVE_STATUS. */
    private static final String CO_LIVE_STATUS = "LIVE";
    
    /** The Constant CO_PAID_STATUS. */
    private static final String CO_PAID_STATUS = "PAID";
    
    /** The Constant CO_TYPE_AO. */
    private static final String CO_TYPE_AO = "AO";
    
    /** The Constant CO_TYPE_CAEO. */
    private static final String CO_TYPE_CAEO = "CAEO";
    
    /** The Constant CO_FULLY_PAID_EVENT_ID. */
    private static final int CO_FULLY_PAID_EVENT_ID = 975;
    
    /** The Constant NULL_STRING. */
    private static final String NULL_STRING = "";

    /** The co. */
    Element co;
    
    /** The services. */
    private ServiceAdaptor services;
    
    /** The debts. */
    private Map<String, Debt> debts = new HashMap<>();
    
    /** The cached status. */
    private String cachedStatus;

    /**
     * Construct a ConsolidatedOrder object based upon a JDOM Element conforming
     * to the structure of map_co.xml. Clients should only be manipulating
     * existing COs so should use getCo() factory method.
     * 
     * @param co JDOM element representing the CO
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @throws IllegalArgumentException if the Co Element is not properly
     *             formatted
     */
    ConsolidatedOrder (final Element co, final ServiceAdaptor services)
    {
        if ( !co.getName ().equals ("Co"))
        {
            throw new IllegalArgumentException (
                    "Improperly formed Co Element passed to ConsolidatedOrder " + "constructor.");
        }

        this.co = co;
        this.services = services;
        cachedStatus = getStatus ();
    }

    /**
     * Retrieves a CO record from the database and uses it to construct a new
     * ConsolidatedOrder object.
     *
     * @param coNumber CO number of the CO to retrieve
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @return ConsolidatedOrder object representing the CO or
     *         NullConsolidatedOrder if no CO exists matching parameters
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public static ConsolidatedOrder getCo (final String coNumber, final ServiceAdaptor services)
        throws BusinessException, SystemException
    {
        if (coNumber == null)
        {
            throw new NullPointerException ();
        }

        final Element coParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (coParams, "coNumber", coNumber);

        final Document result = services.callService ("ejb/PaymentsServiceLocal", "getPassthroughCoLocal2", coParams);
        if (result == null)
        {
            return new NullConsolidatedOrder ();
        }

        return new ConsolidatedOrder (result.getRootElement (), services);
    }

    /**
     * Retrieves a debt record from the database and uses it to construct a new
     * Debt object.
     *
     * @param debtSeq Sequence number of the debt
     * @return new Debt object or NullDebt if no debt exists matching parameters
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public Debt getDebt (final String debtSeq) throws SystemException, BusinessException, JDOMException
    {
        if (debtSeq == null)
        {
            throw new NullPointerException ();
        }

        Debt debt = (Debt) debts.get (debtSeq);
        if (debt != null)
        {
            return debt;
        }

        final Element debtParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (debtParams, "debtSeq", debtSeq);
        XMLBuilder.addParam (debtParams, "coNumber", getCoNumber ());

        final Document result =
                services.callService ("ejb/PaymentsServiceLocal", "getPassthroughDebtLocal2", debtParams);
        final Element debtEl = (Element) XPath.selectSingleNode (result, "/ds/Debt");
        if (debtEl == null)
        {
            return new NullDebt ();
        }

        debt = new Debt (this, debtEl, services);
        debts.put (debtSeq, debt);
        return debt;
    }

    /**
     * Saves the CO to the database.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public void save () throws BusinessException, SystemException
    {
        final Element coParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (coParams, "co", toElement ());

        final Document results =
                services.callService ("ejb/PaymentsServiceLocal", "updatePassthroughCoLocal2", coParams);
        co = results.getRootElement ();
    }

    /**
     * Sets the status field of the CO depending upon the current balance. If
     * the CO is paid but schedule 2 debts exist then the status will remain
     * LIVE and the schedule 2 debts will be upgraded to LIVE.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    public void updateStatus () throws BusinessException, SystemException, JDOMException
    {
        final double amountDue = getCoBalance (new String[] {CO_LIVE_STATUS});
        if (amountDue <= 0)
        {
            setStatus (CO_PAID_STATUS);
        }
        else
        {
            setStatus (CO_LIVE_STATUS);
        }

        if (isPaid ())
        {
            checkSchedule2Debts ();
        }
    }

    /**
     * Checks for the existence of schedule 2 debts on the CO. If exist then
     * sets CO status to LIVE and updates all schedule 2 debts to live debts.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private void checkSchedule2Debts () throws BusinessException, SystemException, JDOMException
    {
        final Element schedule2Debts = getSchedule2Debts ();
        if (schedule2Debts != null)
        {
            setStatus (CO_LIVE_STATUS);
            setSchedule2DebtsLive (schedule2Debts);
            commitSchedule2Debts (schedule2Debts);
        }
    }

    /**
     * Checks if the status of the CO differs from the status when it was
     * constructed.
     * 
     * @return true if the status has changed
     */
    public boolean hasStatusChanged ()
    {
        return !getStatus ().equals (cachedStatus);
    }

    /**
     * Calculates the total fee owed on the CO.
     * 
     * @return fee amount (2 decimal places)
     */
    private double calculateFee ()
    {
        return CoFeeAmountHelper.calculateCoFeeAmount (getFeeRate (), getCoAmount (), getSchedule2Amount (),
                getPassthroughAmount ());
    }

    /**
     * Recalculates the fee amount for the CO based on fee rate, amount of debts
     * and payments to date.
     */
    public void updateFeeAmount ()
    {
        setFeeAmount (calculateFee ());
    }

    /**
     * Returns outstanding balance of a CO from the database. Any changes to CO
     * not committed to database will not be included in calculation.
     *
     * @param debtTypes types of debt to include in balance
     * @return outstanding balance of the CO (2 decimal figures)
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public double getCoBalance (final String[] debtTypes) throws SystemException, BusinessException, JDOMException
    {
        final Element coParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (coParams, "coNumber", getCoNumber ());

        final Document results = services.callService ("ejb/PaymentsServiceLocal", "getCoBalanceLocal2", coParams);
        final List<Element> debts = XPath.selectNodes (results, "/ds/Debt");

        // COs must have at least one debt.
        if (debts.size () == 0)
        {
            throw new IllegalStateException ("No debts found for CO " + getCoNumber ());
        }

        double balance = 0;
        for (Iterator<Element> debtIt = debts.iterator (); debtIt.hasNext ();)
        {
            final Element debtType = (Element) debtIt.next ();
            for (int i = 0, y = debtTypes.length; i < y; ++i)
            {
                if (debtType.getChildText ("Status").equals (debtTypes[i]))
                {
                    balance += Double.parseDouble (debtType.getChildText ("AmountAllowed"));
                    balance -= Double.parseDouble (debtType.getChildText ("PaidToDate"));
                }
            }
        }

        if (balance < 0)
        {
            return (int) ((balance - 0.005) * 100) / 100D;
        }
        return (int) ((balance + 0.005) * 100) / 100D;
    }

    /**
     * Updates or fires all events associated with the CO depending on the
     * current status of the CO and the existence of events on the database,.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public void updateEvents () throws SystemException, BusinessException, JDOMException
    {
        final AbstractEvent event = getFullyPaidEvent ();
        if (event.exists ())
        {
            if (isPaid ())
            {
                event.saveErrorStatus (false);
            }
            else
            {
                event.saveErrorStatus (true);
            }
        }
        else if (isPaid ())
        {
            event.fire ();
        }
    }

    /**
     * Gets the fully paid event.
     *
     * @return the fully paid event
     */
    public AbstractEvent getFullyPaidEvent ()
    {
        final String systemDate = Payment.getSupsDateFormat ().format (new Date ());

        final AbstractEvent event = AbstractEvent.getInstance (CO_FULLY_PAID_EVENT_ID, services);
        event.setParam ("OwningCourtCode", services.getCourtId ());
        event.setParam ("UserName", services.getUserId ());
        event.setParam ("CONumber", getCoNumber ());
        event.setParam ("EventDate", systemDate);
        event.setParam ("ReceiptDate", systemDate);
        event.setParam ("ServiceDate", systemDate);
        event.setParam ("ProcessStage", "AUTO");

        return event;
    }

    /**
     * Gets the schedule 2 debts.
     *
     * @return the schedule 2 debts
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getSchedule2Debts () throws SystemException, BusinessException
    {
        final Element debtParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (debtParams, "coNumber", getCoNumber ());

        final Element results = services.callService ("ejb/PaymentsServiceLocal", "getSchedule2DebtsLocal2", debtParams)
                .getRootElement ();

        final Element debt = results.getChild ("Debt");

        if (debt == null)
        {
            return null;
        }

        return results;
    }

    /**
     * Sets the schedule 2 debts live.
     *
     * @param debts the new schedule 2 debts live
     * @throws JDOMException the JDOM exception
     */
    private void setSchedule2DebtsLive (final Element debts) throws JDOMException
    {
        final List<Element> debtList = XPath.selectNodes (debts, "/Debts/Debt");
        for (Iterator<Element> it = debtList.iterator (); it.hasNext ();)
        {
            final Element debtElement = (Element) it.next ();
            debtElement.getChild ("Status").setText (Debt.DEBT_LIVE_STATUS);
        }
    }

    /**
     * Updates schedule 2 debts on the database.
     *
     * @param debts JDOM Element representing the debts (see
     *            map_schedule2_debts.xml)
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void commitSchedule2Debts (final Element debts) throws SystemException, BusinessException
    {
        final Element debtParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (debtParams, "debts", (Element) debts.clone ());

        services.callService ("ejb/PaymentsServiceLocal", "updateSchedule2DebtsLocal2", debtParams);
    }

    /**
     * Returns a copy of the underlying CO JDOM Element.
     * 
     * @return JDOM element representing the CO
     */
    public Element toElement ()
    {
        return (Element) co.clone ();
    }

    /**
     * Gets the co number.
     *
     * @return the co number
     */
    public String getCoNumber ()
    {
        return co.getChildTextTrim ("CONumber");
    }

    /**
     * Gets the co type.
     *
     * @return the co type
     */
    public String getCoType ()
    {
        return co.getChildTextTrim ("COType");
    }

    /**
     * Gets the debtor name.
     *
     * @return the debtor name
     */
    public String getDebtorName ()
    {
        return co.getChildTextTrim ("DebtorName");
    }

    /**
     * Gets the status.
     *
     * @return the status
     */
    public String getStatus ()
    {
        return co.getChildTextTrim (STATUS_NODE);
    }

    /**
     * Sets the status.
     *
     * @param status the new status
     */
    private void setStatus (final String status)
    {
        co.getChild (STATUS_NODE).setText (status);
    }

    /**
     * Gets the fee rate.
     *
     * @return the fee rate
     */
    public double getFeeRate ()
    {
        final String rate = co.getChildTextTrim ("FeeRate");
        return rate.length () > 0 ? Double.parseDouble (rate) : 0;
    }

    /**
     * Gets the fee amount.
     *
     * @return the fee amount
     */
    public double getFeeAmount ()
    {
        final String amount = co.getChildTextTrim (FEE_AMOUNT_NODE);
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Sets the fee amount.
     *
     * @param amount the new fee amount
     */
    private void setFeeAmount (double amount)
    {
        if (amount > 0)
        {
            amount = (int) ((amount + 0.005) * 100) / 100D;
            co.getChild (FEE_AMOUNT_NODE).setText (Double.toString (amount));
        }
        else if (amount == 0)
        {
            co.getChild (FEE_AMOUNT_NODE).setText (NULL_STRING);
        }
        else
        {
            throw new IllegalArgumentException ("Negative amounts not allowed, amount = " + amount);
        }
    }

    /**
     * Gets the co amount.
     *
     * @return the co amount
     */
    public double getCoAmount ()
    {
        final String amount = co.getChildTextTrim ("CoAmount");
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Gets the schedule 2 amount.
     *
     * @return the schedule 2 amount
     */
    public double getSchedule2Amount ()
    {
        final String amount = co.getChildTextTrim ("Schedule2Amount");
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Gets the passthrough amount.
     *
     * @return the passthrough amount
     */
    public double getPassthroughAmount ()
    {
        final String amount = co.getChildTextTrim ("PassthroughAmount");
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Checks if is paid.
     *
     * @return true, if is paid
     */
    public boolean isPaid ()
    {
        return getStatus ().equals (CO_PAID_STATUS);
    }

    /**
     * Checks if is live.
     *
     * @return true, if is live
     */
    public boolean isLive ()
    {
        return getStatus ().equals (CO_LIVE_STATUS);
    }

    /**
     * Checks if is ao co.
     *
     * @return true, if is ao co
     */
    public boolean isAoCo ()
    {
        return getCoType ().equals (CO_TYPE_AO);
    }

    /**
     * Checks if is caeo co.
     *
     * @return true, if is caeo co
     */
    public boolean isCaeoCo ()
    {
        return getCoType ().equals (CO_TYPE_CAEO);
    }

}