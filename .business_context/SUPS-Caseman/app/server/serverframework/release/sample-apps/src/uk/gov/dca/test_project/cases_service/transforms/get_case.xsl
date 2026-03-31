<?xml version="1.0"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:xalan="http://xml.apache.org/xalan"
                xmlns:ejbx="uk.gov.dca.db.xslt.EJBExtension"
                extension-element-prefixes="ejbx"
                version="1.0">
                
  <xalan:component prefix="ejbx" elements="invoke" functions="">
    <xalan:script lang="javaclass" src="uk.gov.dca.db.xslt.EJBExtension"/>
  </xalan:component>
                
  <xsl:output method="xml" indent="yes"/>
  
  <!-- This tests proves that an XSL stylesheet can be invoked via the service framework -->
  <!-- in order to call another EJB service (which can then output XML) -->
  
  <!-- need to pass the 'params' xml fragment into the ejb. However, that is the xml -->
  <!-- we are currently processing, so call a helper template to create a string. -->
  
  <xsl:template match="/params"> 	
  	<xsl:variable name="params"><xsl:call-template name="createParamsString"/></xsl:variable>
  	
  	<xsl:if test="./param">
  		<xsl:copy-of select="ejbx:invokeLocal(string('ejb/CasesServiceLocal'), string('getCaseLocal'), string($params))" />
  	</xsl:if>
  </xsl:template>
 
 
  <!-- simple helper template to create string version of params -->
  
  <xsl:template name="createParamsString">
  	<xsl:text>&lt;params&gt;</xsl:text>
  	<xsl:for-each select="./param">
  		<xsl:text>&lt;param name="</xsl:text><xsl:value-of select="@name"/><xsl:text>"&gt;</xsl:text><xsl:value-of select="."/><xsl:text>&lt;/param&gt;</xsl:text>
  	</xsl:for-each>
  	<xsl:text>&lt;/params&gt;</xsl:text>
  </xsl:template>
  
  
</xsl:stylesheet>