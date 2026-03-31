<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:log="http://simtec.ltd.uk/xml/log/3.2.1">
	<xsl:output method="text" encoding="UTF-8"/>
	<xsl:param name="USE_CASE"/>

    <!-- output all rows that should have been fetched from the cache but were not -->	
	<xsl:template match="/">
		<!-- headings: Use Case, Relative Time Started, Absolute Time Started, HTTP Method, URL, SUPS Service, SUPS Method, HTTP Result, In Cache Before, In Cache After, Time, Request Size, Response Size -->
		<xsl:for-each select="log:log/log:entry[ log:cache/log:beforeRequest/log:URLInCache = 'true' and log:result = '200']">
				<xsl:if test="@method='GET'">
					<xsl:value-of select="$USE_CASE"/>,<xsl:value-of select="log:started"/>,<xsl:value-of select="log:startedDateTime"/>,<xsl:value-of select="@method"/>,<xsl:value-of select="@URL"/>,<xsl:value-of select="log:request/log:queryString/log:parameter[@name='SUPS-Service']"/>,<xsl:value-of select="log:request/log:queryString/log:parameter[@name='SUPS-Method']"/>,<xsl:value-of select="log:result"/>,<xsl:value-of select="log:cache/log:beforeRequest/log:URLInCache"/>,<xsl:value-of select="log:cache/log:afterRequest/log:URLInCache"/>,<xsl:value-of select="log:time"/>,<xsl:value-of select="string-length(log:request/log:queryString)"/>,<xsl:value-of select="log:response/log:content/log:contentLength"/><xsl:text>&#10;</xsl:text>
				</xsl:if>
				<xsl:if test="@method='POST'">
					<xsl:value-of select="$USE_CASE"/>,<xsl:value-of select="log:started"/>,<xsl:value-of select="log:startedDateTime"/>,<xsl:value-of select="@method"/>,<xsl:value-of select="@URL"/>,<xsl:value-of select="log:request/log:headers/log:header[@name='sups-service']"/>,<xsl:value-of select="log:request/log:headers/log:header[@name='sups-method']"/>,<xsl:value-of select="log:result"/>,<xsl:value-of select="log:cache/log:beforeRequest/log:URLInCache"/>,<xsl:value-of select="log:cache/log:afterRequest/log:URLInCache"/>,<xsl:value-of select="log:time"/>,<xsl:value-of select="string-length(log:request/log:postData/log:parameter[@name='(Content)'])"/>,<xsl:value-of select="log:response/log:content/log:contentLength"/><xsl:text>&#10;</xsl:text>
				</xsl:if>
		</xsl:for-each>
	</xsl:template>
	
</xsl:stylesheet>