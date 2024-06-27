import fs from "fs";
import rsaPemToJwk from "rsa-pem-to-jwk";

let pem=fs.readFileSync('certs/private.pem');

let jwk=rsaPemToJwk(pem,{use:"sig"},'public');

console.log(jwk);