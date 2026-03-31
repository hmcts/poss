// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * import java.util.Date;
 * 
 * import junit.framework.TestCase;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.ConsolidatedOrder;
 * import uk.gov.dca.caseman.payments_service.java.util.Payment;
 * import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
 * import uk.gov.dca.caseman.payments_service.java.util.events.*;
 * 
 * public class TestCoRefresh extends TestCase {
 * 
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private SAXBuilder sb;
 * private Element coEl;
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
 * Element constructParams = doc.getRootElement();
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
 * public void testStatusLiveAndPaidWithSched2Debts() throws Exception
 * {
 * coEl.getChild("Status").setText("LIVE");
 * setupGetCoBalance(true);
 * setupGetSchedule2Debts(true);
 * setupUpdateSchedule2Debts();
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * if(co.hasStatusChanged()) {
 * co.updateEvents();
 * }
 * co.updateFeeAmount();
 * 
 * assertEquals("co status", "LIVE", co.getStatus());
 * assertTrue("is live", co.isLive());
 * assertFalse("is not paid", co.isPaid());
 * 
 * control.verify();
 * }
 * 
 * public void testStatusLiveAndPaidWithNoSched2DebtsEventNotExists()
 * throws Exception
 * {
 * coEl.getChild("Status").setText("LIVE");
 * setupGetCoBalance(true);
 * setupGetSchedule2Debts(false);
 * setupExists(new Element("ds"));
 * setupFireCoEvent();
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * if(co.hasStatusChanged()) {
 * co.updateEvents();
 * }
 * co.updateFeeAmount();
 * 
 * assertEquals("co status", "PAID", co.getStatus());
 * assertTrue("is paid", co.isPaid());
 * assertFalse("is not live", co.isLive());
 * 
 * control.verify();
 * }
 * 
 * public void testStatusLiveAndPaidWithNoSched2DebtsEventExists()
 * throws Exception
 * {
 * coEl.getChild("Status").setText("LIVE");
 * setupGetCoBalance(true);
 * setupGetSchedule2Debts(false);
 * setupExists(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * if(co.hasStatusChanged()) {
 * co.updateEvents();
 * }
 * co.updateFeeAmount();
 * 
 * assertEquals("co status", "PAID", co.getStatus());
 * assertTrue("is paid", co.isPaid());
 * assertFalse("is not live", co.isLive());
 * 
 * control.verify();
 * }
 * 
 * public void testStatusPaidAndPaidWithSched2Debts() throws Exception
 * {
 * setupGetCoBalance(true);
 * setupGetSchedule2Debts(true);
 * setupUpdateSchedule2Debts();
 * setupExists(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("Y")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * if(co.hasStatusChanged()) {
 * co.updateEvents();
 * }
 * co.updateFeeAmount();
 * 
 * assertEquals("co status", "LIVE", co.getStatus());
 * assertTrue("is live", co.isLive());
 * assertFalse("is not paid", co.isPaid());
 * 
 * control.verify();
 * }
 * 
 * public void testStatusPaidAndPaidWithNoSched2Debts() throws Exception
 * {
 * setupGetCoBalance(true);
 * setupGetSchedule2Debts(false);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * if(co.hasStatusChanged()) {
 * co.updateEvents();
 * }
 * co.updateFeeAmount();
 * 
 * assertEquals("co status", "PAID", co.getStatus());
 * assertTrue("is paid", co.isPaid());
 * assertFalse("is not live", co.isLive());
 * 
 * control.verify();
 * }
 * 
 * public void testStatusPaidButNotPaid() throws Exception
 * {
 * setupGetCoBalance(false);
 * setupExists(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("Y")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * if(co.hasStatusChanged()) {
 * co.updateEvents();
 * }
 * co.updateFeeAmount();
 * 
 * assertEquals("co status", "LIVE", co.getStatus());
 * assertTrue("is live", co.isLive());
 * assertFalse("is not paid", co.isPaid());
 * 
 * control.verify();
 * }
 * 
 * public void testStatusLiveAndNotPaid() throws Exception
 * {
 * coEl.getChild("Status").setText("LIVE");
 * setupGetCoBalance(false);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * if(co.hasStatusChanged()) {
 * co.updateEvents();
 * }
 * co.updateFeeAmount();
 * 
 * assertEquals("co status", "LIVE", co.getStatus());
 * assertFalse("is not paid", co.isPaid());
 * assertTrue("is live", co.isLive());
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateStatusNegBalanceNoSched2s() throws Exception
 * {
 * coEl.getChild("Status").setText("LIVE");
 * setupGetCoBalance(true);
 * setupGetSchedule2Debts(false);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * 
 * assertEquals("co status", "PAID", co.getStatus());
 * assertTrue("is paid", co.isPaid());
 * assertFalse("is not live", co.isLive());
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateStatusPositiveBalanceNoSched2s() throws Exception
 * {
 * setupGetCoBalance(false);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * 
 * assertEquals("co status", "LIVE", co.getStatus());
 * assertFalse("is not paid", co.isPaid());
 * assertTrue("is live", co.isLive());
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateStatusZeroBalanceSched2s() throws Exception
 * {
 * coEl.getChild("Status").setText("LIVE");
 * setupGetCoBalance("0", "0");
 * setupGetSchedule2Debts(true);
 * setupUpdateSchedule2Debts();
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateStatus();
 * 
 * assertEquals("co status", "LIVE", co.getStatus());
 * assertFalse("is not paid", co.isPaid());
 * assertTrue("is live", co.isLive());
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateEventsLiveEventNotExists() throws Exception
 * {
 * coEl.getChild("Status").setText("LIVE");
 * setupExists(new Element("ds"));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateEvents();
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateEventsPaidEventNotExists() throws Exception
 * {
 * setupExists(new Element("ds"));
 * setupFireCoEvent();
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateEvents();
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateEventsLiveEventExists() throws Exception
 * {
 * coEl.getChild("Status").setText("LIVE");
 * setupExists(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("Y")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateEvents();
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateEventsPaidEventExists() throws Exception
 * {
 * setupExists(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * 
 * co.updateEvents();
 * 
 * control.verify();
 * }
 * 
 * public void testGetFullyPaidEvent() throws Exception
 * {
 * adaptor.getCourtId();
 * control.setReturnValue("999");
 * 
 * adaptor.getUserId();
 * control.setReturnValue("azsnn1");
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * assertTrue(co.getFullyPaidEvent() instanceof CoEvent);
 * 
 * control.verify();
 * }
 * 
 * private void setupGetSchedule2Debts(boolean debtsExist) throws Exception
 * {
 * String getSched2ParamsString = "<params><param name=\"coNumber\">1234"
 * + "</param></params>";
 * Document doc = sb.build(new StringReader(getSched2ParamsString));
 * Element getSched2Params = doc.getRootElement();
 * 
 * Element sched2s = new Element("Debts");
 * if(debtsExist) {
 * Element sched2debt1 = new Element("Debt");
 * sched2s.addContent(sched2debt1);
 * sched2debt1.addContent(new Element("DebtSeq").setText("1"));
 * sched2debt1.addContent(new Element("CONumber").setText("1234"));
 * sched2debt1.addContent(new Element("Status").setText("SCHEDULE2"));
 * sched2debt1.addContent(
 * new Element("DebtAmountAllowed").setText("12"));
 * Element sched2debt2 = new Element("Debt");
 * sched2s.addContent(sched2debt2);
 * sched2debt2.addContent(new Element("DebtSeq").setText("2"));
 * sched2debt2.addContent(new Element("CONumber").setText("1234"));
 * sched2debt2.addContent(new Element("Status").setText("SCHEDULE2"));
 * sched2debt2.addContent(
 * new Element("DebtAmountAllowed").setText("1.2"));
 * }
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getSchedule2DebtsLocal2", getSched2Params);
 * control.setReturnValue(new Document(sched2s));
 * }
 * 
 * private void setupGetCoBalance(boolean isPaid) throws Exception
 * {
 * if(isPaid) {
 * setupGetCoBalance("97.01", "101.26");
 * }
 * else {
 * setupGetCoBalance("99.32", "54.25");
 * }
 * }
 * 
 * private void setupGetCoBalance(String amount, String paid) throws Exception
 * {
 * String paramString = "<params><param name=\"coNumber\">1234"
 * + "</param></params>";
 * Document doc = sb.build(new StringReader(paramString));
 * Element constructParams = doc.getRootElement();
 * 
 * Element balanceReturn = new Element("ds");
 * Element debt1 = new Element("Debt");
 * balanceReturn.addContent(debt1);
 * 
 * debt1.addContent(new Element("AmountAllowed").setText(amount));
 * debt1.addContent(new Element("PaidToDate").setText(paid));
 * debt1.addContent(new Element("Status").setText("LIVE"));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getCoBalanceLocal2", constructParams);
 * control.setReturnValue(new Document(balanceReturn));
 * }
 * 
 * private void setupUpdateSchedule2Debts() throws Exception
 * {
 * String updateParamString = "<params><param name=\"debts\"><Debts>"
 * + "<Debt><DebtSeq>1</DebtSeq><CONumber>1234</CONumber>"
 * + "<Status>LIVE</Status>"
 * + "<DebtAmountAllowed>12</DebtAmountAllowed></Debt>"
 * + "<Debt><DebtSeq>2</DebtSeq><CONumber>1234</CONumber>"
 * + "<Status>LIVE</Status>"
 * + "<DebtAmountAllowed>1.2</DebtAmountAllowed></Debt>"
 * + "</Debts></param></params>";
 * Document doc = sb.build(new StringReader(updateParamString));
 * Element updateParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "updateSchedule2DebtsLocal2", updateParams);
 * control.setReturnValue(null);
 * }
 * 
 * private void setupExists(Element returnEvent) throws Exception
 * {
 * adaptor.getCourtId();
 * control.setReturnValue("999");
 * 
 * adaptor.getUserId();
 * control.setReturnValue("azsnn1");
 * 
 * String eventParamString = "<params><param name=\"coNumber\">1234"
 * + "</param><param name=\"debtSeq\"></param>"
 * + "<param name=\"coEventId\">975</param></params>";
 * 
 * Document doc = sb.build(new StringReader(eventParamString));
 * Element eventParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoEventLocal2", eventParams);
 * control.setReturnValue(new Document(new Element("ds").addContent(
 * returnEvent)));
 * }
 * 
 * private void setupFireCoEvent() throws Exception
 * {
 * String date = Payment.getSupsDateFormat().format(new Date());
 * String eventFireString = "<params><param name=\"coEvent\"><COEvent>"
 * + "<HrgSeq></HrgSeq>"
 * + "<IssueStage></IssueStage>"
 * + "<WarrantId></WarrantId>"
 * + "<ErrorInd>N</ErrorInd>"
 * + "<ProcessDate></ProcessDate>"
 * + "<ReceiptDate>" + date + "</ReceiptDate>"
 * + "<EventDate>" + date + "</EventDate>"
 * + "<CreatingSection></CreatingSection>"
 * + "<BMSTask></BMSTask>"
 * + "<DebtSeqNumber></DebtSeqNumber>"
 * + "<OwningCourtCode>999</OwningCourtCode>"
 * + "<AgeCategory></AgeCategory>"
 * + "<CONumber>1234</CONumber>"
 * + "<Service></Service>"
 * + "<CreatingCourt></CreatingCourt>"
 * + "<COEventSeq></COEventSeq>"
 * + "<BailiffId></BailiffId>"
 * + "<EventDetails></EventDetails>"
 * + "<StandardEventDescription>StandardEventDescription"
 * + "</StandardEventDescription>"
 * + "<StatsModule></StatsModule>"
 * + "<ProcessStage>AUTO</ProcessStage>"
 * + "<UserName>azsnn1</UserName>"
 * + "<ServiceDate>" + date + "</ServiceDate>"
 * + "<StandardEventId>975</StandardEventId>"
 * + "</COEvent></param></params>";
 * Document doc = sb.build(new StringReader(eventFireString));
 * Element eventFireParam = doc.getRootElement();
 * 
 * adaptor.callService("ejb/CoEventServiceLocal",
 * "insertCoEventAutoExtLocal2", eventFireParam);
 * control.setReturnValue(null);
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestCoRefresh.class);
 * }
 * 
 * }
 * //[enddef] */