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
 * import uk.gov.dca.caseman.payments_service.java.util.ConsolidatedOrder;
 * import uk.gov.dca.caseman.payments_service.java.util.Debt;
 * import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
 * import uk.gov.dca.caseman.payments_service.java.util.events.NullEvent;
 * 
 * public class TestNullDebt extends TestCase {
 * 
 * private Debt debt;
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
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * debt = co.getDebt("123");
 * }
 * 
 * public void testNullDebt() throws Exception
 * {
 * assertEquals("amount", 0, debt.getAmount(), 0);
 * assertEquals("case number", "", debt.getCaseNumber());
 * assertEquals("balance", 0, debt.getDebtBalance(), 0);
 * assertEquals("paid to date", 0, debt.getDebtPaidToDate(), 0);
 * assertEquals("debt seq", "", debt.getDebtSeq());
 * assertEquals("def case party no", "",
 * debt.getDefendantCasePartyNumber());
 * assertEquals("def party role code", "",
 * debt.getDefendantPartyRoleCode());
 * assertEquals("original amount", 0, debt.getOriginalDebtAmount(), 0);
 * assertEquals("status", "", debt.getStatus());
 * assertFalse("isn't live", debt.isLive());
 * assertFalse("isn't paid", debt.isPaid());
 * assertFalse("status changed", debt.hasStatusChanged());
 * 
 * assertEquals("get events", 0, debt.getEvents().size());
 * 
 * assertTrue("fully paid event",
 * debt.getFullyPaidEvent() instanceof NullEvent);
 * assertTrue("status changed event",
 * debt.getStatusChangedEvent() instanceof NullEvent);
 * 
 * debt.updateStatus();
 * debt.updateEvents();
 * debt.save();
 * 
 * control.verify();
 * }
 * 
 * public void testToElement()
 * {
 * Element debtEl = new Element("Debt");
 * debtEl.addContent(new Element("DebtSeq"));
 * debtEl.addContent(new Element("Amount"));
 * debtEl.addContent(new Element("Status"));
 * debtEl.addContent(
 * new Element("DefendantPartyRoleCode"));
 * debtEl.addContent(new Element("DefendantCasePartyNumber"));
 * debtEl.addContent(new Element("OriginalDebt"));
 * debtEl.addContent(new Element("CaseNumber"));
 * 
 * assertTrue(
 * new ElementMatcher().argumentMatches(debtEl, debt.toElement()));
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestNullDebt.class);
 * }
 * 
 * }
 * //[enddef] */