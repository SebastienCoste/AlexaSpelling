
const eventTableName = "SpellingContestEvent";

const eventTableSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'userId',
            AttributeType: 'S'
        },
        {
            AttributeName: 'timestamp',
            AttributeType: 'N'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'userId',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'timestamp',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

module.exports = (function(){

    return {
      getEventTableName: () => {
          return eventTableName;
      },
      getEventTableSchema: () => {
          return eventTableSchema;
      }

    };
}) ();
