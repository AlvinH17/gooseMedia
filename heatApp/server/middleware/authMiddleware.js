// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

const authMiddleware = async (req, res, next) => {
  const Authorization = req.headers.authorization || req.headers.Authorization;

  if (Authorization && Authorization.startsWith("Bearer ")) {
    const token = Authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
      if (err) {
        return next(new HttpError("Unauthorized. Invalid token", 403)); // forbidden error
      }
      req.user = info;
      next();
    });
  } else {
    return next(new HttpError("Unauthorized. No token provided", 401)); // unauthorized error
  }
};

const validateFirebaseIdToken = async (req, res, next) => {
  console.log("Check if request is authorized with Firebase ID token");

  // if (
  //   (!req.headers.authorization ||
  //     !req.headers.authorization.startsWith("Bearer ")) &&
  //   !(req.cookies && req.cookies.__session)
  // ) {
  //   console.error(
  //     "No Firebase ID token was passed as a Bearer token in the Authorization header.",
  //     "Make sure you authorize your request by providing the following HTTP header:",
  //     "Authorization: Bearer <Firebase ID Token>",
  //     'or by passing a "__session" cookie.'
  //   );
  //   res.status(403).send("Unauthorized");
  //   return;
  // }

  let idToken;

  // check authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  }
  // fallback to cookie
  // else if (req.cookies) {
  //   console.log('Found "__session" cookie');
  //   // Read the ID Token from cookie.
  //   idToken = req.cookies.__session;
  // }
  // no token found
  else {
    console.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    return res.status(403).json({
      error: "Unauthorized",
      message: "No Firebase ID token provided",
    });
  }

  // Validate that token exists and is not empty
  if (!idToken || idToken.trim() === "") {
    // === checks both equality and TYPE withouth conversion
    console.error("Firebase ID token is empty");
    return res.status(403).json({
      error: "Unauthorized",
      message: "Empty Firebase ID token",
    });
  }

  try {
    // Verify the Firebase ID token
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    // Decode the Firebase ID token
    console.log("ID Token correctly decoded", decodedIdToken);

    // Add decoded token to request object
    req.user = decodedIdToken;

    // Continue to next middleware
    next();
  } catch (error) {
    console.error("Error while verifying Firebase ID token:", error);

    // Handle specific Firebase Auth errors
    let errorMessage = "Invalid Firebase ID token";

    if (error.code === "auth/id-token-expired") {
      errorMessage = "Firebase ID token has expired";
    } else if (error.code === "auth/id-token-revoked") {
      errorMessage = "Firebase ID token has been revoked";
    } else if (error.code === "auth/invalid-id-token") {
      errorMessage = "Invalid Firebase ID token format";
    }
    return res.status(403).json({
      error: "Unauthorized",
      message: errorMessage,
    });
  }
};

module.exports = authMiddleware;
