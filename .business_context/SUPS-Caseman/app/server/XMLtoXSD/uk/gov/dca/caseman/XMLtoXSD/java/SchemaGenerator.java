/**
 * Created on 24-May-2006
 */
package uk.gov.dca.caseman.XMLtoXSD.java;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.ListIterator;
import java.util.Properties;

import oracle.jdbc.OracleDatabaseMetaData;

import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Namespace;
import org.jdom.Text;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

/**
 * @author nztvk5
 */
public class SchemaGenerator {

    /**
     * Properties file globals.
     */
    private static Properties properties = null;

    private static final String XSD_NAMESPACE_URI = "xsd.namespace.uri";

    private static final String XSD_NAMESPACE_PREFIX = "xsd.namespace.prefix";

    private static final String DATABASE_URI = "database.uri";

    private static final String DATABASE_SCHEMA_NAME = "database.schema.name";

    private static final String DATABASE_USER_NAME = "database.user.name";

    private static final String DATABASE_PASSWORD = "database.password";

    private static final String DATE_FORMAT_REGEX = "date.format.regex";

    private static final String PARENT_FOLDER = "parent.folder";

    private static final String VERBOSE_OUTPUT = "verbose.output";

    private static final String SCHEMA_EXTENSION_NAME = "schema.extension.name";

    private static final String SUPS_SIMPLE_TYPES = "sups.simple.types";

    private static final String SUPS_COMPLEX_TYPES = "sups.complex.types";

    /**
     * Simple types schema document.
     */
    private static Document simpleTypesDocument = null;

    /**
     * Complex types schema document.
     */
    private static Document complexTypesDocument = null;

    /**
     * Database schema metadata.
     */
    private static OracleDatabaseMetaData dmd = null;

    /**
     * Reuse open connection for speed.
     */
    private static Connection conn = null;

    /**
     * Constructor.
     */
    public SchemaGenerator() {
        super();
    }

    /**
     * Main method.
     * 
     * @param args
     *            Program parameters - not used here.
     */
    public static void main(String[] args) {

        properties = new Properties();
        try {
            properties.load(new FileInputStream("XMLtoXSD.properties"));
        } catch (IOException e) {
            e.printStackTrace();
            System.exit(1);
        }

        String parentFolderPath = getProperty(PARENT_FOLDER);

        File topLevelFolder = new File(parentFolderPath);
        if (!topLevelFolder.isDirectory()) {
            System.out.println(parentFolderPath + " is not a folder");
            System.exit(2);
        }

        try {
            // Load database driver
            DriverManager.registerDriver(new oracle.jdbc.OracleDriver());
        } catch (SQLException e1) {
            e1.printStackTrace();
            System.exit(3);
        }

        processSubFolder(topLevelFolder);

        saveTypeSchemas();

        closeConnection();
    }

