import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// This middleware doesn't protect any routes - it just passes through
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => {
        // Allow all requests, regardless of authentication
        return true;
      },
    },
  }
);

export const config = {
  matcher: [], // Empty matcher means no routes are protected
};