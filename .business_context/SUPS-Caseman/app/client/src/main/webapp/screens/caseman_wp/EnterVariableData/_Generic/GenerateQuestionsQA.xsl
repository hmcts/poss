<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:java="http://xml.apache.org/xslt/java" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo" xmlns:file="java.io.File">
	<xsl:output method="xml" indent="yes"/>
	<xsl:param name="templateDir"/>
	<xsl:param name="webfileDir"/>
	
	<xsl:template match="Outputs">
		<Outputs>
			<xsl:for-each select="Output">
			
				<xsl:variable name="outputId" select="Id"/>
				<xsl:variable name="screenlocation" select="string(concat($webfileDir, 'EnterVariableData\_Generic\Screens\', $outputId, '.xml'))"/>
				<xsl:variable name="outputQAScreenExists" select="boolean(document($screenlocation))"/>			

				<xsl:element name="Output">
					<xsl:element name="Id">
						<xsl:value-of select="Id"/>						
					</xsl:element>
					<xsl:choose>
						<xsl:when test="$outputQAScreenExists">
							<xsl:element name="question">
								<xsl:attribute name="screen"><xsl:value-of select="$outputId" /></xsl:attribute>
							</xsl:element>
						</xsl:when>
						<xsl:otherwise>
							<noquestion/>
						</xsl:otherwise>										
					</xsl:choose>
				</xsl:element>
			</xsl:for-each>
		</Outputs>
	</xsl:template>
</xsl:stylesheet>