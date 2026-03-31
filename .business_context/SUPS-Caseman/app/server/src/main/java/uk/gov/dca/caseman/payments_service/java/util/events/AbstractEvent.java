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

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.jdom.Element;
import org.jdom.JDOMException;

import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class AbstractEvent.
 *
 * @author Steve Blair
 */
public abstract class AbstractEvent
{

    /** The params. */
    Map<String, String> params = new HashMap<String, String> ();
    
    /** The params element. */
    Element paramsElement;
    
    /** The jndi name. */
    private final String jndiName;
    
    /** The method name. */
    private final String methodName;
    
    /** The event id. */
    int eventId;
    
    /** The services. */
    ServiceAdaptor services;

    /**
     * Instantiates a new abstract event.
     *
     * @param jndiName the jndi name
     * @param methodName the method name
     * @param services the services
     */
    AbstractEvent (final String jndiName, final String methodName, final ServiceAdaptor services)
    {
        this.jndiName = jndiName;
        this.methodName = methodName;
        this.services = services;
        initParams ();
    }

    /**
     * Inits the params.
     */
    abstract void initParams ();

    /**
     * Fires the event, the specifics of which depend upon the event in question
     * but usually involves creating database records.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public final void fire () throws SystemException, BusinessException
    {
        setupParams ();
        createEvent ();
    }

    /**
     * Setup params.
     */
    abstract void setupParams ();

    /**
     * Creates the event.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    void createEvent () throws SystemException, BusinessException
    {
        services.callService (jndiName, methodName, paramsElement);
    }

    /**
     * Gets the params.
     *
     * @return the params
     */
    public Set<String> getParams ()
    {
        return Collections.unmodifiableSet (params.keySet ());
    }

    /**
     * Sets a parameter on the event.
     * 
     * @param param the parameter name
     * @param value the parameter value
     * @throws IllegalArgumentException if parameter doesn't exist.
     */
    public void setParam (final String param, final String value)
    {
        if ( !params.containsKey (param))
        {
            throw new IllegalArgumentException ("No such param \"" + param + "\" in Event " + eventId + ".");
        }
        params.put (param, value);
    }

    /**
     * Checks to see if an event exists on the database matching the params of
     * the current event.
     *
     * @return whether an event exists
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public abstract boolean exists () throws SystemException, BusinessException, JDOMException;

    /**
     * Sets the error flag of any event records on the database matching the
     * params of the current event. Should always be preceded with a call to
     * exists() to avoid an IllegalStateException.
     *
     * @param isErrored the new error status
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     * @throws IllegalStateException if no records exist
     */
    public abstract void saveErrorStatus (boolean isErrored) throws SystemException, BusinessException, JDOMException;

    /**
     * Returns a new event of type eventId.
     *
     * @param eventId id of the event type to create
     * @param services the services
     * @return new Event object of type eventId or a NullEvent if no matching
     *         event type found
     */
    public static AbstractEvent getInstance (final int eventId, final ServiceAdaptor services)
    {
        if (services == null)
        {
            throw new NullPointerException ("null ServiceAdaptor passed to Event.getInstance()");
        }

        final AbstractEvent event;
        switch (eventId)
        {
            case 777:
                return new Event777 (services);
            case 975:
                event = new CoEvent (services);
                event.eventId = 975;
                return event;
            case 976:
                event = new CoEvent (services);
                event.eventId = 976;
                return event;
            default:
                return new NullEvent ();
        }
    }

}