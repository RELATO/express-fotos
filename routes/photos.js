var photos = [];

photos.push({
  name: 'Golden Gate Bridge',
  path: 'golden_gate_bridge.jpg'
});

photos.push({
  name: 'Dreamforce',
  path: 'dreamforce.jpg'
});

photos.push({
  name: 'One Lobby',
  path: 'one-lobby.jpg'
});

photos.push({
  name: 'Fredericton City Hall',
  path: 'fredericton_city_hall.jpg'
});

exports.list = function(req, res) {
  res.render('photos', {
    title: 'Photos',
    photos: photos
  });
};
