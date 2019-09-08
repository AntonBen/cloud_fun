const express = require('express');
const app = express();
app.enable('trust proxy');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {Datastore} = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore();


/**
 * Retrieve the latest 10 visit records from the database.
 */
const getCostumers = () => {
  const query = datastore
    .createQuery('costumer')
    .order('firstName', {descending: true})
    .limit(10);

  return datastore.runQuery(query);
};

app.get('/getCostumers', async (req, res, next) => {

  if(req.query.id === "")
    try {
      const [entities] = await getCostumers();
      const entityKeys = entities.map(entity => entity[datastore.KEY].id);
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .json({id:entityKeys})
        .end();
    } catch (error) {
      next(error);
    }

  else
    try {
      const [entities] = await getCostumers();
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .json(entities)
        .end();
    } catch (error) {
      next(error);
    }
});


const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});