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
 * import uk.gov.dca.caseman.payments_service.java.util.events.*;
 * 
 * public class TestNullCO extends TestCase {
 * 
 * private ConsolidatedOrder co;
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
 * co = ConsolidatedOrder.getCo("1234", adaptor);
 * }
 * 
 * public void testNullCo() throws Exception
 * {
 * assertTrue("null debt", co.getDebt("12") instanceof NullDebt);
 * co.save();
 * 
 * co.updateStatus();
 * assertFalse("status changed", co.hasStatusChanged());
 * co.updateEvents();
 * co.updateFeeAmount();
 * assertTrue("get fully paid event",
 * co.getFullyPaidEvent() instanceof NullEvent);
 * 
 * assertEquals("co balance", 0, co.getCoBalance(new String[]{"LIVE"}), 0);
 * assertEquals("co amount", 0, co.getCoAmount(), 0);
 * assertEquals("co number", "", co.getCoNumber());
 * assertEquals("co type", "", co.getCoType());
 * assertEquals("debtor name", "", co.getDebtorName());
 * assertEquals("fee amount", 0, co.getFeeAmount(), 0);
 * assertEquals("fee rate", 0, co.getFeeRate(), 0);
 * assertEquals("passthrough amount", 0, co.getPassthroughAmount(), 0);
 * assertEquals("sched 2 amount", 0, co.getSchedule2Amount(), 0);
 * assertEquals("status", "", co.getStatus());
 * assertFalse("is ao", co.isAoCo());
 * assertFalse("is caeo", co.isCaeoCo());
 * assertFalse("is live", co.isLive());
 * assertFalse("is paid", co.isPaid());
 * 
 * control.verify();
 * }
 * 
 * public void testToElement()
 * {
 * Element coEl = new Element("Co");
 * coEl.addContent(new Element("CONumber").setText(""));
 * coEl.addContent(new Element("COType").setText(""));
 * coEl.addContent(new Element("DebtorName").setText(""));
 * coEl.addContent(new Element("Status").setText(""));
 * coEl.addContent(new Element("FeeRate").setText(""));
 * coEl.addContent(new Element("FeeAmount").setText(""));
 * coEl.addContent(new Element("CoAmount").setText(""));
 * coEl.addContent(new Element("Schedule2Amount").setText(""));
 * coEl.addContent(new Element("PassthroughAmount").setText(""));
 * 
 * assertTrue(new ElementMatcher().argumentMatches(coEl, co.toElement()));
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestNullCO.class);
 * }
 * 
 * }
 * //[enddef] */