/** 
 * @fileoverview ViewPaymentsConstants.js:
 * This file contains the constants used for UC110 - View Payments
 *
 * @author Tim Connor, Chris Vincent
 * @version 0.1
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.ROOT_XPATH = "/ds";
XPathConstants.VAR_FORM_XPATH = XPathConstants.ROOT_XPATH + "/var/form";
XPathConstants.VAR_PAGE_XPATH = XPathConstants.ROOT_XPATH + "/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.TRANSACTION_NO_XPATH = XPathConstants.VAR_FORM_XPATH + "/SelectedGridRow/SelectedPayment";
XPathConstants.ENFORCEMENT_XPATH = XPathConstants.ROOT_XPATH + "/Enforcement";
XPathConstants.PARTIES_XPATH = XPathConstants.ROOT_XPATH + "/Enforcement/Parties";
XPathConstants.PAYMENTS_XPATH = XPathConstants.VAR_FORM_XPATH + "/SearchResults";
XPathConstants.PAYMENT_XPATH = XPathConstants.PAYMENTS_XPATH + "/Payment[./Id=" + XPathConstants.TRANSACTION_NO_XPATH + "]";
