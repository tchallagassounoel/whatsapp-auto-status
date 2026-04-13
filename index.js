const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('ready', () => {
    console.log('✅ Bot connecté avec succès !');
    console.log('Surveillance des statuts en cours...');
});

// Système de détection et de Like automatique
client.on('status_update', async (status) => {
    try {
        const contact = await status.getContact();
        
        // Délai aléatoire entre 5 et 15 secondes pour rester discret
        const delay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
        
        console.log(`Statut détecté : ${contact.pushname || contact.number}. Like prévu dans ${delay / 1000}s...`);

        setTimeout(async () => {
            await status.react('❤️'); 
            console.log(`✅ Statut de ${contact.pushname || contact.number} liké !`);
        }, delay);

    } catch (error) {
        console.error("Erreur lors de la réaction :", error);
    }
});

// Demande du code de couplage au lieu du QR Code
client.on('qr', async () => {
    try {
        const myNumber = "22892235822"; // Ton numéro configuré
        const pairingCode = await client.requestPairingCode(myNumber);
        
        console.log('------------------------------');
        console.log('VOTRE CODE DE COUPLAGE WHATSAPP :');
        console.log('👉 ' + pairingCode + ' 👈');
        console.log('------------------------------');
        console.log('Instructions :');
        console.log('1. Ouvrez WhatsApp sur votre téléphone.');
        console.log('2. Allez dans Appareils connectés > Lier un appareil.');
        console.log('3. Cliquez sur "Lier avec le numéro de téléphone plutôt".');
        console.log('4. Saisissez le code ci-dessus.');
    } catch (err) {
        console.error("Erreur de génération du code :", err);
    }
});

client.initialize();
