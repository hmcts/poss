/*
 * Created on 03-May-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jms.Queue;
import javax.jms.QueueConnectionFactory;
import javax.jms.Topic;
import javax.jms.TopicConnectionFactory;

import org.apache.tools.ant.BuildException;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Namespace;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.util.NoOpEntityResolver;

/**
 * Base task for all MDB deployment descriptor sub tasks.
 * 
 * @author Michael Barker
 *
 */
public abstract class DescriptorSubTask 
{
    private File src;
    private File dest;
    private final SAXBuilder builder;
    private boolean verbose = false;
    private String projectResource;

    public DescriptorSubTask()
    {
        builder = new SAXBuilder();
        builder.setEntityResolver(new NoOpEntityResolver());
    }
    

    public void setSrc(File src) 
    {
        this.src = src;
    }
    
    public File getSrc()
    {
        return src;
    }
    
    public void setDest(File dest)
    {
        this.dest = dest;
    }
    
    public File getDest()
    {
        return this.dest;
    }
    
    /**
     * Gets all of the queue meta data in the supplied project configuration file.
     * 
     * @param projectConfig
     * @return
     * @throws JDOMException
     * @throws IOException
     */
    public List getQueues(File projectConfig) throws JDOMException, IOException
    {
        final String QUEUE_PATH = "//item[@class='uk.gov.dca.db.impl.QueueConfigurationItem']";
        
        Document d = loadDocument(projectConfig);
        XPath queueXPath = XPath.newInstance(QUEUE_PATH);
        List queues = new ArrayList();
        for (Iterator i = queueXPath.selectNodes(d).iterator(); i.hasNext();)
        {
            Element e = (Element) i.next();
            queues.add(new QueueMetaData(e));
        }
        return queues;
    }
    
    /**
     * Gets all of the queue meta data from the supplied project configuration file.
     * 
     * @param projectConfig
     * @return
     * @throws JDOMException
     * @throws IOException
     */
    public List getTopics(File projectConfig) throws JDOMException, IOException
    {
        final String TOPIC_PATH = "//item[@class='uk.gov.dca.db.impl.TopicConfigurationItem']";

        Document d = loadDocument(projectConfig);
        XPath topicXPath = XPath.newInstance(TOPIC_PATH);
        List topics = new ArrayList();
        for (Iterator i = topicXPath.selectNodes(d).iterator(); i.hasNext();)
        {
            Element e = (Element) i.next();
            topics.add(new TopicMetaData(e));
        }
        return topics;
        
    }
    
    public Document loadDocument(File f) throws JDOMException, IOException
    {
        return builder.build(f);
    }
    
    public Document loadDocument(Reader r) throws JDOMException, IOException
    {
        return builder.build(r);
    }
    
    public void checkFiles()
    {
        if (!src.exists())
        {
            throw new BuildException("Source file: " + src.getAbsolutePath() + " does not exist");
        }
        else if (src.isDirectory())
        {
            throw new BuildException("Source file: " + src.getAbsolutePath() + " is a directory");
        }
        else if (dest.isDirectory())
        {
            throw new BuildException("Destination file: " + dest.getAbsolutePath() + " is a directory");
        }
    }
    
    public List createElements(String name, List propertiesList, Namespace ns)
    {
        List es = new ArrayList();
        for (Iterator i = propertiesList.iterator(); i.hasNext();)
        {
            Map m = (Map) i.next();
            es.add(createElement(name, m, ns));
        }
        return es;
    }
    
    public Element createElement(String name, Map properties, Namespace ns)
    {
        Element e = new Element(name, ns);
        for (Iterator i = properties.keySet().iterator(); i.hasNext();)
        {
            String key = (String) i.next();
            String value = (String) properties.get(key);
            Element child = new Element(key, ns);
            child.setText(value);
            e.addContent(child);
        }
        return e;
    }
    
    public void setProjectResource(String packageName, File projectConfig)
    {
        this.projectResource = packageName.replace('.', '/') + '/' + projectConfig.getName();
    }
    
    public String getProjectResource()
    {
        return this.projectResource;
    }
    
    public abstract void process(File projectConfig, String packageName, List serviceMetaData) throws BuildException;
    
    
    public void setVerbose(boolean verbose)
    {
       this.verbose = verbose;
    }
    
