import dotenv from 'dotenv'
dotenv.config()

const mybdSql = {
    host:    process.env.DB_SERVER_HOST,
    user:    process.env.DB_SERVER_USER,
    password:process.env.DB_SERVER_PASS,
    database:process.env.DB_SERVER_DATA,
    port:    process.env.DB_SERVER_PORT,
    dialect: process.env.DB_DIALECT_SQL,
}

const jwtConfig = {
    jwtSecret: process.env.JWT_SECRET
}

const config = {
    nodeport:process.env.SERVER_PORT,
    env:     process.env.NODE_ENV
}

export { mybdSql, jwtConfig, config }

