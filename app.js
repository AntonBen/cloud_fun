const express = require('express');
const app = express();
app.enable('trust proxy');
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const getCustumers = () => {
  const query = datastore
    .createQuery('costumer')
    .order('firstName', {descending: true})
    .limit(10);

  return datastore.runQuery(query);
};

const getCustomer = (id) => {
  const numberId = parseInt(id);   
  const query = datastore
    .createQuery('Customer')
    .filter('customerID', '=', numberId);
  
  return datastore.runQuery(query);
};

app.get('/getCustumers', async (req, res, next) => {

  try {
    const [entities] = await getCustumers();
    res.json(entities)
  } catch (error) {
    next(error);
  }
});

app.get('/getCostumer', async (req, res, next) => {
  //get all costumers id
  if (req.query.id === '' || req.query.id == 'all') {
    try {
      const [entities] = await getCustumers();
      const entityKeys = entities.map(entity => entity[datastore.KEY].id);
      res.json({id: entityKeys})
    } catch (error) {
      next(error);
    }
  }
  //get costumer by id
  else {
    try {
      const [entity] = await getCustumer(req.query.id);
      res.json(entity)
    } catch (error) {
      next(error);
    }
  }
})


const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
