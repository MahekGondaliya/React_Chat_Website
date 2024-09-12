import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("Authentication token is missing.");
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return res.status(403).send("Invalid or expired token.");
    }
    
    req.userId = payload.userId; // Attach userId from the token to the request object
    next();
  });
};
