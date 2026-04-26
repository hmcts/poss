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
package uk.gov.dca.caseman.caseman_mdbs.classes;

import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.SQLException;

import javax.ejb.EJBException;
import javax.ejb.MessageDrivenBean;
import javax.ejb.MessageDrivenContext;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.async.AsyncCommand;
import uk.gov.dca.db.async.AsyncCommandManager;
import uk.gov.dca.db.async.ExceptionHolder;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ServiceLocatorException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.command.Command;
import uk.gov.dca.db.pipeline.CallStack;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.LogUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 12-Apr-2006
 * 
 * Message Driven Bean used to process aysnchronous method requests.
 * 
 * Change History:
 * 13-Jun-2006 Phil Haferer: Refactor of exception handling in ejbCreate() and onMessage(). Defect 2689.
 * 
 * @author Anoop Sehdev
 *
 */
public class CaseManMDB implements MessageDrivenBean, MessageListener
{
    
    /** The Constant serialVersionUID. */
    private static final long serialVersionUID = 3072053760013495436L;
    
    /** The ctx. */
    private MessageDrivenContext ctx;
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (CaseManMDB.class);
    
    /** The ds. */
    private DataSource ds;
    
    /** The ac mgr. */
    private AsyncCommandManager acMgr;

    /**
     * Create ebj instance.
     */
    public void ejbCreate ()
    {
        try
        {
            log.trace ("Creating CaseManMDB...");
            final InitialContext ic = new InitialContext ();
            final Object o = ic.lookup ("java:comp/env/" + SupsConstants.SUPS_CONFIG_PARAM);
            final String configName = (String) o;
            final ConfigUtil cu = ConfigUtil.create (configName);
            ds = (DataSource) cu.get (AsyncCommand.ASYNC_DS);
            acMgr = new AsyncCommandManager (ds);
            log.trace ("CaseManMDB Created.");
        }
        catch (final NamingException e)
        {
            LogUtil.logException (log, "NamingException: Unable to create CaseManMDB.", e);
            throw new RuntimeException ("NamingException: Unable to create CaseManMDB", e);
        }
        catch (final SystemException e)
        {
            LogUtil.logException (log, "SystemException: Unable to create CaseManMDB.", e);
            throw new RuntimeException ("SystemException: Unable to create CaseManMDB", e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public void setMessageDrivenContext (final MessageDrivenContext ctx) throws EJBException
    {
        this.ctx = ctx;
    }

    /**
     * Ejb remove.
     *
     * @throws EJBException the EJB exception
     * @see javax.ejb.MessageDrivenBean#ejbRemove()
     */
    public void ejbRemove () throws EJBException
    {
    }

    /**
     * On message.
     *
     * @param msg the msg
     * @see javax.jms.MessageListener#onMessage(javax.jms.Message)
     */
    public void onMessage (final Message msg)
    {
        if (msg instanceof ObjectMessage)
        {
            log.debug ("Processing Asynchronous Message...");
            AsyncCommand cmd = null;
            final ObjectMessage omsg = (ObjectMessage) msg;
            try
            {
                cmd = (AsyncCommand) omsg.getObject ();

                if (cmd != null)
                {
                    try
                    {
                        // Due to the inital context setup we need to lookup the bean
                        // instance here.
                        log.trace ("Processing Asynchronous Service: " + cmd.getServiceName () + ", method: " +
                                cmd.getMethodName ());
                        final ServiceLocator locator = ServiceLocator.getInstance ();
                        final String jndiName = "ejb/" + cmd.getServiceName () + "ServiceLocal";
                        final Object home = locator.get (jndiName);
                        final ExecuteCommand eCmd = new ExecuteCommand (jndiName, home, acMgr, cmd);
                        // cmdRouter.route(eCmd);
                        eCmd.execute ();
                        log.trace ("Processed Asynchronous Service: " + cmd.getServiceName () + " method: " +
                                cmd.getMethodName () + " is " + cmd.getTimeTaken () + "ms.");
                    }
                    catch (final ServiceLocatorException e)
                    {
                        LogUtil.logException (log, "ServiceLocatorException while calling service Asynchronously", e);
                        handleBusinessExecption (cmd, e.getMessage ());
                    }
                    catch (final BusinessException e)
                    {
                        LogUtil.logException (log, "BusinessException while calling service Asynchronously", e);
                        handleBusinessExecption (cmd, e.getMessage ());
                    }
                    catch (final SystemException e)
                    {
                        LogUtil.logException (log, "SystemException while calling service Asynchronously", e);
                        handleSystemException (cmd, e.getMessage ());
                    }
                    catch (final RuntimeException e)
                    {
                        LogUtil.logException (log, "RuntimeException while calling service Asynchronously", e);
                        handleSystemException (cmd, e.getMessage ());
                    }
                    catch (final Throwable e)
                    {
                        String errMsg = e.getMessage ();
                        if (errMsg == null)
                        {
                            errMsg = e.toString ();
                        }
                        log.error ("Throwable exception while calling service Asynchronously " +
                                e.getClass ().getName () + ": " + errMsg);
                        handleSystemException (cmd, e.getMessage ());
                    }
                }
                else
                {
                    throw new JMSException ("Command object is null");
                }
            }
            catch (final JMSException e)
            {
                log.error ("Unable to get command from JMS messsage", e);
            }
        }
        else
        {
            log.error ("Message is of wrong type");
        }
    }

    /**
     * Handles a System Exception by reporting it back to the user.
     *
     * @param cmd the cmd
     * @param message the message
     */
    public void handleSystemException (final AsyncCommand cmd, final String message)
    {
        try
        {
            final ExceptionHolder eh = new ExceptionHolder (SystemException.class, message);
            cmd.setResponse (eh.getXML ());
            cmd.setState (AsyncCommand.State.ERROR);
            acMgr.save (cmd);
        }
        catch (final SQLException e)
        {
            log.error ("Unable to report exception to user, rolling back message");
            ctx.setRollbackOnly ();
        }
    }

    /**
     * Handles a Business Exception by reporting it back to the user.
     *
     * @param cmd the cmd
     * @param message the message
     */
    public void handleBusinessExecption (final AsyncCommand cmd, final String message)
    {
        try
        {
            if (cmd != null)
            {
                final ExceptionHolder eh = new ExceptionHolder (BusinessException.class, message);
                cmd.setResponse (eh.getXML ());
                cmd.setState (AsyncCommand.State.ERROR);
                acMgr.save (cmd);
            }
            else
            {
                log.warn ("Supplied Command is null, discarding message");
            }
        }
        catch (final SQLException e)
        {
            handleSystemException (cmd, e.getMessage ());
        }
    }

    /**
     * Encapsulte the execution of the service into a command object for processing.
     */
    public static class ExecuteCommand implements Command
    {
        
        /** The Constant serialVersionUID. */
        private static final long serialVersionUID = 8018831943122333658L;
        
        /** The cmd. */
        private AsyncCommand cmd;
        
        /** The ac mgr. */
        private AsyncCommandManager acMgr;
        
        /** The home. */
        private Object home;
        
        /** The jndi name. */
        private String jndiName;

        /**
         * Execute jndi command.
         * 
         * @param jndiName The jndi name.
         * @param home The home object.
         * @param acMgr The async command manager.
         * @param cmd The async command.
         */
        public ExecuteCommand (final String jndiName, final Object home, final AsyncCommandManager acMgr,
                final AsyncCommand cmd)
        {
            this.jndiName = jndiName;
            this.home = home;
            this.acMgr = acMgr;
            this.cmd = cmd;
        }

        /**
         * (non-Javadoc).
         *
         * @throws BusinessException the business exception
         * @throws SystemException the system exception
         * @see uk.gov.dca.db.impl.command.Command#execute()
         */
        public void execute () throws BusinessException, SystemException
        {
            String methodName = null;
            try
            {
                if (acMgr.getState (cmd.getId ()) != AsyncCommand.State.CANCELLED)
                {
                    // Set up the context.
                    final CallStack cs = CallStack.getInstance ();
                    // Place holder context for the async call.
                    cs.push ("Async", "async", (String) null);
                    final ComponentContext context = cs.peek ();
                    context.putSystemItem (IComponentContext.USER_ID_KEY, cmd.getUserId ());
                    context.putSystemItem (IComponentContext.COURT_ID_KEY, cmd.getCourtId ());
                    context.putSystemItem (IComponentContext.BUSINESS_PROCESS_ID_KEY, "async");

                    final Method createMethod = home.getClass ().getMethod ("create", new Class[0]);
                    final Object bean = createMethod.invoke (home, new Object[0]);
                    methodName = cmd.getMethodName () + "Local";
                    final Method bizMethod =
                            bean.getClass ().getMethod (methodName, new Class[] {String.class, Writer.class});
                    final StringWriter writer = new StringWriter ();
                    final Object[] params = new Object[2];
                    params[0] = cmd.getRequest ();
                    params[1] = writer;
                    final long t0 = System.currentTimeMillis ();
                    bizMethod.invoke (bean, params);
                    String response = writer.toString ();
                    if (response.startsWith ("<?xml"))
                    {
                        response = response.substring (response.indexOf ("?>\r\n") + 4, response.length ());
                    }
                    final long t1 = System.currentTimeMillis ();
                    cmd.setResponse (response);
                    cmd.complete ();
                    cmd.setTimeTaken (t1 - t0);
                    acMgr.save (cmd);
                }
            }
            catch (final SQLException e)
            {
                throw new SystemException (e);
            }
            catch (final IllegalArgumentException e)
            {
                throw new SystemException (e);
            }
            catch (final IllegalAccessException e)
            {
                throw new SystemException (e);
            }
            catch (final InvocationTargetException e)
            {
                final Throwable cause = e.getCause ();

                if (cause != null && BusinessException.class.getName ().compareTo (cause.getClass ().getName ()) == 0)
                {
                    throw (BusinessException) cause;
                }
                if (cause != null && SystemException.class.getName ().compareTo (cause.getClass ().getName ()) == 0)
                {
                    throw (SystemException) cause;
                }

                throw new SystemException (
                        "Failed to invoke local service method '" + jndiName + "." + methodName + "'", e);
            }
            catch (final SecurityException e)
            {
                throw new SystemException (e);
            }
            catch (final NoSuchMethodException e)
            {
                throw new SystemException (e);
            }
        }

    }

}
