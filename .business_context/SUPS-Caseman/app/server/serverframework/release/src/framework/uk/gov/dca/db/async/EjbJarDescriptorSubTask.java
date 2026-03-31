/*
 * Created on 03-May-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.tools.ant.BuildException;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Namespace;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.util.ServiceMetaData;

/**
 * Subtask for handling the addition of MDBs to the EJB jar file.
 * 
 * @author Michael Barker
 *
 */
public class EjbJarDescriptorSubTask extends DescriptorSubTask
{
    public final static String EJB_REF_NAME = "ejb-ref-name";
    public final static String EJB_REF_TYPE = "ejb-ref-type";
    public final static String LOCAL_HOME = "local-home";
    public final static String ENV_ENTRY_NAME = "env-entry-name";
    public final static String ENV_ENTRY_TYPE = "env-entry-type";
    public final static String ENV_ENTRY_VALUE = "env-entry-value";
    public final static String DESCRIPTION = "description";
    public final static String RES_REF_NAME = "res-ref-name";
    public final static String RES_TYPE = "res-type";
    public final static String RES_AUTH = "res-auth";
    public final static String EJB_LINK = "ejb-link";
    public final static String LOCAL = "local";
    //public final static Namespace J2EE_NAMESPACE = Namespace.getNamespace("http://java.sun.com/xml/ns/j2ee");
    public final static Namespace J2EE_NAMESPACE = null;
    

    public EjbJarDescriptorSubTask()
    {
        super();
    }
    
