// https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai
// https://ai-sdk.dev/cookbook/rsc/stream-text

// The API route uses createStreamableValue (for RSC), but it's an API route.so we have to use ReadableStream

import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { question, content, userAnswer } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({
      question,
      content,
      userAnswer,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { textStream } = streamText({
      model: google("gemini-2.5-flash"),
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).every code block must have opening and closing fences, never generate empty code blocks, never generate unfinished markdown, prefer indented code blocks over fenced blocks, and do not nest code blocks inside lists or tables.",
      prompt: `Generate a markdown-formatted response to the following question: "${question}" and provide example code blocks for the answer if necessary.  

      Consider the provided context:  
      **Context:** ${content}  
      
      Also, prioritize and incorporate the user's answer when formulating your response:  
      **User's Answer:** ${userAnswer}  
      
      Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point. 
      Provide the final answer in markdown format.`,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const delta of textStream) {
            controller.enqueue(encoder.encode(delta));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
