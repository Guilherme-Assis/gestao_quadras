import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export const enviarMensagemWhatsApp = async (numero, mensagem) => {
    try {
        const response = await axios.post(
            'https://chatapi.sticonsulting.net/api/messages/send',
            {
                number: numero,
                body: mensagem
            },
            {
                headers: {
                    Authorization: `Bearer 123`,
                    'Content-Type': 'application/json'
                }
            }
        )

        console.log('✅ WhatsApp enviado:', response.data)
    } catch (error) {
        console.error('❌ Erro ao enviar WhatsApp:', error.response?.data || error.message)
    }
}
