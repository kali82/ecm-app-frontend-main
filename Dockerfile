ARG container_registry=adpbaseimages001

FROM ${container_registry}.azurecr.io/nginx:1.25-alpine

# If you want to modify the default configuration, please use the below COPY process. 
# If you want to know more about the current configuration,
# please visit https://github.com/Schaeffler-Group/adp-docker-base/blob/main/nginx/nginx-1.24/default.conf
# We strongly recommend not to use a custom configuration, unless you are an advanced nginx user.

# COPY custom-default.conf /etc/nginx/conf.d/default.conf

# If you want to modify the default security configuration, please use the below COPY process. 
# If you want to know more about the current configuration,
# please visit https://github.com/Schaeffler-Group/adp-docker-base/blob/main/nginx/nginx-1.24/security.conf
# We strongly recommend not to use a custom configuration, unless you are an advanced nginx user.

# COPY custom-security.conf /etc/nginx/conf.d/security.conf

COPY dist/apps/ecm-app /usr/share/nginx/html
