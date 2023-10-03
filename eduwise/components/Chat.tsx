'use client'

import React from 'react';

// Component to represent a message in the conversation
function Message({ text, isBot, imageUrl }) {
    const alignmentClass = isBot ? 'justify-start mr-auto' : 'justify-end  ml-auto';
    const bgColorClass = isBot ? 'bg-blue' : 'bg-green';
    const marginLeft = isBot ? 'mr-auto' : 'ml-auto'
    const messageBgColor = isBot ? 'bg-gray-100 dark:bg-transparent' : 'bg-sky-100 dark:bg-gray-800'

    return (
        <div className={`flex flex-col mb-4 ${alignmentClass}`}>
            <div className={`w-10 h-10 rounded-full ${marginLeft}`}>
                <img
                    src={imageUrl}
                    alt={`Image ${isBot ? 'Bot' : 'User'}`}
                    className='rounded-lg'
                />
            </div>
            <div className={`${bgColorClass}-500 rounded-lg border-2 mt-2 p-2 max-w-4xl flex-grow ${messageBgColor}`}>
                <p>{text}</p>
            </div>
        </div>
    );
}

function Chat() {
    // Example of a conversation between a chatbot and a user
    const messages = [
        { text: "Hello, how can I assist you?", isBot: true, imageUrl: '/avatars/chatbot.png' },
        { text: "Hi! I'm looking for information about a product.", isBot: false, imageUrl: '/avatars/01.png' },
        { text: "May I have the name of the product you're looking for?", isBot: true, imageUrl: '/avatars/chatbot.png' },
        { text: "Sure, I'm looking for a mobile phone.", isBot: false, imageUrl: '/avatars/01.png' },
        { text: (
            'Ciao! Dante Alighieri è stato un celebre poeta italiano del XIII secolo, noto soprattutto '
            + 'per la sua opera epica La Divina Commedia. Nato a Firenze nel 1265, Dante ebbe una vita molto interessante e travagliata.\n'
            + 'Dante scrisse in lingua italiana vulgare (il dialetto toscano) anziché in latino come era comune all\'epoca. '
            + 'Questa decisione fu rivoluzionaria e contribuì alla diffusione della lingua italiana come strumento letterario ed culturale.\n'
            + 'La sua opera più famosa è La Divina Commedia, considerata uno dei capolavori '
             + 'assoluti della letteratura mondiale. È composta da tre parti: Inferno, Purgatorio e Paradiso.'
             + 'La storia vede Dante stesso viaggiare attraverso '
             + 'i regni dell\'Aldilà con la guida di Virgilio (nell\'Inferno) e Beatrice (nel Purgatorio e nel Paradiso).'
             + 'Attraversando queste terre ultraterrene, egli rappresenta l\'anima umana che cerca redenzione dai propri peccati per raggiungere il paradiso divino.\n'
          ), isBot: true, imageUrl: '/avatars/chatbot.png' },
        { text: "Sure, I'm looking for a mobile phone.", isBot: false, imageUrl: '/avatars/01.png' },
    ];

    return (
        <div className="flex flex-col p-4 w-full">
            {messages.map((message, index) => (
                <Message
                    key={index}
                    text={message.text}
                    isBot={message.isBot}
                    imageUrl={message.imageUrl}
                />
            ))}
        </div>
    );
}

export default Chat;
