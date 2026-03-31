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
package uk.gov.dca.caseman.payments_service.java.tests;

import java.util.Set;

import junit.framework.TestCase;
import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
import uk.gov.dca.caseman.payments_service.java.util.ServiceCaller;
import uk.gov.dca.caseman.payments_service.java.util.events.AbstractEvent;
import uk.gov.dca.caseman.payments_service.java.util.events.NullEvent;
import uk.gov.dca.db.pipeline.ComponentContext;

/**
 * The Class TestEvent.
 */
public class TestEvent extends TestCase
{

    /** The event. */
    private AbstractEvent event;
    
    /** The adaptor. */
    private ServiceAdaptor adaptor;

    /**
     * {@inheritDoc}
     */
    protected void setUp () throws Exception
    {
        super.setUp ();
        adaptor = new ServiceCaller (new ComponentContext ());
        event = AbstractEvent.getInstance (99999, adaptor);
    }

    /**
     * Test null event.
     *
     * @throws Exception the exception
     */
    public void testNullEvent () throws Exception
    {
        assertTrue ("event99999 is NullEvent", event instanceof NullEvent);
        assertTrue ("event-1 is NullEvent", AbstractEvent.getInstance ( -1, adaptor) instanceof NullEvent);
    }

    /**
     * Test params.
     */
    public void testParams ()
    {
        final Set<String> params = event.getParams ();
        assertEquals (0, params.size ());
        try
        {
            params.add ("alsdkj");
            fail ("should have thrown an UnsupportedOperationException");
        }
        catch (final UnsupportedOperationException e)
        {
        }
    }

    /**
     * Test null service adaptor.
     */
    public void testNullServiceAdaptor ()
    {
        try
        {
            AbstractEvent.getInstance (777, null);
            fail ("should have thrown a NullPointerException");
        }
        catch (final NullPointerException e)
        {
        }
    }

    /**
     * The main method.
     *
     * @param args the arguments
     */
    public static void main (final String[] args)
    {
        junit.textui.TestRunner.run (TestEvent.class);
    }

}