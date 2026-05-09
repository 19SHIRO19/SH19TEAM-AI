import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Проверка метода
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }

    // Проверка наличия ключа
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Критическая ошибка: API ключ не настроен в Vercel' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Сообщение пустое' });
        }

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // ВАЖНО: Твой HTML ищет поле "reply", поэтому возвращаем именно его
        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Ошибка Gemini:", error);
        res.status(500).json({ 
            error: 'Ошибка при работе с AI', 
            details: error.message,
            reply: "Произошла ошибка при генерации ответа. Проверьте логи Vercel." 
        });
    }
}
