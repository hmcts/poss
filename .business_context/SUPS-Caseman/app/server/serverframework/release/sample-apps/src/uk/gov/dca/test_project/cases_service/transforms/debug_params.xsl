<?xml version="1.0"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:xalan="http://xml.apache.org/xalan"
                xmlns:ejbx="uk.gov.dca.db.xslt.EJBExtension"
                extension-element-prefixes="ejbx"
                version="1.0">
                
  <xsl:output method="xml" indent="yes"/>
  
  <!-- This tests proves that an XSL stylesheet can be invoked via the service framework -->
  
  <xsl:template match="/params">
  	<msg>found params tag</msg>
  	<xsl:for-each select="param">
  		<msg>found param:<xsl:value-of select="@name"/>=<xsl:value-of select="."/></msg>
  	</xsl:for-each>
  </xsl:template>
  
</xsl:stylesheet>