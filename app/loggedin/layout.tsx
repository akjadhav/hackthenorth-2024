import React from 'react';
import ConvexClientProvider from "../ConvexProviderWithAuth";
import { auth, signOut } from "../../auth";
import { ReactNode } from "react";
import { LogOut } from 'lucide-react';

export default async function LoggedInLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <div className="min-h-screen bg-gray-100">
      <SignOut />
      <ConvexClientProvider session={session}>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </ConvexClientProvider>
    </div>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="fixed top-4 right-4 flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign out</span>
      </button>
    </form>
  );
}