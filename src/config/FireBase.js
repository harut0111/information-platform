const firebase = require('firebase/app');
require('firebase/firestore');
 
firebase.initializeApp({
    apiKey: '***************',
    authDomain: '***************',
    projectId: '***************'
});

export default firebase;