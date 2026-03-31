<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format">

<xsl:output method="xml" indent="yes"/>
	<xsl:template match="rows">

		<xsl:apply-templates select="wpNames"/>	

	</xsl:template>

	<xsl:template name="wpNames" match="rows">
		<Keys>
			<xsl:for-each select="//AsIs">
				<AsIs wpVariable="{Code}">
					<BriefDescrption><xsl:value-of select="BriefDescrption"/></BriefDescrption>
					<SelectClause><xsl:value-of select="SelectClause"/></SelectClause>
					<WhereClause><xsl:value-of select="WhereClause"/></WhereClause>
				</AsIs>
			</xsl:for-each>
	     </Keys>		
	</xsl:template>	
	
</xsl:stylesheet>