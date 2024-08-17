"use client"

import React, { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import axios from 'axios'

interface Quote {
    id: string;
    text: string;
    author: string;
    approved: boolean;
}

const AdminView = ({
}) => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [newQuoteText, setNewQuoteText] = useState("");
    const [newQuoteAuthor, setNewQuoteAuthor] = useState("");

    const token = localStorage.getItem('authToken');

    const handleSubmitNewQuote = async () => {
        console.log('hi1');
        if (newQuoteText.trim() !== "" && newQuoteAuthor.trim() !== "") {
            const newQuote = {
                id: (quotes.length + 1).toString(),
                text: newQuoteText,
                author: newQuoteAuthor,
                approved: false,
            };
            console.log(newQuote);
            try {
                const response = await axios.post('http://localhost:3003/api/quotes', newQuote);
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

    useEffect(() => {
        const fetchJokes = async () => {
            try {
                const response = await axios.get('http://localhost:3003/api/quotes');
                setQuotes(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchJokes();
    }, []);

    const handleApproveQuote = async (quoteId: string) => {
        // setQuotes(quotes.map((quote) => (quote.id === quoteId ? { ...quote, approved: true } : quote)));
        
        try {
            const response = await axios.put(`http://localhost:3003/api/quotes/${quoteId}`, { approved: true }, {
                headers: {
                  'Authorization': `Bearer ${token}`  // Authorization header with the token
                }
              })

            // Assuming the updated quote data is returned in response.data
            const updatedQuote = response.data;

            // Update the quotes state with the new approved status
            setQuotes((quotes) => quotes.map((quote) =>
                quote.id === quoteId ? { ...quote, approved: true } : quote
            ));

            return updatedQuote;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteQuote = async(quoteId: string) => {
        try {
            const response = await axios.delete(`http://localhost:3003/api/quotes/${quoteId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setQuotes(quotes.filter((quote) => quote.id !== quoteId));
          } catch (error: any) {
            console.error('Error deleting the quote:', error.response?.data || error.message);
          }
    };

    return (
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
    )
}
export default AdminView;