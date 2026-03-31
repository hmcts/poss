/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.async;

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
import javax.sql.DataSource;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.command.Command;
import uk.gov.dca.db.impl.command.CommandRouter;
import uk.gov.dca.db.pipeline.CallStack;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.LogUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Message Driven Bean used to process aysnchronous method requests.
 * 
 * @author Michael Barker
 *
 */
public class AsyncProcessorMDB implements MessageDrivenBean, MessageListener
{
    private static final long serialVersionUID = 3072053760013495436L;
    private MessageDrivenContext ctx;
    private static Log log = SUPSLogFactory.getLogger(AsyncProcessorMDB.class);
    private DataSource ds;
    private AsyncCommandManager acMgr;
    private final CommandRouter cmdRouter = new CommandRouter();

    public void ejbCreate()
    {
        try
        {
            InitialContext ic = new InitialContext();
            Object o = ic.lookup("java:comp/env/" + SupsConstants.SUPS_CONFIG_PARAM);
            String configName = (String) o;
            ConfigUtil cu = ConfigUtil.create(configName);
            ds = (DataSource) cu.get(AsyncCommand.ASYNC_DS);
            acMgr = new AsyncCommandManager(ds);
        }
        catch (Exception e)
        {
            LogUtil.logException(log, "Unable to create AsyncProcessorMDB.", e);
            throw new RuntimeException("Unable to create AsyncProcessorMDB");
        }
    }
    
    /**
     * @see javax.ejb.MessageDrivenBean#setMessageDrivenContext(javax.ejb.MessageDrivenContext)
     */
    public void setMessageDrivenContext(MessageDrivenContext ctx)
            throws EJBException
    {
        this.ctx = ctx;
    }

    /**
     * @see javax.ejb.MessageDrivenBean#ejbRemove()
     */
    public void ejbRemove() throws EJBException
    {
    }

    /**
     * @see javax.jms.MessageListener#onMessage(javax.jms.Message)
     */
    public void onMessage(Message msg)
    {
        if (msg instanceof ObjectMessage)
        {
            log.debug("Processing message");
            AsyncCommand cmd = null;
            ObjectMessage omsg = (ObjectMessage) msg;
            try
            {
                String newTxStr = omsg.getStringProperty(AsyncCommand.NEW_TX);
                // By default we create a new transaction
                boolean newTx = newTxStr != null ? Boolean.valueOf(newTxStr).booleanValue() : true;
                cmd = (AsyncCommand) omsg.getObject();
                
                if (cmd != null)
                {
                    try
                    {
                        // Due to the inital context setup we need to lookup the bean
                        // instance here.
                        ServiceLocator locator = ServiceLocator.getInstance();
                        String jndiName = "ejb/" + cmd.getServiceName() + "ServiceLocal";
                        Object home = locator.get(jndiName);
                        ExecuteCommand eCmd = new ExecuteCommand(jndiName, home, acMgr, cmd);
                        if (newTx)
                        {
                            cmdRouter.route(eCmd);                            
                        }
                        else
                        {
                            eCmd.execute();
                        }
                        log.info("Processed service: " + cmd.getServiceName() + " method: " + cmd.getMethodName() + " is " + cmd.getTimeTaken() + "ms.");
                    } 
                    catch (BusinessException e)
                    {
                        handleBusinessExecption(cmd, e.getMessage());
                    }
                    catch (SystemException e)
                    {
                        handleSystemException(cmd, e.getMessage());
                    }
                }
                else
                {
                    throw new JMSException("Command object is null");                    
                }
            }
            catch (JMSException e)
            {
                log.error("Unable to get command from JMS messsage", e);
            }
        }
        else
        {
            log.error("Message is of wrong type");
        }
    }
    
