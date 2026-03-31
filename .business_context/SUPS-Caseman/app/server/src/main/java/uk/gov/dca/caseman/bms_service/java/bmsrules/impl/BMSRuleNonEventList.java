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
package uk.gov.dca.caseman.bms_service.java.bmsrules.impl;

import java.util.Iterator;
import java.util.TreeMap;

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRuleNonEvent;

/**
 * Created on 11-May-2005.
 *
 * @author Amjad Khan
 *         We have utilised a treemap to order a set of BMS rules non events and to ensure there are unique
 *         we use the overridden hashcode method of BMS Rules, this prevents duplicate BMS Rule objects
 *         being added and more importantly the equals method can be easily implemented.
 */
public class BMSRuleNonEventList extends TreeMap<IBMSRuleNonEvent, IBMSRuleNonEvent>
{

    /** The Constant serialVersionUID. */
    private static final long serialVersionUID = -2479143000061671589L;
    
    /** The Constant NEWLINE. */
    private static final String NEWLINE = "\n";
    
    /** The Constant EMPTY_STRING. */
    private static final String EMPTY_STRING = "\nNO BMS RULES NON EVENTS IN LIST";

    /**
     * Constructor.
     */
    public BMSRuleNonEventList ()
    {
        super ();
    }

    /**
     * Puts bms rule non event into list.
     * 
     * @param oBR The bms rule none event object
     * @param o The object
     */
    public void put (final IBMSRuleNonEvent oBR, final Object o)
    {
        add (oBR);
    }

    /**
     * Adds bms rule none event to list.
     * 
     * @param o The bms rule none event object
     */
    public void add (final IBMSRuleNonEvent o)
    {
        // Using this notation any BMS Rules Cannot be added twice.
        super.put (o, o);
    }

    /**
     * (non-Javadoc).
     *
     * @param obj the obj
     * @return true, if successful
     * @see java.util.Map#equals(java.lang.Object)
     */
    public boolean equals (final Object obj)
    {

        if (obj == this)
        {
            return true;
        }
        else if ( !(obj instanceof BMSRuleNonEventList))
        {
            return false;
        }

        final BMSRuleNonEventList objRule = (BMSRuleNonEventList) obj;
        // Check Size
        if (size () != objRule.size ())
        {
            return false;
        }

        // If size matches then loop through to check objects are equal, since we are using
        // a Tree Map all objects will be ordered
        int matchCount = 0;
        final Iterator<IBMSRuleNonEvent> it = values ().iterator ();

        while (it.hasNext ())
        {
            final BMSRuleNonEvent bmsLocalRule = (BMSRuleNonEvent) it.next ();
            final Iterator<IBMSRuleNonEvent> itCompare = objRule.values ().iterator ();
            while (itCompare.hasNext ())
            {
                final BMSRuleNonEvent bmsCompareRule = (BMSRuleNonEvent) itCompare.next ();
                if (bmsLocalRule.equals (bmsCompareRule))
                {
                    matchCount++;
                }
            }
        }

        if (matchCount != size ())
        {
            return false;
        }

        return true;
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @see java.util.AbstractMap#toString()
     */
    public String toString ()
    {
        final StringBuffer buf = new StringBuffer ();
        final Iterator<IBMSRuleNonEvent> it = values ().iterator ();
        while (it.hasNext ())
        {
            buf.append (((BMSRuleNonEvent) it.next ()).toString ());
            buf.append (NEWLINE);
        }
        if (buf.length () == 0)
        {
            return EMPTY_STRING;
        }
        return buf.toString ();
    }

}
