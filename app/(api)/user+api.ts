import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  const sql = neon(process.env.DB_URL as string);
  const { name, email, clerkId } = await req.json();
  try {
    if (!name || !email || !clerkId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    const response = await sql`INSERT INTO users (
      name, 
      email, 
      clerk_id
      ) 
      VALUES (
      ${name}, 
      ${email}, 
      ${clerkId}
      )
      `;
    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (error: any) {
    console.log(error);
    return new Response(JSON.stringify({ data: error.message }), { status: 500 });
  }
}
