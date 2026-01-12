import { APP_KEY, APP_URL } from '@/public/settings/there_is_nothing_holding_me_back/config';
var fs = require('fs')
import path from 'path';

export default function handler(req, res) {



  try {
    fetch(`${APP_URL}api/settings?key=${APP_KEY}`).then(res => res.json()).then((theme) => { 
      let data = theme || {};
      const json = JSON.stringify(data);
      const filePath = path.join(process.cwd(), 'public', 'settings/data.json');

      fs.writeFile(filePath, json, 'utf8', (err) => {
        if (err) throw err;
        console.log('Data written to file');
      });

      return res.status(200).json({ success: true, message: 'Data written to file! 😁' }); 
    }).catch(err => {
      res.status(500).json({ success: false, message: err.message })
    });
  }
  catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
