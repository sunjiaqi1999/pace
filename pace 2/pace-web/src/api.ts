import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface CardData {
  energy: 'high' | 'medium' | 'low';
  emotion: string;
  inclination: string;
}

export interface PersonalityCard {
  name: string;
  description: string;
  summary: string;
  advice: string;
  energyLevel: string;
  moodType: string;
  focusLevel: string;
}

export interface StoredCard extends PersonalityCard {
  id: string;
  date: string;
  energy: string;
  emotion: string;
  inclination: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export async function generateCard(data: CardData): Promise<PersonalityCard> {
  try {
    const response = await api.post('/generate-card', data);
    return response.data;
  } catch (error) {
    console.error('Failed to generate card:', error);
    throw error;
  }
}

export async function getAdvice(data: CardData & { context?: string }) {
  try {
    const response = await api.post('/get-advice', data);
    return response.data.advice;
  } catch (error) {
    console.error('Failed to get advice:', error);
    throw error;
  }
}

export async function analyzeWeekly(weeklyData: any[]) {
  try {
    const response = await api.post('/analyze', { weeklyData });
    return response.data;
  } catch (error) {
    console.error('Failed to analyze weekly data:', error);
    throw error;
  }
}

export function saveCardLocally(card: PersonalityCard, energy: string, emotion: string, inclination: string) {
  const storedCard = {
    ...card,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    energy,
    emotion,
    inclination,
  };

  const cards = getStoredCards();
  cards.push(storedCard);
  localStorage.setItem('pace_cards', JSON.stringify(cards));
  
  return storedCard;
}

export function getStoredCards() {
  const stored = localStorage.getItem('pace_cards');
  return stored ? JSON.parse(stored) : [];
}

export function getTodayCard() {
  const cards = getStoredCards();
  const today = new Date().toDateString();
  
  return cards.find(card => new Date(card.date).toDateString() === today) || null;
}

export function deleteCard(id: string) {
  const cards = getStoredCards();
  const filtered = cards.filter(card => card.id !== id);
  localStorage.setItem('pace_cards', JSON.stringify(filtered));
}

export function getMonthlyCards(year: number, month: number) {
  const cards = getStoredCards();
  return cards.filter(card => {
    const date = new Date(card.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}
