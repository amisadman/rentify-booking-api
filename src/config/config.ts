import dotenv from "dotenv";
dotenv.config();

export const config = {

    connection_string: process.env.CONNECTION_STRING,
    port: process.env.PORT,
    salt:process.env.SALT,
    jwt_secret: process.env.JWT_SECRET
}