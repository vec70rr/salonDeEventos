const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const app = express();
const PORT = 3000;

app.use(bodyParser.text({ type: 'application/xml' }));
app.use(bodyParser.json()); // Necesario para parsear JSON en las solicitudes

app.use(express.static('public'));

// Ruta para guardar el evento
app.post('/save-event', (req, res) => {
  const xmlData = req.body;
  const fileName = `event_${Date.now()}.xml`; // Nombre único para cada archivo
  const filePath = path.join(__dirname, 'public', 'xml', fileName);

  fs.writeFile(filePath, xmlData, (err) => {
    if (err) {
      console.error('Error saving XML file:', err);
      return res.status(500).send('Error saving XML file.');
    }
    res.status(200).send('XML file saved successfully.');
  });
});

// Ruta para obtener los eventos
app.get('/events', (req, res) => {
  const xmlDir = path.join(__dirname, 'public', 'xml');

  fs.readdir(xmlDir, (err, files) => {
    if (err) {
      console.error('Error reading XML directory:', err);
      return res.status(500).send('Error reading XML directory.');
    }

    const xmlFiles = files.filter(file => file.endsWith('.xml'));
    const events = [];
    let completed = 0;

    if (xmlFiles.length === 0) {
      return res.json(events);
    }

    xmlFiles.forEach((file, index) => {
      const filePath = path.join(xmlDir, file);
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error reading XML file:', err);
        } else {
          xml2js.parseString(data, (err, result) => {
            if (err) {
              console.error('Error parsing XML file:', err);
            } else {
              // Añadir un identificador único al evento
              result.event.eventId = path.basename(filePath, '.xml');
              events.push(result.event);
            }
          });
        }

        completed++;
        if (completed === xmlFiles.length) {
          res.json(events);
        }
      });
    });
  });
});

// Ruta para actualizar un evento
app.put('/update-event/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const { eventType, eventDate, eventTime } = req.body;

  const xmlFile = path.join(__dirname, 'public', 'xml', `${eventId}.xml`);
  fs.readFile(xmlFile, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return res.status(500).send('Error reading XML file.');
    }

    xml2js.parseString(data, (err, xmlObj) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return res.status(500).send('Error parsing XML.');
      }

      xmlObj.event.eventType = [eventType];
      xmlObj.event.eventDate = [eventDate];
      xmlObj.event.eventTime = [eventTime];

      const builder = new xml2js.Builder();
      const updatedXml = builder.buildObject(xmlObj);

      fs.writeFile(xmlFile, updatedXml, 'utf-8', (err) => {
        if (err) {
          console.error('Error writing XML file:', err);
          return res.status(500).send('Error writing XML file.');
        }
        res.status(200).send('Evento actualizado correctamente.');
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
