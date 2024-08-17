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
import Link from 'next/link'

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

    const handleDeleteQuote = async (quoteId: string) => {
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
        <div className="flex flex-col items-end gap-4 ml-40 justify-center h-screen w-max relative">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl  bg-[#758694]">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <Tabs defaultValue="quotes">
                    <TabsList className='bg-[#405D72]'>
                        <TabsTrigger value="quotes" className='text-[#F3F7EC]'>Quotes</TabsTrigger>
                        <TabsTrigger value="new-quote" className='text-[#F3F7EC]'>New Quote</TabsTrigger>
                    </TabsList>
                    <TabsContent value="quotes">
                        <Table>
                            <TableHeader>
                                <TableRow >
                                    <TableHead  className='text-[#000]'>ID</TableHead>
                                    <TableHead  className='text-[#000]'>Quote</TableHead>
                                    <TableHead  className='text-[#000]'>Author</TableHead>
                                    <TableHead  className='text-[#000]'>Approved</TableHead>
                                    <TableHead  className='text-[#000]'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotes.map((quote ,index) => (
                                    <TableRow key={quote.id} className='font-medium'>
                                        <TableCell className='font-bold'>{index+1}</TableCell>
                                        <TableCell className='font-bold'>{quote.text}</TableCell>
                                        <TableCell className='font-bold'>{quote.author}</TableCell>
                                        <TableCell>
                                            {quote.approved ? (
                                                <Badge variant="default" className='rounded-md h-8'>Approved</Badge>
                                            ) : (
                                                <Badge variant="destructive" className='rounded-md h-8'>Pending</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className='items-start justify-start flex gap-2'>
                                            {!quote.approved && (
                                                <Button onClick={() => handleApproveQuote(quote.id)} variant="outline" size="sm" className='bg-[#7F9F80]'>
                                                    Approve
                                                    <img src='/icons/tick.svg' className='ml-2 h-4 w-4'/>
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => handleDeleteQuote(quote.id)}
                                                variant="outline"
                                                size="sm"
                                                className="bg-[#9B4444]"
                                            >
                                                Delete
                                                <img src='/icons/delete.svg' className='ml-2 h-4 w-4'/>
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
            <Button>
            <Link href='/' className='flex float-end'>Logout</Link>
            </Button>
            
        </div>
    )
}
export default AdminView;