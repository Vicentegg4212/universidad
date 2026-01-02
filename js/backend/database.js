/**
 * 🗄️ MÓDULO DE BASE DE DATOS - AMAZON DYNAMODB
 * Gestiona conexión y operaciones con DynamoDB
 * Desarrollado por: Vicentegg4212
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
    DynamoDBDocumentClient, 
    PutCommand, 
    GetCommand, 
    QueryCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand 
} from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('🔧 Configurando DynamoDB...');
console.log(`   Region: ${process.env.AWS_REGION}`);
console.log(`   Access Key: ${process.env.AWS_ACCESS_KEY_ID?.substring(0, 10)}...`);

// ==========================================
// 🔧 CONFIGURACIÓN DEL CLIENTE DYNAMODB
// ==========================================

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const docClient = DynamoDBDocumentClient.from(client);

// Nombres de las tablas
const TABLES = {
    USERS: process.env.DYNAMODB_USERS_TABLE || "ai-study-genius-users",
    CONVERSATIONS: process.env.DYNAMODB_CONVERSATIONS_TABLE || "ai-study-genius-conversations",
    MESSAGES: process.env.DYNAMODB_MESSAGES_TABLE || "ai-study-genius-messages"
};

console.log('🗄️ DynamoDB Cliente inicializado');
console.log(`📊 Tablas configuradas: ${Object.values(TABLES).join(', ')}`);

// ==========================================
// 👤 OPERACIONES DE USUARIOS
// ==========================================

/**
 * Crear o actualizar usuario
 */
export async function saveUser(userData) {
    try {
        const params = {
            TableName: TABLES.USERS,
            Item: {
                userId: userData.email || userData.userId,
                email: userData.email,
                name: userData.name || 'Usuario',
                createdAt: userData.createdAt || new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                totalConversations: userData.totalConversations || 0,
                plan: userData.plan || 'free',
                ...userData
            }
        };

        await docClient.send(new PutCommand(params));
        console.log(`✅ Usuario guardado: ${userData.email}`);
        return { success: true, user: params.Item };
    } catch (error) {
        console.error('❌ Error guardando usuario:', error);
        throw error;
    }
}

/**
 * Obtener usuario por email
 */
export async function getUser(email) {
    try {
        const params = {
            TableName: TABLES.USERS,
            Key: { userId: email }
        };

        const result = await docClient.send(new GetCommand(params));
        
        if (result.Item) {
            console.log(`✅ Usuario encontrado: ${email}`);
            return result.Item;
        } else {
            console.log(`⚠️ Usuario no encontrado: ${email}`);
            return null;
        }
    } catch (error) {
        console.error('❌ Error obteniendo usuario:', error);
        throw error;
    }
}

/**
 * Actualizar usuario
 */
export async function updateUser(email, updates) {
    try {
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        Object.keys(updates).forEach((key, index) => {
            const placeholder = `#attr${index}`;
            const valuePlaceholder = `:val${index}`;
            updateExpression.push(`${placeholder} = ${valuePlaceholder}`);
            expressionAttributeNames[placeholder] = key;
            expressionAttributeValues[valuePlaceholder] = updates[key];
        });

        const params = {
            TableName: TABLES.USERS,
            Key: { userId: email },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        const result = await docClient.send(new UpdateCommand(params));
        console.log(`✅ Usuario actualizado: ${email}`);
        return result.Attributes;
    } catch (error) {
        console.error('❌ Error actualizando usuario:', error);
        throw error;
    }
}

// ==========================================
// 💬 OPERACIONES DE CONVERSACIONES
// ==========================================

/**
 * Guardar conversación
 */
export async function saveConversation(conversationData) {
    try {
        const params = {
            TableName: TABLES.CONVERSATIONS,
            Item: {
                conversationId: conversationData.id || `conv_${Date.now()}`,
                userId: conversationData.userId,
                title: conversationData.title || 'Nueva conversación',
                createdAt: conversationData.createdAt || new Date().toISOString(),
                lastMessageAt: new Date().toISOString(),
                messageCount: conversationData.messageCount || 0,
                ...conversationData
            }
        };

        await docClient.send(new PutCommand(params));
        console.log(`✅ Conversación guardada: ${params.Item.conversationId}`);
        return { success: true, conversation: params.Item };
    } catch (error) {
        console.error('❌ Error guardando conversación:', error);
        throw error;
    }
}

/**
 * Obtener conversaciones de un usuario
 */
export async function getUserConversations(userId, limit = 50) {
    try {
        const params = {
            TableName: TABLES.CONVERSATIONS,
            IndexName: 'UserIdIndex', // Requiere crear un GSI
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false, // Orden descendente
            Limit: limit
        };

        const result = await docClient.send(new QueryCommand(params));
        console.log(`✅ ${result.Items.length} conversaciones encontradas para ${userId}`);
        return result.Items || [];
    } catch (error) {
        console.error('❌ Error obteniendo conversaciones:', error);
        // Fallback a Scan si no existe el índice
        try {
            const scanParams = {
                TableName: TABLES.CONVERSATIONS,
                FilterExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                },
                Limit: limit
            };
            const scanResult = await docClient.send(new ScanCommand(scanParams));
            return scanResult.Items || [];
        } catch (scanError) {
            console.error('❌ Error en scan de conversaciones:', scanError);
            return [];
        }
    }
}

