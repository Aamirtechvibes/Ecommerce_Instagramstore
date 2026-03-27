export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

interface StatusTransition {
  from: OrderStatus;
  to: OrderStatus;
}

const VALID_TRANSITIONS: StatusTransition[] = [
  { from: 'pending', to: 'confirmed' },
  { from: 'confirmed', to: 'shipped' },
  { from: 'shipped', to: 'delivered' },
];

export const canTransitionStatus = (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
  if (currentStatus === newStatus) {
    return false;
  }

  return VALID_TRANSITIONS.some(
    (transition) => transition.from === currentStatus && transition.to === newStatus
  );
};

export const getNextAllowedStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  return VALID_TRANSITIONS
    .filter((transition) => transition.from === currentStatus)
    .map((transition) => transition.to);
};

export const validateStatusTransition = (currentStatus: OrderStatus, newStatus: OrderStatus): void => {
  if (!canTransitionStatus(currentStatus, newStatus)) {
    throw new Error(
      `Invalid status transition from "${currentStatus}" to "${newStatus}". ` +
      `Allowed transitions: ${getNextAllowedStatuses(currentStatus).join(', ') || 'none'}`
    );
  }
};