    /**
     * Recursive method - calls itself when a new subfolder is found.
     * 
     * @param parentFolder
     *            The parent folder.
     */
    private static void processSubFolder(File parentFolder) {
        File[] xmlFiles = parentFolder.listFiles();
        for (int i = 0; i < xmlFiles.length; i++) {
            File xmlFile = xmlFiles[i];

            if (xmlFile.isDirectory()) {
                processSubFolder(xmlFile);
                continue;
            }

            if (!xmlFile.getName().endsWith(".xml"))
                continue;

            Document xmlDoc = new Document();
            String xmlFileName = xmlFile.getAbsolutePath();

            SAXBuilder sb = new SAXBuilder();
            try {
                xmlDoc = sb.build(xmlFile);
            } catch (JDOMException e) {
                // IGNORE FILE - NOT WELL FORMED XML
            } catch (IOException e) {
                // IGNORE FILE - UNABLE TO LOAD FROM FILE SYSTEM
            }

            try {
                if (!"DBMapDef".equals(xmlDoc.getRootElement().getName())) {
                    continue;
                }
            } catch (java.lang.IllegalStateException e) {
                // IGNORE FILE - NOT WELL FORMED XML
                continue;
            }

            System.out.println(xmlFileName);
            Document xsdDoc = createNewSchema();

            Element mapElement;
            try {
                mapElement = (Element) XPath.selectSingleNode(xmlDoc.getRootElement(), "/DBMapDef/Mapping");
            } catch (JDOMException e2) {
                e2.printStackTrace();
                continue;
            }
            Element startXMLElement = (Element) mapElement.getChildren().get(0);
            if (startXMLElement.getName().equals("ds")) {
                startXMLElement = (Element) ((Element) mapElement.getChildren().get(0)).getChildren().get(0);
            }
            Element startXSDElement = (Element) ((Element) ((Element) xsdDoc.getRootElement().getChildren()
                    .get(2)).getChildren().get(0)).getChildren().get(0);
            // Call recursive function to generate schema from xml file.
            parseElement(startXMLElement, startXSDElement, false);

            // Collect and re-use complex types within the generated schema.
            processComplexTypes(xsdDoc);

            // Output schema to file system.
            String xsdFileName = xmlFileName.replaceAll(".xml", getProperty(SCHEMA_EXTENSION_NAME));
            XMLOutputter xmlo = new XMLOutputter(Format.getPrettyFormat());
            File xsdFile = new File(xsdFileName);
            FileOutputStream fos;
            try {
                fos = new FileOutputStream(xsdFile);
                xmlo.output(xsdDoc, fos);
            } catch (FileNotFoundException e1) {
                System.out.println("CANNOT CREATE - " + xsdFileName);
            } catch (IOException e) {
                System.out.println("CANNOT CREATE - " + xsdFileName);
            }
        }
    }

    /**
     * Output simple and complex types schemas to file system.
     */
    private static void saveTypeSchemas() {
        XMLOutputter xmlo = new XMLOutputter(Format.getPrettyFormat());
        File xsdSimpleFile = new File(getProperty(SUPS_SIMPLE_TYPES));
        File xsdComplexFile = new File(getProperty(SUPS_COMPLEX_TYPES));
        FileOutputStream fos;
        try {
            fos = new FileOutputStream(xsdSimpleFile);
            xmlo.output(simpleTypesDocument, fos);
            fos.close();
            fos = new FileOutputStream(xsdComplexFile);
            xmlo.output(complexTypesDocument, fos);
            fos.close();
        } catch (FileNotFoundException e1) {
            System.out.println("CANNOT CREATE - " + getProperty(SUPS_SIMPLE_TYPES) + " - "
                    + getProperty(SUPS_COMPLEX_TYPES));
        } catch (IOException e) {
            System.out.println("CANNOT CREATE - " + getProperty(SUPS_SIMPLE_TYPES) + " - "
                    + getProperty(SUPS_COMPLEX_TYPES));
        }
    }

