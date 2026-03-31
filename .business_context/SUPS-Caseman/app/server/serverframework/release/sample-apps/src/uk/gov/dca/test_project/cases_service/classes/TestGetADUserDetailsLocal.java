/*
 * Created on 29-Apr-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.cases_service.classes;

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
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.command.Command;
import uk.gov.dca.db.impl.command.CommandRouter;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * @author PNeil
 * 
 * TODO To change the template for this generated type comment go to Window -
 * Preferences - Java - Code Style - Code Templates
 */
public class TestGetADUserDetailsLocal extends AbstractCustomProcessor {

    /**
     * 
     */
    public TestGetADUserDetailsLocal() {
        super();
    }

    /*
     * (non-Javadoc)
     * 
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process(Document inputParameters, Writer output, Log log)
            throws BusinessException, SystemException {
        try {
             XMLOutputter outputter = new XMLOutputter();
            
             String params = outputter.outputString(inputParameters);
            AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy();            
            String userDetailsString = proxy.getString("ejb/SecurityServiceLocal", "getADUserDetailsLocal", params, false);
            
            log.debug("Returning: " + userDetailsString);
            
            output.write(userDetailsString);
            
        } catch (IOException e) {
            throw new SystemException("Unable to write to output: "
                    + e.getMessage(), e);
        }
    }
}
