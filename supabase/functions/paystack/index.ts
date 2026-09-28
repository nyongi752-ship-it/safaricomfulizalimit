import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface InitBody {
  action: "initialize";
  package_id: string;
  limit_label: string;
  fee_label: string;
  fee_kobo: number;
  email: string;
  phone?: string;
  full_name?: string;
  current_limit?: string;
  occupation?: string;
}

interface VerifyBody {
  action: "verify";
  reference: string;
  order_id: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!PAYSTACK_SECRET) {
      return new Response(
        JSON.stringify({ error: "Paystack secret key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const body = await req.json();

    // ── Initialize transaction ──────────────────────────────────────
    if (body.action === "initialize") {
      const { package_id, limit_label, fee_label, fee_kobo, email, phone, full_name, current_limit, occupation } = body as InitBody;

      if (!email || !fee_kobo || !package_id) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create order row
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          package_id,
          limit_label,
          fee_label,
          fee_kobo,
          email,
          phone: phone ?? null,
          full_name: full_name ?? null,
          current_limit: current_limit ?? null,
          occupation: occupation ?? null,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        return new Response(
          JSON.stringify({ error: "Failed to create order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate a unique reference
      const reference = `LMB_${order.id}_${Date.now()}`;

      // Initialize transaction with Paystack
      const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: fee_kobo,
          currency: "KES",
          reference,
          channels: ["mobile_money"],
          callback_url: `${SUPABASE_URL}/functions/v1/paystack`,
          metadata: {
            order_id: order.id,
            package_id,
            limit_label,
            full_name: full_name ?? null,
            current_limit: current_limit ?? null,
            occupation: occupation ?? null,
          },
        }),
      });

      const psData = await psRes.json();

      if (!psData.status) {
        return new Response(
          JSON.stringify({ error: psData.message || "Paystack initialization failed" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Save the Paystack reference to the order
      await supabase
        .from("orders")
        .update({ paystack_reference: reference, updated_at: new Date().toISOString() })
        .eq("id", order.id);

      return new Response(
        JSON.stringify({
          order_id: order.id,
          reference,
          authorization_url: psData.data.authorization_url,
          access_code: psData.data.access_code,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Verify transaction ─────────────────────────────────────────
    if (body.action === "verify") {
      const { reference, order_id } = body as VerifyBody;

      if (!reference) {
        return new Response(
          JSON.stringify({ error: "Missing reference" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const psRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      });

      const psData = await psRes.json();

      if (!psData.status) {
        return new Response(
          JSON.stringify({ error: psData.message || "Verification failed" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const paid = psData.data.status === "success";

      await supabase
        .from("orders")
        .update({
          status: paid ? "paid" : "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order_id);

      return new Response(
        JSON.stringify({
          status: paid ? "paid" : "failed",
          reference,
          amount: psData.data.amount,
          gateway_response: psData.data.gateway_response,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Paystack webhook (callback_url) ────────────────────────────
    // Paystack sends a POST with the event data when payment completes
    if (body.event === "charge.success") {
      const reference = body.data?.reference;
      const order_id = body.data?.metadata?.order_id;

      if (reference && order_id) {
        await supabase
          .from("orders")
          .update({
            status: "paid",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order_id);
      }

      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
