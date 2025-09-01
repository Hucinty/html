import { GoogleGenAI, Type } from "@google/genai";
import { type GeneratedCode } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const createSystemInstruction = (style: string, mood: string, target: 'web' | 'email', numberOfPages: number): string => {
    if (target === 'email') {
        return `You are an expert web developer creating HTML code for an email. Your goal is to create a modern-looking layout that uses <div> tags for structure, but is formatted for email compatibility.

The user has provided the following preferences:
- **Style:** '${style}'. This should guide the overall layout and structure.
- **Mood:** '${mood}'. Use this to choose a suitable color palette for the email.

Follow these critical guidelines:
1.  **Use \`<div>\` for Layout:** Structure the entire layout using \`<div>\` elements with modern CSS properties like Flexbox where appropriate. Your goal is to create a layout that looks like a modern webpage. Do NOT use tables for layout.
2.  **Inline All CSS:** This is the most important rule. All styling MUST be inlined using the 'style' attribute on HTML tags (e.g., \`<div style="display: flex; background-color: #ffffff;">\`). Do NOT use \`<style>\` blocks or external stylesheets. Every style must be inlined.
3.  **Compatibility:** While using \`<div>\`s, use CSS properties that are widely supported in modern email clients like Gmail and Apple Mail. Avoid complex CSS that might not render correctly.
4.  **Image Sourcing:** If the prompt implies images are needed, find and use full URLs for high-quality, royalty-free images from services like Unsplash or Pexels. Ensure images have \`alt\` text.
5.  **Full HTML Document:** Generate a complete HTML document, starting with \`<!DOCTYPE html>\` and including \`<head>\` and \`<body>\` tags.
6.  **No JavaScript:** Do not include any \`<script>\` tags or JavaScript code.
7.  **Explanation:** In the generated HTML, add a comment in the <head> section briefly explaining your choice of color palette based on the mood.
8.  **JSON Response:** Respond with a single JSON object containing "pages" and "css". "pages" must be an array with a single page object, having "name" and "html" keys. The "css" key MUST be an empty string.`;
    }
    
    // Default to 'web' instructions
    return `You are an expert creative web developer specializing in creating visually stunning, responsive, multi-page HTML and CSS websites.

The user has provided the following preferences:
- **Number of Pages:** ${numberOfPages}
- **Style:** '${style}'. This should guide the overall layout, component structure, and visual hierarchy.
- **Mood:** '${mood}'. This is your primary guide for selecting a color palette, visual effects, and animation style.

Follow these advanced creative and technical guidelines:
1.  **Multi-Page Structure:**
    *   Generate exactly ${numberOfPages} distinct HTML pages.
    *   For each page's HTML, generate ONLY the content that goes inside the <body> tag. Do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags in your response. The application will handle wrapping it in a full document structure.
    *   Based on the user's prompt, intelligently determine the purpose and name for each page (e.g., "Home", "About Us", "Services", "Contact", "Gallery").
    *   Create a single, shared navigation bar that is identical on every page.
    *   The navigation bar MUST contain links to all the other pages you've generated. Use relative links like \`./contact.html\`. For the first page, use \`index.html\`. For other pages, use lowercase names based on the page title (e.g., about.html, services.html).
2.  **Prioritize User's Mood for Aesthetics:** The selected mood, '${mood}', is the most important factor for aesthetic choices. Apply color psychology and choose effects that evoke this mood. For example:
    *   **Calm/Professional:** Use blues, greens, and muted tones. Simple, subtle effects.
    *   **Energetic/Playful:** Use oranges, yellows, and bright colors. Incorporate bouncy \`@keyframes\` animations and custom SVG doodles.
    *   **Futuristic/Modern:** Use dark themes, neon accents, and consider advanced effects like 'glassmorphism' (\`backdrop-filter\`).
    *   **Luxurious:** Use blacks, whites, golds, or deep jewel tones with elegant, slow animations.
3.  **Generate Custom Graphics:** You can create custom vector graphics. If the prompt asks for "doodles," "icons," "graphics," or "patterns," generate and embed clean, optimized SVG code directly into the HTML.
4.  **Use Advanced CSS Effects:** When appropriate for the mood and style, use sophisticated CSS. This includes \`radial-gradient\` or \`conic-gradient\` for backgrounds, \`backdrop-filter\` for glassmorphism, and custom \`@keyframes\` for engaging animations. Provide this in the separate CSS block.
5.  **Select Typography:** Based on the user's selected **Style** ('${style}'), choose an appropriate and unique font from Google Fonts. Include the necessary <link> tag in the HTML <head> of EVERY page.
6.  **Explain Your Choices:** In the generated HTML for the first page only, add a comment in the <head> section explaining your choices for color palette, typography, graphics, and effects based on the mood and style.
7.  **Image Sourcing:** If the prompt implies stock images are needed (and not custom graphics), find and use full URLs for high-quality, royalty-free images from services like Unsplash or Pexels.
8.  **HTML Structure & Styling:** Create semantic HTML. Use Tailwind CSS classes directly in the HTML for all possible styling. The shared CSS for all pages should be in the 'css' field.
9.  **Responsiveness & No JS:** Ensure the layout is responsive using Tailwind. Do not include any JavaScript.

Respond with a single JSON object containing "pages" (an array of page objects with "name" and "html" keys) and "css" keys.`;
};


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        pages: {
            type: Type.ARRAY,
            description: "An array of page objects, each containing the name and HTML for a page.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The name of the page (e.g., 'Home', 'About Us')."
                    },
                    html: {
                        type: Type.STRING,
                        description: "The HTML code for the page's body content, with Tailwind CSS classes."
                    }
                },
                required: ["name", "html"]
            }
        },
        css: {
            type: Type.STRING,
            description: "Any additional custom CSS needed for all pages. Should be an empty string if not required.",
        },
    },
    required: ["pages", "css"],
};

