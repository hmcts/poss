# Sups Skeleton .bash_profile
#  Author: David Morris
# Purpose: Prime project scripts with base variables
# $Id: cm-bash_profile,v 1.3 2006/04/07 12:10:36 cman Exp $
# Release Series: CMPL036

############
# Get the aliases and functions
############
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi

############
# Set three basic variables:
############
declare -rx BASE_DIR=/app
declare -rx APP_NAME=caseman
declare -rx   APP_ID=cm
declare -rx USER_ID=caseman

export PATH=$PATH:${HOME}/bin

############
# Read in common variables for our application
############
if [ -f ~/.${APP_ID}-common-variables ]; then
      . ~/.${APP_ID}-common-variables 
else
    echo "No such file:"
    echo ~/.${APP_ID}-common-variables 
fi

############
# Read In Common Functions For Our Application
############
if [ -f ${BASE_DIR}/${APP_NAME}/bin/${APP_ID}-common-functions ]; then
      . ${BASE_DIR}/${APP_NAME}/bin/${APP_ID}-common-functions
else
    echo "No such file:"
    echo ${BASE_DIR}/${APP_NAME}/bin/${APP_ID}-common-functions
fi

############
# Add the application bin directory to the path:
############
if [ -d ${BASE_DIR}/${APP_NAME}/bin ]; then
    declare -x PATH=${PATH}:${BASE_DIR}/${APP_NAME}/bin
else
    echo "No such directory:"
    echo ${BASE_DIR}/${APP_NAME}/bin
fi
