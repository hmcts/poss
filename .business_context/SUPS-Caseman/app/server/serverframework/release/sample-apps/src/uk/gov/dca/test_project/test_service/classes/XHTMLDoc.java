/*
 */
package uk.gov.dca.test_project.test_service.classes;

import java.io.IOException;
import java.io.Writer;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.command.Command;
import uk.gov.dca.db.impl.command.CommandRouter;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 */
public class XHTMLDoc extends AbstractCustomProcessor {

	/**
	 * 
	 */
	public XHTMLDoc() {
		super();
		// TODO Auto-generated constructor stub
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
	 */
	public void process(Document inputParameters, Writer output, Log log) throws BusinessException, SystemException {
		try {
			output.write("<p>This is some <strong att1=\"att1value\">sample</strong> text. You are using sups editor.  This is a <span class=\"SUPSVAR\">variable</span></p>");
		}
		catch( IOException e) {
			throw new SystemException("Unable to write to output: " +e.getMessage(), e);
		}
	}
	

}
