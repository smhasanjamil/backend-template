// import jwt, { Secret } from "jsonwebtoken";

// export const generateToken = (
//   payload: { id: string; name: string; email: string; role: string },
//   secret: Secret,
//   expiresIn: number
// ) => {
//   const token = jwt.sign(payload, secret, {
//     algorithm: "HS256",
//     expiresIn: expiresIn,
//   });
//   return token;
// };

import jwt, { Secret } from "jsonwebtoken";
import type { StringValue } from "ms"; // Optional but recommended

export const generateToken = (
  payload: { id: string; name: string; email: string; role: string },
  secret: Secret,
  expiresIn: StringValue // Like "1h", "2d", "30m"
) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expiresIn,
  });
  return token;
};
