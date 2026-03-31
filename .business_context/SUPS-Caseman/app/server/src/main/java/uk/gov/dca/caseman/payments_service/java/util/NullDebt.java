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

import java.util.ArrayList;
import java.util.List;

import org.jdom.Element;

import uk.gov.dca.caseman.payments_service.java.util.events.AbstractEvent;
import uk.gov.dca.caseman.payments_service.java.util.events.NullEvent;

/**
 * The Class NullDebt.
 */
public class NullDebt extends Debt
{

    /**
     * Instantiates a new null debt.
     */
    NullDebt ()
    {
        super (null, new Element ("Debt"), null);

        debt.addContent (new Element ("DebtSeq"));
        debt.addContent (new Element ("Amount"));
        debt.addContent (new Element ("Status"));
        debt.addContent (new Element ("DefendantPartyRoleCode"));
        debt.addContent (new Element ("DefendantCasePartyNumber"));
        debt.addContent (new Element ("OriginalDebt"));
        debt.addContent (new Element ("CaseNumber"));
    }

    /**
     * {@inheritDoc}
     */
    public double getDebtBalance ()
    {
        return 0;
    }

    /**
     * {@inheritDoc}
     */
    public double getDebtPaidToDate ()
    {
        return 0;
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
    void setPaid ()
    {
        // No op.
    }

    /**
     * {@inheritDoc}
     */
    void setLive ()
    {
        // No op.
    }

    /**
     * {@inheritDoc}
     */
    public AbstractEvent getStatusChangedEvent ()
    {
        return new NullEvent ();
    }

    /**
     * {@inheritDoc}
     */
    public AbstractEvent getFullyPaidEvent ()
    {
        return new NullEvent ();
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
    public void updateEvents ()
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
    public List<AbstractEvent> getEvents ()
    {
        return new ArrayList<AbstractEvent> ();
    }

}
