/*
 * Created on 22-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * @author Michael Barker
 * imported by Peter Neil from Ediary
 *
 */
public class ClientFrameworkReleaseBuildEnvironmentCheck extends AbstractCheck {


	
    /* (non-Javadoc)
     * @see uk.gov.dca.ediary.reports.web.Check#execute()
     */
    public String execute() {
        String result;
        Properties clientframeworkProperties = null;
        try {
    		try {
    			clientframeworkProperties = new Properties();
    			String content = Util.getContentFromInputStream(new URL(getCheckContext().getBaseURL() + FrameworkVersionProperties.getApplicationWebPrefix() + "/" + FrameworkVersionProperties.VERSION_FILE_NAME), "UTF-8");
    			final InputStream is = new ByteArrayInputStream(content.getBytes());
    			clientframeworkProperties.load(is);
    		} catch (Throwable e) {
    			clientframeworkProperties = new Properties();
    			clientframeworkProperties.put("version", "Unable to load VERSION_FILE: " + FrameworkVersionProperties.VERSION_FILE_NAME);
    		}
            result = ClientFrameworkReleaseBuildEnvironment.getFrameworkRelease(clientframeworkProperties);
        } catch (SystemException e) {
            result = "Failed, " + e.getMessage();
        }

        return result;
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.ediary.reports.web.Check#getName()
     */
    public String getName() {
        return "ClientFramework Release";
    }

}
