// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * 
 * import junit.framework.TestCase;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestNullWarrant extends TestCase {
 * 
 * private Warrant warrant;
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private SAXBuilder sb;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * sb = new SAXBuilder();
 * 
 * String paramString = "<params><param name=\"warrantID\">1234"
 * + "</param></params>";
 * Document doc = sb.build(new StringReader(paramString));
 * Element warrantParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/WarrantServiceLocal",
 * "getWarrantSummaryLocal2", warrantParams);
 * control.setReturnValue(new Document(new Element("ds")));
 * 
 * control.replay();
 * 
 * warrant = Warrant.getInstance("1234", adaptor);
 * }
 * 
 * public void testNullWarrant() throws Exception
 * {
 * warrant.createFullyPaidWarrantReturns(null);
 * warrant.errorFullyPaidWarrantReturns();
 * assertEquals("case no", "", warrant.getCaseNumber());
 * assertEquals("co type", "", warrant.getCoType());
 * assertEquals("court code", "", warrant.getCourtCode());
 * assertEquals("enf number", "", warrant.getEnforcementNumber());
 * assertEquals("enf type", "", warrant.getEnforcementType());
 * assertEquals("number defendants", 0, warrant.getNumberDefendants());
 * assertEquals("number events", 0, warrant.getNumberEvents());
 * assertEquals("balance", 0, warrant.getOutstandingBalance(), 0);
 * assertEquals("war ex court", "",
 * warrant.getWarrantExecutingCourt());
 * assertEquals("war id", "", warrant.getWarrantId());
 * assertEquals("war iss court", "", warrant.getWarrantIssuingCourt());
 * assertEquals("war type", "", warrant.getWarrantType());
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestNullWarrant.class);
 * }
 * 
 * }
 * //[enddef] */