import jwt from 'jsonwebtoken';
import User from './User';
import util from './utils';


/**
 * Create a token from a users Id
 * 
 * @param {request} id - The users id which this token will be vaoid for
 * @returns {Promise}
 */
const SECRET = process.env.SECRET || 'topdog';

async function issueAccessToken(id) {
  const isAdmin = await User.is_admin(id)
  const payload = {
    id: id,
    is_admin: isAdmin,
    email: User.exists(id)
  }

  const token = jwt.sign(payload, SECRET);
  return Promise.resolve(token);
}

/**
 * Authenticate a token that was generated by id
 * 
 * @param {response} res - Request object
 *  @param {response} resp - Request object
 * @param {request} callback - Callback function which the verified token will be passed to
 * @returns {void}
 */
function verifyAccessToken(req, resp, token, callback) {
  jwt.verify(token, SECRET, function (err, userToken) {
    if (err) {
      resp.statusCode = 403;
      resp.json(util.response("error", "Access denied", 0))
    } else if (callback) {
      callback(userToken);
    }
  });
}

function authToken(req, resp, next) {
  function callback(token) {
    token ? resp.statusCode = 200 : resp.statusCode = 501;
    resp.json({
      status: 'ok',
      message: 'valid token'
    })
  }
  console.log("authorization", req.headers['authorization'])
  const token = req.headers['authorization'] || "error";
  verifyAccessToken(req, resp, token, callback)
}

function cors(req, res, next) {
  //preflight sniffing
  if (req.method.search(/^options$/gi) != -1) {
    res.setHeader("Access-Control-Allow-Origin", req.headers['origin'] || "*");
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,,PUT');
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Headers", 'authorization')
    res.statusCode = 200;
    res.end();
  } else {
    res.setHeader("Access-Control-Allow-Origin", req.headers['origin'] || "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  }
}

export {
  verifyAccessToken,
  issueAccessToken,
  cors,
  authToken
}