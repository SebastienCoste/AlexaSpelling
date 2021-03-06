rm lambda.zip
cd lambda
npm install
zip -r ../lambda.zip *
cd ..
aws lambda update-function-configuration --function-name AlexaSPellingEventProcess --description "Process events raised by alexa's skill Spelling Contest" --role arn:aws:iam::398750413546:role/LambdaFullAccess --handler indexEventProcess.handler --timeout 10 --memory-size 512 --environment Variables="{ALEXA_APP_ID=amzn1.ask.skill.11532793-2767-420b-ae38-e2ae5e5a397a}" --profile alexa
aws lambda update-function-code --function-name AlexaSPellingEventProcess --zip-file fileb://lambda.zip --profile alexa
