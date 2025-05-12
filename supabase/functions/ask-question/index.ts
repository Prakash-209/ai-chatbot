import { createClient } from "npm:@supabase/supabase-js@2.39.0";
import { OpenAI } from "npm:openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, transcriptionId } = await req.json();

    if (!question || !transcriptionId) {
      return new Response(
        JSON.stringify({ error: "Question and transcriptionId are required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the transcription from Supabase
    const { data: transcription, error: transcriptionError } = await supabase
      .from('transcriptions')
      .select('content')
      .eq('id', transcriptionId)
      .single();

    if (transcriptionError) throw transcriptionError;

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    // Get answer from GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that answers questions about lecture content. Base your answers only on the provided transcript."
        },
        {
          role: "user",
          content: `Transcript: ${transcription.content}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return new Response(
      JSON.stringify({ answer: completion.choices[0].message.content }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});