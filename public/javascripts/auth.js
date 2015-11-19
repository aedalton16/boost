module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '83360351150-qa0qq5rffobirllapkm7glf8vognld8s.apps.googleusercontent.com',
        'clientSecret'  : '26IYwlwufYhnLUzBXHctNjRC',
        'callbackURL'   : 'http://127.0.0.1:3000/auth/google/callback',

    }

};