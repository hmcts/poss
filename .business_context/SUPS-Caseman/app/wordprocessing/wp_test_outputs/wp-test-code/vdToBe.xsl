<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format">

<xsl:output method="xml" indent="yes"/>
	<xsl:template match="rows">

		<xsl:apply-templates select="wpNames"/>	

	</xsl:template>

	<xsl:template name="wpNames" match="rows">
		<Keys>
			<xsl:for-each select="//XslVariable">
				<ToBe vdName="{@name}">
					<xsl:copy-of select="ToBe/XPath"/>
					<xsl:copy-of select="ToBe/SummaryInfo"/>	
					<xsl:copy-of select="ToBe/Values"/>	
					<xsl:copy-of select="ToBe/Origin"/>			
				</ToBe>
			</xsl:for-each>
	     </Keys>		
	</xsl:template>	
	
</xsl:stylesheet>