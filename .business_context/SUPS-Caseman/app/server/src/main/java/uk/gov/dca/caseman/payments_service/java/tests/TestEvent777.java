// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * import java.util.Set;
 * 
 * import junit.framework.TestCase;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
 * import uk.gov.dca.caseman.payments_service.java.util.events.Event;
 * import uk.gov.dca.caseman.payments_service.java.util.events.Event777;
 * 
 * public class TestEvent777 extends TestCase {
 * 
 * private Event event;
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
 * event = Event.getInstance(777, adaptor);
 * sb = new SAXBuilder();
 * }
 * 
 * public void testEvent777()
 * {
 * assertTrue(event instanceof Event777);
 * }
 * 
 * public void testFireEventAfterSetParams() throws Exception
 * {
 * event.setParam("AdminCourtCode", "A");
 * event.setParam("EventDetails", "B");
 * event.setParam("CaseNumber", "C");
 * event.setParam("UserName", "D");
 * event.setParam("ReceiptDate", "E");
 * event.setParam("EventDate", "F");
 * event.setParam("DeletedFlag", "G");
 * event.setParam("CONumber", "H");
 * event.setParam("PartyRoleCode", "I");
 * event.setParam("CasePartyNumber", "J");
 * event.setParam("DebtSeq", "K");
 * 
 * String paramString = "<ds><CoCaseEvents><CoCaseEvent>"
 * + "<AldDebtSeq>K</AldDebtSeq>"
 * + "<AdminCourtCode>A</AdminCourtCode>"
 * + "<StdEventId>777</StdEventId>"
 * + "<EventDetails>B</EventDetails>"
 * + "<CaseNumber>C</CaseNumber>"
 * + "<DebtSurrogateId>333</DebtSurrogateId>"
 * + "<DeletedFlag>G</DeletedFlag>"
 * + "<UserName>D</UserName>"
 * + "<ReceiptDate>E</ReceiptDate>"
 * + "<EventDate>F</EventDate>"
 * + "</CoCaseEvent></CoCaseEvents>"
 * + "<MaintainCO>"
 * + "<Debts><Debt>"
 * + "<DebtSurrogateId>333</DebtSurrogateId>"
 * + "<PartyRoleCode>I</PartyRoleCode>"
 * + "<CasePartyNumber>J</CasePartyNumber>"
 * + "<DebtSeq>K</DebtSeq>"
 * + "</Debt></Debts>"
 * + "<CONumber>H</CONumber>"
 * + "</MaintainCO></ds>";
 * 
 * fireEvent(paramString);
 * }
 * 
 * public void testFireEventDefaultParams() throws Exception
 * {
 * String paramString = "<ds><CoCaseEvents><CoCaseEvent>"
 * + "<AldDebtSeq></AldDebtSeq>"
 * + "<AdminCourtCode></AdminCourtCode>"
 * + "<StdEventId>777</StdEventId>"
 * + "<EventDetails></EventDetails>"
 * + "<CaseNumber></CaseNumber>"
 * + "<DebtSurrogateId>333</DebtSurrogateId>"
 * + "<DeletedFlag>N</DeletedFlag>"
 * + "<UserName></UserName>"
 * + "<ReceiptDate></ReceiptDate>"
 * + "<EventDate></EventDate>"
 * + "</CoCaseEvent></CoCaseEvents>"
 * + "<MaintainCO>"
 * + "<Debts><Debt>"
 * + "<DebtSurrogateId>333</DebtSurrogateId>"
 * + "<PartyRoleCode></PartyRoleCode>"
 * + "<CasePartyNumber></CasePartyNumber>"
 * + "<DebtSeq></DebtSeq>"
 * + "</Debt></Debts>"
 * + "<CONumber></CONumber>"
 * + "</MaintainCO></ds>";
 * 
 * fireEvent(paramString);
 * }
 * 
 * private void fireEvent(String paramString) throws Exception
 * {
 * Document doc = sb.build(new StringReader(paramString));
 * Element params = doc.getRootElement();
 * 
 * adaptor.callService("ejb/CoServiceLocal",
 * "updateCoCaseEventsLocal2", params);
 * control.setReturnValue(new Document());
 * 
 * control.replay();
 * 
 * event.fire();
 * 
 * control.verify();
 * }
 * 
 * public void testSetParams()
 * {
 * event.setParam("EventDetails", "jkkhjh");
 * event.setParam("CONumber", "asd");
 * 
 * try {
 * event.setParam("adassad", "kasndbj");
 * fail("expected IllegalArgumentException");
 * }
 * catch(IllegalArgumentException e) {}
 * 
 * try {
 * event.setParam(null, "kasndbj");
 * fail("expected IllegalArgumentException");
 * }
 * catch(IllegalArgumentException e) {}
 * }
 * 
 * public void testParams()
 * {
 * Set params = event.getParams();
 * assertEquals(11, params.size());
 * assertTrue(params.contains("AdminCourtCode"));
 * assertTrue(params.contains("EventDetails"));
 * assertTrue(params.contains("CaseNumber"));
 * assertTrue(params.contains("UserName"));
 * assertTrue(params.contains("ReceiptDate"));
 * assertTrue(params.contains("EventDate"));
 * assertTrue(params.contains("DeletedFlag"));
 * assertTrue(params.contains("CONumber"));
 * assertTrue(params.contains("PartyRoleCode"));
 * assertTrue(params.contains("CasePartyNumber"));
 * assertTrue(params.contains("DebtSeq"));
 * 
 * assertFalse(params.contains("asdasdd"));
 * assertFalse(params.contains(new Integer(367)));
 * }
 * 
 * public void testExists() throws Exception
 * {
 * assertFalse(event.exists());
 * }
 * 
 * public void testSaveErrorStatus() throws Exception
 * {
 * try {
 * event.saveErrorStatus(true);
 * fail("saveErrorStatus(true) should have thrown an "
 * + "IllegalStateException");
 * }
 * catch(IllegalStateException e) {}
 * 
 * try {
 * event.saveErrorStatus(false);
 * fail("saveErrorStatus(false) should have thrown an "
 * + "IllegalStateException");
 * }
 * catch(IllegalStateException e) {}
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestEvent777.class);
 * }
 * 
 * }
 * //[enddef] */