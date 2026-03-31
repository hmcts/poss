<?xml version="1.0" encoding="UTF-8"?>
<!-- Used by the "test_pdf_outputs_under_development" target in wp_build_all build script    -->
<!-- This xslt creates a pattern set at build time that consists of only the files that need -->
<!-- to be copied from the source tree to the build tree, therefore minimising the amount    -->
<!-- of time the script spends in copying files around.                                      -->
<xsl:stylesheet version="1.0" xmlns:java="http://xml.apache.org/xslt/java" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text" indent="no"/>	
	
	<xsl:template match="Outputs">

		<xsl:choose>
			<xsl:when test="string-length(Output) > 0">

				<!-- If there is at least 1 output then add the following text -->
				<xsl:text>_Generic/*&#xD;</xsl:text>	
				<xsl:text>Outputs.xml&#xD;</xsl:text>					

				<!-- And process the output elements -->
				<xsl:for-each select="Output">			
					<xsl:variable name="location" select="Location"/>
					<!-- Write to the output the contents of location plus a carriage return -->
					<xsl:value-of select="$location"/>											
					<xsl:text>&#xD;</xsl:text>
					
					<xsl:variable name="finalLocation" select="FinalLocation"/>
					<xsl:if test="$location != $finalLocation">
						<xsl:value-of select="$finalLocation"/>											
						<xsl:text>&#xD;</xsl:text>
					</xsl:if>
					
					<!-- Replace 'FO.xml' with 'VAR.xml' in location and write it to the output followed by a carriage return -->			
					<xsl:value-of select="concat(substring-before($location,'FO.xml'), 'VAR.xml')"/>
					<xsl:text>&#xD;</xsl:text>							
				</xsl:for-each>

			</xsl:when>
			<xsl:otherwise>
				
				<!-- If the patternset is empty then it copies across all files -->
				<!-- so this is a hack to get around this problem -->
				<xsl:text>XXXXX&#xD;</xsl:text>	

			</xsl:otherwise>
		</xsl:choose>
	
	</xsl:template>
</xsl:stylesheet>

<!--
	carriage return and newline
	<xsl:text>&#xD;&#xA;</xsl:text>
-->