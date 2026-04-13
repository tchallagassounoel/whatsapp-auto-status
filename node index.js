const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Initialisation du client avec sauvegarde de session
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// Génération du QR Code dans le terminal
client.on('qr', (qr) => {
    console.log('Scannez ce QR Code avec votre téléphone :');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot connecté et prêt à liker les statuts !');
});

// Écoute des mises à jour de statuts
client.on('status_update', async (status) => {
    try {
        const contact = await status.getContact();
        
        // Calcul d'un délai aléatoire entre 5 et 15 secondes
        const delay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
        
        console.log(`Nouveau statut de : ${contact.pushname || contact.number}. Like prévu dans ${delay / 1000}s...`);

        setTimeout(async () => {
            // La méthode pour envoyer une réaction (le "Like")
            // '❤️' est l'émoji par défaut pour un like de statut
            await client.sendPresenceAvailable(); // Simule une présence en ligne
            await status.react('❤️'); 
            
            console.log(`✅ Statut de ${contact.pushname || contact.number} liké avec succès !`);
        }, delay);

    } catch (error) {
        console.error("Erreur lors de la réaction au statut :", error);
    }
});

client.initialize();
