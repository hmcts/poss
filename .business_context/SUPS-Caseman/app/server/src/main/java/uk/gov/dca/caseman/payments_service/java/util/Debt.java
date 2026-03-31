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

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.payments_service.java.util.events.AbstractEvent;
import uk.gov.dca.caseman.payments_service.java.util.events.NullEvent;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class Debt.
 *
 * @author Steve Blair
 */
public class Debt
{

    /** The Constant STATUS_NODE. */
    private static final String STATUS_NODE = "Status";

    /** The Constant DEBT_PAID_STATUS. */
    static final String DEBT_PAID_STATUS = "PAID";
    
    /** The Constant DEBT_LIVE_STATUS. */
    static final String DEBT_LIVE_STATUS = "LIVE";

    /** The Constant DEBT_FULLY_PAID_CO_EVENT_ID. */
    private static final int DEBT_FULLY_PAID_CO_EVENT_ID = 976;
    
    /** The Constant DEBT_FULLY_PAID_CASE_EVENT_ID. */
    private static final int DEBT_FULLY_PAID_CASE_EVENT_ID = 777;

    /** The debt. */
    Element debt;
    
    /** The services. */
    private ServiceAdaptor services;
    
    /** The co. */
    private ConsolidatedOrder co;
    
    /** The cached status. */
    private String cachedStatus;

    /**
     * Construct a Debt object based upon a JDOM Element conforming to the
     * structure of get_passthrough_debt.xml. Clients should only be
     * manipulating existing debts so should use getDebt() factory method.
     * 
     * @param co the CO the debt belongs to
     * @param debt JDOM element representing the debt
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @throws IllegalArgumentException if the Debt Element is not properly
     *             formatted
     */
    Debt (final ConsolidatedOrder co, final Element debt, final ServiceAdaptor services)
    {
        if ( !debt.getName ().equals ("Debt"))
        {
            throw new IllegalArgumentException ("Improperly formed Debt Element passed to Debt " + "constructor.");
        }

        this.debt = debt;
        this.services = services;
        this.co = co;
        cachedStatus = getStatus ();
    }

    /**
     * Updates or fires all events associated with the debt depending on the
     * current status of the debt and the existence of events on the database.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    public void updateEvents () throws BusinessException, SystemException, JDOMException
    {
        for (Iterator<AbstractEvent> i = getEvents ().iterator (); i.hasNext ();)
        {
            processEvent ((AbstractEvent) i.next ());
        }
    }

    /**
     * Uses the current status of the debt to either update the error status of
     * an event on the database or fire a new event if one doesn't currently
     * exist.
     *
     * @param event the Event to update/fire
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private void processEvent (final AbstractEvent event) throws BusinessException, SystemException, JDOMException
    {
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
        else
        {
            event.fire ();
        }
    }

    /**
     * Sets the status field of the debt depending upon the current balance.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    public void updateStatus () throws BusinessException, SystemException, JDOMException
    {
        final double balance = getDebtBalance ();

        if (balance > 0 && isPaid ())
        {
            setStatus (DEBT_LIVE_STATUS);
        }
        else if (balance == 0 && !isPaid ())
        {
            setStatus (DEBT_PAID_STATUS);
        }
    }

    /**
     * Checks if the status of the debt differs from the status when it was
     * constructed.
     * 
     * @return true if the status has changed
     */
    public boolean hasStatusChanged ()
    {
        return !getStatus ().equals (cachedStatus);
    }

    /**
     * Gets the debt balance.
     *
     * @return the debt balance
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    public double getDebtBalance () throws BusinessException, SystemException, JDOMException
    {
        final double debtBalance = getAmount () - getDebtPaidToDate ();
        final DecimalFormat df = new DecimalFormat ("#########0.00");
        final double balance = Double.parseDouble (df.format (debtBalance));

        if (balance < 0)
        {
            final String errorMessage =
                    "Overpayments not allowed. Debt " + getDebtSeq () + " balance = " + balance + ".";
            throw new IllegalStateException (errorMessage);
        }

        return balance;
    }

    /**
     * Gets the debt paid to date.
     *
     * @return the debt paid to date
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public double getDebtPaidToDate () throws SystemException, BusinessException, JDOMException
    {
        final Element debtParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (debtParams, "debtSeq", getDebtSeq ());

        final Document debtDoc = services.callService ("ejb/PaymentsServiceLocal", "getDebtBalanceLocal2", debtParams);
        final Element total = (Element) XPath.selectSingleNode (debtDoc, "/ds/Debt/TOTAL");

        return Double.parseDouble (total.getText ());
    }

    /**
     * Gets the events.
     *
     * @return the events
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public List<AbstractEvent> getEvents () throws SystemException, BusinessException, JDOMException
    {
        final List<AbstractEvent> events = new ArrayList<>();
        events.add (getStatusChangedEvent ());
        events.add (getFullyPaidEvent ());
        return events;
    }

    /**
     * Gets the status changed event.
     *
     * @return the status changed event
     */
    public AbstractEvent getStatusChangedEvent ()
    {
        if ( !co.isAoCo () || getCaseNumber ().length () == 0)
        {
            return new NullEvent ();
        }

        final String systemDate = Payment.getSupsDateFormat ().format (new Date ());

        final StringBuffer description = new StringBuffer (co.getDebtorName ());
        description.append (" - CO DEBT ");
        description.append (getStatus ());

        final AbstractEvent event = AbstractEvent.getInstance (DEBT_FULLY_PAID_CASE_EVENT_ID, services);
        event.setParam ("AdminCourtCode", services.getCourtId ());
        event.setParam ("EventDetails", description.toString ());
        event.setParam ("CaseNumber", getCaseNumber ());
        event.setParam ("UserName", services.getUserId ());
        event.setParam ("ReceiptDate", systemDate);
        event.setParam ("EventDate", systemDate);
        event.setParam ("CONumber", co.getCoNumber ());
        event.setParam ("PartyRoleCode", getDefendantPartyRoleCode ());
        event.setParam ("CasePartyNumber", getDefendantCasePartyNumber ());
        event.setParam ("DebtSeq", getDebtSeq ());

        return event;
    }

