#!/usr/bin/env bash
u=ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}:${FTP_PORT}/mycooltv_package/accountv/
wd=$(pwd)

for env in $(ls ${wd}/build)
do
    [[ ! -d ${wd}/build/${env} ]] && continue

    for f in $(ls ${wd}/build/${env})
    do
        curl ${u}/${env}/ -T ${wd}/build/${env}/${f}

        echo ${u}${env}/${f}
    done
done