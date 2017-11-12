rm lambda.zip
cd lambda
npm install
zip -r ../lambda.zip *
cd ..
aws lambda update-function-configuration --function-name AlexaSpelling_dev --description "Answer to Alexa's skill Spelling Contest" --role arn:aws:iam::398750413546:role/LambdaFullAccess --handler indexSkill.handler --timeout 10 --memory-size 1024 --environment Variables="{ALEXA_APP_ID=amzn1.ask.skill.19f0a29d-203d-4c79-93b8-c204e2729074,EVENT_TABLE=SpellingContestEventDev,SESSION_TABLE=SpellingContestDev}" --profile alexa
aws lambda update-function-code --function-name AlexaSpelling_dev --zip-file fileb://lambda.zip --profile alexa
ask deploy --target skill
ask deploy --target model
