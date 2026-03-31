<?xml version="1.0" encoding="UTF-8"?>
<!--This stylesheet generates documentation (QuestionScreenMapping.html) mapping the questions developed to the screens where they are used-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format">
	<xsl:param name="webfileDir" /> 
	
	<xsl:template match="Questions">
		   	
	    <table border="1"  align="center">
			<caption>Mapping of Questions to Screens</caption>
			
			<thead>
				<tr bgcolor="lightblue">
					<th>Question</th>
					<th>Group</th>
					<th>Screen</th>					
				</tr>
			</thead>
			
			<tbody>	
				<xsl:for-each select="Question/@id"> 
				
	      		<xsl:variable name="questionfile" select="string(concat($webfileDir,'EnterVariableData\_Generic\Questions\',. ,'.xml'))"/>
	      		   
	    			<tr>
	    			<td><xsl:value-of select="."/>
	    				<xsl:text>) </xsl:text>
	    				<xsl:value-of select="document($questionfile)/Question/Label"/>
	    			</td>
	    				<xsl:call-template name="matchGroupId">
	    					<xsl:with-param name="questionid">
  								<xsl:value-of select="." /> 
  							</xsl:with-param>
  						</xsl:call-template> 
  						<xsl:call-template name="matchScreenId">
	    					<xsl:with-param name="questionid">
  								<xsl:value-of select="." /> 
  							</xsl:with-param>
  						</xsl:call-template> 
	    			</tr>
	  			</xsl:for-each>
	  		</tbody>
	  	</table>	  	
	</xsl:template>
	
	<xsl:template name="matchGroupId">
		<xsl:param name="questionid" />
		<xsl:variable name="groupfile" select="string(concat($webfileDir,'EnterVariableData\_Generic\Grouping.xml'))"/>						
			 
	   	<td align="center">	    			 						
	   	
	    <xsl:for-each select="document($groupfile)/Groups/Group/QuestionId">
	      <xsl:variable name="thisQid" select="."/>
		  <xsl:if test="$thisQid=$questionid">	      
	        <xsl:text>  </xsl:text><xsl:value-of select="./../@GroupId"/>
	      </xsl:if>	      	      
	    </xsl:for-each> 	 
	      
	   </td>
	</xsl:template>
	
	
	<xsl:template name="matchScreenId">
		<xsl:param name="questionid" />
		<xsl:variable name="groupfile" select="string(concat($webfileDir,'EnterVariableData\_Generic\Grouping.xml'))"/>						
		<xsl:variable name="screensfile" select="string(concat($webfileDir,'EnterVariableData\_Generic\generated\Screens.xml'))"/>
		<xsl:variable name="questionfile" select="string(concat($webfileDir,'EnterVariableData\_Generic\Questions\',. ,'.xml'))"/>
		
	 
	   	<td>	    			 							   	 
	    <xsl:for-each select="document($groupfile)/Groups/Group/QuestionId">
	      <xsl:variable name="thisQid">
	        <xsl:value-of select="."/>
	      </xsl:variable>
		  <xsl:if test="$thisQid=$questionid">	 
		  	<xsl:variable name="gid" select="./../@GroupId"/> 

		  	<!-- got the group id ; now match with screen id-->
		  	<xsl:for-each select="document($screensfile)/Screens/Screen/@id">
		  		<xsl:variable name="thisScreen" select="string(concat($webfileDir,'EnterVariableData\_Generic\Screens\',.,'.xml'))"/>
		  		<xsl:variable name="screen" select="."/>	
										  	
		  		
		  		
		  		
		  		<xsl:for-each select="document($thisScreen)/Screen/GroupId">
		  			<xsl:variable name="thisGid" select="."/>
		  			<xsl:if test="$gid=$thisGid">
		  			 
		  			<xsl:choose> 
		  				<xsl:when test="boolean(document($questionfile)/Question/Context[@screenId=$screen])"> 
		  					<xsl:choose> 
		  						<xsl:when test="boolean(document($questionfile)/Question/Context[@screenId=$screen]/isVisible)"> 
		  						<xsl:text>  </xsl:text><xsl:value-of select="$screen"/> (isVisible: <xsl:value-of select="document($questionfile)/Question/Context[@screenId=$screen]/isVisible"/>)
		  						</xsl:when>
		  					</xsl:choose>				  							  			   				  		     
		  					<xsl:if test="boolean(document($questionfile)/Question/Context[@screenId=$screen]/Label)">
			  					(Label: <xsl:value-of select="document($questionfile)/Question/Context[@screenId=$screen]/Label"/>)
		  					</xsl:if>
					  		 <xsl:choose> 
								<xsl:when test="boolean(document($questionfile)/Question/Context[@screenId=$screen]/isVisible)"> 
									<xsl:text> </xsl:text><xsl:value-of select="$screen"/> (isVisible: <xsl:value-of select="document($questionfile)/Question/Context[@screenId=$screen]/isVisible"/>)
								</xsl:when>		
							</xsl:choose> 	
							<xsl:if test="boolean(document($questionfile)/Question/Context[@screenId=$screen]/Label)">
								(Label: <xsl:value-of select="document($questionfile)/Question/Context[@screenId=$screen]/Label"/>)
							</xsl:if>
				  		 </xsl:when>
				  		<xsl:otherwise>
				  			<xsl:text>  </xsl:text><xsl:value-of select="$screen"/>  
				  		</xsl:otherwise>
			  		</xsl:choose>	  
		  			  
		  			  
		  			  
		  			</xsl:if>
		  		</xsl:for-each>
		  	</xsl:for-each>
		  	
	      </xsl:if>	      
	    </xsl:for-each> 	   
	   </td>
	</xsl:template>
</xsl:stylesheet>