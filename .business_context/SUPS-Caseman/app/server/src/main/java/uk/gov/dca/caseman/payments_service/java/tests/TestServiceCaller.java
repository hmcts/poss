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

import junit.framework.TestCase;
import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
import uk.gov.dca.caseman.payments_service.java.util.ServiceCaller;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * The Class TestServiceCaller.
 */
public class TestServiceCaller extends TestCase
{

    /** The services. */
    private ServiceAdaptor services;
    
    /** The context. */
    private ComponentContext context;

    /**
     * {@inheritDoc}
     */
    protected void setUp () throws Exception
    {
        super.setUp ();
        context = new ComponentContext ();
        context.putSystemItem (IComponentContext.BUSINESS_PROCESS_ID_KEY, "asd");
        context.putSystemItem (IComponentContext.USER_ID_KEY, "anonymous");
        context.putSystemItem (IComponentContext.COURT_ID_KEY, "367");
        services = new ServiceCaller (context);
    }

    /**
     * Test set business process id.
     */
    public void testSetBusinessProcessId ()
    {
        services.setBusinessProcessId ("zxc");
        assertEquals ("asd", context.getUserItem ("cachedBusinessProcessId"));
        assertEquals ("zxc", context.getSystemItem (IComponentContext.BUSINESS_PROCESS_ID_KEY));
    }

    /**
     * Test null business process id.
     */
    public void testNullBusinessProcessId ()
    {
        services.setBusinessProcessId (null);
        assertEquals ("asd", context.getUserItem ("cachedBusinessProcessId"));
        assertEquals (null, context.getSystemItem (IComponentContext.BUSINESS_PROCESS_ID_KEY));
    }

    /**
     * Test reset business process id.
     */
    public void testResetBusinessProcessId ()
    {
        services.setBusinessProcessId ("zxc");
        services.resetBusinessProcessId ();
        assertEquals ("asd", context.getUserItem ("cachedBusinessProcessId"));
        assertEquals ("asd", context.getSystemItem (IComponentContext.BUSINESS_PROCESS_ID_KEY));
    }

    /**
     * Test get user id.
     */
    public void testGetUserId ()
    {
        assertEquals ("anonymous", services.getUserId ());
    }

    /**
     * Test get court id.
     */
    public void testGetCourtId ()
    {
        assertEquals ("367", services.getCourtId ());
    }

    /**
     * The main method.
     *
     * @param args the arguments
     */
    public static void main (final String[] args)
    {
        junit.textui.TestRunner.run (TestServiceCaller.class);
    }

}
