/*
 * Created on 13-Dec-2004
 *
 */
package uk.gov.dca.test_project.cases_service.classes;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;
import uk.gov.dca.db.exception.BusinessException;

/**
 * A class to help with testing dynamic executing of queries.
 * The SQL to be 'generated' is provided to the generator via XML config.
 * 
 * @author GrantM
 */
public class ConfigurableSQLGenerator implements ISQLGenerator {

	private String m_sql = null;
	
	/**
	 * 
	 */
	public ConfigurableSQLGenerator() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#initialise(org.jdom.Element)
	 */
	public void initialise(Element generateConfig) {
		// read in the config
		if ( generateConfig != null ) {
			Element configElement = generateConfig.getChild("Config");
			if ( configElement != null ) {
				m_sql = configElement.getText();
			}
		}
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#generate(org.jdom.Document, uk.gov.dca.db.pipeline.IQueryContextReader)
	 */
	public String generate(Document inputXML, IQueryContextReader context) throws BusinessException {
		return m_sql;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#clone()
	 */
	public Object clone() {
		ConfigurableSQLGenerator theClone = new ConfigurableSQLGenerator();
		theClone.m_sql = this.m_sql;
		
		return theClone;
	}

}
