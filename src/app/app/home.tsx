"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginModal from "@/components/features/LoginModal"
import Link from "next/link"

interface Quote {
  id: string;
  text: string;
  author: string;
  approved: boolean;
}

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");
  const [adminView, setAdminView] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/firestore/Jokes');
        setQuotes(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchJokes();
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [quotes]);

  const handleGetNewQuote = () => {
    if (quotes.length > 0) {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  };

  const handleSubmitNewQuote = async () => {
    if (newQuoteText.trim() !== "" && newQuoteAuthor.trim() !== "") {
      const newQuote = {
        id:(quotes.length + 1).toString(),
        text: newQuoteText,
        author: newQuoteAuthor,
        approved: false,
      };
      try {
        const response = await axios.post('http://localhost:3002/firestore/Joke', newQuote);
        if (response.status === 201 || response.status === 200) {
          setQuotes([...quotes, { ...newQuote, id: response.data.id }]);
        } else {
          console.error('Failed to add joke');
        }
      } catch (error) {
        console.error('Error occurred while adding joke:', error);
      }
      setNewQuoteText("");
      setNewQuoteAuthor("");
    }
  };

  const handleAdminLogin = async() => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, adminUsername, adminPassword);
      const token = await userCredential.user.getIdToken();
      console.log('Token:', token);
      // Store the token or send it to your backend
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleApproveQuote = (quoteId: string) => {
    setQuotes(quotes.map((quote) => (quote.id === quoteId ? { ...quote, approved: true } : quote)));
  };

  const handleDeleteQuote = (quoteId: string) => {
    setQuotes(quotes.filter((quote) => quote.id !== quoteId));
  };

  if (!currentQuote) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-start ml-[20%] justify-center h-screen bg-gray-100" >
      <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 -z-40"
    style={{ backgroundImage: 'url(/minion3.jpg)' }}
  ></div>
      {!adminView ? (
        <div className="bg-[#000] p-8 rounded-lg shadow-md w-full max-w-md relative z-10 pb-10">
          <h1 className="text-2xl font-bold mb-4 text-[#fff]">Joke of the Day</h1>
          <div className="bg-gray-200 p-4 rounded-lg mb-4 text-[#fff]">
            <p className="text-lg">{currentQuote.text}</p>
            <p className="text-gray-500 mt-2">- {currentQuote.author}</p>
          </div>
          <Button onClick={handleGetNewQuote} className="w-full  text-[#000] font-bold" variant='secondary'>
            Get New Joke
          </Button>
          <Separator className="my-4" />
          <h2 className="text-xl font-bold mb-2 text-[#fff]">Submit a Quote</h2>
          <div className="text-[#fff] grid gap-2">
            <Label htmlFor="quote-text">Joke</Label>
            <Textarea
              id="quote-text"
              value={newQuoteText}
              onChange={(e) => setNewQuoteText(e.target.value)}
              placeholder="Enter your Joke here..."
              className="w-full text-[#000]"
            />
            <Label htmlFor="quote-author" className="mt-2">Author</Label>
            <Input
              id="quote-author"
              value={newQuoteAuthor}
              onChange={(e) => setNewQuoteAuthor(e.target.value)}
              placeholder="Enter the author's name..."
              className="w-full text-[#000]"
            />
            <Button onClick={handleSubmitNewQuote} className="w-full mt-3 text-[#000] font-bold" variant='secondary'>
              Submit Joke
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
      {!adminView && (
        <div className="mt-4 z-50">
          <Button onClick={() => setAdminView(true)}>Admin Login</Button>
        </div>
      )}
      {adminView && (
        <div className="flexflex-col w-full max-w-md justify-center items-center">
          <LoginModal />
        <Button onClick={() => setAdminView(false)} className="mt-4 bg-none h-8 float-end text-md flex gap-2"><img src="/icons/back.svg" className="w-8"/><p className="pr-5">Back</p></Button>
        </div>
      )}
    </div>
  )
}
