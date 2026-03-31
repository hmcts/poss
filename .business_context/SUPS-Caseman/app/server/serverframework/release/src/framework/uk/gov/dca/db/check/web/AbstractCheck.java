package uk.gov.dca.db.check.web;

import java.util.Properties;

public abstract class AbstractCheck implements Check {

	protected Properties properties = new Properties();
    protected CheckContext checkContext;
    
    public AbstractCheck() {
        super();
    }

    public abstract String execute();
    public abstract String getName();

    public void setProperties(Properties properties) {
        properties.putAll(System.getProperties());
        this.properties = properties;
    }

	public CheckContext getCheckContext() {
		return checkContext;
	}

	public void setCheckContext(CheckContext checkContext) {
		this.checkContext = checkContext;
	}

	public Properties getProperties() {
		return properties;
	}
       
}
