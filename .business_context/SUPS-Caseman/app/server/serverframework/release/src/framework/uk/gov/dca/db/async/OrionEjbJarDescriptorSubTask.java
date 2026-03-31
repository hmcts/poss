/*
 * Created on 20-May-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.util.ServiceMetaData;

/**
 * @author Michael Barker
 *
 */
public class OrionEjbJarDescriptorSubTask extends DescriptorSubTask
{
    
    public OrionEjbJarDescriptorSubTask()
    {
        super();
    }

    public void process(File projectConfig, String packageName,
            List serviceMetaData) throws BuildException
    {
        checkFiles();
        setProjectResource(packageName, projectConfig);
        
        List ejbMappings = buildEjbMappings(serviceMetaData);
        
        try
        {
            List queues = getQueues(projectConfig);
            List topics = getTopics(projectConfig);
            
            List mdbs = createMDBElements(queues, ejbMappings);
            mdbs.addAll(createMDBElements(topics, ejbMappings));
            
            Document orionEjbJar = loadDocument(getSrc());
            
            Element eEnterpriseBeans = orionEjbJar.getRootElement().getChild("enterprise-beans");
            
            if (eEnterpriseBeans == null)
            {
                throw new BuildException("The specified orion-ejb-jar.xml file does not have an appropriate enterprise-beans tag");
            }
            
            eEnterpriseBeans.addContent(mdbs);
            
            XMLOutputter outputter = new XMLOutputter(Format.getPrettyFormat());
            outputter.output(orionEjbJar, new FileWriter(getDest()));
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

    public List createMDBElements(List destinationMetaData, List ejbMappings)
    {
        List l = new ArrayList();
        
        for (Iterator i = destinationMetaData.iterator(); i.hasNext();)
        {
            DestinationMetaData dmd = (DestinationMetaData) i.next();
            l.add(createMDBElement(dmd, ejbMappings));
            for(int j=0;j<ejbMappings.size(); j++)
            {
                Element e = (Element) ((Element) ejbMappings.get(j)).clone();
                ejbMappings.remove(j);
                ejbMappings.add(j, e);
            }
        }
        
        return l;
    }
    
    /**
     * Builds the message driven deployment element for the orion dd.
     * 
     * @param metaData
     * @param ejbMappings
     * @return
     */
    public Element createMDBElement(DestinationMetaData metaData, List ejbMappings)
    {
        System.out.println("Creating OAS 'message-driven-deployment' Element for: " + metaData.getId());
        
        Element eMessageDrivenDeployment = new Element("message-driven-deployment");
        eMessageDrivenDeployment.setAttribute("name", metaData.getEncodedName());
        eMessageDrivenDeployment.setAttribute("destination-location", metaData.getJndiName());
        eMessageDrivenDeployment.setAttribute("connection-factory-location", metaData.getFactory());
        eMessageDrivenDeployment.setAttribute("listener-threads", metaData.getMaxPoolSize().toString());
        
        Element eEnvEntryMapping = new Element("env-entry-mapping");
        eEnvEntryMapping.setAttribute("name", SupsConstants.SUPS_CONFIG_PARAM);
        eEnvEntryMapping.setText(getProjectResource());
        eMessageDrivenDeployment.addContent(eEnvEntryMapping);
        
        eMessageDrivenDeployment.addContent(ejbMappings);
        
        Element eResourceRefMappingDest = new Element("resource-ref-mapping");
        eResourceRefMappingDest.setAttribute("name", metaData.getJndiName());
        eResourceRefMappingDest.setAttribute("location", metaData.getJndiName());
        eMessageDrivenDeployment.addContent(eResourceRefMappingDest);
        
        Element eResourceRefMappingFact = new Element("resource-ref-mapping");
        eResourceRefMappingFact.setAttribute("name", metaData.getFactory());
        eResourceRefMappingFact.setAttribute("location", metaData.getFactory());
        eMessageDrivenDeployment.addContent(eResourceRefMappingFact);
        
        return eMessageDrivenDeployment;
    }
    
    /**
     * Builds a list of elements that contain the ejb mappings for the
     * oracle dd.
     * 
     * @param serviceMetaData
     * @return
     */
    public List buildEjbMappings(List serviceMetaData)
    {
        List localRefs = new ArrayList();
        
        for (Iterator i = serviceMetaData.iterator(); i.hasNext();)
        {
            ServiceMetaData smd = (ServiceMetaData) i.next();
            Element eEjbRefMapping = new Element("ejb-ref-mapping");
            eEjbRefMapping.setAttribute("name", smd.getLocalEjbName());
            eEjbRefMapping.setAttribute("location", smd.getEjbName());
            localRefs.add(eEjbRefMapping);
        }
        
        Element eCommandRef = new Element("ejb-ref-mapping");
        eCommandRef.setAttribute("name", "ejb/CommandProcessorLocal");
        eCommandRef.setAttribute("location", "CommandProcessor");
        localRefs.add(eCommandRef);
        
        Element eSecurityRef = new Element("ejb-ref-mapping");
        eSecurityRef.setAttribute("name", "ejb/SecurityServiceLocal");
        eSecurityRef.setAttribute("location", "SecurityService");
        localRefs.add(eSecurityRef);
                
        return localRefs;
    }
}
