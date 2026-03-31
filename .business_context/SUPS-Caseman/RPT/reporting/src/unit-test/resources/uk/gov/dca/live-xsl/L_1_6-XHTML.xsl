<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1002E"><div><font size="4" face="Arial">
		<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantName"/> v <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendant1Name"/>
		</div>
 		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdWhatToDo = '1'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
					Please find enclosed a copy of the Defence filed in this action. In view of its contents, please give your directions as how you wish to proceed:
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					i) Withdraw the action
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					ii) Proceed to hearing/transfer
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					iii) Adjourn the action generally
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					iv) Other (Please state)
				</div>
			</xsl:when>
			<xsl:when test="$vdWhatToDo = '2'">
				<div xmlns="" style="margin-bottom: 0.8cm;">
					Please find enclosed a copy of the form of Admission filed in this action. Please inform the Court if you accept the offer of payment contained therein.
				</div>
			</xsl:when>
			<xsl:when test="$vdWhatToDo = '3'">
				<div xmlns="" style="margin-bottom: 0.8cm;">
					Please find enclosed a copy of the Defendant's reply to your application for possession (form N11B).
					This matter has today been referred to the District Judge for consideration. The application would normally be considered by the District Judge within 5 working days and the order or a reply dispatched within 10 working days of issue.
				</div>
			</xsl:when>
			<xsl:when test="$vdWhatToDo = '4'">
				<div xmlns="" style="margin-bottom: 0.8cm;">
					Please find enclosed your Landlord and Tenant Exclusion Order approved by the District Judge.
				</div>
			</xsl:when>
			<xsl:when test="$vdWhatToDo = '5'">
				<div xmlns="" style="margin-bottom: 0.8cm;">
					<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdWhatToDoOther"/>
				</div>
			</xsl:when>
		</xsl:choose>
		<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
		<div style="margin-bottom: 4cm;">Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>