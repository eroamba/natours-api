const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('hello');
});

app.use(morgan('dev'));
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).send({
    status: 'success',
    data: { tours }
  });
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const findedTour = tours.find(tour => tour.id === id);
  Object.assign(findedTour, req.body);

  if (findedTour) {
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      err => {
        res.status(200).send({
          status: 'success',
          data: { tour: findedTour }
        });
      }
    );
  } else {
    res.status(403).send({
      status: 'error',
      data: { error: 'Invalid ID' }
    });
  }
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const toursIndex = tours.findIndex(tour => tour.id === id);

  if (toursIndex >= 0) {
    tours.splice(toursIndex, 1);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      err => {
        res.status(204).send({
          status: 'success',
          data: { tour: null }
        });
      }
    );
  } else {
    res.status(403).send({
      status: 'error',
      data: { error: 'Invalid ID' }
    });
  }
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const findedTour = tours.find(tour => tour.id === id);

  if (findedTour) {
    res.status(200).send({
      status: 'success',
      data: { tour: findedTour }
    });
  } else {
    res.status(403).send({
      status: 'error',
      data: { error: 'Invalid ID' }
    });
  }
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const getAllUsers = (req, res) => {
  res.status(500).send({
    status: 'error',
    message: 'this route is not implemented'
  });
};
const createUser = (req, res) => {
  res.status(500).send({
    status: 'error',
    message: 'this route is not implemented'
  });
};
const updateUser = (req, res) => {
  res.status(500).send({
    status: 'error',
    message: 'this route is not implemented'
  });
};
const deleteUser = (req, res) => {
  res.status(500).send({
    status: 'error',
    message: 'this route is not implemented'
  });
};
const getUser = (req, res) => {
  res.status(500).send({
    status: 'error',
    message: 'this route is not implemented'
  });
};

const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour);

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
