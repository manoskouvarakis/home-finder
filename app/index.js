const cheerio = require('cheerio');
const axios = require("axios");
const https = require('https');
const loki = require('lokijs');
const config = require('./config');
const mail    = require('./lib/mail');

var app = {};

app.init = async function() {
	if (config.mail.enable) {
		mail.init();
	}

	console.log('Execution started')
	
	setInterval(app.execute, 1000 * 60 * config.app.minutesInterval);
};

async function initialize(db, options) {
  return new Promise((resolve, reject) => db.loadDatabase(options, err => err ? reject(err) : resolve(null)))
}


app.execute = async function() {
	let now = new Date(Date.now());
	console.log('Fetching ' + now.toString());
	
	let found = 0;
	
	const db = new loki('properties.db', {
		autosave: true, 
		autosaveInterval: 4000
	});
	
	await initialize(db);	
	let propertiesCollection = db.getCollection("properties");
	if (propertiesCollection === null) {
		propertiesCollection = db.addCollection("properties");
	}		

	let propertyObjects = await app.getProperties();
	//console.log(propertyObjects);
	
	propertyObjects.forEach(function(elem) {
		let propertyId = elem.id;		
		
		let existingProperty = propertiesCollection.findOne({'id': propertyId});
		if (existingProperty == null) {
			console.log('New property found: ' + propertyId);
			console.log(elem.href);
			propertiesCollection.insert( { id : propertyId, lastChecked: elem.lastChecked, link: elem.href } );
			
			if (config.mail.enable) {
				console.log('Sending mail');
				mail.send(config.mail.recepients, 'A new property found', `<h1>New Property with <a href="${app.baseUrl}">this</a> search</h1><br/><a href="${elem.href}">${elem.id}</a>`);
			}
		}
		else {
			existingProperty.lastChecked = Date.now();
			propertiesCollection.update(existingProperty);
		}
	})
	
	console.log('Fetch finished');
};

app.getProperties = async function() {
	try {
		let propertyObjects = [];
		let returnedPages = 0;
		const pagesToCheck = 4;
		
		const agent = new https.Agent({  
		  rejectUnauthorized: false
		});

		for (k=0; k < pagesToCheck; k++) {
			let url = `${config.app.searchUrl}&page=${k+1}`;
			const response = await axios.get(url , { httpsAgent: agent });
			const data = response.data;
			
			returnedPages++;
			let $ = cheerio.load(data);
			
			let properties = $('.column_search_results .column_468 .lazy');
			for(i = 0; i < properties.length; i++) {
				propertyObjects.push({
					id: properties[i].attribs['data-id'],
					href: `http://www.xe.gr${properties[i].children[1].attribs.href}`,
					lastChecked: Date.now()
				});
			}
			
			if (returnedPages === pagesToCheck) {
				return propertyObjects;
			}
		}
	} catch (error) {
		console.log(error);
	}
};

app.init().catch(err => {
    console.error(err.message); 
});

module.exports = app;