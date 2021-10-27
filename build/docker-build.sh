#远程镜像
# 生成镜像
TARGET_IMAGE=""

case $1 in
    "test")
        TARGET_IMAGE="ad-master-registry-registry.cn-shanghai.cr.aliyuncs.com/566/game-management-frontend:test";
        ;;
    "production")
        TARGET_IMAGE="ad-master-registry-registry.cn-shanghai.cr.aliyuncs.com/566/game-management-frontend:prod";
        ;;
    # *)
    #     TARGET_IMAGE="registry.cn-shanghai.aliyuncs.com/scenead/commercialize-manager-front:dev";
    #     ;;
esac

echo '开始构建 Docker'
echo "远程镜像地址:"$TARGET_IMAGE
echo 'docker build开始'
docker build -f ./build/Dockerfile \
--build-arg JENKINS_ENV=$1 \
--build-arg CI_NGINX_CONFIG_NAME='nginx.conf' \
--build-arg BUILD_SUB_DIR='dist' \
-t $TARGET_IMAGE . || exit 1
echo 'docker build成功'

echo 'docker push开始'
docker push $TARGET_IMAGE || exit 1
echo 'docker push成功'

echo '删除打包镜像开始'
docker rmi $TARGET_IMAGE || exit 1
echo '删除打包镜像成功'

# 运行 K8S
echo 'K8S WebHook:'
case $1 in
    "test")
        # 国内镜像 curl
        curl "https://cs.console.aliyun.com/hook/trigger?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVzdGVySWQiOiJjOTk2MmNkZDNiNjc0NGQ0N2EwNTE0ZWY4YTIyNjEyODMiLCJpZCI6IjE1ODcyNCJ9.TJW4ZAobyljjfCrUe2XuZJ7Z_P64GpaaT_kjiy_pDkJTIqNFU3BassUW6XDzXd5v-wYzT3qoYWdpfA0tftPjTcQuPidcg2JhcGWFBJJSzL1C6L7h4y2HGVqzXvYzT2rkXCTQWiXDHjEaGXzd42dHHCt3uxneNZ3f5pLQsmrnF7Y"
    ;;
    "production")
        # 海外镜像自动运行 K8S 触发
        echo "海外镜像自动运行 K8S 触发器"
    ;;
    # *)
    #     curl "https://cs.console.aliyun.com/hook/trigger?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVzdGVySWQiOiJjOGMxMDcwNWYxN2EwNGMwNjhiNTRjMWFkMDAzMGY1ZTYiLCJpZCI6IjE1MDY0NCJ9.Z5cNV8bzeKEJBMrj_ro85oPnen6wiUbngOPWGIkWJYoNsEkY1JrdWeXYqO5IE5cvBeVHOggHo2C0or3nSvaGQIurN_B7ohco_Ziha8PlPTe-a5VMQPjUgSPCoK67BN8UeMXHr8ItkKY9UdAm6UOe9TIXbptozNUtOrGKPHCvETs"
    # ;;
esac