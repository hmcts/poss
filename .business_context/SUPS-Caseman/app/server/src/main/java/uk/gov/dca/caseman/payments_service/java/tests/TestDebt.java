// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * import java.util.Date;
 * import java.util.List;
 * import java.util.Iterator;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import junit.framework.TestCase;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * import uk.gov.dca.caseman.payments_service.java.util.events.*;
 * 
 * public class TestDebt extends TestCase {
 * 
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private SAXBuilder sb;
 * private Element debtEl;
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
 * 
 * String debtParamsString = "<params><param name=\"debtSeq\">145</param>"
 * + "<param name=\"coNumber\">1234</param></params>";
 * doc = sb.build(new StringReader(debtParamsString));
 * Element debtParams = doc.getRootElement();
 * 
 * debtEl = new Element("ds");
 * Element debt = new Element("Debt");
 * debtEl.addContent(debt);
 * debt.addContent(new Element("DebtSeq").setText("145"));
 * debt.addContent(new Element("Amount").setText("52.25"));
 * debt.addContent(new Element("Status").setText("LIVE"));
 * debt.addContent(
 * new Element("DefendantPartyRoleCode").setText("DEFENDANT"));
 * debt.addContent(new Element("DefendantCasePartyNumber").setText("1"));
 * debt.addContent(new Element("OriginalDebt").setText("15.25"));
 * debt.addContent(new Element("CaseNumber").setText("5555"));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughDebtLocal2", debtParams);
 * control.setReturnValue(new Document(debtEl));
 * }
 * 
 * public void testHasStatusChanged() throws Exception
 * {
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * assertFalse("after construct", debt.hasStatusChanged());
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * assertTrue("after PAID", debt.hasStatusChanged());
 * debtEl.getChild("Debt").getChild("Status").setText("LIVE");
 * assertFalse("after back to LIVE", debt.hasStatusChanged());
 * 
 * control.verify();
 * }
 * 
 * public void testRefeshStatusLiveDebtPaid() throws Exception
 * {
 * setupGetDebtPaidToDate(52.25);
 * setupUpdateEventFlag(new Element("NotACoEvent"));
 * setupFireCoCaseEvent("PAID");
 * setupFireCoEvent();
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * debt.updateStatus();
 * if(debt.hasStatusChanged()) {
 * debt.updateEvents();
 * }
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshStatusPaidDebtNotPaid() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * setupGetDebtPaidToDate(42.25);
 * setupUpdateEventFlag(new Element("NotACoEvent"));
 * setupFireCoCaseEvent("LIVE");
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * debt.updateStatus();
 * if(debt.hasStatusChanged()) {
 * debt.updateEvents();
 * }
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshStatusLiveDebtPaidNotAoCoEventNotExists()
 * throws Exception
 * {
 * coEl.getChild("COType").setText("CAEO");
 * setupGetDebtPaidToDate(52.25);
 * setupUpdateEventFlag(new Element("NotACoEvent"));
 * setupFireCoEvent();
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * debt.updateStatus();
 * if(debt.hasStatusChanged()) {
 * debt.updateEvents();
 * }
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshStatusLiveDebtPaidNoCaseNumberCoEventExists()
 * throws Exception
 * {
 * debtEl.getChild("Debt").getChild("CaseNumber").setText("");
 * setupGetDebtPaidToDate(52.25);
 * setupUpdateEventFlag(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * debt.updateStatus();
 * if(debt.hasStatusChanged()) {
 * debt.updateEvents();
 * }
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshStatusPaidDebtNotPaidNoCaseNumberCoEventExists()
 * throws Exception
 * {
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * debtEl.getChild("Debt").getChild("CaseNumber").setText("");
 * setupGetDebtPaidToDate(42.25);
 * setupUpdateEventFlag(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("Y")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * debt.updateStatus();
 * if(debt.hasStatusChanged()) {
 * debt.updateEvents();
 * }
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshStatusLiveDebtPaidNotAoCoEventExists()
 * throws Exception
 * {
 * coEl.getChild("COType").setText("CAEO");
 * setupGetDebtPaidToDate(52.25);
 * setupUpdateEventFlag(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * debt.updateStatus();
 * if(debt.hasStatusChanged()) {
 * debt.updateEvents();
 * }
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshStatusPaidDebtPaid() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * setupGetDebtPaidToDate(52.25);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * debt.updateStatus();
 * if(debt.hasStatusChanged()) {
 * debt.updateEvents();
 * }
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshStatusLiveDebtNotPaid() throws Exception
 * {
 * setupGetDebtPaidToDate(42.25);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * debt.updateStatus();
 * if(debt.hasStatusChanged()) {
 * debt.updateEvents();
 * }
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateEventsPaidEventNotExists() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("CaseNumber").setText("");
 * 
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * setupUpdateEventFlag(new Element("sadfsda"));
 * 
 * setupFireCoEvent();
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * debt.updateEvents();
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateEventsLiveEventExists() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("CaseNumber").setText("");
 * 
 * debtEl.getChild("Debt").getChild("Status").setText("LIVE");
 * setupUpdateEventFlag(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("Y")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * debt.updateEvents();
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateEventsPaidEventExists() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("CaseNumber").setText("");
 * 
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * setupUpdateEventFlag(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * debt.updateEvents();
 * 
 * control.verify();
 * }
 * 
 * public void testGetEvents() throws Exception
 * {
 * adaptor.getCourtId();
 * control.setReturnValue("999");
 * 
 * adaptor.getUserId();
 * control.setReturnValue("azsnn1");
 * 
 * setupUpdateEventFlag(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * List events = debt.getEvents();
 * 
 * assertEquals("list size", 2, events.size());
 * 
 * Iterator i = events.iterator();
 * for(int j = 0; i.hasNext(); ++j) {
 * assertTrue("element " + j, i.next() instanceof Event);
 * }
 * 
 * control.verify();
 * }
 * 
 * public void testGetFullyPaidEventLiveEventNotExists() throws Exception
 * {
 * setupUpdateEventFlag(new Element("NotACoEvent"));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * assertTrue(debt.getFullyPaidEvent() instanceof NullEvent);
 * 
 * control.verify();
 * }
 * 
 * public void testGetFullyPaidEventPaidEventNotExists() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * setupUpdateEventFlag(new Element("NotACoEvent"));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * assertTrue(debt.getFullyPaidEvent() instanceof CoEvent);
 * 
 * control.verify();
 * }
 * 
 * public void testGetFullyPaidEventPaidEventExists() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * setupUpdateEventFlag(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * assertTrue(debt.getFullyPaidEvent() instanceof CoEvent);
 * 
 * control.verify();
 * }
 * 
 * public void testGetFullyPaidEventLiveEventExists() throws Exception
 * {
 * setupUpdateEventFlag(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * assertTrue(debt.getFullyPaidEvent() instanceof CoEvent);
 * 
 * control.verify();
 * }
 * 
 * public void testGetStatusChangedEventNoCase() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("CaseNumber").setText("");
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * assertTrue(debt.getStatusChangedEvent() instanceof NullEvent);
 * 
 * control.verify();
 * }
 * 
 * public void testGetStatusChangedEventNotAo() throws Exception
 * {
 * coEl.getChild("COType").setText("CAEO");
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * assertTrue(debt.getStatusChangedEvent() instanceof NullEvent);
 * 
 * control.verify();
 * }
 * 
 * public void testGetStatusChangedEvent() throws Exception
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
 * Debt debt = co.getDebt("145");
 * 
 * assertTrue(debt.getStatusChangedEvent() instanceof Event777);
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateStatusPaidToPaid() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * setupGetDebtPaidToDate(52.25);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * assertTrue("before update", debt.isPaid());
 * debt.updateStatus();
 * assertTrue("after update", debt.isPaid());
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateStatusLiveToLive() throws Exception
 * {
 * setupGetDebtPaidToDate(2.56);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * assertTrue("before update", debt.isLive());
 * debt.updateStatus();
 * assertTrue("after update", debt.isLive());
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateStatusPaidToLive() throws Exception
 * {
 * debtEl.getChild("Debt").getChild("Status").setText("PAID");
 * setupGetDebtPaidToDate(2.56);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * assertTrue("before update paid", debt.isPaid());
 * assertFalse("before update not live", debt.isLive());
 * assertEquals("before update status", "PAID", debt.getStatus());
 * debt.updateStatus();
 * assertTrue("after update live", debt.isLive());
 * assertFalse("after update not paid", debt.isPaid());
 * assertEquals("after update status", "LIVE", debt.getStatus());
 * 
 * control.verify();
 * }
 * 
 * public void testUpdateStatusLiveToPaid() throws Exception
 * {
 * setupGetDebtPaidToDate(52.25);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * assertTrue("before update", debt.isLive());
 * debt.updateStatus();
 * assertTrue("after update", debt.isPaid());
 * 
 * control.verify();
 * }
 * 
 * public void testNegativeBalance() throws Exception
 * {
 * setupGetDebtPaidToDate(62.34);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * try {
 * debt.getDebtBalance();
 * fail("should have thrown IllegalStateException");
 * }
 * catch(IllegalStateException e) {}
 * 
 * control.verify();
 * }
 * 
 * public void testSave() throws Exception
 * {
 * String saveParamsString = "<params><param name=\"debtSeq\">145</param>"
 * + "<param name=\"debtStatus\">LIVE</param></params>";
 * Document doc = sb.build(new StringReader(saveParamsString));
 * Element debtParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "updatePassthroughDebtLocal2", debtParams);
 * control.setReturnValue(new Document(new Element("Debt")));
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * debt.save();
 * 
 * control.verify();
 * }
 * 
 * public void testGetDebtBalance() throws Exception
 * {
 * setupGetDebtPaidToDate(32.34);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * assertEquals("debt balance", 19.91, debt.getDebtBalance(), 0);
 * 
 * control.verify();
 * }
 * 
 * public void testGetDebtPaidToDate() throws Exception
 * {
 * setupGetDebtPaidToDate(32.34);
 * 
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * assertEquals("debt paid to date", 32.34, debt.getDebtPaidToDate(), 0);
 * 
 * control.verify();
 * }
 * 
 * public void testSimpleGetters() throws Exception
 * {
 * control.replay();
 * 
 * ConsolidatedOrder co = ConsolidatedOrder.getCo("1234", adaptor);
 * Debt debt = co.getDebt("145");
 * 
 * assertNotSame("el not same", debtEl.getChild("Debt"), debt.toElement());
 * assertTrue("toElement equal",
 * new ElementMatcher().argumentMatches(
 * debtEl.getChild("Debt"), debt.toElement()));
 * assertEquals("debt sequence", "145", debt.getDebtSeq());
 * assertEquals("status", "LIVE", debt.getStatus());
 * assertEquals("def party role code", "DEFENDANT",
 * debt.getDefendantPartyRoleCode());
 * assertEquals("def case party number", "1",
 * debt.getDefendantCasePartyNumber());
 * assertEquals("case number", "5555", debt.getCaseNumber());
 * assertEquals("amount", 52.25, debt.getAmount(), 0);
 * assertEquals("original amount", 15.25, debt.getOriginalDebtAmount(), 0);
 * assertFalse("is not paid", debt.isPaid());
 * assertTrue("is live", debt.isLive());
 * 
 * control.verify();
 * }
 * 
 * private void setupFireCoCaseEvent(String status) throws Exception
 * {
 * adaptor.getCourtId();
 * control.setReturnValue("999");
 * 
 * adaptor.getUserId();
 * control.setReturnValue("azsnn1");
 * 
 * String date = Payment.getSupsDateFormat().format(new Date());
 * String eventParamsString = "<ds><CoCaseEvents><CoCaseEvent>"
 * + "<AldDebtSeq>145</AldDebtSeq>"
 * + "<AdminCourtCode>999</AdminCourtCode>"
 * + "<StdEventId>777</StdEventId>"
 * + "<EventDetails>A - CO DEBT " + status + "</EventDetails>"
 * + "<CaseNumber>5555</CaseNumber>"
 * + "<DebtSurrogateId>333</DebtSurrogateId>"
 * + "<DeletedFlag>N</DeletedFlag>"
 * + "<UserName>azsnn1</UserName>"
 * + "<ReceiptDate>" + date + "</ReceiptDate>"
 * + "<EventDate>" + date + "</EventDate>"
 * + "</CoCaseEvent></CoCaseEvents>"
 * + "<MaintainCO><Debts><Debt>"
 * + "<DebtSurrogateId>333</DebtSurrogateId>"
 * + "<PartyRoleCode>DEFENDANT</PartyRoleCode>"
 * + "<CasePartyNumber>1</CasePartyNumber>"
 * + "<DebtSeq>145</DebtSeq></Debt></Debts>"
 * + "<CONumber>1234</CONumber></MaintainCO></ds>";
 * Document doc = sb.build(new StringReader(eventParamsString));
 * Element eventParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/CoServiceLocal", "updateCoCaseEventsLocal2",
 * eventParams);
 * control.setReturnValue(null);
 * }
 * 
 * private void setupGetDebtPaidToDate(double total) throws Exception
 * {
 * String debtParamString = "<params><param name=\"debtSeq\">145"
 * + "</param></params>";
 * Document doc = sb.build(new StringReader(debtParamString));
 * Element debtParams = doc.getRootElement();
 * 
 * Element balanceReturn = new Element("ds");
 * balanceReturn.addContent(new Element("Debt").addContent(
 * new Element("TOTAL").setText(Double.toString(total))));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getDebtBalanceLocal2", debtParams);
 * control.setReturnValue(new Document(balanceReturn));
 * }
 * 
 * private void setupUpdateEventFlag(Element returnEvent) throws Exception
 * {
 * adaptor.getCourtId();
 * control.setReturnValue("999");
 * 
 * adaptor.getUserId();
 * control.setReturnValue("azsnn1");
 * 
 * String eventParamString = "<params><param name=\"coNumber\">1234"
 * + "</param><param name=\"debtSeq\">145</param>"
 * + "<param name=\"coEventId\">976</param></params>";
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
 * + "<DebtSeqNumber>145</DebtSeqNumber>"
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
 * + "<ProcessStage></ProcessStage>"
 * + "<UserName>azsnn1</UserName>"
 * + "<ServiceDate>" + date + "</ServiceDate>"
 * + "<StandardEventId>976</StandardEventId>"
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
 * junit.textui.TestRunner.run(TestDebt.class);
 * }
 * 
 * }
 * //[enddef] */