import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import UpdateCard from '@/components/UpdateCard';

interface OTTUpdate {
    title: string;
    releasePlatform: string;
    youtubeLink: string;
    releaseDate: string;
}

const fetchOptions = {
    headers: {
        "Content-Type": "application/json",
    },
};

function OTTUpdates() {
    const [ottData, setOttData] = useState([])
    const url = import.meta.env.VITE_OTT_SCRAPE_URL
    const fetchOTT = async () => {
        try {
            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setOttData(JSON.parse(data))
        } catch (error) {
            console.error("API fetch error:", error);
            throw error;
        }
    }

    useEffect(() => {
        fetchOTT()
    }, [])

    return (
        <>
            <Header />
            <main className="container py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">
                    OTT updates this week
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {ottData.map((update: OTTUpdate, index: number) => (
                        <UpdateCard key={index} update={update} />
                    ))}
                </div>
            </main>
        </>
    )
}

export default OTTUpdates