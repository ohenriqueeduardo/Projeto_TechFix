import { getLocalOrders } from './localDb';

export const calculateUserLevelInfo = (userId: string, fetchedOrders?: any[]) => {
  const orders = fetchedOrders || getLocalOrders();
  const completedOrders = orders.filter(o => o.clientId === userId && o.status === 'completed');
  const count = completedOrders.length;

  const tiers = [
    { name: 'Bronze', threshold: 0, next: 'Silver', nextThreshold: 2 },
    { name: 'Silver', threshold: 2, next: 'Gold', nextThreshold: 5 },
    { name: 'Gold', threshold: 5, next: 'Platinum', nextThreshold: 10 },
    { name: 'Platinum', threshold: 10, next: 'Adamantium', nextThreshold: 20 },
    { name: 'Adamantium', threshold: 20, next: null, nextThreshold: null }
  ];

  let currentTier = tiers[0];
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (count >= tiers[i].threshold) {
      currentTier = tiers[i];
      break;
    }
  }

  let progressPercent = 100;
  let remainingToNext = 0;

  if (currentTier.nextThreshold !== null) {
    const range = currentTier.nextThreshold - currentTier.threshold;
    const progress = count - currentTier.threshold;
    progressPercent = (progress / range) * 100;
    remainingToNext = currentTier.nextThreshold - count;
  }

  return {
    level: currentTier.name,
    completedCount: count,
    nextLevel: currentTier.next,
    progressPercent,
    remainingToNext
  };
};