    public void verbose(String s)
    {
       if (verbose)
       {
          System.out.println(s);
       }
    }
    
    public void verbose(Exception e)
    {
        if (verbose)
        {
            System.out.println(e);
            e.printStackTrace();
        }
    }

    
    public abstract static class DestinationMetaData
    {
        private String factory;
        private String jndiName;
        private Integer minPoolSize;
        private Integer maxPoolSize;
        private String id;
        
        public DestinationMetaData(Element eDest)
        {
            String id = eDest.getAttributeValue("id");
            if (id == null)
            {
                throw new BuildException("id for Destination configuration item was not specified");
            }
            setId(id);
            
            String factory = getChildText(eDest, "factory");
            String jndiName = getChildText(eDest, "jndi-name");
            String minPoolSize = getChildText(eDest, "min-pool-size");
            String maxPoolSize = getChildText(eDest, "max-pool-size");
            
            setFactory(factory);
            setJndiName(jndiName);
            setMinPoolSize(new Integer(minPoolSize));            
            setMaxPoolSize(new Integer(maxPoolSize));            
        }
        
        private String getChildText(Element e, String name)
        {
            String value = e.getChildText(name);
            if (value == null)
            {
                throw new BuildException(name + " for Destination with id = " + id + " was not specified");                
            }
            
            return value;
        }
        
        public abstract String getDestinationClass();
        public abstract String getFactoryClass();
        
        /**
         * @return Returns the id.
         */
        public String getId()
        {
            return id;
        }
        /**
         * @param id The id to set.
         */
        public void setId(String id)
        {
            this.id = id;
        }
        
        /**
         * Encodes the destination name using only alphanum characters.
         * 
         * @param destName
         * @return
         */
        public String getEncodedName()
        {
            StringBuffer sb = new StringBuffer();
            
            for (int i = 0; i < id.length(); i++)
            {
                char c = id.charAt(i);
                if (Character.isLetterOrDigit(c))
                {
                    sb.append(c);
                }
                else
                {
                    sb.append("0x" + Integer.toHexString((int) c));
                }
            }
            
            sb.append("Processor");
            
            return sb.toString();
        }
        
        
        /**
         * @return Returns the factory.
         */
        public String getFactory()
        {
            return factory;
        }
        /**
         * @param factory The factory to set.
         */
        public void setFactory(String factory)
        {
            this.factory = factory;
        }
        public String getProxyName()
        {
            return this.id + "Proxy";
        }
        
        /**
         * @return Returns the jndiName.
         */
        public String getJndiName()
        {
            return jndiName;
        }
        /**
         * @param jndiName The jndiName to set.
         */
        public void setJndiName(String jndiName)
        {
            this.jndiName = jndiName;
        }
        /**
         * @return Returns the numSubscribers.
         */
        public Integer getMinPoolSize()
        {
            return minPoolSize;
        }
        /**
         * @param numSubscribers The numSubscribers to set.
         */
        public void setMinPoolSize(Integer minPoolSize)
        {
            this.minPoolSize = minPoolSize;
        }
        
        /**
         * @return Returns the maxPoolSize.
         */
        public Integer getMaxPoolSize()
        {
            return maxPoolSize;
        }
        /**
         * @param maxPoolSize The maxPoolSize to set.
         */
        public void setMaxPoolSize(Integer maxPoolSize)
        {
            this.maxPoolSize = maxPoolSize;
        }
    }
    
    public static class TopicMetaData extends DestinationMetaData
    {
        /**
         * @param eDest
         */
        public TopicMetaData(Element eDest)
        {
            super(eDest);
            // TODO Auto-generated constructor stub
        }
        
        public String getDestinationClass()
        {
            return Topic.class.getName();
        }
        
        public String getFactoryClass()
        {
            return TopicConnectionFactory.class.getName();
        }
    }
    
    public static class QueueMetaData extends DestinationMetaData
    {
        /**
         * @param eDest
         */
        public QueueMetaData(Element eDest)
        {
            super(eDest);
            // TODO Auto-generated constructor stub
        }
        
        public String getDestinationClass()
        {
            return Queue.class.getName();
        }
        
        public String getFactoryClass()
        {
            return QueueConnectionFactory.class.getName();
        }
    }
}
