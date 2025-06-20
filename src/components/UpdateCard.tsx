import { Calendar, Clock, Tag, Star, Play } from 'lucide-react';

interface OTTUpdate {
    title: string;
    releasePlatform: string;
    youtubeLink: string;
    releaseDate: string;
}

const platforms = [
    { name: 'Netflix', color: '#E50914', icon: 'play' },
    { name: 'Disney+', color: '#113CCF', icon: 'star' },
    { name: 'Prime Video', color: '#00A8E1', icon: 'video' },
    { name: 'Apple TV+', color: '#000000', icon: 'apple' },
    { name: 'HBO Max', color: '#7B2CBF', icon: 'crown' },
    { name: 'Hulu', color: '#1CE783', icon: 'tv' },
    { name: 'JioCinema', color: '#8B5CF6', icon: 'film' },
    { name: 'JioHotstar', color: '#8B5CF6', icon: 'film' },
    { name: 'SonyLIV', color: '#FF6B35', icon: 'monitor' },
    { name: 'ZEE5', color: '#6366F1', icon: 'zap' },
];

function UpdateCard({ update }: { update: OTTUpdate }) {
    const platform = platforms.find(p => p.name === update.releasePlatform);

    return (
        <article className="gradient-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
            <div className="relative overflow-hidden">
                <iframe
                    src={update.youtubeLink}
                    title={update.title}
                    className="w-full h-56 object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                >
                </iframe>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-bold line-clamp-2 transition-colors flex-1 mr-2">
                        {update.title}
                    </h3>
                </div>
                <div
                    className="px-3 inline-flex py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm"
                    style={{ backgroundColor: platform?.color || '#6B7280' }}
                >
                    {update.releasePlatform}
                </div>
                <div className="mt-8 p-3 rounded-lg border">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-semibold text-teal-500">Release Date:</span>
                        <span className="text-sm text-teal-400">{update.releaseDate}</span>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default UpdateCard