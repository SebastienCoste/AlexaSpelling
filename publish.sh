#!/usr/bin/env bash
rm lambda.zip
cd lambda
npm install
zip -r ../lambda.zip *
cd ..
aws lambda update-function-code --function-name AlexaSpelling --zip-file fileb://lambda.zip --profile alexa
