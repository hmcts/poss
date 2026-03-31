/** 
 * @fileoverview CaseMan Form Parameter Constants - Contains a list of xpath constants
 * used throughout CaseMan to hold data passed between forms.
 *
 * @author Chris Vincent
 * @version 1.0 
 *
 * Change History:
 * 13/06/2006 - Chris Vincent, added CaseManFormParameters.ORNODE_XPATH
 * 22/06/2006 - Chris Vincent, removed MaintainWarrantAmountParams.COURT_CODE as the screen now
 *				uses the global court code, not a specific court code passed to it.
 * 11/07/2006 - Chris Vincent, added the CodedPartySearchParams for the new Coded Party Search
 * 				Subform.
 * 04/08/2009 - Chris Vincent, added the DisplayDMSParams now that navigation buttons have been
 *              added to the Display DMS screen (TRAC 1186).
 * 09/02/2010 - Mark Groen, added global constant  - OR_COURT_CODE_XPATH as part of TRAC 2446
 * 11/06/2012 - Chris Vincent, added CASEDATA_PENDINGTRANSFERWARNING_XPATH as part of Trac 4692.
 */


/**
 * @constructor
 * @author rzxd7g
 * 
 */
function CaseManFormParameters() {}


/*
*Oracle Report Court Code  - added as part of TRAC 2446
*/
CaseManFormParameters.OR_COURT_CODE_XPATH = "/ds/var/app/ORData/Court/Code";
/**
 * Court Number
 */
CaseManFormParameters.COURTNUMBER_XPATH = "/ds/var/app/currentCourt";  

/**
 * Court Name
 */
CaseManFormParameters.COURTNAME_XPATH = "/ds/var/app/UserData/OwningCourtName";

/**
 * Court Id
 */
CaseManFormParameters.COURTID_XPATH = "/ds/var/app/UserData/CourtId"; 

/**
 * User Name
 */
CaseManFormParameters.USERNAME_XPATH = "/ds/var/app/userId";

/**
 * User Alias
 */
CaseManFormParameters.USER_ALIAS_XPATH = "/ds/var/app/UserData/UserAlias"; 

/**
 * Security Role
 */
CaseManFormParameters.SECURITYROLE_XPATH = "/ds/var/app/UserData/UserRoleCode";

/**
 * Window for Trial message to be displayed for future navigation to the Window for
 * Trial screen.
 */
CaseManFormParameters.WFTMESSAGE_XPATH = "/ds/var/app/EventData/WFTMessage";

/**
 * Word Processing Parameters Node - contains data required for word processing
 */
CaseManFormParameters.WPNODE_XPATH = "/ds/var/app/WPData/WordProcessing";

/**
 * Oracle Report Parameters Node - contains data required for oracle reports
 */
CaseManFormParameters.ORNODE_XPATH = "/ds/var/app/ORData/WordProcessing";

/**
 * Indicator used by the Case/AE Events screens for tracking whether the owning court
 * warning message has been displayed so it is only displayed the once.
 */
CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH = "/ds/var/app/CaseData/OwningCourtWarningIndicator";

/**
 * Indicator used by the Case Events screen for tracking whether the court is pending transfer
 * warning message has been displayed so it is only displayed the once.
 */
CaseManFormParameters.CASEDATA_PENDINGTRANSFERWARNING_XPATH = "/ds/var/app/CaseData/PendingTransferWarningIndicator";

/**
 * Indicator used by the CO Events screen for tracking whether the owning court
 * warning message has been displayed so it is only displayed the once.
 */
CaseManFormParameters.CODATA_OWNINGCOURTWARNING_XPATH = "/ds/var/app/COData/OwningCourtWarningIndicator";

/**
 * Query By Party Root Node - Query By Party data is written to here.
 */
CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH = "/ds/var/app/QueryByParty";

/**
 * System Date override value - if a valid date value exists here, then it is used in the client in preference to the real system date.
 */
CaseManFormParameters.OVERRIDE_SYSTEM_DATE = "/ds/var/app/OverrideSystemDate";

