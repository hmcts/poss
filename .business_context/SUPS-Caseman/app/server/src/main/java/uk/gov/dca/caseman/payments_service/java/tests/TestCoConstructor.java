// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.input.SAXBuilder;
 * 
 * import junit.framework.TestCase;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestCoConstructor extends TestCase {
 * 
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
 * }
 * 
 * public void testNullCoNumber() throws Exception
 * {
 * try {
 * ConsolidatedOrder.getCo(null, adaptor);
 * fail("should have thrown a NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testNullServices() throws Exception
 * {
 * try {
 * ConsolidatedOrder.getCo("1234", null);
 * fail("should have thrown a NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testNoMatchingCos() throws Exception
 * {
 * String paramString = "<params><param name=\"coNumber\">1234"
 * + "</param></params>";
 * Document doc = sb.build(new StringReader(paramString));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoLocal2", doc.getRootElement());
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * assertTrue(co instanceof NullConsolidatedOrder);
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestCoConstructor.class);
 * }
 * 
 * }
 * //[enddef] */