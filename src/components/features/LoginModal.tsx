"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/firebase';

export default function LoginModal() {
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const router = useRouter();

  const handleAdminLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, adminUsername, adminPassword);
      const user = userCredential.user;
      const token = await user.getIdToken();
      const email = user.email;

      console.log('sjjsj', token)
      localStorage.setItem('authToken', token);
      console.log('Token:', token);
      console.log('Email:', email);

      if (token) { 
        router.push('/app/admin-landing');
      } else {
        console.error('Unauthorized access attempt.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-4 bg-[#000]">
      <h2 className="text-xl font-bold mb-4 text-center text-[#fff]">Admin Login</h2>
      <div className="grid gap-2">
        <Label htmlFor="admin-username" className='text-[#fff]'>Username</Label>
        <Input
          id="admin-username"
          value={adminUsername}
          onChange={(e) => setAdminUsername(e.target.value)}
          placeholder="Enter your username..."
          className="w-full mb-3" 
        />
        <Label htmlFor="admin-password" className='text-[#fff]'>Password</Label>
        <Input
          id="admin-password"
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          placeholder="Enter your password..."
          className="w-full mb-3"
        />
        <Button onClick={handleAdminLogin} className="w-full mt-3" variant='secondary'>
          Login
        </Button>
      </div>
    </div>
  );
}
