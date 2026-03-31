/*
 * Created on 03-May-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.jms.Queue;
import javax.jms.Topic;

import org.apache.tools.ant.BuildException;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

/**
 * @author Michael Barker
 *
 */
public class JBossDescriptorSubTask extends DescriptorSubTask 
{
    public final static String EJB_NAME = "ejb-name";
    public final static String CONFIGURATION_NAME = "configuration-name";
    public final static String CONFIGURATION_NAME_VALUE = "Standard Message Driven Bean";
    public final static String DESTIONATION_JNDI_NAME = "destination-jndi-name";
    public final static String MESSAGE_DRIVEN = "message-driven";
    
    public JBossDescriptorSubTask()
    {
        super();
    }
    
    /**
     * @see uk.gov.dca.db.async.DescriptorSubTask#process(java.io.File, java.lang.String, java.util.List)
     */
    public void process(File projectConfig, String packageName, List serviceMetaData) throws BuildException 
    {
        checkFiles();
        
        try
        {
            List queues = getQueues(projectConfig);
            List topics = getTopics(projectConfig);
            
            List destinations = new ArrayList();
            destinations.addAll(queues);
            destinations.addAll(topics);
            
            List mdbs = createMDBs(Queue.class.getName(), queues);
            mdbs.addAll(createMDBs(Topic.class.getName(), topics));

            Document jboss = loadDocument(getSrc());
            
            Element eEnterpriseBeans = jboss.getRootElement().getChild("enterprise-beans");
            
            if (eEnterpriseBeans == null)
            {
                throw new BuildException("The specified ejb-jar.xml file does not have an appropriate enterprise-beans tag");
            }
            
            eEnterpriseBeans.addContent(mdbs);
            
            Element eInvokerProxyBindings = createInvokerProxyBindings(destinations);
            jboss.getRootElement().addContent(eInvokerProxyBindings);
            
            XMLOutputter outputter = new XMLOutputter(Format.getPrettyFormat());
            outputter.output(jboss, new FileWriter(getDest()));            
	    }
	    catch (JDOMException e)
	    {
	        verbose(e);
	        throw new BuildException(e);
	    }
	    catch (IOException e)
	    {
	        verbose(e);
	        throw new BuildException(e);
	    }
    }
    
    public List createMDBs(String type, List destinations)
    {
        List mdbs = new ArrayList();
        
        for (Iterator i = destinations.iterator(); i.hasNext();)
        {
            DestinationMetaData dmd = (DestinationMetaData) i.next();
            
            System.out.println("Creating JBoss 'message-driven' Element for: " + dmd.getId());
            
            String name = dmd.getEncodedName();
            Map m = new LinkedHashMap();
            m.put(EJB_NAME, name);
            m.put(DESTIONATION_JNDI_NAME, dmd.getJndiName());
            m.put(CONFIGURATION_NAME, CONFIGURATION_NAME_VALUE);
            Element e = createElement("message-driven", m, null);
            e.addContent(createInvokerBindings(dmd.getProxyName()));
            mdbs.add(e);
        }
        
        return mdbs;
    }
    
    public Element createInvokerBindings(String name)
    {
        Element ibn = new Element("invoker-proxy-binding-name");
        ibn.setText(name);

        Element i = new Element("invoker");
        i.addContent(ibn);

        Element ibs = new Element("invoker-bindings");
        ibs.addContent(i);
        
        return ibs;
    }
    
    public Element createInvokerProxyBindings(List l) throws JDOMException, IOException
    {
        Element ipbs = new Element("invoker-proxy-bindings");
        for (Iterator i = l.iterator(); i.hasNext();)
        {
            DestinationMetaData dmd = (DestinationMetaData) i.next();
            Element ipb = createInvokerProxy(dmd.getProxyName(), dmd.getMinPoolSize().intValue(), dmd.getMaxPoolSize().intValue());
            ipbs.addContent(ipb);
        }
        return ipbs;
    }
    
    public Element createInvokerProxy(String name, int minPoolSize, int maxPoolSize) throws JDOMException, IOException
    {
        String invokerStr = "<invoker-proxy-binding>" +
        		"<name>message-driven-bean</name>" +
        		"<invoker-mbean>default</invoker-mbean>" +
        		"<proxy-factory>org.jboss.ejb.plugins.jms.JMSContainerInvoker</proxy-factory>" +
        		"<proxy-factory-config>" +
        		"<JMSProviderAdapterJNDI>DefaultJMSProvider</JMSProviderAdapterJNDI>" +
        		"<ServerSessionPoolFactoryJNDI>StdJMSPool</ServerSessionPoolFactoryJNDI>" +
        		"<MinimumSize>1</MinimumSize>" +
        		"<MaximumSize>15</MaximumSize>" +
        		"<KeepAliveMillis>30000</KeepAliveMillis>" +
        		"<MaxMessages>1</MaxMessages>" +
        		"<MDBConfig>" +
        		"<ReconnectIntervalSec>10</ReconnectIntervalSec>" +
        		"<DLQConfig>" +
        		"<DestinationQueue>queue/DLQ</DestinationQueue>" +
        		"<MaxTimesRedelivered>10</MaxTimesRedelivered>" +
        		"<TimeToLive>0</TimeToLive>" +
        		"</DLQConfig>" +
        		"</MDBConfig>" +
        		"</proxy-factory-config>" +
        		"</invoker-proxy-binding>";
        
        Document d = loadDocument(new StringReader(invokerStr));
        Element e = (Element) d.getRootElement().detach();
        e.getChild("name").setText(name);
        e.getChild("proxy-factory-config").getChild("MinimumSize").setText(String.valueOf(minPoolSize));
        e.getChild("proxy-factory-config").getChild("MaximumSize").setText(String.valueOf(minPoolSize));
        return e;
    }
    

}
