package uk.gov.dca.db.security.authorization;


/**
 * @author Imran Patel
 *
 */
public class Role {
	
	private Role parent;
	private String id;
	private String name;
	
	public String getId() {
		return id;
	}
	
	protected void setId(String id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	protected void setName(String name) {
		this.name = name;
	}
	
	protected void setParent(Role parent){
		this.parent = parent;
	}
	
	public Role getParent(){
		return parent;
	}
	
	public boolean hasParent() {
		if (parent == null)
			return false;
		
		return true;
	}
}
