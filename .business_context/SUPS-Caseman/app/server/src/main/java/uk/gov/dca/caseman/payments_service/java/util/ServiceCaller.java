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

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.caseman.system_data_service.java.SequenceNumberHelper;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * The Class ServiceCaller.
 */
public final class ServiceCaller implements ServiceAdaptor
{

    /**
     * The cached business process id key.
     */
    private static final String CACHED_BUSINESS_PROCESS_ID_KEY = "cachedBusinessProcessId";

    /** The context. */
    private IComponentContext context;
    
    /** The local service proxy. */
    private SupsLocalServiceProxy2 localServiceProxy = new SupsLocalServiceProxy2 ();
    
    /** The input holder. */
    private ComponentInput inputHolder;
    
    /** The output holder. */
    private ComponentInput outputHolder;

    /**
     * Instantiates a new service caller.
     *
     * @param context the context
     */
    public ServiceCaller (final IComponentContext context)
    {
        this.context = context;
    }

    /**
     * {@inheritDoc}
     */
    public Document callService (final String jndiName, final String methodName, final Element params)
        throws BusinessException, SystemException
    {
        if (inputHolder == null)
        {
            inputHolder = new ComponentInput (context.getInputConverterFactory ());
        }
        if (outputHolder == null)
        {
            outputHolder = new ComponentInput (context.getInputConverterFactory ());
        }

        inputHolder.setData (new Document (params), Document.class);

        localServiceProxy.invoke (jndiName, methodName, context, inputHolder, outputHolder);

        return (Document) outputHolder.getData (Document.class);
    }

    /**
     * {@inheritDoc}
     */
    public void setBusinessProcessId (final String reportId)
    {
        final ComponentContext ctx = (ComponentContext) context;
        final String oldValue = ctx.getSystemItem (IComponentContext.BUSINESS_PROCESS_ID_KEY).toString ();
        ctx.putUserItem (CACHED_BUSINESS_PROCESS_ID_KEY, oldValue);
        ctx.putSystemItem (IComponentContext.BUSINESS_PROCESS_ID_KEY, reportId);
    }

    /**
     * Resets the businessProcessId in the context to the value cached in the
     * user item CACHED_BUSINESS_PROCESS_ID_KEY.
     */
    public void resetBusinessProcessId ()
    {
        final ComponentContext ctx = (ComponentContext) context;
        final Object oldValue = ctx.getUserItem (CACHED_BUSINESS_PROCESS_ID_KEY);
        if (oldValue instanceof String)
        {
            ctx.putSystemItem (IComponentContext.BUSINESS_PROCESS_ID_KEY, oldValue);
        }
    }

    /**
     * {@inheritDoc}
     */
    public String getUserId ()
    {
        final ComponentContext ctx = (ComponentContext) context;
        return ctx.getSystemItem (IComponentContext.USER_ID_KEY).toString ();
    }

    /**
     * {@inheritDoc}
     */
    public String getCourtId ()
    {
        final ComponentContext ctx = (ComponentContext) context;
        return ctx.getSystemItem (IComponentContext.COURT_ID_KEY).toString ();
    }

    /**
     * {@inheritDoc}
     */
    public String getNextSequenceNumber (final String item, final String courtCode)
        throws BusinessException, SystemException
    {
        return SequenceNumberHelper.getNextValueUncommitted (courtCode, item, context);
    }

}
