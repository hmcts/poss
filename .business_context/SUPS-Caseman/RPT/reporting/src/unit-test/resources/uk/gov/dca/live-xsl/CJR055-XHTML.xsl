<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100BF"><div><font size="2" face="Times New Roman">
			<div style="font-weight: bold; margin-bottom: 0.4cm;"> ON THE 
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> </div>
			<div style="margin-bottom: 0.4cm;"> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/> </div>
			<div style="margin-bottom: 0.4cm;">
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
			</div>
			<div style="margin-bottom: 0.4cm;"> <span style="font-weight: bold;">and 
				the court orders</span> that </div>
			<ol><xsl:call-template name="possession1"/></ol>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template><xsl:template name="possession1"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.2cm;">
						The defendant is to give up possession of 
						<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionProperty"/> 
						to the claimant.
					</div></li><xsl:call-template name="possession2"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession2"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.2cm;">
						The date on which the defendant is to give up possession 
						of the property to the claimant is postponed to a date to 
						be fixed by the court on an application by the claimant. 
						The defendant's tenancy of the property will continue 
						until that date.
					</div></li><xsl:call-template name="possession3"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession3"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.2cm;">
						The defendant must pay the claimant £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossAmountOrdered"/> 
						for rent arrears<xsl:if xmlns="http://eds.com/supsfo" test="$vdOrderForCosts = 'Y'">
						and £<xsl:value-of select="$vdPossOrderCostAmount"/> for costs</xsl:if>.
						The total judgment debt is £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossTotalAmountOwing"/> 
						to be paid by instalments as specified in paragraph 4 below.
					</div></li><xsl:call-template name="possession4"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession4"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.2cm;">
						The claimant shall not be entitled to make an application 
						for a date to be fixed for the giving up of possession and 
						the termination of the defendant's tenancy so long as the 
						defendant pays the claimant the current rent together with 
						instalments of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossInstalmentAmount"/> 
						per <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionInstalmentPeriod"/> 
						towards the judgment debt. 
					</div></li><xsl:call-template name="possession5"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession5"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.2cm;">
						The first payment of the current rent and the first instalment 
						must be made on or before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossFirstInstalmentDate"/> 
					</div></li><xsl:call-template name="possession6"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession6"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.2cm;">
						Any application to fix the date on which the defendant is to 
						give up possession may be determined on the papers without a 
						hearing (unless the district judge considers that such a hearing 
						is necessary).
					</div></li><xsl:call-template name="possession7"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession7"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.2cm;">
						This order shall cease to be enforceable when the total judgment 
						debt is satisfied.
					</div></li></xsl:template></xsl:stylesheet>