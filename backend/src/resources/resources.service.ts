import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ResourcesService {
    private readonly apiKey: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('GOOGLE_API_KEY') || '';
    }

    async searchYouTube(query: string) {
        const url = `https://www.googleapis.com/youtube/v3/search`;
        try {
            const response = await axios.get(url, {
                params: {
                    part: 'snippet',
                    q: query + ' educational lecture',
                    type: 'video',
                    maxResults: 5,
                    key: this.apiKey,
                },
            });
            return response.data.items.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.medium.url,
                url: `https://www.youtube.com/watch?v={item.id.videoId}`,
            }));
        } catch (error) {
            console.error('YouTube API Error:', error.response?.data || error.message);
            return [];
        }
    }

    async searchGoogleBooks(query: string) {
        const url = `https://www.googleapis.com/books/v1/volumes`;
        try {
            const response = await axios.get(url, {
                params: {
                    q: query,
                    maxResults: 5,
                    key: this.apiKey,
                },
            });
            return response.data.items?.map((item: any) => ({
                id: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors,
                description: item.volumeInfo.description,
                thumbnail: item.volumeInfo.imageLinks?.thumbnail,
                link: item.volumeInfo.infoLink,
            })) || [];
        } catch (error) {
            console.error('Google Books API Error:', error.response?.data || error.message);
            return [];
        }
    }

    async getWikipediaSummary(query: string) {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'WizLearn/1.0 (academic assistant)'
                }
            });
            return {
                title: response.data.title,
                extract: response.data.extract,
                thumbnail: response.data.thumbnail?.source,
                content_urls: response.data.content_urls?.desktop?.page,
            };
        } catch (error) {
            console.error('Wikipedia API Error:', error.message);
            return null;
        }
    }
}
