/*
 * Created on 18-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.case_legacy_service.java;

import java.util.List;
import java.util.Map;

import org.jdom.Document;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public interface IXMLProcessor {
    public void xmlProcessor(List params, Map seqKey, Document doc) throws SystemException;
    
	public static final String PARAM_TAG = "param";
	public static final String PARAMS_TAG = "params";
	public static final String CASENUMBER_PARAM_TAG = "<param name='caseNumber'>";
	public static final String SLASH = "/";
	public static final String STARTTAG = "<";
	public static final String ENDTAG = ">";
	
	public static final String JUDGEMENT_KEY = "JUDGEMENT";
	public static final String CASEEVENT_KEY = "CASEEVENT";
	public static final String VARIATION_KEY = "VARIATION";
	public static final String AEEVENT_KEY = "AEEVENT";
	public static final String TEST_KEY = "TEST";
}