/**
 * Page size used when returning a finite number of records at a time with searches
 * that will return large data sets
 */
CaseManFormParameters.DEFAULT_PAGE_SIZE = 50;

/**
 * Data that is passed to the Manage Case Screen
 * @author rzxd7g
 * 
 */
function CreateCaseParams() {}

CreateCaseParams.PARENT	   = "/ds/var/app/CreateCaseParams";
CreateCaseParams.CASE_NUMBER  = CreateCaseParams.PARENT + "/CaseNumber";

/**
 * Data that is passed to the Maintain Case Events Screen
 * @author rzxd7g
 * 
 */
function ManageCaseEventsParams() {}

ManageCaseEventsParams.PARENT	   = "/ds/var/app/ManageCaseEventsParams";
ManageCaseEventsParams.CASE_NUMBER  = ManageCaseEventsParams.PARENT + "/CaseNumber";

/**
 * Data that is passed to the Maintain Case Hearings Screen
 * @author rzxd7g
 * 
 */
function HearingParams() {}

HearingParams.PARENT	   = "/ds/var/app/HearingParams";
HearingParams.CASE_NUMBER  = HearingParams.PARENT + "/CaseNumber";
HearingParams.CO_NUMBER    = HearingParams.PARENT + "/CONumber";
HearingParams.HEARING_TYPE = HearingParams.PARENT + "/Type";

/**
 * Constant used in association with HearingParams.HEARING_TYPE
 * @author rzxd7g
 * 
 */
function HearingParamsConstants() {}
HearingParamsConstants.CASE	= "CURRENT_HRG_TYPE";
HearingParamsConstants.AE   = "CURRENT_HRG_TYPE_AE";
HearingParamsConstants.CO   = "CO_HRG_TYPE";

/**
 * Data that is passed to the Judgments Screen
 * @author rzxd7g
 * 
 */
function JudgmentParams() {}

JudgmentParams.PARENT	   = "/ds/var/app/JudgmentParams";
JudgmentParams.CASE_NUMBER = JudgmentParams.PARENT + "/CaseNumber";

/**
 * Data that is passed to the Judgments Screen
 * @author rzxd7g
 * 
 */
function BarJudgmentParams() {}

BarJudgmentParams.PARENT	   = "/ds/var/app/BarJudgmentParams";
BarJudgmentParams.CASE_NUMBER  = BarJudgmentParams.PARENT + "/CaseNumber";

/**
 * Data that is passed to the maintain obligations screen
 * @author rzxd7g
 * 
 */
function MaintainObligationsParams() {}

MaintainObligationsParams.PARENT			= "/ds/var/app/MaintainObligations";
MaintainObligationsParams.CASE_NUMBER		= MaintainObligationsParams.PARENT + "/Obligation/CaseNumber";
MaintainObligationsParams.EVENT_ID			= MaintainObligationsParams.PARENT + "/Obligation/EventId";
MaintainObligationsParams.EVENT_SEQ			= MaintainObligationsParams.PARENT + "/Obligation/EventSequence";
MaintainObligationsParams.EVENT_TYPE		= MaintainObligationsParams.PARENT + "/Obligation/EventType";
MaintainObligationsParams.OBLIGATION_TYPE	= MaintainObligationsParams.PARENT + "/Obligation/ObligationRule/ObligationType";
MaintainObligationsParams.OBLIGATION_SEQ	= MaintainObligationsParams.PARENT + "/Obligation/ObligationRule/ObligationSeq";
MaintainObligationsParams.DEFAULT_DAYS		= MaintainObligationsParams.PARENT + "/Obligation/ObligationRule/DefaultDays";
MaintainObligationsParams.MECHANISM			= MaintainObligationsParams.PARENT + "/Obligation/ObligationRule/Mechanism";
MaintainObligationsParams.ACTION			= MaintainObligationsParams.PARENT + "/Obligation/ObligationRule/Action";
MaintainObligationsParams.MAINTENANCE_MODE	= MaintainObligationsParams.PARENT + "/Obligation/ObligationRule/MaintenanceMode";

