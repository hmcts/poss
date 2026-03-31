/*
 * Created on 21-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import java.util.Properties;

/**
 * @author Michael Barker
 * imported by Peter Neil from Ediary
 */
public interface Check
{
	String getName();
	void setProperties(Properties properties);
	Properties  getProperties();
	void setCheckContext(CheckContext checkContext);
	CheckContext getCheckContext();
	String execute();
    
}
