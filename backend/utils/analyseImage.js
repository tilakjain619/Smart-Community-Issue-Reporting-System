/*
This function analyzes an image and classifies it into a civic category. It uses the OpenRouter API to process the image and return a structured JSON response containing the category and a concise title.
*/

async function analyzeImage(imageUrl) {
    const prompt = `
Analyze the uploaded image and classify it into one of the following fixed civic categories:

1. Roads & Transport  
2. Street Lighting  
3. Garbage & Sanitation  
4. Water Supply & Drainage  
5. Electricity  
6. Public Safety  
7. Other

Return the result in structured JSON format:
{
  "category": "<one of the fixed categories above>",
  "title": "<a concise title, max 10 words>"
}
Only respond with the raw JSON object. Do not use Markdown formatting or triple backticks.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "mistralai/mistral-small-3.2-24b-instruct:free",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": imageUrl
                            }
                        }
                    ]
                }
            ]
        })
    });

    const res = await response.json();
    const message = res.choices[0].message.content;

    try {
        const result = JSON.parse(message);
        return result;
    } catch (error) {
        console.error("Error parsing response:", error);
        return { category: "Other", title: "Unknown Issue" };
    }
}

// (async () => {
//     const res = await analyzeImage("https://res.cloudinary.com/da3wjnlzg/image/upload/v1759671098/JagrukImageContainer/ihrc7ybnmwdbol8kl4dz.jpg");
//     const message = res.choices[0].message.content;

//     try {
//         const result = JSON.parse(message);
//         console.log(result);
//     } catch (error) {
//         console.error("Error parsing response:", error);
//     }
// })();
module.exports = analyzeImage;