    /**
     * Gets the fully paid event.
     *
     * @return the fully paid event
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public AbstractEvent getFullyPaidEvent () throws SystemException, BusinessException, JDOMException
    {
        final String systemDate = Payment.getSupsDateFormat ().format (new Date ());

        final AbstractEvent event = AbstractEvent.getInstance (DEBT_FULLY_PAID_CO_EVENT_ID, services);
        event.setParam ("OwningCourtCode", services.getCourtId ());
        event.setParam ("UserName", services.getUserId ());
        event.setParam ("CONumber", co.getCoNumber ());
        event.setParam ("EventDate", systemDate);
        event.setParam ("ReceiptDate", systemDate);
        event.setParam ("ServiceDate", systemDate);
        event.setParam ("DebtSeqNumber", getDebtSeq ());

        if ( !event.exists () && !isPaid ())
        {
            return new NullEvent ();
        }

        return event;
    }

    /**
     * Saves the debt status to the database.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public void save () throws SystemException, BusinessException
    {
        Element debtParams = XMLBuilder.getNewParamsElement ();
        debtParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (debtParams, "debtSeq", getDebtSeq ());
        XMLBuilder.addParam (debtParams, "debtStatus", getStatus ());

        final Document results =
                services.callService ("ejb/PaymentsServiceLocal", "updatePassthroughDebtLocal2", debtParams);
        debt = results.getRootElement ();
    }

    /**
     * Returns a copy of the underlying Debt JDOM Element.
     * 
     * @return JDOM element representing the Debt
     */
    public Element toElement ()
    {
        return (Element) debt.clone ();
    }

    /**
     * Gets the debt seq.
     *
     * @return the debt seq
     */
    public String getDebtSeq ()
    {
        return debt.getChildTextTrim ("DebtSeq");
    }

    /**
     * Gets the status.
     *
     * @return the status
     */
    public String getStatus ()
    {
        return debt.getChildTextTrim (STATUS_NODE);
    }

    /**
     * Sets the status.
     *
     * @param status the new status
     */
    private void setStatus (final String status)
    {
        debt.getChild (STATUS_NODE).setText (status);
    }

    /**
     * Gets the defendant party role code.
     *
     * @return the defendant party role code
     */
    public String getDefendantPartyRoleCode ()
    {
        return debt.getChildTextTrim ("DefendantPartyRoleCode");
    }

    /**
     * Gets the defendant case party number.
     *
     * @return the defendant case party number
     */
    public String getDefendantCasePartyNumber ()
    {
        return debt.getChildTextTrim ("DefendantCasePartyNumber");
    }

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public String getCaseNumber ()
    {
        return debt.getChildTextTrim ("CaseNumber");
    }

    /**
     * Gets the amount.
     *
     * @return the amount
     */
    public double getAmount ()
    {
        final String amount = debt.getChildTextTrim ("Amount");
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Gets the original debt amount.
     *
     * @return the original debt amount
     */
    public double getOriginalDebtAmount ()
    {
        final String amount = debt.getChildTextTrim ("OriginalDebt");
        return amount.length () > 0 ? Double.parseDouble (amount) : 0;
    }

    /**
     * Sets the paid.
     */
    void setPaid ()
    {
        setStatus (DEBT_PAID_STATUS);
    }

    /**
     * Checks if is paid.
     *
     * @return true, if is paid
     */
    public boolean isPaid ()
    {
        return getStatus ().equals (DEBT_PAID_STATUS);
    }

    /**
     * Sets the live.
     */
    void setLive ()
    {
        setStatus (DEBT_LIVE_STATUS);
    }

    /**
     * Checks if is live.
     *
     * @return true, if is live
     */
    public boolean isLive ()
    {
        return getStatus ().equals (DEBT_LIVE_STATUS);
    }

}