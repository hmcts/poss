/*
 * Created on 22-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 * imported by Peter Neil from Ediary
 *
 */
public class ServletsAvailabilityCheck extends AbstractCheck {

    /* (non-Javadoc)
     * @see uk.gov.dca.ediary.reports.web.Check#execute()
     */
    public String execute() {
        String result;
        try {
        	result = "<FCKEditorServlet>";
            result = result + ServletAvailable.getServletStatus(getCheckContext().getLocalhostURL() + "/fckeditor/_whatsnew.html");
            result = result + "</FCKEditorServlet>";
            
            result = result + "<JSPellIframServlet>";
            result = result + ServletAvailable.getServletStatus(getCheckContext().getLocalhostURL() + "/jspelliframe/test.html");
            result = result + "</JSPellIframServlet>";
            
        } catch (SystemException e) {
            result = "Failed, " + e.getMessage();
        }

        return result;
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.ediary.reports.web.Check#getName()
     */
    public String getName() {
        return "ServletsAvailabilityCheck";
    }

}
