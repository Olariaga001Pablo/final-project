import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Recurso {
    _id: string;
    name: "oro" | "comida" | "piedra" | "madera" | "tropas";
    quantity: number;
}

interface mensaje {
    emisor: string;
    receptor: string;
    contenido: string;
    fecha: Date;
    recursos: Recurso[];
}

const TabTwoContent = ({ activeTab = 'tab1'}) => {
    const [messages, setMessages] = useState<mensaje[]>([]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/api/mensaje`);
            setMessages(response.data.mensajes);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'tab2') {
            fetchMessages();
        }
    }, [activeTab]);

    return (
        <div>
            <h2>Contenido de la Pestaña 2</h2>
            {messages.length === 0 ? (
                <p>No hay mensajes disponibles.</p>
            ) : (
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            <strong>De:</strong> {message.emisor} <br />
                            <strong>Para:</strong> {message.receptor} <br />
                            <strong>Contenido:</strong> {message.contenido} <br />
                            <strong>Fecha:</strong> {new Date(message.fecha).toLocaleString()} <br />
                            <strong>Recursos:</strong> {message.recursos.map((resource, idx) => (
                                <span key={idx}>{resource.name} ({resource.quantity}) </span>
                            ))}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TabTwoContent;
