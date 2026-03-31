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
package uk.gov.dca.caseman.payments_service.java.util.events;

import org.jdom.Element;

import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;

/**
 * The Class Event777.
 *
 * @author Steve Blair
 */
public class Event777 extends AbstractEvent
{

    /**
     * Instantiates a new event 777.
     *
     * @param services the services
     */
    Event777 (final ServiceAdaptor services)
    {
        super ("ejb/CoServiceLocal", "updateCoCaseEventsLocal2", services);
        eventId = 777;
    }

    /**
     * {@inheritDoc}
     */
    void initParams ()
    {
        params.put ("AdminCourtCode", null);
        params.put ("EventDetails", null);
        params.put ("CaseNumber", null);
        params.put ("UserName", null);
        params.put ("ReceiptDate", null);
        params.put ("EventDate", null);
        params.put ("DeletedFlag", "N");
        params.put ("CONumber", null);
        params.put ("PartyRoleCode", null);
        params.put ("CasePartyNumber", null);
        params.put ("DebtSeq", null);
    }

    /**
     * {@inheritDoc}
     */
    void setupParams ()
    {
        // Value not important, just links event to debt element.
        final String DUMMY_SURROGATE_ID = "333";

        paramsElement = new Element ("ds").addContent (new Element ("CoCaseEvents"));
        final Element events = paramsElement.getChild ("CoCaseEvents");

        final Element event = new Element ("CoCaseEvent");
        event.addContent (new Element ("AldDebtSeq").setText ((String) params.get ("DebtSeq")));
        event.addContent (new Element ("AdminCourtCode").setText ((String) params.get ("AdminCourtCode")));
        event.addContent (new Element ("StdEventId").setText (Integer.toString (eventId)));
        event.addContent (new Element ("EventDetails").setText ((String) params.get ("EventDetails")));
        event.addContent (new Element ("CaseNumber").setText ((String) params.get ("CaseNumber")));
        event.addContent (new Element ("DebtSurrogateId").setText (DUMMY_SURROGATE_ID));
        event.addContent (new Element ("DeletedFlag").setText ((String) params.get ("DeletedFlag")));
        event.addContent (new Element ("UserName").setText ((String) params.get ("UserName")));
        event.addContent (new Element ("ReceiptDate").setText ((String) params.get ("ReceiptDate")));
        event.addContent (new Element ("EventDate").setText ((String) params.get ("EventDate")));
        events.addContent (event);

        final Element maintainCo = new Element ("MaintainCO").addContent (new Element ("Debts"));
        paramsElement.addContent (maintainCo);
        maintainCo.addContent (new Element ("CONumber").setText ((String) params.get ("CONumber")));
        final Element debts = maintainCo.getChild ("Debts");

        final Element debt = new Element ("Debt");
        debt.addContent (new Element ("DebtSurrogateId").setText (DUMMY_SURROGATE_ID));
        debt.addContent (new Element ("PartyRoleCode").setText ((String) params.get ("PartyRoleCode")));
        debt.addContent (new Element ("CasePartyNumber").setText ((String) params.get ("CasePartyNumber")));
        debt.addContent (new Element ("DebtSeq").setText ((String) params.get ("DebtSeq")));
        debts.addContent (debt);
    }

    /**
     * {@inheritDoc}
     */
    public boolean exists ()
    {
        return false;
    }

    /**
     * {@inheritDoc}
     */
    public void saveErrorStatus (final boolean isErrored)
    {
        throw new IllegalStateException ("Can't update Event 777s.");
    }

}