/**
 * Eliminar conversación
 */
export async function deleteConversation(conversationId) {
    try {
        const params = {
            TableName: TABLES.CONVERSATIONS,
            Key: { conversationId }
        };

        await docClient.send(new DeleteCommand(params));
        console.log(`✅ Conversación eliminada: ${conversationId}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error eliminando conversación:', error);
        throw error;
    }
}

// ==========================================
// 💭 OPERACIONES DE MENSAJES
// ==========================================

/**
 * Guardar mensaje
 */
export async function saveMessage(messageData) {
    try {
        const params = {
            TableName: TABLES.MESSAGES,
            Item: {
                messageId: messageData.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                conversationId: messageData.conversationId,
                userId: messageData.userId,
                role: messageData.role, // 'user' o 'assistant'
                content: messageData.content || messageData.text,
                timestamp: messageData.timestamp || new Date().toISOString(),
                metadata: messageData.metadata || {},
                ...messageData
            }
        };

        await docClient.send(new PutCommand(params));
        console.log(`✅ Mensaje guardado: ${params.Item.messageId}`);
        return { success: true, message: params.Item };
    } catch (error) {
        console.error('❌ Error guardando mensaje:', error);
        throw error;
    }
}

/**
 * Obtener mensajes de una conversación
 */
export async function getConversationMessages(conversationId, limit = 100) {
    try {
        const params = {
            TableName: TABLES.MESSAGES,
            IndexName: 'ConversationIdIndex', // Requiere crear un GSI
            KeyConditionExpression: 'conversationId = :conversationId',
            ExpressionAttributeValues: {
                ':conversationId': conversationId
            },
            ScanIndexForward: true, // Orden ascendente (cronológico)
            Limit: limit
        };

        const result = await docClient.send(new QueryCommand(params));
        console.log(`✅ ${result.Items.length} mensajes encontrados para conversación ${conversationId}`);
        return result.Items || [];
    } catch (error) {
        console.error('❌ Error obteniendo mensajes:', error);
        // Fallback a Scan
        try {
            const scanParams = {
                TableName: TABLES.MESSAGES,
                FilterExpression: 'conversationId = :conversationId',
                ExpressionAttributeValues: {
                    ':conversationId': conversationId
                },
                Limit: limit
            };
            const scanResult = await docClient.send(new ScanCommand(scanParams));
            return scanResult.Items || [];
        } catch (scanError) {
            console.error('❌ Error en scan de mensajes:', scanError);
            return [];
        }
    }
}

// ==========================================
// 📊 OPERACIONES DE ESTADÍSTICAS
// ==========================================

/**
 * Obtener estadísticas del usuario
 */
export async function getUserStats(userId) {
    try {
        const conversations = await getUserConversations(userId);
        const totalMessages = conversations.reduce((sum, conv) => sum + (conv.messageCount || 0), 0);

        return {
            totalConversations: conversations.length,
            totalMessages: totalMessages,
            lastActivity: conversations[0]?.lastMessageAt || null
        };
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        return {
            totalConversations: 0,
            totalMessages: 0,
            lastActivity: null
        };
    }
}

// ==========================================
// 🧪 FUNCIÓN DE PRUEBA
// ==========================================

export async function testConnection() {
    try {
        console.log('🧪 Probando conexión a DynamoDB...');
        
        // Intentar hacer un scan simple
        const params = {
            TableName: TABLES.USERS,
            Limit: 1
        };
        
        await docClient.send(new ScanCommand(params));
        console.log('✅ Conexión a DynamoDB exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a DynamoDB:', error.message);
        return false;
    }
}

// Exportar configuración
export const DB_CONFIG = {
    TABLES,
    client,
    docClient
};