    public void process(File projectConfig, String packageName, List serviceMetaData)
    {
        checkFiles();
        setProjectResource(packageName, projectConfig);
        
        Map envEntry = new LinkedHashMap();
        envEntry.put(ENV_ENTRY_NAME, SupsConstants.SUPS_CONFIG_PARAM);
        envEntry.put(ENV_ENTRY_TYPE, "java.lang.String");
        envEntry.put(ENV_ENTRY_VALUE, getProjectResource());
        
        List envEntries = new ArrayList();
        envEntries.add(envEntry);
                
        List localRefs = buildLocalRefs(serviceMetaData);
        
        try
        {
            List queues = getQueues(projectConfig);
            List topics = getTopics(projectConfig);
            
            List mdbs = createMDBs(queues, envEntries, localRefs);
            mdbs.addAll(createMDBs(topics, envEntries, localRefs));
            
            Document ejbJar = loadDocument(getSrc());
            
            Element eEnterpriseBeans = ejbJar.getRootElement().getChild("enterprise-beans", J2EE_NAMESPACE);
            
            if (eEnterpriseBeans == null)
            {
                throw new BuildException("The specified ejb-jar.xml file does not have an appropriate enterprise-beans tag");
            }
            
            eEnterpriseBeans.addContent(mdbs);
            
            XMLOutputter outputter = new XMLOutputter(Format.getPrettyFormat());
            outputter.output(ejbJar, new FileWriter(getDest()));
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
    
    
    /**
     * Creates a list of message-driven-bean elements.
     * 
     * @param type
     * @param destinations
     * @param envEntries
     * @param localRefs
     * @return
     */
    public List createMDBs(List destinations, List envEntries, List localRefs)
    {
        List mdbs = new ArrayList();
        for (Iterator i = destinations.iterator(); i.hasNext();)
        {
            DestinationMetaData dmd = (DestinationMetaData) i.next();
            Element eMDB = createMDBElement(dmd, envEntries, localRefs);
            mdbs.add(eMDB);
        }
        
        return mdbs;
    }
    
    public Element createMDBElement(DestinationMetaData dmd, List envEntries, List localRefs)
    {
        System.out.println("Creating J2EE 'message-driven' Element for: " + dmd.getId());
        
        Element eMessageDriven = new Element("message-driven", J2EE_NAMESPACE);
        
        Element eEjbName = new Element("ejb-name", J2EE_NAMESPACE);
        eEjbName.setText(dmd.getEncodedName());
        eMessageDriven.addContent(eEjbName);
        
        Element eEjbClass = new Element("ejb-class", J2EE_NAMESPACE);
        eEjbClass.setText(AsyncProcessorMDB.class.getName());
        eMessageDriven.addContent(eEjbClass);
        
        Element eTransactionType = new Element("transaction-type", J2EE_NAMESPACE);
        eTransactionType.setText("Container");
        eMessageDriven.addContent(eTransactionType);

        eMessageDriven.addContent(createJ2EEElements("env-entry", envEntries));
        eMessageDriven.addContent(createJ2EEElements("ejb-local-ref", localRefs));
        
        
        Element eMessageDrivenDestination = new Element("message-driven-destination", J2EE_NAMESPACE);
        Element eDestinationType = new Element("destination-type", J2EE_NAMESPACE);
        eDestinationType.setText(dmd.getDestinationClass());
        eMessageDrivenDestination.addContent(eDestinationType);
        eMessageDriven.addContent(eMessageDrivenDestination);
        
        Element eSecurityIdentity = new Element("security-identity");
        eMessageDriven.addContent(eSecurityIdentity);
        
        /*
        Element eUseCallerIdentity = new Element("use-caller-identity");
        eSecurityIdentity.addContent(eUseCallerIdentity);
        */
        
        Element eRunAs = new Element("run-as");
        eSecurityIdentity.addContent(eRunAs);
        
        Element eRoleName = new Element("role-name");
        eRoleName.setText("user");
        eRunAs.addContent(eRoleName);
        

        Map resEntryDest = new LinkedHashMap();
        resEntryDest.put(DESCRIPTION, "JMS Destination to recieve messages");
        resEntryDest.put(RES_REF_NAME, dmd.getJndiName());
        resEntryDest.put(RES_TYPE, dmd.getDestinationClass());
        resEntryDest.put(RES_AUTH, "Container");
        
        Map resEntryFact = new LinkedHashMap();
        resEntryFact.put(DESCRIPTION, "Connection Factory for JMS");
        resEntryFact.put(RES_REF_NAME, dmd.getFactory());
        resEntryFact.put(RES_TYPE, dmd.getFactoryClass());
        resEntryFact.put(RES_AUTH, "Container");
        
        List resEntries = new ArrayList();
        resEntries.add(resEntryDest);
        resEntries.add(resEntryFact);
        
        eMessageDriven.addContent(createJ2EEElements("resource-ref", resEntries));
        
        return eMessageDriven;
    }
    
    public List createJ2EEElements(String name, List properties)
    {
        return createElements(name, properties, J2EE_NAMESPACE);
    }
    
    /**
     * Builds a list of the local ejb references
     * 
     * @param serviceMetaData
     * @return
     */
    public List buildLocalRefs(List serviceMetaData)
    {
        List localRefs = new ArrayList();
        
        for (Iterator i = serviceMetaData.iterator(); i.hasNext();)
        {
            ServiceMetaData md = (ServiceMetaData) i.next();
            Map m = new LinkedHashMap();
            m.put(EJB_REF_NAME, md.getLocalEjbName());
            m.put(EJB_REF_TYPE, "Session");
            m.put(LOCAL_HOME, md.getLocalHomeClassName());
            m.put(LOCAL, md.getLocalClassName());
            m.put(EJB_LINK, md.getEjbLink());
            
            localRefs.add(m);
        }
        
        // Add Framework EJBs
        Map commandRef = new LinkedHashMap();
        commandRef.put(EJB_REF_NAME, "ejb/CommandProcessorLocal");
        commandRef.put(EJB_REF_TYPE, "Session");
        commandRef.put(LOCAL_HOME, "uk.gov.dca.db.impl.command.CommandProcessorLocalHome");
        commandRef.put(LOCAL, "uk.gov.dca.db.impl.command.CommandProcessor");
        commandRef.put(EJB_LINK, "CommandProcessor");
        
        Map securityRef = new LinkedHashMap();
        securityRef.put(EJB_REF_NAME, "ejb/SecurityServiceLocal");
        securityRef.put(EJB_REF_TYPE, "Session");
        securityRef.put(LOCAL_HOME, "uk.gov.dca.db.security.SecurityServiceLocalHome");
        securityRef.put(LOCAL, "uk.gov.dca.db.security.SecurityService");
        securityRef.put(EJB_LINK, "SecurityService");
        
        localRefs.add(commandRef);
        localRefs.add(securityRef);
        
        return localRefs;
    }
    
    
}