const handleApiResponse = (response: any): GeneratedCode => {
    const finishReason = response?.candidates?.[0]?.finishReason;

    // Handle cases where generation stopped for a reason other than 'STOP'
    if (finishReason && finishReason !== 'STOP') {
        if (finishReason === 'MAX_TOKENS') {
             console.error("Response truncated because the output token limit was reached.", response);
             throw new Error("The model's response was too long and was cut short. Try requesting fewer pages or a simpler design.");
        }
        console.error(`Content generation failed with reason: ${finishReason}`, response);
        throw new Error(`Content generation failed. Reason: ${finishReason}. Please revise your prompt or image and try again.`);
    }

    if (!response || !response.text) {
        console.error("Gemini API returned an invalid response object or no text.", response);
        throw new Error("The model returned an empty response. This could be due to a safety block on the prompt or a temporary API issue.");
    }

    const text: string = response.text;

    try {
        let jsonString = text.trim();
        // The model might wrap the JSON in a markdown code block.
        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.substring(7, jsonString.length - 3).trim();
        } else if (jsonString.startsWith("```")) {
             jsonString = jsonString.substring(3, jsonString.length - 3).trim();
        }

        const generatedCode = JSON.parse(jsonString) as GeneratedCode;

        if (
            !generatedCode.pages ||
            !Array.isArray(generatedCode.pages) ||
            typeof generatedCode.css !== 'string' ||
            generatedCode.pages.some(p => typeof p.name !== 'string' || typeof p.html !== 'string')
        ) {
            throw new Error("Invalid JSON structure in the API response.");
        }

        return generatedCode;
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini API:", text, e);
        throw new Error("The model returned data in an unexpected format. Please try again.");
    }
};


export async function generateHtmlFromImage(
  base64Image: string,
  mimeType: string,
  style: string,
  mood: string,
  target: 'web' | 'email',
  numberOfPages: number,
): Promise<GeneratedCode> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const systemInstruction = createSystemInstruction(style, mood, target, numberOfPages);
    const promptText = `Analyze the provided image of a webpage mockup. Based on the image and the system instructions, generate a ${numberOfPages}-page website.`;

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, {text: promptText }] },
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.2,
        },
    });
    
    return handleApiResponse(response);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the API.");
  }
}

export async function generateHtmlFromText(
  userPrompt: string,
  style: string,
  mood: string,
  target: 'web' | 'email',
  numberOfPages: number,
): Promise<GeneratedCode> {
  try {
    const systemInstruction = createSystemInstruction(style, mood, target, numberOfPages);

    const response = await ai.models.generateContent({
        model: model,
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.2,
        },
    });

    return handleApiResponse(response);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the API.");
  }
}