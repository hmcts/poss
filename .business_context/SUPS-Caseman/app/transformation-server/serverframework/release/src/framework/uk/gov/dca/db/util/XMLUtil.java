/*
 * Created on 08-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.util;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class XMLUtil {

	/**
	 * Default constructor
	 */
	public XMLUtil() {
		super();
	}
	
	public static String encode(String data) {
		StringBuffer stream = new StringBuffer();
		char[] characters = data.toCharArray();
		
		for(int i = 0; i < characters.length; i++) {
			switch(characters[i]) {
				case AMP:
					stream.append(AMP_ENCODING);
					break;
				case LT:
					stream.append(LT_ENCODING);
					break;
				case GT:
					stream.append(GT_ENCODING);
					break;
				case APOS:
					stream.append(APOS_ENCODING);
					break;
				case QUOT:
					stream.append(QUOT_ENCODING);
					break;
				default:
					stream.append(characters[i]);
					break;
			}
		}
		return stream.toString();
	}
	
	private static final char AMP = '&';
	private static final char LT = '<';
	private static final char GT = '>';
	private static final char APOS = '\'';
	private static final char QUOT = '"';
	
	private static final String AMP_ENCODING = "&amp;";
	private static final String LT_ENCODING = "&lt;";
	private static final String GT_ENCODING = "&gt;";
	private static final String APOS_ENCODING = "&apos;";
	private static final String QUOT_ENCODING = "&quot;";
}