/**
 * Data that is passed to the Human Rights Act Screen
 * @author rzxd7g
 * 
 */
function HumanRightsActParams() {}

HumanRightsActParams.PARENT	   = "/ds/var/app/HumanRightsActParams";
HumanRightsActParams.CASE_NUMBER = HumanRightsActParams.PARENT + "/CaseNumber";

/**
 * Data that is passed to the maintain obligations screen
 * @author rzxd7g
 * 
 */
function TransferCaseParams() {}

TransferCaseParams.PARENT	   = "/ds/var/app/TransferCaseParams";
TransferCaseParams.CASE_NUMBER = TransferCaseParams.PARENT + "/CaseNumber";
TransferCaseParams.COMPLETE_TRANSFER_IND = TransferCaseParams.PARENT + "/CompleteTransfer";
TransferCaseParams.RUN_DISTRICT_JUDGES_REPORT = TransferCaseParams.PARENT + "/RunDistrictJudgesReport";

/**
 * Data that is passed to the Create Home Warrants screen
 * @author rzxd7g
 * 
 */
function HomeWarrantsParams() {}

HomeWarrantsParams.PARENT	   = "/ds/var/app/HomeWarrantsParams";
HomeWarrantsParams.WARRANT_ID  = HomeWarrantsParams.PARENT + "/WarrantID";
HomeWarrantsParams.CASE_NUMBER = HomeWarrantsParams.PARENT + "/CaseNumber";

/**
 * Data that is passed to the Maintain Warrants screen
 * @author rzxd7g
 * 
 */
function MaintainWarrantsParams() {}

MaintainWarrantsParams.PARENT	   = "/ds/var/app/MaintainWarrantsParams";
MaintainWarrantsParams.WARRANT_ID  = MaintainWarrantsParams.PARENT + "/WarrantID";
MaintainWarrantsParams.CASE_NUMBER = MaintainWarrantsParams.PARENT + "/CaseNumber";
MaintainWarrantsParams.CO_NUMBER   = MaintainWarrantsParams.PARENT + "/CONumber";

/**
 * Data that is passed to the Warrant Returns screen
 * @author rzxd7g
 * 
 */
function WarrantReturnsParams() {}

WarrantReturnsParams.PARENT	     = "/ds/var/app/WarrantReturnsParams";
WarrantReturnsParams.WARRANT_ID  = WarrantReturnsParams.PARENT + "/WarrantID";
WarrantReturnsParams.CASE_NUMBER = WarrantReturnsParams.PARENT + "/CaseNumber";
WarrantReturnsParams.CO_NUMBER   = WarrantReturnsParams.PARENT + "/CONumber";

/**
 * Data that is passed to the Reissue Warrants screen
 * @author rzxd7g
 * 
 */
function ReissueWarrantsParams() {}

ReissueWarrantsParams.PARENT	  = "/ds/var/app/ReissueWarrantsParams";
ReissueWarrantsParams.WARRANT_ID  = ReissueWarrantsParams.PARENT + "/WarrantID";
ReissueWarrantsParams.CASE_NUMBER = ReissueWarrantsParams.PARENT + "/CaseNumber";
ReissueWarrantsParams.CO_NUMBER   = ReissueWarrantsParams.PARENT + "/CONumber";

/**
 * Data that is passed to the Maintain Warrant Refunds/Fees screen
 * @author rzxd7g
 * 
 */
function MaintainWarrantAmountParams() {}

MaintainWarrantAmountParams.PARENT	       = "/ds/var/app/MaintainWarrantAmountParams";
MaintainWarrantAmountParams.WARRANT_ID	   = MaintainWarrantAmountParams.PARENT + "/WarrantID";

/**
 * Data that is passed to the Maintain Windows for Trial screen
 * @author rzxd7g
 * 
 */
function MaintainWftParams() {}

