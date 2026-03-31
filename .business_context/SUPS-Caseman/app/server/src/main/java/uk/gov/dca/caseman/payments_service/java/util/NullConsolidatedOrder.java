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

import uk.gov.dca.caseman.payments_service.java.util.events.AbstractEvent;
import uk.gov.dca.caseman.payments_service.java.util.events.NullEvent;

/**
 * The Class NullConsolidatedOrder.
 */
public class NullConsolidatedOrder extends ConsolidatedOrder
{

    /**
     * Instantiates a new null consolidated order.
     */
    NullConsolidatedOrder ()
    {
        super (new Element ("Co"), null);

        co.addContent (new Element ("CONumber"));
        co.addContent (new Element ("COType"));
        co.addContent (new Element ("DebtorName"));
        co.addContent (new Element ("Status"));
        co.addContent (new Element ("FeeRate"));
        co.addContent (new Element ("FeeAmount"));
        co.addContent (new Element ("CoAmount"));
        co.addContent (new Element ("Schedule2Amount"));
        co.addContent (new Element ("PassthroughAmount"));
    }

    /**
     * {@inheritDoc}
     */
    public Debt getDebt (final String debtSeq)
    {
        return new NullDebt ();
    }

    /**
     * {@inheritDoc}
     */
    public void save ()
    {
        // No op.
    }

    /**
     * Refresh co.
     */
    public void refreshCo ()
    {
        // No op.
    }

    /**
     * {@inheritDoc}
     */
    public double getCoBalance (final String[] debtTypes)
    {
        return 0;
    }

    /**
     * {@inheritDoc}
     */
    public void updateStatus ()
    {
        // No op.
    }

    /**
     * {@inheritDoc}
     */
    public boolean hasStatusChanged ()
    {
        return false;
    }

    /**
     * {@inheritDoc}
     */
    public void updateEvents ()
    {
        // No op.
    }

    /**
     * {@inheritDoc}
     */
    public AbstractEvent getFullyPaidEvent ()
    {
        return new NullEvent ();
    }

}
