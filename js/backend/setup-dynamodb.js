#!/usr/bin/env node

/**
 * 🏗️ SCRIPT DE CREACIÓN DE TABLAS DYNAMODB
 * Crea las tablas necesarias para AI Study Genius
 * Desarrollado por: Vicentegg4212
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '../../.env' });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// ==========================================
// 📋 DEFINICIONES DE TABLAS
// ==========================================

const TABLES_CONFIG = [
    {
        TableName: "ai-study-genius-users",
        KeySchema: [
            { AttributeName: "userId", KeyType: "HASH" } // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "userId", AttributeType: "S" },
            { AttributeName: "email", AttributeType: "S" }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: "EmailIndex",
                KeySchema: [
                    { AttributeName: "email", KeyType: "HASH" }
                ],
                Projection: { ProjectionType: "ALL" },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    },
    {
        TableName: "ai-study-genius-conversations",
        KeySchema: [
            { AttributeName: "conversationId", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "conversationId", AttributeType: "S" },
            { AttributeName: "userId", AttributeType: "S" },
            { AttributeName: "lastMessageAt", AttributeType: "S" }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: "UserIdIndex",
                KeySchema: [
                    { AttributeName: "userId", KeyType: "HASH" },
                    { AttributeName: "lastMessageAt", KeyType: "RANGE" }
                ],
                Projection: { ProjectionType: "ALL" },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    },
    {
        TableName: "ai-study-genius-messages",
        KeySchema: [
            { AttributeName: "messageId", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "messageId", AttributeType: "S" },
            { AttributeName: "conversationId", AttributeType: "S" },
            { AttributeName: "timestamp", AttributeType: "S" }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: "ConversationIdIndex",
                KeySchema: [
                    { AttributeName: "conversationId", KeyType: "HASH" },
                    { AttributeName: "timestamp", KeyType: "RANGE" }
                ],
                Projection: { ProjectionType: "ALL" },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    }
];

// ==========================================
// 🔧 FUNCIONES AUXILIARES
// ==========================================

async function listExistingTables() {
    try {
        const command = new ListTablesCommand({});
        const response = await client.send(command);
        return response.TableNames || [];
    } catch (error) {
        console.error('❌ Error listando tablas:', error.message);
        return [];
    }
}

async function createTable(tableConfig) {
    try {
        const command = new CreateTableCommand(tableConfig);
        const response = await client.send(command);
        console.log(`✅ Tabla creada: ${tableConfig.TableName}`);
        return response;
    } catch (error) {
        if (error.name === 'ResourceInUseException') {
            console.log(`⚠️  Tabla ya existe: ${tableConfig.TableName}`);
        } else {
            console.error(`❌ Error creando tabla ${tableConfig.TableName}:`, error.message);
            throw error;
        }
    }
}

// ==========================================
// 🚀 FUNCIÓN PRINCIPAL
// ==========================================

async function setupDynamoDB() {
    console.log('🏗️  INICIANDO CREACIÓN DE TABLAS DYNAMODB');
    console.log('==========================================\n');

    // Verificar credenciales
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.error('❌ ERROR: Credenciales de AWS no configuradas');
        console.log('\n📝 Por favor configura las siguientes variables en .env:');
        console.log('   AWS_ACCESS_KEY_ID=tu_access_key');
        console.log('   AWS_SECRET_ACCESS_KEY=tu_secret_key');
        console.log('   AWS_REGION=us-east-1\n');
        process.exit(1);
    }

    console.log(`📍 Región: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log(`🔑 Access Key: ${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...\n`);

    // Listar tablas existentes
    console.log('📋 Verificando tablas existentes...');
    const existingTables = await listExistingTables();
    console.log(`   Tablas encontradas: ${existingTables.length}\n`);

    // Crear cada tabla
    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (const tableConfig of TABLES_CONFIG) {
        console.log(`🔨 Procesando: ${tableConfig.TableName}`);
        
        try {
            if (existingTables.includes(tableConfig.TableName)) {
                console.log(`   ⏭️  Saltando (ya existe)\n`);
                skipped++;
            } else {
                await createTable(tableConfig);
                created++;
                console.log(`   ⏳ Esperando 10 segundos para que la tabla esté activa...\n`);
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        } catch (error) {
            failed++;
            console.log('');
        }
    }

    // Resumen
    console.log('\n==========================================');
    console.log('📊 RESUMEN DE CREACIÓN DE TABLAS');
    console.log('==========================================');
    console.log(`✅ Creadas: ${created}`);
    console.log(`⏭️  Saltadas: ${skipped}`);
    console.log(`❌ Fallidas: ${failed}`);
    console.log(`📦 Total: ${TABLES_CONFIG.length}\n`);

    if (created > 0) {
        console.log('⏳ NOTA: Las tablas pueden tardar unos minutos en estar completamente activas.');
    }

    console.log('\n🎉 Proceso completado!\n');
}

// Ejecutar
setupDynamoDB().catch(error => {
    console.error('\n💥 ERROR FATAL:', error);
    process.exit(1);
});