MaintainWftParams.PARENT		  = "/ds/var/app/WftData";
MaintainWftParams.CASE_NUMBER	  = MaintainWftParams.PARENT + "/WindowForTrial/CaseNumber";
MaintainWftParams.CASE_EVENT_SEQ  = MaintainWftParams.PARENT + "/WindowForTrial/CaseEventSeq";
MaintainWftParams.CASE_EVENT_DETS = MaintainWftParams.PARENT + "/WindowForTrial/Details";
MaintainWftParams.WFT_CODE		  = MaintainWftParams.PARENT + "/WindowForTrial/Prompt";

/**
 * Data that is passed to the Manage AE Events screen
 * @author rzxd7g
 * 
 */
function ManageAEEventsParams() {}

ManageAEEventsParams.PARENT		 = "/ds/var/app/ManageAEEvents";
ManageAEEventsParams.CASE_NUMBER = ManageAEEventsParams.PARENT + "/CaseNumber";
ManageAEEventsParams.AE_NUMBER	 = ManageAEEventsParams.PARENT + "/AENumber";

/**
 * Data that is passed to the Manage AE screen
 * @author rzxd7g
 * 
 */
function ManageAEParams() {}

ManageAEParams.PARENT	   = "/ds/var/app/ManageAttachmentOfEarnings";
ManageAEParams.CASE_NUMBER = ManageAEParams.PARENT + "/CaseNumber";
ManageAEParams.AE_NUMBER   = ManageAEParams.PARENT + "/AENumber";

/**
 * Data that is passed to the Manage AE Amounts screen
 * @author rzxd7g
 * 
 */
function MaintainAEAmountParams() {}

MaintainAEAmountParams.PARENT	   = "/ds/var/app/ManageAEAmountParams";
MaintainAEAmountParams.CASE_NUMBER = MaintainAEAmountParams.PARENT + "/CaseNumber";
MaintainAEAmountParams.AE_NUMBER   = MaintainAEAmountParams.PARENT + "/AENumber";

/**
 * Data that is passed to the PER Calculator screens
 * @author rzxd7g
 * 
 */
function PERCalculatorParams() {}

PERCalculatorParams.PARENT		 = "/ds/var/app/PERCalculatorParams";
PERCalculatorParams.AE_NUMBER	 = PERCalculatorParams.PARENT + "/AENumber";
PERCalculatorParams.CO_NUMBER	 = PERCalculatorParams.PARENT + "/CONumber";

/**
 * Data that is passed to the Manage CO Events screen
 * @author rzxd7g
 * 
 */
function ManageCOEventsParams() {}

ManageCOEventsParams.PARENT	   = "/ds/var/app/ManageCOEventsParams";
ManageCOEventsParams.CO_NUMBER = ManageCOEventsParams.PARENT + "/CONumber";
ManageCOEventsParams.CO_STATUS = ManageCOEventsParams.PARENT + "/COStatus";

/**
 * Data that is passed to the Determination of Means Calculator Screen
 * @author rzxd7g
 * 
 */
function DeterminationOfMeansParams() {}

DeterminationOfMeansParams.PARENT	   = "/ds/var/app/DeterminationOfMeansParams";
DeterminationOfMeansParams.CO_NUMBER = DeterminationOfMeansParams.PARENT + "/CONumber";

/**
 * Data that is passed to the Manage CO screen
 * @author rzxd7g
 * 
 */
function ManageCOParams() {}

ManageCOParams.PARENT	         = "/ds/var/app/ManageCOParams";
ManageCOParams.CO_NUMBER         = ManageCOParams.PARENT + "/CONumber";
ManageCOParams.MODE = ManageCOParams.PARENT + "/ScreenMode"; 	/* either ManageCOParamsConstants.CREATE_MODE, 
								   ManageCOParamsConstants.MAINTAIN_MODE
								   ManageCOParamsConstants.INITIAL_MODE
								   ManageCOParamsConstants.READONLY_MODE
								 */

