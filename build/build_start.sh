case $1 in
    "test")
        npm run build:test;
        ;;
    "production")
        npm run build;
        ;;
    # *)
    #     npm run build:dev;
    #     ;;
esac