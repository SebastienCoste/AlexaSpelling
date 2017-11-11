'use strict';

const eventTableName = process.env.EVENT_TABLE;

const pkName = "userId";
const pkType = 'S';

const skName = "timestamp";
const skType = 'N';

const eventTableSchema = {
  AttributeDefinitions: [{
      AttributeName: pkName,
      AttributeType: pkType
    },
    {
      AttributeName: skName,
      AttributeType: skType
    }
  ],
  KeySchema: [{
      AttributeName: pkName,
      KeyType: 'HASH'
    },
    {
      AttributeName: skName,
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

module.exports = (function() {

  return {
    getEventTableName: () => {
      return eventTableName;
    },
    getEventTableSchema: () => {
      return eventTableSchema;
    },
    getPkName: () => {
      return pkName;
    }

  };
})();