/**
 * Constant used in association with ManageCOParams.MODE
 * @author rzxd7g
 * 
 */
function ManageCOParamsConstants() {}

ManageCOParamsConstants.CREATE_MODE	= "C";
ManageCOParamsConstants.MAINTAIN_MODE 	= "M";
ManageCOParamsConstants.INITIAL_MODE 	= "I";
ManageCOParamsConstants.READONLY_MODE 	= "R";

/**
 * Data that is passed to the View Payments screen
 * @author rzxd7g
 * 
 */
function ViewPaymentsParams() {}
ViewPaymentsParams.PARENT = "/ds/var/app/ViewPaymentsParams";
ViewPaymentsParams.ENFORCEMENT_NUMBER = ViewPaymentsParams.PARENT + "/EnforcementNumber";
ViewPaymentsParams.ENFORCEMENT_TYPE = ViewPaymentsParams.PARENT + "/EnforcementType";
ViewPaymentsParams.ISSUING_COURT = ViewPaymentsParams.PARENT + "/IssuingCourt";
ViewPaymentsParams.CURRENTLY_OWNED_BY_COURT = ViewPaymentsParams.PARENT + "/CurrentlyOwnedBy";

/**
 * Constant used in association with ViewPaymentsParams.ENFORCEMENT_TYPE
 * @author rzxd7g
 * 
 */
function ViewPaymentsParamsConstants() {}

ViewPaymentsParamsConstants.CASE = "CASE";
ViewPaymentsParamsConstants.HOMEWARRANT = "HOME WARRANT";
ViewPaymentsParamsConstants.FOREIGNWARRANT = "FOREIGN WARRANT";
ViewPaymentsParamsConstants.CO = "CO";
ViewPaymentsParamsConstants.AE = "AE";

/**
 * Data that is passed to the View Dividends screen
 * @author rzxd7g
 * 
 */
function ViewDividendsParams() {}
ViewDividendsParams.PARENT = "/ds/var/app/ViewDividendsParams";
ViewDividendsParams.CO_NUMBER = ViewDividendsParams.PARENT + "/CONumber";


/**
 * Data that is passed to the Transfer CO Screen
 * @author rzxd7g
 * 
 */
function TransferCOParams() {}
TransferCOParams.PARENT = "/ds/var/app/TransferCOParams";
TransferCOParams.CO_NUMBER = TransferCOParams.PARENT + "/CONumber";


/**
 * Data that is passed to the Complete Payout SCreen
 * @author rzxd7g
 * 
 */
function CompletePayoutParams() {}
CompletePayoutParams.PARENT = "/ds/var/app/CompletePayoutParams";
CompletePayoutParams.RUNDIVIDEND_IND = CompletePayoutParams.PARENT + "/RunDividendDeclarationInd";

/**
 * Data used by the Coded Party Search Subform
 * @author rzxd7g
 * 
 */
function CodedPartySearchParams() {}
CodedPartySearchParams.PARENT = "/ds/var/form/CodedPartySearchData";
CodedPartySearchParams.ADMIN_COURT_CODE = CodedPartySearchParams.PARENT + "/AdminCourtCode";
CodedPartySearchParams.RETRIEVAL_SERVICE = CodedPartySearchParams.PARENT + "/RetrievalService";

/**
 * Constant used in association with CodedPartySearchParams.RETRIEVAL_SERVICE
 * @author rzxd7g
 * 
 */
function CodedPartySearchParamsConstants() {}
CodedPartySearchParamsConstants.COURTONLY = "getCodedPartiesShortNew";
CodedPartySearchParamsConstants.COURTANDNATIONAL = "getAllCodedPartiesShortNew";

/**
 * Data that is passed to the Display DMS Report screen (added for TRAC 1186)
 * @author rzxd7g
 */
function DisplayDMSParams() {}
DisplayDMSParams.PARENT	   = "/ds/var/app/DisplayDMSParams";
DisplayDMSParams.PAGE_NUMBER = DisplayDMSParams.PARENT + "/PageNumber";