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
 * import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
 * import uk.gov.dca.caseman.payments_service.java.util.events.Event;
 * 
 * public class TestCoEventSaveError extends TestCase {
 * 
 * private Event event975;
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private SAXBuilder sb;
 * private Element existsParams;
 * private Element returnVal;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * event975 = Event.getInstance(975, adaptor);
 * sb = new SAXBuilder();
 * 
 * event975.setParam("CONumber", "A");
 * event975.setParam("DebtSeqNumber", "B");
 * 
 * String paramStringExists = "<params><param name=\"coNumber\">A</param>"
 * + "<param name=\"debtSeq\">B</param>"
 * + "<param name=\"coEventId\">975</param></params>";
 * existsParams =
 * sb.build(new StringReader(paramStringExists)).getRootElement();
 * 
 * returnVal = new Element("ds");
 * }
 * 
 * public void testNoExists() throws Exception
 * {
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoEventLocal2", existsParams);
 * control.setReturnValue(new Document(returnVal));
 * 
 * control.replay();
 * 
 * try {
 * event975.saveErrorStatus(true);
 * fail("should have thrown IllegalStateException");
 * }
 * catch(IllegalStateException e) {}
 * 
 * control.verify();
 * }
 * 
 * public void testNotErroredSoNoChangeRequired() throws Exception
 * {
 * returnVal.addContent(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("Y")));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoEventLocal2", existsParams);
 * control.setReturnValue(new Document(returnVal));
 * 
 * control.replay();
 * 
 * event975.saveErrorStatus(true);
 * 
 * control.verify();
 * }
 * 
 * public void testErroredSoNoChangeRequired() throws Exception
 * {
 * returnVal.addContent(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoEventLocal2", existsParams);
 * control.setReturnValue(new Document(returnVal));
 * 
 * control.replay();
 * 
 * event975.saveErrorStatus(false);
 * 
 * control.verify();
 * }
 * 
 * public void testSetTrue() throws Exception
 * {
 * returnVal.addContent(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")).addContent(
 * new Element("COEventSeq").setText("123")));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoEventLocal2", existsParams);
 * control.setReturnValue(new Document(returnVal));
 * 
 * String paramStringError = "<params><param name=\"eventSeq\">123"
 * + "</param><param name=\"errorInd\">Y</param></params>";
 * Document doc = sb.build(new StringReader(paramStringError));
 * Element params = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "updatePassthroughCoEventLocal2", params);
 * control.setReturnValue(new Document(new Element("ds")));
 * 
 * control.replay();
 * 
 * event975.saveErrorStatus(true);
 * 
 * control.verify();
 * }
 * 
 * public void testSetFalse() throws Exception
 * {
 * returnVal.addContent(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("Y")).addContent(
 * new Element("COEventSeq").setText("123")));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoEventLocal2", existsParams);
 * control.setReturnValue(new Document(returnVal));
 * 
 * String paramStringError = "<params><param name=\"eventSeq\">123"
 * + "</param><param name=\"errorInd\">N</param></params>";
 * Document doc = sb.build(new StringReader(paramStringError));
 * Element params = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "updatePassthroughCoEventLocal2", params);
 * control.setReturnValue(new Document(new Element("ds")));
 * 
 * control.replay();
 * 
 * event975.saveErrorStatus(false);
 * 
 * control.verify();
 * }
 * 
 * public void testMultipleEventsExist() throws Exception
 * {
 * returnVal.addContent(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("Y")).addContent(
 * new Element("COEventSeq").setText("123")));
 * returnVal.addContent(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("N")).addContent(
 * new Element("COEventSeq").setText("AGH")));
 * returnVal.addContent(new Element("COEvent").addContent(
 * new Element("ErrorInd").setText("Y")).addContent(
 * new Element("COEventSeq").setText("7688")));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughCoEventLocal2", existsParams);
 * control.setReturnValue(new Document(returnVal));
 * 
 * String paramStringError = "<params><param name=\"eventSeq\">123"
 * + "</param><param name=\"errorInd\">N</param></params>";
 * Document doc = sb.build(new StringReader(paramStringError));
 * Element params = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "updatePassthroughCoEventLocal2", params);
 * control.setReturnValue(new Document(new Element("ds")));
 * 
 * control.replay();
 * 
 * event975.saveErrorStatus(false);
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestCoEventSaveError.class);
 * }
 * 
 * }
 * //[enddef] */