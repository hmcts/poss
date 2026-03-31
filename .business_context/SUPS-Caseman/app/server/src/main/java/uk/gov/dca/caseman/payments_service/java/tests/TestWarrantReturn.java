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
 * public class TestWarrantReturn extends TestCase {
 * 
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private Element dsEl;
 * private Element wrEl;
 * private Element params;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * 
 * dsEl = new Element("ds");
 * dsEl.addContent(new Element("WarrantReturns").addContent(
 * new Element("WarrantEvents").addContent(
 * new Element("WarrantEvent"))));
 * wrEl = dsEl.getChild("WarrantReturns").getChild("WarrantEvents")
 * .getChild("WarrantEvent");
 * wrEl.addContent(new Element("WarrantID").setText("A"));
 * wrEl.addContent(new Element("WarrantReturnsID").setText("B"));
 * wrEl.addContent(new Element("ReturnDate").setText("C"));
 * wrEl.addContent(new Element("Code").setText("D"));
 * wrEl.addContent(new Element("CourtCode").setText("E"));
 * wrEl.addContent(new Element("ReturnText").setText("F"));
 * wrEl.addContent(new Element("AdditionalDetails").setText("G"));
 * wrEl.addContent(new Element("Notice").setText("H"));
 * wrEl.addContent(new Element("Defendant").setText("I"));
 * wrEl.addContent(new Element("Verified").setText("J"));
 * wrEl.addContent(new Element("Error").setText("K"));
 * wrEl.addContent(new Element("AppointmentDate").setText("L"));
 * wrEl.addContent(new Element("AppointmentTime").setText("M"));
 * wrEl.addContent(new Element("CreatedBy").setText("N"));
 * wrEl.addContent(new Element("ExecutedBy").setText("O"));
 * wrEl.addContent(new Element("ReceiptDate").setText("P"));
 * wrEl.addContent(new Element("ToTransfer").setText("Q"));
 * wrEl.addContent(new Element("CaseNumber").setText("R"));
 * wrEl.addContent(new Element("LocalNumber").setText("S"));
 * 
 * String paramString = "<params><param name=\"NewReturn\">"
 * + "<ds><WarrantReturns><WarrantEvents><WarrantEvent>"
 * + "<WarrantID>A</WarrantID>"
 * + "<WarrantReturnsID>B</WarrantReturnsID>"
 * + "<ReturnDate>C</ReturnDate>"
 * + "<Code>D</Code>"
 * + "<CourtCode>E</CourtCode>"
 * + "<ReturnText>F</ReturnText>"
 * + "<AdditionalDetails>G</AdditionalDetails>"
 * + "<Notice>H</Notice>"
 * + "<Defendant>I</Defendant>"
 * + "<Verified>J</Verified>"
 * + "<Error>K</Error>"
 * + "<AppointmentDate>L</AppointmentDate>"
 * + "<AppointmentTime>M</AppointmentTime>"
 * + "<CreatedBy>N</CreatedBy>"
 * + "<ExecutedBy>O</ExecutedBy>"
 * + "<ReceiptDate>P</ReceiptDate>"
 * + "<ToTransfer>Q</ToTransfer>"
 * + "<CaseNumber>R</CaseNumber>"
 * + "<LocalNumber>S</LocalNumber>"
 * + "</WarrantEvent></WarrantEvents></WarrantReturns></ds>"
 * + "</param></params>";
 * 
 * Document doc = new SAXBuilder().build(new StringReader(paramString));
 * params = doc.getRootElement();
 * }
 * 
 * public void testSetDefendantNumber()
 * {
 * WarrantReturn wr = new WarrantReturn(wrEl, adaptor);
 * wr.setDefendantNumber(5);
 * assertEquals("5", wr.toElement().getChildText("Defendant"));
 * }
 * 
 * public void testSetError()
 * {
 * WarrantReturn wr = new WarrantReturn(wrEl, adaptor);
 * assertFalse("initial error", wr.isError());
 * wr.setError(true);
 * assertTrue("after set true", wr.isError());
 * wr.setError(false);
 * assertFalse("after set false", wr.isError());
 * }
 * 
 * public void testSaveWithDsDom() throws Exception
 * {
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "insertWarrantReturnsLocal2", params);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * new WarrantReturn(dsEl, adaptor).save();
 * 
 * control.verify();
 * }
 * 
 * public void testSaveWithWarrantEventDom() throws Exception
 * {
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "insertWarrantReturnsLocal2", params);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * new WarrantReturn(wrEl, adaptor).save();
 * 
 * control.verify();
 * }
 * 
 * public void testToElement()
 * {
 * WarrantReturn wr = new WarrantReturn(wrEl, adaptor);
 * Element el = wr.toElement();
 * assertNotSame("el not same", wrEl, el);
 * assertTrue("el equal", new ElementMatcher().argumentMatches(wrEl, el));
 * }
 * 
 * public void testToParamsElement()
 * {
 * WarrantReturn wr = new WarrantReturn(dsEl, adaptor);
 * Element el = wr.toParamsElement();
 * assertNotSame("el not same", dsEl, el);
 * assertTrue("el equal", new ElementMatcher().argumentMatches(dsEl, el));
 * }
 * 
 * public void testConstructorParams()
 * {
 * new WarrantReturn(new Element("ds").addContent(
 * new Element("WarrantReturns").addContent(
 * new Element("WarrantEvents").addContent(
 * new Element("WarrantEvent")))), adaptor);
 * new WarrantReturn(new Element("WarrantEvent"), adaptor);
 * 
 * try {
 * new WarrantReturn(new Element("asd"), adaptor);
 * fail("should have thrown IllegalArgumentException");
 * }
 * catch(IllegalArgumentException e) {}
 * }
 * 
 * public void testConstructorInvalidParams()
 * {
 * try {
 * new WarrantReturn(new Element("ds").addContent(
 * new Element("WarrantReturns").addContent(
 * new Element("WarrantEvents"))), adaptor);
 * fail("no WarrantEvent should have thrown IllegalArgumentException");
 * }
 * catch(IllegalArgumentException e) {}
 * 
 * try {
 * new WarrantReturn(new Element("ds").addContent(
 * new Element("WarrantReturns")), adaptor);
 * fail("WarrantReturns should have thrown IllegalArgumentException");
 * }
 * catch(IllegalArgumentException e) {}
 * 
 * try {
 * new WarrantReturn(new Element("asd"), adaptor);
 * fail("garbage Element should have thrown IllegalArgumentException");
 * }
 * catch(IllegalArgumentException e) {}
 * }
 * 
 * public void testNullConstructorParams()
 * {
 * try {
 * new WarrantReturn(null, adaptor);
 * fail("null Element should have thrown a NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * 
 * try {
 * new WarrantReturn(new Element("WarrantEvent"), null);
 * fail("null adaptor should have thrown a NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestWarrantReturn.class);
 * }
 * 
 * }
 * //[enddef] */