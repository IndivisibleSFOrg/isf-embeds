import Papa from 'papaparse';
import { parseCsvDate } from '~/composables/dateHelpers';

// CountdownItem represents the structured data used in the application, while
// CountdownCSVItem represents the raw data format from the CSV. The
// toCountdownItem function transforms the raw CSV data into the structured
// format, including parsing the date field; rows with an unrecognised date
// format are dropped (logged to console). The fetchCountdownItems function
// retrieves the CSV data from the Google Sheet, parses it, and returns an
// array of CountdownItem objects.

export interface ImageAttribution {
  name: string;
  url: string;
}

export interface CountdownItem {
  date: Date;
  details: string;
  headline: string;
  image_attributions: ImageAttribution[];
  image_back_url: string;
  image_front_url: string;
  labels: string[];
  link_text: string;
  link_url: string;
  social_message: string;
}

export interface CountdownCSVItem {
  date: string;
  details: string;
  headline: string;
  image_attributions: string;
  image_back_url: string;
  image_front_url: string;
  labels: string;
  link_text: string;
  link_url: string;
  social_message: string;
}

const parseImageAttributions = (raw: string): ImageAttribution[] => {
  if (!raw) return [];
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      // Format: https://example.com/photo (Author Name)
      const match = line.match(/^(.+?)\s+\((.+)\)$/);
      if (match) {
        return { url: match[1].trim(), name: match[2].trim() };
      }
      // Fallback: treat the whole line as a URL with no name
      return { url: line, name: '' };
    });
};

export const toCountdownItem = (item: CountdownCSVItem): CountdownItem | null => {
  const date = parseCsvDate(item.date);
  if (date === null) return null;
  return {
    date,
    details: item.details || '',
    headline: item.headline,
    image_attributions: parseImageAttributions(item.image_attributions || ''),
    image_back_url: item.image_back_url || item.image_front_url,
    image_front_url: item.image_front_url,
    labels: item.labels ? item.labels.split(',').map(l => l.trim().toLowerCase()).filter(Boolean) : [],
    link_text: item.link_text || 'Learn more',
    link_url: item.link_url || '#',
    social_message: item.social_message || '',
  };
};

export async function fetchCountdownItems(): Promise<CountdownItem[]> {
  const { public: { sheetUrl } } = useRuntimeConfig();
  try {
    const response = await fetch(sheetUrl, { 
      cache: 'no-cache',
      redirect: 'follow'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<CountdownCSVItem>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(
            results.data
              .map((item) => toCountdownItem(item))
              .filter((item): item is CountdownItem => item !== null)
          );
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    return [];
  }
}
