package uk.gov.dca.db.security.authorization;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * @author Imran Patel
 *
 */
public class RolesBuilder {
	
	Map rolesMap;
	
	
	//TODO: need to finalize what we pass as the location
	public void buildRoles(String location) throws SystemException{
		
		rolesMap = new HashMap();
		Document rolesXMLDoc = null;
		Map parentMap = new HashMap();
		
		//parse the roles.xml
		InputStream rolesXMLStream = Util.getInputStream(location, this);
		SAXBuilder builder = new SAXBuilder();
		
		try {
			rolesXMLDoc = builder.build(rolesXMLStream);
		} catch (JDOMException e) {
			throw new SystemException("Failed to parse the roles.xml", e);
		} catch (IOException e) {
			throw new SystemException("Failed to read the roles.xml during parsing", e);
		}
		
		//extract the roles and create Role objects
		
		if(rolesXMLDoc == null)
			throw new SystemException("Failed to parse the roles.xml, result og parsing is null");
		
		Element root = rolesXMLDoc.getRootElement();
		if (root == null)
			throw new SystemException("The root element of the roles.xml was null; error during parsing");
			
		//extract roles from root
		List rolesList = root.getChildren();
		
		if(rolesList != null) {
			Iterator rolesItr = rolesList.iterator();
				
			while(rolesItr.hasNext()){
				Element roleEl = (Element) rolesItr.next();
				if(roleEl.getName().equalsIgnoreCase("Role")){
					Role role= new Role();
					String id = roleEl.getAttributeValue("id");
					if(id == null || id.equals(""))
						throw new SystemException("The Role element in the roles.xml file doesn't have an id attribute defined");
					String name = roleEl.getAttributeValue("name");
					if(name == null || name.equals(""))
						throw new SystemException("The Role element in the roles.xml file doesn't have an name attribute defined");
					role.setId(id);
					role.setName(name);
						
					String parent = roleEl.getAttributeValue("parent");
					if(parent!=null && !parent.equals(""))
						parentMap.put(id, parent);

					rolesMap.put(id, role);
				}
			}
				
			Iterator parentIdsItr = parentMap.keySet().iterator();
			while(parentIdsItr.hasNext()) {
				String childId = (String) parentIdsItr.next();
				String parent = (String) parentMap.get(childId);
				
				Role childRole = (Role) rolesMap.get(childId);
				Role parentRole = (Role) rolesMap.get(parent);
						
				if(childRole == null || parentRole == null)
					throw new SystemException("An error occurred when building parent child role relationship");
						
				childRole.setParent(parentRole);
			}
		}
	}
	
	public Map getRoles(){
		return rolesMap;
	}
}
