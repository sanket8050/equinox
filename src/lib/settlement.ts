interface SettlementTransaction {
  from: string
  to: string
  amount: string
  fromName: string
  toName: string
}

interface MemberBalance {
  userId: string
  userName: string
  balance: number
}

/**
 * Smart settlement algorithm that minimizes the number of transactions
 * needed to settle all balances using a debt optimization approach
 */
export function calculateSettlement(members: MemberBalance[]): SettlementTransaction[] {
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = members
    .filter(m => m.balance > 0)
    .map(m => ({ ...m, balance: m.balance }))
    .sort((a, b) => b.balance - a.balance)

  const debtors = members
    .filter(m => m.balance < 0)
    .map(m => ({ ...m, balance: Math.abs(m.balance) }))
    .sort((a, b) => b.balance - a.balance)

  const settlements: SettlementTransaction[] = []
  let creditorIndex = 0
  let debtorIndex = 0

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex]
    const debtor = debtors[debtorIndex]

    const settlementAmount = Math.min(creditor.balance, debtor.balance)

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: settlementAmount.toFixed(2),
      fromName: debtor.userName,
      toName: creditor.userName
    })

    // Update remaining balances
    creditor.balance -= settlementAmount
    debtor.balance -= settlementAmount

    // Move to next creditor or debtor if current one is settled
    if (creditor.balance === 0) {
      creditorIndex++
    }
    if (debtor.balance === 0) {
      debtorIndex++
    }
  }

  return settlements
}

/**
 * Calculate total group balance (should be 0 for a settled group)
 */
export function calculateTotalBalance(members: MemberBalance[]): number {
  return members.reduce((total, member) => total + member.balance, 0)
}

/**
 * Check if group is already settled
 */
export function isGroupSettled(members: MemberBalance[]): boolean {
  return members.every(member => Math.abs(member.balance) < 0.01) // Account for floating point precision
}
