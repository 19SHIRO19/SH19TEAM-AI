import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // ВАЖНО: Ключ мы добавим в панель Vercel под именем GEMINI_API_KEY
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }

    try {
        const { message } = req.body;
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при работе с AI' });
    }
}