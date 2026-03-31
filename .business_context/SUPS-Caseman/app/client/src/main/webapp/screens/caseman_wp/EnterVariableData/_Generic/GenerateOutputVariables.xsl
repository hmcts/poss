<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:java="http://xml.apache.org/xslt/java" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo">
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
							<xsl:element name="location"><xsl:value-of select="$outputTemplateLocation"/></xsl:element>
							<xsl:element name="Id">
								<xsl:value-of select="Id"/>						
							</xsl:element>
												
							<variables>
								<xsl:copy-of select="$outputTemplateXMLDOC/descendant::*[contains(@select,'$')]"/>
								<xsl:copy-of select="$outputTemplateXMLDOC/descendant::*[contains(@test,'$')]"/>
							</variables>					
							
						</xsl:element>					
					</xsl:when>
					<xsl:otherwise>
						<!-- <xsl:variable name="outputTemplateXMLDOC" select="document($outputTemplateLocation)"/>-->
						<xsl:element name="Output">
							<xsl:element name="location"><xsl:value-of select="$outputTemplateLocation"/><xsl:value-of select="Id"/></xsl:element>
							<xsl:element name="Id">
								<xsl:value-of select="Id"/>						
							</xsl:element>
												
							<variables>
								<NoWPLetterTemplate/>
							</variables>					
							
						</xsl:element>						
					</xsl:otherwise>
				</xsl:choose>

			</xsl:for-each>
		</Outputs>
	</xsl:template>
</xsl:stylesheet>