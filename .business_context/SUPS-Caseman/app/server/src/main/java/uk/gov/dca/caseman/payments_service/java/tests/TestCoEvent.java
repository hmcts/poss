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
 * import uk.gov.dca.caseman.payments_service.java.util.events.CoEvent;
 * 
 * public class TestCoEvent extends TestCase {
 * 
 * private Event event975;
 * private Event event976;
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
 * event975 = Event.getInstance(975, adaptor);
 * event976 = Event.getInstance(976, adaptor);
 * sb = new SAXBuilder();
 * }
 * 
 * public void testCoEvents()
 * {
 * assertTrue("is event975", event975 instanceof CoEvent);
 * assertTrue("is event976", event976 instanceof CoEvent);
 * }
 * 
 * public void testFireEventAfterSetParams() throws Exception
 * {
 * event975.setParam("CONumber", "A");
 * event975.setParam("StandardEventDescription", "B");
 * event975.setParam("EventDetails", "C");
 * event975.setParam("EventDate", "D");
 * event975.setParam("UserName", "E");
 * event975.setParam("ReceiptDate", "F");
 * event975.setParam("IssueStage", "G");
 * event975.setParam("Service", "H");
 * event975.setParam("BailiffId", "I");
 * event975.setParam("ServiceDate", "J");
 * event975.setParam("ErrorInd", "K");
 * event975.setParam("OwningCourtCode", "L");
 * event975.setParam("DebtSeqNumber", "M");
 * event975.setParam("COEventSeq", "N");
 * event975.setParam("BMSTask", "O");
 * event975.setParam("StatsModule", "P");
 * event975.setParam("AgeCategory", "Q");
 * event975.setParam("WarrantId", "R");
 * event975.setParam("ProcessDate", "S");
 * event975.setParam("CreatingCourt", "T");
 * event975.setParam("CreatingSection", "U");
 * event975.setParam("ProcessStage", "V");
 * event975.setParam("HrgSeq", "W");
 * 
 * String paramString = "<params><param name=\"coEvent\"><COEvent>"
 * + "<HrgSeq>W</HrgSeq>"
 * + "<IssueStage>G</IssueStage>"
 * + "<WarrantId>R</WarrantId>"
 * + "<ErrorInd>K</ErrorInd>"
 * + "<ProcessDate>S</ProcessDate>"
 * + "<ReceiptDate>F</ReceiptDate>"
 * + "<EventDate>D</EventDate>"
 * + "<CreatingSection>U</CreatingSection>"
 * + "<BMSTask>O</BMSTask>"
 * + "<DebtSeqNumber>M</DebtSeqNumber>"
 * + "<OwningCourtCode>L</OwningCourtCode>"
 * + "<AgeCategory>Q</AgeCategory>"
 * + "<CONumber>A</CONumber>"
 * + "<Service>H</Service>"
 * + "<CreatingCourt>T</CreatingCourt>"
 * + "<COEventSeq>N</COEventSeq>"
 * + "<BailiffId>I</BailiffId>"
 * + "<EventDetails>C</EventDetails>"
 * + "<StandardEventDescription>B</StandardEventDescription>"
 * + "<StatsModule>P</StatsModule>"
 * + "<ProcessStage>V</ProcessStage>"
 * + "<UserName>E</UserName>"
 * + "<ServiceDate>J</ServiceDate>"
 * + "<StandardEventId>975</StandardEventId>"
 * + "</COEvent></param></params>";
 * 
 * setupFireCoEvent(paramString);
 * 
 * control.replay();
 * 
 * event975.fire();
 * 
 * control.verify();
 * }
 * 
 * public void testFireEvent975DefaultParams() throws Exception
 * {
 * String paramString = "<params><param name=\"coEvent\"><COEvent>"
 * + "<HrgSeq></HrgSeq>"
 * + "<IssueStage></IssueStage>"
 * + "<WarrantId></WarrantId>"
 * + "<ErrorInd>N</ErrorInd>"
 * + "<ProcessDate></ProcessDate>"
 * + "<ReceiptDate></ReceiptDate>"
 * + "<EventDate></EventDate>"
 * + "<CreatingSection></CreatingSection>"
 * + "<BMSTask></BMSTask>"
 * + "<DebtSeqNumber></DebtSeqNumber>"
 * + "<OwningCourtCode></OwningCourtCode>"
 * + "<AgeCategory></AgeCategory>"
 * + "<CONumber></CONumber>"
 * + "<Service></Service>"
 * + "<CreatingCourt></CreatingCourt>"
 * + "<COEventSeq></COEventSeq>"
 * + "<BailiffId></BailiffId>"
 * + "<EventDetails></EventDetails>"
 * + "<StandardEventDescription>StandardEventDescription"
 * + "</StandardEventDescription>"
 * + "<StatsModule></StatsModule>"
 * + "<ProcessStage></ProcessStage>"
 * + "<UserName></UserName>"
 * + "<ServiceDate></ServiceDate>"
 * + "<StandardEventId>975</StandardEventId>"
 * + "</COEvent></param></params>";
 * 
 * setupFireCoEvent(paramString);
 * 
 * control.replay();
 * 
 * event975.fire();
 * 
 * control.verify();
 * }
 * 
 * public void testFireEvent976DefaultParams() throws Exception
 * {
 * String paramString = "<params><param name=\"coEvent\"><COEvent>"
 * + "<HrgSeq></HrgSeq>"
 * + "<IssueStage></IssueStage>"
 * + "<WarrantId></WarrantId>"
 * + "<ErrorInd>N</ErrorInd>"
 * + "<ProcessDate></ProcessDate>"
 * + "<ReceiptDate></ReceiptDate>"
 * + "<EventDate></EventDate>"
 * + "<CreatingSection></CreatingSection>"
 * + "<BMSTask></BMSTask>"
 * + "<DebtSeqNumber></DebtSeqNumber>"
 * + "<OwningCourtCode></OwningCourtCode>"
 * + "<AgeCategory></AgeCategory>"
 * + "<CONumber></CONumber>"
 * + "<Service></Service>"
 * + "<CreatingCourt></CreatingCourt>"
 * + "<COEventSeq></COEventSeq>"
 * + "<BailiffId></BailiffId>"
 * + "<EventDetails></EventDetails>"
 * + "<StandardEventDescription>StandardEventDescription"
 * + "</StandardEventDescription>"
 * + "<StatsModule></StatsModule>"
 * + "<ProcessStage></ProcessStage>"
 * + "<UserName></UserName>"
 * + "<ServiceDate></ServiceDate>"
 * + "<StandardEventId>976</StandardEventId>"
 * + "</COEvent></param></params>";
 * 
 * setupFireCoEvent(paramString);
 * 
 * control.replay();
 * 
 * event976.fire();
 * 
 * control.verify();
 * }
 * 
 * public void testFireEventExistsCaching() throws Exception
 * {
 * setupExists(new Element("ds"));
 * 
 * String paramString = "<params><param name=\"coEvent\"><COEvent>"
 * + "<HrgSeq></HrgSeq>"
 * + "<IssueStage></IssueStage>"
 * + "<WarrantId></WarrantId>"
 * + "<ErrorInd>N</ErrorInd>"
 * + "<ProcessDate></ProcessDate>"
 * + "<ReceiptDate></ReceiptDate>"
 * + "<EventDate></EventDate>"
 * + "<CreatingSection></CreatingSection>"
 * + "<BMSTask></BMSTask>"
 * + "<DebtSeqNumber>B</DebtSeqNumber>"
 * + "<OwningCourtCode></OwningCourtCode>"
 * + "<AgeCategory></AgeCategory>"
 * + "<CONumber>A</CONumber>"
 * + "<Service></Service>"
 * + "<CreatingCourt></CreatingCourt>"
 * + "<COEventSeq></COEventSeq>"
 * + "<BailiffId></BailiffId>"
 * + "<EventDetails></EventDetails>"
 * + "<StandardEventDescription>StandardEventDescription"
 * + "</StandardEventDescription>"
 * + "<StatsModule></StatsModule>"
 * + "<ProcessStage></ProcessStage>"
 * + "<UserName></UserName>"
 * + "<ServiceDate></ServiceDate>"
 * + "<StandardEventId>975</StandardEventId>"
 * + "</COEvent></param></params>";
 * 
 * setupFireCoEvent(paramString);
 * setupExists(new Element("ds").addContent(new Element("COEvent")));
 * 
 * control.replay();
 * 
 * event975.setParam("CONumber", "A");
 * event975.setParam("DebtSeqNumber", "B");
 * 
 * assertFalse("before fire", event975.exists());
 * event975.fire();
 * assertTrue("after fire", event975.exists());
 * 
 * control.verify();
 * }
 * 
 * public void testParams()
 * {
 * Set params = event975.getParams();
 * assertEquals("params size", 23, params.size());
 * assertTrue("coNumber", params.contains("CONumber"));
 * assertTrue("stdEventDesc", params.contains("StandardEventDescription"));
 * assertTrue("eventDetails", params.contains("EventDetails"));
 * assertTrue("eventDate", params.contains("EventDate"));
 * assertTrue("userName", params.contains("UserName"));
 * assertTrue("receiptDate", params.contains("ReceiptDate"));
 * assertTrue("issueStage", params.contains("IssueStage"));
 * assertTrue("service", params.contains("Service"));
 * assertTrue("bailiffId", params.contains("BailiffId"));
 * assertTrue("serviceDate", params.contains("ServiceDate"));
 * assertTrue("errorInd", params.contains("ErrorInd"));
 * assertTrue("owningCourt", params.contains("OwningCourtCode"));
 * assertTrue("debt seq no", params.contains("DebtSeqNumber"));
 * assertTrue("co event seq", params.contains("COEventSeq"));
 * assertTrue("bms task", params.contains("BMSTask"));
 * assertTrue("stats module", params.contains("StatsModule"));
 * assertTrue("age category", params.contains("AgeCategory"));
 * assertTrue("warrant id", params.contains("WarrantId"));
 * assertTrue("process date", params.contains("ProcessDate"));
 * assertTrue("creating court", params.contains("CreatingCourt"));
 * assertTrue("creating section", params.contains("CreatingSection"));
 * assertTrue("gearing sequence", params.contains("HrgSeq"));
 * assertTrue("process stage", params.contains("ProcessStage"));
 * 
 * assertFalse("no garbage node", params.contains("asdasdd"));
 * assertFalse("no int", params.contains(new Integer(367)));
 * }
 * 
 * public void testExistsWithMissingParams() throws Exception
 * {
 * try {
 * event975.exists();
 * fail("should have thrown IllegalStateException");
 * }
 * catch(IllegalStateException e) {}
 * }
 * 
 * public void testExistsWithMissingCoNumber() throws Exception
 * {
 * event975.setParam("DebtSeqNumber", "adad");
 * 
 * try {
 * event975.exists();
 * fail("should have thrown IllegalStateException");
 * }
 * catch(IllegalStateException e) {}
 * }
 * 
 * public void testExistsTrue() throws Exception
 * {
 * setupExists(new Element("ds").addContent(new Element("COEvent")));
 * 
 * control.replay();
 * 
 * event975.setParam("CONumber", "A");
 * event975.setParam("DebtSeqNumber", "B");
 * assertTrue(event975.exists());
 * assertTrue(event975.exists());
 * 
 * control.verify();
 * }
 * 
 * public void testExistsFalse() throws Exception
 * {
 * setupExists(new Element("ds"));
 * 
 * control.replay();
 * 
 * event975.setParam("CONumber", "A");
 * event975.setParam("DebtSeqNumber", "B");
 * assertFalse(event975.exists());
 * assertFalse(event975.exists());
 * 
 * control.verify();
 * }
 * 
 * public void testExistsTrueCaching() throws Exception
 * {
 * setupExists(new Element("ds").addContent(new Element("COEvent")));
 * 
 * control.replay();
 * 
 * event975.setParam("CONumber", "A");
 * event975.setParam("DebtSeqNumber", "B");
 * event975.exists();
 * event975.exists();
 * event975.exists();
 * 
 * control.verify();
 * }
 * 
 * public void testExistsFalseCaching() throws Exception
 * {
 * setupExists(new Element("ds"));
 * 
 * control.replay();
 * 
 * event975.setParam("CONumber", "A");
 * event975.setParam("DebtSeqNumber", "B");
 * event975.exists();
 * event975.exists();
 * event975.exists();
 * 
 * control.verify();
 * }
 * 
 * private void setupExists(Element returnVal) throws Exception
 * {
 * String paramString = "<params><param name=\"coNumber\">A</param>"
 * + "<param name=\"debtSeq\">B</param>"
 * + "<param name=\"coEventId\">975</param></params>";
 * 
 * Document doc = sb.build(new StringReader(paramString));
 * Element params = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoEventLocal2", params);
 * control.setReturnValue(new Document(returnVal));
 * }
 * 
 * private void setupFireCoEvent(String paramString) throws Exception
 * {
 * Document doc = sb.build(new StringReader(paramString));
 * Element params = doc.getRootElement();
 * 
 * adaptor.callService("ejb/CoEventServiceLocal",
 * "insertCoEventAutoExtLocal2", params);
 * control.setReturnValue(new Document());
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestCoEvent.class);
 * }
 * 
 * }
 * //[enddef] */