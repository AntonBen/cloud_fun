const express = require('express');
const app = express();
app.enable('trust proxy');

const {Datastore} = require('@google-cloud/datastore');

const datastore = new Datastore();

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
