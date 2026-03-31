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
 * public class TestCo extends TestCase {
 * 
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private SAXBuilder sb;
 * private Element coEl;
 * private Element constructParams;
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
 * constructParams = doc.getRootElement();
 * 
 * coEl = new Element("Co");
 * coEl.addContent(new Element("CONumber").setText("1234"));
 * coEl.addContent(new Element("COType").setText("AO"));
 * coEl.addContent(new Element("DebtorName").setText("A"));
 * coEl.addContent(new Element("Status").setText("PAID"));
 * coEl.addContent(new Element("FeeRate").setText("2.21"));
 * coEl.addContent(new Element("FeeAmount").setText("4.53"));
 * coEl.addContent(new Element("CoAmount").setText("45.85"));
 * coEl.addContent(new Element("Schedule2Amount").setText("41.22"));
 * coEl.addContent(new Element("PassthroughAmount").setText("12.58"));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoLocal2", constructParams);
 * control.setReturnValue(new Document(coEl));
 * }
 * 
 * public void testUpdateFeeAmount() throws Exception
 * {
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateFeeAmount();
 * assertEquals("fee 1", 1.58, co.getFeeAmount(), 0);
 * coEl.getChild("FeeRate").setText("3.58");
 * co.updateFeeAmount();
 * assertEquals("fee 2", 2.62, co.getFeeAmount(), 0);
 * coEl.getChild("CoAmount").setText("33.79");
 * co.updateFeeAmount();
 * assertEquals("fee 3", 2.19, co.getFeeAmount(), 0);
 * coEl.getChild("Schedule2Amount").setText("99.25");
 * co.updateFeeAmount();
 * assertEquals("fee 4", 4.27, co.getFeeAmount(), 0);
 * coEl.getChild("PassthroughAmount").setText("22.65");
 * co.updateFeeAmount();
 * assertEquals("fee 5", 3.91, co.getFeeAmount(), 0);
 * co.updateFeeAmount();
 * assertEquals("fee 5 repeat", 3.91, co.getFeeAmount(), 0);
 * 
 * control.verify();
 * }
 * 
 * public void testHasStatusChanged() throws Exception
 * {
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * assertFalse("before change", co.hasStatusChanged());
 * coEl.getChild("Status").setText("LIVE");
 * assertTrue("after change", co.hasStatusChanged());
 * coEl.getChild("Status").setText("PAID");
 * assertFalse("after reset", co.hasStatusChanged());
 * 
 * control.verify();
 * }
 * 
 * public void testGetDebtNotExists() throws Exception
 * {
 * String debtParamsString = "<params><param name=\"debtSeq\">145</param>"
 * + "<param name=\"coNumber\">1234</param></params>";
 * Document doc = sb.build(new StringReader(debtParamsString));
 * Element debtParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughDebtLocal2", debtParams);
 * control.setReturnValue(new Document(new Element("ds")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * assertTrue(debt instanceof NullDebt);
 * 
 * control.verify();
 * }
 * 
 * public void testGetDebtExists() throws Exception
 * {
 * String debtParamsString = "<params><param name=\"debtSeq\">145</param>"
 * + "<param name=\"coNumber\">1234</param></params>";
 * Document doc = sb.build(new StringReader(debtParamsString));
 * Element debtParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughDebtLocal2", debtParams);
 * control.setReturnValue(new Document(new Element("ds").addContent(
 * new Element("Debt"))));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * co.getDebt("145");
 * co.getDebt("145");
 * 
 * control.verify();
 * }
 * 
 * public void testGetDebtNullDebtSeq() throws Exception
 * {
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * try {
 * co.getDebt(null);
 * fail("should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * 
 * control.verify();
 * }
 * 
 * public void testGetCoBalance() throws Exception
 * {
 * Element balanceReturn = new Element("ds");
 * Element debt1 = new Element("Debt");
 * balanceReturn.addContent(debt1);
 * debt1.addContent(new Element("AmountAllowed").setText("1.25"));
 * debt1.addContent(new Element("PaidToDate").setText("0.25"));
 * debt1.addContent(new Element("Status").setText("LIVE"));
 * Element debt2 = new Element("Debt");
 * balanceReturn.addContent(debt2);
 * debt2.addContent(new Element("AmountAllowed").setText("5.25"));
 * debt2.addContent(new Element("PaidToDate").setText("3.24"));
 * debt2.addContent(new Element("Status").setText("PAYED"));
 * Element debt3 = new Element("Debt");
 * balanceReturn.addContent(debt3);
 * debt3.addContent(new Element("AmountAllowed").setText("7.52"));
 * debt3.addContent(new Element("PaidToDate").setText("6.99"));
 * debt3.addContent(new Element("Status").setText("LIVE"));
 * Element debt4 = new Element("Debt");
 * balanceReturn.addContent(debt4);
 * debt4.addContent(new Element("AmountAllowed").setText("4.25"));
 * debt4.addContent(new Element("PaidToDate").setText("4.22"));
 * debt4.addContent(new Element("Status").setText("PAID"));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getCoBalanceLocal2", constructParams);
 * control.setReturnValue(new Document(balanceReturn));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * assertEquals("coBalance", 1.56,
 * co.getCoBalance(new String[]{"PAID", "LIVE"}), 0);
 * 
 * control.verify();
 * }
 * 
 * public void testGetCoBalanceNoDebts() throws Exception
 * {
 * Element balanceReturn = new Element("ds");
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getCoBalanceLocal2", constructParams);
 * control.setReturnValue(new Document(balanceReturn));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * try {
 * co.getCoBalance(new String[]{"PAID", "LIVE"});
 * fail("should have thrown IllegalStateException");
 * }
 * catch(IllegalStateException e) {}
 * 
 * control.verify();
 * }
 * 
 * public void testSave() throws Exception
 * {
 * String saveParamsString = "<params><param name=\"co\"><Co>"
 * + "<CONumber>1234</CONumber>"
 * + "<COType>AO</COType>"
 * + "<DebtorName>A</DebtorName>"
 * + "<Status>PAID</Status>"
 * + "<FeeRate>2.21</FeeRate>"
 * + "<FeeAmount>4.53</FeeAmount>"
 * + "<CoAmount>45.85</CoAmount>"
 * + "<Schedule2Amount>41.22</Schedule2Amount>"
 * + "<PassthroughAmount>12.58</PassthroughAmount>"
 * + "</Co></param></params>";
 * Document doc = sb.build(new StringReader(saveParamsString));
 * Element saveParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "updatePassthroughCoLocal2", saveParams);
 * control.setReturnValue(new Document((Element)coEl.clone()));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * co.save();
 * assertEquals("debtor name", "A", co.getDebtorName());
 * 
 * control.verify();
 * }
 * 
 * public void testCoExists() throws Exception
 * {
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * assertEquals("co number", "1234", co.getCoNumber());
 * assertEquals("co type", "AO", co.getCoType());
 * assertTrue("is ao", co.isAoCo());
 * assertFalse("isn't caeo", co.isCaeoCo());
 * assertEquals("co status", "PAID", co.getStatus());
 * assertTrue("is paid", co.isPaid());
 * assertFalse("isn't live", co.isLive());
 * assertEquals("fee rate", 2.21, co.getFeeRate(), 0);
 * assertEquals("fee amount", 4.53, co.getFeeAmount(), 0);
 * assertEquals("co amount", 45.85, co.getCoAmount(), 0);
 * assertEquals("schedule 2 amount", 41.22, co.getSchedule2Amount(), 0);
 * assertEquals("passthrough amount", 12.58, co.getPassthroughAmount(), 0);
 * 
 * assertNotSame("toElement not same", coEl, co.toElement());
 * assertTrue("toElement equals",
 * new ElementMatcher().argumentMatches(coEl, co.toElement()));
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestCo.class);
 * }
 * 
 * }
 * //[enddef] */