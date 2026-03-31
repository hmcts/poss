// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import junit.framework.TestCase;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestWarrantGetInstance extends TestCase {
 * 
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private Element paymentEl;
 * private Element params;
 * private SAXBuilder sb;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * 
 * paymentEl = new Element("Payment");
 * paymentEl.addContent(new Element("EnforcementCourt").setText("A"));
 * paymentEl.addContent(new Element("EnforcementType")
 * .setText("HOME WARRANT"));
 * paymentEl.addContent(new Element("EnforcementNumber").setText("B"));
 * 
 * String paramString = "<params><param name=\"warrantID\">1234"
 * + "</param></params>";
 * sb = new SAXBuilder();
 * Document doc = sb.build(new StringReader(paramString));
 * params = doc.getRootElement();
 * }
 * 
 * public void testNullAdaptorParam() throws Exception
 * {
 * try {
 * Warrant.getInstance("1234", null);
 * fail("should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testNullWarrantId() throws Exception
 * {
 * try {
 * Warrant.getInstance((String)null, adaptor);
 * fail("should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testWarrantNoExists() throws Exception
 * {
 * adaptor.callService("ejb/WarrantServiceLocal",
 * "getWarrantSummaryLocal2", params);
 * control.setReturnValue(new Document(new Element("ds")));
 * 
 * control.replay();
 * 
 * Warrant w = Warrant.getInstance("1234", adaptor);
 * assertTrue(w instanceof NullWarrant);
 * 
 * control.verify();
 * }
 * 
 * public void testHomeWarrantExists() throws Exception
 * {
 * Element warrantSummary = new Element("ds").addContent(
 * new Element("Warrant"));
 * Element w = warrantSummary.getChild("Warrant");
 * w.addContent(new Element("WarrantNumber").setText("A"));
 * w.addContent(new Element("LocalNumber"));
 * w.addContent(new Element("IssuedBy").setText("C"));
 * w.addContent(new Element("OwnedBy").setText("D"));
 * 
 * adaptor.callService("ejb/WarrantServiceLocal",
 * "getWarrantSummaryLocal2", params);
 * control.setReturnValue(new Document(warrantSummary));
 * 
 * String enfParamString = "<params><param name=\"issuingCourt\">C</param>"
 * + "<param name=\"owningCourt\">D</param>"
 * + "<param name=\"enforcementNumber\">A</param>"
 * + "<param name=\"enforcementType\">HOME WARRANT</param></params>";
 * Document doc = sb.build(new StringReader(enfParamString));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", doc.getRootElement());
 * control.setReturnValue(new Document(new Element("Enforcement")));
 * 
 * control.replay();
 * 
 * Warrant.getInstance("1234", adaptor);
 * 
 * control.verify();
 * }
 * 
 * public void testForeignWarrantExists() throws Exception
 * {
 * Element warrantSummary = new Element("ds").addContent(
 * new Element("Warrant"));
 * Element w = warrantSummary.getChild("Warrant");
 * w.addContent(new Element("WarrantNumber").setText("A"));
 * w.addContent(new Element("LocalNumber").setText("B"));
 * w.addContent(new Element("IssuedBy").setText("C"));
 * w.addContent(new Element("OwnedBy").setText("D"));
 * 
 * adaptor.callService("ejb/WarrantServiceLocal",
 * "getWarrantSummaryLocal2", params);
 * control.setReturnValue(new Document(warrantSummary));
 * 
 * String enfParamString = "<params><param name=\"issuingCourt\">C</param>"
 * + "<param name=\"owningCourt\">D</param>"
 * + "<param name=\"enforcementNumber\">B</param>"
 * + "<param name=\"enforcementType\">FOREIGN WARRANT"
 * + "</param></params>";
 * Document doc = sb.build(new StringReader(enfParamString));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", doc.getRootElement());
 * control.setReturnValue(new Document(new Element("Enforcement")));
 * 
 * control.replay();
 * 
 * Warrant.getInstance("1234", adaptor);
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestWarrantGetInstance.class);
 * }
 * 
 * }
 * //[enddef] */