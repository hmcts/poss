// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import org.easymock.AbstractMatcher;
 * import org.jdom.Element;
 * import org.jdom.output.Format;
 * import org.jdom.output.XMLOutputter;
 * 
 * public class ElementMatcher extends AbstractMatcher {
 * 
 * private XMLOutputter xmlOutputter = new XMLOutputter();
 * 
 * public ElementMatcher()
 * {
 * Format format = Format.getCompactFormat();
 * xmlOutputter.setFormat(format.setExpandEmptyElements(true));
 * }
 * 
 * protected boolean argumentMatches(Object lhs, Object rhs)
 * {
 * if(lhs instanceof String && rhs instanceof String) {
 * return ((String)lhs).equals(rhs);
 * }
 * 
 * if(lhs == null && rhs == null) return true;
 * if(!(lhs instanceof Element)) return false;
 * if(!(rhs instanceof Element)) return false;
 * if(lhs == rhs) return true;
 * 
 * return xmlOutputter.outputString((Element)lhs)
 * .equals(xmlOutputter.outputString((Element)rhs));
 * }
 * 
 * protected String argumentToString(Object o)
 * {
 * if(o instanceof Element) {
 * return xmlOutputter.outputString((Element)o);
 * }
 * return o.toString();
 * }
 * 
 * }
 * //[enddef] */