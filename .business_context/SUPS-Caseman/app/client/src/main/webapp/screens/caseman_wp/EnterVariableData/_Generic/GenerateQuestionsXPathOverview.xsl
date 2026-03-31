<?xml version="1.0" encoding="UTF-8"?>
<!-- edited with XMLSPY v5 rel. 3 U (http://www.xmlspy.com) by Fred (Electronic Data Systems LTD) -->
<!--This stylesheet generates documentation (Questions_XPaths.html) illustrating the questions developed, their JavaScript object name and the XPath bound to.-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format">
	<xsl:template match="Questions">
		<table border="1">
			<caption>Overview of Questions and their XPaths</caption>
			<thead>
				<tr bgcolor="lightblue">
					<th>Question</th>
					<th>Label</th>
					<th>JS Object</th>
					<th>XPath</th>
				</tr>
			</thead>
			<tbody>
				<xsl:for-each select="Question/@id">
					<xsl:variable name="thisQuestionId">
						<xsl:value-of select="."/>
					</xsl:variable>
					<xsl:variable name="thisQuestionFile">
						<xsl:text>./Questions/</xsl:text>
						<xsl:value-of select="$thisQuestionId"/>
						<xsl:text>.xml</xsl:text>
					</xsl:variable>
					<xsl:variable name="thisQuestionDoc" select="document($thisQuestionFile)"/>
					<tr>
						<td>
							<xsl:value-of select="$thisQuestionId"/>
						</td>
						<td>
							<xsl:value-of select="$thisQuestionDoc/Question/Label"/>
						</td>
						<td>
							<xsl:value-of select="$thisQuestionDoc/Question/ObjectName"/>
						</td>
						<td>
							<xsl:value-of select="$thisQuestionDoc/Question/Javascript/XPath"/>
						</td>
					</tr>
				</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
</xsl:stylesheet>
<!-- 
	$Header: /CVSRepository/clientoas/caseman/screens/caseman_wp/EnterVariableData/_Generic/GenerateQuestionsXPathOverview.xsl,v 1.2 2006/03/01 15:40:59 conganer Exp $
  -->
