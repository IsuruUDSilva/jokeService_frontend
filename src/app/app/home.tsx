/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vzB24HeuTsy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      text: "The only way to do great work is to love what you do. - Steve Jobs",
      author: "Steve Jobs",
      approved: true,
    },
    {
      id: 2,
      text: "Believe you can and you're halfway there. - Theodore Roosevelt",
      author: "Theodore Roosevelt",
      approved: true,
    },
    {
      id: 3,
      text: "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
      author: "Dalai Lama",
      approved: false,
    },
  ])
  const [currentQuote, setCurrentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)])
  const [newQuoteText, setNewQuoteText] = useState("")
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("")
  const [adminView, setAdminView] = useState(false)
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const handleGetNewQuote = () => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }
  const handleSubmitNewQuote = () => {
    if (newQuoteText.trim() !== "" && newQuoteAuthor.trim() !== "") {
      const newQuote = {
        id: quotes.length + 1,
        text: newQuoteText,
        author: newQuoteAuthor,
        approved: false,
      }
      setQuotes([...quotes, newQuote])
      setNewQuoteText("")
      setNewQuoteAuthor("")
    }
  }
  const handleAdminLogin = () => {
    if (adminUsername === "admin" && adminPassword === "password") {
      setAdminView(true)
    } else {
      alert("Invalid username or password")
    }
  }
  const handleApproveQuote = (quoteId: any) => {
    setQuotes(quotes.map((quote) => (quote.id === quoteId ? { ...quote, approved: true } : quote)))
  }
  const handleDeleteQuote = (quoteId: any) => {
    setQuotes(quotes.filter((quote) => quote.id !== quoteId))
  }
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
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <Tabs defaultValue="quotes">
            <TabsList>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="new-quote">New Quote</TabsTrigger>
            </TabsList>
            <TabsContent value="quotes">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Quote</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>{quote.id}</TableCell>
                      <TableCell>{quote.text}</TableCell>
                      <TableCell>{quote.author}</TableCell>
                      <TableCell>
                        {quote.approved ? (
                          <Badge variant="default">Approved</Badge>
                        ) : (
                          <Badge variant="destructive">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!quote.approved && (
                          <Button onClick={() => handleApproveQuote(quote.id)} variant="outline" size="sm">
                            Approve
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteQuote(quote.id)}
                          variant="outline"
                          size="sm"
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="new-quote">
              <div className="grid gap-2">
                <Label htmlFor="new-quote-text">Quote</Label>
                <Textarea
                  id="new-quote-text"
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Enter the new quote here..."
                  className="w-full"
                />
                <Label htmlFor="new-quote-author">Author</Label>
                <Input
                  id="new-quote-author"
                  value={newQuoteAuthor}
                  onChange={(e) => setNewQuoteAuthor(e.target.value)}
                  placeholder="Enter the author's name..."
                  className="w-full"
                />
                <Button onClick={handleSubmitNewQuote} className="w-full">
                  Submit New Quote
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {!adminView && (
        <div className="mt-4">
          <Button onClick={() => setAdminView(true)}>Admin Login</Button>
        </div>
      )}
      {adminView && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-4">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <div className="grid gap-2">
            <Label htmlFor="admin-username">Username</Label>
            <Input
              id="admin-username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="Enter your username..."
              className="w-full"
            />
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter your password..."
              className="w-full"
            />
            <Button onClick={handleAdminLogin} className="w-full">
              Login
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}