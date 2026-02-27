import Papa from 'papaparse';
import { parseCsvDate } from '~/composables/dateHelpers';

// CountdownItem represents the structured data used in the application, while
// CountdownCSVItem represents the raw data format from the CSV. The
// toCountdownItem function transforms the raw CSV data into the structured
// format, including parsing the date field; rows with an unrecognised date
// format are dropped (logged to console). The fetchCountdownItems function
// retrieves the CSV data from the Google Sheet, parses it, and returns an
// array of CountdownItem objects.

export interface CountdownItem {
  action: string;
  details: string;
  link_url: string;
  link_text: string;
  date: Date;
  image: string;
  headline: string;
}

export interface CountdownCSVItem {
  headline: string;
  details: string;
  link_url: string;
  link: string;
  date: string;
  image: string;
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1kG5tVKYaz6Wny2wIZKmbhloD_3Bwl5NeqsPNNGxcHIA/export?format=csv';

export const toCountdownItem = (item: CountdownCSVItem): CountdownItem | null => {
  const date = parseCsvDate(item.date);
  if (date === null) return null;
  return {
    action: item.headline,
    details: item.details || '',
    link_url: item.link_url || '#',
    link_text: item.link || 'Learn more',
    date,
    image: item.image,
    headline: item.headline,
  };
};

export async function fetchCountdownItems(): Promise<CountdownItem[]> {
  try {
    const response = await fetch(SHEET_URL, { 
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
