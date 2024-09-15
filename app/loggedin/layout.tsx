import React from 'react';
import ConvexClientProvider from "../ConvexProviderWithAuth";
import { auth, signOut } from "../../auth";
import { ReactNode } from "react";
import { LogOut } from 'lucide-react';

const SignOut = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign out</span>
      </button>
    </form>
  );
};

const LoggedInLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <ConvexClientProvider session={session}>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </ConvexClientProvider>
      <SignOut />
    </div>
  );
};

export default LoggedInLayout;