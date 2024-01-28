const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

const flowGracias = addKeyword(['gracias', 'vale', 'nos vemos']).addAnswer([
    'Muchas gracias por todo! Nos vemos pronto.'
]);
const flowConfirmacion = addKeyword(['1-3cm', '4-7cm', '10-20cm', 'Mas grande']).addAnswer([
    'Muy bien! mándanos una foto de tu tatuaje para poder concertar la cita',
], [flowGracias]);
const flowCitas = addKeyword(['citas', 'reserva']).addAnswer(
    [
        '🗓️ Para programar una cita, necesitamos algunos detalles adicionales:',
        '1. ¿En qué fecha te gustaría programar la cita?',
        '2. ¿A qué hora prefieres?',
        'Por favor, proporciona la fecha y hora deseadas en el siguiente formato: DD/MM/YYYY HH:mm',
    ],
    null,
    null,
    [flowConfirmacion]
);




const flowUbicacion = addKeyword(['ubicacion', 'dirección']).addAnswer(
    [
        '📍 Nuestra tienda está ubicada en:',
        'Dirección: C. Guayaquil, 17, 30394 Cartagena, Murcia',
        '¡Te esperamos para tu próxima sesión de tatuaje!',
    ],
    null,
    null,
    [flowGracias]
);

const flowSi = addKeyword(['si', 'claro', 'venga']).addAnswer(
    [
        'Comencemos con la reserva entonces ¿Cuáles son las medidas que quieres para el tatuaje?',
        {
            buttons:[
                { body: '1-3cm' },
                { body: '4-7cm' },
                { body: '10-20cm' },
                { body: 'Mas grande' }
            ]
        }
    ],
    [flowConfirmacion]
);

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola, bienvenido a *Captain Tattoo*')
    .addAnswer(
        [
            '¿Te gustaría hacer una reserva para un tatuaje?',
            '👉 *Si* Comenzar con la reserva ',
            '👉 *Citas* para programar una cita',
            '👉 *Ubicación* para conocer nuestra dirección',
        ],
        null,
        null,
        [flowSi, flowCitas, flowUbicacion]
    );

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal, flowSi]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