    /**
     * Handles a System Exception by reporting it back to the user.
     * 
     * @param cmd
     * @param message
     */
    public void handleSystemException(AsyncCommand cmd, String message)
    {
        try
        {
            ExceptionHolder eh = new ExceptionHolder(SystemException.class, message);
            cmd.setResponse(eh.getXML());
            cmd.setState(AsyncCommand.State.ERROR);
            acMgr.save(cmd);
        }
        catch (SQLException e)
        {
            log.error("Unable to report exception to user, rolling back message");
            ctx.setRollbackOnly();
        }
    }

    
    /**
     * Handles a Business Exception by reporting it back to the user.
     * 
     * @param cmd
     * @param message
     */
    public void handleBusinessExecption(AsyncCommand cmd, String message)
    {
        try
        {
            if (cmd != null)
            {
                ExceptionHolder eh = new ExceptionHolder(BusinessException.class, message);
                cmd.setResponse(eh.getXML());
                cmd.setState(AsyncCommand.State.ERROR);
                acMgr.save(cmd);
            }
            else
            {
                log.warn("Supplied Command is null, discarding message");
            }
        }
        catch (SQLException e)
        {
            handleSystemException(cmd, e.getMessage());
        }
    }

    /**
     * Encapsulte the exceution of the service into a command object for processing
     * within a seperate transaction.
     * 
     */
    public static class ExecuteCommand implements Command
    {
        private static final long serialVersionUID = 8018831943122333658L;
        private AsyncCommand cmd;
        private AsyncCommandManager acMgr;
        private Object home;
        private String jndiName;

        public ExecuteCommand(String jndiName, Object home, AsyncCommandManager acMgr, AsyncCommand cmd)
        {
            this.jndiName = jndiName;
            this.home = home;
            this.acMgr = acMgr;
            this.cmd = cmd;
        }

        public void execute() throws BusinessException, SystemException
        {
            String methodName = null;
            try
            {
                if (acMgr.getState(cmd.getId()) != AsyncCommand.State.CANCELLED)
                {
                    // Set up the context.
                    CallStack cs = CallStack.getInstance();
                    // Place holder context for the async call.
                    cs.push("Async", "async", (String) null);
                    ComponentContext context = cs.peek();
                    context.putSystemItem(IComponentContext.USER_ID_KEY, cmd.getUserId());
                    context.putSystemItem(IComponentContext.COURT_ID_KEY, cmd.getCourtId());
                    context.putSystemItem(IComponentContext.BUSINESS_PROCESS_ID_KEY, "async");
                    
                    Method createMethod = home.getClass().getMethod("create", new Class[0]);
                    Object bean = createMethod.invoke(home, new Object[0]);
                    methodName = cmd.getMethodName() + "Local";
                    Method bizMethod = bean.getClass().getMethod(methodName, new Class[] { String.class, Writer.class });
                    StringWriter writer = new StringWriter();
                    Object[] params = new Object[2];
                    params[0] = cmd.getRequest();
                    params[1] = writer;
                    long t0 = System.currentTimeMillis();
                    bizMethod.invoke(bean, params);
                    String response = writer.toString();
                    if ( response.startsWith("<?xml") )
                    {
                    	response = response.substring( response.indexOf("?>\r\n")+4, response.length() );
                    }
                    long t1 = System.currentTimeMillis();
                    cmd.setResponse(response);
                    cmd.complete();
                    cmd.setTimeTaken(t1 - t0);
                    acMgr.save(cmd);                    
                }
            }
            catch (SQLException e)
            {
                throw new SystemException(e);
            }
            catch (IllegalArgumentException e)
            {
                throw new SystemException(e);
            }
            catch (IllegalAccessException e)
            {
                throw new SystemException(e);
            }
            catch (InvocationTargetException e)
            {
	       		Throwable cause = e.getCause();
	    		
	    		if ( cause != null && BusinessException.class.getName().compareTo(cause.getClass().getName()) == 0 ) 
	    		{
	        		throw (BusinessException)cause;
	    		}
	    		if ( cause != null && SystemException.class.getName().compareTo(cause.getClass().getName()) == 0 ) 
	    		{
	        		throw (SystemException)cause;
	    		}
	    		
	    		throw new SystemException("Failed to invoke local service method '"+jndiName+"."+methodName+"'",e);
            }
            catch (SecurityException e)
            {
                throw new SystemException(e);
            }
            catch (NoSuchMethodException e)
            {
                throw new SystemException(e);
            }
        }
       
    }
    
}
