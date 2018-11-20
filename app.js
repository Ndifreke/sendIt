import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import db from './server/module/Database';


import {
  cancelParcel,
  createParcel,
  getOneParcel,
  getUserParcels,
  getAllParcels,
}
  from './server/controller/parcel';

import {
  signup,
  login,
  changeDestination,
  createParcelOrder,
  changeSettings,
  changeStatus,
  changeLocation,
} from './server/controller/users';


const app = express();

app.set('views', path.join(__dirname, 'ui/pages'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'ui')));
app.use(bodyParser());

app.post('/api/v1/parcels', createParcel);
app.get('/api/v1/parcels', getAllParcels);
app.get('/api/v1/parcels/:id', getOneParcel);
app.put('/api/v1/parcels/:id', cancelParcel);
app.use('/api/v1/users/:id/parcels', getUserParcels);


app.post('/api/v1/auth/signup', signup);
app.post('/api/v1/auth/login', login);
app.put('/api/v1/settings', changeSettings);
app.put('/api/v1/parcels/:id/status', changeStatus);
app.put('/api/v1/parcels/:id/destination', changeDestination);
app.put('/api/v1/parcels/:id/presentLocation', changeLocation);

app.use((err, req, res) => {
  const message = err.message;
  res.end(JSON.stringify({
    status: 'error',
  }));
});

app.use((req, res) => {
  res.statusCode = 500;
  const msg = {
    status: 'error',
    message: 'we dont quiit understand your request at this time. Project is WIP',
  };
  res.end(JSON.stringify(msg), null, '\t');
});

app.get('/', (req, res) => {
  console.log(req.method);
  res.render('index.ejs');
});

app.listen(process.env.PORT);
