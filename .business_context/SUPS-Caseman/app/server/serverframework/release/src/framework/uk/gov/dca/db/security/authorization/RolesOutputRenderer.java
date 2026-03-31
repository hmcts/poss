package uk.gov.dca.db.security.authorization;

import java.util.Collection;
import java.util.Iterator;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Imran Patel
 *
 */
public class RolesOutputRenderer{
	
	public String doRender(Collection roles) throws SystemException {

		StringBuffer rolesXmlBuf = new StringBuffer();
		rolesXmlBuf.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<roles>");
		
		Iterator itr = roles.iterator();
		
		while(itr.hasNext()) {
			Role role = (Role) itr.next();

			extractRoles(role, rolesXmlBuf);
		}
		
		rolesXmlBuf.append("</roles>");
		
		return rolesXmlBuf.toString();
	}
	
	private StringBuffer extractRoles(Role role, StringBuffer rolesXmlBuf) {
		
		if (role != null) {					
			
			if(role.hasParent()) {
				extractRoles(role.getParent(), rolesXmlBuf);
			}
		
			rolesXmlBuf.append("<role");
			
			if (role.hasParent()){
				rolesXmlBuf.append(" parent=\"");
				rolesXmlBuf.append(role.getParent().getName());
				rolesXmlBuf.append("\"");
			}
			rolesXmlBuf.append(">");
			
			rolesXmlBuf.append(role.getName());
			rolesXmlBuf.append("</role>");
		}
		
		return rolesXmlBuf;
	}
}
