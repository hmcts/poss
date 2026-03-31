<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSPY v5 rel. 3 U (http://www.xmlspy.com) by Fred (Electronic Data Systems LTD) -->
<!--This stylesheet is used to generate reference data for the WordProcessingController by parsing the output (template)s developed.-->
<xsl:stylesheet version="1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo">
	<xsl:output method="xml" indent="yes"/>
	<xsl:param name="templateDir"/>
	<xsl:template match="Outputs">
		<Outputs>
			<xsl:for-each select="Output">
				<xsl:variable name="outputTemplateLocation">
					<xsl:value-of select="$templateDir"/>
					<xsl:value-of select="Location"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="contains($outputTemplateLocation, '.xml')">
						<xsl:variable name="outputTemplateXMLDOC" select="document($outputTemplateLocation)"/>
						<xsl:element name="Output">
							<xsl:element name="Id">
								<xsl:value-of select="Id"/>
							</xsl:element>
							<xsl:choose>
								<xsl:when test="count($outputTemplateXMLDOC//supsfo:editable) > 0">
									<xsl:element name="editable">true</xsl:element>
								</xsl:when>
								<xsl:otherwise/>
							</xsl:choose>
							<xsl:choose>
								<xsl:when test="count($outputTemplateXMLDOC//supsfo:duplex) > 0">
									<xsl:element name="duplex">true</xsl:element>
								</xsl:when>
								<xsl:otherwise/>
							</xsl:choose>
						</xsl:element>					
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>										
			</xsl:for-each>
		</Outputs>
	</xsl:template>
</xsl:stylesheet>
<!-- 
	$Header: /CVSRepository/clientoas/caseman/screens/caseman_wp/EnterVariableData/_Generic/GenerateQuestionsEditor.xsl,v 1.4 2006/05/16 14:38:44 f_vdd Exp $
  -->
