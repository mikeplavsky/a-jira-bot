if [ -z $1 ]; then
    echo "version is required"
    exit 1
fi

VERSION=$1
NAME="a-jira-bot"

docker build -t $NAME .
docker tag $NAME mikeplavsky/$NAME:${VERSION}
docker push mikeplavsky/$NAME:${VERSION}