    /**
     * Recursive method constructs schema based on xml content.
     * 
     * @param xmlElement
     *            The xml content.
     * @param xsdParentElement
     *            The schema parent element.
     * @param isSequenceElement
     *            True if element is in a sequence.
     */
    private static void parseElement(Element xmlElement, Element xsdParentElement, boolean isSequenceElement) {
        // Create element attribute.
        Element xsdElement = new Element("element", getProperty(XSD_NAMESPACE_PREFIX),
                getProperty(XSD_NAMESPACE_URI));
        xsdElement.setAttribute("name", xmlElement.getName());
        if (isSequenceElement) {
            xsdElement.setAttribute("maxOccurs", "unbounded");
        }
        setSchemaType(xmlElement, xsdElement);
        xsdParentElement.addContent(xsdElement);

        List elementAttributes = xmlElement.getAttributes();
        List childXMLElements = xmlElement.getChildren();
        Element complexTypeElement = null;

        // Create complexType if there are any attributes or child elements for
        // the passed element.
        if (elementAttributes.size() > 0 || childXMLElements.size() > 0) {
            complexTypeElement = new Element("complexType", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            xsdElement.addContent(complexTypeElement);
        }

        // Parse child elements.
        if (childXMLElements.size() > 0) {
            Element sequenceElement = new Element("sequence", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            complexTypeElement.addContent(sequenceElement);

            ListIterator li = childXMLElements.listIterator();
            while (li.hasNext()) {
                Element childXMLElement = (Element) li.next();

                // Check for a sequence of elements
                String elementName = childXMLElement.getName();
                boolean foundSequence = false;
                while (li.hasNext()) {
                    childXMLElement = (Element) li.next();
                    if (!elementName.equals(childXMLElement.getName())) {
                        li.previous();
                        childXMLElement = (Element) li.previous();
                        li.next();
                        break;
                    }
                    foundSequence = true;
                }
                parseElement(childXMLElement, sequenceElement, foundSequence);
            }
        }

        // Parse element attributes.
        if (elementAttributes.size() > 0) {
            ListIterator li = elementAttributes.listIterator();
            while (li.hasNext()) {
                Attribute xmlAttribute = (Attribute) li.next();
                Element xsdAttribElement = new Element("attribute", getProperty(XSD_NAMESPACE_PREFIX),
                        getProperty(XSD_NAMESPACE_URI));
                xsdAttribElement.setAttribute("name", xmlAttribute.getName());
                xsdAttribElement.setAttribute("type", getProperty(XSD_NAMESPACE_PREFIX) + ":string");
                xsdAttribElement.setAttribute("use", "required");
                complexTypeElement.addContent(xsdAttribElement);
            }
        }
    }

    /**
     * Uses table and column name to query database for appropriate types.
     * 
     * @param xmlElement
     *            The xml content element.
     * @param xsdElement
     *            The corresponding schema element.
     */
    private static void setSchemaType(Element xmlElement, Element xsdElement) {

        String text = getTextForElement(xmlElement);
        if (!text.startsWith("${"))
            return;

        if (text.indexOf(".") == -1) {
            if ("true".equals(getProperty(VERBOSE_OUTPUT))) {
                System.out.println("+++++++++++++ TABLE ALIAS NOT DECLARED FOR ELEMENT "
                        + xmlElement.getName());
            }
            return;
        }
        String tableAlias = text.substring(2, text.indexOf("."));
        String tableName = null;
        try {
            Element tableElement = (Element) XPath.selectSingleNode(xmlElement,
                    "/DBMapDef/Tables/Table[@alias='" + tableAlias + "']");
            if (tableElement == null) {
                if ("true".equals(getProperty(VERBOSE_OUTPUT))) {
                    System.out.println("+++++++++++++ INCORRECT TABLE ALIAS DECLARED FOR ELEMENT "
                            + xmlElement.getName());
                }
                return;
            }
            tableName = tableElement.getAttributeValue("name");
        } catch (JDOMException e1) {
            e1.printStackTrace();
        }

        String columnName = text.substring(text.indexOf(".") + 1, text.length() - 1);
        try {
            // Get the database meta data
            dmd = getDatabaseMetaData();

            if (dmd == null) {
                System.out.println("Database meta data not available");
            } else {
                ResultSet rs2 = dmd
                        .getColumns(null, getProperty(DATABASE_SCHEMA_NAME), tableName, columnName);
                if (rs2.next()) {
                    
                    // Is field nullable?
                    if ("YES".equals(rs2.getString(18))) {
                        xsdElement.setAttribute("minOccurs", "0");
                    }
                    
                    if ("true".equals(getProperty(VERBOSE_OUTPUT))) {
                        System.out.println("        " + rs2.getString(1) + " " + rs2.getString(2) + " "
                                + rs2.getString(3) + " " + rs2.getString(4) + " " + rs2.getString(5) + " "
                                + rs2.getString(6) + " " + rs2.getString(7) + " " + rs2.getString(8) + " "
                                + rs2.getString(9) + " " + rs2.getString(10) + " " + rs2.getString(11) + " "
                                + rs2.getString(12) + " " + rs2.getString(13) + " " + rs2.getString(14) + " "
                                + rs2.getString(15) + " " + rs2.getString(16) + " " + rs2.getString(17) + " "
                                + rs2.getString(18));
                    }
                    if ("VARCHAR2".equals(rs2.getString(6)) || "CHAR".equals(rs2.getString(6))) {
                        setStringType(xsdElement, rs2.getString(7));
                    } else if ("NUMBER".equals(rs2.getString(6))) {
                        setNumberType(xsdElement, rs2.getString(7), rs2.getString(9));
                    } else if ("DATE".equals(rs2.getString(6))) {
                        setDateType(xsdElement);
                    } else {
                        System.out.println("+++++++++++++++++++++++ UNKNOWN TYPE ++++++++++++++++++++++++");
                        System.out.println("        " + rs2.getString(1) + " " + rs2.getString(2) + " "
                                + rs2.getString(3) + " " + rs2.getString(4) + " " + rs2.getString(5) + " "
                                + rs2.getString(6) + " " + rs2.getString(7) + " " + rs2.getString(8) + " "
                                + rs2.getString(9) + " " + rs2.getString(10) + " " + rs2.getString(11) + " "
                                + rs2.getString(12) + " " + rs2.getString(13) + " " + rs2.getString(14) + " "
                                + rs2.getString(15) + " " + rs2.getString(16) + " " + rs2.getString(17) + " "
                                + rs2.getString(18));
                    }
                }
                rs2.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Creates a simpleType element based on a string with a length restriction.
     * 
     * @param xsdElement
     *            The schema element.
     * @param slen
     */
    private static void setStringType(Element xsdElement, String slen) {
        String simpleTypeName = "sups_string_" + slen;
        xsdElement.setAttribute("type", simpleTypeName);

        Element simpleTypeElement = null;
        Element simpleTypesRootElement = getSimpleTypesRootElement();
        try {
            simpleTypeElement = (Element) XPath.selectSingleNode(simpleTypesRootElement, "/"
                    + getProperty(XSD_NAMESPACE_PREFIX) + ":schema/" + getProperty(XSD_NAMESPACE_PREFIX)
                    + ":simpleType[@name='" + simpleTypeName + "']");
        } catch (JDOMException e) {
            e.printStackTrace();
        }

        if (simpleTypeElement == null) {
            simpleTypeElement = new Element("simpleType", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            simpleTypeElement.setAttribute("name", simpleTypeName);
            Element restrictionElement = new Element("restriction", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            restrictionElement.setAttribute("base", getProperty(XSD_NAMESPACE_PREFIX) + ":string");
            Element lengthElement = new Element("length", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            lengthElement.setAttribute("value", slen);
            restrictionElement.addContent(lengthElement);
            simpleTypeElement.addContent(restrictionElement);
            simpleTypesRootElement.addContent(simpleTypeElement);
        }
    }

    /**
     * Creates a simpleType element based on a number with a max value
     * restriction.
     * 
     * @param xsdElement
     *            The schema element.
     * @param slen
     *            Max length of string.
     * @param numdp
     *            Number of decimal places.
     */
    private static void setNumberType(Element xsdElement, String slen, String numdp) {
        String simpleTypeName = "";
        String baseType = "";
        if ("0".equals(numdp)) {
            baseType = getProperty(XSD_NAMESPACE_PREFIX) + ":integer";
            simpleTypeName = "sups_integer_" + slen;
        } else {
            baseType = getProperty(XSD_NAMESPACE_PREFIX) + ":double";
            simpleTypeName = "sups_double_" + slen;
        }
        xsdElement.setAttribute("type", simpleTypeName);

        Element simpleTypeElement = null;
        Element simpleTypesRootElement = getSimpleTypesRootElement();
        try {
            simpleTypeElement = (Element) XPath.selectSingleNode(simpleTypesRootElement, "/"
                    + getProperty(XSD_NAMESPACE_PREFIX) + ":schema/" + getProperty(XSD_NAMESPACE_PREFIX)
                    + ":simpleType[@name='" + simpleTypeName + "']");
        } catch (JDOMException e) {
            e.printStackTrace();
        }

        if (simpleTypeElement == null) {
            simpleTypeElement = new Element("simpleType", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            simpleTypeElement.setAttribute("name", simpleTypeName);
            Element restrictionElement = new Element("restriction", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            restrictionElement.setAttribute("base", baseType);
            Element lengthElement = new Element("maxInclusive", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            String maxVal = "";
            for (int i = 0; i < Integer.parseInt(slen); i++) {
                maxVal += "9";
            }
            lengthElement.setAttribute("value", maxVal);
            restrictionElement.addContent(lengthElement);
            if (numdp != null && !"0".equals(numdp)) {
                Element fractionDigitsElement = new Element("fractionDigits",
                        getProperty(XSD_NAMESPACE_PREFIX), getProperty(XSD_NAMESPACE_URI));
                fractionDigitsElement.setAttribute("value", numdp);
                restrictionElement.addContent(fractionDigitsElement);
            }
            simpleTypeElement.addContent(restrictionElement);
            simpleTypesRootElement.addContent(simpleTypeElement);
        }
    }

    /**
     * Creates a simpleType element based on a date with a regular expression
     * restriction.
     * 
     * @param xsdElement
     *            The schema element.
     */
    private static void setDateType(Element xsdElement) {
        xsdElement.setAttribute("type", "sups_date");

        Element simpleTypeElement = null;
        Element simpleTypesRootElement = getSimpleTypesRootElement();
        try {
            simpleTypeElement = (Element) XPath.selectSingleNode(simpleTypesRootElement, "/"
                    + getProperty(XSD_NAMESPACE_PREFIX) + ":schema/" + getProperty(XSD_NAMESPACE_PREFIX)
                    + ":simpleType[@name='sups_date']");
        } catch (JDOMException e) {
            e.printStackTrace();
        }

        if (simpleTypeElement == null) {
            simpleTypeElement = new Element("simpleType", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            simpleTypeElement.setAttribute("name", "sups_date");
            Element restrictionElement = new Element("restriction", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            restrictionElement.setAttribute("base", getProperty(XSD_NAMESPACE_PREFIX) + ":string");
            Element lengthElement = new Element("pattern", getProperty(XSD_NAMESPACE_PREFIX),
                    getProperty(XSD_NAMESPACE_URI));
            lengthElement.setAttribute("value", getProperty(DATE_FORMAT_REGEX));
            restrictionElement.addContent(lengthElement);
            simpleTypeElement.addContent(restrictionElement);
            simpleTypesRootElement.addContent(simpleTypeElement);
        }
    }

    /**
     * Returns the root element for the simple types xsd document.
     * 
     * @return Simple types root element.
     */
    private static Element getSimpleTypesRootElement() {
        if (simpleTypesDocument == null) {
            SAXBuilder sb = new SAXBuilder();
            try {
                File f = new File(getProperty(SUPS_SIMPLE_TYPES));
                if (!f.exists()) {
                    simpleTypesDocument = new Document();
                    Element root = new Element("schema", getProperty(XSD_NAMESPACE_PREFIX),
                            getProperty(XSD_NAMESPACE_URI));
                    simpleTypesDocument.setRootElement(root);
                } else {
                    simpleTypesDocument = sb.build(f);
                }
            } catch (JDOMException e) {
                e.printStackTrace();
                System.exit(4);
            } catch (IOException e) {
                e.printStackTrace();
                System.exit(4);
            }
        }
        return simpleTypesDocument.getRootElement();
    }

    /**
     * Returns the root element for the complex types xsd document.
     * 
     * @return Complex types root element.
     */
    private static Element getComplexTypesRootElement() {
        if (complexTypesDocument == null) {
            SAXBuilder sb = new SAXBuilder();
            try {
                File f = new File(getProperty(SUPS_COMPLEX_TYPES));
                if (!f.exists()) {
                    complexTypesDocument = new Document();
                    Element root = new Element("schema", getProperty(XSD_NAMESPACE_PREFIX),
                            getProperty(XSD_NAMESPACE_URI));
                    complexTypesDocument.setRootElement(root);
                    Element importSimpleElement = new Element("import", getProperty(XSD_NAMESPACE_PREFIX),
                            getProperty(XSD_NAMESPACE_URI));
                    importSimpleElement.setAttribute("schemaLocation", getProperty(SUPS_SIMPLE_TYPES));
                    root.addContent(importSimpleElement);
                } else {
                    complexTypesDocument = sb.build(f);
                }
            } catch (JDOMException e) {
                e.printStackTrace();
                System.exit(4);
            } catch (IOException e) {
                e.printStackTrace();
                System.exit(4);
            }
        }
        return complexTypesDocument.getRootElement();
    }

    /**
     * Creates a new empty schema with imports for simple and complex types.
     * 
     * @return A new empty schema.
     */
    private static Document createNewSchema() {
        Document xsdDoc = new Document();
        Element root = new Element("schema", getProperty(XSD_NAMESPACE_PREFIX),
                getProperty(XSD_NAMESPACE_URI));
        xsdDoc.setRootElement(root);
        Element importSimpleElement = new Element("import", getProperty(XSD_NAMESPACE_PREFIX),
                getProperty(XSD_NAMESPACE_URI));
        importSimpleElement.setAttribute("schemaLocation", getProperty(SUPS_SIMPLE_TYPES));
        root.addContent(importSimpleElement);
        Element importComplexElement = new Element("import", getProperty(XSD_NAMESPACE_PREFIX),
                getProperty(XSD_NAMESPACE_URI));
        importComplexElement.setAttribute("schemaLocation", getProperty(SUPS_COMPLEX_TYPES));
        root.addContent(importComplexElement);
        Element el = new Element("element", getProperty(XSD_NAMESPACE_PREFIX), getProperty(XSD_NAMESPACE_URI));
        el.setAttribute("name", "ds");
        root.addContent(el);
        Element ct = new Element("complexType", getProperty(XSD_NAMESPACE_PREFIX),
                getProperty(XSD_NAMESPACE_URI));
        el.addContent(ct);
        Element sq = new Element("sequence", getProperty(XSD_NAMESPACE_PREFIX),
                getProperty(XSD_NAMESPACE_URI));
        ct.addContent(sq);
        return xsdDoc;
    }

    /**
     * Declare complex types and reference them rather than having inline
     * complex type.
     * 
     * @param xsdDoc
     */
    private static void processComplexTypes(Document xsdDoc) {
        List complexTypeElements = null;
        try {
            complexTypeElements = XPath.selectNodes(xsdDoc, "/*/*/*//" + getProperty(XSD_NAMESPACE_PREFIX)
                    + ":complexType");
        } catch (JDOMException e) {
            e.printStackTrace();
            return;
        }

        while (complexTypeElements.size() > 0) {

            Element element = (Element) complexTypeElements.get(complexTypeElements.size() - 1);
            Element parent = element.getParentElement();
            String name = parent.getAttributeValue("name");
            String typeName = name + "Type";
            element.setAttribute("name", typeName);
            parent.setAttribute("type", typeName);

            try {
                // See if complexType has already been declared - if not then
                // create it.
                Element ctype = (Element) XPath.selectSingleNode(getComplexTypesRootElement(), "/"
                        + getProperty(XSD_NAMESPACE_PREFIX) + ":schema/" + getProperty(XSD_NAMESPACE_PREFIX)
                        + ":complexType[@name = '" + typeName + "']");
                if (ctype == null) {
                    // Element does not exist with same name - so create it.
                    getComplexTypesRootElement().addContent((Element) element.clone());
                } else {
                    // An element does exist but may have a different structure.
                    // Compare elements to see if structure matches.
                    int ctr = 2;
                    while (compareComplexTypes(element, ctype) == false) {
                        typeName = name + "Type_";
                        if (ctr < 10) {
                            typeName += "0";
                        }
                        typeName += ctr;
                        element.setAttribute("name", typeName);
                        parent.setAttribute("type", typeName);
                        ctype = (Element) XPath.selectSingleNode(getComplexTypesRootElement(), "/"
                                + getProperty(XSD_NAMESPACE_PREFIX) + ":schema/"
                                + getProperty(XSD_NAMESPACE_PREFIX) + ":complexType[@name = '" + typeName
                                + "']");

                        if (ctype == null) {
                            getComplexTypesRootElement().addContent((Element) element.clone());
                            break;
                        }
                        ctr++;
                    }
                }
                parent.removeChild("complexType", Namespace.getNamespace(getProperty(XSD_NAMESPACE_PREFIX),
                        getProperty(XSD_NAMESPACE_URI)));

                // Select again to see if there are any more.
                complexTypeElements = XPath.selectNodes(xsdDoc, "/*/*/*//"
                        + getProperty(XSD_NAMESPACE_PREFIX) + ":complexType");
            } catch (JDOMException e) {
                e.printStackTrace();
                return;
            }
        }
    }

    /**
     * Compares the two passed complex type elements.
     * 
     * @param element
     *            The first complex type to compare.
     * @param ctype
     *            The second complex type to compare.
     * @return true if elements have same structure, false if not.
     */
    private static boolean compareComplexTypes(Element element, Element ctype) {
        XMLOutputter xmlo = new XMLOutputter(Format.getPrettyFormat());
        StringWriter s1 = new StringWriter();
        StringWriter s2 = new StringWriter();
        try {
            xmlo.output(element, s1);
            xmlo.output(ctype, s2);

            if (!s1.toString().equals(s2.toString())) {
                if ("true".equals(getProperty(VERBOSE_OUTPUT))) {
                    System.out.println("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
                    System.out.println(s1.toString());
                    System.out.println("---------------- is different to -----------------");
                    System.out.println(s2.toString());
                    System.out.println("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
                }
                return false;
            }
        } catch (IOException e1) {
            e1.printStackTrace();
            return false;
        }
        return true;
    }

    /**
     * Returns text content of the passed jdom element.
     * 
     * @param element
     *            The jdom element.
     * @return The text content.
     */
    private static String getTextForElement(Element element) {
        ListIterator li = element.getContent().listIterator();
        while (li.hasNext()) {
            Object obj = li.next();
            if (obj instanceof Text) {
                Text text = (Text) obj;
                return text.getTextTrim();
            }
        }
        return "";
    }

    /**
     * Uses jdbc to connect to the database and retrieve the db schema.
     * 
     * @return The schema metadata.
     */
    private static OracleDatabaseMetaData getDatabaseMetaData() {
        if (dmd == null) {
            try {
                conn = DriverManager.getConnection(getProperty(DATABASE_URI),
                        getProperty(DATABASE_USER_NAME), getProperty(DATABASE_PASSWORD));

                dmd = (OracleDatabaseMetaData) conn.getMetaData();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return dmd;
    }

    /**
     * Closes database connection.
     */
    private static void closeConnection() {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException ex) {
                System.out.println("Error in closing Conection");
            }
        }
    }

    /**
     * Returns value of properties stored in the application.properties file.
     * 
     * @param name
     *            The property name.
     * @return The property value.
     */
    private static String getProperty(String name) {
        return properties.getProperty(name);
    }
}