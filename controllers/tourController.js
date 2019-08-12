const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).send({
    status: 'success',
    data: { tours }
  });
};

exports.updateTour = (req, res) => {
  const id = Number(req.params.id);
  const findedTour = tours.find(tour => tour.id === id);
  Object.assign(findedTour, req.body);

  if (findedTour) {
    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
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

exports.deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const toursIndex = tours.findIndex(tour => tour.id === id);

  if (toursIndex >= 0) {
    tours.splice(toursIndex, 1);
    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
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

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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