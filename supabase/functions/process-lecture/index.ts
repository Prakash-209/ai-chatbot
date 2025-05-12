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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Transcribe the audio/video
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "text"
    });

    // Store the transcription in Supabase
    const { data, error } = await supabase
      .from('transcriptions')
      .insert([
        { 
          content: transcription,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ transcription: data }),
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