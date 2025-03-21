import { Sequelize } from "sequelize";
import { mybdSql }   from '../../config/config.js'

export const sequelize = new Sequelize(
    mybdSql.database,
    mybdSql.user,
    mybdSql.password,
    {
        host: mybdSql.host,
        dialect: mybdSql.dialect,
        dialectOptions: {
            multipleStatements: true // 🚀 Habilita múltiples sentencias
          },
        define: {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            underscored: true,
            id: false,
        },
    }
    
)
