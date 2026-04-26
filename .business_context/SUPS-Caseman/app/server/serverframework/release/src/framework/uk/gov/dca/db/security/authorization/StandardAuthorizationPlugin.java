/*
 * Created on 09-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.authorization;

import java.io.IOException;
import java.io.StringReader;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.TreeSet;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.security.SecurityFactory;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author Imran Patel
 *
 */
public class StandardAuthorizationPlugin implements IAuthorizationPlugin {

    Log log = SUPSLogFactory.getLogger(StandardAuthorizationPlugin.class);
    
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.authorization.IAuthorizationPlugin#authorize(uk.gov.dca.db.pipeline.IComponentContext, java.lang.String)
	 */
	public boolean authorize(IComponentContext context, String methodSecurityProperties) throws SystemException, BusinessException {
		
		SecurityFactory factory = new SecurityFactory();
		UserProfile profile = factory.createUserProfile();
		List dbRolesList = profile.getRoles((String) context.getSystemItem(IComponentContext.USER_ID_KEY), (String) context.getSystemItem(IComponentContext.COURT_ID_KEY));
				
		// parse the security element from the method file
		SAXBuilder builder = new SAXBuilder();
		Document securityElement = null;
		Element securityEl = null;
		Set methodRolesList = null;
		
		try {
			securityElement = builder.build( new StringReader(methodSecurityProperties) );
			if(securityElement==null)
				throw new SystemException("Failed to parse security element from method file");
			
			securityEl = (Element) securityElement.getRootElement();
			if (securityEl == null)
				throw new SystemException("Failed to obtain security element");
			
			String methodRoles = securityEl.getAttributeValue("roles");
			StringTokenizer tokenizer = new StringTokenizer(methodRoles, " ");
			methodRolesList = new TreeSet();
			while(tokenizer.hasMoreTokens()) {
				methodRolesList.add(tokenizer.nextToken());
			}
			
		}
		catch( IOException e ) {
    		throw new SystemException("Failed to parse security element from method file: "+e.getMessage(),e);
		}
		catch( JDOMException e ) {
    		throw new BusinessException("Failed to process the security element from the method file: "+e.getMessage(),e);
		}
		
		log.debug("User Roles: " + dbRolesList + " Required Roles: " + methodRolesList);
		
		Iterator userRolesItr = dbRolesList.iterator();
		while(userRolesItr.hasNext()){
			Role role = (Role) userRolesItr.next();
			if(methodRolesList.contains(role.getName())){
				return true;
			}
			else{
				while(role.hasParent()){
					role = role.getParent();
					if(methodRolesList.contains(role.getName())){
						return true;
					}
				}
			}
		}
		
		return false;
	}
}
