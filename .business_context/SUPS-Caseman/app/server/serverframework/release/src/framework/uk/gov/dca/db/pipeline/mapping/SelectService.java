/*
 * Created on 15-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import java.io.Writer;
import java.io.StringWriter;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.JDOMException;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.mapping.output.OutputWalker;
import uk.gov.dca.db.util.SUPSLogFactory;

public class SelectService extends DBService {
	
    private static final Log log = SUPSLogFactory.getLogger(SelectService.class);

    protected void process() throws BusinessException, SystemException {
    	
		String userId = (String) m_context.getSystemItem(IComponentContext.USER_ID_KEY);			
		String courtId = (String) m_context.getSystemItem(IComponentContext.COURT_ID_KEY);
		String businessProcessId = (String) m_context.getSystemItem(IComponentContext.BUSINESS_PROCESS_ID_KEY);
		
		if(userId == null || userId.equalsIgnoreCase("") || courtId == null || courtId.equalsIgnoreCase("") || businessProcessId == null || businessProcessId.equalsIgnoreCase("")){
            log.error("Invalid userId, courtId or businessProcessId values("+ userId +", "+courtId+", "+businessProcessId+")");
			throw new BusinessException("Invalid userId, courtId or businessProcessId values("+ userId +", "+courtId+", "+businessProcessId+")");
		}
        
        Document parameters = (Document)this.m_inputData.getData(Document.class);
        
        String service = (String) getContext().getSystemItem(IComponentContext.SERVICE_NAME_KEY);
        String method = (String) getContext().getSystemItem(IComponentContext.METHOD_NAME_KEY);
       
        Writer outputSink = new StringWriter();
        this.m_outputData.setData(outputSink, Writer.class);
        
        try {
            OutputWalker out = new OutputWalker(m_pd);
            out.output(method, parameters, outputSink);
        }
        catch (JDOMException e) {
            throw new SystemException("[" + service + "." + method + "] Executiion failed", e);
        }
        
    }

}
