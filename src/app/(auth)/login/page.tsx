"use client"
import React, { useState } from 'react'
import { useAuthStore } from '@/store/Auth'

const LoginPage = () => {
    const { login } = useAuthStore();
    const [isLoding, setIsLoding] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // collect data
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        // validation
        if (!email || !password) {
            setError(() => "Pleas fill all the fields");
            return;
        }

        setIsLoding(() => true);
        setError(() => "");

        // login-store
        const loginResponse = await login(email.toString(), password.toString());
        if (loginResponse.error) {
            setError(() => loginResponse.error!.message);
        }

        setIsLoding(() => false);
    }
  return (
    <div>
        {error && (
            <p>{error}</p>
        )}
    </div>
  )
}

export default LoginPage