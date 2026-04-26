/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.Serializable;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueConnectionFactory;
import javax.jms.QueueSender;
import javax.jms.QueueSession;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.JMSUtil;
import uk.gov.dca.db.util.LogUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author Michael Barker
 *
 */
public class QueueHandler extends AbstractDestination
{
    private final static Log log = SUPSLogFactory.getLogger(QueueHandler.class);
    public final static int TEXT_MESSAGE = 1;
    public final static int OBJECT_MESSAGE = 2;
    
    public QueueHandler(String id, String factory, String jndiName, int minPoolSize, int maxPoolSize)
    {
        setId(id);
        setFactory(factory);
        setJndiName(jndiName);
        setMinPoolSize(minPoolSize);
        setMaxPoolSize(maxPoolSize);
    }

    public void send(Serializable payload, int messageType) throws SystemException, BusinessException {
        send(payload, new Properties(), messageType);
    }
    
    
    /**
     * Delivers the message onto a queue.
     * 
     * @see uk.gov.dca.db.async.Destination#send(java.io.Serializable)
     */
    public void send(Serializable payload, Properties p, int messageType) throws SystemException, BusinessException
    {
        QueueConnectionFactory fact = null;
        QueueConnection cn = null;
        Queue q = null;
        
        ServiceLocator sl = ServiceLocator.getInstance();
        fact = (QueueConnectionFactory) sl.get(getFactory());
        q = (Queue) sl.get(getJndiName());
        
        try
        {
            cn = fact.createQueueConnection();
            QueueSession sess = cn.createQueueSession(true, 0);

            cn.start();

            QueueSender qs = sess.createSender(q);     
            
            Message message = null;
            
            switch(messageType){
            
            case TEXT_MESSAGE:
            	message = sess.createTextMessage((String)payload);
            	break;
            case OBJECT_MESSAGE:
            	message = sess.createObjectMessage(payload);
            	break;
            default: 
            	log.error("Unsupported JMS message type");
            }
            
            for (Iterator i = p.entrySet().iterator(); i.hasNext();) {
                Map.Entry entry = (Map.Entry) i.next();
                message.setStringProperty((String) entry.getKey(), (String) entry.getValue());
            }
            
            qs.send(message);
            log.info("Sent mesage to queue: " + q.getQueueName());
        }
        catch (JMSException e)
        {
            LogUtil.logException(log, "Unable to deliver message", e);
            throw new SystemException("Unable to deliver message", e);
        }
        finally
        {
            JMSUtil.quietClose(cn);            
        }
    }
    
    public String toString()
    {
        return "Queue: " + getJndiName();
    }
    
}
