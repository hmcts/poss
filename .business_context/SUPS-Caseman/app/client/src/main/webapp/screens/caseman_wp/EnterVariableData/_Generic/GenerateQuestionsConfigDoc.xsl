<?xml version="1.0" encoding="UTF-8"?>
<!--This stylesheet generates documentation (GenerateQuestionsConfigDoc.xml) diplaying all configuration code-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="webfileDir" /> 
	
	<xsl:template match="Questions">		
		<Questions>
			<xsl:for-each select="Question">
				<xsl:call-template name="appendQuestion">
	    					<xsl:with-param name="questionid">
  								<xsl:value-of select="@id" /> 
  							</xsl:with-param>
  				</xsl:call-template> 
			</xsl:for-each>
		</Questions>	   		
	</xsl:template>
	
	
	<xsl:template name="appendQuestion">
		<xsl:param name="questionid" />
		<xsl:variable name="questionfile" select="string(concat($webfileDir,'EnterVariableData\_Generic\Questions\',$questionid,. ,'.xml'))"/>
	
			<xsl:copy-of select="document($questionfile)/Question"/>
	
	</xsl:template>
</xsl:stylesheet>