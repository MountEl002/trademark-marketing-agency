import TransactionList from "@/components/customer/TransactionList";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h3 className="bg-gray-50 w-full p-3 rounded-sm">Transaction History</h3>
      <TransactionList />
    </div>
  );
}
