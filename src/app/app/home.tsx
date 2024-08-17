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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {!adminView ? (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Quote of the Day</h1>
          <div className="bg-gray-200 p-4 rounded-lg mb-4">
            <p className="text-lg">{currentQuote.text}</p>
            <p className="text-gray-500 mt-2">- {currentQuote.author}</p>
          </div>
          <Button onClick={handleGetNewQuote} className="w-full">
            Get New Quote
          </Button>
          <Separator className="my-4" />
          <h2 className="text-xl font-bold mb-2">Submit a Quote</h2>
          <div className="grid gap-2">
            <Label htmlFor="quote-text">Quote</Label>
            <Textarea
              id="quote-text"
              value={newQuoteText}
              onChange={(e) => setNewQuoteText(e.target.value)}
              placeholder="Enter your quote here..."
              className="w-full"
            />
            <Label htmlFor="quote-author">Author</Label>
            <Input
              id="quote-author"
              value={newQuoteAuthor}
              onChange={(e) => setNewQuoteAuthor(e.target.value)}
              placeholder="Enter the author's name..."
              className="w-full"
            />
            <Button onClick={handleSubmitNewQuote} className="w-full">
              Submit Quote
            </Button>
          </div>
        </div>
      ) : (
        // <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        //   <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        //   <Tabs defaultValue="quotes">
        //     <TabsList>
        //       <TabsTrigger value="quotes">Quotes</TabsTrigger>
        //       <TabsTrigger value="new-quote">New Quote</TabsTrigger>
        //     </TabsList>
        //     <TabsContent value="quotes">
        //       <Table>
        //         <TableHeader>
        //           <TableRow>
        //             <TableHead>ID</TableHead>
        //             <TableHead>Quote</TableHead>
        //             <TableHead>Author</TableHead>
        //             <TableHead>Approved</TableHead>
        //             <TableHead>Actions</TableHead>
        //           </TableRow>
        //         </TableHeader>
        //         <TableBody>
        //           {quotes.map((quote) => (
        //             <TableRow key={quote.id}>
        //               <TableCell>{quote.id}</TableCell>
        //               <TableCell>{quote.text}</TableCell>
        //               <TableCell>{quote.author}</TableCell>
        //               <TableCell>
        //                 {quote.approved ? (
        //                   <Badge variant="default">Approved</Badge>
        //                 ) : (
        //                   <Badge variant="destructive">Pending</Badge>
        //                 )}
        //               </TableCell>
        //               <TableCell>
        //                 {!quote.approved && (
        //                   <Button onClick={() => handleApproveQuote(quote.id)} variant="outline" size="sm">
        //                     Approve
        //                   </Button>
        //                 )}
        //                 <Button
        //                   onClick={() => handleDeleteQuote(quote.id)}
        //                   variant="outline"
        //                   size="sm"
        //                   className="ml-2"
        //                 >
        //                   Delete
        //                 </Button>
        //               </TableCell>
        //             </TableRow>
        //           ))}
        //         </TableBody>
        //       </Table>
        //     </TabsContent>
        //     <TabsContent value="new-quote">
        //       <div className="grid gap-2">
        //         <Label htmlFor="new-quote-text">Quote</Label>
        //         <Textarea
        //           id="new-quote-text"
        //           value={newQuoteText}
        //           onChange={(e) => setNewQuoteText(e.target.value)}
        //           placeholder="Enter the new quote here..."
        //           className="w-full"
        //         />
        //         <Label htmlFor="new-quote-author">Author</Label>
        //         <Input
        //           id="new-quote-author"
        //           value={newQuoteAuthor}
        //           onChange={(e) => setNewQuoteAuthor(e.target.value)}
        //           placeholder="Enter the author's name..."
        //           className="w-full"
        //         />
        //         <Button onClick={handleSubmitNewQuote} className="w-full">
        //           Submit New Quote
        //         </Button>
        //       </div>
        //     </TabsContent>
        //   </Tabs>
        // </div>
        <></>
      )}
      {!adminView && (
        <div className="mt-4">
          <Button onClick={() => setAdminView(true)}>Admin Login</Button>
        </div>
      )}
      {adminView && (
        <LoginModal />
        // <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-4">
        //   <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        //   <div className="grid gap-2">
        //     <Label htmlFor="admin-username">Username</Label>
        //     <Input
        //       id="admin-username"
        //       value={adminUsername}
        //       onChange={(e) => setAdminUsername(e.target.value)}
        //       placeholder="Enter your username..."
        //       className="w-full"
        //     />
        //     <Label htmlFor="admin-password">Password</Label>
        //     <Input
        //       id="admin-password"
        //       type="password"
        //       value={adminPassword}
        //       onChange={(e) => setAdminPassword(e.target.value)}
        //       placeholder="Enter your password..."
        //       className="w-full"
        //     />
        //     <Button onClick={handleAdminLogin} className="w-full">
        //       Login
        //     </Button>
        //   </div>
        // </div>
      )}
    </div>
  )
}
