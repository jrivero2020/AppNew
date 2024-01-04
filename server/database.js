import { Sequelize } from "sequelize";
import { mybdSql }   from '../../config/config.js'

export const sequelize = new Sequelize(
    mybdSql.database,
    mybdSql.user,
    mybdSql.password,
    {
        host: mybdSql.host,
        dialect: mybdSql.dialect
    }
)
