
/*
 * Additional routes
 */

exports.notfound = function(req, res) {
    res.status(404).format( {
        html: function() {
            res.render('404');
        },

        json: function() {
            res.send({ message: 'Resource not found' });
        },
    
        text: function() {
            res.send('Resource not found\n');
        }
    });
};

exports.error = function(err, req, res, next) {
    console.error(err.stack);
    var msg;

    switch (err.type) {
        case 'database':
            msg = 'Server Unavailable';
            res.statusCode = 503;
            break;

        default:
            msg = 'Internal Server Error';
            res.statusCode = 500;
    }

    res.format( {
        html: function() {
            res.render('5xx', { msg: msg, status: res.statusCode });
        },
    
        json: function() {
            res.send({ error: msg });
        },
    
        text: function() {
            res.send(msg + '\n');
        }
    });
};