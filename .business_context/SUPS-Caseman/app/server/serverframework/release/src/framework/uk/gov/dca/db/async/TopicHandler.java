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
import javax.jms.Session;
import javax.jms.Topic;
import javax.jms.TopicConnection;
import javax.jms.TopicConnectionFactory;
import javax.jms.TopicPublisher;
import javax.jms.TopicSession;

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
public class TopicHandler extends AbstractDestination
{
    private final static Log log = SUPSLogFactory.getLogger(TopicHandler.class);
    
    public TopicHandler(String id, String factory, String jndiName, int minPoolSize, int maxPoolSize)
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
     * @see uk.gov.dca.db.async.Destination#send(java.io.Serializable)
     */
    public void send(Serializable payload, Properties p, int messageType) throws SystemException
    {
        TopicConnectionFactory fact = null;
        TopicConnection cn = null;
        Topic t = null;
        TopicPublisher ts = null;
        TopicSession sess = null;

        ServiceLocator sl = ServiceLocator.getInstance();
        
        fact = (TopicConnectionFactory) sl.get(getFactory());
        t = (Topic) sl.get(getJndiName());
        
        try
        {
            cn = fact.createTopicConnection();
            sess = cn.createTopicSession(false, Session.AUTO_ACKNOWLEDGE);
            cn.start();
            
            ts = sess.createPublisher(t);
            Message message = sess.createObjectMessage(payload);

            for (Iterator i = p.entrySet().iterator(); i.hasNext();) {
                Map.Entry entry = (Map.Entry) i.next();
                message.setStringProperty((String) entry.getKey(), (String) entry.getValue());
            }            
            
            ts.publish(message);
            log.info("Sent mesage to topic: " + t.getTopicName());            
        }
        catch (JMSException e)
        {
            LogUtil.logException(log, "Unable to deliver message", e);
            throw new SystemException("Unable to deliver message", e);
        }
        finally
        {
            JMSUtil.quietClose(ts);
            JMSUtil.quietStop(cn);
            JMSUtil.quietClose(sess);
            JMSUtil.quietClose(cn);                        
        }
        
    }

    public String toString()
    {
        return "Topic: " + getJndiName();
    }

}
