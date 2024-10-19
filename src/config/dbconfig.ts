
import { config, ConnectionPool } from 'mssql';

let poolInstance: ConnectionPool;

export async function getConnection(): Promise<ConnectionPool> {
    if (!poolInstance) {
        const dbConfig = {
            user: process.env.DB_USER_PROD,
            password: process.env.DB_PASS_PROD,
            server: process.env.DB_SERVER_PROD,
            database: process.env.DB_DATABASE_PROD,
            options: {
                trustedConnection: false,
                enableArithAbort: true,
                encrypt: false
            },
        };

        // console.log('Configuración de la conexión:', dbConfig);

        
        poolInstance = new ConnectionPool(dbConfig);
        await poolInstance.connect();
        console.log('Conexión exitosa');
    }

    return poolInstance;
}