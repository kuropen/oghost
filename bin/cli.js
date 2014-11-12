#!/usr/bin/env node

require('../')(process.cwd(), function(err, json) {
  if(err) {
    console.error(err);
    process.exit(1);
  }

  console.log(JSON.stringify(json, null, 2));
});
