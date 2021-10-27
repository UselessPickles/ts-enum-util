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
# case $1 in
#     "test")
#         # 国内镜像 curl
#         curl "https://cs.console.aliyun.com/hook/trigger?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVzdGVySWQiOiJjNjk1MjE0YzcxYzVlNDJkZTlhODc2MzhkMzQ4MjY3MzUiLCJpZCI6IjE0NjkxMiJ9.i59pnxoxxV-nu2tgFKh-t8dXV9kMCnzj7O3_kpmAjsdin8A8-ezliIxQ_kCwvRfHGPrHflSMSyt0h2aIxRh_z4Rfvq3cTPnaGtbalEAgtBY5WrnC2Fg41iJo5GVbngwlayBWvoCThAGjfb6eB-WPDQ1P_JZ3EojMGV3oVbieBJo"
#     ;;
#     "production")
#         # 海外镜像自动运行 K8S 触发
#         echo "海外镜像自动运行 K8S 触发器"
#     ;;
#     *)
#         curl "https://cs.console.aliyun.com/hook/trigger?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVzdGVySWQiOiJjOGMxMDcwNWYxN2EwNGMwNjhiNTRjMWFkMDAzMGY1ZTYiLCJpZCI6IjE1MDY0NCJ9.Z5cNV8bzeKEJBMrj_ro85oPnen6wiUbngOPWGIkWJYoNsEkY1JrdWeXYqO5IE5cvBeVHOggHo2C0or3nSvaGQIurN_B7ohco_Ziha8PlPTe-a5VMQPjUgSPCoK67BN8UeMXHr8ItkKY9UdAm6UOe9TIXbptozNUtOrGKPHCvETs"
#     ;;
# esac