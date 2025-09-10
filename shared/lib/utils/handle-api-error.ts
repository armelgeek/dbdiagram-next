import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DrizzleError } from "drizzle-orm";

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  // Erreurs de validation Zod
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: error.errors,
      },
      { status: 400 }
    );
  }

  // Erreurs de base de données Drizzle
  if (error instanceof DrizzleError) {
    return NextResponse.json(
      {
        error: "Database error",
        message: error.message,
      },
      { status: 500 }
    );
  }

  // Erreurs personnalisées avec message
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.name,
        message: error.message,
      },
      { status: 500 }
    );
  }

  // Erreurs inconnues
  return NextResponse.json(
    {
      error: "Internal server error",
      message: "An unexpected error occurred",
    },
    { status: 500 }
  );
}
