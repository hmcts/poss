/*
 * Created on 21-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;


/**
 * @author Peter Neil
 * imported by Peter Neil from Ediary
 *
 *
 * @see uk.
 */
public class FullConfigCheck extends AbstractCheck {

    
    /* (non-Javadoc)
     * @see uk.gov.dca.db.impl.check.CheckBean.check()
     */
    public String execute() {
        String result = null;
        try {
            result = FullConfig.getFullConfig(checkContext.getUserName(),checkContext.getPassword());
        } catch (Exception e) {
            result = "Failed, " + e.getMessage();
        } 

        return result;
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.ediary.reports.web.Check#getName()
     */
    public String getName() {
        return "Full System Configuration Check";
    }

}
