function generateRoom(length) {
    var haystack = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var room = '';
 
    for(var i = 0; i < length; i++) {
        room += haystack.charAt(Math.floor(Math.random() * 62));
    }
 
    return room;
};