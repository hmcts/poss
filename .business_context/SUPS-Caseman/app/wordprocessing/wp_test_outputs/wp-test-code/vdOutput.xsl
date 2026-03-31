<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format">

<xsl:output method="xml" indent="yes"/>
	<xsl:template match="Outputs">
		<xsl:apply-templates select="map"/>	
	</xsl:template>
	
	<xsl:template name="map" match="Outputs">
	<Mappings>	
	
				<xsl:for-each select="Output">
				<Map>
								<Output><xsl:value-of select="Id"/></Output>
								<xsl:value-of select="current()"/>
														
								<xsl:for-each select="variables/xsl:value-of">					
										<XslVariable name="{@select}"></XslVariable>
								</xsl:for-each>
				</Map>
				</xsl:for-each>
	</Mappings>				
	</xsl:template>	
	
</xsl:stylesheet>